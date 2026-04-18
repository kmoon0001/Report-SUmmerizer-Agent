/**
 * OT Advanced Assessment Protocols
 * Complex assessment frameworks for multi-system occupational evaluation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTAssessmentProtocol {
  id: string;
  name: string;
  category: string;
  description: string;
  assessmentComponents: string[];
  clinicalApplications: string[];
  scoringCriteria: string[];
  interpretationGuidelines: string[];
  evidenceBase: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const protocols: OTAssessmentProtocol[] = [
  {
    id: "ot-ap-001",
    name: "Comprehensive Cognitive-Perceptual Assessment Protocol",
    category: "Cognitive-Perceptual Assessment",
    description:
      "Multi-component assessment for cognitive and perceptual deficits including attention, memory, executive function, and spatial awareness",
    assessmentComponents: [
      "Attention assessment",
      "Memory evaluation",
      "Executive function testing",
      "Spatial awareness assessment",
      "Visual processing evaluation",
      "Problem-solving assessment",
    ],
    clinicalApplications: [
      "Stroke with cognitive deficits",
      "Traumatic brain injury",
      "Dementia",
      "Attention deficit disorders",
      "Perceptual disorders",
      "Cognitive decline",
    ],
    scoringCriteria: [
      "Attention: Continuous Performance Test",
      "Memory: Rey Auditory Verbal Learning",
      "Executive function: Wisconsin Card Sort",
      "Spatial: Block Design",
      "Visual: Visual Object Space Perception",
      "Problem-solving: Tower of London",
    ],
    interpretationGuidelines: [
      "Attention: sustained vs selective",
      "Memory: short-term vs long-term",
      "Executive function: planning & flexibility",
      "Spatial: bilateral integration",
      "Visual: figure-ground & depth",
      "Problem-solving: strategy use",
    ],
    evidenceBase: [
      "Cognitive assessment tools",
      "Perceptual processing research",
      "Neuropsychological testing",
      "Cognitive rehabilitation",
      "Occupational performance analysis",
      "Functional cognition",
    ],
    evidenceLevel: 1,
    source: "AOTA Cognitive-Perceptual Guidelines & Neuropsychology Research",
    citation: "AOTA (2024). Cognitive-Perceptual Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ap-002",
    name: "Comprehensive Sensory Processing Assessment Protocol",
    category: "Sensory Processing Assessment",
    description:
      "Multi-dimensional assessment for sensory processing including tactile, proprioceptive, vestibular, and sensory modulation",
    assessmentComponents: [
      "Tactile sensitivity assessment",
      "Proprioceptive assessment",
      "Vestibular assessment",
      "Sensory modulation evaluation",
      "Sensory discrimination testing",
      "Sensory integration assessment",
    ],
    clinicalApplications: [
      "Autism spectrum disorder",
      "Sensory processing disorder",
      "Developmental delay",
      "Cerebral palsy",
      "Sensory defensiveness",
      "Vestibular dysfunction",
    ],
    scoringCriteria: [
      "Tactile: Sensory Profile",
      "Proprioceptive: Joint position sense",
      "Vestibular: Romberg & Dizziness Handicap",
      "Modulation: Sensory Profile",
      "Discrimination: Two-point discrimination",
      "Integration: Southern California Sensory Integration Tests",
    ],
    interpretationGuidelines: [
      "Tactile: hyper vs hypo-sensitivity",
      "Proprioceptive: body awareness",
      "Vestibular: balance & coordination",
      "Modulation: over vs under-responsive",
      "Discrimination: accuracy & speed",
      "Integration: functional impact",
    ],
    evidenceBase: [
      "Sensory integration theory",
      "Sensory processing research",
      "Sensory profile assessment",
      "Vestibular rehabilitation",
      "Sensory modulation",
      "Occupational performance",
    ],
    evidenceLevel: 1,
    source: "AOTA Sensory Processing Guidelines & Sensory Integration Research",
    citation: "AOTA (2024). Sensory Processing Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ap-003",
    name: "Comprehensive ADL & Functional Independence Assessment Protocol",
    category: "Functional Assessment",
    description:
      "Multi-component assessment for activities of daily living and instrumental activities of daily living including self-care, mobility, and community participation",
    assessmentComponents: [
      "Self-care assessment",
      "Mobility assessment",
      "IADL assessment",
      "Community participation evaluation",
      "Safety assessment",
      "Adaptive equipment evaluation",
    ],
    clinicalApplications: [
      "Stroke recovery",
      "Spinal cord injury",
      "Arthritis",
      "Parkinson's disease",
      "Dementia",
      "Post-surgical rehabilitation",
    ],
    scoringCriteria: [
      "Self-care: FIM scale",
      "Mobility: Timed Up and Go",
      "IADL: Lawton IADL Scale",
      "Community: Community Integration Questionnaire",
      "Safety: Safety Assessment Scale",
      "Adaptive: Equipment Needs Assessment",
    ],
    interpretationGuidelines: [
      "FIM 1-2: Total dependence",
      "FIM 3-4: Moderate dependence",
      "FIM 5-6: Minimal dependence",
      "FIM 7: Independence",
      "IADL: instrumental vs basic",
      "Community: participation level",
    ],
    evidenceBase: [
      "Functional Independence Measure",
      "ADL assessment tools",
      "IADL assessment",
      "Community integration research",
      "Adaptive equipment",
      "Occupational performance",
    ],
    evidenceLevel: 1,
    source: "AOTA Functional Assessment Guidelines & Rehabilitation Research",
    citation: "AOTA (2024). Functional Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ap-004",
    name: "Comprehensive Psychosocial & Mental Health Assessment Protocol",
    category: "Psychosocial Assessment",
    description:
      "Multi-dimensional assessment for mental health and psychosocial factors including mood, anxiety, coping, and occupational role",
    assessmentComponents: [
      "Mood assessment",
      "Anxiety screening",
      "Coping strategies evaluation",
      "Occupational role assessment",
      "Social support evaluation",
      "Substance use screening",
    ],
    clinicalApplications: [
      "Depression",
      "Anxiety disorders",
      "Bipolar disorder",
      "Schizophrenia",
      "Occupational dysfunction",
      "Social isolation",
    ],
    scoringCriteria: [
      "Mood: PHQ-9",
      "Anxiety: GAD-7",
      "Coping: Brief COPE",
      "Occupational role: Role Checklist",
      "Social support: LSNS-6",
      "Substance use: AUDIT-C",
    ],
    interpretationGuidelines: [
      "PHQ-9: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20+ severe",
      "GAD-7: similar scoring",
      "Coping: adaptive vs maladaptive",
      "Role: identity & meaning",
      "Social: isolation risk",
      "Substance: use patterns",
    ],
    evidenceBase: [
      "Mental health screening tools",
      "Psychosocial assessment",
      "Occupational role research",
      "Coping strategies",
      "Social determinants",
      "Occupational therapy mental health",
    ],
    evidenceLevel: 1,
    source: "AOTA Mental Health Guidelines & Psychosocial Research",
    citation: "AOTA (2024). Psychosocial Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ap-005",
    name: "Comprehensive Work Capacity & Vocational Assessment Protocol",
    category: "Vocational Assessment",
    description:
      "Multi-component assessment for work capacity including physical demands, cognitive demands, psychosocial factors, and return-to-work readiness",
    assessmentComponents: [
      "Physical capacity assessment",
      "Cognitive capacity assessment",
      "Psychosocial readiness evaluation",
      "Work tolerance assessment",
      "Job analysis",
      "Accommodation needs assessment",
    ],
    clinicalApplications: [
      "Work disability",
      "Return-to-work planning",
      "Vocational rehabilitation",
      "Occupational injury",
      "Chronic illness",
      "Disability management",
    ],
    scoringCriteria: [
      "Physical: Functional Capacity Evaluation",
      "Cognitive: Work-related cognitive tasks",
      "Psychosocial: Work Readiness Scale",
      "Tolerance: Work simulation",
      "Job analysis: DOT classification",
      "Accommodation: ADA requirements",
    ],
    interpretationGuidelines: [
      "FCE: sedentary to heavy work",
      "Cognitive: task complexity",
      "Psychosocial: readiness factors",
      "Tolerance: endurance & consistency",
      "Job match: essential functions",
      "Accommodation: reasonable & feasible",
    ],
    evidenceBase: [
      "Functional Capacity Evaluation",
      "Work capacity assessment",
      "Vocational rehabilitation",
      "Job analysis",
      "Return-to-work research",
      "Disability management",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Vocational Assessment Guidelines & Work Rehabilitation Research",
    citation: "AOTA (2024). Vocational Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTAssessmentProtocolById(
  id: string,
): OTAssessmentProtocol | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_AP_ID", { id });
      return undefined;
    }
    const protocol = protocols.find((p) => p.id === id);
    if (!protocol) {
      auditService.logWarning("OT_AP_NOT_FOUND", { id });
    }
    return protocol;
  } catch (error) {
    auditService.logError("GET_OT_AP_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTAssessmentProtocols(): OTAssessmentProtocol[] {
  try {
    return [...protocols];
  } catch (error) {
    auditService.logError("GET_ALL_OT_AP_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAssessmentProtocolsByCategory(
  category: string,
): OTAssessmentProtocol[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_AP_CATEGORY", { category });
      return [];
    }
    return protocols.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_AP_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTAssessmentProtocols(
  query: string,
): OTAssessmentProtocol[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_AP_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return protocols.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_AP_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAssessmentProtocolsByEvidenceLevel(
  level: 1 | 2 | 3,
): OTAssessmentProtocol[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_AP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return protocols.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_AP_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAssessmentComponents(): string[] {
  try {
    const components = new Set<string>();
    protocols.forEach((p) =>
      p.assessmentComponents.forEach((c) => components.add(c)),
    );
    return Array.from(components).sort();
  } catch (error) {
    auditService.logError("GET_ASSESSMENT_COMPONENTS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateAssessmentProtocol(
  protocolId: string,
  component: string,
): { valid: boolean; message: string } {
  try {
    const protocol = getOTAssessmentProtocolById(protocolId);
    if (!protocol) return { valid: false, message: "Protocol not found" };
    if (!component || typeof component !== "string")
      return { valid: false, message: "Component must be a string" };
    const hasComponent = protocol.assessmentComponents.some((c) =>
      c.toLowerCase().includes(component.toLowerCase()),
    );
    return {
      valid: hasComponent,
      message: hasComponent ? "Component found" : "Component not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_ASSESSMENT_PROTOCOL_ERROR", {
      protocolId,
      component,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
