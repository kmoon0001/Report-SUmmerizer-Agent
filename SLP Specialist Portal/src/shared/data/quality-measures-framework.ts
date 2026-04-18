/**
 * Quality Measures Framework
 * CMS quality measures and benchmarks for PT and OT
 * Sources: CMS, APTA, AOTA, clinical practice standards
 */

export type MeasureType =
  | "functional-improvement"
  | "patient-satisfaction"
  | "discharge-disposition"
  | "readmission"
  | "safety"
  | "efficiency";
export type Discipline = "pt" | "ot" | "shared";
export type BenchmarkLevel = "excellent" | "good" | "fair" | "poor";

export interface QualityMeasure {
  id: string;
  name: string;
  measureType: MeasureType;
  discipline: Discipline;
  description: string;
  numerator: string; // What's being measured
  denominator: string; // Population being measured
  dataSource: string;
  reportingFrequency: string;
  benchmarks: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  unit: string; // %, count, days, etc.
  source: string;
  citation: string;
  lastUpdated: Date;
}

export interface OutcomeBenchmark {
  id: string;
  condition: string;
  discipline: Discipline;
  functionalImprovementTarget: number; // % of patients with improvement
  averageLengthOfStay: number; // days
  averageVisits: number;
  dischargeToHomeTarget: number; // %
  readmissionRateTarget: number; // %
  patientSatisfactionTarget: number; // %
  source: string;
  citation: string;
  lastUpdated: Date;
}

// Functional Improvement Measures
const functionalImprovementMeasures: QualityMeasure[] = [
  {
    id: "qm-func-001",
    name: "Functional Improvement Rate",
    measureType: "functional-improvement",
    discipline: "shared",
    description:
      "Percentage of patients who demonstrate functional improvement from admission to discharge",
    numerator:
      "Patients with functional improvement (≥MCID on outcome measure)",
    denominator: "All patients discharged from therapy",
    dataSource: "Outcome measure scores (FIM, LEFS, DASH, COPM, etc.)",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 85,
      good: 75,
      fair: 65,
      poor: 50,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Quality Reporting System",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-func-002",
    name: "Discharge Functional Status",
    measureType: "functional-improvement",
    discipline: "shared",
    description: "Average functional status at discharge compared to admission",
    numerator: "Sum of discharge FIM scores",
    denominator: "Number of patients discharged",
    dataSource: "FIM scores at admission and discharge",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 110,
      good: 100,
      fair: 90,
      poor: 80,
    },
    unit: "FIM points",
    source: "CMS",
    citation: "CMS Quality Reporting System",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-func-003",
    name: "Motor FIM Gain",
    measureType: "functional-improvement",
    discipline: "pt",
    description: "Average motor FIM improvement from admission to discharge",
    numerator: "Sum of motor FIM gains",
    denominator: "Number of patients discharged",
    dataSource: "Motor FIM scores at admission and discharge",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 20,
      good: 15,
      fair: 10,
      poor: 5,
    },
    unit: "FIM points",
    source: "CMS",
    citation: "CMS Quality Reporting System",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-func-004",
    name: "Cognitive FIM Gain",
    measureType: "functional-improvement",
    discipline: "ot",
    description:
      "Average cognitive FIM improvement from admission to discharge",
    numerator: "Sum of cognitive FIM gains",
    denominator: "Number of patients discharged",
    dataSource: "Cognitive FIM scores at admission and discharge",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 8,
      good: 6,
      fair: 4,
      poor: 2,
    },
    unit: "FIM points",
    source: "CMS",
    citation: "CMS Quality Reporting System",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Patient Satisfaction Measures
const patientSatisfactionMeasures: QualityMeasure[] = [
  {
    id: "qm-sat-001",
    name: "Overall Patient Satisfaction",
    measureType: "patient-satisfaction",
    discipline: "shared",
    description:
      "Percentage of patients satisfied or very satisfied with therapy",
    numerator: "Patients rating satisfaction 4-5 on 5-point scale",
    denominator: "All patients surveyed",
    dataSource: "Patient satisfaction survey",
    reportingFrequency: "Quarterly",
    benchmarks: {
      excellent: 90,
      good: 80,
      fair: 70,
      poor: 60,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Patient Experience Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-sat-002",
    name: "Therapist Communication Satisfaction",
    measureType: "patient-satisfaction",
    discipline: "shared",
    description:
      "Percentage of patients satisfied with therapist communication",
    numerator: "Patients rating communication 4-5 on 5-point scale",
    denominator: "All patients surveyed",
    dataSource: "Patient satisfaction survey",
    reportingFrequency: "Quarterly",
    benchmarks: {
      excellent: 95,
      good: 90,
      fair: 85,
      poor: 75,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Patient Experience Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-sat-003",
    name: "Goal Achievement Satisfaction",
    measureType: "patient-satisfaction",
    discipline: "shared",
    description: "Percentage of patients satisfied with progress toward goals",
    numerator: "Patients rating goal progress 4-5 on 5-point scale",
    denominator: "All patients surveyed",
    dataSource: "Patient satisfaction survey",
    reportingFrequency: "Quarterly",
    benchmarks: {
      excellent: 85,
      good: 75,
      fair: 65,
      poor: 55,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Patient Experience Measures",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Discharge Disposition Measures
const dischargeDispositionMeasures: QualityMeasure[] = [
  {
    id: "qm-disc-001",
    name: "Discharge to Home Rate",
    measureType: "discharge-disposition",
    discipline: "shared",
    description: "Percentage of patients discharged to home (vs. facility)",
    numerator: "Patients discharged to home",
    denominator: "All patients discharged",
    dataSource: "Discharge disposition documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 85,
      good: 75,
      fair: 65,
      poor: 55,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Discharge Disposition Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-disc-002",
    name: "Discharge to Community Rate",
    measureType: "discharge-disposition",
    discipline: "shared",
    description:
      "Percentage of patients discharged to community (home or community setting)",
    numerator: "Patients discharged to community",
    denominator: "All patients discharged",
    dataSource: "Discharge disposition documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 90,
      good: 85,
      fair: 75,
      poor: 65,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Discharge Disposition Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-disc-003",
    name: "Facility Discharge Rate",
    measureType: "discharge-disposition",
    discipline: "shared",
    description:
      "Percentage of patients discharged to facility (SNF, ALF, etc.)",
    numerator: "Patients discharged to facility",
    denominator: "All patients discharged",
    dataSource: "Discharge disposition documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 10,
      good: 15,
      fair: 25,
      poor: 35,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Discharge Disposition Measures",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Readmission Measures
const readmissionMeasures: QualityMeasure[] = [
  {
    id: "qm-read-001",
    name: "30-Day Readmission Rate",
    measureType: "readmission",
    discipline: "shared",
    description:
      "Percentage of patients readmitted within 30 days of discharge",
    numerator: "Patients readmitted within 30 days",
    denominator: "All patients discharged",
    dataSource: "Readmission documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 5,
      good: 10,
      fair: 15,
      poor: 20,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Readmission Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-read-002",
    name: "60-Day Readmission Rate",
    measureType: "readmission",
    discipline: "shared",
    description:
      "Percentage of patients readmitted within 60 days of discharge",
    numerator: "Patients readmitted within 60 days",
    denominator: "All patients discharged",
    dataSource: "Readmission documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 8,
      good: 12,
      fair: 18,
      poor: 25,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Readmission Measures",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Safety Measures
const safetyMeasures: QualityMeasure[] = [
  {
    id: "qm-safe-001",
    name: "Adverse Event Rate",
    measureType: "safety",
    discipline: "shared",
    description: "Number of adverse events per 1000 patient visits",
    numerator: "Number of adverse events",
    denominator: "Total patient visits × 1000",
    dataSource: "Incident reports",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 0,
      good: 1,
      fair: 2,
      poor: 5,
    },
    unit: "per 1000 visits",
    source: "CMS",
    citation: "CMS Safety Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-safe-002",
    name: "Fall Rate",
    measureType: "safety",
    discipline: "shared",
    description: "Number of falls per 1000 patient visits",
    numerator: "Number of falls",
    denominator: "Total patient visits × 1000",
    dataSource: "Fall incident reports",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 0,
      good: 0.5,
      fair: 1,
      poor: 2,
    },
    unit: "per 1000 visits",
    source: "CMS",
    citation: "CMS Safety Measures",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Efficiency Measures
const efficiencyMeasures: QualityMeasure[] = [
  {
    id: "qm-eff-001",
    name: "Average Length of Stay",
    measureType: "efficiency",
    discipline: "shared",
    description: "Average number of days from admission to discharge",
    numerator: "Sum of length of stay for all patients",
    denominator: "Number of patients discharged",
    dataSource: "Admission and discharge dates",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 10,
      good: 15,
      fair: 20,
      poor: 30,
    },
    unit: "days",
    source: "CMS",
    citation: "CMS Efficiency Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-eff-002",
    name: "Average Visits per Episode",
    measureType: "efficiency",
    discipline: "shared",
    description: "Average number of visits per episode of care",
    numerator: "Total visits",
    denominator: "Number of episodes",
    dataSource: "Visit documentation",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 12,
      good: 15,
      fair: 18,
      poor: 25,
    },
    unit: "visits",
    source: "CMS",
    citation: "CMS Efficiency Measures",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "qm-eff-003",
    name: "Therapy Utilization Rate",
    measureType: "efficiency",
    discipline: "shared",
    description: "Percentage of scheduled visits that are completed",
    numerator: "Completed visits",
    denominator: "Scheduled visits",
    dataSource: "Visit scheduling and completion records",
    reportingFrequency: "Monthly",
    benchmarks: {
      excellent: 95,
      good: 90,
      fair: 85,
      poor: 80,
    },
    unit: "%",
    source: "CMS",
    citation: "CMS Efficiency Measures",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Combined measures
const allMeasures: QualityMeasure[] = [
  ...functionalImprovementMeasures,
  ...patientSatisfactionMeasures,
  ...dischargeDispositionMeasures,
  ...readmissionMeasures,
  ...safetyMeasures,
  ...efficiencyMeasures,
];

// Outcome Benchmarks by Condition
const outcomeBenchmarks: OutcomeBenchmark[] = [
  {
    id: "bench-stroke-001",
    condition: "stroke",
    discipline: "shared",
    functionalImprovementTarget: 80,
    averageLengthOfStay: 14,
    averageVisits: 18,
    dischargeToHomeTarget: 75,
    readmissionRateTarget: 8,
    patientSatisfactionTarget: 85,
    source: "CMS",
    citation: "CMS Stroke Outcome Benchmarks",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "bench-lbp-001",
    condition: "low-back-pain",
    discipline: "pt",
    functionalImprovementTarget: 85,
    averageLengthOfStay: 7,
    averageVisits: 12,
    dischargeToHomeTarget: 95,
    readmissionRateTarget: 5,
    patientSatisfactionTarget: 90,
    source: "APTA",
    citation: "APTA Low Back Pain Benchmarks",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "bench-shoulder-001",
    condition: "shoulder-pain",
    discipline: "pt",
    functionalImprovementTarget: 80,
    averageLengthOfStay: 6,
    averageVisits: 10,
    dischargeToHomeTarget: 98,
    readmissionRateTarget: 3,
    patientSatisfactionTarget: 92,
    source: "APTA",
    citation: "APTA Shoulder Pain Benchmarks",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "bench-adl-001",
    condition: "ADL-limitation",
    discipline: "ot",
    functionalImprovementTarget: 75,
    averageLengthOfStay: 10,
    averageVisits: 15,
    dischargeToHomeTarget: 80,
    readmissionRateTarget: 10,
    patientSatisfactionTarget: 85,
    source: "AOTA",
    citation: "AOTA ADL Limitation Benchmarks",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get quality measure by ID
 */
export function getQualityMeasureById(id: string): QualityMeasure | undefined {
  return allMeasures.find((m) => m.id === id);
}

/**
 * Get quality measures by type
 */
export function getQualityMeasuresByType(type: MeasureType): QualityMeasure[] {
  return allMeasures.filter((m) => m.measureType === type);
}

/**
 * Get quality measures by discipline
 */
export function getQualityMeasuresByDiscipline(
  discipline: Discipline,
): QualityMeasure[] {
  return allMeasures.filter(
    (m) => m.discipline === discipline || m.discipline === "shared",
  );
}

/**
 * Get all quality measures
 */
export function getAllQualityMeasures(): QualityMeasure[] {
  return allMeasures;
}

/**
 * Get outcome benchmark by ID
 */
export function getOutcomeBenchmarkById(
  id: string,
): OutcomeBenchmark | undefined {
  return outcomeBenchmarks.find((b) => b.id === id);
}

/**
 * Get outcome benchmarks by condition
 */
export function getOutcomeBenchmarksByCondition(
  condition: string,
): OutcomeBenchmark[] {
  return outcomeBenchmarks.filter((b) => b.condition === condition);
}

/**
 * Get outcome benchmarks by discipline
 */
export function getOutcomeBenchmarksByDiscipline(
  discipline: Discipline,
): OutcomeBenchmark[] {
  return outcomeBenchmarks.filter(
    (b) => b.discipline === discipline || b.discipline === "shared",
  );
}

/**
 * Get all outcome benchmarks
 */
export function getAllOutcomeBenchmarks(): OutcomeBenchmark[] {
  return outcomeBenchmarks;
}

/**
 * Get functional improvement measures
 */
export function getFunctionalImprovementMeasures(): QualityMeasure[] {
  return functionalImprovementMeasures;
}

/**
 * Get patient satisfaction measures
 */
export function getPatientSatisfactionMeasures(): QualityMeasure[] {
  return patientSatisfactionMeasures;
}

/**
 * Get discharge disposition measures
 */
export function getDischargeDispositionMeasures(): QualityMeasure[] {
  return dischargeDispositionMeasures;
}

/**
 * Get readmission measures
 */
export function getReadmissionMeasures(): QualityMeasure[] {
  return readmissionMeasures;
}

/**
 * Get safety measures
 */
export function getSafetyMeasures(): QualityMeasure[] {
  return safetyMeasures;
}

/**
 * Get efficiency measures
 */
export function getEfficiencyMeasures(): QualityMeasure[] {
  return efficiencyMeasures;
}
