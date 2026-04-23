/**
 * PT Interventions: Modalities and Physical Agents
 *
 * Evidence-based physical agents and electrotherapy parameters for physical therapy practice.
 * Source: APTA, Cameron Physical Agents guidelines
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

const modalityInterventions: PTIntervention[] = [
  {
    id: "pt-im-001",
    name: "Transcutaneous Electrical Nerve Stimulation (TENS) - Conventional",
    category: "electrotherapy",
    description:
      "High-rate sensory level electrical stimulation for acute and chronic pain management via Gate Control Theory.",
    indications: [
      "Acute post-operative pain",
      "Chronic musculoskeletal pain",
      "Neuropathic pain",
      "Labor pain",
    ],
    contraindications: [
      "Over pacemaker/ICD",
      "Over anterior neck (carotid sinus)",
      "Over pregnant abdomen/low back",
      "Epilepsy (head/neck)",
    ],
    precautions: [
      "Impaired sensation",
      "Impaired cognition",
      "Skin irritation at electrode site",
    ],
    parameters: [
      "Frequency: High (80-110 pps/Hz)",
      "Pulse Duration: Short (50-100 µsec)",
      "Intensity: Strong but comfortable sensory tingling (no motor contraction)",
      "Duration: 20-30 mins, up to 24hrs as needed for pain",
    ],
    evidenceLevel: 1,
    source: "Cameron, MH",
    citation:
      "Cameron MH. Physical Agents in Rehabilitation: From Research to Practice. 5th ed.",
  },
  {
    id: "pt-im-002",
    name: "Transcutaneous Electrical Nerve Stimulation (TENS) - Acupuncture/Low-Rate",
    category: "electrotherapy",
    description:
      "Low-rate motor level electrical stimulation for chronic pain management via endogenous opioid release (Endorphins).",
    indications: [
      "Chronic pain",
      "Deep throbbing pain",
      "When conventional TENS is ineffective",
    ],
    contraindications: [
      "Over pacemaker/ICD",
      "Over carotid sinus",
      "Pregnancy (abdomen)",
      "Undiagnosed pain",
    ],
    precautions: [
      "Impaired mentation",
      "Do not use when muscle contraction is contraindicated (acute tears)",
      "May cause DOMS",
    ],
    parameters: [
      "Frequency: Low (1-5 pps/Hz)",
      "Pulse Duration: Long (150-300 µsec)",
      "Intensity: Visible muscle twitch/contraction",
      "Duration: 20-30 mins max (effects last 4-5 hours)",
    ],
    evidenceLevel: 1,
    source: "APTA Electrotherapy",
    citation:
      "Sluka KA. Mechanisms and management of pain for the physical therapist.",
  },
  {
    id: "pt-im-003",
    name: "Neuromuscular Electrical Stimulation (NMES / Russian)",
    category: "electrotherapy",
    description:
      "Electrical stimulation intended to elicit a tetanic muscle contraction to prevent atrophy and re-educate muscle.",
    indications: [
      "Post-surgical muscle inhibition (e.g., Quad post-ACL)",
      "Muscle weakness",
      "Disuse atrophy",
      "Spasticity management (antagonist)",
    ],
    contraindications: [
      "Pacemaker",
      "Over heart/carotid sinus",
      "Active DVT/thrombophlebitis",
      "Where muscle contraction disrupts healing",
    ],
    precautions: [
      "Cardiac disease",
      "Impaired sensation",
      "Malignant tumors (unless palliative)",
    ],
    parameters: [
      "Frequency: 35-50 pps (bursts for Russian)",
      "Pulse Duration: 150-200 µsec (small muscle), 200-350 µsec (large muscle)",
      "On/Off Time: 1:5 ratio (e.g., 10s on, 50s off) to prevent fatigue",
      "Intensity: Maximum tolerated contraction (goal >50% MVIC)",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "Snyder-Mackler L, et al. Strength of the quadriceps femoris muscle and functional recovery after reconstruction of the ACL.",
  },
  {
    id: "pt-im-004",
    name: "Therapeutic Ultrasound (Continuous / Thermal)",
    category: "deep-heating",
    description:
      "Delivery of high-frequency sound waves to generate deep tissue heating (up to 5cm) to increase extensibility and blood flow.",
    indications: [
      "Joint contractures",
      "Scar tissue",
      "Chronic tendinopathy",
      "Pain and muscle spasm (subacute/chronic)",
    ],
    contraindications: [
      "Over malignant tumor",
      "Pregnancy (abdomen/low back)",
      "CNS tissue (spinal cord post-laminectomy)",
      "Joint cement/plastics",
      "Thrombophlebitis",
      "Eyes/Reproductive organs",
    ],
    precautions: [
      "Acute inflammation (do not use continuous)",
      "Epiphyseal plates (growing children)",
      "Fractures",
      "Breast implants",
    ],
    parameters: [
      "Frequency: 1 MHz (deep, 3-5cm) or 3 MHz (superficial, 1-2cm)",
      "Duty Cycle: 100% (Continuous)",
      "Intensity: 1.0-2.0 W/cm² (1 MHz) or 0.5-1.0 W/cm² (3 MHz)",
      "Duration: 5-10 minutes per treatment area (2x ERA)",
    ],
    evidenceLevel: 2,
    source: "Cameron, MH",
    citation: "Cameron MH. Physical Agents in Rehabilitation.",
  },
  {
    id: "pt-im-005",
    name: "Cryotherapy (Cold Pack / Ice Massage)",
    category: "superficial-cooling",
    description:
      "Application of cold to reduce tissue temperature, decreasing inflammation, pain, and metabolic rate.",
    indications: [
      "Acute inflammation",
      "Acute pain",
      "Edema",
      "Muscle spasm",
      "Spasticity (prolonged cooling)",
    ],
    contraindications: [
      "Cold hypersensitivity (urticaria)",
      "Cold intolerance",
      "Cryoglobulinemia",
      "Paroxysmal cold hemoglobinuria",
      "Raynaud's disease",
      "Over regenerating peripheral nerve",
      "Over vascular compromise",
    ],
    precautions: [
      "Over superficial main branch of nerve",
      "Over open wound",
      "Hypertension",
      "Poor sensation/cognition",
    ],
    parameters: [
      "Method: Ice pack, gel pack, ice massage, or cold compression",
      "Target Temperature: 10-15°C for analgesia",
      "Normal Sensation Stages: Intense cold -> Burning -> Aching -> Analgesia (Numbness) [CBAN]",
      "Duration: 10-20 minutes (until numb); 5-10 mins for ice massage",
    ],
    evidenceLevel: 1,
    source: "Bleakley et al.",
    citation:
      "Bleakley C, et al. The use of ice in the treatment of acute soft-tissue injury: a systematic review.",
  },
];

export const getAllPTModalityInterventions = (): PTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "pt",
    metadata: { count: modalityInterventions.length, category: "modalities" },
  });
  return modalityInterventions;
};

export const getPTModalityInterventionsByCategory = (
  category: string,
): PTIntervention[] => {
  return modalityInterventions.filter((i) => i.category === category);
};

export const getPTModalityInterventionById = (
  id: string,
): PTIntervention | undefined => {
  return modalityInterventions.find((i) => i.id === id);
};

export const searchPTModalityInterventions = (
  query: string,
): PTIntervention[] => {
  const q = query.toLowerCase();
  return modalityInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
