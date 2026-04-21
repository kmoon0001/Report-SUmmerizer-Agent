$agents = @(
    "d:\my agents copilot studio\TheraDoc",
    "d:\my agents copilot studio\SNF Agent Command Center\SNF Command Center Agent",
    "d:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab\SNF Rehab Agent",
    "d:\my agents copilot studio\Pacific-Coast Regulatory Hub\SimpleLTC QM Coach V2"
)

Write-Host "============================"
Write-Host " SYNCHRONIZING TO DATAVERSE"
Write-Host "============================"

foreach ($agent in $agents) {
    Write-Host "Syncing $agent to Dataverse..."
    pac copilot sync --source "$agent"
}
