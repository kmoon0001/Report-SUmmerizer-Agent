# PCC First Extract Playbook

## Goal

Pull the first real PCC source extract that can drive a source-to-model implementation.

## Best First Export Order

### 1. Resident List Report *NEW*

Why:
- confirmed live in PCC as a facility-wide report surface
- supports `CSV` and `EXCEL`
- exposes resident, location, admission, status, physician, and rate-type fields
- best first base model for the command center

Use these starting settings:
- output format: `CSV`
- unit: `All`
- floor: `All`
- status: `Current`

Look for fields like:
- resident number
- medical record tracking number
- resident name
- status
- unit / location
- age
- gender
- birth date
- admission date
- original admission date
- estimated discharge date
- primary physician
- primary diagnosis
- rate type
- waiting list

### 2. Patient Census

Why:
- gives patient, episode, unit, room/bed, and current-state context
- creates the base dimensions for later joins

Look for fields like:
- patient ID
- patient name
- MRN
- episode or admission ID
- unit
- room/bed
- admission date
- discharge date
- attending discipline or assigned team

### 3. Therapy Episode / Outcomes

Why:
- strongest confirmed match to the existing Power BI therapy/outcomes dashboard
- most likely path to the first real semantic model

Look for fields like:
- patient ID
- episode ID
- discipline
- therapy minutes or visits
- evaluation date
- progress date
- discharge status
- functional outcome measures
- payer / plan if available

### 4. Documentation Status

Why:
- supports actionable remediation reporting
- usually easier to operationalize than predictive data

Look for fields like:
- patient ID
- encounter or note ID
- note type
- discipline
- due datetime
- completion datetime
- signer
- status

## Export Rules

- Prefer `CSV`.
- Use the broadest operational export first, not a patient-by-patient printout.
- Include current and recent records rather than a single-patient snapshot.
- If filters are required, start with one facility or unit and the last 30 to 90 days.

## Minimum Viable First Dataset

If PCC only gives you one useful export, make it:

- `Resident List Report *NEW*` in `CSV`

If that is not available, use:

- therapy episode or clinical outcomes export

## Immediate Next Step After Export

Put the file in:

- [data/incoming](D:\my agents copilot studio\SNF Dashboard\data\incoming)

Then tell the agent:

- the filename
- what one row means
- what report it came from
- whether it is current-state, event-level, or period-level

