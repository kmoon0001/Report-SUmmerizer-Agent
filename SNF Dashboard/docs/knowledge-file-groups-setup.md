# Knowledge Source File Groups — SNF AI Dashboard

**Source:** Microsoft Learn — [Create file groups](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-file-groups)
**Date:** 2026-04-11

File groups are configured in the **Copilot Studio portal** (not via YAML). The groups defined below must be created in the knowledge source configuration after publishing.

---

## File Group Definitions

### Group 1: `clinical-staff-files`

| Property | Value |
|---|---|
| **Name** | Clinical Staff Knowledge |
| **Description** | Documentation standards, skilled care criteria, therapy guidelines, and clinical policies for nursing, therapy, and direct-care roles. |
| **Instructions** | Use this group when the user asks about patient care documentation, therapy notes, skilled care justification, plan of care, progress notes, discharge documentation, or clinical workflow guidance for nursing or therapy. |
| **Files to include** | 01, 02, 03, 04, 05, 06, 07 |

**Portal steps:**
1. Go to agent → Knowledge → Add file group
2. Name: `Clinical Staff Knowledge`
3. Add files: 01 through 07
4. Paste the description and instructions above
5. Save

---

### Group 2: `quality-compliance-files`

| Property | Value |
|---|---|
| **Name** | Quality and Compliance Knowledge |
| **Description** | MAC audit patterns, denial reasons, LCD requirements, and post-payment review guidance for quality and compliance teams. |
| **Instructions** | Use this group when the user asks about audit readiness, denial patterns, MAC requirements, documentation deficiencies, TPE (Targeted Probe and Educate) process, or post-payment review response. |
| **Files to include** | 07 (MAC contractor guidance) |

**Portal steps:**
1. Go to agent → Knowledge → Add file group
2. Name: `Quality and Compliance Knowledge`
3. Add file: 07
4. Paste description and instructions above
5. Save

---

### Group 3: `governance-files`

| Property | Value |
|---|---|
| **Name** | Governance and Safety Knowledge |
| **Description** | Clinical warning labels, upload governance rules, PHI handling standards, and AI safety boundaries applicable to all roles. |
| **Instructions** | Use this group for any question involving AI safety disclaimers, PHI or PII handling guidance, clinical warning labels, upload governance, or the boundaries of what this assistant does and does not do clinically. |
| **Files to include** | 08 (clinical warning labels), 12 (if present — privacy notice), any governance files |

**Portal steps:**
1. Go to agent → Knowledge → Add file group
2. Name: `Governance and Safety Knowledge`
3. Add applicable governance files
4. Paste description and instructions above
5. Save

---

## Why File Groups Matter

Per [Microsoft Learn file groups guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-file-groups):

> File groups let your agent use different subsets of uploaded documents depending on the context of the conversation. Instead of searching all documents every time, the agent can target the group most relevant to the topic — improving relevance, groundedness, and response accuracy.

Without file groups, all 16 knowledge files are searched for every query, which:
- Reduces precision of grounded answers
- Makes irrelevant documents compete with the correct ones
- Increases latency for complex knowledge retrieval

With file groups, the agent routes knowledge retrieval to the narrowest correct subset, matching the same precision-first principle as button-only topic routing.
