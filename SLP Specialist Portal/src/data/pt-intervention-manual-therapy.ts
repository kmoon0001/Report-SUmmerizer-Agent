/**
 * PT Intervention Techniques - Manual Therapy
 */

import { auditService } from "../core/audit/AuditService";

export interface PTManualTherapyTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  procedures: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const techniques: PTManualTherapyTechnique[] = [
  {
    id: "tech-pt-mt-001",
    name: "Soft Tissue Mobilization",
    category: "Manual Therapy",
    description:
      "Hands-on technique to mobilize soft tissues and reduce muscle tension",
    indications: [
      "Muscle tension",
      "Myofascial pain",
      "Restricted mobility",
      "Post-injury stiffness",
    ],
    contraindications: [
      "Acute inflammation",
      "Fractures",
      "Severe pain",
      "Skin conditions",
    ],
    procedures: [
      "Assess tissue quality",
      "Apply appropriate pressure",
      "Mobilize tissues",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Manual Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-002",
    name: "Joint Mobilization",
    category: "Manual Therapy",
    description:
      "Passive movement of joint surfaces to improve mobility and reduce pain",
    indications: [
      "Joint stiffness",
      "Restricted range of motion",
      "Joint pain",
      "Post-immobilization",
    ],
    contraindications: [
      "Fractures",
      "Severe osteoporosis",
      "Acute inflammation",
      "Hypermobility",
    ],
    procedures: [
      "Assess joint mobility",
      "Position patient",
      "Apply mobilization",
      "Grade appropriately",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Joint Mobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-003",
    name: "Trigger Point Release",
    category: "Manual Therapy",
    description:
      "Targeted pressure on trigger points to release muscle tension and referred pain",
    indications: [
      "Trigger points",
      "Referred pain",
      "Muscle tension",
      "Myofascial dysfunction",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Skin conditions",
      "Bleeding disorders",
    ],
    procedures: [
      "Identify trigger points",
      "Apply sustained pressure",
      "Release tension",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Trigger Point Release Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-004",
    name: "Muscle Energy Techniques",
    category: "Manual Therapy",
    description:
      "Active patient participation to improve mobility and reduce muscle tension",
    indications: [
      "Muscle tightness",
      "Restricted mobility",
      "Postural dysfunction",
      "Muscle imbalance",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological conditions",
      "Fractures",
    ],
    procedures: [
      "Position patient",
      "Instruct contraction",
      "Apply resistance",
      "Relax and stretch",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Muscle Energy Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-005",
    name: "Myofascial Release",
    category: "Manual Therapy",
    description:
      "Sustained pressure on myofascial tissues to release restrictions and improve mobility",
    indications: [
      "Myofascial restrictions",
      "Fascial adhesions",
      "Chronic pain",
      "Limited mobility",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Skin conditions",
      "Vascular compromise",
    ],
    procedures: [
      "Assess fascial restrictions",
      "Apply sustained pressure",
      "Release restrictions",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Myofascial Release Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-006",
    name: "Stretching Techniques",
    category: "Manual Therapy",
    description:
      "Passive and active stretching to improve flexibility and reduce muscle tension",
    indications: [
      "Muscle tightness",
      "Limited flexibility",
      "Postural dysfunction",
      "Muscle imbalance",
    ],
    contraindications: [
      "Acute pain",
      "Fractures",
      "Severe weakness",
      "Hypermobility",
    ],
    procedures: [
      "Position patient",
      "Apply gentle stretch",
      "Hold position",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Stretching Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-007",
    name: "Proprioceptive Neuromuscular Facilitation",
    category: "Manual Therapy",
    description:
      "Advanced technique using diagonal patterns to enhance neuromuscular control",
    indications: [
      "Weakness",
      "Neuromuscular dysfunction",
      "Limited mobility",
      "Motor control deficits",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological conditions",
      "Fractures",
    ],
    procedures: [
      "Assess movement patterns",
      "Apply resistance",
      "Guide movement",
      "Progress difficulty",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). PNF Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-008",
    name: "Mobilization with Movement",
    category: "Manual Therapy",
    description:
      "Combination of passive mobilization with active movement to improve function",
    indications: [
      "Joint pain",
      "Limited mobility",
      "Functional limitations",
      "Movement dysfunction",
    ],
    contraindications: [
      "Fractures",
      "Severe pain",
      "Acute inflammation",
      "Hypermobility",
    ],
    procedures: [
      "Assess movement",
      "Apply mobilization",
      "Guide active movement",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Mobilization with Movement Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-009",
    name: "Traction Techniques",
    category: "Manual Therapy",
    description:
      "Longitudinal force application to decompress joints and reduce pain",
    indications: [
      "Joint compression",
      "Nerve compression",
      "Disc herniation",
      "Joint pain",
    ],
    contraindications: [
      "Fractures",
      "Severe osteoporosis",
      "Hypermobility",
      "Vascular compromise",
    ],
    procedures: [
      "Position patient",
      "Apply traction force",
      "Maintain position",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Traction Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-010",
    name: "Manipulation Techniques",
    category: "Manual Therapy",
    description: "High-velocity low-amplitude thrust to restore joint mobility",
    indications: [
      "Joint restriction",
      "Subluxation",
      "Functional limitation",
      "Acute joint pain",
    ],
    contraindications: [
      "Fractures",
      "Severe osteoporosis",
      "Hypermobility",
      "Neurological compromise",
    ],
    procedures: [
      "Assess joint mobility",
      "Position patient",
      "Apply thrust",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Manipulation Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-011",
    name: "Soft Tissue Techniques - Graston",
    category: "Manual Therapy",
    description:
      "Instrument-assisted soft tissue mobilization to address fascial restrictions",
    indications: [
      "Myofascial restrictions",
      "Scar tissue",
      "Chronic pain",
      "Limited mobility",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Skin conditions",
      "Bleeding disorders",
    ],
    procedures: [
      "Assess tissue quality",
      "Apply instruments",
      "Mobilize tissues",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "APTA (2020). Instrument-Assisted Soft Tissue Mobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-012",
    name: "Cupping Therapy",
    category: "Manual Therapy",
    description:
      "Suction-based technique to mobilize soft tissues and improve circulation",
    indications: [
      "Muscle tension",
      "Myofascial pain",
      "Restricted mobility",
      "Poor circulation",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Skin conditions",
      "Bleeding disorders",
    ],
    procedures: [
      "Assess tissue quality",
      "Apply cups",
      "Mobilize tissues",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Cupping Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-013",
    name: "Dry Needling",
    category: "Manual Therapy",
    description:
      "Insertion of thin needles into trigger points to release muscle tension",
    indications: [
      "Trigger points",
      "Myofascial pain",
      "Muscle tension",
      "Referred pain",
    ],
    contraindications: [
      "Acute inflammation",
      "Bleeding disorders",
      "Severe pain",
      "Needle phobia",
    ],
    procedures: [
      "Identify trigger points",
      "Insert needle",
      "Elicit response",
      "Remove needle",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Dry Needling Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-014",
    name: "Kinesiology Taping",
    category: "Manual Therapy",
    description: "Application of elastic tape to support muscles and joints",
    indications: [
      "Muscle weakness",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Skin conditions",
      "Severe pain",
      "Allergies to tape",
      "Vascular compromise",
    ],
    procedures: [
      "Assess condition",
      "Prepare skin",
      "Apply tape",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Kinesiology Taping Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-015",
    name: "Lymphatic Drainage",
    category: "Manual Therapy",
    description:
      "Gentle manual technique to promote lymphatic circulation and reduce edema",
    indications: [
      "Edema",
      "Lymphedema",
      "Post-surgical swelling",
      "Circulation impairment",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Malignancy",
      "Vascular compromise",
    ],
    procedures: [
      "Assess lymphatic status",
      "Apply gentle pressure",
      "Follow lymphatic pathways",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Lymphatic Drainage Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-016",
    name: "Scar Tissue Mobilization",
    category: "Manual Therapy",
    description:
      "Targeted techniques to improve scar tissue mobility and function",
    indications: [
      "Scar tissue",
      "Adhesions",
      "Limited mobility",
      "Functional limitations",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Skin conditions",
      "Recent surgery",
    ],
    procedures: [
      "Assess scar tissue",
      "Apply mobilization",
      "Progress intensity",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Scar Tissue Mobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-017",
    name: "Neuromobilization Techniques",
    category: "Manual Therapy",
    description:
      "Techniques to mobilize neural tissues and improve nerve function",
    indications: [
      "Nerve compression",
      "Neuropathic pain",
      "Limited mobility",
      "Neurological dysfunction",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological conditions",
      "Vascular compromise",
    ],
    procedures: [
      "Assess neural mobility",
      "Apply gentle mobilization",
      "Progress intensity",
      "Educate patient",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Neuromobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-018",
    name: "Fascial Unwinding",
    category: "Manual Therapy",
    description:
      "Gentle technique allowing tissues to release restrictions naturally",
    indications: [
      "Fascial restrictions",
      "Chronic pain",
      "Limited mobility",
      "Postural dysfunction",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological conditions",
      "Vascular compromise",
    ],
    procedures: [
      "Assess fascial restrictions",
      "Apply gentle pressure",
      "Allow tissue release",
      "Monitor response",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Fascial Unwinding Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-019",
    name: "Positional Release Technique",
    category: "Manual Therapy",
    description: "Positioning patient to reduce muscle tension and pain",
    indications: [
      "Muscle tension",
      "Pain",
      "Postural dysfunction",
      "Muscle imbalance",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Fractures",
      "Neurological conditions",
    ],
    procedures: [
      "Identify tender points",
      "Position patient",
      "Hold position",
      "Release position",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Positional Release Technique Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mt-020",
    name: "Strain-Counterstrain",
    category: "Manual Therapy",
    description: "Technique using gentle positioning to release muscle tension",
    indications: [
      "Muscle tension",
      "Pain",
      "Postural dysfunction",
      "Muscle imbalance",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Fractures",
      "Neurological conditions",
    ],
    procedures: [
      "Identify tender points",
      "Position patient",
      "Hold position",
      "Release position",
      "Document findings",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Strain-Counterstrain Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTManualTherapyTechniqueById(
  id: string,
): PTManualTherapyTechnique | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_MT_ID", { id });
      return undefined;
    }
    const technique = techniques.find((t) => t.id === id);
    if (!technique) {
      auditService.logWarning("PT_MT_NOT_FOUND", { id });
    }
    return technique;
  } catch (error) {
    auditService.logError("GET_PT_MT_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTManualTherapyTechniques(): PTManualTherapyTechnique[] {
  try {
    return [...techniques];
  } catch (error) {
    auditService.logError("GET_ALL_PT_MT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTManualTherapyTechniquesByCategory(
  category: string,
): PTManualTherapyTechnique[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_MT_CATEGORY", { category });
      return [];
    }
    return techniques.filter((t) =>
      t.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_MT_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTManualTherapyTechniques(
  query: string,
): PTManualTherapyTechnique[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_MT_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return techniques.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_MT_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTManualTherapyTechniquesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTManualTherapyTechnique[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_MT_EVIDENCE_LEVEL", { level });
      return [];
    }
    return techniques.filter((t) => t.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_MT_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTManualTherapyIndications(): string[] {
  try {
    const indications = new Set<string>();
    techniques.forEach((t) => t.indications.forEach((i) => indications.add(i)));
    return Array.from(indications).sort();
  } catch (error) {
    auditService.logError("GET_PT_MT_INDICATIONS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTManualTherapyContraindication(
  techniqueId: string,
  contraindication: string,
): { valid: boolean; message: string } {
  try {
    const technique = getPTManualTherapyTechniqueById(techniqueId);
    if (!technique) return { valid: false, message: "Technique not found" };
    if (!contraindication || typeof contraindication !== "string")
      return { valid: false, message: "Contraindication must be a string" };
    const hasContraindication = technique.contraindications.some((c) =>
      c.toLowerCase().includes(contraindication.toLowerCase()),
    );
    return {
      valid: hasContraindication,
      message: hasContraindication
        ? "Contraindication found"
        : "Contraindication not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_MT_CONTRAINDICATION_ERROR", {
      techniqueId,
      contraindication,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
