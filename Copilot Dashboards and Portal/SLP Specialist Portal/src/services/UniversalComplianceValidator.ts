import { SOAPNote } from '../types/documentation-compliance';

export type Discipline = 'slp' | 'pt' | 'ot';

export interface ValidationIssue {
  code: string;
  category: 'skilled-need' | 'billing' | 'vague-language' | 'occupational-focus' | 'safety' | 'scope-of-practice';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  regulation: string;
  suggestion: string;
}

export class UniversalComplianceValidator {
  /**
   * THE MASTER COMPLIANCE ENGINE
   * Hardened logic for SLP, PT, and OT.
   */
  static validate(note: SOAPNote, discipline: Discipline): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Structure Check
    this.checkSOAPStructure(note, issues);

    // 2. Billing: 8-Minute Rule Implementation
    this.enforceEightMinuteRule(note, issues);

    // 3. Clinical: Skilled Necessity (Jimmo Standard)
    this.checkSkilledNeed(note, discipline, issues);

    // 4. OT Specific: Occupational Performance Linkage
    if (discipline === 'ot') {
      this.checkOccupationalFocus(note, issues);
    }

    // 5. SLP Specific: Trach/Vent & Swallow Safety
    if (discipline === 'slp') {
      this.checkSLPSafety(note, issues);
    }

    // 6. Safeguard: Scope of Practice (Diagnosis Guardrail)
    this.checkScopeOfPractice(note, issues);

    // 7. Vague Language Detection (Audit-Ready)
    this.checkVagueLanguage(note, issues);

    return issues;
  }

  private static checkSOAPStructure(note: SOAPNote, issues: ValidationIssue[]) {
    if (!note.assessment.clinicalReasoning || note.assessment.clinicalReasoning.length < 50) {
      issues.push({
        code: 'SOAP_A01',
        category: 'skilled-need',
        severity: 'critical',
        message: 'Assessment section lacks detailed clinical reasoning.',
        regulation: 'Medicare Benefit Policy Manual Ch 15, §220.3',
        suggestion: 'Explain WHY the patient responded the way they did, not just WHAT they did.'
      });
    }
  }

  private static enforceEightMinuteRule(note: SOAPNote, issues: ValidationIssue[]) {
    const totalMinutes = note.objective.timeSpent || 0;
    
    // Medicare 8-Minute Rule Thresholds
    if (totalMinutes < 8 && totalMinutes > 0) {
      issues.push({
        code: 'BILL_001',
        category: 'billing',
        severity: 'critical',
        message: 'Total timed minutes ( < 8 ) do not support a single unit of therapy.',
        regulation: 'CMS IOM 100-04, Ch 5, §20.2',
        suggestion: 'If the session was less than 8 minutes, it is generally non-billable for timed CPT codes.'
      });
    }
  }

  private static checkSkilledNeed(note: SOAPNote, discipline: Discipline, issues: ValidationIssue[]) {
    const text = note.assessment.clinicalImpression.toLowerCase();
    const skilledPhrases = [
      'required skilled intervention',
      'clinical judgment for safety',
      'individualized progression',
      'skilled analysis of performance',
      'therapeutic adaptation'
    ];

    const hasSkilledProof = skilledPhrases.some(p => text.includes(p));

    if (!hasSkilledProof) {
      issues.push({
        code: 'SKILL_002',
        category: 'skilled-need',
        severity: 'critical',
        message: 'Note lacks explicit "Skilled Need" justification used by auditors.',
        regulation: 'Jimmo v. Sebelius Settlement Agreement',
        suggestion: 'Insert phrase: "Patient requires skilled intervention of a therapist to [modify task/ensure safety/analyze physiological response]."'
      });
    }
  }

  private static checkOccupationalFocus(note: SOAPNote, issues: ValidationIssue[]) {
    const assessment = note.assessment.clinicalImpression.toLowerCase();
    const plan = note.plan.interventions.join(' ').toLowerCase();
    
    const taskLinkage = ['dressing', 'feeding', 'grooming', 'hygiene', 'toileting', 'adl', 'iadl'];
    const hasLinkage = taskLinkage.some(t => assessment.includes(t) || plan.includes(t));

    if (!hasLinkage) {
      issues.push({
        code: 'OT_O01',
        category: 'occupational-focus',
        severity: 'warning',
        message: 'OT documentation must link impairments to functional ADL participation.',
        regulation: 'AOTA Practice Framework / Medicare Guidelines',
        suggestion: 'Link ROM/Strength findings directly to an ADL task (e.g., "Increased shoulder flexion required for independent upper body dressing").'
      });
    }
  }

  private static checkSLPSafety(note: SOAPNote, issues: ValidationIssue[]) {
    const text = (note.objective.observation + ' ' + note.assessment.clinicalImpression).toLowerCase();
    if (text.includes('aspiration') || text.includes('coughing') || text.includes('choking')) {
      if (!text.includes('safety') && !text.includes('precaution')) {
        issues.push({
          code: 'SLP_S01',
          category: 'safety',
          severity: 'critical',
          message: 'Signs of aspiration detected but no safety plan/precautions documented.',
          regulation: 'ASHA Clinical Practice Standards',
          suggestion: 'Explicitly document swallow precautions or compensatory strategies deployed.'
        });
      }
    }
  }

  private static checkScopeOfPractice(note: SOAPNote, issues: ValidationIssue[]) {
    const diagnosticPhrases = [
      'patient has parkinson', 
      'is alzheimer', 
      'diagnosis is stroke',
      'has pneumonia',
      'diagnosing with ms',
      'exhibits autism',
      'definitive diagnosis is',
      'suffering from dementia'
    ];
    const text = note.assessment.clinicalImpression.toLowerCase();

    diagnosticPhrases.forEach(p => {
      if (text.includes(p)) {
        issues.push({
          code: 'SCOPE_002',
          category: 'scope-of-practice',
          severity: 'warning',
          message: 'Medical Diagnosis Phrasing: Therapists focus on the functional deficits of a condition, not the medical diagnosis itself.',
          regulation: 'Therapy Practice Acts & Professional Liability Standards',
          suggestion: 'Instead of stating "Patient has X," state "Clinical presentation is consistent with postural instability and gait deficit secondary to neurological diagnosis of X."'
        });
      }
    });
  }

  private static checkVagueLanguage(note: SOAPNote, issues: ValidationIssue[]) {
    const redFlags = ['tolerated well', 'continue current plan', 'plateau', 'same as last session'];
    const text = note.assessment.clinicalImpression.toLowerCase();

    redFlags.forEach(phrase => {
      if (text.includes(phrase)) {
        issues.push({
          code: 'VAGUE_002',
          category: 'vague-language',
          severity: 'warning',
          message: `Auditor Red Flag: "${phrase}" is considered non-skilled filler text.`,
          regulation: 'OIG Clinical Documentation Audit Standards',
          suggestion: 'Replace with objective data (e.g., instead of "tolerated well," use "performed 3 sets of 10 with 2/10 RPE and no reported pain").'
        });
      }
    });
  }
}
