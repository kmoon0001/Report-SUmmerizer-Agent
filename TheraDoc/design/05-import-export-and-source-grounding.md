# Import / Export Workflow

Use Copilot Studio solutions for import/export and solution-aware updates.

## Recommended live workflow
1. In Copilot Studio, open the solution explorer.
2. Create or select a custom unmanaged solution for TheraDoc.
3. Set that solution as the preferred solution if you want new TheraDoc components to land there by default.
4. Open TheraDoc from that solution context, not only from the general agents list.
5. Verify the agent-to-solution mapping from the agent details page before major edits.
6. Add required objects before export whenever you add new topics, tools, flows, or knowledge-backed components.
7. Export the unmanaged solution from the source environment.
8. Import the updated solution into the target environment.
9. Publish the imported agent after import.

## Why this matters
- Agents created or edited outside the correct solution context can miss newly added components during export.
- New topics and other components are not guaranteed to flow automatically into older imported solutions.

## Source-grounded implementation notes
- Microsoft Learn: use solutions for import/export, preferred solutions, and component-aware updates.
- Microsoft Learn: if components are missing from the target solution, verify the agent is mapped to the intended solution and continue editing from that solution context.
- Microsoft Learn: button-based question nodes create user choices that appear as buttons, though users can still type responses.
- CMS therapy manual guidance: progress documentation supports medical necessity, revised plans may incorporate progress elements, and discharge documentation is a key justification point for the episode.
- APTA, AOTA, and ASHA guidance: documentation should show clinical reasoning, functional relevance, measurable performance, and the rationale for skilled care.

# Source Notes

## Microsoft Learn
- Export and import agents using solutions
- Create and manage custom solutions in Copilot Studio
- Fix missing agent components in solutions by verifying mapping and preferred solution usage
- Create and edit topics in Copilot Studio

## CMS
- Medicare Benefit Policy Manual, Chapter 15, especially therapy documentation, plan of care, progress report, and discharge sections
- SNF certification / recertification guidance where applicable
- SNF Services MLN documentation requirements
- Therapy services and skilled-care guidance

## Therapy bodies
- APTA documentation guidance for plan of care, visit/progress note, reexamination, and discharge documentation
- AOTA documentation guidance and OT SNF documentation resources
- ASHA medical-necessity and documentation guidance for SLP services

## Contractor guidance
- MAC or contractor-specific guidance only when it matches the applicable jurisdiction

## Validation notes from live environment
- Solutions page is available in the current tenant and exposes Import solution, Set preferred solution, and solution-specific open/edit paths.
- The current preferred solution shown in the live environment is `PCCA v2`.
- Before importing or relying on export, confirm whether TheraDoc is actually opened and edited from the intended unmanaged solution.
