# Canvas App Spec: SLP Portal Companion

## Purpose

Provide a Power Apps companion launcher for the SharePoint SLP Portal bridge without storing PHI.

## Data Sources

- SharePoint site:
  - `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`
- Optional read-only libraries:
  - `Site Pages`
  - `SLP_Portal_Source_PDFs`
  - `SLP_ClinicalKnowledge`

## Screens

1. Home
   - Launch buttons to core SharePoint pages.
   - Status card for bridge validation.
   - PHI boundary notice.

2. Source PDFs
   - Gallery of source PDF metadata.
   - Search/filter by title/category if metadata exists.
   - Open PDF in SharePoint.

3. Quick Reference
   - Links to `SLP-Quick-Reference.aspx`, `SLP-IDDSI.aspx`, `SLP-Instrumentals.aspx`, `SLP-Trach-Vent.aspx`.

4. Compliance
   - Links to `SLP-Medicare-Compliance.aspx`, `SLP-Coding-Reference.aspx`, CMS/Medicare references.

5. Local Module Index
   - Links to the 21 SharePoint bridge pages.

## Controls

- Use buttons/tiles for module launch.
- Use galleries for source PDF metadata.
- No text input controls for patient data.
- No attachments control.
- No save/submit patient actions.

## Validation Rules

- App Checker must pass.
- No non-delegable source PDF search if the library grows beyond delegation limits.
- No hidden controls storing patient text.
- No formulas that write patient-specific data.

## Future Deferred

Interactive documentation, goal generation, and treatment planning require a separate governed design because they can become PHI-bearing.
