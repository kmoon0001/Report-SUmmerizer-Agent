/**
 * PT Interventions: Manual Therapy Techniques
 *
 * Evidence-based manual therapy techniques for physical therapy practice.
 * Source: APTA, Maitland, Kaltenborn, Paris, Mulligan paradigms
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

const manualTherapyInterventions: PTIntervention[] = [
  {
    id: "pt-imt-001",
    name: "Joint Mobilization (Maitland Grades I-IV)",
    category: "manual-therapy",
    description:
      "Passive oscillations applied to a joint to reduce pain or increase mobility.",
    indications: [
      "Joint stiffness",
      "Capsular patterns of restriction",
      "Mechanical neck/back pain",
      "Osteoarthritis (mild/moderate)",
    ],
    contraindications: [
      "Hypermobility/Instability",
      "Joint effusion (Grades III-IV)",
      "Bone disease (osteoporosis, cancer)",
      "Unhealed fracture",
    ],
    precautions: [
      "Pregnancy (relaxin effect)",
      "Systemic connective tissue diseases",
      "Coagulation disorders",
    ],
    parameters: [
      "Grade I: Small amplitude at beginning of range (Pain relief)",
      "Grade II: Large amplitude within range (Pain relief)",
      "Grade III: Large amplitude up to limit of range (Mobility)",
      "Grade IV: Small amplitude at limit of range (Mobility)",
    ],
    evidenceLevel: 1,
    source: "Maitland Concept",
    citation:
      "Maitland GD, Hengeveld E, Banks K, English K. Maitland's Vertebral Manipulation. 8th ed.",
  },
  {
    id: "pt-imt-002",
    name: "High-Velocity Low-Amplitude (HVLA) Thrust Manipulation (Grade V)",
    category: "manual-therapy",
    description:
      "A rapid, short-distance movement applied to a joint at or near its anatomical limit to improve mobility and reduce pain.",
    indications: [
      "Acute mechanical back/neck pain",
      "Non-radicular spinal pain",
      "Restriction of joint play",
    ],
    contraindications: [
      "Osteoporosis",
      "Cervical arterial dysfunction (for cervical thrust)",
      "Instability",
      "Fracture",
      "Anticoagulant therapy",
    ],
    precautions: [
      "Anxiety",
      "First-time manipulation",
      "History of adverse reaction to manipulation",
    ],
    parameters: [
      "Position patient at end-range of specific motion",
      "Apply quick, short amplitude thrust",
      "Do not push past anatomical limits",
    ],
    evidenceLevel: 1,
    source: "APTA CPG",
    citation: "Delitto A, et al. Low Back Pain Clinical Practice Guidelines.",
  },
  {
    id: "pt-imt-003",
    name: "Mobilization with Movement (MWM) / Mulligan Concept",
    category: "manual-therapy",
    description:
      "Application of a sustained accessory glide during active physiological movement.",
    indications: [
      "Painful arc of motion",
      "Joint stiffness with movement",
      "Positional faults",
      "Lateral epicondylalgia",
    ],
    contraindications: [
      "PILL response is absent (Pain-free, Instant result, Long-Lasting)",
      "Severe instability",
      "Acute inflammation",
    ],
    precautions: [
      "Ensure glide is maintained throughout range",
      "Overpressure should only be applied if pain-free",
    ],
    parameters: [
      "Identify pain-provoking movement",
      "Apply sustained passive accessory glide",
      "Patient actively performs movement (must be pain-free)",
      "Perform 3 sets of 10 repetitions",
    ],
    evidenceLevel: 1,
    source: "Mulligan Concept",
    citation: "Mulligan BR. Manual Therapy: NAGS, SNAGS, MWMS etc. 6th ed.",
  },
  {
    id: "pt-imt-004",
    name: "Myofascial Release (MFR)",
    category: "soft-tissue",
    description:
      "Sustained, low-load pressure applied to the fascial system to restore length and compliance.",
    indications: [
      "Fascial restriction",
      "Postural asymmetry",
      "Chronic pain syndromes",
      "Scar tissue adhesions",
    ],
    contraindications: [
      "Cellulitis",
      "Acute systemic infection",
      "Malignancy in area",
      "Open wounds",
    ],
    precautions: [
      "Fragile skin",
      "Hypersensitivity",
      "Fibromyalgia (adjust pressure)",
    ],
    parameters: [
      "Assess for tissue barrier",
      "Apply gentle, sustained pressure (3-5 minutes)",
      'Wait for tissue softening or "release"',
      "Follow directional pull into new barrier",
    ],
    evidenceLevel: 2,
    source: "Barnes Method",
    citation: "Barnes JF. Myofascial Release: The Search for Excellence.",
  },
  {
    id: "pt-imt-005",
    name: "Instrument Assisted Soft Tissue Mobilization (IASTM)",
    category: "soft-tissue",
    description:
      "Use of specialized ergonomic instruments to detect and treat fascial restrictions and soft tissue fibrosis.",
    indications: [
      "Tendinopathy (e.g., Achilles, Patellar)",
      "Plantar fasciitis",
      "Ligament sprains",
      "Muscle strains (subacute)",
    ],
    contraindications: [
      "Compromised tissue integrity",
      "Active implants (pacemaker, if near)",
      "Thrombophlebitis",
      "Cancer region",
    ],
    precautions: [
      "Avoid excessive bruising (petechiae)",
      "Anticoagulant medication",
      "Varicose veins",
    ],
    parameters: [
      "Apply emollient",
      "Use instrument at 30-60 degree angle",
      "Stroke in multiple directions for 30-60 seconds per lesion",
      "Follow up with stretching/loading",
    ],
    evidenceLevel: 2,
    source: "Graston Technique",
    citation:
      "Cheatham SW, et al. The efficacy of instrument assisted soft tissue mobilization: a systematic review.",
  },
];

export const getAllPTManualTherapyInterventions = (): PTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "pt",
    metadata: {
      count: manualTherapyInterventions.length,
      category: "manual_therapy",
    },
  });
  return manualTherapyInterventions;
};

export const getPTManualTherapyInterventionsByCategory = (
  category: string,
): PTIntervention[] => {
  return manualTherapyInterventions.filter((i) => i.category === category);
};

export const getPTManualTherapyInterventionById = (
  id: string,
): PTIntervention | undefined => {
  return manualTherapyInterventions.find((i) => i.id === id);
};

export const searchPTManualTherapyInterventions = (
  query: string,
): PTIntervention[] => {
  const q = query.toLowerCase();
  return manualTherapyInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
