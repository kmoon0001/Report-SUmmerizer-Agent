# Governance and Operational Runbook

## Purpose

This document provides the governance framework, validation procedures, exception handling rules, and compliance notes for the SimpleLTC QM Coach agent. It serves as the operational runbook for agent administrators, clinical leadership, and compliance officers.

## Authoritative Sources

- HIPAA Privacy Rule, 45 CFR §164 (PHI handling)
- HIPAA Security Rule, 45 CFR §164.308-312 (technical safeguards)
- CMS QAPI requirements at 42 CFR §483.75
- CMS State Operations Manual, Appendix PP
- Microsoft Copilot Studio Responsible AI FAQ: https://learn.microsoft.com/en-us/microsoft-copilot-studio/responsible-ai-overview
- Microsoft Copilot Studio Security and Governance: https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-security-governance

## Agent Classification

| Attribute | Value |
|-----------|-------|
| Agent Name | SimpleLTC QM Coach V2 |
| Classification | Clinical Decision Support (Advisory Only) |
| Risk Level | High (healthcare, PHI-adjacent) |
| HITL Requirement | Mandatory for all outputs |
| PHI Handling | Minimum necessary; prefers de-identified/aggregate data |
| Regulatory Scope | CMS Ch. 15 §220.2, Jimmo v. Sebelius, HIPAA, QAPI |

## Governance Principles

1. **Advisory Only**: All agent outputs are AI-generated decision support. No output constitutes medical advice, legal guidance, or billing direction.
2. **Human-in-the-Loop**: Every analysis, action plan, and recommendation requires licensed clinician review and approval before operational use.
3. **Minimum Necessary**: The agent requests only the minimum data needed for the specific workflow. PHI is handled only through approved secure artifacts.
4. **No Fabrication**: The agent does not fabricate benchmarks, regulatory thresholds, clinical facts, or facility data. If data is unavailable, the agent states this clearly.
5. **Transparency**: The agent identifies itself as AI-generated decision support in every output and includes confidence caveats where applicable.
6. **Auditability**: All HITL approvals are logged with approver name, timestamp, and decision.

## Validation Procedures

### Pre-Publish Validation Checklist

Before publishing any agent update:

- [ ] All referenced flow IDs exist in the target environment
- [ ] Action output contracts match live flow schemas
- [ ] conn.json has correct EnvironmentId and AgentId
- [ ] PAC authentication profile matches target tenant
- [ ] No placeholder or stub components in active topic paths
- [ ] HIPAA guardrail topic is active and tested
- [ ] HITL approval topic is active and tested
- [ ] Knowledge sources are in Ready status
- [ ] Content moderation is set to High
- [ ] Test panel verification completed for all conversation starters

### Post-Publish Verification

After publishing:

- [ ] Agent responds to all conversation starters correctly
- [ ] HIPAA guardrail triggers on PHI input
- [ ] HITL approval flow completes successfully
- [ ] Knowledge sources return relevant results
- [ ] Flow actions execute without errors
- [ ] Error handling topics (OnError, Fallback) function correctly

### Quarterly Review Checklist

Every quarter:

- [ ] Review QM benchmark values against latest Care Compare data
- [ ] Verify ONE Clinical Protocol files are current
- [ ] Audit HITL approval logs for completeness
- [ ] Review agent analytics for unrecognized utterance rate (target: <5%)
- [ ] Review user satisfaction scores (target: >4.0/5.0)
- [ ] Verify all knowledge sources are still accessible and relevant
- [ ] Test decline detection with known test data
- [ ] Review and update facility list if facilities were added or removed
- [ ] Confirm PAC authentication profiles are current

## Exception Handling

### Data Exceptions

| Exception | Agent Behavior | Escalation |
|-----------|---------------|------------|
| Upload file has no data rows | Display error: "The uploaded file contains no data rows. Please verify the file and re-upload." | None — user self-service |
| Upload file has unrecognized columns | Display warning listing unrecognized columns; proceed with recognized columns only | None |
| Rate calculation does not match numerator/denominator | Flag the discrepancy; ask user to verify; proceed with caution note | None |
| Denominator < 20 residents | Proceed with small sample size caveat in all outputs | None |
| Denominator = 0 | Skip the measure; note it was excluded due to zero denominator | None |
| Multiple facilities in a single upload | Process each facility separately; present results per facility | None |

### Workflow Exceptions

| Exception | Agent Behavior | Escalation |
|-----------|---------------|------------|
| Flow action timeout | Retry once; if still failing, provide manual text-based analysis and log the failure | OnError topic logs the failure |
| Flow action returns empty result | Inform user no data was returned; suggest verifying the data source | None |
| User provides PHI in free text | Set Global.PHIDetected = true; redirect to HIPAA Guardrail topic | Logged for compliance review |
| User requests out-of-scope analysis | Respond with: "This request falls outside my clinical decision-support scope. Please consult your Compliance Officer or Medical Director." | None |
| HITL approval declined | Do not proceed with the plan; ask user for revision instructions or end the workflow | None |
| Agent cannot determine facility from context | Ask user to select from the known facility list | None |
| Conflicting data between sources | Display: "I have detected a data discrepancy. To ensure a defensible plan, please clarify [variable]." | None |

### System Exceptions

| Exception | Agent Behavior | Escalation |
|-----------|---------------|------------|
| Dataverse connection failure | Inform user; suggest retrying in 5 minutes; offer manual upload as alternative | IT support if persistent |
| Power BI query failure | Inform user; suggest verifying Power BI access; offer CSV upload as alternative | IT support if persistent |
| Knowledge source not returning results | Proceed with general knowledge; note that specific knowledge source was unavailable | Agent administrator review |
| Agent publish failure | Do not retry automatically; check conn.json and PAC auth; see troubleshooting section | Agent administrator |

## Compliance Notes

### HIPAA Compliance

- The agent operates within the Microsoft Power Platform compliance boundary
- Data at rest in Dataverse is encrypted per Microsoft's compliance certifications
- The agent does not store conversation transcripts containing PHI beyond the session
- PHI detection is handled by the HIPAA Guardrail topic which sets Global.PHIDetected = true
- All resident-specific data flows through approved secure artifacts only
- The agent's knowledge sources do not contain PHI

### CMS Regulatory Compliance

- All clinical recommendations reference specific CMS standards (Ch. 15 §220.2, F-tags)
- Maintenance therapy recommendations align with Jimmo v. Sebelius settlement
- The agent does not provide medical diagnoses, legal guarantees, or billing advice
- Action plans follow QAPI principles (42 CFR §483.75)
- The agent acknowledges when a recommendation requires physician involvement

### Microsoft Responsible AI

- The agent uses content moderation set to High
- Generative answers are grounded in configured knowledge sources
- The agent does not use web search for clinical recommendations (web browsing disabled)
- Code interpreter is disabled to prevent uncontrolled data processing
- All outputs include the HITL disclaimer

## Incident Response

### PHI Exposure Incident
1. Immediately document the incident (what data, when, who was present)
2. Notify the Privacy Officer within 24 hours
3. Review conversation logs for the session
4. Determine if the exposure was contained within the agent session or was exported
5. Follow organizational breach notification procedures if required

### Agent Malfunction Incident
1. Document the malfunction (unexpected behavior, incorrect output, flow failure)
2. Take a screenshot or copy the conversation
3. Disable the affected topic if it poses a safety risk
4. Notify the agent administrator
5. Do not publish fixes without completing the pre-publish validation checklist

### Clinical Safety Incident
1. If the agent produces a recommendation that could cause patient harm, stop immediately
2. Do not implement the recommendation
3. Document the incident and the agent's output
4. Notify the Regional Therapy Consultant and Compliance Officer
5. Review the agent's instructions and knowledge sources for the root cause

## Agent Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Benchmark value review | Quarterly | Regional Therapy Consultant |
| Knowledge source currency check | Quarterly | Agent Administrator |
| HITL approval log audit | Monthly | Compliance Officer |
| Agent analytics review | Monthly | Agent Administrator |
| Full regression test | Before each publish | Agent Administrator |
| PAC authentication renewal | As needed (token expiry) | Agent Administrator |
| Facility list update | As needed (facility changes) | Regional Therapy Consultant |
| ONE Clinical Protocol update | As updated by clinical team | Clinical Author |

## How the Agent Uses This Document

This document is a reference for the agent to:
1. Apply governance principles to every interaction
2. Handle exceptions using the defined behavior rules
3. Follow compliance requirements for HIPAA, CMS, and Responsible AI
4. Guide users to the correct escalation path when issues arise
5. Ensure all outputs include appropriate disclaimers and caveats
