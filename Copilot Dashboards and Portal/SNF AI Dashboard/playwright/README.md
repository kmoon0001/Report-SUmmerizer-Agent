# Playwright

Use Playwright to verify the live Copilot Studio web experience.

This folder also verifies the generated executive dashboard HTML bundle.

## Recommended Checks

- Agent landing page loads
- Menu is button-driven
- Ambiguous requests route to a clear choice step
- Recovery returns the user to a menu or safe restart
- Executive bundle renders expected KPI and section text

## Environment

- Set the target URL in `COPILOT_STUDIO_URL`
- Optional: set `COPILOT_STUDIO_EXPECTED_TITLE` to override the default title regex
- Optional: set `COPILOT_EXPECTED_MARKERS` as a `|` separated list of text markers that should appear
- Optional: set `COPILOT_DISALLOWED_MARKERS` as a `|` separated list of text markers that must not appear
- Sign in with the same tenant used by the Copilot Studio workspace

## Run

- `npm test`
- `npm run test:headed`
- `npm run test:list`
- `powershell -ExecutionPolicy Bypass -File ..\scripts\Invoke-SnfAiDashboardPlaywrightSmoke.ps1`
- `powershell -ExecutionPolicy Bypass -File ..\scripts\Invoke-ExecutiveCommandCenterBundleSmoke.ps1`

## Example

```powershell
$env:COPILOT_STUDIO_URL = 'https://copilotstudio.microsoft.com/...'
$env:COPILOT_EXPECTED_MARKERS = 'What do you need help with right now?|Clinical insights|Safety and surveillance'
$env:COPILOT_DISALLOWED_MARKERS = 'The . operator cannot be used on Unknown values.|Incompatible type comparison'
powershell -ExecutionPolicy Bypass -File ..\scripts\Invoke-SnfAiDashboardPlaywrightSmoke.ps1
```
