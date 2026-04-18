/**
 * OT Interventions: Sensory & Motor Strategies
 *
 * Evidence-based sensory integration and neuromotor interventions.
 * Source: Ayres Sensory Integration, NDT, Constraint-Induced Movement Therapy (CIMT).
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

const sensoryMotorInterventions: OTIntervention[] = [
  {
    id: "ot-ism-001",
    name: "Ayres Sensory Integration (ASI)",
    category: "sensory",
    description:
      "Providing enhanced proprioceptive, vestibular, and tactile input to improve the CNS processing and adaptive responses.",
    indications: [
      "Sensory Processing Disorder (SPD)",
      "Autism Spectrum Disorder (ASD)",
      "Developmental Coordination Disorder (DCD)",
      "ADHD hyperactivity/inattention",
    ],
    contraindications: [
      "Recent ear infection/seizure history (for vestibular input)",
      "Brittle bone diseases (osteogenesis imperfecta) for intense proprioception",
    ],
    precautions: [
      "Sensory overload (monitor for autonomic signs like pallor, sweating, nausea)",
      "Gravitational insecurity (grade vestibular input carefully)",
    ],
    parameters: [
      "Child-directed/Play-based (not pre-scripted drills)",
      '"Just Right" challenge eliciting an adaptive response',
      "Tactile: Deep pressure over light touch, shaving cream, dry beans, brushing",
      "Vestibular: Linear (calming) vs Rotary (arousing) swinging",
      "Proprioception: Heavy work (pushing, pulling, weighted vests)",
    ],
    evidenceLevel: 1,
    source: "Ayres / AOTA",
    citation: "Ayres AJ. Sensory Integration and the Child.",
  },
  {
    id: "ot-ism-002",
    name: "Sensory Diet / Sensory Lifestyle",
    category: "sensory",
    description:
      "A customized schedule of sensory activities integrated into the child's/adult's daily routine to maintain optimal arousal.",
    indications: [
      "Autism Spectrum Disorder (ASD)",
      "ADHD",
      "Sensory modulation disorders",
      "Dementia (Snoezelen/multi-sensory rooms)",
    ],
    contraindications: [
      "Using heavy work/deep pressure forcefully against resistance of the child",
    ],
    precautions: [
      "Sensory habituation (rotate activities to prevent boredom/loss of effect)",
      "Not a substitute for true ASI therapy for foundational changes",
    ],
    parameters: [
      "Assess arousal state before, during, after activities",
      "Alerting: Crunchy foods, cool temperatures, fast movement, upbeat music",
      "Organizing: Chewing (gum/tubes), heavy work (carrying books), climbing",
      "Calming: Deep pressure (weighted blanket <10% body weight + 1lb), slow rocking, dim lights",
    ],
    evidenceLevel: 2,
    source: "Wilbarger / AOTA",
    citation:
      "Wilbarger P. Sensory Diet: A method of applying sensory integration.",
  },
  {
    id: "ot-ism-003",
    name: "Constraint-Induced Movement Therapy (mCIMT)",
    category: "motor",
    description:
      "Intense massed practice of the affected upper extremity while constraining the unaffected (less involved) extremity.",
    indications: [
      "Stroke (chronic/subacute) with some active wrist/finger extension",
      "Cerebral Palsy (Hemiplegia)",
      "TBI (asymmetric motor deficit)",
    ],
    contraindications: [
      "Complete flaccidity (no trace movement)",
      "Severe cognitive/aphasia preventing task understanding",
      "Bilateral severe involvement",
    ],
    precautions: [
      "Frustration/Fatigue due to high intensity",
      "Safety during ADLs while good arm is constrained (fall risk)",
      "Shoulder pain (impingement/subluxation) on affected side during forced use",
    ],
    parameters: [
      "Standard CIMT: Constraint 90% of waking hours, 6 hours therapy/day for 2 weeks",
      "Modified CIMT (mCIMT): Constraint ~5 hours/day, 3 sessions/week (more practical out-patient model)",
      '"Shaping": Breaking down complex tasks and reinforcing small improvements',
      "Requires baseline: 20° active wrist ext, 10° active finger ext",
    ],
    evidenceLevel: 1,
    source: "Taub / Wolf",
    citation:
      "Wolf SL, et al. Effect of constraint-induced movement therapy on upper extremity function 3 to 9 months after stroke: the EXCITE trial.",
  },
  {
    id: "ot-ism-004",
    name: "Neuro-Developmental Treatment (NDT / Bobath)",
    category: "motor",
    description:
      "Manual handling techniques to inhibit abnormal tone/reflexes and facilitate normal movement patterns.",
    indications: [
      "Cerebral Palsy (spasticity/ataxia/athetosis)",
      "Stroke (hemiplegia)",
      "TBI",
    ],
    contraindications: [
      "Acute orthopedic conditions precluding handling",
      "Unstable joints (if handling risks dislocation)",
    ],
    precautions: [
      "Must ensure carryover to functional tasks (not just improving tone on the mat)",
      "Requires frequent re-evaluation of therapist hand placement (key points of control)",
    ],
    parameters: [
      "Key Points of Control: Proximal (shoulder/pelvis) to influence distal; Distal (hands/feet) for advanced control",
      "Weight bearing/shifting over the affected limb",
      "Trunk elongation on the hemiplegic side",
      "Avoid associated reactions (e.g., stopping an activity if it causes severely increased spasticity)",
    ],
    evidenceLevel: 3,
    source: "Bobath / NDT",
    citation: "Bobath B. Adult Hemiplegia: Evaluation and Treatment.",
  },
  {
    id: "ot-ism-005",
    name: "Bilateral Arm Training (BATRAC)",
    category: "motor",
    description:
      "Repetitive, simultaneous movements of both arms, often involving rhythmic auditory cueing, designed to stimulate the uninjured hemisphere to assist the injured hemisphere.",
    indications: [
      "Stroke (especially when CIMT is not tolerated or patient lacks baseline movement)",
      "TBI",
      "Upper extremity coordination deficits",
    ],
    contraindications: [
      "Significant shoulder pain on affected side",
      "Severe orthopedic restrictions",
    ],
    precautions: [
      "Fatigue",
      'Ensuring the unaffected arm does not "take over" the entire movement',
    ],
    parameters: [
      "Symmetric or reciprocal movements (e.g., pushing dowels back and forth)",
      "Coupler devices often used to link the hands",
      "Usually performed for 15-20 min blocks, multiple days a week",
      "Focus is on intense repetition to drive neuroplasticity in descending pathways (e.g., reticulospinal tract)",
    ],
    evidenceLevel: 1,
    source: "Whitall",
    citation:
      "Whitall J, et al. Repetitive bilateral arm training with rhythmic auditory cueing improves motor function in chronic hemiparetic stroke.",
  },
];

export const getAllOTSensoryMotorInterventions = (): OTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "ot",
    metadata: {
      count: sensoryMotorInterventions.length,
      category: "sensory_motor",
    },
  });
  return sensoryMotorInterventions;
};

export const getOTSensoryMotorInterventionsByCategory = (
  category: string,
): OTIntervention[] => {
  return sensoryMotorInterventions.filter((i) => i.category === category);
};

export const getOTSensoryMotorInterventionById = (
  id: string,
): OTIntervention | undefined => {
  return sensoryMotorInterventions.find((i) => i.id === id);
};

export const searchOTSensoryMotorInterventions = (
  query: string,
): OTIntervention[] => {
  const q = query.toLowerCase();
  return sensoryMotorInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
