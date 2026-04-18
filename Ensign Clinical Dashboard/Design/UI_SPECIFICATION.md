# Ensign Clinical Dashboard: UI Architecture Specification

**Goal**: A role-based dashboard for SNF therapy teams hosted in **Microsoft Teams.**

## 1. Role-Based Views (RBAC)
### View: Therapist (Individual)
- **Primary View**: "My Daily Slate" - Filters Dataverse by `Owning_Therapist_ID`.
- **UI Elements**:
  - **Tile 1**: Admissions Ready (From Synthesis Lab)
  - **Tile 2**: Reports Due Today
  - **Tile 3**: Audit Flagged Notes (From Denial Defense)

### View: DOR (Director of Rehab) - Facility Wide
- **Primary View**: "Facility Radar" - Full facility visibility.
- **UI Elements**:
  - **Heatmap**: Red/Yellow/Green compliance status for all clinicians.
  - **Action Queue**: Incomplete documentation and "High Risk" QM Triggers.
  - **Resource Manager**: Productivity vs. Documentation compliance metrics.

## 2. Technical Stack
- **Front-end**: Power Apps (Canvas App) hosted in Teams.
- **Back-end**: Dataverse (Unified Swarm Tables).
- **Communication**: Power Automate for "Scheduled Pushes" (e.g., 05:00 AM briefing notifications).

## 3. Microsoft Learn Best Practices
- **Design**: Fluent UI components for a "Premium" look.
- **Performance**: Use `Concurrent()` on `OnStart` to load Patient and Audit data simultaneously.
- **Security**: Bound to Dataverse Security Roles (Clinician vs. Administrator).

---
*Ensign Services: World-Class Clinical Intelligence Infrastructure.*
