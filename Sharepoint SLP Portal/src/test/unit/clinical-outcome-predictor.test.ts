import { describe, it, expect } from 'vitest';
import { ClinicalOutcomePredictor } from '../../services/ClinicalOutcomePredictor';
import type { SOAPNote } from '../../types/documentation-compliance';

const makeNote = (assessmentText: string, extras: Partial<any> = {}): SOAPNote => ({
  subjective: { chiefComplaint: 'Rehab needs', priorLevelOfFunction: 'Independent', ...extras.subjective },
  objective: { observation: 'Stable vitals', timeSpent: 45 },
  assessment: {
    clinicalImpression: assessmentText,
    diagnosis: 'Functional decline',
    clinicalReasoning: assessmentText
  },
  plan: {
    interventions: ['Therapeutic exercise'],
    frequency: '5x/week',
    duration: '4 weeks',
    shortTermGoals: extras.shortTermGoals ?? ['Improve gait'],
    longTermGoals: extras.longTermGoals ?? ['Return to prior level']
  }
});

describe('ClinicalOutcomePredictor', () => {

  it('should predict community discharge for a patient with strong positive indicators', () => {
    const note = makeNote(
      'Patient was previously independent. Active caregiver at home.',
      { shortTermGoals: ['Walk to car — home discharge target'], longTermGoals: ['Return home'] }
    );
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(['community', 'home-with-services']).toContain(prediction.mostLikelyDisposition);
    expect(prediction.communityDischargeScore).toBeGreaterThan(50);
  });

  it('should predict LTC placement for a patient with severe negative indicators', () => {
    const note = makeNote(
      'Patient has severe dementia, recurrent falls, and aspiration risk with PEG tube dependency.'
    );
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(prediction.communityDischargeScore).toBeLessThan(50);
  });

  it('should flag hospital readmission risk when history is present', () => {
    const note = makeNote(
      'Patient has a history of recurrent readmissions for aspiration pneumonia. High fall risk documented.'
    );
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(prediction.readmissionRiskScore).toBeGreaterThan(40);
    expect(prediction.mostLikelyDisposition).toBe('hospital-readmission-risk');
  });

  it('should always return SHAP values in the prediction', () => {
    const note = makeNote('Generic clinical presentation requiring skilled PT.');
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(prediction.shapValues).toBeDefined();
    expect(typeof prediction.shapValues).toBe('object');
  });

  it('should return recommended actions for high-risk patients', () => {
    const note = makeNote('High fall risk with aspiration risk and cognitive impairment noted.');
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(prediction.recommendedActions.length).toBeGreaterThan(0);
  });

  it('should clamp scores to 0-100 range', () => {
    const note = makeNote(
      'Recurrent readmissions. Aspiration. Falls. Dementia. Cognitive impairment. No caregiver.'
    );
    const prediction = ClinicalOutcomePredictor.predict(note);
    expect(prediction.communityDischargeScore).toBeGreaterThanOrEqual(0);
    expect(prediction.communityDischargeScore).toBeLessThanOrEqual(100);
    expect(prediction.readmissionRiskScore).toBeGreaterThanOrEqual(0);
    expect(prediction.readmissionRiskScore).toBeLessThanOrEqual(100);
  });
});
