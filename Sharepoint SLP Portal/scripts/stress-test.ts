import { UniversalComplianceValidator } from '../services/UniversalComplianceValidator';
import { SOAPNote } from '../types/documentation-compliance';

/**
 * Large Document Stress Test
 * Simulates a massive 50-page discharge summary or evaluation.
 */
async function runLargeDocumentStressTest() {
  console.log('--- Starting 50-Page Stress Test ---');
  
  const startTime = Date.now();
  
  // Generating a massive assessment string
  let massiveText = 'Patient evaluation summary. ';
  for (let i = 0; i < 5000; i++) {
    massiveText += `Line ${i}: Clinical observation of functional deficits at level ${i % 10}. Patient requires skilled intervention. `;
  }

  const largeNote: SOAPNote = {
    subjective: { chiefComplaint: 'Complex medical history', priorLevelOfFunction: 'Sub-acute' },
    objective: { observation: 'Massive data set...', timeSpent: 60 },
    assessment: { 
      clinicalImpression: massiveText, 
      diagnosis: 'Multiple comorbidities', 
      clinicalReasoning: massiveText.substring(0, 500) 
    },
    plan: { interventions: ['Comprehensive rehab'], frequency: 'Daily', duration: '90 days' }
  };

  console.log(`Document size: ${(JSON.stringify(largeNote).length / 1024).toFixed(2)} KB`);

  const issues = UniversalComplianceValidator.validate(largeNote, 'pt');
  
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`Validation complete.`);
  console.log(`Issues found: ${issues.length}`);
  console.log(`Execution time: ${duration}ms`);

  if (duration > 500) {
    console.warn('⚠️ WARNING: Performance degradation detected on large documents.');
  } else {
    console.log('✅ Performance within acceptable "Gold Standard" limits (< 500ms).');
  }
}

runLargeDocumentStressTest();
