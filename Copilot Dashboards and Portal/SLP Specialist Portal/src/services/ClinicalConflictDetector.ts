import { SOAPNote } from '../types/documentation-compliance';
import { Discipline, ValidationIssue } from './UniversalComplianceValidator';

export class ClinicalConflictDetector {
  /**
   * Detects safety conflicts between disciplines.
   * e.g., PT recommends activity that conflicts with SLP swallow safety.
   */
  static detectConflicts(notes: Record<Discipline, SOAPNote | null>): ValidationIssue[] {
    const conflicts: ValidationIssue[] = [];

    const slpNote = notes['slp'];
    const ptNote = notes['pt'];
    const otNote = notes['ot'];

    // 1. Fatigue/Aspiration Conflict (SLP vs PT)
    if (slpNote && ptNote) {
      const slpAsper = slpNote.assessment.clinicalImpression.toLowerCase().includes('high fatigue aspiration');
      const ptIntensity = ptNote.plan.interventions.join(' ').toLowerCase().includes('high intensity');

      if (slpAsper && ptIntensity) {
        conflicts.push({
          code: 'CONFLICT_001',
          category: 'safety',
          severity: 'critical',
          message: 'Inter-Disciplinary Conflict: PT high-intensity activity conflicts with SLP high-fatigue aspiration precaution.',
          regulation: 'Interdisciplinary Safety Protocol / CMS CoP §482.13',
          suggestion: 'Coordinate PT session timing to occur well before or after meal times to reduce aspiration risk.'
        });
      }
    }

    // 2. Weight Bearing vs ADL Independence (PT vs OT)
    if (ptNote && otNote) {
      const nwb = ptNote.objective.observation.toLowerCase().includes('nwb') || ptNote.objective.observation.toLowerCase().includes('non-weight bearing');
      const otTransfer = otNote.plan.interventions.join(' ').toLowerCase().includes('stand pivot transfer');

      if (nwb && otTransfer) {
        conflicts.push({
          code: 'CONFLICT_002',
          category: 'safety',
          severity: 'critical',
          message: 'Inter-Disciplinary Conflict: OT stand-pivot transfer plan conflicts with PT Non-Weight Bearing (NWB) restriction.',
          regulation: 'Safety Contraindication / Physician Orders',
          suggestion: 'Review weight-bearing status with MD before performing OT transfer training.'
        });
      }
    }

    return conflicts;
  }
}
