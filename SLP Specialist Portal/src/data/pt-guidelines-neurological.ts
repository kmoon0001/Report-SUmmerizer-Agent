/**
 * PT Evidence-Based Guidelines - Neurological
 * APTA Clinical Practice Guidelines for neurological conditions
 */

import { auditService } from "../core/audit/AuditService";

export interface PTNeurologicalGuideline {
  id: string;
  name: string;
  condition: string;
  description: string;
  recommendations: string[];
  contraindications: string[];
  precautions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const guidelines: PTNeurologicalGuideline[] = [
  {
    id: "gl-pt-011",
    name: "Stroke Rehabilitation",
    condition: "Stroke",
    description:
      "Evidence-based management of acute and chronic stroke rehabilitation",
    recommendations: [
      "Task-specific training",
      "Repetitive practice",
      "Constraint-induced therapy",
      "Functional electrical stimulation",
      "Aerobic training",
      "Balance training",
    ],
    contraindications: [
      "Acute hemorrhage",
      "Unstable vital signs",
      "Severe cognitive impairment",
    ],
    precautions: [
      "Monitor blood pressure",
      "Assess fall risk",
      "Monitor for fatigue",
      "Gradual progression",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2014). Stroke Rehabilitation Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-012",
    name: "Parkinson's Disease Management",
    condition: "Parkinson's Disease",
    description:
      "Physical therapy management of Parkinson's disease symptoms and progression",
    recommendations: [
      "Cueing strategies",
      "Balance training (proprioceptive)",
      "Gait training (auditory cues)",
      "Strengthening exercises",
      "Cognitive-motor training",
    ],
    contraindications: [
      "Severe orthostatic hypotension",
      "Acute medical instability",
    ],
    precautions: [
      "Monitor for freezing episodes",
      "Assess fall risk",
      "Monitor medication timing (on/off phase)",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2014). Parkinson's Disease Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-013",
    name: "Multiple Sclerosis Management",
    condition: "Multiple Sclerosis",
    description:
      "Physical therapy interventions for multiple sclerosis symptom management",
    recommendations: [
      "Balance training",
      "Strengthening exercises",
      "Aerobic conditioning (intensity based on fatigue)",
      "Flexibility training",
      "Fatigue management",
    ],
    contraindications: [
      "Acute exacerbation with severe symptoms",
      "Severe fatigue",
    ],
    precautions: [
      "Monitor for heat sensitivity (Uthoff’s phenomenon)",
      "Assess fatigue levels",
      "Gradual progression",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2017). Multiple Sclerosis Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-014",
    name: "Vestibular Rehabilitation",
    condition: "Vestibular Dysfunction",
    description: "Management of peripheral vestibular hypofunction and BPPV",
    recommendations: [
      "Canalith repositioning maneuvers (Epley, Semont)",
      "Gaze stabilization exercises (VOR)",
      "Habituation exercises",
      "Balance training",
    ],
    contraindications: [
      "Cervical spine instability",
      "Vertebral artery compression syndrome",
      "Recent skull fracture",
    ],
    precautions: [
      "Protect patient from falls during testing",
      "Assess for central vestibular signs",
      "Avoid extreme neck extension",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2016). Vestibular Rehabilitation for Peripheral Vestibular Hypofunction.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-015",
    name: "Spinal Cord Injury Management",
    condition: "SCI",
    description:
      "Physical therapy interventions for spinal cord injury rehabilitation",
    recommendations: [
      "Early mobilization",
      "Functional electrical stimulation (FES)",
      "Locomotor training",
      "Upper extremity strengthening",
      "Patient/caregiver education",
    ],
    contraindications: [
      "Unstable fracture",
      "Autonomic dysreflexia (acute)",
      "Uncontrolled BP",
    ],
    precautions: [
      "Monitor for autonomic dysreflexia",
      "Skin integrity checks (pressure sores)",
      "Assess respiratory status",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2018). Spinal Cord Injury Rehabilitation Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-016",
    name: "Traumatic Brain Injury",
    condition: "TBI",
    description:
      "Management of cognitive and physical impairments following TBI",
    recommendations: [
      "Arousal and attention training",
      "Cognitive-functional therapy",
      "Balance and gait training",
      "Early task-specific mobilization",
    ],
    contraindications: [
      "Unstable intracranial pressure (ICP)",
      "Acute seizures",
      "Severe medical instability",
    ],
    precautions: [
      "Monitor neurobehavioral symptoms",
      "Adjust environment for sensory overload",
      "Continuous airway monitoring if severe",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2015). TBI Rehabilitation Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-017",
    name: "Concussion / mTBI",
    condition: "Concussion",
    description:
      "Physical therapy management of mild traumatic brain injury and concussion recovery",
    recommendations: [
      "Cervical management",
      "Vestibular-ocular training",
      "Gradual aerobic exercise (Buffalo Concussion Treadmill Test)",
      "Balance assessment",
    ],
    contraindications: [
      "Second impact syndrome risk",
      "Acute intracranial bleed",
    ],
    precautions: [
      "Symptom-limited activity",
      "Monitor return-to-play protocols",
      "Assess cognitive fatigue",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2020). Physical Therapy Evaluation and Treatment After Concussion.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-018",
    name: "ALS Management",
    condition: "ALS",
    description:
      "Palliative and functional physical therapy for Amyotrophic Lateral Sclerosis",
    recommendations: [
      "Low-impact aerobic exercise",
      "Range of motion maintenance",
      "Assistive device training",
      "Respiratory muscle training",
      "Patient/Family education",
    ],
    contraindications: [
      "High-intensity resistive exercise (potential for damage)",
      "Exercise to exhaustion",
    ],
    precautions: [
      "Monitor respiratory status",
      "Prevent overwork weakness",
      "Address high psychological burden",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2019). Physical Therapy for ALS Evidence-Based Review.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-019",
    name: "Guillain-Barré Syndrome Rehabilitation",
    condition: "GBS",
    description:
      "Rehabilitation throughout the acute, plateau, and recovery phases of GBS",
    recommendations: [
      "Gentle range of motion",
      "Energy conservation training",
      "Progressive mobility when medically stable",
      "Functional task training",
    ],
    contraindications: [
      "Vigorous exercise during acute phase",
      "Unstable autonomic nervous system",
    ],
    precautions: [
      "Monitor for overwork weakness",
      "Assess cardiovascular stability",
      "Protect joints during paralysis phase",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2015). GBS Rehabilitation Management in Physical Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-020",
    name: "Huntington's Disease",
    condition: "Huntington's Disease",
    description:
      "Physical therapy interventions for managing chorea and functional decline in HD",
    recommendations: [
      "Core stabilization",
      "Balance and falls prevention",
      "Functional mobility training",
      "Task modification",
      "Aerobic/Resistance training combination",
    ],
    contraindications: [
      "Extreme medical instability",
      "Severe cognitive deficit (limiting safety)",
    ],
    precautions: [
      "Monitor for choking/swallowing risks during exercise",
      "Assess fall risk",
      "Address involuntary movements",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2014). Physical Therapy in Huntington's Disease.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getPTNeurologicalGuidelineById(
  id: string,
): PTNeurologicalGuideline | undefined {
  try {
    if (!id || typeof id !== "string") return undefined;
    return guidelines.find((g) => g.id === id);
  } catch (error) {
    auditService.logError("GET_PT_NEURO_GL_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTNeurologicalGuidelines(): PTNeurologicalGuideline[] {
  try {
    return [...guidelines];
  } catch (error) {
    return [];
  }
}

export function searchPTNeurologicalGuidelines(
  query: string,
): PTNeurologicalGuideline[] {
  try {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return guidelines.filter(
      (g) =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.condition.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    return [];
  }
}

export function getPTNeurologicalGuidelineConditions(): string[] {
  try {
    return Array.from(new Set(guidelines.map((g) => g.condition))).sort();
  } catch (error) {
    return [];
  }
}
