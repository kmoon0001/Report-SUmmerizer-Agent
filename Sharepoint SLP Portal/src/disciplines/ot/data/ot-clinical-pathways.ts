/**
 * OT Clinical Pathways Data
 *
 * Defines clinical pathways for each OT hub based on AOTA standards
 * Requirements: 3.7, 3.8, 3.9
 */

import type { OTDomain } from "../types/ot-assessment";

// ============================================================================
// Clinical Pathway Types
// ============================================================================

export interface ClinicalPathwayStep {
  order: number;
  phase: string;
  description: string;
  duration: string;
  assessments: string[];
  interventions: string[];
  goals: string[];
  progressCriteria: string[];
  nextStep: string;
}

export interface ClinicalPathway {
  id: string;
  name: string;
  domain: OTDomain;
  description: string;
  applicableDiagnoses: string[];
  duration: string;
  steps: ClinicalPathwayStep[];
  expectedOutcomes: string[];
  dischargeCriteria: string[];
  references: string[];
}

// ============================================================================
// Hand Therapy & Upper Extremity Pathway
// ============================================================================

export const HAND_THERAPY_PATHWAY: ClinicalPathway = {
  id: "pathway-hand-001",
  name: "Hand Therapy & Upper Extremity Rehabilitation",
  domain: "hand-therapy",
  description:
    "Clinical pathway for hand function and upper extremity rehabilitation",
  applicableDiagnoses: [
    "Carpal tunnel syndrome",
    "Arthritis",
    "Fractures",
    "Tendon injuries",
    "Nerve injuries",
    "Stroke (upper extremity)",
  ],
  duration: "4-12 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive hand and upper extremity assessment",
      duration: "1 session",
      assessments: [
        "Occupational Profile",
        "Hand function assessment",
        "Grip/pinch strength",
        "ROM assessment",
        "Sensory testing",
        "Dexterity tests",
      ],
      interventions: [],
      goals: ["Establish baseline function", "Identify functional limitations"],
      progressCriteria: ["Assessment complete", "Goals established"],
      nextStep: "Phase 1: Early Mobilization",
    },
    {
      order: 2,
      phase: "Early Mobilization",
      description: "Gentle ROM and edema management",
      duration: "2-3 weeks",
      assessments: ["ROM measurements", "Edema assessment", "Pain assessment"],
      interventions: [
        "Gentle ROM exercises",
        "Edema management",
        "Splinting/orthotics",
        "Pain management",
      ],
      goals: [
        "Reduce edema",
        "Maintain ROM",
        "Manage pain",
        "Prevent stiffness",
      ],
      progressCriteria: [
        "Edema reduced by 50%",
        "ROM maintained or improved",
        "Pain controlled",
      ],
      nextStep: "Phase 2: Progressive Strengthening",
    },
    {
      order: 3,
      phase: "Progressive Strengthening",
      description: "Gradual strengthening and functional training",
      duration: "4-6 weeks",
      assessments: [
        "Grip/pinch strength",
        "Dexterity tests",
        "Functional capacity",
      ],
      interventions: [
        "Therapeutic exercise",
        "Resistance training",
        "Dexterity training",
        "Functional activities",
      ],
      goals: [
        "Improve grip strength",
        "Improve dexterity",
        "Improve functional capacity",
        "Return to ADLs",
      ],
      progressCriteria: [
        "Grip strength improved 25%",
        "Dexterity improved",
        "Functional activities improved",
      ],
      nextStep: "Phase 3: Functional Training",
    },
    {
      order: 4,
      phase: "Functional Training",
      description: "Return to work and leisure activities",
      duration: "2-4 weeks",
      assessments: ["Functional capacity evaluation", "Work simulation"],
      interventions: [
        "Work conditioning",
        "Job-specific training",
        "Leisure activities",
        "ADL training",
      ],
      goals: [
        "Return to work",
        "Return to leisure",
        "Independent ADLs",
        "Prevent re-injury",
      ],
      progressCriteria: [
        "Work tasks performed independently",
        "Leisure activities resumed",
        "ADLs independent",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved hand function",
    "Improved grip/pinch strength",
    "Improved dexterity",
    "Return to work",
    "Return to leisure activities",
    "Independent ADLs",
  ],
  dischargeCriteria: [
    "Functional goals achieved",
    "Independent with ADLs",
    "Return to work/leisure",
    "Plateau in progress",
  ],
  references: [
    "AOTA Hand Therapy Guidelines",
    "Evidence-based hand therapy protocols",
  ],
};

// ============================================================================
// ADL Training Pathway
// ============================================================================

export const ADL_TRAINING_PATHWAY: ClinicalPathway = {
  id: "pathway-adl-001",
  name: "ADL Training & Self-Care",
  domain: "adl-training",
  description: "Clinical pathway for ADL training and self-care independence",
  applicableDiagnoses: [
    "Stroke",
    "Spinal cord injury",
    "Arthritis",
    "Parkinson's disease",
    "Multiple sclerosis",
    "Amputation",
  ],
  duration: "4-12 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive ADL and self-care assessment",
      duration: "1 session",
      assessments: [
        "Occupational Profile",
        "FIM assessment",
        "ADL independence assessment",
        "COPM",
      ],
      interventions: [],
      goals: ["Establish baseline ADL function", "Identify priority ADLs"],
      progressCriteria: ["Assessment complete", "Priority ADLs identified"],
      nextStep: "Phase 1: ADL Training",
    },
    {
      order: 2,
      phase: "ADL Training",
      description: "Training in priority ADLs with adaptive strategies",
      duration: "4-8 weeks",
      assessments: ["ADL independence", "Functional capacity"],
      interventions: [
        "ADL training",
        "Adaptive equipment training",
        "Energy conservation",
        "Compensatory strategies",
      ],
      goals: [
        "Improve ADL independence",
        "Learn adaptive strategies",
        "Improve safety",
        "Improve efficiency",
      ],
      progressCriteria: [
        "ADL independence improved",
        "Adaptive strategies learned",
        "Safety improved",
      ],
      nextStep: "Phase 2: Home Program",
    },
    {
      order: 3,
      phase: "Home Program",
      description: "Independent ADL performance at home",
      duration: "2-4 weeks",
      assessments: ["Home safety assessment", "ADL independence"],
      interventions: [
        "Home modifications",
        "Environmental adaptations",
        "Family education",
        "Home program practice",
      ],
      goals: [
        "Independent ADLs at home",
        "Safe home environment",
        "Family support",
        "Maintenance of skills",
      ],
      progressCriteria: [
        "ADLs independent at home",
        "Home safe",
        "Family educated",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved ADL independence",
    "Improved self-care skills",
    "Improved safety",
    "Improved efficiency",
    "Improved quality of life",
  ],
  dischargeCriteria: [
    "ADL goals achieved",
    "Independent with ADLs",
    "Safe at home",
    "Plateau in progress",
  ],
  references: ["AOTA ADL Guidelines", "FIM assessment standards"],
};

// ============================================================================
// Cognitive Rehabilitation Pathway
// ============================================================================

export const COGNITIVE_REHAB_PATHWAY: ClinicalPathway = {
  id: "pathway-cognitive-001",
  name: "Cognitive Rehabilitation",
  domain: "cognitive-rehab",
  description: "Clinical pathway for cognitive rehabilitation and training",
  applicableDiagnoses: [
    "Traumatic brain injury",
    "Stroke",
    "Dementia",
    "Parkinson's disease",
    "Multiple sclerosis",
    "Chemotherapy-related cognitive impairment",
  ],
  duration: "6-16 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive cognitive assessment",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "Cognitive screening",
        "Montreal Cognitive Assessment (MoCA)",
        "Kitchen Task Assessment (KTA)",
      ],
      interventions: [],
      goals: [
        "Establish baseline cognitive function",
        "Identify cognitive deficits",
      ],
      progressCriteria: ["Assessment complete", "Deficits identified"],
      nextStep: "Phase 1: Cognitive Training",
    },
    {
      order: 2,
      phase: "Cognitive Training",
      description: "Targeted cognitive training and compensatory strategies",
      duration: "6-12 weeks",
      assessments: ["Cognitive function", "Functional capacity"],
      interventions: [
        "Memory training",
        "Executive function training",
        "Attention training",
        "Problem-solving training",
        "Compensatory strategies",
      ],
      goals: [
        "Improve memory",
        "Improve executive function",
        "Improve attention",
        "Learn compensatory strategies",
      ],
      progressCriteria: [
        "Cognitive function improved",
        "Compensatory strategies learned",
        "Functional capacity improved",
      ],
      nextStep: "Phase 2: Functional Application",
    },
    {
      order: 3,
      phase: "Functional Application",
      description: "Apply cognitive skills to functional activities",
      duration: "2-4 weeks",
      assessments: ["Functional capacity", "ADL independence"],
      interventions: [
        "Functional activities",
        "ADL training",
        "Community reintegration",
        "Family education",
      ],
      goals: [
        "Apply cognitive skills to ADLs",
        "Improve functional independence",
        "Return to community",
        "Family support",
      ],
      progressCriteria: [
        "Cognitive skills applied",
        "ADL independence improved",
        "Community participation",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved cognitive function",
    "Improved memory",
    "Improved executive function",
    "Improved attention",
    "Improved functional independence",
    "Improved community participation",
  ],
  dischargeCriteria: [
    "Cognitive goals achieved",
    "Compensatory strategies mastered",
    "Functional independence improved",
    "Plateau in progress",
  ],
  references: [
    "AOTA Cognitive Rehabilitation Guidelines",
    "Brain injury rehabilitation standards",
  ],
};

// ============================================================================
// Work Conditioning Pathway
// ============================================================================

export const WORK_CONDITIONING_PATHWAY: ClinicalPathway = {
  id: "pathway-work-001",
  name: "Work Conditioning & Return to Work",
  domain: "work-conditioning",
  description:
    "Clinical pathway for work conditioning and return-to-work planning",
  applicableDiagnoses: [
    "Work-related injuries",
    "Chronic pain",
    "Arthritis",
    "Carpal tunnel syndrome",
    "Back injuries",
  ],
  duration: "4-12 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Work capacity and job analysis",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "Work capacity evaluation",
        "Job analysis",
        "Ergonomic assessment",
      ],
      interventions: [],
      goals: ["Establish baseline work capacity", "Identify job demands"],
      progressCriteria: ["Assessment complete", "Job demands identified"],
      nextStep: "Phase 1: Work Conditioning",
    },
    {
      order: 2,
      phase: "Work Conditioning",
      description: "Progressive work conditioning and job simulation",
      duration: "4-8 weeks",
      assessments: ["Work capacity", "Functional capacity"],
      interventions: [
        "Work simulation",
        "Job-specific training",
        "Ergonomic training",
        "Strength training",
        "Endurance training",
      ],
      goals: [
        "Improve work capacity",
        "Improve job-specific skills",
        "Improve ergonomics",
        "Improve strength/endurance",
      ],
      progressCriteria: [
        "Work capacity improved",
        "Job simulation completed",
        "Strength/endurance improved",
      ],
      nextStep: "Phase 3: Return to Work",
    },
    {
      order: 3,
      phase: "Return to Work",
      description: "Gradual return to work with accommodations",
      duration: "2-4 weeks",
      assessments: ["Work capacity", "Job performance"],
      interventions: [
        "Workplace accommodations",
        "Job modifications",
        "Employer education",
        "Follow-up support",
      ],
      goals: [
        "Return to work",
        "Implement accommodations",
        "Prevent re-injury",
        "Maintain function",
      ],
      progressCriteria: [
        "Returned to work",
        "Accommodations implemented",
        "No re-injury",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved work capacity",
    "Successful return to work",
    "Improved job performance",
    "Improved ergonomics",
    "Reduced pain",
    "Prevented re-injury",
  ],
  dischargeCriteria: [
    "Work capacity goals achieved",
    "Returned to work",
    "Accommodations in place",
    "Plateau in progress",
  ],
  references: [
    "AOTA Work Conditioning Guidelines",
    "Occupational health standards",
  ],
};

// ============================================================================
// Mental Health & Psychosocial Pathway
// ============================================================================

export const MENTAL_HEALTH_PATHWAY: ClinicalPathway = {
  id: "pathway-mental-001",
  name: "Mental Health & Psychosocial Rehabilitation",
  domain: "mental-health",
  description:
    "Clinical pathway for mental health and psychosocial rehabilitation",
  applicableDiagnoses: [
    "Depression",
    "Anxiety",
    "PTSD",
    "Schizophrenia",
    "Bipolar disorder",
    "Substance use disorders",
  ],
  duration: "8-16 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive psychosocial assessment",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "COPM",
        "Role Checklist",
        "Interest Checklist",
      ],
      interventions: [],
      goals: [
        "Establish baseline psychosocial function",
        "Identify priorities",
      ],
      progressCriteria: ["Assessment complete", "Priorities identified"],
      nextStep: "Phase 1: Coping & Skills Training",
    },
    {
      order: 2,
      phase: "Coping & Skills Training",
      description: "Develop coping strategies and life skills",
      duration: "6-12 weeks",
      assessments: ["Psychosocial function", "Coping skills"],
      interventions: [
        "Coping strategies",
        "Stress management",
        "Social skills training",
        "Life skills training",
        "Leisure activities",
      ],
      goals: [
        "Develop coping strategies",
        "Improve stress management",
        "Improve social skills",
        "Improve life skills",
      ],
      progressCriteria: [
        "Coping strategies developed",
        "Stress management improved",
        "Social skills improved",
      ],
      nextStep: "Phase 3: Community Reintegration",
    },
    {
      order: 3,
      phase: "Community Reintegration",
      description: "Return to community and meaningful occupations",
      duration: "2-4 weeks",
      assessments: ["Community participation", "Occupational engagement"],
      interventions: [
        "Community activities",
        "Volunteer opportunities",
        "Social participation",
        "Leisure activities",
        "Family support",
      ],
      goals: [
        "Return to community",
        "Engage in meaningful occupations",
        "Improve social participation",
        "Maintain mental health",
      ],
      progressCriteria: [
        "Community participation",
        "Occupational engagement",
        "Social participation",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved coping skills",
    "Improved stress management",
    "Improved social skills",
    "Improved community participation",
    "Improved occupational engagement",
    "Improved mental health",
  ],
  dischargeCriteria: [
    "Psychosocial goals achieved",
    "Coping strategies mastered",
    "Community participation",
    "Plateau in progress",
  ],
  references: [
    "AOTA Mental Health Guidelines",
    "Psychosocial rehabilitation standards",
  ],
};

// ============================================================================
// Pediatric Development Pathway
// ============================================================================

export const PEDIATRIC_DEV_PATHWAY: ClinicalPathway = {
  id: "pathway-pediatric-001",
  name: "Pediatric Development & Play",
  domain: "pediatric-dev",
  description:
    "Clinical pathway for pediatric development and play-based interventions",
  applicableDiagnoses: [
    "Cerebral palsy",
    "Autism spectrum disorder",
    "Developmental delay",
    "Dyspraxia",
    "Learning disabilities",
  ],
  duration: "8-24 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive developmental assessment",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "Developmental screening",
        "Motor skills assessment",
        "Play assessment",
      ],
      interventions: [],
      goals: [
        "Establish baseline development",
        "Identify developmental delays",
      ],
      progressCriteria: ["Assessment complete", "Delays identified"],
      nextStep: "Phase 1: Developmental Training",
    },
    {
      order: 2,
      phase: "Developmental Training",
      description: "Play-based developmental interventions",
      duration: "6-16 weeks",
      assessments: ["Developmental progress", "Motor skills", "Play skills"],
      interventions: [
        "Play-based interventions",
        "Motor skills training",
        "Fine motor training",
        "Gross motor training",
        "Social skills training",
      ],
      goals: [
        "Improve motor skills",
        "Improve play skills",
        "Improve social skills",
        "Promote development",
      ],
      progressCriteria: [
        "Motor skills improved",
        "Play skills improved",
        "Development progressing",
      ],
      nextStep: "Phase 3: School Readiness",
    },
    {
      order: 3,
      phase: "School Readiness",
      description: "Prepare for school participation",
      duration: "2-4 weeks",
      assessments: ["School readiness", "Academic skills"],
      interventions: [
        "School readiness training",
        "Academic skills training",
        "Social skills training",
        "Teacher consultation",
      ],
      goals: [
        "Prepare for school",
        "Improve academic skills",
        "Improve social skills",
        "Successful school transition",
      ],
      progressCriteria: [
        "School ready",
        "Academic skills adequate",
        "Social skills adequate",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved motor skills",
    "Improved play skills",
    "Improved social skills",
    "Improved academic skills",
    "Successful school transition",
    "Age-appropriate development",
  ],
  dischargeCriteria: [
    "Developmental goals achieved",
    "School ready",
    "Age-appropriate skills",
    "Plateau in progress",
  ],
  references: [
    "AOTA Pediatric Guidelines",
    "Developmental milestones standards",
  ],
};

// ============================================================================
// Sensory Integration Pathway
// ============================================================================

export const SENSORY_INTEGRATION_PATHWAY: ClinicalPathway = {
  id: "pathway-sensory-001",
  name: "Sensory Integration & Processing",
  domain: "sensory-integration",
  description: "Clinical pathway for sensory integration and processing",
  applicableDiagnoses: [
    "Autism spectrum disorder",
    "Sensory processing disorder",
    "ADHD",
    "Developmental coordination disorder",
  ],
  duration: "8-16 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Comprehensive sensory assessment",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "Sensory Profile",
        "Sensory processing assessment",
      ],
      interventions: [],
      goals: ["Establish baseline sensory function", "Identify sensory issues"],
      progressCriteria: ["Assessment complete", "Sensory issues identified"],
      nextStep: "Phase 1: Sensory Integration Training",
    },
    {
      order: 2,
      phase: "Sensory Integration Training",
      description: "Sensory diet and integration training",
      duration: "6-12 weeks",
      assessments: ["Sensory processing", "Functional capacity"],
      interventions: [
        "Sensory diet",
        "Proprioceptive training",
        "Vestibular training",
        "Tactile training",
        "Sensory modulation",
      ],
      goals: [
        "Improve sensory processing",
        "Develop sensory diet",
        "Improve sensory modulation",
        "Improve functional capacity",
      ],
      progressCriteria: [
        "Sensory processing improved",
        "Sensory diet effective",
        "Functional capacity improved",
      ],
      nextStep: "Phase 3: Functional Application",
    },
    {
      order: 3,
      phase: "Functional Application",
      description: "Apply sensory skills to functional activities",
      duration: "2-4 weeks",
      assessments: ["Functional capacity", "ADL independence"],
      interventions: [
        "Functional activities",
        "ADL training",
        "School/work activities",
        "Family education",
      ],
      goals: [
        "Apply sensory skills",
        "Improve functional independence",
        "Improve school/work performance",
        "Family support",
      ],
      progressCriteria: [
        "Sensory skills applied",
        "Functional independence improved",
        "School/work performance improved",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved sensory processing",
    "Improved sensory modulation",
    "Improved functional capacity",
    "Improved school/work performance",
    "Improved quality of life",
  ],
  dischargeCriteria: [
    "Sensory goals achieved",
    "Sensory diet effective",
    "Functional independence improved",
    "Plateau in progress",
  ],
  references: [
    "AOTA Sensory Integration Guidelines",
    "Sensory processing standards",
  ],
};

// ============================================================================
// Community Reintegration Pathway
// ============================================================================

export const COMMUNITY_REINTEGRATION_PATHWAY: ClinicalPathway = {
  id: "pathway-community-001",
  name: "Community Reintegration",
  domain: "community-reintegration",
  description: "Clinical pathway for community reintegration and participation",
  applicableDiagnoses: [
    "Stroke",
    "Spinal cord injury",
    "Traumatic brain injury",
    "Amputation",
    "Chronic illness",
  ],
  duration: "6-12 weeks",
  steps: [
    {
      order: 1,
      phase: "Evaluation",
      description: "Community participation assessment",
      duration: "1-2 sessions",
      assessments: [
        "Occupational Profile",
        "COPM",
        "Community participation assessment",
      ],
      interventions: [],
      goals: [
        "Establish baseline community participation",
        "Identify priorities",
      ],
      progressCriteria: ["Assessment complete", "Priorities identified"],
      nextStep: "Phase 1: Community Skills Training",
    },
    {
      order: 2,
      phase: "Community Skills Training",
      description: "Training in community mobility and participation",
      duration: "4-8 weeks",
      assessments: ["Community participation", "Functional capacity"],
      interventions: [
        "Community mobility training",
        "Transportation training",
        "Social participation",
        "Leisure activities",
        "Volunteer opportunities",
      ],
      goals: [
        "Improve community mobility",
        "Improve social participation",
        "Engage in leisure",
        "Volunteer opportunities",
      ],
      progressCriteria: [
        "Community mobility improved",
        "Social participation improved",
        "Leisure engagement",
      ],
      nextStep: "Phase 3: Community Integration",
    },
    {
      order: 3,
      phase: "Community Integration",
      description: "Full community participation and integration",
      duration: "2-4 weeks",
      assessments: ["Community participation", "Quality of life"],
      interventions: [
        "Community activities",
        "Social groups",
        "Volunteer work",
        "Leisure activities",
        "Family support",
      ],
      goals: [
        "Full community participation",
        "Meaningful occupations",
        "Social connections",
        "Quality of life",
      ],
      progressCriteria: [
        "Community participation",
        "Meaningful occupations",
        "Social connections",
      ],
      nextStep: "Discharge",
    },
  ],
  expectedOutcomes: [
    "Improved community mobility",
    "Improved social participation",
    "Improved leisure engagement",
    "Improved quality of life",
    "Successful community reintegration",
  ],
  dischargeCriteria: [
    "Community participation goals achieved",
    "Meaningful occupations engaged",
    "Social connections established",
    "Plateau in progress",
  ],
  references: [
    "AOTA Community Reintegration Guidelines",
    "Community participation standards",
  ],
};

// ============================================================================
// Lookup Functions
// ============================================================================

export const CLINICAL_PATHWAYS: ClinicalPathway[] = [
  HAND_THERAPY_PATHWAY,
  ADL_TRAINING_PATHWAY,
  COGNITIVE_REHAB_PATHWAY,
  WORK_CONDITIONING_PATHWAY,
  MENTAL_HEALTH_PATHWAY,
  PEDIATRIC_DEV_PATHWAY,
  SENSORY_INTEGRATION_PATHWAY,
  COMMUNITY_REINTEGRATION_PATHWAY,
];

export function getClinicalPathway(
  pathwayId: string,
): ClinicalPathway | undefined {
  return CLINICAL_PATHWAYS.find((p) => p.id === pathwayId);
}

export function getClinicalPathwayByDomain(
  domain: OTDomain,
): ClinicalPathway | undefined {
  return CLINICAL_PATHWAYS.find((p) => p.domain === domain);
}

export function getClinicalPathwaysByDiagnosis(
  diagnosis: string,
): ClinicalPathway[] {
  return CLINICAL_PATHWAYS.filter((p) =>
    p.applicableDiagnoses.some((d) =>
      d.toLowerCase().includes(diagnosis.toLowerCase()),
    ),
  );
}
