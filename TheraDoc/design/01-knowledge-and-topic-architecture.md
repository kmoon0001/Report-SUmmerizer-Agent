# Revised Master Agent Instructions

Use the current agent instructions in [agent.mcs.yml](/d:/my%20agents%20copilot%20studio/TheraDoc/agent.mcs.yml). They are written to support generative orchestration with minimal follow-up, tool-first execution, and knowledge-grounded documentation guidance.

# Recommended Knowledge Base Architecture

## 1. SNF PT Documentation Standards
- Description: PT-specific SNF documentation guidance covering daily, progress, evaluation, recertification, and discharge expectations. Use for PT note content, required elements, and skilled wording guidance.
- Content outline:
  - Required elements by note type
  - Skilled PT intervention categories
  - Functional mobility, gait, transfer, balance, endurance, neuromuscular, and strengthening phrasing
  - Medical necessity and progress wording
  - Measurable performance examples
  - Common PT denial risks

## 2. SNF OT Documentation Standards
- Description: OT-specific SNF documentation guidance for ADLs, IADLs, UE function, coordination, cognition, safety, adaptive equipment, and skilled rationale.
- Content outline:
  - Required elements by note type
  - ADL and IADL intervention language
  - UE strengthening, ROM, coordination, cognition, and safety intervention examples
  - Assist level and cueing language
  - Medical necessity and measurable function examples
  - Common OT denial risks

## 3. SNF ST Documentation Standards
- Description: ST-specific SNF documentation guidance for cognition, communication, swallowing, voice, speech intelligibility, and caregiver education.
- Content outline:
  - Required elements by note type
  - Dysphagia, diet texture, liquid consistency, compensatory strategies
  - Attention, memory, problem solving, orientation, language, voice, and intelligibility phrasing
  - Cueing and assist language
  - Recommendations and safety wording
  - Common ST denial risks

## 4. Skilled Necessity And Compliance Guide
- Description: Practical compliance reference for defensible SNF therapy documentation. Use for skilled rationale, measurable function, progress evidence, maintenance wording, and denial-risk avoidance.
- Content outline:
  - What makes therapy skilled
  - Medicare-defensible language patterns
  - Measurable function and response requirements
  - Maintenance therapy wording when applicable
  - Common weak phrases and stronger replacements
  - Red flags that require therapist clarification

## 5. Approved Note Examples Library
- Description: Curated examples of high-quality PT, OT, and ST notes across note types. Use for style guidance and pattern grounding, not for copying unsupported facts.
- Content outline:
  - PT daily, progress, discharge examples
  - OT daily, progress, discharge examples
  - ST daily, progress, discharge examples
  - Evaluation and recertification exemplars if enabled
  - Example audit comments with corrected versions

## 6. Net Health Style And Formatting Reference
- Description: Internal formatting conventions for concise narrative notes aligned with Net Health / Rehab Optima style expectations.
- Content outline:
  - Preferred note length and tone
  - Light label vs narrative-only examples
  - Approved abbreviations and forbidden shorthand
  - Formatting for objective metrics and plan statements

## 7. Approved Abbreviations And Terminology
- Description: Organization-approved rehab abbreviations, cueing terms, assist levels, precautions, and wording conventions.
- Content outline:
  - Discipline-neutral abbreviations
  - PT / OT / ST abbreviations
  - Assist levels and cueing definitions
  - Safety and precaution terminology
  - Terms to avoid

## 8. Escalation And Do-Not-Guess Rules
- Description: Cases where TheraDoc must ask a follow-up question, refuse to infer, or direct the therapist to verify details manually.
- Content outline:
  - Missing discipline or note type
  - Missing core intervention data
  - Conflicting measurements or timeline
  - Unsupported diagnosis, diet, or precaution details
  - When to recommend human review before finalizing

## 9. CMS Therapy And Coverage Sources
- Description: CMS primary coverage and documentation sources for SNF therapy, including therapy services guidance, Medicare Benefit Policy Manual Chapter 15, and SNF Services MLN documentation expectations.
- Content outline:
  - Skilled care and medical necessity
  - Therapy coverage and documentation structure
  - Progress, discharge, and plan-of-care support
  - Improper-payment risk reduction

## 10. Professional Association Guidance
- Description: Discipline-specific documentation guidance from ASHA, AOTA, and APTA for SLP, OT, and PT service justification and documentation quality.
- Content outline:
  - Discipline-specific documentation expectations
  - Functional and participation-based language
  - Cueing, assist level, and response reporting
  - Skilled rationale and measurable performance

## 11. MAC / Contractor Guidance
- Description: Supplemental jurisdiction-specific documentation guidance from the applicable Medicare Administrative Contractor or payer.
- Content outline:
  - Jurisdiction-specific interpretations
  - Supplemental review-risk notes
  - Local coverage nuances
  - When to defer to CMS versus contractor material

# Topic Architecture Summary

| Topic | Role |
| --- | --- |
| Welcome / Start | Introduce capabilities and route into the right workflow |
| Ambiguous Request Disambiguation | Resolve unclear requests into a single next step |
| PT Daily Note Intake | Gather minimum PT daily-note inputs |
| OT Daily Note Intake | Gather minimum OT daily-note inputs |
| ST Daily Note Intake | Gather minimum ST daily-note inputs |
| Progress Note Intake | Gather cross-discipline progress-note inputs |
| Discharge Note Intake | Gather cross-discipline discharge-note inputs |
| Evaluation / Assessment Intake | Gather eval or assessment inputs if enabled |
| Generate Note Orchestration | Decide whether to call Parse Brain Dump, collect one more field, or call Generate Note |
| Audit Existing Note | Collect or accept note text, then call Audit Note |
| Parse Brain Dump | Normalize pasted free text into structured variables |
| Nursing Handoff | Collect nurse-facing context, then call Nursing Handoff |
| Redo / Revise Note | Take a draft note and requested changes, then re-run Generate Note |
| Documentation Guidance / What Do You Need From Me | Answer guidance questions from knowledge |
| Compliance Help / Why This Might Not Be Skilled | Explain risks using knowledge and optionally Audit Note |
| Format Preference / Net Health Style | Set output style preference |
| New Session / Start Over | Clear session variables and restart |
| Error / Timeout Recovery | Recover from action failures or partial output |
