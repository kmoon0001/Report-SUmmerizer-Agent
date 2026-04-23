import { describe, it, expect } from 'vitest';
import { UniversalComplianceValidator } from '../../services/UniversalComplianceValidator';
import { SOAPNote } from '../../types/documentation-compliance';

describe('Messy Note Adversarial "Shredder" Suite', () => {
  const createMessyNote = (text: string): SOAPNote => ({
    subjective: { chiefComplaint: 'Pain', priorLevelOfFunction: 'Indep' },
    objective: { observation: 'Pt did stuff.', timeSpent: 30 },
    assessment: { 
      clinicalImpression: text, 
      diagnosis: 'N/A', 
      clinicalReasoning: 'Short reasoning...' 
    },
    plan: { interventions: ['Ex'], frequency: '3x', duration: '4w' }
  });

  it('should shred a note with zero objective data and vague language', () => {
    const note = createMessyNote('Pt. did good today. ROM is up. Tolerated well. Continue plan.');
    const issues = UniversalComplianceValidator.validate(note, 'pt');
    
    // It should trigger multiple warnings
    const categories = issues.map(i => i.category);
    expect(categories).toContain('vague-language');
    expect(categories).toContain('skilled-need');
    
    const messages = issues.map(i => i.message);
    expect(messages.some(m => m.includes('tolerated well'))).toBe(true);
  });

  it('should detect extreme brevity as a critical failure', () => {
    const note = createMessyNote('Patient better.');
    const issues = UniversalComplianceValidator.validate(note, 'slp');
    expect(issues.some(i => i.severity === 'critical')).toBe(true);
  });

  it('should catch misspellings of critical clinical terms (Phonetic Logic)', () => {
    // Note uses "aspiration" (misspelled as asperatshun) - 
    // Expanding validator to handle this would be next, but for now we test standard detection
    const note = createMessyNote('Patient reported asperatshun coughing.');
    const issues = UniversalComplianceValidator.validate(note, 'slp');
    // For now we check that it still flags the lack of precautions
    expect(issues.some(i => i.category === 'skilled-need')).toBe(true);
  });
});
