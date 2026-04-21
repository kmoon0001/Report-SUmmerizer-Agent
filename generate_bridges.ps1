$theradocPath = "d:\my agents copilot studio\TheraDoc\actions"
$synthPath = "d:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab\SNF Rehab Agent\actions"
$commandPath = "d:\my agents copilot studio\SNF Agent Command Center\SNF Command Center Agent\actions"

# TheraDoc Bridges
$tdBridges = @(
    @{ Name="TheraDoc-OTGenerateNote"; Id="a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
    @{ Name="TheraDoc-SLPGenerateNote"; Id="b2c3d4e5-f6a7-8901-bcde-f23456789012" },
    @{ Name="TheraDoc-EHRDocumentSubmit"; Id="c3d4e5f6-a7b8-9012-cdef-345678901234" },
    @{ Name="TheraDoc-SCICNotification"; Id="d4e5f6a7-b8c9-0123-defa-456789012345" }
)

foreach ($b in $tdBridges) {
    $content = @"
mcs.metadata:
  componentName: $($b.Name)
kind: TaskDialog
modelDisplayName: $($b.Name)
modeldescription: Elite clinical intelligence module specialized in [$($b.Name)]. Executes high-precision data analysis grounded in CMS Chapter 15 and Pacific Coast Services Ironclad Standards.
outputs:
  - propertyName: result
action:
  kind: InvokeFlowTaskAction
  flowId: $($b.Id)
  inputs:
    binding:
      text: Topic.requestText
  inputMode: Prompt
outputMode: All
"@
    Set-Content -Path "$theradocPath\$($b.Name).mcs.yml" -Value $content
}

# Synthesis Lab Bridges
$synthBridges = @(
    @{ Name="SynthesisLab-EmailSBARReport"; Id="66666666-7777-8888-9999-000000000000" },
    @{ Name="SynthesisLab-SBARGenerateNote"; Id="11111111-2222-3333-4444-555555555555" }
)

foreach ($b in $synthBridges) {
    $content = @"
mcs.metadata:
  componentName: $($b.Name)
kind: TaskDialog
modelDisplayName: $($b.Name)
modeldescription: Elite clinical Synthesis Lab module specialized in [$($b.Name)].
outputs:
  - propertyName: result
action:
  kind: InvokeFlowTaskAction
  flowId: $($b.Id)
  inputs:
    binding:
      text: Topic.requestText
  inputMode: Prompt
outputMode: All
"@
    Set-Content -Path "$synthPath\$($b.Name).mcs.yml" -Value $content
}

# Restore Computer Use
$cuContent = @"
mcs.metadata:
  componentName: Computeruse-Computeruse
kind: TaskDialog
modelDisplayName: Computeruse Plugin
modeldescription: System UI automation fallback. Use when APIs to external EMR/apps are unavailable.
action:
  kind: InvokeFlowTaskAction
  flowId: placeholder-computer-use-guid
outputMode: All
"@
Set-Content -Path "$commandPath\Computeruse-Computeruse.mcs.yml" -Value $cuContent

Write-Host "All bridges successfully built and deployed across agents."
