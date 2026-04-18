# Copilot Studio Authoring Text Standards

## Purpose

Define the default text-authoring standard for agent instructions, topic descriptions, action descriptions, and knowledge-source descriptions in this repo.

## Microsoft Learn Basis

- Agent instructions should be explicit, ordered, and focused on what the agent should do:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-instructions
- Topic YAML is generated from authored topic objects and should stay narrow and purposeful:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-code-editor
- Questions and routing should be concise, structured, and entity-aware:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-a-question
- Knowledge source names and descriptions help generative orchestration choose the right source:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-existing-copilot
- File groups work best when the name, description, and instructions clearly tell the agent what the knowledge is about and how to use it:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-file-groups

## Standard

### Agent instructions

- Put the highest-priority rules first.
- Use short, direct sentences.
- Tell the agent what to do, when to do it, and what not to do.
- Avoid long narrative prose, duplicated rules, and mixed priorities.
- Separate response style from workflow behavior.
- Put durable behavior in agent instructions before scattering the same rule across multiple topic prompts.

### Topic descriptions and model descriptions

- Keep each topic focused on one job.
- Reuse topics and branching before creating near-duplicate topics.
- Use descriptions that help orchestration understand the topic's purpose.
- Prefer the pattern `Use this topic when...`
- Do not hide runtime caveats or deployment notes inside the topic purpose text.

### Questions, entities, and slot filling

- Prefer built-in entities first.
- Use closed lists or option sets when the input is constrained and should route predictably.
- Use custom or regex-style recognition only when built-in entities and closed lists do not safely fit the need.
- Prefer structured questions and progressive disclosure over long free-text collection.

### Action descriptions

- Describe the action in terms of the user task it supports and the kind of result it returns.
- Prefer the pattern `Use this action to...`
- Keep implementation status short and secondary.
- Do not make the whole description about internal validation state.

### Knowledge source descriptions and instructions

- Keep each source narrow and purpose-specific.
- Use names that tell the agent what the source covers.
- Make descriptions detailed enough to help generative orchestration choose the right source.
- Make instructions explicit about when the source should be used and when it should not.

### File groups

- Use file groups when one agent needs different knowledge subsets by role, region, workflow, or scenario.
- Treat a file group as a named bundle of files with its own name, description, and instructions.
- File-group names should say what the grouped files are for.
- File-group descriptions should make the intended routing choice obvious.

### Canvas-first authoring

- Prefer canvas-authored topics, questions, conditions, and tool calls first.
- Use YAML to inspect, refine, or validate exported shapes after the supported authoring pattern exists.
- Do not normalize unsupported hand-authored YAML patterns into the standard workflow.

## Anti-patterns

- vague labels
- multi-purpose descriptions
- hidden caveats instead of explicit scope
- long conversational instructions with mixed priorities
- implementation notes in place of user-task descriptions
