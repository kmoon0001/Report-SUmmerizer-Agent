
export const MOCA_RANGES = [
  { min: 26, max: 30, label: 'Normal', color: 'text-emerald-600 bg-emerald-50' },
  { min: 18, max: 25, label: 'Mild Cognitive Impairment (MCI)', color: 'text-amber-600 bg-amber-50' },
  { min: 10, max: 17, label: 'Moderate Cognitive Impairment', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 9, label: 'Severe Cognitive Impairment', color: 'text-rose-600 bg-rose-50' }
];

export const MASA_RANGES = [
  { min: 178, max: 200, label: 'No Abnormality', color: 'text-emerald-600 bg-emerald-50' },
  { min: 168, max: 177, label: 'Mild Dysphagia', color: 'text-amber-600 bg-amber-50' },
  { min: 139, max: 167, label: 'Moderate Dysphagia', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 138, label: 'Severe Dysphagia', color: 'text-rose-600 bg-rose-50' }
];

export interface ExplainedScore {
  value: number;
  shapValues: Record<string, number>;
}

/**
 * Calculates a total score with SHAP-inspired feature attribution.
 */
export function calculateTotalScore(scores: Record<string, number>): ExplainedScore {
  const value = Object.values(scores).reduce((a, b) => a + b, 0);
  return {
    value,
    shapValues: { ...scores }
  };
}

/**
 * Calculates WAB Aphasia Quotient with scaled SHAP values.
 */
export function calculateWabScore(scores: Record<string, number>): ExplainedScore {
  const result = calculateTotalScore(scores);
  const aqValue = result.value * 2; // AQ = Sum * 2
  
  // Scale SHAP values to match the AQ multiplier
  const shapValues: Record<string, number> = {};
  Object.keys(result.shapValues).forEach(key => {
    shapValues[key] = result.shapValues[key] * 2;
  });

  return {
    value: aqValue,
    shapValues
  };
}

export function calculateAidsScore(scores: Record<string, number>): ExplainedScore {
  const understood = scores['Words Understood'] || 0;
  const total = scores['Total Words'] || 1;
  const value = Math.round((understood / total) * 100);
  
  return {
    value,
    shapValues: { ...scores }
  };
}

export function getMocaInterpretation(score: number) {
  return MOCA_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getMasaInterpretation(score: number) {
  return MASA_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export const EAT10_RANGES = [
  { min: 0, max: 2, label: 'Normal', color: 'text-emerald-600 bg-emerald-50' },
  { min: 3, max: 40, label: 'Abnormal (Risk of Dysphagia)', color: 'text-rose-600 bg-rose-50' }
];

export const GUSS_RANGES = [
  { min: 20, max: 20, label: 'Normal / No Dysphagia', color: 'text-emerald-600 bg-emerald-50' },
  { min: 15, max: 19, label: 'Slight Dysphagia', color: 'text-amber-600 bg-amber-50' },
  { min: 10, max: 14, label: 'Moderate Dysphagia', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 9, label: 'Severe Dysphagia', color: 'text-rose-600 bg-rose-50' }
];

export const FLCI_RANGES = [
  { min: 65, max: 88, label: 'Mild Impairment', color: 'text-amber-600 bg-amber-50' },
  { min: 33, max: 64, label: 'Moderate Impairment', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 32, label: 'Severe Impairment', color: 'text-rose-600 bg-rose-50' }
];

export const RIPAG2_RANGES = [
  { min: 80, max: 100, label: 'Mild Impairment', color: 'text-amber-600 bg-amber-50' },
  { min: 50, max: 79, label: 'Moderate Impairment', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 49, label: 'Severe Impairment', color: 'text-rose-600 bg-rose-50' }
];

export const WABR_RANGES = [
  { min: 93.8, max: 100, label: 'Within Normal Limits', color: 'text-emerald-600 bg-emerald-50' },
  { min: 76, max: 93.7, label: 'Mild Aphasia', color: 'text-amber-600 bg-amber-50' },
  { min: 51, max: 75.9, label: 'Moderate Aphasia', color: 'text-orange-600 bg-orange-50' },
  { min: 26, max: 50.9, label: 'Severe Aphasia', color: 'text-rose-600 bg-rose-50' },
  { min: 0, max: 25.9, label: 'Very Severe Aphasia', color: 'text-rose-800 bg-rose-100' }
];

export const AIDS_RANGES = [
  { min: 90, max: 100, label: 'Normal Intelligibility', color: 'text-emerald-600 bg-emerald-50' },
  { min: 70, max: 89, label: 'Mild Dysarthria', color: 'text-amber-600 bg-amber-50' },
  { min: 40, max: 69, label: 'Moderate Dysarthria', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 39, label: 'Severe Dysarthria', color: 'text-rose-600 bg-rose-50' }
];

export const FDA2_RANGES = [
  { min: 55, max: 63, label: 'Normal', color: 'text-emerald-600 bg-emerald-50' },
  { min: 40, max: 54, label: 'Mild Dysarthria', color: 'text-amber-600 bg-amber-50' },
  { min: 20, max: 39, label: 'Moderate Dysarthria', color: 'text-orange-600 bg-orange-50' },
  { min: 0, max: 19, label: 'Severe Dysarthria', color: 'text-rose-600 bg-rose-50' }
];

export function getEat10Interpretation(score: number) {
  return EAT10_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getGussInterpretation(score: number) {
  return GUSS_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getFlciInterpretation(score: number) {
  return FLCI_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getRipaG2Interpretation(score: number) {
  return RIPAG2_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getWabrInterpretation(score: number) {
  return WABR_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getAidsInterpretation(score: number) {
  return AIDS_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

export function getFda2Interpretation(score: number) {
  return FDA2_RANGES.find(r => score >= r.min && score <= r.max) || null;
}

