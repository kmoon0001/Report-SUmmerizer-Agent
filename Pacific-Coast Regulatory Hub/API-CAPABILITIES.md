# API Capabilities for Copilot Studio Fixes

**Question:** Can we do all our work through the API?

**Answer:** Yes, technically - but with important caveats.

---

## ✅ What's Possible via API

### Dataverse Web API
Copilot Studio stores all components in Dataverse `botcomponent` table:

```powershell
# Query topics
GET https://orgbd048f00.crm.dynamics.com/api/data/v9.2/botcomponents
  ?$filter=parentbotid eq {AgentId} and componenttype eq 0
  &$select=botcomponentid,name,content,data

# Update topic
PATCH https://orgbd048f00.crm.dynamics.com/api/data/v9.2/botcomponents({id})
{
  "content": "...updated YAML..."
}
```

### PAC CLI
```powershell
# Publish agent
pac copilot publish --environment {env-id} --bot {bot-id}

# Check status
pac copilot status --environment {env-id} --bot {bot-id}

# List copilots
pac copilot list --environment {env-id}
```

---

## ⚠️ Challenges with API Approach

### 1. YAML Complexity
The `content` field contains full YAML:
- Must parse YAML correctly
- Must maintain exact structure
- Must preserve all node IDs and references
- Risk of syntax errors breaking topics

### 2. No Built-in Validation
- API doesn't validate YAML before save
- Broken YAML = broken topic
- No rollback mechanism
- Hard to debug issues

### 3. Dependencies
- Topics reference each other
- Flow IDs must exist
- Entity references must be valid
- No automatic dependency checking

### 4. Authentication
- Requires Dataverse access token
- Token management complexity
- Permission requirements

---

## 🎯 Recommended Approaches

### Option 1: Browser UI (Safest) ⭐
**Best for:** Manual fixes, one-time changes

**Pros:**
- Visual confirmation
- Built-in validation
- No risk of corruption
- Immediate feedback

**Cons:**
- Manual work required
- Time-consuming for many changes

**How to:**
```powershell
.\scripts\Auto-Fix-All.ps1
# Or follow: EXECUTE-FIXES-NOW.md
```

### Option 2: VS Code Extension (Recommended) ⭐⭐
**Best for:** Iterative development, version control

**Pros:**
- Edit local .mcs.yml files
- Extension handles Apply/sync
- Automatic validation
- Git-friendly

**Cons:**
- Requires extension setup
- Still some manual steps

**How to:**
1. Edit `.mcs.yml` files locally
2. Use extension: "Apply to tenant"
3. Publish from UI or CLI

### Option 3: Direct API (Advanced) ⚠️
**Best for:** Automation at scale, CI/CD pipelines

**Pros:**
- Fully automated
- Scriptable
- Fast for bulk changes

**Cons:**
- Complex YAML handling
- Risk of errors
- Requires validation logic
- Hard to debug

**How to:**
```powershell
.\scripts\Fix-Via-API.ps1  # Exploration script
# Then build custom automation
```

---

## 📊 Comparison Matrix

| Feature | Browser UI | VS Code Ext | Direct API |
|---------|-----------|-------------|------------|
| Safety | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Speed | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Validation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| Automation | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Learning Curve | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Debugging | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## 🔧 API Implementation Example

If you want to build API automation, here's the structure:

```powershell
# 1. Get access token
$token = Get-DataverseAccessToken

# 2. Query topic
$topic = Invoke-RestMethod `
  -Uri "$dataverseUrl/api/data/v9.2/botcomponents?filter=..." `
  -Headers @{ Authorization = "Bearer $token" }

# 3. Parse YAML
$yaml = ConvertFrom-Yaml $topic.content

# 4. Modify YAML
$yaml.outputType = @{
  properties = @{
    ProcessingStatus = @{
      displayName = "ProcessingStatus"
      type = "String"
    }
  }
}

# 5. Convert back to YAML
$newContent = ConvertTo-Yaml $yaml

# 6. Update via API
Invoke-RestMethod `
  -Uri "$dataverseUrl/api/data/v9.2/botcomponents($($topic.botcomponentid))" `
  -Method PATCH `
  -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body (@{ content = $newContent } | ConvertTo-Json)

# 7. Publish
pac copilot publish --environment $envId --bot $botId
```

**Required:**
- PowerShell YAML module: `Install-Module powershell-yaml`
- Careful YAML structure preservation
- Extensive testing

---

## 💡 Our Recommendation for This Project

**Use Browser UI Method** (Option 1)

**Why:**
1. **One-time fixes** - Not building CI/CD pipeline
2. **Safety first** - Production agent, can't risk breaking
3. **Visual confirmation** - See changes before applying
4. **Time-efficient** - 75-90 minutes vs days building API automation
5. **No risk** - Built-in validation prevents errors

**When to use API:**
- Building automated deployment pipeline
- Managing 10+ agents
- Frequent repetitive changes
- CI/CD integration needed

---

## 🚀 Quick Start

**For this project, run:**

```powershell
# Guided browser-based fixes
.\scripts\Auto-Fix-All.ps1

# Or follow manual guide
# Open: EXECUTE-FIXES-NOW.md
```

**To explore API capabilities:**

```powershell
# See what's possible
.\scripts\Fix-Via-API.ps1
```

---

## 📚 References

- [Dataverse Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview)
- [botcomponent table reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/botcomponent)
- [PAC CLI reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/copilot)
- [Copilot Studio extension](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.powerplatform-vscode)

---

## ✅ Conclusion

**Yes, we CAN do everything via API**, but for this specific project:

- **Browser UI is the right choice**
- **Safer, faster, and more reliable**
- **API is overkill for one-time fixes**
- **Save API automation for future CI/CD needs**

**Let's proceed with the browser method!** 🚀
