/**
 * OT Hubs Configuration
 *
 * Defines configuration for all 8 OT hubs
 * Requirements: 3.10, 3.11, 3.12
 */

import type { HubConfig } from "../../../types/discipline";

// ============================================================================
// OT Hub Configurations
// ============================================================================

export const OT_HUBS_CONFIG: HubConfig[] = [
  {
    id: "hand-therapy",
    name: "Hand Therapy & Upper Extremity",
    description: "Hand function, dexterity, and upper extremity rehabilitation",
    icon: "hand",
    discipline: "ot",
    component: "HandTherapyHub",
    order: 1,
    enabled: true,
  },
  {
    id: "adl-training",
    name: "ADL Training",
    description: "Activities of daily living and self-care training",
    icon: "home",
    discipline: "ot",
    component: "ADLTrainingHub",
    order: 2,
    enabled: true,
  },
  {
    id: "cognitive-rehab",
    name: "Cognitive Rehabilitation",
    description: "Memory, executive function, and cognitive training",
    icon: "brain",
    discipline: "ot",
    component: "CognitiveRehabHub",
    order: 3,
    enabled: true,
  },
  {
    id: "work-conditioning",
    name: "Work Conditioning & Ergonomics",
    description: "Work capacity evaluation and ergonomic assessment",
    icon: "briefcase",
    discipline: "ot",
    component: "WorkConditioningHub",
    order: 4,
    enabled: true,
  },
  {
    id: "mental-health",
    name: "Mental Health & Psychosocial",
    description: "Coping strategies and community reintegration",
    icon: "heart",
    discipline: "ot",
    component: "MentalHealthHub",
    order: 5,
    enabled: true,
  },
  {
    id: "pediatric-dev",
    name: "Pediatric Development",
    description: "Developmental milestones and play-based interventions",
    icon: "baby",
    discipline: "ot",
    component: "PediatricDevHub",
    order: 6,
    enabled: true,
  },
  {
    id: "sensory-integration",
    name: "Sensory Integration",
    description: "Sensory processing and sensory diet development",
    icon: "eye",
    discipline: "ot",
    component: "SensoryIntegrationHub",
    order: 7,
    enabled: true,
  },
  {
    id: "community-reintegration",
    name: "Community Reintegration",
    description: "Community mobility and social participation",
    icon: "map",
    discipline: "ot",
    component: "CommunityReintegrationHub",
    order: 8,
    enabled: true,
  },
];

// ============================================================================
// Hub Details
// ============================================================================

export interface HubDetails {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  keyFeatures: string[];
  commonDiagnoses: string[];
  assessmentTools: string[];
  interventions: string[];
  expectedOutcomes: string[];
  clinicalPathway: string;
  resources: string[];
}

export const OT_HUB_DETAILS: Record<string, HubDetails> = {
  "hand-therapy": {
    id: "hand-therapy",
    name: "Hand Therapy & Upper Extremity",
    description: "Hand function, dexterity, and upper extremity rehabilitation",
    longDescription:
      "Comprehensive hand therapy and upper extremity rehabilitation for conditions affecting hand function, dexterity, and coordination. Includes assessment and treatment of hand injuries, arthritis, nerve injuries, and post-stroke upper extremity dysfunction.",
    icon: "hand",
    color: "#f59e0b",
    keyFeatures: [
      "Hand function assessment",
      "Grip and pinch strength testing",
      "Dexterity training",
      "Scar management",
      "Edema management",
      "Splinting and orthotics",
      "Work conditioning",
    ],
    commonDiagnoses: [
      "Carpal tunnel syndrome",
      "Arthritis",
      "Fractures",
      "Tendon injuries",
      "Nerve injuries",
      "Stroke (upper extremity)",
    ],
    assessmentTools: [
      "Hand function assessment",
      "Grip strength (dynamometer)",
      "Pinch strength (pinch gauge)",
      "Dexterity tests (Purdue Pegboard)",
      "Range of motion",
      "Sensory testing",
    ],
    interventions: [
      "Therapeutic exercise",
      "Scar management",
      "Edema management",
      "Splinting",
      "Dexterity training",
      "Work conditioning",
    ],
    expectedOutcomes: [
      "Improved hand function",
      "Improved grip/pinch strength",
      "Improved dexterity",
      "Return to work",
      "Return to leisure activities",
    ],
    clinicalPathway: "pathway-hand-001",
    resources: [
      "Hand therapy protocols",
      "Splinting guidelines",
      "Edema management techniques",
    ],
  },

  "adl-training": {
    id: "adl-training",
    name: "ADL Training",
    description: "Activities of daily living and self-care training",
    longDescription:
      "Comprehensive ADL training and self-care independence for individuals with functional limitations. Includes training in bathing, dressing, grooming, toileting, feeding, meal preparation, and medication management.",
    icon: "home",
    color: "#10b981",
    keyFeatures: [
      "Self-care training",
      "Adaptive equipment training",
      "Energy conservation",
      "Compensatory strategies",
      "Home modifications",
      "Family education",
      "Safety training",
    ],
    commonDiagnoses: [
      "Stroke",
      "Spinal cord injury",
      "Arthritis",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Amputation",
    ],
    assessmentTools: [
      "FIM (Functional Independence Measure)",
      "Barthel Index",
      "Katz Index",
      "COPM (Canadian Occupational Performance Measure)",
      "ADL independence assessment",
    ],
    interventions: [
      "ADL training",
      "Adaptive equipment training",
      "Energy conservation techniques",
      "Compensatory strategies",
      "Home modifications",
      "Family education",
    ],
    expectedOutcomes: [
      "Improved ADL independence",
      "Improved self-care skills",
      "Improved safety",
      "Improved efficiency",
      "Improved quality of life",
    ],
    clinicalPathway: "pathway-adl-001",
    resources: [
      "ADL training protocols",
      "Adaptive equipment catalog",
      "Home modification guidelines",
    ],
  },

  "cognitive-rehab": {
    id: "cognitive-rehab",
    name: "Cognitive Rehabilitation",
    description: "Memory, executive function, and cognitive training",
    longDescription:
      "Comprehensive cognitive rehabilitation for individuals with memory, executive function, and attention deficits. Includes assessment and training in memory, problem-solving, attention, and compensatory strategies.",
    icon: "brain",
    color: "#8b5cf6",
    keyFeatures: [
      "Memory training",
      "Executive function training",
      "Attention training",
      "Problem-solving training",
      "Compensatory strategies",
      "Safety awareness",
      "Functional application",
    ],
    commonDiagnoses: [
      "Traumatic brain injury",
      "Stroke",
      "Dementia",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Chemotherapy-related cognitive impairment",
    ],
    assessmentTools: [
      "Montreal Cognitive Assessment (MoCA)",
      "Mini-Cog",
      "Trail Making Test",
      "Clock Drawing Test",
      "Kitchen Task Assessment (KTA)",
      "Cognitive screening",
    ],
    interventions: [
      "Memory training",
      "Executive function training",
      "Attention training",
      "Problem-solving training",
      "Compensatory strategies",
      "Functional activities",
    ],
    expectedOutcomes: [
      "Improved cognitive function",
      "Improved memory",
      "Improved executive function",
      "Improved attention",
      "Improved functional independence",
    ],
    clinicalPathway: "pathway-cognitive-001",
    resources: [
      "Cognitive training protocols",
      "Compensatory strategy guides",
      "Functional activity ideas",
    ],
  },

  "work-conditioning": {
    id: "work-conditioning",
    name: "Work Conditioning & Ergonomics",
    description: "Work capacity evaluation and ergonomic assessment",
    longDescription:
      "Comprehensive work conditioning and ergonomic assessment for return-to-work planning. Includes work capacity evaluation, job analysis, ergonomic assessment, and work hardening protocols.",
    icon: "briefcase",
    color: "#06b6d4",
    keyFeatures: [
      "Work capacity evaluation",
      "Job analysis",
      "Ergonomic assessment",
      "Work simulation",
      "Job-specific training",
      "Workplace accommodations",
      "Return-to-work planning",
    ],
    commonDiagnoses: [
      "Work-related injuries",
      "Chronic pain",
      "Arthritis",
      "Carpal tunnel syndrome",
      "Back injuries",
    ],
    assessmentTools: [
      "Functional capacity evaluation (FCE)",
      "Ergonomic assessment",
      "Work simulation",
      "Job analysis",
      "Work capacity assessment",
    ],
    interventions: [
      "Work conditioning",
      "Job simulation",
      "Ergonomic training",
      "Workplace modifications",
      "Job-specific training",
      "Employer education",
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Successful return to work",
      "Improved job performance",
      "Improved ergonomics",
      "Reduced pain",
    ],
    clinicalPathway: "pathway-work-001",
    resources: [
      "Work conditioning protocols",
      "Ergonomic guidelines",
      "Job analysis templates",
    ],
  },

  "mental-health": {
    id: "mental-health",
    name: "Mental Health & Psychosocial",
    description: "Coping strategies and community reintegration",
    longDescription:
      "Comprehensive mental health and psychosocial rehabilitation for individuals with mental health conditions. Includes coping strategies, stress management, social skills training, and community reintegration.",
    icon: "heart",
    color: "#ec4899",
    keyFeatures: [
      "Coping strategies",
      "Stress management",
      "Social skills training",
      "Life skills training",
      "Leisure activities",
      "Community participation",
      "Family support",
    ],
    commonDiagnoses: [
      "Depression",
      "Anxiety",
      "PTSD",
      "Schizophrenia",
      "Bipolar disorder",
      "Substance use disorders",
    ],
    assessmentTools: [
      "COPM (Canadian Occupational Performance Measure)",
      "Role Checklist",
      "Interest Checklist",
      "Occupational Self-Assessment",
      "Psychosocial assessment",
    ],
    interventions: [
      "Coping strategies",
      "Stress management",
      "Social skills training",
      "Life skills training",
      "Leisure activities",
      "Community participation",
    ],
    expectedOutcomes: [
      "Improved coping skills",
      "Improved stress management",
      "Improved social skills",
      "Improved community participation",
      "Improved mental health",
    ],
    clinicalPathway: "pathway-mental-001",
    resources: [
      "Coping strategy guides",
      "Stress management techniques",
      "Social skills training materials",
    ],
  },

  "pediatric-dev": {
    id: "pediatric-dev",
    name: "Pediatric Development",
    description: "Developmental milestones and play-based interventions",
    longDescription:
      "Comprehensive pediatric development and play-based interventions for children with developmental delays or disabilities. Includes assessment and training in motor skills, play skills, and social skills.",
    icon: "baby",
    color: "#f97316",
    keyFeatures: [
      "Developmental screening",
      "Motor skills training",
      "Fine motor training",
      "Gross motor training",
      "Play-based interventions",
      "Social skills training",
      "School readiness",
    ],
    commonDiagnoses: [
      "Cerebral palsy",
      "Autism spectrum disorder",
      "Developmental delay",
      "Dyspraxia",
      "Learning disabilities",
    ],
    assessmentTools: [
      "Peabody Developmental Motor Scales (PDMS)",
      "Bayley Scales of Infant Development",
      "Bruininks-Oseretsky Test of Motor Proficiency",
      "Sensory Profile",
      "Developmental screening",
    ],
    interventions: [
      "Play-based interventions",
      "Motor skills training",
      "Fine motor training",
      "Gross motor training",
      "Social skills training",
      "School readiness training",
    ],
    expectedOutcomes: [
      "Improved motor skills",
      "Improved play skills",
      "Improved social skills",
      "Improved academic skills",
      "Successful school transition",
    ],
    clinicalPathway: "pathway-pediatric-001",
    resources: [
      "Play-based intervention ideas",
      "Developmental milestone guides",
      "School readiness checklists",
    ],
  },

  "sensory-integration": {
    id: "sensory-integration",
    name: "Sensory Integration",
    description: "Sensory processing and sensory diet development",
    longDescription:
      "Comprehensive sensory integration and processing assessment and training. Includes sensory diet development, proprioceptive training, vestibular training, and sensory modulation strategies.",
    icon: "eye",
    color: "#14b8a6",
    keyFeatures: [
      "Sensory processing assessment",
      "Sensory diet development",
      "Proprioceptive training",
      "Vestibular training",
      "Tactile training",
      "Sensory modulation",
      "Environmental modifications",
    ],
    commonDiagnoses: [
      "Autism spectrum disorder",
      "Sensory processing disorder",
      "ADHD",
      "Developmental coordination disorder",
    ],
    assessmentTools: [
      "Sensory Profile",
      "Sensory Integration and Praxis Tests (SIPT)",
      "Dunn Sensory Profile",
      "Sensory processing assessment",
    ],
    interventions: [
      "Sensory diet",
      "Proprioceptive training",
      "Vestibular training",
      "Tactile training",
      "Sensory modulation",
      "Environmental modifications",
    ],
    expectedOutcomes: [
      "Improved sensory processing",
      "Improved sensory modulation",
      "Improved functional capacity",
      "Improved school/work performance",
      "Improved quality of life",
    ],
    clinicalPathway: "pathway-sensory-001",
    resources: [
      "Sensory diet templates",
      "Sensory activity ideas",
      "Environmental modification guidelines",
    ],
  },

  "community-reintegration": {
    id: "community-reintegration",
    name: "Community Reintegration",
    description: "Community mobility and social participation",
    longDescription:
      "Comprehensive community reintegration and participation for individuals transitioning back to community living. Includes community mobility training, social participation, and meaningful occupation engagement.",
    icon: "map",
    color: "#6366f1",
    keyFeatures: [
      "Community mobility training",
      "Transportation training",
      "Social participation",
      "Leisure activities",
      "Volunteer opportunities",
      "Community resources",
      "Family support",
    ],
    commonDiagnoses: [
      "Stroke",
      "Spinal cord injury",
      "Traumatic brain injury",
      "Amputation",
      "Chronic illness",
    ],
    assessmentTools: [
      "COPM (Canadian Occupational Performance Measure)",
      "Community Integration Questionnaire",
      "Reintegration to Normal Living Index",
      "Community participation assessment",
    ],
    interventions: [
      "Community mobility training",
      "Transportation training",
      "Social participation",
      "Leisure activities",
      "Volunteer opportunities",
      "Community resource connection",
    ],
    expectedOutcomes: [
      "Improved community mobility",
      "Improved social participation",
      "Improved leisure engagement",
      "Improved quality of life",
      "Successful community reintegration",
    ],
    clinicalPathway: "pathway-community-001",
    resources: [
      "Community resource guides",
      "Transportation options",
      "Volunteer opportunity databases",
    ],
  },
};

// ============================================================================
// Lookup Functions
// ============================================================================

export function getHubConfig(hubId: string): HubConfig | undefined {
  return OT_HUBS_CONFIG.find((h) => h.id === hubId);
}

export function getHubDetails(hubId: string): HubDetails | undefined {
  return OT_HUB_DETAILS[hubId];
}

export function getAllHubConfigs(): HubConfig[] {
  return OT_HUBS_CONFIG;
}

export function getAllHubDetails(): HubDetails[] {
  return Object.values(OT_HUB_DETAILS);
}

export function getEnabledHubs(): HubConfig[] {
  return OT_HUBS_CONFIG.filter((h) => h.enabled);
}
