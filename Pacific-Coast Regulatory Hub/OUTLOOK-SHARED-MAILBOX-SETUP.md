# Outlook Shared Mailbox Configuration - Action Required

## Critical Item 3: Complete Outlook Connector Configuration

**Status:** ⚠️ PENDING IT ADMIN ACTION  
**Priority:** HIGH (if email functionality is critical)  
**Assigned To:** IT Administrator

---

## Background

Per AGENT.md documentation, the Office 365 Outlook connector currently uses author credentials (`pcca_Outlook`) which is not suitable for production use. The Outlook connector does not support service principal authentication.

**Affected Flows:**
- SNF - Quality Measure Decline Detection (uses Outlook for notifications)
- SNF - Quality Measure Email Generator (uses Outlook for DoR summary emails)

---

## Required Action

### Step 1: Create Shared Mailbox

1. Navigate to Microsoft 365 Admin Center
2. Go to **Teams & groups** > **Shared mailboxes**
3. Click **Add a shared mailbox**
4. Configure:
   - **Name:** SimpleLTC QM Notifications
   - **Email:** qm-notifications@[yourdomain].com
   - **Description:** Automated quality measure notifications and reports from SimpleLTC QM Coach V2

### Step 2: Grant Permissions

Add the following users/groups with "Send As" permissions:
- Service account or user that will authenticate the Power Automate connection
- Any administrators who need to manage the mailbox

### Step 3: Update Power Automate Flows

For each affected flow:

1. Open the flow in Power Automate
2. Locate the "Send an email" action
3. Replace with "Send an email from a shared mailbox (V2)"
4. Configure:
   - **Mailbox Address:** qm-notifications@[yourdomain].com
   - **To:** (keep existing dynamic content)
   - **Subject:** (keep existing dynamic content)
   - **Body:** (keep existing dynamic content)

### Step 4: Update Connection Reference

1. In Copilot Studio, go to **Settings** > **Connections**
2. Update the Outlook connection to use the shared mailbox credentials
3. Test the connection

### Step 5: Verify

1. Test each flow that uses Outlook
2. Verify emails are sent from the shared mailbox
3. Check that email delivery is successful

---

## Alternative Solution (If Shared Mailbox Not Available)

If a shared mailbox cannot be created immediately:

1. **Document the limitation** in user training materials
2. **Use a service account** with a dedicated mailbox
3. **Plan for migration** to shared mailbox in next maintenance window

---

## Testing Checklist

After configuration:

- [ ] SNF - Quality Measure Decline Detection flow sends test email
- [ ] SNF - Quality Measure Email Generator flow sends test DoR summary
- [ ] Emails appear from shared mailbox address
- [ ] Email formatting is correct
- [ ] Recipients receive emails successfully
- [ ] No authentication errors in flow run history

---

## Microsoft Learn References

- [Send email from shared mailbox](https://learn.microsoft.com/en-us/connectors/office365/#send-an-email-from-a-shared-mailbox-(v2))
- [Shared mailboxes in Exchange Online](https://learn.microsoft.com/en-us/microsoft-365/admin/email/create-a-shared-mailbox)
- [Power Automate connections](https://learn.microsoft.com/en-us/power-automate/add-manage-connections)

---

## Contact

For questions or assistance, contact:
- **Copilot Studio Admin:** [Your Name]
- **Power Platform Admin:** [IT Admin Name]
- **Email:** [support email]

---

**Created:** April 11, 2026  
**Last Updated:** April 11, 2026  
**Next Review:** After shared mailbox configuration is complete
