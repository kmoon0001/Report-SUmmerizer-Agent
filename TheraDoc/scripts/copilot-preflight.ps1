param(
    [string]$Root = "."
)

$ErrorActionPreference = "Stop"
$failed = $false

function Write-Section {
    param([string]$Name)
    Write-Host ""
    Write-Host "== $Name =="
}

function Fail-Step {
    param([string]$Message)
    Write-Host "FAIL: $Message" -ForegroundColor Red
    $script:failed = $true
}

function Pass-Step {
    param([string]$Message)
    Write-Host "PASS: $Message" -ForegroundColor Green
}

Write-Section "Workspace"
$resolvedRoot = (Resolve-Path $Root).Path
Write-Host "Root: $resolvedRoot"

Write-Section "Conflict Marker Scan"
$rg = Get-Command rg -ErrorAction SilentlyContinue
if ($rg) {
    $markers = & rg -uu -n "^(<<<<<<< |=======|>>>>>>> )" -S $resolvedRoot 2>$null
    if ($LASTEXITCODE -eq 0 -and $markers) {
        Fail-Step "Found unresolved merge markers."
        $markers | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
    } else {
        Pass-Step "No unresolved merge markers found."
    }
} else {
    $matches = Get-ChildItem -Path $resolvedRoot -Recurse -File | Select-String -Pattern "^(<<<<<<< |=======|>>>>>>> )"
    if ($matches) {
        Fail-Step "Found unresolved merge markers."
        $matches | Select-Object -First 50 | ForEach-Object { Write-Host "$($_.Path):$($_.LineNumber):$($_.Line)" }
    } else {
        Pass-Step "No unresolved merge markers found."
    }
}

Write-Section "YAML Parse (.mcs.yml)"
$yamlCheck = @'
import glob, yaml, sys
bad = []
files = glob.glob("**/*.mcs.yml", recursive=True)
for p in files:
    try:
        with open(p, "r", encoding="utf-8") as f:
            yaml.safe_load(f)
    except Exception as e:
        bad.append((p, str(e)))
print(f"TOTAL_MCS_YML={len(files)}")
if bad:
    print(f"BAD_COUNT={len(bad)}")
    for p, e in bad[:50]:
        print(f"BAD {p}: {e}")
    sys.exit(1)
print("YAML_OK")
'@

try {
    $yamlOut = @"
$yamlCheck
"@ | python - 2>&1
    if ($LASTEXITCODE -ne 0) {
        Fail-Step "YAML parse failed."
        $yamlOut | ForEach-Object { Write-Host $_ }
    } else {
        Pass-Step "YAML parse passed."
        $yamlOut | ForEach-Object { Write-Host $_ }
    }
} catch {
    Fail-Step "Python/YAML validation could not run: $($_.Exception.Message)"
}

Write-Section "Empty File Check (.mcs.yml)"
$emptyMcs = Get-ChildItem -Path $resolvedRoot -Recurse -File -Filter *.mcs.yml | Where-Object { $_.Length -eq 0 }
if ($emptyMcs) {
    Fail-Step "Found empty .mcs.yml files."
    $emptyMcs | Select-Object -First 50 | ForEach-Object { Write-Host $_.FullName }
} else {
    Pass-Step "No empty .mcs.yml files found."
}

Write-Section "Stub Content Check (.mcs.yml)"
$stubMcs = Get-ChildItem -Path $resolvedRoot -Recurse -File -Filter *.mcs.yml | Where-Object {
    ($text = (Get-Content -LiteralPath $_.FullName -Raw).Trim()) -eq "{}"
}
if ($stubMcs) {
    Fail-Step "Found stub-only .mcs.yml files. These can cause invalid content or stale compile issues."
    $stubMcs | Select-Object -First 50 | ForEach-Object { Write-Host $_.FullName }
} else {
    Pass-Step "No stub-only .mcs.yml files found."
}

Write-Section "Flow Mapping Check"
$flowRefScript = @'
import glob, os, re, sys

flow_ref = re.compile(r'^\s*flowId:\s*([0-9a-fA-F-]{36})\s*$')
wf_id = re.compile(r'([0-9a-fA-F-]{36})$')

flow_refs = {}
for p in glob.glob("actions/*.mcs.yml") + glob.glob("topics/*.mcs.yml"):
    with open(p, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            m = flow_ref.match(line)
            if m:
                flow_refs.setdefault(m.group(1).lower(), []).append((p, i))

workflow_ids = set()
for d in glob.glob("workflows/*"):
    if os.path.isdir(d):
        base = os.path.basename(d)
        m = wf_id.search(base)
        if m:
            workflow_ids.add(m.group(1).lower())

missing = []
for fid, refs in flow_refs.items():
    if fid not in workflow_ids:
        for p, i in refs:
            missing.append((fid, p, i))

if missing:
    print(f"MISSING_FLOW_FOLDERS={len(missing)}")
    for fid, p, i in missing[:100]:
        print(f"MISSING {fid} -> {p}:{i}")
    sys.exit(1)

print("FLOW_MAPPING_OK")
'@

try {
    $flowOut = @"
$flowRefScript
"@ | python - 2>&1
    if ($LASTEXITCODE -ne 0) {
        Fail-Step "One or more flowId references do not have a matching workflows/*-<flowId> folder."
        $flowOut | ForEach-Object { Write-Host $_ }
    } else {
        Pass-Step "All flowId references have matching local workflow folders."
        $flowOut | ForEach-Object { Write-Host $_ }
    }
} catch {
    Fail-Step "Flow mapping validation could not run: $($_.Exception.Message)"
}

Write-Section "Action/Topic Binding Contract Check"
$bindingContractScript = @'
import glob, json, os, re, sys, yaml

def load_yaml(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for i in node:
            yield from walk(i)

workflow_io = {}
wf_id_pattern = re.compile(r"([0-9a-fA-F-]{36})$")

for d in glob.glob("workflows/*"):
    if not os.path.isdir(d):
        continue
    m = wf_id_pattern.search(os.path.basename(d))
    if not m:
        continue
    flow_id = m.group(1).lower()
    wf_path = os.path.join(d, "workflow.json")
    if not os.path.exists(wf_path):
        continue

    with open(wf_path, "r", encoding="utf-8-sig") as f:
        wf = json.load(f)

    definition = wf.get("properties", {}).get("definition", {})
    inputs = set(
        (definition.get("triggers", {})
                  .get("manual", {})
                  .get("inputs", {})
                  .get("schema", {})
                  .get("properties", {}) or {}).keys()
    )

    outputs = set()
    for action in (definition.get("actions", {}) or {}).values():
        if action.get("type") == "Response" and action.get("kind") == "Skills":
            outputs = set(
                (action.get("inputs", {})
                       .get("schema", {})
                       .get("properties", {}) or {}).keys()
            )
            break

    workflow_io[flow_id] = {"inputs": inputs, "outputs": outputs}

action_map = {}
errors = []

for action_file in glob.glob("actions/*.mcs.yml"):
    action_name = os.path.basename(action_file).replace(".mcs.yml", "")
    action_yml = load_yaml(action_file)
    flow_id = ((action_yml.get("action") or {}).get("flowId") or "").lower()
    outputs = {
        o.get("propertyName")
        for o in (action_yml.get("outputs") or [])
        if isinstance(o, dict) and o.get("propertyName")
    }
    action_map[action_name] = {
        "file": action_file,
        "flowId": flow_id,
        "outputs": outputs
    }

    if flow_id and flow_id in workflow_io:
        bad_action_outputs = sorted(outputs - workflow_io[flow_id]["outputs"])
        if bad_action_outputs:
            errors.append(
                f"ACTION_OUTPUT_MISMATCH {action_file} flow={flow_id} invalid={bad_action_outputs} expected={sorted(workflow_io[flow_id]['outputs'])}"
            )

for topic_file in glob.glob("topics/*.mcs.yml"):
    topic_yml = load_yaml(topic_file)
    for node in walk(topic_yml):
        if not isinstance(node, dict):
            continue
        if node.get("kind") != "BeginDialog":
            continue
        dialog = node.get("dialog")
        if not isinstance(dialog, str) or not dialog.startswith("pcca_agent.action."):
            continue

        action_name = dialog.split("pcca_agent.action.", 1)[1]
        if action_name not in action_map:
            errors.append(f"MISSING_ACTION {topic_file} dialog={dialog}")
            continue

        flow_id = action_map[action_name]["flowId"]
        if flow_id not in workflow_io:
            errors.append(f"MISSING_WORKFLOW_SCHEMA {topic_file} action={action_name} flow={flow_id}")
            continue

        expected_inputs = workflow_io[flow_id]["inputs"]
        expected_outputs = workflow_io[flow_id]["outputs"]

        in_binding = ((node.get("input") or {}).get("binding") or {})
        out_binding = ((node.get("output") or {}).get("binding") or {})
        in_keys = set(in_binding.keys()) if isinstance(in_binding, dict) else set()
        out_keys = set(out_binding.keys()) if isinstance(out_binding, dict) else set()

        bad_inputs = sorted(in_keys - expected_inputs)
        bad_outputs = sorted(out_keys - expected_outputs)

        if bad_inputs:
            errors.append(
                f"INVALID_INPUT_BINDING {topic_file} action={action_name} flow={flow_id} invalid={bad_inputs} expected={sorted(expected_inputs)}"
            )
        if bad_outputs:
            errors.append(
                f"INVALID_OUTPUT_BINDING {topic_file} action={action_name} flow={flow_id} invalid={bad_outputs} expected={sorted(expected_outputs)}"
            )

if errors:
    print(f"BINDING_CONTRACT_ERRORS={len(errors)}")
    for err in errors[:200]:
        print(err)
    sys.exit(1)

print("BINDING_CONTRACT_OK")
'@

try {
    $bindingOut = @"
$bindingContractScript
"@ | python - 2>&1
    if ($LASTEXITCODE -ne 0) {
        Fail-Step "Binding contract validation failed."
        $bindingOut | ForEach-Object { Write-Host $_ }
    } else {
        Pass-Step "Action/topic binding contracts match workflow schemas."
        $bindingOut | ForEach-Object { Write-Host $_ }
    }
} catch {
    Fail-Step "Binding contract validation could not run: $($_.Exception.Message)"
}

Write-Section "Workflow Secret/Placeholder Check"
$workflowJsons = Get-ChildItem -Path (Join-Path $resolvedRoot "workflows") -Recurse -File -Filter workflow.json -ErrorAction SilentlyContinue
if (-not $workflowJsons) {
    Fail-Step "No workflow.json files found under workflows/."
} else {
    $badPatterns = @(
        "YOUR-AZURE-OPENAI-KEY",
        "YOUR-RESOURCE-NAME.openai.azure.com",
        '"api-key"\s*:\s*".+"'
    )
    $hits = @()
    foreach ($wf in $workflowJsons) {
        $text = Get-Content -Path $wf.FullName -Raw
        foreach ($p in $badPatterns) {
            if ($text -match $p) {
                $hits += "$($wf.FullName) => pattern: $p"
            }
        }
    }
    if ($hits.Count -gt 0) {
        Fail-Step "Workflow JSON contains placeholder or inline secret patterns."
        $hits | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
    } else {
        Pass-Step "No placeholder secrets/endpoints found in workflow JSON."
    }
}

Write-Section "Connection File Check"
$connPath = Join-Path $resolvedRoot ".mcs\\conn.json"
if (-not (Test-Path $connPath)) {
    Fail-Step "Missing .mcs\\conn.json"
} else {
    try {
        $connRaw = Get-Content $connPath -Raw
        $conn = $connRaw | ConvertFrom-Json
        if (-not $conn.EnvironmentId -or -not $conn.AgentId) {
            Fail-Step "conn.json missing EnvironmentId or AgentId."
        } else {
            Pass-Step "conn.json has EnvironmentId and AgentId."
            Write-Host "EnvironmentId: $($conn.EnvironmentId)"
            Write-Host "AgentId: $($conn.AgentId)"
        }
    } catch {
        Fail-Step "conn.json is not valid JSON."
    }
}

Write-Section "Result"
if ($failed) {
    Write-Host "Preflight failed." -ForegroundColor Red
    exit 1
}

Write-Host "Preflight passed." -ForegroundColor Green
exit 0
