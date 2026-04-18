/**
 * PT Evidence-Based Resources & Clinical Depth
 * Based on APTA Clinical Practice Guidelines, Cochrane Reviews, and Current Evidence
 */

import { auditService } from "../core/audit/AuditService";

export interface PTEvidenceResource {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalApplication: string[];
  evidenceBase: string[];
  keyFindings: string[];
  recommendedTools: string[];
  citationAuthors: string[];
  publicationYear: number;
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

const resources: PTEvidenceResource[] = [
  {
    id: "pt-ebr-001",
    name: "Strength Training in Stroke Recovery: Systematic Review & Meta-Analysis",
    category: "Neurological Rehabilitation",
    description:
      "Evidence on strength training effects on motor recovery, functional outcomes, and post-stroke complications in hospital and inpatient settings",
    clinicalApplication: [
      "Progressive resistance training",
      "Task-specific training",
      "Functional strength integration",
      "Motor recovery optimization",
      "Complication prevention",
    ],
    evidenceBase: [
      "Randomized controlled trials",
      "Systematic reviews",
      "Meta-analyses",
      "Cochrane reviews",
      "APTA guidelines",
    ],
    keyFindings: [
      "Strength training improves motor recovery",
      "Task-specific training enhances functional outcomes",
      "Early mobilization reduces complications",
      "Progressive overload optimizes gains",
      "Individualized programs show best results",
    ],
    recommendedTools: [
      "Dynamometry",
      "Functional strength tests",
      "Motor recovery scales",
      "Gait analysis",
      "Activity tolerance testing",
    ],
    citationAuthors: [
      "Langhorne P",
      "Bernhardt J",
      "Legg LA",
      "Stroke Foundation",
    ],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "Cochrane Systematic Review & APTA Guidelines",
    doi: "10.1186/s13643-024-02676-0",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ebr-002",
    name: "Telerehabilitation Clinical Practice Guideline",
    category: "Digital Health & Innovation",
    description:
      "APTA first-ever telerehab CPG with 7 evidence-based recommendations for implementation, benefits, harms, and cost analysis",
    clinicalApplication: [
      "Remote patient monitoring",
      "Virtual exercise prescription",
      "Telehealth assessment",
      "Home-based rehabilitation",
      "Hybrid care models",
    ],
    evidenceBase: [
      "Randomized controlled trials 2010-2022",
      "Comparative effectiveness studies",
      "Qualitative research",
      "Implementation science",
      "Patient outcomes data",
    ],
    keyFindings: [
      "Telerehab shows comparable outcomes to in-person",
      "Improves access for rural/underserved populations",
      "Reduces healthcare costs",
      "Enhances patient engagement",
      "Requires proper technology and training",
    ],
    recommendedTools: [
      "Video conferencing platforms",
      "Wearable sensors",
      "Motion capture technology",
      "Telehealth assessment tools",
      "Remote monitoring devices",
    ],
    citationAuthors: ["APTA", "American Physical Therapy Association"],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "APTA Clinical Practice Guideline",
    doi: "10.1093/ptj/pzad089",
    lastUpdated: new Date("2024-03-22"),
  },
  {
    id: "pt-ebr-003",
    name: "Combined Therapy for Musculoskeletal Pain Management",
    category: "Pain Management & Modalities",
    description:
      "Systematic review and meta-analysis on combined therapeutic ultrasound and electrotherapy for musculoskeletal pain",
    clinicalApplication: [
      "Acute pain management",
      "Chronic pain reduction",
      "Tissue healing acceleration",
      "Inflammation control",
      "Functional restoration",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Meta-analyses",
      "Randomized trials",
      "Comparative effectiveness",
      "Clinical outcomes",
    ],
    keyFindings: [
      "Combined therapy enhances analgesic effects",
      "Synergistic benefits over single modality",
      "Optimal timing and parameters identified",
      "Cost-effective approach",
      "Reduces medication dependency",
    ],
    recommendedTools: [
      "Therapeutic ultrasound",
      "TENS units",
      "Electrotherapy devices",
      "Combination protocols",
      "Outcome measurement scales",
    ],
    citationAuthors: [
      "ResearchGate Contributors",
      "Physical Therapy Researchers",
    ],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "Systematic Review & Meta-Analysis",
    lastUpdated: new Date("2024-12-10"),
  },
  {
    id: "pt-ebr-004",
    name: "Post-COVID-19 Rehabilitation: Functional Capacity & Quality of Life",
    category: "Emerging Conditions & Long-Term Recovery",
    description:
      "Systematic review of PT management efficacy on functional capacity, psychological well-being, and quality of life in post-COVID patients",
    clinicalApplication: [
      "Aerobic capacity restoration",
      "Fatigue management",
      "Functional mobility training",
      "Psychological support integration",
      "Return to activity planning",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Clinical trials",
      "Longitudinal studies",
      "Patient-reported outcomes",
      "Functional assessments",
    ],
    keyFindings: [
      "PT improves functional capacity significantly",
      "Psychological well-being enhanced through exercise",
      "Quality of life improvements sustained",
      "Individualized programs most effective",
      "Long-term follow-up essential",
    ],
    recommendedTools: [
      "6-Minute Walk Test",
      "Fatigue scales",
      "Functional capacity evaluations",
      "Psychological assessments",
      "Quality of life questionnaires",
    ],
    citationAuthors: [
      "ResearchGate Contributors",
      "COVID-19 Rehabilitation Researchers",
    ],
    publicationYear: 2025,
    evidenceLevel: 1,
    source: "Systematic Review of Clinical Trials",
    lastUpdated: new Date("2025-02-15"),
  },
  {
    id: "pt-ebr-005",
    name: "Wearable Devices in Physical Rehabilitation: Systematic Review",
    category: "Technology & Innovation",
    description:
      "Systematic review of commercially available wearables for physical rehabilitation in acute recovery settings",
    clinicalApplication: [
      "Real-time activity monitoring",
      "Adherence tracking",
      "Outcome measurement",
      "Patient engagement",
      "Remote supervision",
    ],
    evidenceBase: [
      "Observational studies",
      "Clinical trials",
      "Implementation research",
      "User experience studies",
      "Effectiveness data",
    ],
    keyFindings: [
      "Wearables improve adherence rates",
      "Real-time feedback enhances outcomes",
      "Cost-effective monitoring solution",
      "Patient engagement increases",
      "Integration with clinical workflows needed",
    ],
    recommendedTools: [
      "Accelerometers",
      "Motion sensors",
      "Heart rate monitors",
      "Activity trackers",
      "Data analytics platforms",
    ],
    citationAuthors: [
      "ResearchGate Contributors",
      "Rehabilitation Technology Researchers",
    ],
    publicationYear: 2024,
    evidenceLevel: 2,
    source: "Systematic Review",
    lastUpdated: new Date("2024-12-15"),
  },
];

export function getPTEvidenceResourceById(
  id: string,
): PTEvidenceResource | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_EBR_ID", { id });
      return undefined;
    }
    const resource = resources.find((r) => r.id === id);
    if (!resource) {
      auditService.logWarning("PT_EBR_NOT_FOUND", { id });
    }
    return resource;
  } catch (error) {
    auditService.logError("GET_PT_EBR_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTEvidenceResources(): PTEvidenceResource[] {
  try {
    return [...resources];
  } catch (error) {
    auditService.logError("GET_ALL_PT_EBR_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTEvidenceResourcesByCategory(
  category: string,
): PTEvidenceResource[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_EBR_CATEGORY", { category });
      return [];
    }
    return resources.filter((r) =>
      r.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_EBR_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTEvidenceResources(query: string): PTEvidenceResource[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_EBR_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.category.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_EBR_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTEvidenceResourcesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTEvidenceResource[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_EBR_EVIDENCE_LEVEL", { level });
      return [];
    }
    return resources.filter((r) => r.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_EBR_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getKeyFindings(): string[] {
  try {
    const findings = new Set<string>();
    resources.forEach((r) => r.keyFindings.forEach((f) => findings.add(f)));
    return Array.from(findings).sort();
  } catch (error) {
    auditService.logError("GET_KEY_FINDINGS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateClinicalApplication(
  resourceId: string,
  application: string,
): { valid: boolean; message: string } {
  try {
    const resource = getPTEvidenceResourceById(resourceId);
    if (!resource) return { valid: false, message: "Resource not found" };
    if (!application || typeof application !== "string")
      return { valid: false, message: "Application must be a string" };
    const hasApplication = resource.clinicalApplication.some((a) =>
      a.toLowerCase().includes(application.toLowerCase()),
    );
    return {
      valid: hasApplication,
      message: hasApplication ? "Application found" : "Application not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_CLINICAL_APPLICATION_ERROR", {
      resourceId,
      application,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
