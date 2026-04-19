# Script to enable the QM Driver Analysis topic using Dataverse API

# Based on the error message, the topic schema name is: cr917_agent.topic.QMDriverAnalysis
# The topic needs to have its "state" set to "Active" and "status" set to "Active"

Write-Host "To enable the QM Driver Analysis topic, you need to:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Copilot Studio in your browser" -ForegroundColor Cyan
Write-Host "   URL: https://copilotstudio.microsoft.com/environments/a944fdf0-0d2e-e14d-8a73-0f5ffae23315/bots/ea52ad9c-8233-f111-88b3-6045bd09a824/adaptive"
Write-Host ""
Write-Host "2. Find 'QM Driver Analysis' in the Topics list" -ForegroundColor Cyan
Write-Host "   - Use the search box if needed"
Write-Host "   - Look for a topic with a toggle switch showing 'Off' or 'Disabled'"
Write-Host ""
Write-Host "3. Click the toggle switch to turn it ON" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Go back to Overview and click Publish" -ForegroundColor Cyan
Write-Host ""
Write-Host "The Publish button is grayed out because this topic is disabled." -ForegroundColor Red
Write-Host "Once you enable it, the Publish button will become active." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to open Copilot Studio in your default browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "https://copilotstudio.microsoft.com/environments/a944fdf0-0d2e-e14d-8a73-0f5ffae23315/bots/ea52ad9c-8233-f111-88b3-6045bd09a824/adaptive"
