# Detailed Topic Specs Continued

## Generate Note Orchestration
- Purpose: Central routing topic that decides whether to parse text, ask one more question, or invoke Generate Note.
- Trigger intent examples: generate the note; write it; use this info
- Topic description optimized for generative orchestration: Use this topic to evaluate whether intake is sufficient, whether brain-dump parsing should happen first, and when to call the Generate Note action.
- Required variables: `discipline`, `noteType`
- Optional variables: all intake variables, `formatPreference`, `parsedBrainDump`
- Question flow: Usually none. Ask only the single highest-value missing field if generation is not yet safe.
- Follow-up logic: If enough info exists, skip questions and call the action.
- Branching logic: Unstructured long input -> Parse Brain Dump. Existing draft + requested changes -> Redo / Revise Note. Existing note + quality check request -> Audit Existing Note.
- Action invocation mapping: Parse Brain Dump, Generate Note
- Output variables: `generatedNoteDraft`
- Recovery behavior: On action failure, go to Error / Timeout Recovery.

## Audit Existing Note
- Purpose: Review an existing note and suggest concise fixes.
- Trigger intent examples: audit this note; check compliance; is this skilled enough
- Topic description optimized for generative orchestration: Use this topic to review an existing note for skilled language, measurable function, medical necessity, completeness, and documentation risk.
- Required variables: `noteText`
- Optional variables: `discipline`, `noteType`
- Question flow: Ask for the note text only if not already supplied.
- Follow-up logic: If the request is about a generated draft, reuse the draft.
- Branching logic: If the user wants a rewritten version after audit, route to Redo / Revise Note.
- Action invocation mapping: Audit Note
- Output variables: `auditResult`
- Recovery behavior: If the note is too short to audit meaningfully, say so and ask for more text.

## Parse Brain Dump
- Purpose: Convert rough therapist text into structured note-ready variables.
- Trigger intent examples: parse this; here is my brain dump; turn this into a note
- Topic description optimized for generative orchestration: Use this topic to normalize pasted therapist text into structured fields, preserving clinical meaning and flagging uncertainty without over-interpreting unsupported content.
- Required variables: `brainDumpText`
- Optional variables: `discipline`, `noteType`
- Question flow: Ask for discipline or note type only if absolutely required after parsing.
- Follow-up logic: After parsing, ask one missing-field question only if Generate Note still cannot run.
- Branching logic: Parsed enough for generation -> Generate Note Orchestration. User only wanted structure -> return parsed summary.
- Action invocation mapping: Parse Brain Dump
- Output variables: `parsedBrainDump`
- Recovery behavior: On parse failure, offer manual structured intake or retry.

## Nursing Handoff
- Purpose: Produce concise nurse-facing SBAR content.
- Trigger intent examples: nursing handoff; make an SBAR; summary for nursing
- Topic description optimized for generative orchestration: Use this topic to create a concise nursing-facing summary from therapy findings, safety concerns, current function, and recommendations.
- Required variables: `currentStatus`, `nursingRelevantConcerns`
- Optional variables: `discipline`, `recommendations`, `recentTherapyFindings`
- Question flow: Ask only for the minimum nurse-relevant details if missing.
- Follow-up logic: One focused question at a time.
- Branching logic: If source material is a rehab note or brain dump, optionally parse or extract first.
- Action invocation mapping: Nursing Handoff
- Output variables: `nursingHandoffDraft`
- Recovery behavior: If insufficient nurse-relevant detail exists, ask for safety status or key recommendation before calling the action.

## Redo / Revise Note
- Purpose: Regenerate or refine a draft note based on user feedback.
- Trigger intent examples: redo this; make it more skilled; shorten the note
- Topic description optimized for generative orchestration: Use this topic when the user wants a generated or existing note revised for style, detail, clarity, compliance, or format preference.
- Required variables: `noteText`, `revisionRequest`
- Optional variables: `discipline`, `noteType`, `formatPreference`
- Question flow: Ask only what should change if not already stated.
- Follow-up logic: Keep revisions scoped and do not re-collect unchanged intake.
- Branching logic: If the user requests quality review first, call Audit Note before regeneration.
- Action invocation mapping: Generate Note, optionally Audit Note first
- Output variables: `generatedNoteDraft`
- Recovery behavior: If revision request is vague, ask one narrow question such as "Do you want it shorter, more skilled, or more measurable?"

## Documentation Guidance / What Do You Need From Me
- Purpose: Answer guidance questions using knowledge sources first.
- Trigger intent examples: what do you need for an ST daily note; how should I write a skilled PT note; what info do you need from me
- Topic description optimized for generative orchestration: Use this topic for documentation education, required-elements questions, and note-format guidance. Prefer configured knowledge sources over tool calls.
- Required variables: `guidanceQuestion`
- Optional variables: `discipline`, `noteType`
- Question flow: Usually none beyond identifying discipline or note type if the question is underspecified.
- Follow-up logic: Ask one disambiguation question only if needed to answer accurately.
- Branching logic: If the user pivots from guidance to note creation, route into the matching intake topic.
- Action invocation mapping: none by default
- Output variables: none required
- Recovery behavior: If knowledge does not cover the question, provide best available grounded guidance and note the limit.

## Compliance Help / Why This Might Not Be Skilled
- Purpose: Explain why wording is weak and what skilled elements are missing.
- Trigger intent examples: why is this not skilled; what is missing; help with compliance
- Topic description optimized for generative orchestration: Use this topic to explain compliance risks, weak phrasing, and missing skilled elements using the compliance knowledge sources and Audit Note when useful.
- Required variables: `noteText` or `complianceQuestion`
- Optional variables: `discipline`, `noteType`
- Question flow: If note text exists, audit it. Otherwise answer from knowledge.
- Follow-up logic: Ask for the note text only if practical improvement requires it.
- Branching logic: Note present -> Audit Existing Note. General question -> knowledge-based explanation.
- Action invocation mapping: Audit Note when note text is present
- Output variables: `auditResult`
- Recovery behavior: If the question is too broad, ask for the note type or sample wording at issue.

## Format Preference / Net Health Style
- Purpose: Capture or change output style preferences.
- Trigger intent examples: use Net Health style; make it SOAP; keep it concise narrative
- Topic description optimized for generative orchestration: Use this topic to set the user’s preferred output style for generated notes and revisions.
- Required variables: `formatPreference`
- Optional variables: none
- Question flow: Offer concise narrative, lightly labeled SOAP-style, or Net Health / Rehab Optima-style.
- Follow-up logic: No further questions unless user wants custom formatting rules.
- Branching logic: Save preference for later Generate Note calls.
- Action invocation mapping: none directly
- Output variables: `formatPreference`
- Recovery behavior: Default to Net Health-style concise narrative when unspecified.

## New Session / Start Over
- Purpose: Reset intake state cleanly.
- Trigger intent examples: start over; new patient; reset
- Topic description optimized for generative orchestration: Use this topic to clear session-scoped variables and restart cleanly for a new task or patient.
- Required variables: none
- Optional variables: none
- Question flow: Confirm only if there is risk of losing important draft context.
- Follow-up logic: Keep brief.
- Branching logic: Return to Welcome / Start after reset.
- Action invocation mapping: none
- Output variables: variables cleared
- Recovery behavior: If reset fails, tell the user to start a new chat session.

## Error / Timeout Recovery
- Purpose: Recover from tool failure, timeout, or partial outputs.
- Trigger intent examples: automatic on action failure
- Topic description optimized for generative orchestration: Use this topic when Parse Brain Dump, Nursing Handoff, Audit Note, or Generate Note fails or times out. Preserve user effort and offer the safest next step.
- Required variables: `failedActionName`
- Optional variables: `lastSuccessfulInputs`, `failureReason`
- Question flow: No broad re-entry. Offer retry, continue manually, or switch workflow.
- Follow-up logic: Default to manual continuation using already captured variables.
- Branching logic: Parse failure -> ask whether to continue with manual intake. Handoff failure -> offer concise manual SBAR generation from known facts. Audit failure -> offer knowledge-based checklist. Generate failure -> keep collected data and retry once.
- Action invocation mapping: optional retry of the failed action
- Output variables: preserve all previously collected context
- Recovery behavior: Never discard user-provided intake unless the user starts over.
