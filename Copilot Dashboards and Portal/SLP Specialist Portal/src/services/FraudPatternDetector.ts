import { SOAPNote } from '../types/documentation-compliance';
import { Discipline } from './UniversalComplianceValidator';

/**
 * OIG Fraud Pattern Detector
 * Detects patterns consistent with Medicare billing abuse flagged by
 * the OIG Work Plan and Recovery Audit Contractor (RAC) targets.
 */

export interface FraudFlag {
  code: string;
  severity: 'critical' | 'warning';
  pattern: string;
  oigReference: string;
  recommendation: string;
  shapWeight: number;
}

export interface FraudAnalysisReport {
  flags: FraudFlag[];
  fraudRiskScore: number; // 0-100
  shapValues: Record<string, number>;
  isCookieCutter: boolean;
  requiresHumanReview: boolean;
}

export class FraudPatternDetector {
  /**
   * Analyzes a batch of notes for patterns consistent with billing abuse.
   * Accepts a history of recent notes to detect cross-note patterns.
   */
  static analyzeNoteBatch(
    currentNote: SOAPNote,
    recentNotes: SOAPNote[],
    discipline: Discipline
  ): FraudAnalysisReport {
    const flags: FraudFlag[] = [];
    const shapValues: Record<string, number> = {};
    let fraudScore = 0;

    // ─── Pattern 1: Cookie-Cutter Documentation ───────────────────────────────
    // Identical assessment text across multiple notes is a top RAC audit target
    const isDuplicate = recentNotes.some(
      n => n.assessment.clinicalImpression === currentNote.assessment.clinicalImpression
    );
    if (isDuplicate) {
      const w = 40;
      fraudScore += w;
      shapValues['Cookie-Cutter Documentation'] = w;
      flags.push({
        code: 'FRAUD_001',
        severity: 'critical',
        pattern: 'Assessment text is identical to a prior session note.',
        oigReference: 'OIG Work Plan — Payments for Duplicate Services (2024)',
        recommendation: 'Each session must reflect unique patient response and clinician judgment for that date.',
        shapWeight: w
      });
    }

    // ─── Pattern 2: Maximum Units Billed Every Session ────────────────────────
    const billedMaxUnits = recentNotes.filter(
      n => (n.objective.timeSpent || 0) >= 97
    );
    if (billedMaxUnits.length >= 5) {
      const w = 30;
      fraudScore += w;
      shapValues['Maximum Units Every Session'] = w;
      flags.push({
        code: 'FRAUD_002',
        severity: 'warning',
        pattern: '5+ consecutive sessions billing maximum therapy units (≥97 min).',
        oigReference: 'MAC Audit Focus: Excessive Billing — Noridian 2025 Target',
        recommendation: 'Document specific clinical rationale for extended sessions. Therapy time should vary with patient condition.',
        shapWeight: w
      });
    }

    // ─── Pattern 3: Discharge Avoided to Maintain Census ─────────────────────
    const assessmentText = currentNote.assessment.clinicalImpression.toLowerCase();
    if (assessmentText.includes('plateau') && currentNote.plan.frequency.includes('week')) {
      const w = 35;
      fraudScore += w;
      shapValues['Plateau Without Discharge Plan'] = w;
      flags.push({
        code: 'FRAUD_003',
        severity: 'critical',
        pattern: '"Plateau" documented but no discharge planning noted — possible census-driven continued stay.',
        oigReference: 'MBPM Ch 15 §220.1 — Reasonable and Necessary Standard',
        recommendation: 'If patient has plateaued, initiate discharge planning or document maintenance therapy under Jimmo standards.',
        shapWeight: w
      });
    }

    // ─── Pattern 4: Upcoded Modality (Wrong CPT for Service Rendered) ─────────
    const interventions = currentNote.plan.interventions.map(i => i.toLowerCase());
    const hasHotPack = interventions.some(i => i.includes('hot pack') || i.includes('ultrasound'));
    const hasEvalCode = interventions.some(i => i.includes('evaluation') || i.includes('eval'));
    if (hasHotPack && hasEvalCode) {
      const w = 20;
      fraudScore += w;
      shapValues['Possible CPT Upcoding'] = w;
      flags.push({
        code: 'FRAUD_004',
        severity: 'warning',
        pattern: 'Passive modalities (hot pack/ultrasound) combined with evaluation code — possible upcoding.',
        oigReference: 'CPT Bundling Rules / CMS Correct Coding Initiative (CCI)',
        recommendation: 'Review CPT code selection. Passive modalities cannot be billed with evaluation codes on same date.',
        shapWeight: w
      });
    }

    const isCookieCutter = isDuplicate;
    const requiresHumanReview = fraudScore >= 50;

    return {
      flags,
      fraudRiskScore: Math.min(fraudScore, 100),
      shapValues,
      isCookieCutter,
      requiresHumanReview
    };
  }
}
