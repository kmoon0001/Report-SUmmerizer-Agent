/**
 * PT Intervention Techniques - Exercise Progressions
 */

import { auditService } from "../core/audit/AuditService";

export interface PTExerciseProgression {
  id: string;
  name: string;
  category: string;
  description: string;
  phases: string[];
  indications: string[];
  contraindications: string[];
  progressionCriteria: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const progressions: PTExerciseProgression[] = [
  {
    id: "tech-pt-ex-001",
    name: "Shoulder Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive shoulder strengthening and mobility program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Resistance training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Shoulder injury",
      "Post-operative shoulder",
      "Rotator cuff dysfunction",
      "Frozen shoulder",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Shoulder Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-002",
    name: "Knee Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive knee strengthening and functional training program",
    phases: [
      "Phase 1: Isometric exercises",
      "Phase 2: Isotonic exercises",
      "Phase 3: Isokinetic exercises",
      "Phase 4: Functional training",
      "Phase 5: Sport-specific training",
    ],
    indications: [
      "Knee injury",
      "Post-operative knee",
      "ACL reconstruction",
      "Meniscal injury",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Knee Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-003",
    name: "Hip Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive hip strengthening and mobility program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Resistance training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Hip injury",
      "Post-operative hip",
      "Hip replacement",
      "Hip labral tear",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Hip Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-004",
    name: "Ankle Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive ankle strengthening and proprioceptive training program",
    phases: [
      "Phase 1: Isometric exercises",
      "Phase 2: Isotonic exercises",
      "Phase 3: Proprioceptive training",
      "Phase 4: Functional training",
      "Phase 5: Sport-specific training",
    ],
    indications: [
      "Ankle sprain",
      "Post-operative ankle",
      "Chronic ankle instability",
      "Ankle fracture",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Proprioceptive control",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Ankle Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-005",
    name: "Lumbar Spine Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive lumbar spine stabilization and functional training program",
    phases: [
      "Phase 1: Core activation",
      "Phase 2: Core stabilization",
      "Phase 3: Dynamic stabilization",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Low back pain",
      "Disc herniation",
      "Spinal stenosis",
      "Post-operative spine",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain reduction",
      "Core strength",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Lumbar Spine Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-006",
    name: "Cervical Spine Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive cervical spine stabilization and functional training program",
    phases: [
      "Phase 1: Gentle ROM",
      "Phase 2: Stabilization exercises",
      "Phase 3: Strengthening exercises",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Neck pain",
      "Whiplash injury",
      "Cervical strain",
      "Post-operative neck",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain reduction",
      "ROM improvement",
      "Strength improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cervical Spine Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-007",
    name: "Elbow Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive elbow strengthening and functional training program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Resistance training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Elbow injury",
      "Tennis elbow",
      "Golfer's elbow",
      "Post-operative elbow",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Elbow Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-008",
    name: "Wrist and Hand Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive wrist and hand strengthening and functional training program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Resistance training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Wrist injury",
      "Hand injury",
      "Carpal tunnel syndrome",
      "Post-operative wrist/hand",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain-free ROM",
      "Strength 4/5",
      "Functional movement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Wrist and Hand Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-009",
    name: "Stroke Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive neuromotor training and functional recovery program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Resistance training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Stroke",
      "Hemiplegia",
      "Hemiparesis",
      "Neurological deficit",
    ],
    contraindications: [
      "Acute stroke",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Motor recovery",
      "Functional improvement",
      "Independence increase",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Stroke Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-010",
    name: "Parkinson's Disease Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive motor control and functional training program",
    phases: [
      "Phase 1: Flexibility exercises",
      "Phase 2: Strengthening exercises",
      "Phase 3: Balance training",
      "Phase 4: Gait training",
      "Phase 5: Functional training",
    ],
    indications: [
      "Parkinson's disease",
      "Bradykinesia",
      "Rigidity",
      "Postural instability",
    ],
    contraindications: [
      "Acute illness",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Motor improvement",
      "Functional improvement",
      "Independence increase",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Parkinson's Disease Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-011",
    name: "Spinal Cord Injury Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive neuromotor training and functional recovery program",
    phases: [
      "Phase 1: Passive ROM",
      "Phase 2: Active-assisted ROM",
      "Phase 3: Active ROM",
      "Phase 4: Strengthening",
      "Phase 5: Functional training",
    ],
    indications: [
      "Spinal cord injury",
      "Paraplegia",
      "Tetraplegia",
      "Neurological deficit",
    ],
    contraindications: [
      "Acute injury",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Motor recovery",
      "Functional improvement",
      "Independence increase",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Spinal Cord Injury Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-012",
    name: "Vestibular Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive balance and vestibular training program",
    phases: [
      "Phase 1: Gaze stabilization",
      "Phase 2: Balance training",
      "Phase 3: Gait training",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Vertigo",
      "Dizziness",
      "Balance dysfunction",
      "Vestibular disorder",
    ],
    contraindications: [
      "Acute vertigo",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Symptom reduction",
      "Balance improvement",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Vestibular Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-013",
    name: "Cardiac Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive aerobic and strengthening training program",
    phases: [
      "Phase 1: Low intensity",
      "Phase 2: Moderate intensity",
      "Phase 3: High intensity",
      "Phase 4: Sport-specific training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Cardiac disease",
      "Post-MI",
      "Heart failure",
      "Cardiac surgery",
    ],
    contraindications: [
      "Acute cardiac event",
      "Unstable angina",
      "Severe arrhythmia",
      "Unstable vital signs",
    ],
    progressionCriteria: [
      "Aerobic capacity",
      "Strength improvement",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cardiac Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-014",
    name: "Pulmonary Rehabilitation Progression",
    category: "Exercise Progressions",
    description: "Progressive aerobic and strengthening training program",
    phases: [
      "Phase 1: Low intensity",
      "Phase 2: Moderate intensity",
      "Phase 3: High intensity",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: ["COPD", "Asthma", "Pulmonary disease", "Post-operative lung"],
    contraindications: [
      "Acute exacerbation",
      "Severe dyspnea",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Aerobic capacity",
      "Strength improvement",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Pulmonary Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-015",
    name: "Lymphedema Management Progression",
    category: "Exercise Progressions",
    description: "Progressive exercise and functional training program",
    phases: [
      "Phase 1: Gentle ROM",
      "Phase 2: Active ROM",
      "Phase 3: Resistance training",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Lymphedema",
      "Post-surgical swelling",
      "Circulation impairment",
      "Edema",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Severe pain",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Edema reduction",
      "ROM improvement",
      "Strength improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Lymphedema Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-016",
    name: "Geriatric Fall Prevention Progression",
    category: "Exercise Progressions",
    description:
      "Progressive balance, strength, and functional training program",
    phases: [
      "Phase 1: Seated exercises",
      "Phase 2: Standing exercises",
      "Phase 3: Balance training",
      "Phase 4: Functional training",
      "Phase 5: Community integration",
    ],
    indications: [
      "Fall risk",
      "Balance dysfunction",
      "Weakness",
      "Mobility limitation",
    ],
    contraindications: [
      "Acute illness",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Balance improvement",
      "Strength improvement",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Geriatric Fall Prevention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-017",
    name: "Pediatric Developmental Progression",
    category: "Exercise Progressions",
    description:
      "Progressive motor development and functional training program",
    phases: [
      "Phase 1: Gross motor",
      "Phase 2: Fine motor",
      "Phase 3: Coordination",
      "Phase 4: Functional skills",
      "Phase 5: Community integration",
    ],
    indications: [
      "Developmental delay",
      "Cerebral palsy",
      "Motor dysfunction",
      "Neurological disorder",
    ],
    contraindications: [
      "Acute illness",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Motor improvement",
      "Functional improvement",
      "Independence increase",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Pediatric Developmental Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-018",
    name: "Sports Injury Rehabilitation Progression",
    category: "Exercise Progressions",
    description:
      "Progressive sport-specific training and return to play program",
    phases: [
      "Phase 1: Protection",
      "Phase 2: Restoration",
      "Phase 3: Strengthening",
      "Phase 4: Sport-specific training",
      "Phase 5: Return to play",
    ],
    indications: [
      "Sports injury",
      "Muscle strain",
      "Ligament sprain",
      "Overuse injury",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Neurological compromise",
      "Vascular compromise",
    ],
    progressionCriteria: [
      "Pain reduction",
      "Strength improvement",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Sports Injury Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-019",
    name: "Fibromyalgia Management Progression",
    category: "Exercise Progressions",
    description: "Progressive aerobic and strengthening training program",
    phases: [
      "Phase 1: Low intensity",
      "Phase 2: Moderate intensity",
      "Phase 3: High intensity",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Fibromyalgia",
      "Chronic pain",
      "Fatigue",
      "Sleep dysfunction",
    ],
    contraindications: [
      "Acute exacerbation",
      "Severe pain",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    progressionCriteria: [
      "Pain reduction",
      "Aerobic capacity",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Fibromyalgia Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-ex-020",
    name: "Obesity Management Progression",
    category: "Exercise Progressions",
    description: "Progressive aerobic and strengthening training program",
    phases: [
      "Phase 1: Low impact",
      "Phase 2: Moderate intensity",
      "Phase 3: High intensity",
      "Phase 4: Functional training",
      "Phase 5: Return to activity",
    ],
    indications: [
      "Obesity",
      "Weight management",
      "Deconditioning",
      "Metabolic dysfunction",
    ],
    contraindications: [
      "Acute illness",
      "Severe pain",
      "Unstable vital signs",
      "Severe cardiac disease",
    ],
    progressionCriteria: [
      "Weight reduction",
      "Aerobic capacity",
      "Functional improvement",
      "Patient tolerance",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Obesity Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTExerciseProgressionById(
  id: string,
): PTExerciseProgression | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_EX_ID", { id });
      return undefined;
    }
    const progression = progressions.find((p) => p.id === id);
    if (!progression) {
      auditService.logWarning("PT_EX_NOT_FOUND", { id });
    }
    return progression;
  } catch (error) {
    auditService.logError("GET_PT_EX_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTExerciseProgressions(): PTExerciseProgression[] {
  try {
    return [...progressions];
  } catch (error) {
    auditService.logError("GET_ALL_PT_EX_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTExerciseProgressionsByCategory(
  category: string,
): PTExerciseProgression[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_EX_CATEGORY", { category });
      return [];
    }
    return progressions.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_EX_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTExerciseProgressions(
  query: string,
): PTExerciseProgression[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_EX_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return progressions.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_EX_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTExerciseProgressionsByEvidenceLevel(
  level: 1 | 2 | 3,
): PTExerciseProgression[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_EX_EVIDENCE_LEVEL", { level });
      return [];
    }
    return progressions.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_EX_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTExerciseProgressionPhases(): string[] {
  try {
    const phases = new Set<string>();
    progressions.forEach((p) => p.phases.forEach((ph) => phases.add(ph)));
    return Array.from(phases).sort();
  } catch (error) {
    auditService.logError("GET_PT_EX_PHASES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTExerciseProgressionCriteria(
  progressionId: string,
  criteria: string,
): { valid: boolean; message: string } {
  try {
    const progression = getPTExerciseProgressionById(progressionId);
    if (!progression) return { valid: false, message: "Progression not found" };
    if (!criteria || typeof criteria !== "string")
      return { valid: false, message: "Criteria must be a string" };
    const hasCriteria = progression.progressionCriteria.some((c) =>
      c.toLowerCase().includes(criteria.toLowerCase()),
    );
    return {
      valid: hasCriteria,
      message: hasCriteria ? "Criteria found" : "Criteria not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_EX_CRITERIA_ERROR", {
      progressionId,
      criteria,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
