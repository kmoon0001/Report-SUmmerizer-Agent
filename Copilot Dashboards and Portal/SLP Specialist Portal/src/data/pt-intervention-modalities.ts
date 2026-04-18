/**
 * PT Intervention Techniques - Modalities
 */

import { auditService } from "../core/audit/AuditService";

export interface PTModalityIntervention {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  parameters: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modalities: PTModalityIntervention[] = [
  {
    id: "tech-pt-mod-001",
    name: "Transcutaneous Electrical Nerve Stimulation (TENS)",
    category: "Modalities",
    description: "Electrical stimulation to reduce pain and promote healing",
    indications: [
      "Acute pain",
      "Chronic pain",
      "Post-operative pain",
      "Neuropathic pain",
    ],
    contraindications: [
      "Pacemakers",
      "Pregnancy",
      "Acute inflammation",
      "Skin conditions",
    ],
    parameters: [
      "Frequency: 50-100 Hz",
      "Duration: 20-30 minutes",
      "Intensity: Sensory level",
      "Electrode placement: Over pain area",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). TENS Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mod-002",
    name: "Therapeutic Ultrasound",
    category: "Modalities",
    description:
      "High-frequency sound waves to promote tissue healing and reduce inflammation",
    indications: [
      "Soft tissue injury",
      "Inflammation",
      "Scar tissue",
      "Chronic pain",
    ],
    contraindications: [
      "Pregnancy",
      "Malignancy",
      "Acute inflammation",
      "Vascular compromise",
    ],
    parameters: [
      "Frequency: 1-3 MHz",
      "Duration: 5-10 minutes",
      "Intensity: 0.5-2 W/cm²",
      "Continuous or pulsed mode",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Therapeutic Ultrasound Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mod-003",
    name: "Therapeutic Heat",
    category: "Modalities",
    description:
      "Application of heat to reduce pain, improve circulation, and increase tissue extensibility",
    indications: [
      "Muscle tension",
      "Stiffness",
      "Chronic pain",
      "Limited mobility",
    ],
    contraindications: [
      "Acute inflammation",
      "Fever",
      "Vascular compromise",
      "Sensory impairment",
    ],
    parameters: [
      "Temperature: 40-45°C",
      "Duration: 15-20 minutes",
      "Modality: Hot pack, paraffin, or infrared",
      "Frequency: Daily or as needed",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Therapeutic Heat Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mod-004",
    name: "Cryotherapy",
    category: "Modalities",
    description:
      "Application of cold to reduce pain, inflammation, and swelling",
    indications: ["Acute pain", "Inflammation", "Swelling", "Muscle spasm"],
    contraindications: [
      "Cold sensitivity",
      "Vascular compromise",
      "Raynaud's phenomenon",
      "Sensory impairment",
    ],
    parameters: [
      "Temperature: 0-15°C",
      "Duration: 10-15 minutes",
      "Modality: Ice pack, cold water immersion",
      "Frequency: Every 2-3 hours",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cryotherapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-mod-005",
    name: "Laser Therapy",
    category: "Modalities",
    description:
      "Low-level laser to promote tissue healing and reduce inflammation",
    indications: [
      "Soft tissue injury",
      "Inflammation",
      "Chronic pain",
      "Wound healing",
    ],
    contraindications: [
      "Malignancy",
      "Pregnancy",
      "Eye conditions",
      "Photosensitivity",
    ],
    parameters: [
      "Wavelength: 600-1000 nm",
      "Power: 1-50 mW",
      "Duration: 30-60 seconds per point",
      "Frequency: 2-3 times per week",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Laser Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTModalityInterventionById(
  id: string,
): PTModalityIntervention | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_MOD_ID", { id });
      return undefined;
    }
    const modality = modalities.find((m) => m.id === id);
    if (!modality) {
      auditService.logWarning("PT_MOD_NOT_FOUND", { id });
    }
    return modality;
  } catch (error) {
    auditService.logError("GET_PT_MOD_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTModalityInterventions(): PTModalityIntervention[] {
  try {
    return [...modalities];
  } catch (error) {
    auditService.logError("GET_ALL_PT_MOD_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTModalityInterventionsByCategory(
  category: string,
): PTModalityIntervention[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_MOD_CATEGORY", { category });
      return [];
    }
    return modalities.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_MOD_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTModalityInterventions(
  query: string,
): PTModalityIntervention[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_MOD_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return modalities.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.category.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_MOD_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTModalityInterventionsByEvidenceLevel(
  level: 1 | 2 | 3,
): PTModalityIntervention[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_MOD_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modalities.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_MOD_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTModalityIndications(): string[] {
  try {
    const indications = new Set<string>();
    modalities.forEach((m) => m.indications.forEach((i) => indications.add(i)));
    return Array.from(indications).sort();
  } catch (error) {
    auditService.logError("GET_PT_MOD_INDICATIONS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTModalityContraindication(
  modalityId: string,
  contraindication: string,
): { valid: boolean; message: string } {
  try {
    const modality = getPTModalityInterventionById(modalityId);
    if (!modality) return { valid: false, message: "Modality not found" };
    if (!contraindication || typeof contraindication !== "string")
      return { valid: false, message: "Contraindication must be a string" };
    const hasContraindication = modality.contraindications.some((c) =>
      c.toLowerCase().includes(contraindication.toLowerCase()),
    );
    return {
      valid: hasContraindication,
      message: hasContraindication
        ? "Contraindication found"
        : "Contraindication not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_MOD_CONTRAINDICATION_ERROR", {
      modalityId,
      contraindication,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
