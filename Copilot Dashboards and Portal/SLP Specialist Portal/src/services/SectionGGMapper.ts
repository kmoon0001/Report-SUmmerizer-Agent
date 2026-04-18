import { SOAPNote } from '../types/documentation-compliance';

/**
 * CMS MDS 3.0 Section GG Functional Score Mapper
 * Maps therapy assessment data to Section GG coding requirements
 * for SNF Quality Reporting Program (QRP) compliance.
 */

export type SectionGGCode =
  | 'GG0100' // Prior Functioning
  | 'GG0110' // Prior Device Use
  | 'GG0130' // Self-Care
  | 'GG0170'; // Mobility

export type SectionGGRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface SectionGGActivity {
  code: string;
  label: string;
  admissionScore: SectionGGRating | null;
  dischargeScore: SectionGGRating | null;
  shapContribution: number; // Weight toward Quality Measure score
}

export interface SectionGGReport {
  selfCare: SectionGGActivity[];
  mobility: SectionGGActivity[];
  overallFunctionalGain: number;
  qualityMeasureFlag: boolean;
  qualityMeasureFlagReason: string;
  snfQrpCompliant: boolean;
  shapValues: Record<string, number>;
}

export const SECTION_GG_SELF_CARE_ITEMS: Record<string, string> = {
  'GG0130A': 'Eating',
  'GG0130B': 'Oral Hygiene',
  'GG0130C': 'Toileting Hygiene',
  'GG0130E': 'Shower/Bathe Self',
  'GG0130F': 'Upper Body Dressing',
  'GG0130G': 'Lower Body Dressing',
  'GG0130H': 'Footwear Management'
};

export const SECTION_GG_MOBILITY_ITEMS: Record<string, string> = {
  'GG0170A': 'Roll Left and Right',
  'GG0170B': 'Sit to lying',
  'GG0170C': 'Lying to sitting on side of bed',
  'GG0170D': 'Sit to stand',
  'GG0170E': 'Chair/bed-to-chair transfer',
  'GG0170F': 'Toilet transfer',
  'GG0170I': 'Walk 10 feet',
  'GG0170J': 'Walk 50 feet with two turns',
  'GG0170K': 'Walk 150 feet',
  'GG0170M': '12 steps',
};

// Section GG Rating Scale (0=activity did not occur, 1=dependent, 6=independent)
export const RATING_LABELS: Record<number, string> = {
  1: 'Dependent',
  2: 'Substantial/maximal assistance',
  3: 'Partial/moderate assistance',
  4: 'Supervision or touching assistance',
  5: 'Setup or clean-up assistance',
  6: 'Independent',
  7: 'Patient refused',
  9: 'Not applicable',
  10: 'Not attempted — safety concern',
  88: 'Not attempted'
};

export class SectionGGMapper {
  /**
   * Maps a clinician's functional assessment to Section GG codes and
   * computes the Quality Measure impact using SHAP-weighted attribution.
   */
  static mapToSectionGG(
    admissionFindings: Record<string, SectionGGRating>,
    dischargeFindings: Record<string, SectionGGRating>
  ): SectionGGReport {
    const shapValues: Record<string, number> = {};
    const selfCare: SectionGGActivity[] = [];
    const mobility: SectionGGActivity[] = [];
    let totalGain = 0;
    let itemCount = 0;

    // Map Self-Care Items
    Object.entries(SECTION_GG_SELF_CARE_ITEMS).forEach(([code, label]) => {
      const admission = admissionFindings[code] ?? null;
      const discharge = dischargeFindings[code] ?? null;
      if (admission !== null) {
        const gain = discharge !== null ? discharge - admission : 0;
        const contribution = gain * 10;
        shapValues[`${code}_${label}`] = contribution;
        totalGain += gain;
        itemCount++;
        selfCare.push({ code, label, admissionScore: admission, dischargeScore: discharge, shapContribution: contribution });
      }
    });

    // Map Mobility Items
    Object.entries(SECTION_GG_MOBILITY_ITEMS).forEach(([code, label]) => {
      const admission = admissionFindings[code] ?? null;
      const discharge = dischargeFindings[code] ?? null;
      if (admission !== null) {
        const gain = discharge !== null ? discharge - admission : 0;
        const contribution = gain * 10;
        shapValues[`${code}_${label}`] = contribution;
        totalGain += gain;
        itemCount++;
        mobility.push({ code, label, admissionScore: admission, dischargeScore: discharge, shapContribution: contribution });
      }
    });

    const overallFunctionalGain = itemCount > 0 ? parseFloat((totalGain / itemCount).toFixed(2)) : 0;

    // CMS Quality Measure: Patient gets better in self-care (SNF QRP)
    const qualityMeasureFlag = overallFunctionalGain < 0;
    const snfQrpCompliant = Object.keys(admissionFindings).length >= 5;

    return {
      selfCare,
      mobility,
      overallFunctionalGain,
      qualityMeasureFlag,
      qualityMeasureFlagReason: qualityMeasureFlag
        ? 'Functional decline detected across Section GG items — review clinical plan for SNF QRP reporting impact.'
        : 'Functional gain or maintenance documented across Section GG items.',
      snfQrpCompliant,
      shapValues
    };
  }

  /**
   * Validates that the therapist's note is consistent with Section GG codes.
   * If PT documents "Mod-A for ambulation" but GG0170I is coded as "6 (Independent)", flags conflict.
   */
  static detectDocumentationCodeConflict(
    note: SOAPNote,
    ggCodes: Record<string, SectionGGRating>
  ): string[] {
    const conflicts: string[] = [];
    const obs = note.objective.observation.toLowerCase();

    const assistanceLevels = [
      { keywords: ['dependent', 'total assist', 'max a'], maxAllowedRating: 2 },
      { keywords: ['mod a', 'moderate assist'], maxAllowedRating: 3 },
      { keywords: ['min a', 'minimal assist'], maxAllowedRating: 4 },
      { keywords: ['supervision', 'supervisory', 'sba'], maxAllowedRating: 5 },
      { keywords: ['independent', 'indep'], maxAllowedRating: 6 },
    ];

    assistanceLevels.forEach(({ keywords, maxAllowedRating }) => {
      if (keywords.some(k => obs.includes(k))) {
        Object.entries(ggCodes).forEach(([code, rating]) => {
          if (rating > maxAllowedRating) {
            conflicts.push(
              `GG Code Conflict: ${code} coded as "${RATING_LABELS[rating]}" (${rating}) ` +
              `but note documents "${keywords[0]}" level of assistance.`
            );
          }
        });
      }
    });

    return conflicts;
  }
}
