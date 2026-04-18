# Power BI Architecture Notes

## Semantic Model

- Prefer Direct Lake on OneLake for live curated datasets.
- Use Import only where it materially improves performance or modeling.
- Keep the semantic model aligned to the Gold layer.
- Use composite models only when live plus historical or reference data genuinely need different storage modes.
- Prefer calculation groups and field parameters only when they simplify the user experience.

## Security

- Apply row-level security by role, unit, and assignment.
- Apply sensitivity labels where the tenant permits it.
- Keep PHI out of broad-access reports.
- Treat exported reports and shared dashboards as controlled PHI surfaces.
