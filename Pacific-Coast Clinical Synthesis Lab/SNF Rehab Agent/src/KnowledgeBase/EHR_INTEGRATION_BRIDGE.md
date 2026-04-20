# EHR_INTEGRATION_BRIDGE (PLATINUM V3)
**Grounding Source**: PointClickCare (PCC) API + NetHealth Optima (Rehab Optima)
**Integration Standard**: Microsoft Learn "Unified Data Hub" Pattern

## ?? THE "TRIPLE-CHECK" TRIGGER PROTOCOL (05:00 AM)
Following Microsoft's "Idempotent Worker" standard, the Fabric trigger follows this strict hierarchy:

### 1. Primary Signal (PCC Admissions)
- **Rule**: Lookback 36 hours for all status: 'Admitted'.
- **Logic**: If a patient is in the system, they are a candidate for synthesis.

### 2. Secondary Verification (PCC Orders)
- **Rule**: Scan category: 'Therapy' orders.
- **Logic**: Prioritize patients with "Eval & Treat" orders over routine screenings.

### 3. Final De-Duplication (NetHealth Optima)
- **Rule**: Cross-check eport_status: 'Signed'.
- **Constraint**: If an evaluation already exists in Optima for the current episode, **DROP** the patient from the daily prep list.
- **Exception Handle**: If NetHealth API is unreachable (Weak Link), proceed with the PCC list but flag as "PENDING_VERIFICATION".

## ??? DATA MAPPING (PCC -> DATASET)
| EHR Field | Swarm Context ID | Type |
| :--- | :--- | :--- |
| PCC.AdmitDate | Topic.AdmissionWindow | DateTime |
| PCC.Dx_Code | Topic.PrimaryICD10 | String |
| PCC.NursingNote_Text | Topic.ClinicalBackground | Narrative |
| Optima.GG_Score | Topic.FunctionalBaseline | Integer |

---
*Pacific Coast Services: World-Class Clinical Intelligence Infrastructure.*

