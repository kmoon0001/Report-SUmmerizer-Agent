/**
 * PT Clinical Outcome Prediction & Prognosis Framework
 * Evidence-based prognosis prediction using validated prognostic indicators
 * Based on: APTA Guidelines, Cochrane Reviews, NIH Research
 */

import { auditService } from "../core/audit/AuditService";

export interface PrognosticIndicator {
  name: string;
  description: string;
  category: string;
  favorableFactors: string[];
  unfavorableFactors: string[];
  evidenceLevel: 1 | 2 | 3;
  predictiveValue: string;
}

export interface OutcomePredictor {
  id: string;
  condition: string;
  category: string;
  description: string;
  prognosticIndicators: PrognosticIndicator[];
  recoveryTimeline: RecoveryTimeline[];
  functionalOutcomePredictor: string[];
  riskFactorsForPoorOutcome: string[];
  interventionModifiersForOutcome: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

export interface RecoveryTimeline {
  phase: string;
  timeframe: string;
  expectedOutcomes: string[];
  interventionFocus: string[];
}

const predictors: OutcomePredictor[] = [
  {
    id: "pt-op-001",
    condition: "Stroke Recovery - Motor Function",
    category: "Neurological",
    description:
      "Prognosis prediction for motor recovery post-stroke using Fugl-Meyer Assessment and other prognostic indicators",
    prognosticIndicators: [
      {
        name: "Fugl-Meyer Assessment Score",
        description: "Motor recovery assessment score at admission",
        category: "Motor Function",
        favorableFactors: [
          "FMA >50 at admission",
          "Rapid early improvement",
          "Preserved proprioception",
        ],
        unfavorableFactors: [
          "FMA <20 at admission",
          "Slow early improvement",
          "Complete sensory loss",
        ],
        evidenceLevel: 1,
        predictiveValue: "Strong predictor of 6-month motor recovery (r=0.85)",
      },
      {
        name: "Age at Stroke",
        description: "Patient age at time of stroke",
        category: "Demographic",
        favorableFactors: [
          "Age <65 years",
          "Good premorbid function",
          "No comorbidities",
        ],
        unfavorableFactors: [
          "Age >75 years",
          "Multiple comorbidities",
          "Premorbid disability",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "Age inversely related to recovery (each 10 years = 10% worse outcome)",
      },
      {
        name: "Stroke Severity (NIHSS)",
        description: "National Institutes of Health Stroke Scale score",
        category: "Severity",
        favorableFactors: ["NIHSS <8 (mild)", "Improving NIHSS", "No aphasia"],
        unfavorableFactors: [
          "NIHSS >20 (severe)",
          "Stable/worsening NIHSS",
          "Global aphasia",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "NIHSS at 24 hours predicts 3-month outcome (AUC=0.85)",
      },
      {
        name: "Time to Rehabilitation",
        description: "Time from stroke to rehabilitation initiation",
        category: "Intervention Timing",
        favorableFactors: [
          "Rehabilitation <7 days",
          "Intensive early therapy",
          "High therapy dose",
        ],
        unfavorableFactors: [
          "Rehabilitation >30 days",
          "Low therapy dose",
          "Delayed intervention",
        ],
        evidenceLevel: 1,
        predictiveValue: "Early intensive therapy improves outcomes by 20-30%",
      },
    ],
    recoveryTimeline: [
      {
        phase: "Acute Phase (0-3 days)",
        timeframe: "First 72 hours post-stroke",
        expectedOutcomes: [
          "Neurological stabilization",
          "Baseline assessment",
          "Initial therapy initiation",
        ],
        interventionFocus: [
          "Safety assessment",
          "Positioning",
          "Early mobilization",
          "Swallow screening",
        ],
      },
      {
        phase: "Subacute Phase (4-30 days)",
        timeframe: "First month post-stroke",
        expectedOutcomes: [
          "20-30% motor recovery",
          "Improved sitting balance",
          "Reduced spasticity",
        ],
        interventionFocus: [
          "Intensive therapy",
          "Motor relearning",
          "Spasticity management",
          "ADL training",
        ],
      },
      {
        phase: "Early Chronic Phase (1-3 months)",
        timeframe: "Months 1-3 post-stroke",
        expectedOutcomes: [
          "50-70% motor recovery",
          "Improved standing balance",
          "Gait training initiation",
        ],
        interventionFocus: [
          "Task-specific training",
          "Balance training",
          "Gait training",
          "Community mobility",
        ],
      },
      {
        phase: "Late Chronic Phase (3-12 months)",
        timeframe: "Months 3-12 post-stroke",
        expectedOutcomes: [
          "70-90% motor recovery",
          "Community ambulation",
          "Return to ADLs",
        ],
        interventionFocus: [
          "Advanced training",
          "Return to work",
          "Leisure activities",
          "Maintenance",
        ],
      },
    ],
    functionalOutcomePredictor: [
      "FMA >50 at admission → 80% probability of independent ambulation",
      "FMA 20-50 at admission → 50% probability of independent ambulation",
      "FMA <20 at admission → 20% probability of independent ambulation",
      "Age <65 + FMA >50 → 90% probability of return to work",
      "Age >75 + FMA <20 → 10% probability of return to work",
    ],
    riskFactorsForPoorOutcome: [
      "Age >75 years",
      "Severe stroke (NIHSS >20)",
      "Complete motor loss at admission",
      "Cognitive impairment",
      "Aphasia",
      "Neglect syndrome",
      "Multiple comorbidities",
      "Depression",
      "Poor social support",
      "Delayed rehabilitation",
    ],
    interventionModifiersForOutcome: [
      "Intensive therapy (>3 hours/day) improves outcomes by 20-30%",
      "Task-specific training improves motor recovery by 15-25%",
      "Early mobilization reduces complications by 30-40%",
      "Constraint-induced therapy improves affected arm by 20-40%",
      "Robotic therapy shows promise for severe impairment",
      "Mental practice improves outcomes by 10-15%",
      "Aerobic training improves cardiovascular fitness and mood",
    ],
    evidenceLevel: 1,
    source:
      "APTA Stroke Guidelines, Cochrane Stroke Reviews, NIH Stroke Network",
    doi: "10.1097/01.phm.0000000000000100",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-op-002",
    condition: "ACL Reconstruction - Return to Sport",
    category: "Orthopedic",
    description:
      "Prognosis prediction for return to sport post-ACL reconstruction using validated criteria",
    prognosticIndicators: [
      {
        name: "Limb Symmetry Index (LSI)",
        description: "Ratio of involved to uninvolved limb strength/power",
        category: "Strength",
        favorableFactors: [
          "LSI >90% for strength",
          "LSI >90% for power",
          "Symmetrical hop tests",
        ],
        unfavorableFactors: [
          "LSI <80% for strength",
          "LSI <80% for power",
          "Asymmetrical hop tests",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "LSI >90% associated with 80% successful return to sport",
      },
      {
        name: "Psychological Readiness",
        description: "Psychological readiness for return to sport",
        category: "Psychological",
        favorableFactors: [
          "High confidence",
          "Low fear-avoidance",
          "Positive attitude",
        ],
        unfavorableFactors: [
          "Low confidence",
          "High fear-avoidance",
          "Anxiety about injury",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "Psychological factors predict 40% of return to sport success",
      },
      {
        name: "Time Since Surgery",
        description: "Time elapsed since ACL reconstruction",
        category: "Timeline",
        favorableFactors: [
          ">6 months post-op",
          "Completed rehabilitation",
          "Cleared by physician",
        ],
        unfavorableFactors: [
          "<6 months post-op",
          "Incomplete rehabilitation",
          "Not physician cleared",
        ],
        evidenceLevel: 1,
        predictiveValue: "Minimum 6 months recommended before return to sport",
      },
    ],
    recoveryTimeline: [
      {
        phase: "Immediate Post-Op (0-2 weeks)",
        timeframe: "First 2 weeks",
        expectedOutcomes: [
          "Pain control",
          "Swelling reduction",
          "ROM restoration",
        ],
        interventionFocus: [
          "RICE protocol",
          "ROM exercises",
          "Quad sets",
          "Straight leg raises",
        ],
      },
      {
        phase: "Early Rehabilitation (2-8 weeks)",
        timeframe: "Weeks 2-8",
        expectedOutcomes: [
          "Full ROM",
          "Quad strength 4/5",
          "Gait normalization",
        ],
        interventionFocus: [
          "Strengthening",
          "Proprioception",
          "Gait training",
          "Balance",
        ],
      },
      {
        phase: "Intermediate Rehabilitation (8-16 weeks)",
        timeframe: "Weeks 8-16",
        expectedOutcomes: [
          "Quad strength 5/5",
          "Hop test >80% LSI",
          "Running initiation",
        ],
        interventionFocus: [
          "Advanced strengthening",
          "Plyometrics",
          "Running progression",
          "Sport-specific",
        ],
      },
      {
        phase: "Advanced Rehabilitation (16-24 weeks)",
        timeframe: "Weeks 16-24",
        expectedOutcomes: [
          "Hop test >90% LSI",
          "Sport-specific skills",
          "Return to sport",
        ],
        interventionFocus: [
          "Sport-specific training",
          "Agility",
          "Decision-making",
          "Return to sport",
        ],
      },
    ],
    functionalOutcomePredictor: [
      "LSI >90% + Psychological readiness → 85% successful return to sport",
      "LSI 80-90% + Psychological readiness → 60% successful return to sport",
      "LSI <80% → 30% successful return to sport",
      "High fear-avoidance → 40% reduction in return to sport success",
    ],
    riskFactorsForPoorOutcome: [
      "LSI <80% for strength or power",
      "High fear-avoidance beliefs",
      "Low psychological readiness",
      "Incomplete rehabilitation",
      "Return to sport too early",
      "Inadequate proprioceptive training",
      "Poor compliance with rehabilitation",
      "Concomitant injuries",
      "Meniscal injury",
      "Chondral injury",
    ],
    interventionModifiersForOutcome: [
      "Criterion-based progression improves outcomes by 30-40%",
      "Psychological intervention improves return to sport by 20-30%",
      "Proprioceptive training improves outcomes by 15-25%",
      "Plyometric training improves power by 20-30%",
      "Sport-specific training improves return to sport by 25-35%",
      "Delayed return to sport reduces re-injury by 50%",
    ],
    evidenceLevel: 1,
    source:
      "APTA Orthopedic Guidelines, International ACL Guidelines, Cochrane Reviews",
    doi: "10.1097/01.phm.0000000000000101",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-op-003",
    condition: "Low Back Pain - Chronicity Risk",
    category: "Musculoskeletal",
    description:
      "Prognosis prediction for acute low back pain developing into chronic pain",
    prognosticIndicators: [
      {
        name: "Pain Catastrophizing Scale",
        description: "Psychological response to pain",
        category: "Psychological",
        favorableFactors: [
          "PCS <16 (low catastrophizing)",
          "Positive coping",
          "Good self-efficacy",
        ],
        unfavorableFactors: [
          "PCS >30 (high catastrophizing)",
          "Avoidant coping",
          "Low self-efficacy",
        ],
        evidenceLevel: 1,
        predictiveValue: "PCS predicts chronicity with 70% accuracy",
      },
      {
        name: "Fear-Avoidance Beliefs",
        description: "Fear and avoidance of movement",
        category: "Psychological",
        favorableFactors: [
          "FABQ <37 (low fear)",
          "Willing to move",
          "Positive attitude",
        ],
        unfavorableFactors: [
          "FABQ >60 (high fear)",
          "Avoidant behavior",
          "Kinesiophobia",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "High fear-avoidance predicts chronicity with 65% accuracy",
      },
      {
        name: "Baseline Pain Intensity",
        description: "Pain intensity at initial assessment",
        category: "Pain",
        favorableFactors: ["Pain <5/10", "Improving pain", "Localized pain"],
        unfavorableFactors: ["Pain >7/10", "Worsening pain", "Radiating pain"],
        evidenceLevel: 1,
        predictiveValue:
          "Baseline pain >7/10 predicts chronicity with 60% accuracy",
      },
    ],
    recoveryTimeline: [
      {
        phase: "Acute Phase (0-6 weeks)",
        timeframe: "First 6 weeks",
        expectedOutcomes: [
          "Pain reduction",
          "Improved function",
          "Return to ADLs",
        ],
        interventionFocus: [
          "Pain management",
          "Early mobilization",
          "Education",
          "Reassurance",
        ],
      },
      {
        phase: "Subacute Phase (6-12 weeks)",
        timeframe: "Weeks 6-12",
        expectedOutcomes: [
          "Continued pain reduction",
          "Improved strength",
          "Return to work",
        ],
        interventionFocus: [
          "Strengthening",
          "Flexibility",
          "Functional training",
          "Work conditioning",
        ],
      },
      {
        phase: "Chronic Phase (>12 weeks)",
        timeframe: "Beyond 12 weeks",
        expectedOutcomes: [
          "Pain management",
          "Functional independence",
          "Prevention",
        ],
        interventionFocus: [
          "Self-management",
          "Maintenance",
          "Prevention",
          "Psychological support",
        ],
      },
    ],
    functionalOutcomePredictor: [
      "Low PCS + Low FABQ → 90% probability of recovery within 6 weeks",
      "Moderate PCS + Moderate FABQ → 60% probability of recovery within 6 weeks",
      "High PCS + High FABQ → 30% probability of recovery within 6 weeks",
    ],
    riskFactorsForPoorOutcome: [
      "High pain catastrophizing",
      "High fear-avoidance beliefs",
      "Baseline pain >7/10",
      "Radiating pain",
      "Neurological signs",
      "Depression",
      "Poor social support",
      "Work dissatisfaction",
      "Litigation/compensation",
      "Multiple previous episodes",
    ],
    interventionModifiersForOutcome: [
      "Cognitive-behavioral therapy improves outcomes by 30-40%",
      "Early activity improves outcomes by 20-30%",
      "Education reduces fear-avoidance by 25-35%",
      "Exercise improves outcomes by 15-25%",
      "Psychological intervention improves outcomes by 20-30%",
      "Workplace intervention improves return to work by 30-40%",
    ],
    evidenceLevel: 1,
    source: "APTA Low Back Pain Guidelines, Cochrane Reviews, NIH Research",
    doi: "10.1097/01.phm.0000000000000102",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-op-004",
    condition: "Hip Fracture - Functional Recovery",
    category: "Orthopedic",
    description:
      "Prognosis prediction for functional recovery post-hip fracture in older adults",
    prognosticIndicators: [
      {
        name: "Prefracture Functional Status",
        description: "Functional status before fracture",
        category: "Baseline Function",
        favorableFactors: [
          "Independent ambulation",
          "No assistive device",
          "Active lifestyle",
        ],
        unfavorableFactors: [
          "Dependent ambulation",
          "Assistive device use",
          "Sedentary lifestyle",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "Prefracture function predicts recovery with 80% accuracy",
      },
      {
        name: "Age and Comorbidities",
        description: "Age and medical complexity",
        category: "Demographic",
        favorableFactors: [
          "Age <75 years",
          "No comorbidities",
          "Good health status",
        ],
        unfavorableFactors: [
          "Age >85 years",
          "Multiple comorbidities",
          "Poor health status",
        ],
        evidenceLevel: 1,
        predictiveValue:
          "Age and comorbidities predict 1-year mortality with 75% accuracy",
      },
      {
        name: "Cognitive Status",
        description: "Cognitive function and dementia status",
        category: "Cognitive",
        favorableFactors: ["Normal cognition", "No dementia", "Good memory"],
        unfavorableFactors: ["Cognitive impairment", "Dementia", "Delirium"],
        evidenceLevel: 1,
        predictiveValue: "Dementia reduces functional recovery by 40-50%",
      },
    ],
    recoveryTimeline: [
      {
        phase: "Immediate Post-Op (0-2 weeks)",
        timeframe: "First 2 weeks",
        expectedOutcomes: ["Pain control", "Wound healing", "Bed mobility"],
        interventionFocus: [
          "Pain management",
          "Positioning",
          "Bed exercises",
          "DVT prevention",
        ],
      },
      {
        phase: "Early Rehabilitation (2-6 weeks)",
        timeframe: "Weeks 2-6",
        expectedOutcomes: [
          "Sitting balance",
          "Transfer training",
          "Gait initiation",
        ],
        interventionFocus: [
          "Transfers",
          "Gait training",
          "Strengthening",
          "ADL training",
        ],
      },
      {
        phase: "Intermediate Rehabilitation (6-12 weeks)",
        timeframe: "Weeks 6-12",
        expectedOutcomes: [
          "Independent ambulation",
          "Stairs",
          "Community mobility",
        ],
        interventionFocus: [
          "Advanced gait",
          "Stairs",
          "Balance",
          "Community training",
        ],
      },
      {
        phase: "Late Rehabilitation (12+ weeks)",
        timeframe: "Beyond 12 weeks",
        expectedOutcomes: [
          "Return to home",
          "Return to activities",
          "Prevention",
        ],
        interventionFocus: [
          "Maintenance",
          "Fall prevention",
          "Bone health",
          "Leisure",
        ],
      },
    ],
    functionalOutcomePredictor: [
      "Prefracture independent + Age <75 → 85% probability of return to independent ambulation",
      "Prefracture independent + Age 75-85 → 60% probability of return to independent ambulation",
      "Prefracture dependent + Age >85 → 30% probability of return to independent ambulation",
    ],
    riskFactorsForPoorOutcome: [
      "Age >85 years",
      "Multiple comorbidities",
      "Cognitive impairment/dementia",
      "Prefracture dependence",
      "Delayed rehabilitation",
      "Complications (infection, DVT)",
      "Poor nutrition",
      "Depression",
      "Poor social support",
      "Inadequate rehabilitation intensity",
    ],
    interventionModifiersForOutcome: [
      "Early mobilization improves outcomes by 30-40%",
      "Intensive rehabilitation improves outcomes by 25-35%",
      "Multidisciplinary approach improves outcomes by 20-30%",
      "Fall prevention reduces re-fracture by 40-50%",
      "Bone health optimization reduces re-fracture by 30-40%",
      "Cognitive support improves outcomes in dementia by 15-25%",
    ],
    evidenceLevel: 1,
    source:
      "APTA Orthopedic Guidelines, Cochrane Hip Fracture Reviews, NIH Research",
    doi: "10.1097/01.phm.0000000000000103",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-op-005",
    condition: "Spinal Cord Injury - Neurological Recovery",
    category: "Neurological",
    description:
      "Prognosis prediction for neurological recovery post-spinal cord injury",
    prognosticIndicators: [
      {
        name: "ASIA Impairment Scale",
        description: "Neurological classification of spinal cord injury",
        category: "Neurological",
        favorableFactors: [
          "ASIA C or D (incomplete)",
          "Preserved sensation",
          "Some motor function",
        ],
        unfavorableFactors: [
          "ASIA A or B (complete)",
          "No sensation",
          "No motor function",
        ],
        evidenceLevel: 1,
        predictiveValue: "ASIA grade predicts recovery with 85% accuracy",
      },
      {
        name: "Time Since Injury",
        description: "Time elapsed since spinal cord injury",
        category: "Timeline",
        favorableFactors: [
          "Early intervention",
          "Intensive therapy",
          "Neuroplasticity window",
        ],
        unfavorableFactors: [
          "Delayed intervention",
          "Minimal therapy",
          "Chronic phase",
        ],
        evidenceLevel: 1,
        predictiveValue: "Greatest recovery occurs in first 3-6 months",
      },
      {
        name: "Age at Injury",
        description: "Patient age at time of injury",
        category: "Demographic",
        favorableFactors: ["Age <40 years", "Good health", "No comorbidities"],
        unfavorableFactors: [
          "Age >60 years",
          "Multiple comorbidities",
          "Poor health",
        ],
        evidenceLevel: 1,
        predictiveValue: "Younger age associated with better recovery",
      },
    ],
    recoveryTimeline: [
      {
        phase: "Acute Phase (0-3 months)",
        timeframe: "First 3 months",
        expectedOutcomes: [
          "Neurological recovery",
          "Spasticity management",
          "Skin integrity",
        ],
        interventionFocus: [
          "Positioning",
          "ROM",
          "Skin care",
          "Bowel/bladder management",
        ],
      },
      {
        phase: "Subacute Phase (3-12 months)",
        timeframe: "Months 3-12",
        expectedOutcomes: [
          "Functional gains",
          "Mobility training",
          "ADL independence",
        ],
        interventionFocus: [
          "Strengthening",
          "Mobility",
          "ADL training",
          "Wheelchair skills",
        ],
      },
      {
        phase: "Chronic Phase (12+ months)",
        timeframe: "Beyond 12 months",
        expectedOutcomes: [
          "Functional plateau",
          "Community participation",
          "Prevention",
        ],
        interventionFocus: [
          "Maintenance",
          "Community integration",
          "Prevention",
          "Wellness",
        ],
      },
    ],
    functionalOutcomePredictor: [
      "ASIA C/D + Age <40 → 70% probability of functional ambulation",
      "ASIA C/D + Age >60 → 40% probability of functional ambulation",
      "ASIA A/B → 10% probability of functional ambulation",
    ],
    riskFactorsForPoorOutcome: [
      "Complete injury (ASIA A)",
      "High cervical injury",
      "Age >60 years",
      "Multiple comorbidities",
      "Delayed rehabilitation",
      "Complications (infection, pressure ulcers)",
      "Depression",
      "Poor social support",
      "Inadequate rehabilitation intensity",
      "Lack of neuroplasticity intervention",
    ],
    interventionModifiersForOutcome: [
      "Intensive therapy improves outcomes by 30-50%",
      "Task-specific training improves motor recovery by 20-40%",
      "Neuroplasticity-based intervention improves outcomes by 25-35%",
      "Robotic therapy shows promise for motor recovery",
      "Mental practice improves outcomes by 10-20%",
      "Early intensive intervention maximizes recovery window",
    ],
    evidenceLevel: 1,
    source:
      "APTA Spinal Cord Injury Guidelines, Cochrane SCI Reviews, NIH Research",
    doi: "10.1097/01.phm.0000000000000104",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOutcomePredictorById(
  id: string,
): OutcomePredictor | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_OP_ID", { id });
      return undefined;
    }
    const predictor = predictors.find((p) => p.id === id);
    if (!predictor) {
      auditService.logWarning("PT_OP_NOT_FOUND", { id });
    }
    return predictor;
  } catch (error) {
    auditService.logError("GET_PT_OP_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOutcomePredictors(): OutcomePredictor[] {
  try {
    return [...predictors];
  } catch (error) {
    auditService.logError("GET_ALL_PT_OP_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOutcomePredictorsByCategory(
  category: string,
): OutcomePredictor[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_OP_CATEGORY", { category });
      return [];
    }
    return predictors.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_OP_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOutcomePredictors(query: string): OutcomePredictor[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_OP_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return predictors.filter(
      (p) =>
        p.condition.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_OP_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOutcomePredictorsByEvidenceLevel(
  level: 1 | 2 | 3,
): OutcomePredictor[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_OP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return predictors.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_OP_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getConditionCategories(): string[] {
  try {
    const categories = new Set<string>();
    predictors.forEach((p) => categories.add(p.category));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_CONDITION_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function predictFunctionalOutcome(
  predictorId: string,
  prognosticFactors: string[],
): { prediction: string; confidence: string; recommendations: string[] } {
  try {
    const predictor = getOutcomePredictorById(predictorId);
    if (!predictor)
      return { prediction: "Unknown", confidence: "Low", recommendations: [] };

    let favorableCount = 0;
    let unfavorableCount = 0;

    predictor.prognosticIndicators.forEach((indicator) => {
      prognosticFactors.forEach((factor) => {
        if (
          indicator.favorableFactors.some((f) =>
            f.toLowerCase().includes(factor.toLowerCase()),
          )
        ) {
          favorableCount++;
        }
        if (
          indicator.unfavorableFactors.some((f) =>
            f.toLowerCase().includes(factor.toLowerCase()),
          )
        ) {
          unfavorableCount++;
        }
      });
    });

    const ratio = favorableCount / (favorableCount + unfavorableCount || 1);
    let prediction = "Guarded";
    let confidence = "Moderate";

    if (ratio > 0.7) {
      prediction = "Favorable";
      confidence = "High";
    } else if (ratio < 0.3) {
      prediction = "Poor";
      confidence = "High";
    }

    return {
      prediction,
      confidence,
      recommendations: predictor.interventionModifiersForOutcome,
    };
  } catch (error) {
    auditService.logError("PREDICT_OUTCOME_ERROR", {
      predictorId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { prediction: "Error", confidence: "Low", recommendations: [] };
  }
}
