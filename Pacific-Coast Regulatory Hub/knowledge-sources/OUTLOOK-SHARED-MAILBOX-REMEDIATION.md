# Outlook Shared Mailbox Remediation Runbook

## Status: PENDING â€” Requires Exchange Admin

## Problem

The **SNF - Quality Measure Decline Detection And Reporting** flow uses the Office 365 Outlook connector with author credentials (`123713644@pacific coastservices.net`). Per [Microsoft Learn](https://learn.microsoft.com/en-us/connectors/office365/), the Office 365 Outlook connector does NOT support service principal authentication â€” only user-delegated connections.

### Risks
- If the author account is disabled or password changes, the Outlook connection breaks and QM decline alert emails stop sending
- Emails currently appear to come from Kevin Moon's personal account rather than a professional/generic address

## Recommended Fix: Shared Mailbox + Send As

Per Microsoft Learn best practices for production Power Automate flows:

### Step 1: Create Shared Mailbox (Exchange Admin Required)

1. Go to **Microsoft 365 Admin Center** â†’ Teams & Groups â†’ Shared mailboxes
2. Click **Add a shared mailbox**
3. Set:
   - **Name**: `QM Coach Alerts`
   - **Email**: `qm-alerts@pacific coastservices.net` (or similar)
4. Under **Members**, add `123713644@pacific coastservices.net`
5. Under **Delegation** â†’ **Send As**, grant permission to `123713644@pacific coastservices.net`

### Step 2: Update Flow Action in Power Automate

1. Open flow: **SNF - Quality Measure Decline Detection And Reporting**
   - Environment: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
   - Flow ID: `0e82ab94-f892-45f1-8084-7abc7229f776`
2. Open the **Condition LookupOnly** â†’ **False** branch
3. Delete the existing **Send an email (V2)** action
4. Add new action: **Send an email from a shared mailbox (V2)**
5. Configure:
   - **Original Mailbox Address**: `qm-alerts@pacific coastservices.net`
   - **To**: `@triggerBody()?['text_4']` (dynamic â€” the ToEmail input)
   - **Subject**: `âš ï¸ QM DECLINE ALERT - @{triggerBody()?['text']} | @{triggerBody()?['text_1']}`
   - **Body**: (keep existing HTML body template)
   - **Importance**: Normal
6. Save and test

### Step 3: Verify

- Send a test email through the agent
- Confirm email arrives FROM `qm-alerts@pacific coastservices.net` (not Kevin Moon)
- Confirm "Sent Items" appear in the shared mailbox

## Why This Approach (Microsoft Learn Rationale)

- The Office 365 Outlook connector requires a user-delegated connection â€” service principal is not supported
- Shared mailboxes don't require a license
- Send As permission makes emails appear to come from the shared mailbox directly (not "on behalf of")
- If the flow owner changes, just reassign Send As permissions â€” no re-authentication needed
- The connection reference (`pcca_Outlook`) stays tied to a user account, but the sending identity is decoupled from any individual

## Also Applies To

Check if the **SNF - Quality Measure Email Generator** flow also sends emails. Current analysis shows it uses the Approvals connector (`StartAndWaitForAnApproval`), not Outlook directly, so it may not need this change.

## Connection Reference Details

| Reference | Connector | Current Connection | Solution |
|-----------|-----------|-------------------|----------|
| `pcca_Outlook` | Office 365 Outlook | `123713644@pacific coastservices.net` | Healthcare Agents Foundation V2 |
| `new_sharedcommondataserviceforapps_a3ae0` | Microsoft Dataverse | QM-Dataverse-Connection âœ… | Healthcare Agents Foundation V2 |

## Date Created
2026-04-10

