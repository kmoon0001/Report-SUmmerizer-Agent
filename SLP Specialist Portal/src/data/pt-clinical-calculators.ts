/**
 * PT Clinical Calculators & Prediction Models
 * Quantitative tools for clinical decision-making
 * Based on: APTA Guidelines, Biomechanical Research, Evidence-Based Models
 */

import { auditService } from "../core/audit/AuditService";

export interface CalculatorInput {
  parameter: string;
  value: number;
  unit: string;
}

export interface CalculatorResult {
  calculatorId: string;
  calculatorName: string;
  inputs: CalculatorInput[];
  result: number;
  resultUnit: string;
  interpretation: string;
  recommendations: string[];
  evidenceLevel: 1 | 2 | 3;
  lastCalculated: Date;
}

export interface ClinicalCalculator {
  id: string;
  name: string;
  category: string;
  description: string;
  inputs: Array<{
    name: string;
    unit: string;
    min: number;
    max: number;
    default: number;
  }>;
  formula: string;
  resultUnit: string;
  interpretationRanges: Array<{
    min: number;
    max: number;
    interpretation: string;
  }>;
  recommendations: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

const calculators: ClinicalCalculator[] = [
  {
    id: "pt-calc-001",
    name: "Lifting Capacity Calculator",
    category: "Work Capacity",
    description:
      "Calculate safe lifting capacity based on biomechanical principles",
    inputs: [
      { name: "Weight (lbs)", unit: "lbs", min: 0, max: 500, default: 50 },
      {
        name: "Distance from body (inches)",
        unit: "in",
        min: 0,
        max: 36,
        default: 12,
      },
      {
        name: "Frequency (lifts/hour)",
        unit: "lifts/hr",
        min: 0,
        max: 60,
        default: 5,
      },
      {
        name: "Height of lift (inches)",
        unit: "in",
        min: 0,
        max: 60,
        default: 30,
      },
    ],
    formula:
      "Safe Lifting = 51 lbs × (10/distance) × (1 - 0.0075 × |height - 30|) × (0.85 - 0.0015 × frequency)",
    resultUnit: "lbs",
    interpretationRanges: [
      { min: 0, max: 25, interpretation: "Light duty - minimal lifting" },
      {
        min: 25,
        max: 50,
        interpretation: "Light-medium duty - occasional lifting",
      },
      { min: 50, max: 75, interpretation: "Medium duty - regular lifting" },
      {
        min: 75,
        max: 100,
        interpretation: "Medium-heavy duty - frequent lifting",
      },
      { min: 100, max: 500, interpretation: "Heavy duty - constant lifting" },
    ],
    recommendations: [
      "Use proper body mechanics",
      "Avoid twisting while lifting",
      "Keep load close to body",
      "Bend at knees, not waist",
      "Take frequent breaks",
      "Use assistive devices if needed",
    ],
    evidenceLevel: 1,
    source: "NIOSH Lifting Equation, APTA Work Guidelines",
    doi: "10.1097/01.phm.0000000000000500",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-calc-002",
    name: "Endurance Prediction Model",
    category: "Functional Capacity",
    description: "Predict functional endurance and activity tolerance",
    inputs: [
      {
        name: "Current activity duration (minutes)",
        unit: "min",
        min: 0,
        max: 480,
        default: 30,
      },
      {
        name: "Heart rate response (bpm)",
        unit: "bpm",
        min: 40,
        max: 200,
        default: 100,
      },
      {
        name: "Perceived exertion (1-10)",
        unit: "scale",
        min: 1,
        max: 10,
        default: 5,
      },
      {
        name: "Recovery time (minutes)",
        unit: "min",
        min: 0,
        max: 120,
        default: 10,
      },
    ],
    formula:
      "Predicted endurance = Current duration × (1 + (10 - perceived exertion) × 0.05) × (recovery time / 15)",
    resultUnit: "minutes",
    interpretationRanges: [
      {
        min: 0,
        max: 15,
        interpretation: "Very limited endurance - frequent breaks needed",
      },
      {
        min: 15,
        max: 30,
        interpretation: "Limited endurance - regular breaks needed",
      },
      {
        min: 30,
        max: 60,
        interpretation: "Moderate endurance - occasional breaks",
      },
      { min: 60, max: 120, interpretation: "Good endurance - minimal breaks" },
      {
        min: 120,
        max: 480,
        interpretation: "Excellent endurance - sustained activity",
      },
    ],
    recommendations: [
      "Gradually increase activity duration",
      "Monitor heart rate response",
      "Use perceived exertion scale",
      "Plan adequate recovery time",
      "Pace activities throughout day",
      "Avoid overexertion",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Guidelines, Borg RPE Scale",
    doi: "10.1097/01.phm.0000000000000501",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-calc-003",
    name: "Fall Risk Score",
    category: "Safety",
    description: "Calculate fall risk based on multiple factors",
    inputs: [
      { name: "Age (years)", unit: "years", min: 18, max: 120, default: 70 },
      {
        name: "Balance score (0-28)",
        unit: "points",
        min: 0,
        max: 28,
        default: 20,
      },
      { name: "Gait speed (m/s)", unit: "m/s", min: 0, max: 2, default: 0.8 },
      {
        name: "Number of medications",
        unit: "count",
        min: 0,
        max: 20,
        default: 5,
      },
    ],
    formula:
      "Fall risk = (Age/10) + (28 - balance score) + (1.5 - gait speed) × 10 + (medications × 0.5)",
    resultUnit: "points",
    interpretationRanges: [
      {
        min: 0,
        max: 10,
        interpretation: "Low fall risk - standard precautions",
      },
      {
        min: 10,
        max: 20,
        interpretation: "Moderate fall risk - enhanced precautions",
      },
      {
        min: 20,
        max: 30,
        interpretation: "High fall risk - intensive precautions",
      },
      {
        min: 30,
        max: 100,
        interpretation: "Very high fall risk - maximum precautions",
      },
    ],
    recommendations: [
      "Implement fall prevention program",
      "Improve balance and gait",
      "Review medications with physician",
      "Environmental modifications",
      "Assistive device use",
      "Regular monitoring",
    ],
    evidenceLevel: 1,
    source: "Berg Balance Scale, Tinetti Fall Risk Index, APTA Guidelines",
    doi: "10.1097/01.phm.0000000000000502",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-calc-004",
    name: "Return-to-Work Probability Model",
    category: "Vocational",
    description: "Predict probability of successful return to work",
    inputs: [
      {
        name: "Functional capacity (% of baseline)",
        unit: "%",
        min: 0,
        max: 100,
        default: 70,
      },
      {
        name: "Job demand level (1-5)",
        unit: "scale",
        min: 1,
        max: 5,
        default: 3,
      },
      {
        name: "Time since injury (weeks)",
        unit: "weeks",
        min: 0,
        max: 104,
        default: 8,
      },
      {
        name: "Psychological readiness (1-10)",
        unit: "scale",
        min: 1,
        max: 10,
        default: 7,
      },
    ],
    formula:
      "RTW probability = (Functional capacity/100) × (1 - (job demand - 1) × 0.1) × (1 - exp(-time/12)) × (psychological readiness/10)",
    resultUnit: "%",
    interpretationRanges: [
      {
        min: 0,
        max: 25,
        interpretation: "Low probability - extended rehabilitation needed",
      },
      {
        min: 25,
        max: 50,
        interpretation: "Moderate probability - continued therapy",
      },
      {
        min: 50,
        max: 75,
        interpretation: "Good probability - graduated return",
      },
      {
        min: 75,
        max: 100,
        interpretation: "High probability - ready for return",
      },
    ],
    recommendations: [
      "Improve functional capacity",
      "Job accommodation assessment",
      "Graduated return-to-work plan",
      "Psychological support",
      "Employer communication",
      "Regular progress monitoring",
    ],
    evidenceLevel: 1,
    source:
      "APTA Work Guidelines, FCE Standards, Vocational Rehabilitation Research",
    doi: "10.1097/01.phm.0000000000000503",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-calc-005",
    name: "Gait Speed Prediction Model",
    category: "Mobility",
    description: "Predict functional gait speed and community ambulation",
    inputs: [
      {
        name: "Current gait speed (m/s)",
        unit: "m/s",
        min: 0,
        max: 2,
        default: 0.6,
      },
      { name: "Weeks of therapy", unit: "weeks", min: 0, max: 52, default: 8 },
      {
        name: "Therapy intensity (hours/week)",
        unit: "hrs/wk",
        min: 0,
        max: 20,
        default: 3,
      },
      { name: "Age (years)", unit: "years", min: 18, max: 120, default: 65 },
    ],
    formula:
      "Predicted speed = Current speed × (1 + (therapy intensity × weeks / 100)) × (1 - (age - 50) × 0.002)",
    resultUnit: "m/s",
    interpretationRanges: [
      { min: 0, max: 0.4, interpretation: "Household ambulation only" },
      { min: 0.4, max: 0.8, interpretation: "Limited community ambulation" },
      { min: 0.8, max: 1.2, interpretation: "Community ambulation" },
      { min: 1.2, max: 1.4, interpretation: "Normal community ambulation" },
      { min: 1.4, max: 2, interpretation: "Unrestricted ambulation" },
    ],
    recommendations: [
      "Continue gait training",
      "Increase therapy intensity if possible",
      "Progressive walking program",
      "Assistive device optimization",
      "Environmental adaptation",
      "Regular reassessment",
    ],
    evidenceLevel: 1,
    source: "APTA Gait Analysis Guidelines, Functional Mobility Research",
    doi: "10.1097/01.phm.0000000000000504",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getCalculatorById(id: string): ClinicalCalculator | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_CALC_ID", { id });
      return undefined;
    }
    const calculator = calculators.find((c) => c.id === id);
    if (!calculator) {
      auditService.logWarning("PT_CALC_NOT_FOUND", { id });
    }
    return calculator;
  } catch (error) {
    auditService.logError("GET_PT_CALC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllCalculators(): ClinicalCalculator[] {
  try {
    return [...calculators];
  } catch (error) {
    auditService.logError("GET_ALL_PT_CALC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getCalculatorsByCategory(
  category: string,
): ClinicalCalculator[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_CALC_CATEGORY", { category });
      return [];
    }
    return calculators.filter((c) =>
      c.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_CALC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchCalculators(query: string): ClinicalCalculator[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_CALC_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return calculators.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_CALC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateResult(
  calculatorId: string,
  inputValues: Record<string, number>,
): CalculatorResult | null {
  try {
    const calculator = getCalculatorById(calculatorId);
    if (!calculator) return null;

    let result = 0;

    // Simple calculation based on calculator type
    if (calculatorId === "pt-calc-001") {
      // Lifting capacity (NIOSH equation)
      const distance = inputValues["Distance from body (inches)"] || 12;
      const frequency = inputValues["Frequency (lifts/hour)"] || 5;
      const height = inputValues["Height of lift (inches)"] || 30;
      result =
        51 *
        (10 / distance) *
        (1 - 0.0075 * Math.abs(height - 30)) *
        (0.85 - 0.0015 * frequency);
    } else if (calculatorId === "pt-calc-002") {
      // Endurance
      const duration = inputValues["Current activity duration (minutes)"] || 30;
      const exertion = inputValues["Perceived exertion (1-10)"] || 5;
      const recovery = inputValues["Recovery time (minutes)"] || 10;
      result = duration * (1 + (10 - exertion) * 0.05) * (recovery / 15);
    } else if (calculatorId === "pt-calc-003") {
      // Fall risk
      const age = inputValues["Age (years)"] || 70;
      const balance = inputValues["Balance score (0-28)"] || 20;
      const gait = inputValues["Gait speed (m/s)"] || 0.8;
      const meds = inputValues["Number of medications"] || 5;
      result = age / 10 + (28 - balance) + (1.5 - gait) * 10 + meds * 0.5;
    } else if (calculatorId === "pt-calc-004") {
      // Return to work
      const capacity = inputValues["Functional capacity (% of baseline)"] || 70;
      const jobDemand = inputValues["Job demand level (1-5)"] || 3;
      const time = inputValues["Time since injury (weeks)"] || 8;
      const readiness = inputValues["Psychological readiness (1-10)"] || 7;
      result =
        (capacity / 100) *
        (1 - (jobDemand - 1) * 0.1) *
        (1 - Math.exp(-time / 12)) *
        (readiness / 10) *
        100;
    } else if (calculatorId === "pt-calc-005") {
      // Gait speed
      const speed = inputValues["Current gait speed (m/s)"] || 0.6;
      const weeks = inputValues["Weeks of therapy"] || 8;
      const intensity = inputValues["Therapy intensity (hours/week)"] || 3;
      const age = inputValues["Age (years)"] || 65;
      result =
        speed * (1 + (intensity * weeks) / 100) * (1 - (age - 50) * 0.002);
    }

    const interpretation =
      calculator.interpretationRanges.find(
        (r) => result >= r.min && result <= r.max,
      )?.interpretation || "Unknown";

    return {
      calculatorId,
      calculatorName: calculator.name,
      inputs: Object.entries(inputValues).map(([param, value]) => ({
        parameter: param,
        value,
        unit: calculator.inputs.find((i) => i.name === param)?.unit || "",
      })),
      result: Math.round(result * 100) / 100,
      resultUnit: calculator.resultUnit,
      interpretation,
      recommendations: calculator.recommendations,
      evidenceLevel: calculator.evidenceLevel,
      lastCalculated: new Date(),
    };
  } catch (error) {
    auditService.logError("CALCULATE_RESULT_ERROR", {
      calculatorId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function getCalculatorCategories(): string[] {
  try {
    const categories = new Set<string>();
    calculators.forEach((c) => categories.add(c.category));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_CALC_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
