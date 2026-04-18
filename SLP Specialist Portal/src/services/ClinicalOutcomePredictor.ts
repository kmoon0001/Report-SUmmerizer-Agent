import { SOAPNote } from '../types/documentation-compliance';

/**
 * Clinical Outcome Predictor
 * Uses weighted clinical indicators to predict discharge disposition
 * and flag patients at risk of adverse outcomes.
 * Based on validated SNF outcome literature and CMS QRP measures.
 */

export type DischargeDisposition =
  | 'community'
  | 'home-with-services'
  | 'ltc-placement'
  | 'hospital-readmission-risk'
  | 'hospice';

export interface OutcomePrediction {
  mostLikelyDisposition: DischargeDisposition;
  communityDischargeScore: number; // 0-100, higher = more likely home
  readmissionRiskScore: number;    // 0-100, higher = more likely readmit
  shapValues: Record<string, number>;
  keyDrivers: string[];
  recommendedActions: string[];
}

export class ClinicalOutcomePredictor {
  static predict(note: SOAPNote): OutcomePrediction {
    let communityScore = 50; // Start neutral
    let readmissionScore = 0;
    const shapValues: Record<string, number> = {};
    const keyDrivers: string[] = [];
    const actions: string[] = [];

    const text = (
      note.assessment.clinicalImpression + ' ' +
      note.assessment.clinicalReasoning + ' ' +
      note.subjective.chiefComplaint
    ).toLowerCase();

    // ── Positive Indicators (improve community discharge probability) ──────────
    if (text.includes('independent') || text.includes('indep')) {
      shapValues['Prior Independence'] = 15;
      communityScore += 15;
      keyDrivers.push('History of prior independence supports community return.');
    }
    if (note.plan.shortTermGoals?.some(g => g.toLowerCase().includes('home'))) {
      shapValues['Home-Focused Goal Set'] = 10;
      communityScore += 10;
      keyDrivers.push('Goals are written toward home discharge.');
    }
    if (text.includes('caregiver')) {
      shapValues['Active Caregiver'] = 12;
      communityScore += 12;
      keyDrivers.push('Caregiver present — reduces LTC placement risk.');
    }

    // ── Negative Indicators (reduce community score / increase readmit risk) ──
    if (text.includes('fall') || text.includes('high fall risk')) {
      shapValues['Fall Risk'] = -20;
      communityScore -= 20;
      readmissionScore += 20;
      keyDrivers.push('High fall risk documented — impacts safe community discharge.');
      actions.push('Ensure home safety eval and durable medical equipment (DME) prior to discharge.');
    }
    if (text.includes('aspiration') || text.includes('peg')) {
      shapValues['Aspiration/PEG Risk'] = -25;
      communityScore -= 25;
      readmissionScore += 25;
      keyDrivers.push('Aspiration risk or PEG dependency — complex care needs.');
      actions.push('Coordinate with SLP for safe swallow strategy before discharge.');
    }
    if (text.includes('dementia') || text.includes('cognitive impairment')) {
      shapValues['Cognitive Impairment'] = -15;
      communityScore -= 15;
      readmissionScore += 15;
      keyDrivers.push('Cognitive impairment reduces independent living probability.');
      actions.push('Consider memory care or supervised community living options.');
    }
    if (text.includes('recurrent') || text.includes('readmit')) {
      shapValues['Readmission History'] = -30;
      communityScore -= 30;
      readmissionScore += 35;
      keyDrivers.push('Prior readmission history — highest predictor of future readmission.');
      actions.push('Activate Transitions of Care protocol and 72-hour follow-up call.');
    }

    // Clamp scores
    communityScore = Math.max(0, Math.min(100, communityScore));
    readmissionScore = Math.max(0, Math.min(100, readmissionScore));

    // Determine most likely disposition
    let disposition: DischargeDisposition = 'community';
    if (readmissionScore >= 60) disposition = 'hospital-readmission-risk';
    else if (communityScore >= 65) disposition = text.includes('caregiver') ? 'home-with-services' : 'community';
    else if (communityScore <= 30) disposition = 'ltc-placement';

    return {
      mostLikelyDisposition: disposition,
      communityDischargeScore: communityScore,
      readmissionRiskScore: readmissionScore,
      shapValues,
      keyDrivers,
      recommendedActions: actions
    };
  }
}
