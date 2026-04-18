/**
 * PT Interventions: Stretching & Functional Training
 *
 * Evidence-based stretching and neuromuscular re-education protocols.
 * Source: Kisner & Colby, PNF techniques, JOSPT functional testing
 */

import { auditService } from "../core/audit/AuditService";

export interface PTIntervention {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  parameters: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
}

const stretchingInterventions: PTIntervention[] = [
  {
    id: "pt-isf-001",
    name: "Static Stretching (Prolonged Hold)",
    category: "stretching-flexibility",
    description:
      "Slow, sustained muscle lengthening to move the muscle-tendon unit past tissue resistance and alter viscoelasticity.",
    indications: [
      "Loss of soft tissue extensibility (contracture)",
      "Postural deviations (e.g., upper crossed syndrome)",
      "Post-workout recovery",
    ],
    contraindications: [
      "Bony block limiting motion",
      "Acute, sharp pain with motion",
      "Acute inflammation/hematoma",
      "Hypermobility",
      "When shortened tissues provide necessary stability (e.g., tenodesis grip)",
    ],
    precautions: [
      "Do not passively force a joint beyond normal ROM",
      "Osteoporosis",
      "Newly united fractures",
      "Edematous tissue",
    ],
    parameters: [
      "Intensity: Gentle, comfortable stretch (no sharp pain)",
      "Duration: 30 seconds to 60 seconds hold",
      "Frequency: 2-3x/week up to daily, 2-4 repetitions per session",
      "Environment: Tissue should be warm prior to stretching (active warm-up/modality)",
    ],
    evidenceLevel: 1,
    source: "ACSM / Kisner",
    citation:
      "Kisner C, Colby LA. Therapeutic Exercise: Foundations and Techniques. 7th ed.",
  },
  {
    id: "pt-isf-002",
    name: "Proprioceptive Neuromuscular Facilitation (PNF) - Hold-Relax / Contract-Relax",
    category: "stretching-flexibility",
    description:
      "Active muscle inhibition techniques using autogenic or reciprocal inhibition to increase muscle length and ROM.",
    indications: [
      "Muscle spasm limiting motion",
      "Tightness where patient struggles to relax passively",
      "Chronic restricted ROM",
    ],
    contraindications: [
      "Acute muscle tear",
      "Unhealed fracture",
      "Severe pain with isometric contraction",
      "Hypertension/cardiovascular risks (due to Valsalva during isometric hold)",
    ],
    precautions: [
      "Patient must be able to follow multi-step verbal commands",
      "Sub-maximal contractions are often better than maximal to avoid pain/guarding",
    ],
    parameters: [
      "Take limb actively/passively to end ROM",
      "Hold-Relax (Autogenic): Isometrically contract tight muscle against resistance for 5-10s",
      "Contract-Relax (Reciprocal): Isotonically/isometrically contract antagonist for 5-10s",
      "Relax, then passively/actively move limb into directly gained new ROM, hold 15-30s",
      "Repeat 3-5 times",
    ],
    evidenceLevel: 2,
    source: "Knot & Voss (PNF)",
    citation:
      "Adler SS, Beckers D, Buck M. PNF in Practice: An Illustrated Guide. 3rd ed.",
  },
  {
    id: "pt-isf-003",
    name: "Dynamic Stretching (Active Range of Motion)",
    category: "stretching-flexibility",
    description:
      "Controlled movement through the active range of motion for a joint. Typically used as sports/activity warm-up.",
    indications: [
      "Pre-activity warm-up",
      "Agility preparation",
      "Neuromuscular facilitation before power tasks",
      "Restoring normal kinematics (e.g., walking lunges)",
    ],
    contraindications: [
      "Acute tear or fracture",
      "Bony block",
      "Post-operative tissue healing unapproved for active muscle contraction",
    ],
    precautions: [
      "Must maintain control; avoid ballistic/bouncing movements unless end-stage sport specific",
      "Cardiovascular compromised patients (HR rises quickly)",
    ],
    parameters: [
      "Intensity: Moderate, within comfortable limits",
      "Duration/Reps: 10-15 controlled repetitions",
      "Velocity: Slow to moderate, progressing to sport-specific speeds if applicable",
      "No sustained hold at the end of range",
    ],
    evidenceLevel: 1,
    source: "NSCA",
    citation:
      "Behm DG, et al. Acute effects of muscle stretching on physical performance, range of motion, and injury incidence in healthy active individuals: a systematic review.",
  },
  {
    id: "pt-isf-004",
    name: "Task-Specific Functional Training",
    category: "functional-training",
    description:
      "Rehabilitation that focuses on the repetition of goal-directed, functionally relevant movements to induce neuroplasticity.",
    indications: [
      "Stroke rehabilitation (CIMT)",
      "Gait deviations",
      "Transfer training",
      "Total joint replacement (sit-to-stand training)",
    ],
    contraindications: [
      "Severe cognitive deficit precluding learning",
      "Medical instability during exertion",
    ],
    precautions: [
      "Fatigue leads to compensatory/abnormal movement patterns; stop before fatigue sets in fully",
      "Fall risk during upright tasks",
    ],
    parameters: [
      "Must involve real-world objects and goals (e.g., reaching for a cup vs an empty cone)",
      "High repetition (hundreds to thousands) is required for neuroplastic changes",
      "Part-to-Whole Practice: break down complex tasks (e.g., stance phase vs swing phase of gait), then combine",
      "Provide extrinsic feedback (KP/KR) early, fading to intrinsic feedback later",
    ],
    evidenceLevel: 1,
    source: "Motor Learning Theory",
    citation:
      "Schmidt R, Lee T. Motor Control and Learning: A Behavioral Emphasis. 5th ed.",
  },
  {
    id: "pt-isf-005",
    name: "Neuromuscular Re-education (Postural/Core Control)",
    category: "functional-training",
    description:
      "Interventions designed to improve balance, coordination, kinesthetic sense, posture, and motor control.",
    indications: [
      "Spinal instability (core weakness)",
      "LBP with movement coordination impairments",
      "Postural deviations (Scheuermann's, Hyperkyphosis)",
      "Peripheral neuropathy (somatosensory retraining)",
    ],
    contraindications: [
      "Acute spinal fractures",
      "Unstable neurological condition",
    ],
    precautions: [
      "Breathing (avoid Valsalva during core bracing)",
      "Ensure quality over quantity; incorrect muscle recruitment pattern defeats the purpose",
    ],
    parameters: [
      "Focus on timing and recruitment (e.g., Transversus Abdominis before gross movers)",
      "Use external cues (tactile, visual mirrors, biofeedback units)",
      "Progression: Supine -> Quadruped -> Kneeling -> Standing -> Dynamic Activities",
      "Hold positions for endurance (10-30s) rather than max strength",
    ],
    evidenceLevel: 1,
    source: "APTA / JOSPT",
    citation:
      "Delitto A, et al. Low Back Pain Clinical Practice Guidelines Linked to the ICF.",
  },
];

export const getAllPTStretchingFunctionalInterventions =
  (): PTIntervention[] => {
    auditService.log({
      action: "read",
      resourceType: "interventions",
      discipline: "pt",
      metadata: {
        count: stretchingInterventions.length,
        category: "stretching_functional",
      },
    });
    return stretchingInterventions;
  };

export const getPTStretchingFunctionalInterventionByCategory = (
  category: string,
): PTIntervention[] => {
  return stretchingInterventions.filter((i) => i.category === category);
};

export const getPTStretchingFunctionalInterventionById = (
  id: string,
): PTIntervention | undefined => {
  return stretchingInterventions.find((i) => i.id === id);
};

export const searchPTStretchingFunctionalInterventions = (
  query: string,
): PTIntervention[] => {
  const q = query.toLowerCase();
  return stretchingInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
