/**
 * OT Interventions & Treatment Protocols
 *
 * Evidence-based OT interventions based on AOTA standards
 * Requirements: 3.4, 3.5
 */

// EvidenceLevel is defined in ot-assessment types; used as a numeric literal (1|2|3) in this file
import type { OTIntervention } from "../types/ot-intervention";

// ============================================================================
// ADL Training Interventions
// ============================================================================

export const adlTrainingInterventions: OTIntervention[] = [
  {
    id: "ot-adl-dressing",
    name: "Dressing Training",
    domain: ["adl-training"],
    category: "adl-training",
    approach: "remedial",
    clientPopulation: ["adult"],
    description:
      "Skilled training in dressing techniques and adaptive strategies",
    indications: [
      "Limited upper extremity ROM",
      "Weakness affecting dressing",
      "Cognitive deficits affecting sequencing",
      "Coordination deficits",
      "Post-stroke recovery",
    ],
    contraindications: [
      "Severe cognitive impairment preventing learning",
      "Acute medical instability",
    ],
    cptCode: "97535",
    estimatedDuration: 30,

    frequency: "2-3 times per week",
    duration: "4-8 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased independence in dressing",
      "Improved use of adaptive equipment",
      "Increased confidence in ADL performance",
    ],
    precautions: [
      "Monitor for fatigue",
      "Ensure safety during transfers",
      "Watch for skin integrity issues",
    ],
    modifications: [
      "Use adaptive clothing",
      "Use dressing aids",
      "Modify sequencing for cognitive deficits",
      "Provide verbal cues as needed",
    ],
    evidenceLevel: 1,
    citation: "AOTA Practice Guidelines for ADL Training",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-adl-bathing",
    name: "Bathing & Grooming Training",
    domain: ["adl-training"],
    category: "adl-training",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Skilled training in bathing and grooming techniques",
    indications: [
      "Limited mobility affecting bathing",
      "Balance deficits",
      "Cognitive deficits affecting sequencing",
      "Safety concerns",
    ],
    contraindications: [
      "Acute skin conditions",
      "Severe balance deficits without support",
    ],
    cptCode: "97535",
    estimatedDuration: 30,

    frequency: "2-3 times per week",
    duration: "4-6 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased independence in bathing",
      "Improved safety awareness",
      "Increased confidence in self-care",
    ],
    precautions: [
      "Ensure bathroom safety",
      "Monitor for falls",
      "Watch for water temperature safety",
    ],
    modifications: [
      "Use grab bars",
      "Use shower chair",
      "Use long-handled sponge",
      "Modify water temperature",
    ],
    evidenceLevel: 1,
    citation: "AOTA Practice Guidelines for ADL Training",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-adl-feeding",
    name: "Feeding & Eating Training",
    domain: ["adl-training"],
    category: "adl-training",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Skilled training in feeding and eating techniques",
    indications: [
      "Upper extremity weakness",
      "Coordination deficits",
      "Cognitive deficits",
      "Swallowing difficulties",
    ],
    contraindications: [
      "Severe dysphagia without medical clearance",
      "Acute aspiration risk",
    ],
    cptCode: "97535",
    estimatedDuration: 15,

    frequency: "2-3 times per week",
    duration: "4-8 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased independence in feeding",
      "Improved nutritional intake",
      "Increased confidence in eating",
    ],
    precautions: [
      "Monitor for aspiration",
      "Ensure proper positioning",
      "Watch for fatigue",
    ],
    modifications: [
      "Use adaptive utensils",
      "Use plate guards",
      "Modify food consistency",
      "Provide verbal cues",
    ],
    evidenceLevel: 1,
    citation: "AOTA Practice Guidelines for ADL Training",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// Hand Therapy Interventions
// ============================================================================

export const handTherapyInterventions: OTIntervention[] = [
  {
    id: "ot-hand-rom",
    name: "Hand Range of Motion Exercises",
    domain: ["hand-therapy"],
    category: "therapeutic-exercise",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Therapeutic exercises to improve hand ROM and flexibility",
    indications: [
      "Limited hand ROM",
      "Post-surgical hand rehabilitation",
      "Arthritis affecting hand",
      "Contracture prevention",
    ],
    contraindications: [
      "Acute inflammation",
      "Recent fracture without medical clearance",
    ],
    cptCode: "97110",
    estimatedDuration: 30,

    frequency: "3-4 times per week",
    duration: "6-12 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased hand ROM",
      "Improved hand function",
      "Reduced pain with movement",
    ],
    precautions: [
      "Monitor for increased swelling",
      "Avoid overstretching",
      "Watch for pain response",
    ],
    modifications: [
      "Use heat before exercises",
      "Provide manual assistance",
      "Use adaptive equipment",
      "Modify exercise intensity",
    ],
    evidenceLevel: 1,
    citation: "AOTA Hand Therapy Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-hand-strength",
    name: "Hand Strengthening Program",
    domain: ["hand-therapy"],
    category: "therapeutic-exercise",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Progressive strengthening exercises for hand muscles",
    indications: [
      "Hand weakness",
      "Post-surgical rehabilitation",
      "Nerve injury recovery",
      "Functional capacity improvement",
    ],
    contraindications: ["Acute inflammation", "Severe pain with movement"],
    cptCode: "97110",
    estimatedDuration: 30,

    frequency: "3-4 times per week",
    duration: "8-12 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased grip strength",
      "Improved pinch strength",
      "Improved hand function",
    ],
    precautions: [
      "Progress gradually",
      "Monitor for overuse",
      "Watch for pain response",
    ],
    modifications: [
      "Use therapy putty",
      "Use resistance bands",
      "Use hand strengthener",
      "Modify resistance level",
    ],
    evidenceLevel: 1,
    citation: "AOTA Hand Therapy Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-hand-dexterity",
    name: "Hand Dexterity Training",
    domain: ["hand-therapy"],
    category: "therapeutic-exercise",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Training to improve fine motor coordination and dexterity",
    indications: [
      "Coordination deficits",
      "Fine motor deficits",
      "Post-stroke recovery",
      "Neurological conditions",
    ],
    contraindications: ["Severe cognitive impairment", "Severe tremor"],
    cptCode: "97110",
    estimatedDuration: 30,

    frequency: "2-3 times per week",
    duration: "6-10 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Improved hand coordination",
      "Improved fine motor skills",
      "Improved functional hand use",
    ],
    precautions: [
      "Monitor for fatigue",
      "Ensure proper positioning",
      "Watch for frustration",
    ],
    modifications: [
      "Use adaptive equipment",
      "Modify task complexity",
      "Provide verbal cues",
      "Use bilateral training",
    ],
    evidenceLevel: 1,
    citation: "AOTA Hand Therapy Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// Cognitive Rehabilitation Interventions
// ============================================================================

export const cognitiveRehabInterventions: OTIntervention[] = [
  {
    id: "ot-cognitive-memory",
    name: "Memory Training & Compensation",
    domain: ["cognitive-rehab"],
    category: "cognitive-training",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Training in memory strategies and compensatory techniques",
    indications: [
      "Memory deficits",
      "Cognitive impairment",
      "Post-stroke recovery",
      "Dementia",
    ],
    contraindications: ["Severe cognitive impairment preventing learning"],
    cptCode: "97129",
    estimatedDuration: 30,

    frequency: "2-3 times per week",
    duration: "8-12 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Improved memory function",
      "Increased use of compensatory strategies",
      "Improved functional independence",
    ],
    precautions: [
      "Monitor for frustration",
      "Ensure realistic expectations",
      "Watch for fatigue",
    ],
    modifications: [
      "Use external memory aids",
      "Use written instructions",
      "Provide repetition",
      "Use errorless learning",
    ],
    evidenceLevel: 1,
    citation: "AOTA Cognitive Rehabilitation Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-cognitive-executive",
    name: "Executive Function Training",
    domain: ["cognitive-rehab"],
    category: "cognitive-training",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Training in planning, organization, and problem-solving",
    indications: [
      "Executive function deficits",
      "Planning difficulties",
      "Organization problems",
      "Problem-solving deficits",
    ],
    contraindications: ["Severe cognitive impairment"],
    cptCode: "97129",
    estimatedDuration: 30,

    frequency: "2-3 times per week",
    duration: "8-12 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Improved planning skills",
      "Improved organization",
      "Improved problem-solving",
    ],
    precautions: [
      "Use structured approach",
      "Provide external supports",
      "Monitor for overwhelm",
    ],
    modifications: [
      "Use checklists",
      "Use visual schedules",
      "Break tasks into steps",
      "Provide external cues",
    ],
    evidenceLevel: 1,
    citation: "AOTA Cognitive Rehabilitation Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// Work Conditioning Interventions
// ============================================================================

export const workConditioningInterventions: OTIntervention[] = [
  {
    id: "ot-work-capacity",
    name: "Work Capacity Building",
    domain: ["work-conditioning"],
    category: "work-conditioning",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Progressive training to build work capacity and endurance",
    indications: [
      "Reduced work capacity",
      "Deconditioning",
      "Return to work planning",
      "Chronic pain management",
    ],
    contraindications: ["Acute medical conditions", "Severe pain"],
    cptCode: "97110",
    estimatedDuration: 45,

    frequency: "3-4 times per week",
    duration: "4-8 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Increased work capacity",
      "Improved endurance",
      "Successful return to work",
    ],
    precautions: [
      "Monitor vital signs",
      "Progress gradually",
      "Watch for pain response",
    ],
    modifications: [
      "Simulate job tasks",
      "Modify intensity",
      "Provide breaks",
      "Use pacing strategies",
    ],
    evidenceLevel: 1,
    citation: "AOTA Work Conditioning Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "ot-ergonomics",
    name: "Ergonomic Training & Modification",
    domain: ["work-conditioning"],
    category: "work-conditioning",
    approach: "remedial",
    clientPopulation: ["adult"],
    description: "Training in ergonomic principles and workplace modifications",
    indications: [
      "Work-related injuries",
      "Repetitive strain injuries",
      "Postural problems",
      "Prevention of injury",
    ],
    contraindications: [],
    cptCode: "97535",
    estimatedDuration: 30,

    frequency: "1-2 times per week",
    duration: "2-4 weeks",
    materials: [],
    instructions: "",
    progressionCriteria: [],
    expectedOutcomes: [
      "Improved ergonomic awareness",
      "Reduced pain",
      "Improved work performance",
    ],
    precautions: [
      "Ensure proper implementation",
      "Monitor for compliance",
      "Assess effectiveness",
    ],
    modifications: [
      "Modify workstation",
      "Provide equipment",
      "Teach proper body mechanics",
      "Provide written instructions",
    ],
    evidenceLevel: 1,
    citation: "AOTA Ergonomics Guidelines",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// Intervention Lookup Functions
// ============================================================================

export function getIntervention(
  interventionId: string,
): OTIntervention | undefined {
  const allInterventions = [
    ...adlTrainingInterventions,
    ...handTherapyInterventions,
    ...cognitiveRehabInterventions,
    ...workConditioningInterventions,
  ];
  return allInterventions.find(
    (intervention) => intervention.id === interventionId,
  );
}

export function getInterventionsByDomain(domain: string): OTIntervention[] {
  const allInterventions = [
    ...adlTrainingInterventions,
    ...handTherapyInterventions,
    ...cognitiveRehabInterventions,
    ...workConditioningInterventions,
  ];
  return allInterventions.filter((intervention) =>
    intervention.domain.includes(domain as any),
  );
}

export function getInterventionsByCPTCode(cptCode: string): OTIntervention[] {
  const allInterventions = [
    ...adlTrainingInterventions,
    ...handTherapyInterventions,
    ...cognitiveRehabInterventions,
    ...workConditioningInterventions,
  ];
  return allInterventions.filter(
    (intervention) => intervention.cptCode === cptCode,
  );
}
