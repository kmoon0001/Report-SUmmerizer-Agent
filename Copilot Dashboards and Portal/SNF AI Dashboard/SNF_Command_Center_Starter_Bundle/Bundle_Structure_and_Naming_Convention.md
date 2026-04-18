# Bundle Structure And Naming Convention

## Naming Standard

- Use `Title_Case_With_Underscores` for bundle file names.
- Prefix top-level folders with a two-digit sequence number.
- Keep file names descriptive, role-neutral, and domain-specific.
- Avoid `final`, `new`, `v2`, `copy`, `misc`, `stuff`, and `Untitled`.
- Prefer singular nouns for core artifacts unless the file is a library or index.
- Use suffixes consistently:
  - `_Checklist`
  - `_Matrix`
  - `_Library`
  - `_Manifest`
  - `_Protocol`
  - `_Program_Description`
  - `_Specs`
  - `_Template`

## Content Rules

- PDFs and DOCX files represent controlled documents or templates.
- XLSX files represent inventories, dictionaries, matrices, manifests, or specifications.
- MD files represent implementation guidance, structure, and project-readable documentation.
- TXT files are reserved for short standard language such as warnings or disclaimers.
- In the starter bundle, CSV may be used as the editable source format for future XLSX artifacts until a controlled office-document version is needed.
- Do not use placeholders, shortcut file copies, or temporary naming in the final intended architecture.
- `TODO`, `AssignBeforeUse`, `Untitled`, rescue files, and one-off workaround artifacts are allowed only during active drafting and must not remain in the intended production path.
- Prefer the correct supported workflow over the fastest ad hoc workaround, especially for Copilot Studio cache, sync, and deployment files.
- Prefer Microsoft-first MCP servers where official options exist, and keep the boundary clear between docs MCP, browser MCP, and service APIs.

## Review Metadata Rules

Every governed artifact should track:

- owner
- clinical approver
- last reviewed date
- next review date
- version
- evidence source or policy source

## Folder Rules

- `00_` is for governance, charter, validation, and compliance artifacts.
- `01_` is for assistant instructions, terminology, knowledge, and communication assets.
- `02_` is for workflows, protocols, routing, and decision support.
- `03_` is for dashboards, visuals, metrics, and semantic reporting specifications.
