# Secure Credential Bootstrap

Date: 2026-04-07

Use this to avoid putting passwords or secrets in repo files.

## 1) Initialize local secret vault

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Initialize-SnfSecretStore.ps1 -InstallModules
```

Optional (unlock once per session):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Initialize-SnfSecretStore.ps1 -UnlockSecretStore
```

## 2) Store secrets

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Set-SnfCredentialSecrets.ps1
```

Store at minimum:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- `POWERBI_TENANT_ID`
- `POWERBI_CLIENT_ID`
- `POWERBI_CLIENT_SECRET`
- `POWERBI_WORKSPACE_ID`
- `POWERBI_REPORT_ID`

## 3) Load secure env into current session

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Import-SnfSecureEnv.ps1
```

This also loads non-secret defaults from `.env` if present.

## 4) Run the previously blocked gates

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Test-PowerBiPublishedSmokeNonInteractive.ps1
powershell -ExecutionPolicy Bypass -File scripts\Test-CommandCenterGroundednessEvaluation.ps1
powershell -ExecutionPolicy Bypass -File scripts\Invoke-SnfAiDashboardQaSweep.ps1
```

## 5) Security rules

- Never store raw passwords in scripts, `.env`, docs, or source files.
- Keep service-principal/client secrets in SecretStore only.
- Rotate any credential that was previously shared in plaintext.
