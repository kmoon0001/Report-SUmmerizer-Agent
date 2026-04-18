# SNF Command Center Workflow Spec

This document defines healthcare-aware workflows in plain text so they can be translated into Power Automate, Fabric event-driven actions, Azure workflows, or another workflow engine.

## Shared Conventions

- Clinical confidence threshold for autonomous workflow invocation: greater than 85 percent unless policy requires human confirmation.
- High-risk workflows always require escalation to a licensed clinician or designated human owner.
- Every workflow should emit audit metadata, correlation IDs, timestamps, source system references, and validation flags.
- Every workflow should preserve patient, episode, role, unit, and time context.

## 1. RefreshHealthcareIntelligence

- Clinical purpose: refreshes live clinical and operational metrics so dashboards and the assistant reflect current conditions.
- Trigger: scheduled recurrence, manual refresh by authorized user, or Eventstream / Fabric event indicating relevant source change.
- Inputs: unit, facility, role scope, dateRange, refreshScope, sourceSystems, recurrence, patientId optional, tableName optional.
- Outputs: status, refreshedAt, recordCount, dataQualityStatus, staleDataFlags, actionItems.
- One-sentence clinical purpose: refreshes live intelligence used for patient safety, therapy, staffing, and compliance decisions.
- Step-by-step logic:
  1. Identify the target refresh scope and source systems.
  2. Pull incremental changes from PCC, NetHealth, Dataverse, Graph, and reference stores.
  3. Validate timestamps, required identifiers, and terminology mappings.
  4. Recompute high-priority risk summaries and dashboard aggregates.
  5. Publish refreshed tables or semantic model signals.
  6. Emit quality warnings if any source is stale or incomplete.
- Clinical validation steps:
  1. Check observation freshness windows for vitals, pain, falls, therapy, and meds.
  2. Verify that updated data still aligns with active care plan phase and current census.
  3. Flag incomplete medication, diagnosis, or assignment data for review.

## 2. GenerateOnDemandPatientInsight

- Clinical purpose: generates a role-specific patient insight summary on demand with explicit uncertainty and escalation cues.
- Trigger: called from assistant with clinical confidence greater than 85 percent, or manually launched from patient drillthrough.
- Inputs: patientId, episodeOfCare, carePlanPhase, role, unit, shift, dateRange, topic, recentObservations, medList, activeProblems, labsImaging optional.
- Outputs: status, clinicalRecommendation, actionItems, responsibleParty, timeline, patientEducationPoints, consultationRequests.
- One-sentence clinical purpose: creates a concise patient-specific insight summary grounded in current clinical and operational context.
- Step-by-step logic:
  1. Retrieve the latest patient summary, active problems, meds, vitals, therapy status, and care plan goals.
  2. Select the topic-specific scoring or summarization path.
  3. Check for high-risk changes in condition, conflicting signals, or missing data.
  4. Generate a concise summary with risk level, drivers, recommended next steps, and follow-up owner.
  5. If ambiguity or critical risk is detected, add clinician escalation instructions.
- Clinical validation steps:
  1. Compare the output against current facility pathways and approved knowledge.
  2. Check contraindications in the active medication list and allergy profile.
  3. Verify that the recommendation does not conflict with documented goals of care.

## 3. SendClinicalAlert

- Clinical purpose: routes an urgent clinical or safety alert to the right role, channel, and timeframe.
- Trigger: assistant request, Fabric Activator rule, workflow rule breach, or threshold event from risk analytics.
- Inputs: patientId optional, role, unit, shift, severity, alertType, message, topic, recommendedActions, escalationOwner, acknowledgmentRequired.
- Outputs: status, alertId, sentAt, responsibleParty, acknowledgmentStatus, escalationTimeline.
- One-sentence clinical purpose: sends time-sensitive alerts for clinical deterioration, safety hazards, or care gaps.
- Step-by-step logic:
  1. Classify the alert by severity, patient scope, and required owner.
  2. Select the allowed communication channel by policy and urgency.
  3. Dispatch the alert with patient-safe context and explicit next steps.
  4. Track acknowledgment and escalate if response time targets are missed.
  5. Log the event for audit and follow-up review.
- Clinical validation steps:
  1. Confirm alert criteria match facility protocol and evidence thresholds.
  2. Suppress duplicates or low-value repeat alerts where policy allows.
  3. Verify that the alert contains minimum necessary PHI only.

## 4. CreateClinicalDocument

- Clinical purpose: generates a structured clinical or operational document from current data and workflow context.
- Trigger: called from assistant after user confirmation, or launched from a dashboard remediation queue.
- Inputs: patientId optional, documentType, role, unit, dateRange, topic, payloadJson, sourceReferences, clinicalContext.
- Outputs: status, fileUrl, recordKey, suggestedReviewOwner, completionTimeline.
- One-sentence clinical purpose: drafts a facility-approved clinical document for review and completion.
- Step-by-step logic:
  1. Identify the document type and required sections.
  2. Pull the supporting structured data and relevant narrative context.
  3. Populate the template using the minimum necessary clinical detail.
  4. Flag uncertain or missing sections instead of inventing content.
  5. Route the draft to the designated reviewer or signer.
- Clinical validation steps:
  1. Compare content with source records and facility template rules.
  2. Flag unresolved conflicts or stale documentation.
  3. Verify that generated text stays within approved documentation scope.

## 5. UpdateCarePlanFromInsights

- Clinical purpose: proposes care plan updates based on validated insight signals and care variance.
- Trigger: assistant call with approved workflow path, or risk workflow detecting a sustained change.
- Inputs: patientId, episodeOfCare, carePlanPhase, topic, currentCarePlan, insightPayload, role, unit, shift.
- Outputs: status, suggestedCarePlanUpdates, actionItems, responsibleParty, timeline, recordKey.
- One-sentence clinical purpose: recommends care plan changes when current risks or outcomes indicate the plan is no longer adequate.
- Step-by-step logic:
  1. Retrieve the active care plan, goals, interventions, and recent progress.
  2. Compare current risk and outcome signals to expected plan performance.
  3. Generate recommended additions, removals, or timing updates.
  4. Route proposed changes for clinician review before activation.
  5. Log accepted or rejected changes for governance review.
- Clinical validation steps:
  1. Verify alignment with current diagnoses, goals, and orders.
  2. Check for contradictions with restrictions, precautions, or goals of care.
  3. Require clinician signoff before any plan change becomes active.

## 6. TriggerMedicationReview

- Clinical purpose: initiates pharmacist or nurse review when medication-related risk is detected.
- Trigger: assistant request, Fabric Activator rule, med reconciliation variance, or new high-risk medication event.
- Inputs: patientId, medList, activeProblems, allergyList, renalHepaticFlags optional, recentFalls optional, severity, dateRange.
- Outputs: status, clinicalRecommendation, consultationRequests, responsibleParty, timeline, alertId.
- One-sentence clinical purpose: routes medication safety concerns to a qualified reviewer before harm occurs.
- Step-by-step logic:
  1. Gather the current medication list, allergies, diagnoses, and recent relevant events.
  2. Check for duplication, interaction, dose mismatch, risky class combinations, or reconciliation gaps.
  3. Prioritize the review by severity and time sensitivity.
  4. Notify the assigned pharmacist or clinician with structured findings.
  5. Track review completion and unresolved items.
- Clinical validation steps:
  1. Confirm the source medication list is the current reconciled list.
  2. Check documented allergies and major contraindications.
  3. Verify that the workflow result is advisory and routed to human review.

## 7. InitiateFallResponseProtocol

- Clinical purpose: initiates the facility fall response and reassessment workflow after a fall or near-fall signal.
- Trigger: assistant request, incident report event, sensor event, or Activator rule meeting threshold criteria.
- Inputs: patientId, episodeOfCare, location, eventTime, recentMeds, recentVitals, mobilityStatus, witnessNotes optional, severity.
- Outputs: status, actionItems, responsibleParty, timeline, alertId, suggestedCarePlanUpdates.
- One-sentence clinical purpose: identifies patients at imminent risk of fall-related harm and initiates the preventive or post-fall protocol.
- Step-by-step logic:
  1. Retrieve the latest fall history, mobility status, vitals, toileting status, and sedating medications.
  2. Apply the facility fall assessment rules or Morse-style scoring path.
  3. If thresholds are met, trigger nursing assessment and interdisciplinary follow-up.
  4. Generate preventive actions, reassessment timing, and environmental checks.
  5. Document the protocol launch and outstanding follow-up items.
- Clinical validation steps:
  1. Compare the triggered path against the facility post-fall protocol.
  2. Check medications and orthostatic or neurologic risk factors for contraindications.
  3. Verify that reassessment timing meets policy.

## 8. InitializeInfectionControlProtocol

- Clinical purpose: starts infection prevention and containment workflows when surveillance signals or confirmed infections are detected.
- Trigger: assistant request, lab event, outbreak rule, isolation gap rule, or Fabric Activator condition.
- Inputs: patientId optional, unit, organism optional, symptoms, isolationStatus, caseCount, onsetWindow, roomStatus, environmentalStatus.
- Outputs: status, clinicalRecommendation, actionItems, responsibleParty, timeline, alertId, consultationRequests.
- One-sentence clinical purpose: initiates containment and review actions for possible infection transmission or outbreak risk.
- Step-by-step logic:
  1. Gather current cases, symptoms, labs, isolation orders, room cleaning status, and exposure links.
  2. Evaluate whether the signal is patient-specific, unit-specific, or outbreak-level.
  3. Trigger infection prevention review, isolation checks, and environmental tasks as needed.
  4. Notify the right owners and assign deadlines.
  5. Monitor recurrence and unresolved containment tasks.
- Clinical validation steps:
  1. Check CDC or facility outbreak criteria against the signal.
  2. Verify isolation requirements and room turnover steps.
  3. Flag mismatches between lab results, isolation state, and room cleaning completion.

## 9. GenerateQualityMeasureReport

- Clinical purpose: compiles a measure report for quality, compliance, or executive review.
- Trigger: scheduled recurrence, manual request, or quality dashboard export.
- Inputs: role, unit, facility, dateRange, measureSet, benchmarkSet, department, exportType, recurrence.
- Outputs: status, fileUrl, pdfUrl, recordCount, qualitySummary, actionItems, responsibleParty.
- One-sentence clinical purpose: produces a benchmarked quality and compliance report that highlights risk, trend, and remediation needs.
- Step-by-step logic:
  1. Pull the selected quality measures and benchmark definitions.
  2. Compute current performance, trend, numerator and denominator logic, and variance to target.
  3. Highlight statistically or operationally significant deterioration.
  4. Add remediation recommendations and assigned owners.
  5. Publish or distribute the report to approved recipients.
- Clinical validation steps:
  1. Verify the measure definitions and denominator logic match CMS or facility specifications.
  2. Check data completeness and source freshness.
  3. Flag benchmark or attribution inconsistencies for quality review.
