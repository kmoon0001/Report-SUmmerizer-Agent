# Create-SharePointLists.ps1
# Creates SLP SharePoint lists and document library using interactive MSAL auth

param(
    [string]$SiteUrl = "https://ensignservices.sharepoint.com/sites/PacificCoast_SLP"
)

$ErrorActionPreference = "Stop"

# --- Auth ---
Import-Module MSAL.PS

# Use the well-known SharePoint Online Client Extensibility app ID
# This is a Microsoft first-party app that all tenants trust - no app registration needed
$clientId = "9bc3ab49-b65d-410a-85ad-de819febfddc"
$tenantId = "03cc92c3-986c-4cf4-ae27-1478cf99d17f"
$resource  = "https://ensignservices.sharepoint.com"

Write-Host "Opening login window - sign in with your Ensign credentials..." -ForegroundColor Cyan

$token = Get-MsalToken `
    -ClientId $clientId `
    -TenantId $tenantId `
    -Scopes "$resource/.default" `
    -Interactive

$headers = @{
    "Authorization" = "Bearer $($token.AccessToken)"
    "Accept"        = "application/json;odata=verbose"
    "Content-Type"  = "application/json;odata=verbose"
}

$apiBase = "$SiteUrl/_api/web"

function Get-FormDigest {
    $resp = Invoke-RestMethod -Uri "$SiteUrl/_api/contextinfo" -Method POST -Headers $headers
    return $resp.d.GetContextWebInformation.FormDigestValue
}

$digest = Get-FormDigest
$headers["X-RequestDigest"] = $digest

Write-Host "Authenticated successfully!" -ForegroundColor Green

# --- Helper: Create List ---
function New-SPList {
    param(
        [string]$Title,
        [string]$Description,
        [int]$BaseTemplate = 100  # 100=GenericList, 101=DocumentLibrary
    )
    $body = @{
        "__metadata" = @{ "type" = "SP.List" }
        "AllowContentTypes" = $true
        "BaseTemplate" = $BaseTemplate
        "ContentTypesEnabled" = $true
        "Description" = $Description
        "Title" = $Title
    } | ConvertTo-Json -Depth 3

    try {
        $resp = Invoke-RestMethod -Uri "$apiBase/lists" -Method POST -Headers $headers -Body $body
        Write-Host "  Created: $Title" -ForegroundColor Green
        return $resp.d
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -match "already exists") {
            Write-Host "  Already exists: $Title" -ForegroundColor Yellow
            return $null
        }
        throw
    }
}

# --- Helper: Add Column ---
function Add-SPColumn {
    param(
        [string]$ListTitle,
        [string]$FieldName,
        [string]$FieldType,
        [bool]$Required = $false,
        [bool]$EnforceUnique = $false,
        [string]$DefaultValue = "",
        [string[]]$Choices = @()
    )

    $fieldTypeKind = switch ($FieldType) {
        "Single line of text" { 2 }
        "Multiple lines of text" { 3 }
        "Number"               { 9 }
        "Date and Time"        { 4 }
        "Choice"               { 6 }
        "Yes/No"               { 8 }
        default                { 2 }
    }

    if ($FieldType -eq "Choice" -and $Choices.Count -gt 0) {
        $choicesXml = ($Choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ""
        $schemaXml = "<Field DisplayName='$FieldName' Name='$FieldName' Type='Choice' Required='$($Required.ToString().ToUpper())'><Default>$DefaultValue</Default><CHOICES>$choicesXml</CHOICES></Field>"

        $body = @{
            "parameters" = @{
                "__metadata" = @{ "type" = "SP.XmlSchemaFieldCreationInformation" }
                "SchemaXml" = $schemaXml
                "Options" = 8  # AddFieldInternalNameHint
            }
        } | ConvertTo-Json -Depth 4

        $uri = "$apiBase/lists/getbytitle('$ListTitle')/fields/createfieldasxml"
    }
    elseif ($FieldType -eq "Yes/No") {
        $defaultBool = if ($DefaultValue -eq "True") { "1" } else { "0" }
        $schemaXml = "<Field DisplayName='$FieldName' Name='$FieldName' Type='Boolean' Required='$($Required.ToString().ToUpper())'><Default>$defaultBool</Default></Field>"

        $body = @{
            "parameters" = @{
                "__metadata" = @{ "type" = "SP.XmlSchemaFieldCreationInformation" }
                "SchemaXml" = $schemaXml
                "Options" = 8
            }
        } | ConvertTo-Json -Depth 4

        $uri = "$apiBase/lists/getbytitle('$ListTitle')/fields/createfieldasxml"
    }
    else {
        $body = @{
            "__metadata" = @{ "type" = "SP.Field" }
            "Title" = $FieldName
            "FieldTypeKind" = $fieldTypeKind
            "Required" = $Required
            "EnforceUniqueValues" = $EnforceUnique
            "DefaultValue" = $DefaultValue
        } | ConvertTo-Json -Depth 3

        $uri = "$apiBase/lists/getbytitle('$ListTitle')/fields"
    }

    try {
        Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body | Out-Null
        Write-Host "    + $FieldName ($FieldType)" -ForegroundColor DarkGray
    } catch {
        if ($_ -match "already exists" -or $_ -match "duplicate") {
            Write-Host "    ~ $FieldName (exists)" -ForegroundColor Yellow
        } else {
            Write-Host "    ! $FieldName FAILED: $_" -ForegroundColor Red
        }
    }
}

# ============================================================
# 1. SLP_ClinicalKnowledge (Document Library)
# ============================================================
Write-Host "`n[1/5] Creating SLP_ClinicalKnowledge document library..." -ForegroundColor Cyan
New-SPList -Title "SLP_ClinicalKnowledge" -Description "Clinical knowledge assets - SOPs, PDFs, clinical standards, exercise libraries" -BaseTemplate 101

# ============================================================
# 2. SLP_SessionNotes
# ============================================================
Write-Host "`n[2/5] Creating SLP_SessionNotes list..." -ForegroundColor Cyan
New-SPList -Title "SLP_SessionNotes" -Description "Daily/progress/recertification/discharge session notes"

Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "NoteId" -FieldType "Single line of text" -Required $true -EnforceUnique $true
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "PatientId" -FieldType "Single line of text" -Required $true
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "NoteDate" -FieldType "Date and Time" -Required $true
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "NoteType" -FieldType "Choice" -Required $true -Choices @("Daily","Progress","Recertification","Discharge")
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "SessionNumber" -FieldType "Number" -Required $false
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "ContentJson" -FieldType "Multiple lines of text" -Required $true
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "PlainTextSummary" -FieldType "Multiple lines of text" -Required $false
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "ReviewStatus" -FieldType "Choice" -Required $true -DefaultValue "Pending" -Choices @("Pending","Approved","Rejected")
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "ReviewerUPN" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "ReviewDate" -FieldType "Date and Time" -Required $false
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "ReviewComments" -FieldType "Multiple lines of text" -Required $false
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "PHIFlag" -FieldType "Yes/No" -Required $true -DefaultValue "True"
Add-SPColumn -ListTitle "SLP_SessionNotes" -FieldName "AIGenerated" -FieldType "Yes/No" -Required $true -DefaultValue "False"

# ============================================================
# 3. SLP_Goals
# ============================================================
Write-Host "`n[3/5] Creating SLP_Goals list..." -ForegroundColor Cyan
New-SPList -Title "SLP_Goals" -Description "Goal library by patient episode"

Add-SPColumn -ListTitle "SLP_Goals" -FieldName "GoalId" -FieldType "Single line of text" -Required $true -EnforceUnique $true
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "PatientId" -FieldType "Single line of text" -Required $true
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "GoalText" -FieldType "Multiple lines of text" -Required $true
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "GoalStatus" -FieldType "Choice" -Required $true -DefaultValue "Open" -Choices @("Open","OnTrack","AtRisk","Achieved","Discontinued")
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "BaselineMeasure" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "TargetMeasure" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "TargetDate" -FieldType "Date and Time" -Required $false
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "Discipline" -FieldType "Choice" -Required $true -DefaultValue "SLP" -Choices @("SLP","PT","OT")
Add-SPColumn -ListTitle "SLP_Goals" -FieldName "Priority" -FieldType "Choice" -Required $true -DefaultValue "Medium" -Choices @("Low","Medium","High")

# ============================================================
# 4. SLP_ReviewQueue
# ============================================================
Write-Host "`n[4/5] Creating SLP_ReviewQueue list..." -ForegroundColor Cyan
New-SPList -Title "SLP_ReviewQueue" -Description "Supervisor workflow queue and escalation tracking"

Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "QueueId" -FieldType "Single line of text" -Required $true -EnforceUnique $true
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "PatientId" -FieldType "Single line of text" -Required $true
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "RelatedNoteId" -FieldType "Single line of text" -Required $true
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "QueueStatus" -FieldType "Choice" -Required $true -DefaultValue "New" -Choices @("New","InReview","Approved","Rejected","Escalated")
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "AssignedReviewerUPN" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "DueDate" -FieldType "Date and Time" -Required $false
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "EscalationLevel" -FieldType "Choice" -Required $true -DefaultValue "None" -Choices @("None","Level1","Level2")
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "WorkflowCorrelationId" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_ReviewQueue" -FieldName "AuditTrailJson" -FieldType "Multiple lines of text" -Required $false

# ============================================================
# 5. SLP_Patients (last per user request)
# ============================================================
Write-Host "`n[5/5] Creating SLP_Patients list..." -ForegroundColor Cyan
New-SPList -Title "SLP_Patients" -Description "Patient master records"

Add-SPColumn -ListTitle "SLP_Patients" -FieldName "PatientId" -FieldType "Single line of text" -Required $true -EnforceUnique $true
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "DOB" -FieldType "Date and Time" -Required $true
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "StartOfCare" -FieldType "Date and Time" -Required $true
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "PrimaryDiagnosis" -FieldType "Single line of text" -Required $true
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "Status" -FieldType "Choice" -Required $true -DefaultValue "Active" -Choices @("Active","Discharged")
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "GoalsJson" -FieldType "Multiple lines of text" -Required $false
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "Discipline" -FieldType "Choice" -Required $true -DefaultValue "SLP" -Choices @("SLP","PT","OT")
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "CreatedByUPN" -FieldType "Single line of text" -Required $false
Add-SPColumn -ListTitle "SLP_Patients" -FieldName "SourceSystem" -FieldType "Choice" -Required $true -DefaultValue "PowerApps" -Choices @("SLP-Portal","PowerApps")

# ============================================================
# Summary
# ============================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Migration Phase 1 Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Created:"
Write-Host "  - SLP_ClinicalKnowledge (Document Library)"
Write-Host "  - SLP_SessionNotes (14 columns)"
Write-Host "  - SLP_Goals (10 columns)"
Write-Host "  - SLP_ReviewQueue (9 columns)"
Write-Host "  - SLP_Patients (10 columns)"
Write-Host "`nVerify at: $SiteUrl/_layouts/15/viewlsts.aspx" -ForegroundColor Yellow
