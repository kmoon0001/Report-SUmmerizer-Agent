# Compliance Checklist

## HIPAA

- Encrypt data in transit and at rest.
- Restrict access by role, unit, and assignment.
- Audit access to PHI.
- Mask or de-identify data in dev and test.
- Apply the minimum necessary principle to every dashboard, export, and workflow.
- Track disclosures and external sharing events where policy requires it.

## HITECH

- Keep audit logs and access history.
- Maintain breach-response procedures.
- Limit unnecessary PHI exposure.
- Support incident investigation and retention of relevant access records.

## State And Local Rules

- Verify state privacy rules for therapy, nursing, and health record access.
- Confirm retention and disclosure requirements for the target state.
- Confirm telehealth or remote access rules where applicable.
- Confirm any state-specific mandatory reporting, consent, and family disclosure rules.

## Microsoft Controls

- Sensitivity labels for PHI and PII
- Purview audit logging
- DLP policies
- Defender for Cloud / threat protection
- Conditional access and least privilege
- Dynamic RLS and, where needed, OLS or CLS
- Customer-managed keys and stronger encryption controls where required
- Just-in-time privileged access for sensitive admin actions

## Operational Rules

- Human review for high-risk clinical actions
- Clear separation between operational analytics and clinical decision support
- No silent updates to patient-facing systems without approved workflow ownership
- No automated clinical recommendation should bypass documented escalation and review rules
- Break-glass access must be logged and reviewed

## Patient Privacy And Consent

- Respect consent flags for family sharing, research use, image use, and special disclosures.
- Require policy-appropriate consent for voice capture and identifiable image analysis.
- Label and control exports that contain PHI.
- Ensure privacy notices describe system use, data processing, and audit practices.
