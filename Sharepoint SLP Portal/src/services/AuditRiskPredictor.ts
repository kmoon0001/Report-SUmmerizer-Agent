import { SOAPNote } from '../types/documentation-compliance';

export interface AuditRiskReport {
  riskScore: number; // 0-100
  highRiskPatterns: string[];
  shapValues: Record<string, number>; // Explainability weights
  recommendation: string;
}

export class AuditRiskPredictor {
  /**
   * Predicts the likelihood of a Medicare denial and uses SHAP-inspired
   * feature weighting to explain the "Why."
   */
  static predictRisk(note: SOAPNote): AuditRiskReport {
    let score = 0;
    const patterns: string[] = [];
    const shapValues: Record<string, number> = {};

    const text = (note.assessment.clinicalImpression + ' ' + note.assessment.clinicalReasoning).toLowerCase();

    // Pattern 1: Maintenance Therapy without "Jimmo" language
    if (note.plan.duration.includes('weeks') && !text.includes('maintain') && !text.includes('slowing decline')) {
      const weight = 25;
      score += weight;
      patterns.push('Maintenance therapy without prevention-of-decline justification.');
      shapValues['Missing Maintenance Justification'] = weight;
    }

    // Pattern 2: Duplication of service (Generic language)
    if (text.includes('same as last') || text.includes('continue with previous')) {
      const weight = 40;
      score += weight;
      patterns.push('Possible duplication of service / Lack of therapy-directed progression.');
      shapValues['Generic/Duplicated Language'] = weight;
    }

    // Pattern 3: Missing Objective Milestones
    if (!note.objective.observation.includes('%') && !note.objective.observation.includes('/') && !note.objective.observation.includes('degrees')) {
      const weight = 30;
      score += weight;
      patterns.push('Lack of objective measurable data in Objective section.');
      shapValues['Lack of Objective Metrics'] = weight;
    }

    // Pattern 4: Scope concerns
    if (text.includes('diagnosis of') || text.includes('diagnosing')) {
      score += 15;
      patterns.push('Medical diagnosis phrasing (Scope of Practice boundary).');
    }

    let recommendation = 'Low Risk: Documentation is audit-ready.';
    if (score > 60) recommendation = 'CRITICAL RISK: High probability of denial. Revise documentation immediately.';
    else if (score > 30) recommendation = 'MODERATE RISK: Improve objective data and skilled justifications.';

    return {
      riskScore: Math.min(score, 100),
      highRiskPatterns: patterns,
      shapValues,
      recommendation
    };
  }
}
