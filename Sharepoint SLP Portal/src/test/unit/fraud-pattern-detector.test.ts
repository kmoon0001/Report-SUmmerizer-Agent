import { describe, it, expect } from 'vitest';
import { FraudPatternDetector } from '../../services/FraudPatternDetector';
import type { SOAPNote } from '../../types/documentation-compliance';

const makeNote = (overrides: Partial<any> = {}): SOAPNote => ({
  subjective: { chiefComplaint: 'Gait deficit', priorLevelOfFunction: 'SBA' },
  objective: { observation: '4/5 strength hip flexors', timeSpent: 45 },
  assessment: {
    clinicalImpression: 'Patient requires skilled PT for balance and gait training.',
    diagnosis: 'Gait dysfunction',
    clinicalReasoning: 'Complex neurological presentation requiring skilled clinical judgment.'
  },
  plan: {
    interventions: ['Gait training', 'Therapeutic exercise'],
    frequency: '5x/week',
    duration: '4 weeks',
    shortTermGoals: ['Walk 50ft with walker'],
    longTermGoals: ['Community ambulation']
  },
  ...overrides
});

describe('FraudPatternDetector', () => {

  describe('Cookie-Cutter Documentation', () => {
    it('should flag CRITICAL when assessment text is identical to a prior note', () => {
      const note = makeNote();
      const recentNotes = [makeNote(), makeNote()]; // Same assessment text

      const report = FraudPatternDetector.analyzeNoteBatch(note, recentNotes, 'pt');
      expect(report.isCookieCutter).toBe(true);
      expect(report.flags.some(f => f.code === 'FRAUD_001')).toBe(true);
      expect(report.flags.find(f => f.code === 'FRAUD_001')?.severity).toBe('critical');
    });

    it('should not flag when notes have unique assessment text', () => {
      const note = makeNote();
      const recentNotes = [
        makeNote({ assessment: { clinicalImpression: 'Patient showed improvement in gait speed today.', diagnosis: 'x', clinicalReasoning: 'x' } }),
      ];

      const report = FraudPatternDetector.analyzeNoteBatch(note, recentNotes, 'pt');
      expect(report.isCookieCutter).toBe(false);
    });
  });

  describe('Excessive Billing Detection', () => {
    it('should flag when 5+ consecutive sessions bill maximum units', () => {
      const note = makeNote();
      const recentNotes = Array(6).fill(null).map(() =>
        makeNote({ objective: { observation: 'Treated', timeSpent: 97 } })
      );

      const report = FraudPatternDetector.analyzeNoteBatch(note, recentNotes, 'pt');
      expect(report.flags.some(f => f.code === 'FRAUD_002')).toBe(true);
    });
  });

  describe('Plateau Without Discharge', () => {
    it('should flag plateau language without discharge plan', () => {
      const note = makeNote({
        assessment: {
          clinicalImpression: 'Patient has reached a plateau in functional gains.',
          diagnosis: 'Gait dysfunction',
          clinicalReasoning: 'Monitoring only.'
        }
      });

      const report = FraudPatternDetector.analyzeNoteBatch(note, [], 'pt');
      expect(report.flags.some(f => f.code === 'FRAUD_003')).toBe(true);
      expect(report.fraudRiskScore).toBeGreaterThan(0);
    });
  });

  describe('SHAP Explainability', () => {
    it('should populate shapValues for each detected pattern', () => {
      const note = makeNote({
        assessment: { clinicalImpression: 'Patient has reached a plateau in functional gains.', diagnosis: 'x', clinicalReasoning: 'x' }
      });
      const report = FraudPatternDetector.analyzeNoteBatch(note, [makeNote(), makeNote()], 'pt');
      expect(Object.keys(report.shapValues).length).toBeGreaterThan(0);
    });
  });

  describe('Human Review Trigger', () => {
    it('should require human review when fraud risk >= 50', () => {
      const note = makeNote({
        assessment: { clinicalImpression: 'plateau, same as last session.', diagnosis: 'x', clinicalReasoning: 'x' }
      });
      const recentNotes = [makeNote(), makeNote()];
      const report = FraudPatternDetector.analyzeNoteBatch(note, recentNotes, 'pt');
      expect(report.requiresHumanReview).toBe(report.fraudRiskScore >= 50);
    });
  });
});
