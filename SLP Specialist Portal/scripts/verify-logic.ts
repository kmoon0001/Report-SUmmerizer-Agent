import { UniversalComplianceValidator } from '../src/services/UniversalComplianceValidator';
import { SectionGGMapper, SectionGGRating } from '../src/services/SectionGGMapper';
import { FraudPatternDetector } from '../src/services/FraudPatternDetector';
import { ClinicalOutcomePredictor } from '../src/services/ClinicalOutcomePredictor';

async function runValidation() {
  console.log('🚀 SYSTEM LOGIC VALIDATION: STARTING...');
  let failCount = 0;

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      console.log(`✅ PASSED: ${name}`);
    } catch (e: any) {
      console.error(`❌ FAILED: ${name}`);
      console.error(e?.message || e);
      failCount++;
    }
  };

  const createBaseNote = () => ({
    subjective: { chiefComplaint: 'Condition' },
    objective: { observation: 'Obs', timeSpent: 30 },
    assessment: { clinicalImpression: 'Impression', clinicalReasoning: 'Reasoning '.repeat(20) },
    plan: { interventions: ['Intervention'], frequency: '3x/wk', duration: '4wks' }
  });

  // 1. Universal Compliance Test
  test('Universal Validator - Skilled Necessity', () => {
    const note = createBaseNote();
    note.assessment.clinicalImpression = 'Patient tolerated well. Continue plan.';
    const issues = UniversalComplianceValidator.validate(note as any, 'pt');
    if (!issues.some(i => i.category === 'vague-language')) throw new Error('Vague language not detected');
  });

  // 2. Section GG Test
  test('Section GG - Functional Gain', () => {
    const admission: Record<string, SectionGGRating> = { 'GG0130A': 2 as SectionGGRating };
    const discharge: Record<string, SectionGGRating> = { 'GG0130A': 5 as SectionGGRating };
    const report = SectionGGMapper.mapToSectionGG(admission, discharge);
    if (report.overallFunctionalGain !== 3) throw new Error(`Incorrect gain calculation: expected 3, got ${report.overallFunctionalGain}`);
  });

  // 3. Fraud Detection Test
  test('Fraud Detector - Cookie Cutter', () => {
    const note = createBaseNote();
    note.assessment.clinicalImpression = 'Same text';
    const recent = [createBaseNote()];
    recent[0].assessment.clinicalImpression = 'Same text';
    const report = FraudPatternDetector.analyzeNoteBatch(note as any, recent as any, 'pt');
    if (!report.isCookieCutter) throw new Error('Duplicate notes not detected');
  });

  // 4. Outcome Predictor Test
  test('Outcome Predictor - Community Score', () => {
    const note = createBaseNote();
    note.assessment.clinicalImpression = 'High fall risk, dementia, readmission history';
    const prediction = ClinicalOutcomePredictor.predict(note as any);
    if (prediction.communityDischargeScore > 40) throw new Error('Risk not reflected in score');
  });

  console.log('\n--- FINAL REPORT ---');
  if (failCount === 0) {
    console.log('🟢 ALL CORE LOGIC TESTS PASSED GREEN.');
  } else {
    console.log(`🔴 ${failCount} TESTS FAILED.`);
    process.exit(1);
  }
}

runValidation();
