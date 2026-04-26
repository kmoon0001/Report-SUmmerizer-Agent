# Cloud Flow Spec: SLP Portal Health Check

## Purpose

Run a non-PHI operational health check against the SharePoint SLP Portal bridge.

## Trigger

Manual trigger or scheduled recurrence.

## Connectors

- SharePoint only.

## Checks

- Site reachable.
- Homepage points to `SitePages/SLP-Portal.aspx`.
- Expected bridge pages exist.
- Site Pages library versioning enabled.
- Site Assets library versioning enabled.
- Blocked/sample/PHI-era navigation labels absent.
- Source PDF library exists.

## Output

Preferred first phase:

- Return run result only.

Optional later:

- Write non-PHI status rows to an admin-only SharePoint list:
  - timestamp
  - check name
  - status
  - message

## Blocked

- Reading patient-era list item content.
- Sending status by email or Teams unless explicitly approved.
- Including tenant secrets, cookies, or auth state in run output.
