/**
 * PT Advanced Assessment Protocols
 * Complex assessment frameworks for multi-system evaluation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTAssessmentProtocol {
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

const protocols: PTAssessmentProtocol[] = [
  {
    id: "pt-ap-001",
    name: "Comprehensive Neuromotor Assessment Protocol",
    category: "Neurological Assessment",
    description:
      "Multi-component assessment for complex neurological conditions including motor control, coordination, balance, and functional mobility",
    assessmentComponents: [
      "Motor control assessment",
      "Coordination testing",
      "Balance evaluation",
      "Gait analysis",
      "Functional mobility assessment",
      "Cognitive-motor integration",
    ],
    clinicalApplications: [
      "Stroke recovery",
      "Parkinson's disease",
      "Cerebellar dysfunction",
      "Spinal cord injury",
      "Traumatic brain injury",
      "Multiple sclerosis",
    ],
    scoringCriteria: [
      "Motor control: 0-5 scale",
      "Coordination: 0-4 scale",
      "Balance: Berg Balance Scale",
      "Gait: Gait speed & cadence",
      "Functional mobility: TUG test",
      "Cognitive-motor: dual-task performance",
    ],
    interpretationGuidelines: [
      "Score <20: Severe impairment",
      "Score 20-40: Moderate impairment",
      "Score 40-60: Mild impairment",
      "Score >60: Minimal impairment",
      "Trend analysis critical",
      "Functional correlation essential",
    ],
    evidenceBase: [
      "Fugl-Meyer Assessment",
      "Berg Balance Scale",
      "Timed Up and Go",
      "Gait analysis research",
      "Dual-task assessment literature",
      "Neuromotor recovery studies",
    ],
    evidenceLevel: 1,
    source: "APTA Neurological Guidelines & Motor Control Research",
    citation: "APTA (2024). Neuromotor Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ap-002",
    name: "Comprehensive Pain & Psychosocial Assessment Protocol",
    category: "Pain & Psychosocial Assessment",
    description:
      "Multi-dimensional assessment for chronic pain including nociceptive, neuropathic, and psychosocial components",
    assessmentComponents: [
      "Pain intensity assessment",
      "Pain quality assessment",
      "Psychosocial screening",
      "Functional impact assessment",
      "Medication review",
      "Sleep assessment",
    ],
    clinicalApplications: [
      "Chronic low back pain",
      "Chronic neck pain",
      "Fibromyalgia",
      "Complex regional pain syndrome",
      "Post-surgical pain",
      "Cancer pain",
    ],
    scoringCriteria: [
      "Pain intensity: 0-10 NRS",
      "Pain quality: PainDETECT",
      "Psychosocial: PHQ-9 & GAD-7",
      "Functional impact: OSWESTRY",
      "Medication: Opioid Risk Tool",
      "Sleep: Pittsburgh Sleep Quality Index",
    ],
    interpretationGuidelines: [
      "Nociceptive pain: localized, mechanical",
      "Neuropathic pain: burning, radiating",
      "Central sensitization: widespread",
      "Psychosocial factors: critical",
      "Medication impact: significant",
      "Sleep disruption: common",
    ],
    evidenceBase: [
      "Biopsychosocial pain model",
      "Pain neuroscience education",
      "Central sensitization research",
      "Psychosocial pain factors",
      "Sleep and pain relationship",
      "Medication effects on pain",
    ],
    evidenceLevel: 1,
    source: "APTA Pain Management Guidelines & Biopsychosocial Research",
    citation: "APTA (2024). Pain Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ap-003",
    name: "Comprehensive Cardiopulmonary Assessment Protocol",
    category: "Cardiopulmonary Assessment",
    description:
      "Multi-system assessment for cardiac and pulmonary dysfunction including exercise tolerance, vital response, and functional capacity",
    assessmentComponents: [
      "Vital sign response",
      "Exercise tolerance testing",
      "Dyspnea assessment",
      "Functional capacity evaluation",
      "Psychological screening",
      "Medication review",
    ],
    clinicalApplications: [
      "Post-MI rehabilitation",
      "Heart failure management",
      "COPD rehabilitation",
      "Pulmonary fibrosis",
      "Post-COVID-19 recovery",
      "Pre-surgical clearance",
    ],
    scoringCriteria: [
      "Vital signs: HR, BP, RR, O2 sat",
      "Exercise tolerance: 6MWT distance",
      "Dyspnea: Modified Borg Scale",
      "Functional capacity: METs achieved",
      "Psychological: PHQ-9 & GAD-7",
      "Medication: Cardiac drug review",
    ],
    interpretationGuidelines: [
      "Normal response: HR <120, BP <180/110",
      "Abnormal response: excessive HR/BP rise",
      "Dyspnea: limiting factor assessment",
      "Functional capacity: activity prescription",
      "Psychological factors: anxiety common",
      "Medication optimization: essential",
    ],
    evidenceBase: [
      "Cardiac rehabilitation guidelines",
      "Exercise physiology research",
      "Pulmonary function testing",
      "Dyspnea assessment tools",
      "Psychological factors in cardiac disease",
      "Exercise prescription evidence",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Guidelines & Cardiac Rehabilitation Research",
    citation: "APTA (2024). Cardiopulmonary Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ap-004",
    name: "Comprehensive Orthopedic Assessment Protocol",
    category: "Orthopedic Assessment",
    description:
      "Multi-component assessment for complex orthopedic conditions including ROM, strength, stability, and functional movement",
    assessmentComponents: [
      "Range of motion assessment",
      "Strength testing",
      "Stability assessment",
      "Functional movement screening",
      "Proprioception evaluation",
      "Pain provocation testing",
    ],
    clinicalApplications: [
      "Post-surgical rehabilitation",
      "Chronic joint dysfunction",
      "Ligament injuries",
      "Muscle strains",
      "Postural dysfunction",
      "Movement pattern dysfunction",
    ],
    scoringCriteria: [
      "ROM: degrees of motion",
      "Strength: 0-5 manual muscle test",
      "Stability: special tests",
      "Movement: FMS score",
      "Proprioception: balance testing",
      "Pain: provocation test results",
    ],
    interpretationGuidelines: [
      "ROM: compare bilateral",
      "Strength: functional correlation",
      "Stability: mechanism of injury",
      "Movement: pattern dysfunction",
      "Proprioception: training response",
      "Pain: mechanical vs non-mechanical",
    ],
    evidenceBase: [
      "Orthopedic special tests",
      "Functional movement screening",
      "Proprioceptive training research",
      "Post-surgical rehabilitation protocols",
      "Movement pattern analysis",
      "Tissue healing timelines",
    ],
    evidenceLevel: 1,
    source: "APTA Orthopedic Guidelines & Movement Science Research",
    citation: "APTA (2024). Orthopedic Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ap-005",
    name: "Comprehensive Geriatric Assessment Protocol",
    category: "Geriatric Assessment",
    description:
      "Multi-dimensional assessment for older adults including fall risk, functional independence, cognitive status, and social factors",
    assessmentComponents: [
      "Fall risk assessment",
      "Functional independence evaluation",
      "Cognitive screening",
      "Medication review",
      "Social support assessment",
      "Environmental assessment",
    ],
    clinicalApplications: [
      "Fall prevention",
      "Frailty management",
      "Cognitive decline",
      "Polypharmacy management",
      "Social isolation",
      "Environmental hazards",
    ],
    scoringCriteria: [
      "Fall risk: Timed Up and Go",
      "Functional independence: ADL/IADL",
      "Cognitive: Montreal Cognitive Assessment",
      "Medication: Beers Criteria",
      "Social: LSNS-6",
      "Environment: HOME assessment",
    ],
    interpretationGuidelines: [
      "TUG <12 sec: low fall risk",
      "TUG 12-21 sec: moderate risk",
      "TUG >21 sec: high fall risk",
      "ADL dependence: care planning",
      "Cognitive decline: safety concerns",
      "Polypharmacy: medication review essential",
    ],
    evidenceBase: [
      "Geriatric assessment tools",
      "Fall prevention research",
      "Frailty assessment",
      "Cognitive screening tools",
      "Medication safety in older adults",
      "Social determinants of health",
    ],
    evidenceLevel: 1,
    source: "APTA Geriatrics Guidelines & Aging Research",
    citation: "APTA (2024). Geriatric Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTAssessmentProtocolById(
  id: string,
): PTAssessmentProtocol | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_AP_ID", { id });
      return undefined;
    }
    const protocol = protocols.find((p) => p.id === id);
    if (!protocol) {
      auditService.logWarning("PT_AP_NOT_FOUND", { id });
    }
    return protocol;
  } catch (error) {
    auditService.logError("GET_PT_AP_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTAssessmentProtocols(): PTAssessmentProtocol[] {
  try {
    return [...protocols];
  } catch (error) {
    auditService.logError("GET_ALL_PT_AP_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTAssessmentProtocolsByCategory(
  category: string,
): PTAssessmentProtocol[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_AP_CATEGORY", { category });
      return [];
    }
    return protocols.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_AP_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTAssessmentProtocols(
  query: string,
): PTAssessmentProtocol[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_AP_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_AP_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTAssessmentProtocolsByEvidenceLevel(
  level: 1 | 2 | 3,
): PTAssessmentProtocol[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_AP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return protocols.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_AP_BY_EVIDENCE_ERROR", {
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
    const protocol = getPTAssessmentProtocolById(protocolId);
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
