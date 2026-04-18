# Detailed Topic Specs

## Welcome / Start
- Purpose: Welcome users, set expectations, and hand off to note creation, audit, parsing, handoff, or guidance.
- Trigger intent examples: start; help me document; create a therapy note; what can you do
- Topic description optimized for generative orchestration: Use this topic to welcome the therapist, explain TheraDoc capabilities, and route the conversation to the correct intake or guidance topic without collecting clinical detail yet.
- Required variables: `sessionGoal`
- Optional variables: `discipline`, `noteType`
- Question flow: Ask what the user needs: generate note, revise note, audit, parse brain dump, nursing handoff, or documentation guidance.
- Follow-up logic: If the user already stated a clear goal, skip the question and route immediately.
- Branching logic: Route based on `sessionGoal`.
- Action invocation mapping: none
- Output variables: `sessionGoal`
- Recovery behavior: If unclear, hand off to Ambiguous Request Disambiguation.

## Ambiguous Request Disambiguation
- Purpose: Resolve vague requests with one narrow question.
- Trigger intent examples: help; do a note; fix this; make it better
- Topic description optimized for generative orchestration: Use this topic when the request could map to more than one workflow. Ask one concise clarification question and then transfer to the correct topic.
- Required variables: `sessionGoal`
- Optional variables: `discipline`, `noteType`
- Question flow: Ask the single highest-value clarification, usually workflow first.
- Follow-up logic: One question only, then reroute.
- Branching logic: Generate note -> intake topic; Revise -> Redo / Revise Note; Audit -> Audit Existing Note; Brain dump -> Parse Brain Dump; Handoff -> Nursing Handoff; Guidance -> Documentation Guidance.
- Action invocation mapping: none
- Output variables: `sessionGoal`
- Recovery behavior: If still unclear, show short capability list and ask again.

## PT Daily Note Intake
- Purpose: Collect the minimum clinically meaningful PT daily note data.
- Trigger intent examples: write a PT daily note; PT daily; generate PT treatment note
- Topic description optimized for generative orchestration: Use this topic for PT daily note intake. Capture mobility tasks, interventions, assist level, measurable performance, response, skilled rationale, and next-visit plan with as few questions as possible.
- Required variables: `discipline=PT`, `noteType=Daily`, `interventions`, `assistLevelOrCueing`, `measurablePerformance`, `responseTolerance`, `skilledNeed`
- Optional variables: `patientId`, `sessionDate`, `goalsAddressed`, `precautions`, `deviceOrEquipment`, `planNextVisit`
- Question flow: Confirm daily PT note only if not already known. Ask for interventions if missing. Ask for assist level or cueing if missing. Ask for measurable performance if missing. Ask for response or limiting factors if missing. Ask what made skilled PT necessary only if not already evident.
- Follow-up logic: One missing item at a time. Stop once Generate Note has enough data.
- Branching logic: If the user pasted long free text, branch to Parse Brain Dump first.
- Action invocation mapping: Generate Note after minimum required fields are present.
- Output variables: all collected fields plus `generatedNoteDraft`
- Recovery behavior: If conflicting data appears, ask a single clarification question before generation.

## OT Daily Note Intake
- Purpose: Collect the minimum clinically meaningful OT daily note data.
- Trigger intent examples: write an OT daily note; OT treatment note; document OT session
- Topic description optimized for generative orchestration: Use this topic for OT daily note intake. Capture ADLs, IADLs, UE or cognitive-perceptual work, assist level, measurable function, response, skilled rationale, and next plan with minimal questioning.
- Required variables: `discipline=OT`, `noteType=Daily`, `interventions`, `assistLevelOrCueing`, `measurablePerformance`, `responseTolerance`, `skilledNeed`
- Optional variables: `patientId`, `sessionDate`, `goalsAddressed`, `precautions`, `adaptiveEquipment`, `planNextVisit`
- Question flow: Ask only for missing OT daily essentials.
- Follow-up logic: Same scoped-question rule as PT.
- Branching logic: Brain dump -> Parse Brain Dump.
- Action invocation mapping: Generate Note.
- Output variables: all collected fields plus `generatedNoteDraft`
- Recovery behavior: If ADL vs UE focus is unclear, ask one narrow question to determine the primary skilled focus.

## ST Daily Note Intake
- Purpose: Collect the minimum clinically meaningful ST daily note data.
- Trigger intent examples: write an ST daily note; speech daily note; document swallowing therapy
- Topic description optimized for generative orchestration: Use this topic for ST daily note intake. Capture swallowing or communication focus, cueing, measurable response, relevant diet or liquid details, skilled rationale, and recommendations.
- Required variables: `discipline=ST`, `noteType=Daily`, `interventions`, `assistLevelOrCueing`, `measurablePerformance`, `responseTolerance`, `skilledNeed`
- Optional variables: `patientId`, `sessionDate`, `goalsAddressed`, `dietTexture`, `liquidConsistency`, `recommendations`, `planNextVisit`
- Question flow: Ask only for the most important missing ST field each turn.
- Follow-up logic: Stop once data is sufficient to document safely.
- Branching logic: Swallowing focus with missing diet detail -> ask diet/liquid question before generation. Brain dump -> Parse Brain Dump.
- Action invocation mapping: Generate Note.
- Output variables: all collected fields plus `generatedNoteDraft`
- Recovery behavior: If swallowing safety is referenced without the relevant recommendation detail, ask one targeted follow-up.

## Progress Note Intake
- Purpose: Collect reporting-period, goal-progress, and skilled-update details across disciplines.
- Trigger intent examples: progress note; weekly progress; update goals
- Topic description optimized for generative orchestration: Use this topic to collect cross-discipline progress-note inputs, including period, goals addressed, measurable change, remaining deficits, skilled rationale, and ongoing plan.
- Required variables: `discipline`, `noteType=Progress`, `reportingPeriod`, `goalsAddressed`, `measurableProgress`, `ongoingDeficits`, `skilledNeed`
- Optional variables: `patientId`, `responseTolerance`, `barriers`, `planNextPeriod`
- Question flow: Get discipline if missing, then collect reporting period and progress essentials.
- Follow-up logic: Ask one focused question at a time.
- Branching logic: If the user provides an existing draft, route through Redo / Revise Note or Audit depending on request.
- Action invocation mapping: Generate Note.
- Output variables: `generatedNoteDraft`
- Recovery behavior: If no measurable change is available, ask whether the note should emphasize maintenance, plateau, or limited progress with barriers.

## Discharge Note Intake
- Purpose: Collect discharge status, outcomes, recommendations, and handoff implications.
- Trigger intent examples: discharge note; discharge summary; therapy discharge
- Topic description optimized for generative orchestration: Use this topic to collect discharge documentation inputs, including status at discharge, outcomes, unresolved deficits, education, recommendations, and disposition.
- Required variables: `discipline`, `noteType=Discharge`, `statusAtDischarge`, `goalsAddressed`, `outcomes`, `recommendations`
- Optional variables: `patientId`, `barriers`, `caregiverEducation`, `durableMedicalEquipment`
- Question flow: Ask for discipline first if missing, then only the essential discharge fields.
- Follow-up logic: One question at a time.
- Branching logic: If nursing communication is also requested, sequence Generate Note first and then Nursing Handoff.
- Action invocation mapping: Generate Note, optional Nursing Handoff.
- Output variables: `generatedNoteDraft`, `nursingHandoffDraft`
- Recovery behavior: If discharge destination or recommendation affects safety and is missing, ask before completion.

## Evaluation / Assessment Intake
- Purpose: Collect initial evaluation or assessment elements when enabled.
- Trigger intent examples: eval; assessment note; initial evaluation
- Topic description optimized for generative orchestration: Use this topic to gather concise evaluation data, relevant baseline findings, functional deficits, skilled rationale, and plan of care inputs.
- Required variables: `discipline`, `noteType=Evaluation`, `reasonForReferral`, `baselineDeficits`, `functionalImpact`, `skilledNeed`, `planRecommendation`
- Optional variables: `precautions`, `priorLevelOfFunction`, `caregiverSupport`
- Question flow: Ask for the fewest eval-specific items needed for a defensible assessment.
- Follow-up logic: One targeted clarification at a time.
- Branching logic: If the org does not use eval generation, disable this topic.
- Action invocation mapping: Generate Note.
- Output variables: `generatedNoteDraft`
- Recovery behavior: If referral reason or baseline is missing, ask before generation.
