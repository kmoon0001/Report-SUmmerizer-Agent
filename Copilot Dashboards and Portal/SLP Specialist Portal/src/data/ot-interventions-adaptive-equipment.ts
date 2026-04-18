/**
 * OT Interventions: Adaptive Equipment & Assistive Technology
 *
 * Evidence-based adaptive AT interventions for occupational therapy practice.
 * Source: AOTA Guidelines, RESNA standards
 */

import { auditService } from "../core/audit/AuditService";

export interface OTIntervention {
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

const adaptiveEquipmentInterventions: OTIntervention[] = [
  {
    id: "ot-iae-001",
    name: "Dressing & Hygiene Adaptive Equipment Training",
    category: "adaptive-equipment",
    description:
      "Instructing clients in the use of long-handled tools and modified clothing to compensate for ROM or strength deficits.",
    indications: [
      "Post-THR (posterior approach precautions)",
      "Severe OA/RA in hands",
      "Spinal Cord Injury (C6-T1)",
      "Hemiparesis (dressing stick, one-handed techniques)",
    ],
    contraindications: [
      "Severe cognitive impairment making tool use unsafe",
      "Acute fracture where movement of limb is strictly prohibited",
    ],
    precautions: [
      "Ensure tools are correct length/weight",
      "Monitor for skin breakdown (e.g., shoe horn causing friction on heel)",
    ],
    parameters: [
      "Equipment: Reacher/Grabber, Sock Aid, Long-handled shoe horn, Dressing stick, Button hook",
      "Training Strategy: Demonstration -> Guided practice -> Independent practice (Backward chaining)",
      "Goal: Independent lower body dressing without violating surgical precautions",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Radomski MV, Trombly Latham CA. Occupational Therapy for Physical Dysfunction.",
  },
  {
    id: "ot-iae-002",
    name: "Feeding & Eating Assistive Devices",
    category: "adaptive-equipment",
    description:
      "Prescription and training in modified utensils, plates, and cups to facilitate independent oral intake.",
    indications: [
      "Parkinson's disease (weighted utensils)",
      "Cerebral Palsy/Ataxia",
      "C5-C6 SCI (Universal cuff)",
      "Stroke (Rocker knife)",
    ],
    contraindications: [
      "Severe dysphagia requires separate SLP/swallow clearance first",
      "Aspiration risk during self-feeding trials",
    ],
    precautions: [
      "Monitor fatigue during mealtime",
      "Ensure proper seating/positioning (90-90-90) before feeding",
    ],
    parameters: [
      "Assess motor deficit (Tremor vs Weakness vs Grip vs ROM)",
      "Match AT: Weighted (tremor), Built-up handles (weak grip), Universal cuff (no grip), Scoop dish (one-handed)",
      "Provide compensatory positioning to support the device use",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Pedretti LW, Early MB. Occupational Therapy: Practice Skills for Physical Dysfunction.",
  },
  {
    id: "ot-iae-003",
    name: "AAC (Augmentative and Alternative Communication) Integration",
    category: "assistive-technology",
    description:
      "OT role in mounting, accessing, and navigating communication devices (often co-treated with SLP).",
    indications: [
      "ALS",
      "Severe CP",
      "High cervical SCI (C4 and above)",
      "Locked-in syndrome / Brainstem stroke",
    ],
    contraindications: [
      "Should not be initiated without SLP language consultation",
    ],
    precautions: [
      "Mounting must not interfere with wheelchair driving/safety",
      "Monitor visual fatigue (eye-gaze systems)",
    ],
    parameters: [
      "Determine optimal access method: Direct selection (finger, head pointer, eye gaze) vs Indirect (switch scanning)",
      "Evaluate seating and positioning to maximize access without fatigue",
      "Train caregivers in mounting and positioning the device",
    ],
    evidenceLevel: 1,
    source: "RESNA",
    citation:
      "Cook AM, Polgar JM. Assistive Technologies: Principles and Practice.",
  },
  {
    id: "ot-iae-004",
    name: "Manual Wheelchair Prescription & Seating Systems",
    category: "assistive-technology",
    description:
      "Evaluation and prescription of customized wheeled mobility base and postural support systems.",
    indications: [
      "Non-ambulatory status",
      "Severe energy conservation needs",
      "Postural asymmetry requiring support",
      "Pressure injury risk",
    ],
    contraindications: [
      "Ambulatory patient where W/C will cause rapid deconditioning (if ambulation is realistic goal)",
    ],
    precautions: [
      "Skin integrity (requires high-end pressure relief cushion)",
      "Home accessibility (door widths, steps)",
    ],
    parameters: [
      "Measure seat width, depth, back height, footrest length",
      "Select frame: Ultra-lightweight vs Standard vs Tilt-in-space",
      "Select cushion: Foam, Gel, Air (e.g., Roho), or Hybrid",
      "Train in propulsion mechanics and pressure relief (weight shifts every 15-30 mins)",
    ],
    evidenceLevel: 1,
    source: "RESNA",
    citation: "RESNA Wheelchair Service Provision Guide.",
  },
  {
    id: "ot-iae-005",
    name: "Smart Home Environmental Control Units (ECUs)",
    category: "assistive-technology",
    description:
      "Use of voice, switch, or tablet-controlled environments to maximize independence in the home.",
    indications: [
      "High tetraplegia (C1-C4)",
      "Progressive neuromuscular disorders (ALS, MS)",
      "Severe mobility limitations",
    ],
    contraindications: [],
    precautions: [
      "Reliance on Wi-Fi/Power (must have manual backup plan for emergencies)",
      "Cognitive capacity to learn the system",
    ],
    parameters: [
      "Voice control (Alexa/Google Home) for lights, doors, thermostat, TV",
      "Integration with Sip-and-Puff or Bluetooth switches",
      "Requires thorough home assessment for compatibility",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Cook AM, Polgar JM. Assistive Technologies: Principles and Practice.",
  },
];

export const getAllOTAdaptiveEquipmentInterventions = (): OTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "ot",
    metadata: {
      count: adaptiveEquipmentInterventions.length,
      category: "adaptive_equipment",
    },
  });
  return adaptiveEquipmentInterventions;
};

export const getOTAdaptiveEquipmentInterventionsByCategory = (
  category: string,
): OTIntervention[] => {
  return adaptiveEquipmentInterventions.filter((i) => i.category === category);
};

export const getOTAdaptiveEquipmentInterventionById = (
  id: string,
): OTIntervention | undefined => {
  return adaptiveEquipmentInterventions.find((i) => i.id === id);
};

export const searchOTAdaptiveEquipmentInterventions = (
  query: string,
): OTIntervention[] => {
  const q = query.toLowerCase();
  return adaptiveEquipmentInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
