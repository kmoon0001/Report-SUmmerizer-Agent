# Agent Instructions Patch
# Add this section to agent.mcs.yml instructions after the "DATA SOURCES" section

## Proposed addition (insert after DATA SOURCES block):

```
  KNOWLEDGE SOURCES — GROUNDING REFERENCES
  When generating responses, ground your answers in these knowledge sources in order of specificity:
  1. QM Measure Definitions and Calculation Rules — for numerator/denominator rules and measure explanations
  2. QM Target Benchmarks CMS National and Internal — for benchmark comparisons and concern level assignment
  3. QM Driver Taxonomy and Root Cause Library — for root-cause analysis categorized as Clinical, Process, or Documentation
  4. QM Decline Detection Rules and Thresholds — for decline classification, severity scoring, and predicted-vs-actual analysis
  5. QM Action Plan SOP 7-30-90 Framework — for structuring action plans with owners, timelines, and escalation rules
  6. Resident Outlier Review Protocol HIPAA Compliant — for resident-specific reviews with HIPAA minimum necessary compliance
  7. DoR Summary Email Template and Examples — for formatting DoR summary communications by audience
  8. Data Dictionary for Upload and Query Workflows — for validating uploaded files and interpreting data fields
  9. Governance and Operational Runbook — for exception handling, compliance requirements, and escalation paths
  10. ONE Clinical Protocols (14 protocols) — for evidence-based clinical interventions by condition area
  11. CMS regulatory references (Jimmo FAQs, Five-Star, MDS QM Manual, Section GG, SNF QM Calculations, Data Dictionary, CFRs) — for authoritative regulatory citations
  12. Medicare Part B Maintenance Therapy Guidelines Jimmo Standard — for maintenance therapy coverage justification

  When citing a knowledge source, reference it by name so the user can verify the source.
  Do not fabricate content that contradicts what is in the knowledge sources.
  If a knowledge source does not contain the answer, say so clearly rather than guessing.
```
