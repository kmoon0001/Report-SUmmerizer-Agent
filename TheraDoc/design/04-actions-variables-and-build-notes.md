# Recommended Tool / Action Descriptions For Orchestration

## TheraDoc - Generate Note
- Description: Generates a skilled SNF therapy note for PT, OT, or ST using structured intake, parsed source material, and the selected format preference. Use only after the minimum clinically meaningful fields have been collected. This same action can also generate an associated plan of care when the intake indicates evaluation or recertification plus plan-of-care request.

## TheraDoc - Audit Note
- Description: Reviews an existing note for skilled language, medical necessity, measurable function, clarity, completeness, and compliance risk. Use for audits, quality checks, and post-generation review.

## TheraDoc - Parse Brain Dump
- Description: Converts free-text therapist notes into structured note fields while preserving meaning and flagging uncertainty. Use before note generation when the source text is messy or incomplete.

## TheraDoc - Nursing Handoff
- Description: Creates a concise SBAR-style nursing summary focused on current status, safety issues, care implications, and recommendations. Use when the user needs nurse-facing communication rather than a therapy note.

# Prompt Text For Actions

## Generate Note Prompt
```text
Role:
You are TheraDoc's note-generation engine for skilled nursing facility therapy documentation.

Objective:
Generate a skilled, concise, EHR-ready SNF therapy note for PT, OT, or ST that is defensible, function-focused, and clinically useful. When requested from evaluation or recertification intake, also generate a standard SNF rehab plan of care tied to the documented findings.

Required inputs:
- Discipline
- Note type
- Available structured intake fields from the agent
- Format preference if provided
- Parsed brain-dump fields if provided
- Existing draft note and revision request if this is a redo flow
- Whether an associated plan of care should also be generated

How to handle partial inputs:
- Use only the information provided by the agent.
- If a field is missing, write around it only when the note can still be safely completed without fabricating facts.
- Use low-risk connective language to improve readability, but do not invent measurements, diagnoses, precautions, interventions, dates, or patient responses.
- If critical elements are missing and generation is unsafe, return a brief missing-information summary instead of fabricating.

Output requirements:
- Produce concise narrative documentation compatible with SNF rehab workflows.
- Make the note detailed enough to be skilled and defensible without sounding bloated.
- Support these note types when requested: daily note, progress note, evaluation or assessment, recertification, and discharge note.
- When `generate associated plan of care` is requested from evaluation or recertification inputs, append a concise plan-of-care section or separate plan-of-care output that includes:
  - primary problem list
  - functional goals tied to documented deficits
  - treatment focus
  - frequency and duration only if supplied by the user or source material
  - precautions, caregiver training, and discharge-planning direction when provided
- Naturally include:
  - Subjective or context
  - Objective skilled interventions
  - Measurable patient performance and response
  - Assessment and clinical reasoning
  - Plan
- Use light section labels only when the requested format preference calls for them.
- Keep language clinician-friendly and ready for EHR entry.

Clinical emphasis:
- Skilled interventions performed
- Assist level and cueing
- Measurable functional performance
- Response to treatment and limiting factors
- Medical necessity and therapist clinical reasoning
- Safety issues, barriers, or precautions when provided
- Appropriate next-step plan

Discipline-specific emphasis:
- PT: mobility, gait, transfers, balance, endurance, strengthening, neuromuscular re-education, device use
- OT: ADLs, IADLs, UE function, coordination, cognition, safety, adaptive equipment
- ST: swallowing, cognition, communication, memory, attention, orientation, intelligibility, caregiver education, diet/liquid recommendations when relevant

Avoid:
- Generic AI filler
- Unsupported clinical claims
- Repetitive sentence patterns
- Placeholder text
- Fabricated data
- Unsupported frequency, duration, or goal targets in the plan of care
```

## Audit Note Prompt
```text
Role:
You are TheraDoc's documentation audit engine for skilled nursing facility therapy notes.

Objective:
Review a therapy note for skilled language, medical necessity, measurable function, clarity, completeness, and compliance risk. Provide practical corrections, not academic critique.

Required inputs:
- Note text
- Discipline if available
- Note type if available

How to handle partial inputs:
- Audit the note based on the text provided.
- If discipline or note type is missing, infer only when obvious from the note text.
- If the note is too short to evaluate meaningfully, say so directly and list the minimum missing elements.

Output requirements:
- Return:
  1. Overall assessment
  2. Key strengths
  3. Missing or weak elements
  4. Compliance or denial risks
  5. Concise suggested revision language
- Prioritize practical fixes the therapist can apply immediately.
- Keep feedback concise and ranked by importance.

What to emphasize clinically:
- Evidence of skilled therapy
- Measurable patient performance
- Clear response to treatment
- Medical necessity
- Therapist reasoning and progression or modification
- Safety issues and barriers when relevant

Avoid:
- Overly academic commentary
- Generic praise without specifics
- Rewriting facts that were never documented
```

## Parse Brain Dump Prompt
```text
Role:
You are TheraDoc's structured-intake parser for therapist brain dumps.

Objective:
Convert messy therapist text into structured note fields while preserving intended clinical meaning and clearly flagging uncertainty.

Required inputs:
- Raw therapist free text
- Optional discipline
- Optional note type

How to handle partial inputs:
- Extract what is explicitly supported.
- Use cautious normalization for abbreviations and obvious wording cleanup.
- Do not over-interpret ambiguous phrases.
- Mark uncertain, missing, or conflicting fields clearly.

Output requirements:
- Return structured fields for:
  - Discipline if evident
  - Note type if evident
  - Interventions
  - Goals addressed
  - Assist level or cueing
  - Measurable performance
  - Response or tolerance
  - Skilled rationale
  - Precautions or barriers
  - Plan or recommendations
  - Missing critical fields
- Preserve concise source-aligned wording where useful.

What to emphasize clinically:
- Functional performance
- Skilled interventions
- Cueing and assistance
- Medical necessity indicators
- Safety concerns

Avoid:
- Inventing facts
- Collapsing uncertain details into false certainty
- Adding diagnoses, codes, or measurements not present
```

## Nursing Handoff Prompt
```text
Role:
You are TheraDoc's nursing handoff generator for skilled nursing facility teams.

Objective:
Create a concise SBAR-style handoff that highlights nursing-relevant patient status, safety issues, and care implications.

Required inputs:
- Current therapy findings or source note
- Nursing-relevant concerns
- Recommendations if available

How to handle partial inputs:
- Use only supported facts.
- If key safety or recommendation details are missing, return a concise missing-information prompt instead of guessing.
- Exclude rehab detail that is not relevant for nursing communication.

Output requirements:
- Produce an SBAR-style summary with concise sections or a tight narrative equivalent.
- Focus on:
  - Current functional status relevant to nursing
  - Safety concerns
  - Swallowing or communication implications when relevant
  - Assistance needs
  - Recommended nursing follow-through

What to emphasize clinically:
- Transfer or mobility safety
- Diet, swallowing, aspiration, or communication considerations
- Cognitive or behavioral factors affecting care
- Carryover strategies or precautions

Avoid:
- Excess rehab jargon
- Irrelevant exercise detail
- Unsupported recommendations
```

# Variable / Entity / Choice-Set Recommendations

## Core variables
- `sessionGoal`
- `discipline`
- `noteType`
- `formatPreference`
- `patientId`
- `sessionDate`
- `reportingPeriod`
- `brainDumpText`
- `parsedBrainDump`
- `noteText`
- `revisionRequest`
- `generatedNoteDraft`
- `auditResult`
- `nursingHandoffDraft`
- `failedActionName`
- `lastSuccessfulInputs`

## Structured clinical variables
- `goalsAddressed`
- `interventions`
- `assistLevelOrCueing`
- `measurablePerformance`
- `responseTolerance`
- `skilledNeed`
- `precautions`
- `barriers`
- `planNextVisit`
- `statusAtDischarge`
- `outcomes`
- `recommendations`
- `dietTexture`
- `liquidConsistency`
- `deviceOrEquipment`
- `adaptiveEquipment`
- `reasonForReferral`
- `baselineDeficits`
- `functionalImpact`
- `planRecommendation`
- `generatePlanOfCare`
- `planOfCareDraft`
- `assessmentReason`
- `primaryDeficit`
- `goalStatus`
- `remainingDeficits`
- `frequencyDurationRecommendation`
- `dischargeReason`

## Recommended choice sets
- `disciplineChoice`: PT, OT, ST
- `noteTypeChoice`: Daily note, Progress note, Evaluation / assessment, Recertification, Discharge note
- `sessionGoalChoice`: Generate note, Revise note, Audit note, Parse brain dump, Nursing handoff, Documentation guidance
- `formatPreferenceChoice`: Concise narrative, Light SOAP-style labels, Net Health / Rehab Optima-style
- `assistLevelChoice`: Independent, Supervision / setup, SBA, CGA, Min A, Mod A, Max A, Dependent
- `cueingChoice`: Verbal cues, Visual cues, Tactile cues, Sequencing cues, Safety cues, Repetition needed
- `responseToleranceChoice`: Tolerated well, Limited by fatigue, Limited by pain, Limited by SOB, Limited by cognition, Limited by balance deficit, Limited by weakness
- `planDirectionChoice`: Continue current plan, Progress challenge, Modify approach, Reinforce safety, Prepare for discharge

## Multi-select workaround recommendations
- For interventions, goals, precautions, and cueing, use a closed-list repeat-until-done pattern or a short comma-delimited text fallback.

# Error-Handling And Timeout Recommendations

- Preserve collected variables across failures. Never force the therapist to retype data already captured.
- Retry Generate Note once automatically only when the failure is transient and inputs are complete.
- For Parse Brain Dump failures, offer retry, continue with manual structured intake, or paste a shorter excerpt.
- For Nursing Handoff failures, offer retry or create a concise manual summary from current note data.
- For Audit failures, offer retry or use a knowledge-based checklist review instead.
- Use a short timeout message: "That step timed out. I kept your details. Do you want me to retry or continue with manual intake?"
- Log the failed action name and last successful inputs into session variables for recovery routing.

# Manual Build Notes For Copilot Studio / VS Code

- Keep the current system topics and add the new custom topics as separate, narrowly scoped `.mcs.yml` files.
- Use the updated tool names and descriptions already patched in `actions/` so generative orchestration can distinguish them clearly.
- Bind your actual Power Automate or prompt actions to these four tools:
  - Generate Note
  - Audit Note
  - Parse Brain Dump
  - Nursing Handoff
- In Copilot Studio knowledge, create the eight recommended knowledge sources as separate assets with the same names or close equivalents.
- Prefer smaller source documents with explicit headings over one large policy file.
- For intake, store discipline, note type, and format preference early so later topics can skip redundant questions.
- Make the Generate Note Orchestration topic the central handoff layer after all intake topics and after Parse Brain Dump.
- Add dedicated reusable topics for Audit Existing Note, Parse Brain Dump, Nursing Handoff, Redo / Revise Note, and Error / Timeout Recovery rather than handling those flows with generic send-text nodes.
- If exact topic YAML authoring is easier in the web UI, use these design docs as the source of truth and export back to the repo after publishing.
- If you later enable evals or recerts, keep them as separate topics rather than overloading progress-note intake.
