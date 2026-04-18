# Microsoft Learn Hardening Alignment

This project hardening pass follows Microsoft Learn guidance for PowerShell reliability patterns, scheduled task automation, test coverage, and Power BI deployment readiness.

## Implemented Areas

- Runtime reliability and guardrails:
  - run locks
  - checkpoint resume
  - safe cleanup retention
  - explicit `try`/`finally` style orchestration
- Vitals ingestion contract:
  - normalized vitals output for current residents
  - schema test gate before use in patient insights
- Automated quality controls:
  - data drift thresholds and report
  - secret hygiene check
  - Pester hardening suite
- Operational automation:
  - daily Windows Task Scheduler registration for executive refresh
- Power BI deployment readiness:
  - pre-publish artifact and package reconciliation checklist

## Microsoft Learn References

- PowerShell exception handling (`try`, `catch`, `finally`):
  - https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_try_catch_finally
- PowerShell strict mode:
  - https://learn.microsoft.com/powershell/module/microsoft.powershell.core/set-strictmode
- Scheduled tasks with PowerShell:
  - https://learn.microsoft.com/powershell/module/scheduledtasks/register-scheduledtask
  - https://learn.microsoft.com/powershell/module/scheduledtasks/new-scheduledtasktrigger
  - https://learn.microsoft.com/powershell/module/scheduledtasks/new-scheduledtaskaction
  - https://learn.microsoft.com/powershell/module/scheduledtasks/new-scheduledtasksettingsset
- Pester and PowerShell testing:
  - https://learn.microsoft.com/powershell/scripting/learn/deep-dives/everything-about-pester
- Power BI deployment pipelines:
  - https://learn.microsoft.com/power-bi/collaborate-share/service-deployment-pipelines-overview
