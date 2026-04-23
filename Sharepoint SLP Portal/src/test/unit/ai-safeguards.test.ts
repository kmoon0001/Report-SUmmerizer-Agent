import { describe, it, expect } from 'vitest';
import { UniversalComplianceValidator } from '../../services/UniversalComplianceValidator';
import { SOAPNote } from '../../types/documentation-compliance';

describe('AI Hallucination & Scope Safeguards', () => {
  const baseNote: SOAPNote = {
    subjective: { chiefComplaint: 'Difficulty swallowing', priorLevelOfFunction: 'Independent' },
    objective: { observation: 'Pt alert', timeSpent: 30 },
    assessment: { clinicalImpression: 'Requires skilled intervention', diagnosis: 'Dysphagia', clinicalReasoning: 'Long reasoning string just to pass basic length checks...' },
    plan: { interventions: ['Swallow training'], frequency: '3x/week', duration: '4 weeks' }
  };

  it('should flag "tolerated well" as a vague clinical red flag', () => {
    const note = { ...baseNote };
    note.assessment.clinicalImpression = 'Patient tolerated well during the swallowing session.';
    const issues = UniversalComplianceValidator.validate(note, 'slp');
    expect(issues.some(i => i.category === 'vague-language')).toBe(true);
  });

  it('should flag diagnostic language as out of scope for therapy', () => {
    const note = { ...baseNote };
    note.assessment.clinicalImpression = 'I am diagnosing the patient with Alzheimer disease.';
    const issues = UniversalComplianceValidator.validate(note, 'ot');
    expect(issues.some(i => i.category === 'scope-of-practice')).toBe(true);
  });

  it('should flag aspiration without documented precautions (Safety Gate)', () => {
    const note = { ...baseNote };
    note.objective.observation = 'Patient had coughing and choking during thin liquid trails.';
    note.assessment.clinicalImpression = 'Requires skilled rehab.'; // No precaution mentioned
    const issues = UniversalComplianceValidator.validate(note, 'slp');
    expect(issues.some(i => i.category === 'safety')).toBe(true);
  });

  it('should enforce OT linkage to ADLs (Occupational Focus)', () => {
    const note = { ...baseNote };
    note.assessment.clinicalImpression = 'Requires skilled OT for shoulder range of motion.'; // No task focus
    const issues = UniversalComplianceValidator.validate(note, 'ot');
    expect(issues.some(i => i.category === 'occupational-focus')).toBe(true);
  });
});
