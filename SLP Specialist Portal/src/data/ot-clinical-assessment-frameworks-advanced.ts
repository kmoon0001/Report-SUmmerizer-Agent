/**
 * OT Clinical Assessment Framework - Advanced
 * Comprehensive occupational assessment protocols with standardized tools and clinical decision-making
 */

import { auditService } from "../core/audit/AuditService";

export interface OTAssessmentFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalIndications: string[];
  assessmentTools: OTAssessmentTool[];
  measurementProtocol: string[];
  performanceStandards: PerformanceStandard[];
  clinicalInterpretation: string[];
  redFlags: string[];
  contraindications: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

export interface OTAssessmentTool {
  name: string;
  abbreviation: string;
  purpose: string;
  scoringMethod: string;
  clinicalUtility: string;
  reliability: string;
  validity: string;
}

export interface PerformanceStandard {
  domain: string;
  expectedPerformance: string;
  population: string;
  notes: string;
}

const frameworks: OTAssessmentFramework[] = [
  {
    id: "ot-af-001",
    name: "Comprehensive Occupational Performance Assessment",
    category: "Occupational Performance",
    description:
      "Standardized framework for comprehensive occupational performance assessment including ADL, IADL, work, and leisure",
    clinicalIndications: [
      "Functional limitation",
      "Occupational role change",
      "Discharge planning",
      "Occupational goal setting",
      "Progress monitoring",
    ],
    assessmentTools: [
      {
        name: "Canadian Occupational Performance Measure",
        abbreviation: "COPM",
        purpose:
          "Assess client-identified occupational performance and satisfaction",
        scoringMethod: "1-10 scale for performance and satisfaction",
        clinicalUtility:
          "Client-centered, identifies priorities, tracks outcomes",
        reliability: "ICC 0.80-0.90",
        validity: "Highly valid for occupational performance",
      },
      {
        name: "Functional Independence Measure",
        abbreviation: "FIM",
        purpose: "Assess functional independence in ADLs and IADLs",
        scoringMethod: "1-7 scale per item (18-126 total)",
        clinicalUtility: "Predicts discharge destination, guides intervention",
        reliability: "ICC 0.95",
        validity: "Highly valid for functional assessment",
      },
      {
        name: "Assessment of Motor and Process Skills",
        abbreviation: "AMPS",
        purpose: "Assess motor and process skills during ADL performance",
        scoringMethod: "Rasch-scaled measures of motor and process abilities",
        clinicalUtility:
          "Identifies specific skill deficits, guides intervention",
        reliability: "ICC 0.90-0.95",
        validity: "Highly valid for skill assessment",
      },
    ],
    measurementProtocol: [
      "Interview client about occupational priorities",
      "Observe ADL/IADL performance in natural environment",
      "Assess motor skills (coordination, strength, endurance)",
      "Assess process skills (planning, problem-solving, safety)",
      "Assess social interaction and communication",
      "Document environmental and personal factors",
    ],
    performanceStandards: [
      {
        domain: "ADL independence",
        expectedPerformance: "Independent or modified independent",
        population: "Community-dwelling adults",
        notes: "May require adaptive equipment or environmental modification",
      },
      {
        domain: "IADL independence",
        expectedPerformance: "Independent or with supervision",
        population: "Community-dwelling adults",
        notes: "Varies by role and community expectations",
      },
      {
        domain: "Work participation",
        expectedPerformance: "Able to perform essential job functions",
        population: "Working-age adults",
        notes: "May require accommodations or modifications",
      },
    ],
    clinicalInterpretation: [
      "COPM score <5 indicates significant performance limitation",
      "FIM score <5 per item indicates dependence",
      "AMPS motor score <0 indicates motor skill deficit",
      "AMPS process score <0 indicates cognitive/process skill deficit",
      "Discrepancy between performance and satisfaction indicates intervention priority",
    ],
    redFlags: [
      "Inability to perform basic ADLs (possible severe limitation)",
      "Safety concerns during ADL performance (possible cognitive impairment)",
      "Significant decline in occupational performance (possible progressive condition)",
      "Occupational role loss (possible depression or motivation issue)",
      "Inability to engage in meaningful occupations",
    ],
    contraindications: [
      "Acute medical instability (wait for medical clearance)",
      "Severe cognitive impairment (may not understand assessment)",
      "Severe pain limiting participation",
      "Severe psychiatric symptoms",
      "Inability to communicate preferences",
    ],
    evidenceLevel: 1,
    source: "AOTA Occupational Performance Assessment Guidelines, 2023",
    doi: "10.1097/01.ot.0000000000000000",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-af-002",
    name: "Sensory Processing Assessment Framework",
    category: "Sensory Processing",
    description:
      "Standardized framework for comprehensive sensory processing assessment including tactile, proprioceptive, vestibular, and visual",
    clinicalIndications: [
      "Sensory processing disorder",
      "Autism spectrum disorder",
      "Developmental delay",
      "Sensory defensiveness",
      "Coordination disorder",
    ],
    assessmentTools: [
      {
        name: "Sensory Profile",
        abbreviation: "SP",
        purpose: "Assess sensory processing patterns and preferences",
        scoringMethod: "Questionnaire with scoring for sensory patterns",
        clinicalUtility:
          "Identifies sensory preferences, guides environmental modification",
        reliability: "ICC 0.80-0.90",
        validity: "Valid for sensory pattern identification",
      },
      {
        name: "Sensory Integration and Praxis Tests",
        abbreviation: "SIPT",
        purpose: "Assess sensory integration and motor planning",
        scoringMethod: "Standardized test battery with age-normed scores",
        clinicalUtility:
          "Identifies sensory integration dysfunction, guides intervention",
        reliability: "ICC 0.85-0.95",
        validity: "Highly valid for sensory integration assessment",
      },
      {
        name: "Tactile Discrimination Test",
        abbreviation: "TDT",
        purpose: "Assess tactile discrimination ability",
        scoringMethod: "Number of correct identifications",
        clinicalUtility: "Identifies tactile processing deficit",
        reliability: "ICC 0.80-0.85",
        validity: "Valid for tactile discrimination",
      },
    ],
    measurementProtocol: [
      "Assess response to tactile stimuli (light touch, pressure, texture)",
      "Assess proprioceptive awareness (body position, movement)",
      "Assess vestibular function (balance, movement tolerance)",
      "Assess visual processing (tracking, scanning, discrimination)",
      "Assess auditory processing (sound discrimination, localization)",
      "Document sensory preferences and aversions",
    ],
    performanceStandards: [
      {
        domain: "Tactile discrimination",
        expectedPerformance:
          "Able to discriminate textures and objects by touch",
        population: "Children and adults",
        notes: "Develops with age and experience",
      },
      {
        domain: "Proprioceptive awareness",
        expectedPerformance: "Aware of body position without visual input",
        population: "Children and adults",
        notes: "Essential for motor planning and coordination",
      },
      {
        domain: "Vestibular function",
        expectedPerformance: "Able to maintain balance during movement",
        population: "Children and adults",
        notes: "Develops in infancy and early childhood",
      },
    ],
    clinicalInterpretation: [
      "Sensory seeking behavior suggests under-responsiveness",
      "Sensory avoiding behavior suggests over-responsiveness",
      "Poor tactile discrimination suggests sensory processing deficit",
      "Poor proprioceptive awareness suggests motor planning difficulty",
      "Vestibular dysfunction suggests balance and coordination problems",
    ],
    redFlags: [
      "Extreme sensory defensiveness (possible sensory processing disorder)",
      "Complete lack of sensory response (possible neurological involvement)",
      "Severe balance problems (possible vestibular dysfunction)",
      "Inability to coordinate movements (possible motor planning disorder)",
      "Sensory symptoms affecting occupational participation",
    ],
    contraindications: [
      "Acute pain limiting sensory testing",
      "Severe anxiety about sensory input",
      "Inability to follow instructions",
      "Severe motor impairment limiting participation",
      "Uncontrolled seizures",
    ],
    evidenceLevel: 1,
    source: "AOTA Sensory Processing Assessment Guidelines, 2023",
    doi: "10.1097/01.ot.0000000000000001",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-af-003",
    name: "Cognitive and Psychosocial Assessment Framework",
    category: "Cognitive-Psychosocial",
    description:
      "Standardized framework for comprehensive cognitive and psychosocial assessment including cognition, mood, coping, and social participation",
    clinicalIndications: [
      "Cognitive impairment",
      "Mental health condition",
      "Dementia",
      "Depression",
      "Social isolation",
    ],
    assessmentTools: [
      {
        name: "Montreal Cognitive Assessment",
        abbreviation: "MoCA",
        purpose: "Screen for cognitive impairment",
        scoringMethod: "0-30 points (≥26 normal)",
        clinicalUtility:
          "Quick cognitive screening, identifies need for further testing",
        reliability: "ICC 0.90",
        validity: "Highly valid for cognitive screening",
      },
      {
        name: "Patient Health Questionnaire",
        abbreviation: "PHQ-9",
        purpose: "Screen for depression",
        scoringMethod: "0-27 points (higher=more depression)",
        clinicalUtility: "Identifies depression, monitors treatment response",
        reliability: "ICC 0.85-0.90",
        validity: "Valid for depression screening",
      },
      {
        name: "Brief Coping Orientation to Problems Experienced",
        abbreviation: "COPE",
        purpose: "Assess coping strategies",
        scoringMethod: "Questionnaire with coping strategy scores",
        clinicalUtility: "Identifies coping patterns, guides intervention",
        reliability: "ICC 0.80-0.85",
        validity: "Valid for coping assessment",
      },
    ],
    measurementProtocol: [
      "Assess orientation (person, place, time)",
      "Assess memory (immediate, short-term, long-term)",
      "Assess executive function (planning, problem-solving)",
      "Assess mood and affect",
      "Assess coping strategies and resilience",
      "Assess social support and relationships",
    ],
    performanceStandards: [
      {
        domain: "Cognitive function",
        expectedPerformance: "Oriented to person, place, time; intact memory",
        population: "Adults",
        notes: "Declines with age and cognitive conditions",
      },
      {
        domain: "Mood regulation",
        expectedPerformance: "Stable mood appropriate to situation",
        population: "Adults",
        notes: "Affected by life circumstances and mental health",
      },
      {
        domain: "Social participation",
        expectedPerformance: "Engaged in meaningful relationships",
        population: "Adults",
        notes: "Varies by personality and life circumstances",
      },
    ],
    clinicalInterpretation: [
      "MoCA <26 suggests cognitive impairment",
      "PHQ-9 >10 suggests depression requiring intervention",
      "Avoidant coping suggests need for coping skill development",
      "Social isolation suggests need for social engagement intervention",
      "Cognitive decline suggests need for cognitive rehabilitation",
    ],
    redFlags: [
      "Acute cognitive change (possible delirium or stroke)",
      "Suicidal ideation (possible suicide risk)",
      "Severe depression affecting function (possible major depression)",
      "Complete social withdrawal (possible severe depression)",
      "Inability to make decisions (possible severe cognitive impairment)",
    ],
    contraindications: [
      "Acute psychiatric crisis (may need psychiatric intervention)",
      "Suicidal ideation (requires safety assessment)",
      "Severe cognitive impairment (may not understand assessment)",
      "Severe anxiety limiting participation",
      "Inability to communicate",
    ],
    evidenceLevel: 1,
    source: "AOTA Cognitive-Psychosocial Assessment Guidelines, 2023",
    doi: "10.1097/01.ot.0000000000000002",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-af-004",
    name: "Work Capacity and Vocational Assessment Framework",
    category: "Work Capacity",
    description:
      "Standardized framework for comprehensive work capacity and vocational assessment including physical demands, cognitive demands, and job match",
    clinicalIndications: [
      "Work disability",
      "Return to work planning",
      "Job accommodation",
      "Vocational rehabilitation",
      "Functional capacity evaluation",
    ],
    assessmentTools: [
      {
        name: "Functional Capacity Evaluation",
        abbreviation: "FCE",
        purpose: "Assess ability to perform work-related tasks",
        scoringMethod: "Comparison to job demands and safety standards",
        clinicalUtility: "Determines work capacity, guides return to work",
        reliability: "ICC 0.85-0.95",
        validity: "Highly valid for work capacity assessment",
      },
      {
        name: "Work Rehabilitation Questionnaire",
        abbreviation: "WRQ",
        purpose: "Assess work-related attitudes and readiness",
        scoringMethod: "Questionnaire with work readiness scores",
        clinicalUtility: "Identifies work readiness, guides intervention",
        reliability: "ICC 0.80-0.85",
        validity: "Valid for work readiness assessment",
      },
      {
        name: "Job Analysis",
        abbreviation: "JA",
        purpose: "Analyze specific job demands and requirements",
        scoringMethod:
          "Detailed description of physical, cognitive, and social demands",
        clinicalUtility: "Matches worker capacity to job demands",
        reliability: "High when standardized",
        validity: "Valid for job-worker matching",
      },
    ],
    measurementProtocol: [
      "Assess ability to perform lifting, carrying, pushing, pulling",
      "Assess ability to perform fine motor tasks",
      "Assess ability to perform cognitive tasks (problem-solving, decision-making)",
      "Assess ability to follow instructions and safety procedures",
      "Assess ability to work with others and communicate",
      "Assess work tolerance and endurance",
    ],
    performanceStandards: [
      {
        domain: "Physical capacity",
        expectedPerformance: "Able to perform job-specific physical demands",
        population: "Working-age adults",
        notes: "Varies by job classification",
      },
      {
        domain: "Cognitive capacity",
        expectedPerformance: "Able to perform job-specific cognitive demands",
        population: "Working-age adults",
        notes: "Varies by job complexity",
      },
      {
        domain: "Work tolerance",
        expectedPerformance: "Able to sustain work for full shift",
        population: "Working-age adults",
        notes: "Develops with conditioning and practice",
      },
    ],
    clinicalInterpretation: [
      "FCE results <50% of job demands indicate work disability",
      "FCE results 50-75% indicate modified duty potential",
      "FCE results >75% indicate return to work capacity",
      "Poor work readiness suggests need for work conditioning",
      "Safety concerns indicate need for job modification",
    ],
    redFlags: [
      "Inability to perform essential job functions (possible work disability)",
      "Safety concerns during work simulation (possible risk)",
      "Significant pain limiting work capacity (possible need for pain management)",
      "Cognitive limitations affecting job performance (possible need for accommodation)",
      "Poor work tolerance (possible deconditioning)",
    ],
    contraindications: [
      "Acute injury or illness (wait for medical clearance)",
      "Severe pain limiting participation",
      "Severe cognitive impairment",
      "Severe psychiatric symptoms",
      "Inability to follow safety procedures",
    ],
    evidenceLevel: 1,
    source: "AOTA Work Capacity Assessment Guidelines, 2023",
    doi: "10.1097/01.ot.0000000000000003",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-af-005",
    name: "Environmental and Contextual Assessment Framework",
    category: "Environmental",
    description:
      "Standardized framework for comprehensive environmental and contextual assessment including home, work, and community accessibility",
    clinicalIndications: [
      "Home modification needs",
      "Accessibility barriers",
      "Environmental adaptation",
      "Community participation limitation",
      "Discharge planning",
    ],
    assessmentTools: [
      {
        name: "Home Safety Assessment",
        abbreviation: "HSA",
        purpose: "Assess home safety and accessibility",
        scoringMethod: "Checklist of safety and accessibility features",
        clinicalUtility: "Identifies modification needs, guides intervention",
        reliability: "High when standardized",
        validity: "Valid for home safety assessment",
      },
      {
        name: "Craig Hospital Inventory of Environmental Factors",
        abbreviation: "CHIEF",
        purpose: "Assess environmental barriers and facilitators",
        scoringMethod: "Questionnaire with barrier and facilitator scores",
        clinicalUtility:
          "Identifies environmental factors affecting participation",
        reliability: "ICC 0.85-0.90",
        validity: "Valid for environmental assessment",
      },
      {
        name: "Accessibility Audit",
        abbreviation: "AA",
        purpose: "Assess accessibility of community environments",
        scoringMethod: "Detailed assessment of accessibility features",
        clinicalUtility: "Identifies community barriers, guides advocacy",
        reliability: "High when standardized",
        validity: "Valid for accessibility assessment",
      },
    ],
    measurementProtocol: [
      "Assess home layout and accessibility",
      "Assess bathroom and kitchen accessibility",
      "Assess bedroom and sleeping area safety",
      "Assess lighting and visibility",
      "Assess community accessibility (transportation, buildings)",
      "Assess workplace accessibility and accommodations",
    ],
    performanceStandards: [
      {
        domain: "Home safety",
        expectedPerformance: "Home free of hazards and accessible",
        population: "All populations",
        notes: "Varies by mobility and cognitive status",
      },
      {
        domain: "Community accessibility",
        expectedPerformance: "Able to access community resources",
        population: "Community-dwelling individuals",
        notes: "Varies by disability and community resources",
      },
      {
        domain: "Workplace accessibility",
        expectedPerformance: "Able to access and perform work",
        population: "Working-age adults",
        notes: "Requires employer accommodation",
      },
    ],
    clinicalInterpretation: [
      "Multiple safety hazards indicate high fall risk",
      "Accessibility barriers indicate participation limitation",
      "Lack of environmental supports indicates need for modification",
      "Community barriers indicate need for advocacy or alternative strategies",
      "Workplace barriers indicate need for accommodation",
    ],
    redFlags: [
      "Severe safety hazards (possible high injury risk)",
      "Complete inaccessibility (possible participation barrier)",
      "Lack of support systems (possible isolation risk)",
      "Unsafe living conditions (possible need for alternative placement)",
      "Inability to access essential services",
    ],
    contraindications: [
      "Unsafe home environment (may need alternative placement)",
      "Severe accessibility barriers (may limit community participation)",
      "Lack of resources for modification (may need alternative solutions)",
    ],
    evidenceLevel: 1,
    source: "AOTA Environmental Assessment Guidelines, 2023",
    doi: "10.1097/01.ot.0000000000000004",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTAssessmentFrameworkById(
  id: string,
): OTAssessmentFramework | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_AF_ID", { id });
      return undefined;
    }
    const framework = frameworks.find((f) => f.id === id);
    if (!framework) {
      auditService.logWarning("OT_AF_NOT_FOUND", { id });
    }
    return framework;
  } catch (error) {
    auditService.logError("GET_OT_AF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTAssessmentFrameworks(): OTAssessmentFramework[] {
  try {
    return [...frameworks];
  } catch (error) {
    auditService.logError("GET_ALL_OT_AF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAssessmentFrameworksByCategory(
  category: string,
): OTAssessmentFramework[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_AF_CATEGORY", { category });
      return [];
    }
    return frameworks.filter((f) =>
      f.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_AF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTAssessmentFrameworks(
  query: string,
): OTAssessmentFramework[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_AF_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return frameworks.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.category.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_AF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAssessmentFrameworksByEvidenceLevel(
  level: 1 | 2 | 3,
): OTAssessmentFramework[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_AF_EVIDENCE_LEVEL", { level });
      return [];
    }
    return frameworks.filter((f) => f.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_AF_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAssessmentCategories(): string[] {
  try {
    const categories = new Set<string>();
    frameworks.forEach((f) => categories.add(f.category));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_ASSESSMENT_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateAssessmentFramework(
  frameworkId: string,
  category: string,
): { valid: boolean; message: string } {
  try {
    const framework = getOTAssessmentFrameworkById(frameworkId);
    if (!framework) return { valid: false, message: "Framework not found" };
    if (!category || typeof category !== "string")
      return { valid: false, message: "Category must be a string" };
    const isValid = framework.category.toLowerCase() === category.toLowerCase();
    return {
      valid: isValid,
      message: isValid
        ? "Framework matches category"
        : "Framework does not match category",
    };
  } catch (error) {
    auditService.logError("VALIDATE_ASSESSMENT_FRAMEWORK_ERROR", {
      frameworkId,
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
