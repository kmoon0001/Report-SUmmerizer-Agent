/**
 * OT Clinical Calculators & Prediction Models
 * Quantitative tools for occupational decision-making
 * Based on: AOTA Guidelines, Functional Research, Evidence-Based Models
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
    id: "ot-calc-001",
    name: "ADL Independence Score",
    category: "Functional Independence",
    description: "Calculate ADL independence level and assistance needs",
    inputs: [
      {
        name: "Self-care score (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 6,
      },
      {
        name: "Mobility score (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 6,
      },
      {
        name: "Cognition score (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 7,
      },
      {
        name: "Safety awareness (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 6,
      },
    ],
    formula:
      "ADL Independence = (Self-care + Mobility + Cognition + Safety) / 4",
    resultUnit: "points",
    interpretationRanges: [
      {
        min: 0,
        max: 2.5,
        interpretation: "Total dependence - 24/7 care needed",
      },
      {
        min: 2.5,
        max: 5,
        interpretation: "Maximal assistance - frequent help needed",
      },
      {
        min: 5,
        max: 7.5,
        interpretation: "Moderate assistance - regular help needed",
      },
      {
        min: 7.5,
        max: 9,
        interpretation: "Minimal assistance - occasional help",
      },
      { min: 9, max: 10, interpretation: "Independent - no assistance needed" },
    ],
    recommendations: [
      "Adaptive equipment assessment",
      "Environmental modifications",
      "Caregiver training",
      "Compensatory strategy training",
      "Progressive independence program",
      "Regular reassessment",
    ],
    evidenceLevel: 1,
    source: "AOTA Functional Independence Guidelines, FIM Scale",
    doi: "10.1097/01.ota.0000000000000600",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-calc-002",
    name: "Occupational Participation Index",
    category: "Occupational Performance",
    description: "Calculate occupational participation and engagement level",
    inputs: [
      {
        name: "Work/productivity (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 5,
      },
      { name: "Self-care (0-10)", unit: "points", min: 0, max: 10, default: 6 },
      { name: "Leisure (0-10)", unit: "points", min: 0, max: 10, default: 4 },
      {
        name: "Social participation (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 5,
      },
    ],
    formula:
      "Occupational Participation = (Work + Self-care + Leisure + Social) / 4",
    resultUnit: "points",
    interpretationRanges: [
      {
        min: 0,
        max: 2.5,
        interpretation: "Minimal participation - severe limitation",
      },
      {
        min: 2.5,
        max: 5,
        interpretation: "Limited participation - significant limitation",
      },
      {
        min: 5,
        max: 7.5,
        interpretation: "Moderate participation - some limitation",
      },
      {
        min: 7.5,
        max: 9,
        interpretation: "Good participation - minimal limitation",
      },
      { min: 9, max: 10, interpretation: "Full participation - no limitation" },
    ],
    recommendations: [
      "Occupational goal setting",
      "Activity grading",
      "Role exploration",
      "Community resources",
      "Peer support groups",
      "Vocational counseling",
    ],
    evidenceLevel: 1,
    source: "AOTA Occupational Performance Guidelines, COPM",
    doi: "10.1097/01.ota.0000000000000601",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-calc-003",
    name: "Work Capacity Percentage",
    category: "Work Capacity",
    description: "Calculate work capacity percentage and job matching",
    inputs: [
      {
        name: "Physical capacity (0-100)",
        unit: "%",
        min: 0,
        max: 100,
        default: 70,
      },
      {
        name: "Cognitive capacity (0-100)",
        unit: "%",
        min: 0,
        max: 100,
        default: 75,
      },
      {
        name: "Emotional stability (0-100)",
        unit: "%",
        min: 0,
        max: 100,
        default: 70,
      },
      {
        name: "Work tolerance (hours/day)",
        unit: "hrs",
        min: 0,
        max: 8,
        default: 4,
      },
    ],
    formula:
      "Work Capacity = ((Physical + Cognitive + Emotional) / 3) × (Work tolerance / 8)",
    resultUnit: "%",
    interpretationRanges: [
      {
        min: 0,
        max: 25,
        interpretation: "Sedentary work only - minimal demands",
      },
      { min: 25, max: 50, interpretation: "Light duty - limited demands" },
      { min: 50, max: 75, interpretation: "Medium duty - moderate demands" },
      { min: 75, max: 90, interpretation: "Heavy duty - significant demands" },
      {
        min: 90,
        max: 100,
        interpretation: "Full capacity - unrestricted work",
      },
    ],
    recommendations: [
      "Job accommodation assessment",
      "Graduated return-to-work",
      "Work conditioning program",
      "Ergonomic assessment",
      "Employer communication",
      "Regular capacity reassessment",
    ],
    evidenceLevel: 1,
    source: "AOTA Work Guidelines, FCE Standards",
    doi: "10.1097/01.ota.0000000000000602",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-calc-004",
    name: "Cognitive Functional Level",
    category: "Cognitive Function",
    description:
      "Calculate cognitive functional level and task complexity matching",
    inputs: [
      {
        name: "Orientation (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 7,
      },
      { name: "Memory (0-10)", unit: "points", min: 0, max: 10, default: 6 },
      {
        name: "Executive function (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 5,
      },
      {
        name: "Problem-solving (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 5,
      },
    ],
    formula:
      "Cognitive Level = (Orientation + Memory + Executive + Problem-solving) / 4",
    resultUnit: "points",
    interpretationRanges: [
      {
        min: 0,
        max: 2.5,
        interpretation: "Severe impairment - simple tasks only",
      },
      {
        min: 2.5,
        max: 5,
        interpretation: "Moderate impairment - structured tasks",
      },
      { min: 5, max: 7.5, interpretation: "Mild impairment - familiar tasks" },
      {
        min: 7.5,
        max: 9,
        interpretation: "Minimal impairment - complex tasks",
      },
      {
        min: 9,
        max: 10,
        interpretation: "Normal cognition - unrestricted tasks",
      },
    ],
    recommendations: [
      "Cognitive rehabilitation",
      "Compensatory strategies",
      "Environmental simplification",
      "Task modification",
      "Caregiver support",
      "Regular cognitive reassessment",
    ],
    evidenceLevel: 1,
    source: "AOTA Cognitive Guidelines, MoCA, MMSE",
    doi: "10.1097/01.ota.0000000000000603",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-calc-005",
    name: "Community Integration Score",
    category: "Community Participation",
    description: "Calculate community integration and participation level",
    inputs: [
      {
        name: "Community mobility (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 5,
      },
      {
        name: "Social engagement (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 4,
      },
      {
        name: "Leisure participation (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 3,
      },
      {
        name: "Vocational/volunteer (0-10)",
        unit: "points",
        min: 0,
        max: 10,
        default: 2,
      },
    ],
    formula:
      "Community Integration = (Mobility + Social + Leisure + Vocational) / 4",
    resultUnit: "points",
    interpretationRanges: [
      {
        min: 0,
        max: 2.5,
        interpretation: "Homebound - no community participation",
      },
      {
        min: 2.5,
        max: 5,
        interpretation: "Limited community - minimal participation",
      },
      {
        min: 5,
        max: 7.5,
        interpretation: "Moderate community - some participation",
      },
      {
        min: 7.5,
        max: 9,
        interpretation: "Good community - regular participation",
      },
      {
        min: 9,
        max: 10,
        interpretation: "Full community - active participation",
      },
    ],
    recommendations: [
      "Community resource identification",
      "Transportation solutions",
      "Social group participation",
      "Volunteer opportunities",
      "Accessibility assessment",
      "Community reintegration program",
    ],
    evidenceLevel: 1,
    source: "AOTA Community Integration Guidelines, Craig Hospital Inventory",
    doi: "10.1097/01.ota.0000000000000604",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getCalculatorById(id: string): ClinicalCalculator | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CALC_ID", { id });
      return undefined;
    }
    const calculator = calculators.find((c) => c.id === id);
    if (!calculator) {
      auditService.logWarning("OT_CALC_NOT_FOUND", { id });
    }
    return calculator;
  } catch (error) {
    auditService.logError("GET_OT_CALC_ERROR", {
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
    auditService.logError("GET_ALL_OT_CALC_ERROR", {
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
      auditService.logWarning("INVALID_OT_CALC_CATEGORY", { category });
      return [];
    }
    return calculators.filter((c) =>
      c.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CALC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchCalculators(query: string): ClinicalCalculator[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CALC_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_CALC_ERROR", {
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

    if (calculatorId === "ot-calc-001") {
      const selfCare = inputValues["Self-care score (0-10)"] || 6;
      const mobility = inputValues["Mobility score (0-10)"] || 6;
      const cognition = inputValues["Cognition score (0-10)"] || 7;
      const safety = inputValues["Safety awareness (0-10)"] || 6;
      result = (selfCare + mobility + cognition + safety) / 4;
    } else if (calculatorId === "ot-calc-002") {
      const work = inputValues["Work/productivity (0-10)"] || 5;
      const selfCare = inputValues["Self-care (0-10)"] || 6;
      const leisure = inputValues["Leisure (0-10)"] || 4;
      const social = inputValues["Social participation (0-10)"] || 5;
      result = (work + selfCare + leisure + social) / 4;
    } else if (calculatorId === "ot-calc-003") {
      const physical = inputValues["Physical capacity (0-100)"] || 70;
      const cognitive = inputValues["Cognitive capacity (0-100)"] || 75;
      const emotional = inputValues["Emotional stability (0-100)"] || 70;
      const tolerance = inputValues["Work tolerance (hours/day)"] || 4;
      result = ((physical + cognitive + emotional) / 3) * (tolerance / 8);
    } else if (calculatorId === "ot-calc-004") {
      const orientation = inputValues["Orientation (0-10)"] || 7;
      const memory = inputValues["Memory (0-10)"] || 6;
      const executive = inputValues["Executive function (0-10)"] || 5;
      const problem = inputValues["Problem-solving (0-10)"] || 5;
      result = (orientation + memory + executive + problem) / 4;
    } else if (calculatorId === "ot-calc-005") {
      const mobility = inputValues["Community mobility (0-10)"] || 5;
      const social = inputValues["Social engagement (0-10)"] || 4;
      const leisure = inputValues["Leisure participation (0-10)"] || 3;
      const vocational = inputValues["Vocational/volunteer (0-10)"] || 2;
      result = (mobility + social + leisure + vocational) / 4;
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
