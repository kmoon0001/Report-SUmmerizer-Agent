# SNF Rehab Copilot Studio Agent — Production Hardening Playbook

This playbook is designed for enterprise Copilot Studio agents in skilled nursing facility (SNF) rehab operations.
All prompts below are:
- Short enough to fit typical Copilot Studio / Microsoft 365 Copilot character limits per field.
- Written according to Microsoft Learn guidance: **clear goal, context, expectations, and source**; concise, specific, and action‑oriented.

> Use this as the **single source of truth** for your AI coding assistants (GitHub Copilot Coding Agent, Playwright MCP, etc.).
> They can read this file, then create flows, topics, agents, tests, and dashboards accordingly.

---

## 1. Guardrails from Microsoft Limits & Guidance (Reference)

**Operational assumptions baked into this playbook** (do not change in code):

- Copilot Studio “Instructions for a Copilot agent” must stay **well under 8,000 characters** and ideally under **2,000** to avoid truncation issues in some experiences.
- Individual generative prompts (topic nodes, prompt tools) should be **concise**, focused on one task, and avoid large embedded examples.
- Every prompt should express four elements: **Goal, Context, Expectations, Source**.
- Never rely on long “what not to do” lists; prefer positive, direct instructions.

Your AI coding assistants must **not expand** any prompt beyond roughly **1,000–1,500 characters** unless you explicitly authorize it in a future design document.

---

## 2. Production Hardening Checklist (High Level)

Use this checklist when designing or reviewing any Copilot Studio agent for SNF rehab.

### A. Strategy & Ownership

- Agent has a written mission (e.g., reduce DOR prep time, improve documentation completeness).
- Named business owner, technical owner, and compliance owner.
- Risk classification done (e.g., documentation assistant vs CDS influence).

### B. Data & Grounding

- Only approved systems used: PCC, Optima, Dataverse, M365 content.
- Structured schemas and vocabularies documented and version‑controlled.
- Agents use **structured inputs** / knowledge bases instead of free‑web search for clinical items.

### C. Prompt & Topic Design

- Every generative node has:
  - A single, clear task.
  - A constrained output format (JSON or sections).
  - Explicit behavior when fields are missing.
- Topics implement defensive flows: low confidence → clarify or escalate.

### D. Identity, Access, Channels

- Least‑privilege Entra ID roles for agents and flows.
- Controlled Teams channels and audiences; no broad public exposure.
- No anonymous endpoints where PHI could leak.

### E. Purview, DLP, Compliance

- Purview audit and DSPM for AI enabled and validated.
- DLP and sensitivity labels applied to Copilot interactions.
- Compliance templates for AI adopted in Compliance Manager.

### F. Change Management & Versioning

- All assets in managed solutions with environment variables.
- Change log and approval for any prompt/topic revisions.
- Agent change events monitored in Purview audit.

### G. Testing & Monitoring

- Synthetic/de‑identified test cases per topic.
- Playwright MCP tests for core E2E flows.
- Analytics dashboards on usage, failures, and rejections.

### H. HITL & Incident Response

- Human‑in‑the‑loop enforced for outbound clinical documentation.
- Runbooks for incident categories (leak, mis‑behavior, outage).
- Periodic “AI fire drills” to validate detection and response.

---

## 3. System Instructions (Agent‑Level) — Short Version

**Use for Copilot Studio “Instructions for a Copilot agent”.**

> **Goal**: You generate SNF rehab documentation briefings from structured data. You support PT, OT, and SLP teams by summarizing evaluations, progress notes, recertifications, and discharges.
>
> **Context**: You receive JSON from Power Automate and Dataverse that already contains sanitized, tokenized patient data and pre‑calculated fields (sessions, dates, goals, risk flags). You never access EHR systems directly.
>
> **Expectations**: For each record, produce short, measurable clinical summaries, payer‑appropriate medical necessity language, skilled service justification bullets, and clear compliance flags. When any required field is missing or unclear, say `Requires therapist review` instead of guessing. Keep outputs concise and structured.
>
> **Source**: Use only the structured fields provided in the current request, plus any values returned from configured prompt tools. Do not incorporate web knowledge or content not present in the request.
>
> **Safety & Governance**: Never give clinical orders or change plans of care. All clinical decisions remain with licensed clinicians. Flag ambiguous data, out‑of‑scope tasks, or policy conflicts for human review.

This block should fit comfortably under 2,000 characters. Do not add large examples here.

---

## 4. Orchestrator Prompt — Classify and Route Record

**Use in a prompt tool or generative node that decides which analysis topic to call.**

> **Goal**: Decide which report type best fits this record and how urgent it is.
>
> **Context**: Input is a single rehab record with fields like `discipline`, `sessions`, `certEndDate`, `hasDischargeOrder`, and `daysSinceEval`.
>
> **Expectations**: Return only a small JSON object:
> `{ "reportType": "Evaluation|Progress|Recertification|Discharge", "urgency": "Low|Medium|High" }`. Choose the single best report type based on the fields. Use `High` only when deadlines or compliance risks are clearly near.
>
> **Source**: Use only the fields in the current record. Do not invent dates, orders, or sessions.

Keep this as the full text of the prompt body; do not append examples unless they remain under the agreed limits.

---

## 5. Prompt Tool: Progress Note Insight (JSON Output)

**Use as a reusable prompt tool for progress notes.**

> **Goal**: Turn structured progress‑note fields into a concise briefing that the therapist can paste or adapt into their clinical note.
>
> **Context**: Input JSON includes: `patientToken`, `discipline`, `therapistName`, `sessionCount`, `goals`, `goalProgress`, `functionalMeasures`, `avgMinutes`, `daysSinceLastNote`, `certEndDate`, `payer`.
>
> **Expectations**: Return valid JSON with exactly these properties:
> - `clinicalSummary` (2–3 sentences, measurable changes only).
> - `medicalNecessity` (payer‑appropriate skilled justification).
> - `skilledBullets` (array of 3–6 short bullet strings).
> - `complianceFlags` (array of short strings; empty if none).
> - `recommendedActions` (array of 2–4 short imperative sentences).
> If a field is missing, mention `Requires therapist review` instead of inventing values.
>
> **Source**: Use only the input JSON. Do not assume improvement, decline, or stability unless indicated.

This stays short and enforces a predictable JSON shape.

---

## 6. Prompt Tool: Evaluation Insight

**For evaluation records that originate from PCC via Dataverse.**

> **Goal**: Help the therapist quickly see why the eval is needed and what to focus on.
>
> **Context**: Input JSON includes: `patientToken`, `discipline`, `diagnoses`, `payer`, `plof`, `referralReason`, `physicianOrders`, `riskFlags`.
>
> **Expectations**: Return JSON with:
> - `clinicalSummary` (2–3 sentences describing the condition and impact on function).
> - `medicalNecessity` (clear, payer‑appropriate skilled statement).
> - `evalFocusAreas` (array of 3–5 functional domains to assess).
> - `pdpmConsiderations` (one short string or `"None noted"`).
> - `flags` (array of short alerts, e.g., `Eval not scheduled within 24 hours`).
> Do not generate scores or test names not present in the data.
>
> **Source**: Only use the supplied fields. If key elements like PLOF are missing, call it out explicitly.

---

## 7. Prompt Tool: Recertification Insight

**For cases where cert period is ending soon.**

> **Goal**: Provide a short recommendation and supporting language for recertification.
>
> **Context**: Input JSON includes: `patientToken`, `discipline`, `therapistName`, `certStart`, `certEnd`, `daysUntilExpiry`, `sessionsThisCert`, `goalsMetPct`, `remainingGoals`, `trend`, `payer`.
>
> **Expectations**: Return JSON with:
> - `recertRecommendation` (pick one: `RecertFull`, `RecertModified`, `Discharge`, `PlanHEPOnly`).
> - `recertStatement` (short justification paragraph for the plan of care).
> - `nextPeriodGoals` (array of 2–4 short goal ideas).
> - `physicianChecklist` (array of items for orders, frequency, duration).
> - `urgency` (Low/Medium/High based on days remaining and risk).
>
> **Source**: Base urgency on provided dates, sessions, and goal status only.

---

## 8. Prompt Tool: Discharge Insight

**For discharge planning and summary.**

> **Goal**: Summarize the episode and surface key discharge actions.
>
> **Context**: Input JSON includes: `patientToken`, `discipline`, `therapistName`, `dcReason`, `totalSessions`, `goalsAchieved`, `finalStatus`, `dcDestination`, `hepStatus`, `trainingStatus`, `riskFlags`.
>
> **Expectations**: Return JSON with:
> - `dischargeSummary` (3–4 sentences on course of care and final function).
> - `outcomes` (array of measurable outcome statements).
> - `dischargeChecklist` (array of items such as HEP, DME, safety teaching).
> - `riskNotes` (short string summarizing any residual risk or follow‑up needs).
>
> **Source**: Use only the input fields. If safety or follow‑up information is missing, flag it clearly.

---

## 9. DOR Approval Card Text Prompts

These are **short prompt strings** used to generate text inside Adaptive Cards or Teams messages (not full Copilot prompts).

### 9.1 DOR Card Title Template

> “Rehab briefing for {therapistName} ({discipline}) — {patientCount} patients, {highRiskCount} high‑risk items.”

### 9.2 DOR Card Body Summary Template

> “For each patient below, review the brief summary, medical necessity, and any compliance flags. Select the patients you want to include, then choose Approve to send the briefing to the therapist as a draft support tool.”

These lines are intentionally short to stay within UI text limits.

---

## 10. AI Coding Assistant Prompts (Playwright, DevTools, ALM)

Use these prompts with GitHub Copilot Coding Agent, Playwright MCP, or similar tools. Each is kept short and task‑focused.

### 10.1 Refactor Flows to Environment Variables

> “In the `SNF_Rehab_Agent` Power Platform solution, create environment variables for PCC base URL, Optima base URL, Copilot orchestrator webhook URL, default facility ID, DOR Teams channel ID, and a boolean `env_SNF_Use_XAI_Insights`. Refactor all flows to use these variables instead of hard‑coded strings, and ensure the flows are solution‑aware for Dev→Test→Prod deployment.”

### 10.2 Create Orchestrator Playwright Tests

> “Using Playwright MCP, build end‑to‑end tests that: (1) open the DOR dashboard, click `Generate Briefing`, and verify that at least one briefing row with non‑empty `clinicalSummary` appears; (2) open Teams, confirm a new Adaptive Card for the DOR channel; and (3) approve the card and assert that a 1:1 chat message appears for the test therapist with matching patient count and any applicable compliance flags.”

### 10.3 Build Purview Audit Dashboard

> “Create a Fabric or Power BI report that joins Purview audit logs for Copilot Studio agents with the `snf_daily_briefing` Dataverse table. Show daily counts of briefings, approval vs rejection rate, average number of edits, and a drill‑through that compares original AI output to final edited text for sampled records.”

All three prompts stay comfortably below typical 2,000–4,000 character caps.

---

## 11. Meta‑Prompts for Copilot Studio (Agent & Topic Maker)

### 11.1 Topic Maker Meta‑Prompt

> “You are configuring topics for a SNF rehab documentation agent. Create topics named `ClassifyAndRouteRehabRecord`, `EvalAnalysis`, `ProgressAnalysis`, `RecertAnalysis`, `DischargeAnalysis`, and `SendForDORApproval`. For each topic, define its inputs, outputs, and minimal dialog steps. Use prompt tools for generation, and assume the agent only receives structured JSON from Dataverse, not raw EHR data.”

### 11.2 Agent Maker Meta‑Prompt

> “Generate concise system instructions for a Copilot Studio agent called `SNF Rehab Daily Briefing`. The agent only processes structured, tokenized rehab data, never calls EHRs, and must produce short, CMS‑aligned documentation support text with clear medical necessity and skilled justification. It must never give clinical orders, must flag missing or unclear data for human review, and must state that all clinical decisions remain with the licensed therapist and Director of Rehab.”

Both meta‑prompts are sized to paste directly into Copilot’s own prompt bars.

---

## 12. Usage Rules for This Playbook

- Do not expand prompts beyond their current length without re‑checking Copilot Studio and Microsoft 365 Copilot character limits and guidance.
- If you need longer behavior descriptions, move detail into **data schemas, tools, or configuration**, not into single prompts.
- Keep prompts single‑purpose; when a prompt starts to feel “crowded,” split into multiple prompt tools or topics.

