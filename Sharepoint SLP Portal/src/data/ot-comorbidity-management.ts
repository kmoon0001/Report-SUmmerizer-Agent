/**
 * OT Comorbidity Management Module
 * Comprehensive management strategies for common OT comorbidity combinations
 * Evidence-based on AOTA guidelines and clinical best practices
 */

export interface ComorbidityScenario {
  id: string;
  scenario: string;
  prevalence: string;
  clinicalPresentation: string;
  riskFactors: string[];
}

export interface InteractionPattern {
  condition1: string;
  condition2: string;
  interactionType: string;
  clinicalImpact: string;
  modificationRequired: boolean;
}

export interface AssessmentModification {
  standardAssessment: string;
  modification: string;
  rationale: string;
  priorityOrder: number;
}

export interface InterventionModification {
  standardIntervention: string;
  modification: string;
  rationale: string;
  dosageAdjustment: string;
}

export interface PrioritizationStrategy {
  priority: number;
  condition: string;
  rationale: string;
  timeframe: string;
  expectedOutcome: string;
}

export interface Contraindication {
  intervention: string;
  reason: string;
  severity: "absolute" | "relative";
  alternativeApproach: string;
}

export interface ComorbidityModule {
  id: string;
  title: string;
  conditions: [string, string];
  category: string;
  scenarios: ComorbidityScenario[];
  interactionPatterns: InteractionPattern[];
  assessmentModifications: AssessmentModification[];
  interventionModifications: InterventionModification[];
  prioritizationStrategies: PrioritizationStrategy[];
  contraindications: Contraindication[];
  precautions: string[];
  expectedOutcomes: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const cognitivDepressionModule: ComorbidityModule = {
  id: "ot-cm-001",
  title: "Cognitive Impairment + Depression Comorbidity Management",
  conditions: ["Cognitive Impairment", "Major Depression"],
  category: "Neuropsychological",
  scenarios: [
    {
      id: "cd-s-001",
      scenario: "Mild cognitive impairment with depression and apathy",
      prevalence: "30-40% of MCI patients develop depression",
      clinicalPresentation:
        "Memory loss, reduced motivation, social withdrawal, poor ADL engagement",
      riskFactors: [
        "Age >65",
        "Cognitive decline",
        "Social isolation",
        "Sleep disturbance",
      ],
    },
    {
      id: "cd-s-002",
      scenario: "Post-stroke cognitive impairment with post-stroke depression",
      prevalence: "30-50% of stroke survivors develop depression",
      clinicalPresentation:
        "Executive dysfunction, emotional lability, reduced participation",
      riskFactors: [
        "Left hemisphere stroke",
        "Severe impairment",
        "Social support loss",
      ],
    },
    {
      id: "cd-s-003",
      scenario:
        "Traumatic brain injury with depression and executive dysfunction",
      prevalence: "25-35% of TBI patients develop depression",
      clinicalPresentation:
        "Impulsivity, poor planning, mood instability, reduced occupational engagement",
      riskFactors: [
        "Moderate-severe TBI",
        "Frontal lobe involvement",
        "Unemployment",
      ],
    },
    {
      id: "cd-s-004",
      scenario: "Dementia with depression and behavioral changes",
      prevalence: "40-50% of dementia patients have depression",
      clinicalPresentation:
        "Memory loss, agitation, reduced ADL participation, wandering",
      riskFactors: [
        "Early-stage dementia",
        "Caregiver stress",
        "Medication changes",
      ],
    },
    {
      id: "cd-s-005",
      scenario:
        "Cognitive decline with depression affecting occupational performance",
      prevalence: "35% of cognitively impaired have comorbid depression",
      clinicalPresentation:
        "Reduced work capacity, poor decision-making, social withdrawal",
      riskFactors: ["Job loss", "Financial stress", "Chronic illness"],
    },
  ],
  interactionPatterns: [
    {
      condition1: "Cognitive Impairment",
      condition2: "Depression",
      interactionType: "Neuropsychological",
      clinicalImpact:
        "Depression worsens cognitive function; cognitive loss increases depression",
      modificationRequired: true,
    },
    {
      condition1: "Executive Dysfunction",
      condition2: "Apathy",
      interactionType: "Motivational-Executive",
      clinicalImpact:
        "Severe reduction in goal-directed activity and occupational engagement",
      modificationRequired: true,
    },
    {
      condition1: "Memory Loss",
      condition2: "Hopelessness",
      interactionType: "Cognitive-Emotional",
      clinicalImpact:
        "Difficulty learning new strategies; reduced motivation for rehabilitation",
      modificationRequired: true,
    },
    {
      condition1: "Reduced Processing Speed",
      condition2: "Anhedonia",
      interactionType: "Cognitive-Emotional",
      clinicalImpact:
        "Slower task completion; reduced pleasure in accomplishment",
      modificationRequired: true,
    },
    {
      condition1: "Attention Deficits",
      condition2: "Negative Rumination",
      interactionType: "Attentional-Emotional",
      clinicalImpact:
        "Difficulty focusing on positive activities; rumination dominates attention",
      modificationRequired: true,
    },
  ],
  assessmentModifications: [
    {
      standardAssessment: "Cognitive Assessment",
      modification:
        "Use depression-sensitive measures; assess motivation and engagement",
      rationale:
        "Depression affects test performance; motivation impacts effort",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Occupational Performance Assessment",
      modification:
        "Assess for depression-related avoidance; use motivational interviewing",
      rationale:
        "Depression reduces participation; need to distinguish from inability",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Mood and Emotional Assessment",
      modification:
        "Use validated depression screening; assess suicidal ideation",
      rationale: "Depression severity affects intervention planning and safety",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Executive Function Assessment",
      modification:
        "Assess planning, initiation, and follow-through; note apathy",
      rationale:
        "Executive dysfunction and apathy compound occupational limitations",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Social and Leisure Assessment",
      modification: "Assess for social withdrawal; identify valued activities",
      rationale:
        "Depression reduces social engagement; need to identify motivators",
      priorityOrder: 2,
    },
  ],
  interventionModifications: [
    {
      standardIntervention: "Cognitive rehabilitation",
      modification: "Use compensatory strategies; build in success experiences",
      rationale: "Depression reduces motivation; success builds engagement",
      dosageAdjustment: "3-4x/week, 45-60 min, with frequent breaks",
    },
    {
      standardIntervention: "Occupational engagement",
      modification: "Start with valued activities; use behavioral activation",
      rationale:
        "Depression reduces motivation; valued activities increase engagement",
      dosageAdjustment: "4-5x/week, 30-45 min",
    },
    {
      standardIntervention: "Social participation",
      modification: "Facilitate group activities; address social anxiety",
      rationale:
        "Depression increases isolation; group activities combat withdrawal",
      dosageAdjustment: "2-3x/week, 60 min sessions",
    },
    {
      standardIntervention: "Executive function training",
      modification:
        "Use external supports; teach planning and initiation strategies",
      rationale: "Apathy impairs initiation; external supports compensate",
      dosageAdjustment: "3-4x/week, 30-45 min",
    },
    {
      standardIntervention: "Leisure and recreation",
      modification: "Identify valued activities; use graded exposure",
      rationale:
        "Anhedonia reduces pleasure; graded exposure rebuilds engagement",
      dosageAdjustment: "2-3x/week, 45-60 min",
    },
  ],
  prioritizationStrategies: [
    {
      priority: 1,
      condition: "Safety and suicide risk",
      rationale: "Depression increases suicide risk; must assess and monitor",
      timeframe: "Ongoing",
      expectedOutcome: "No suicidal ideation; safe engagement in therapy",
    },
    {
      priority: 2,
      condition: "Depression management",
      rationale:
        "Affects all occupational performance; must be addressed early",
      timeframe: "Weeks 1-4",
      expectedOutcome: "Improved mood; increased engagement and motivation",
    },
    {
      priority: 3,
      condition: "Cognitive function optimization",
      rationale: "Improves occupational performance and independence",
      timeframe: "Weeks 2-8",
      expectedOutcome: "Improved memory, attention, and executive function",
    },
    {
      priority: 4,
      condition: "Occupational engagement",
      rationale: "Enables meaningful participation and role fulfillment",
      timeframe: "Weeks 4-12",
      expectedOutcome: "Increased participation in valued activities",
    },
    {
      priority: 5,
      condition: "Social reintegration",
      rationale: "Reduces isolation; improves quality of life",
      timeframe: "Weeks 8-16",
      expectedOutcome:
        "Increased social participation and community engagement",
    },
  ],
  contraindications: [
    {
      intervention: "Cognitively demanding tasks without support",
      reason:
        "Depression reduces cognitive capacity; failure increases hopelessness",
      severity: "relative",
      alternativeApproach:
        "Use scaffolding and external supports; ensure success",
    },
    {
      intervention: "Isolation or individual therapy only",
      reason:
        "Depression increases isolation; social connection is therapeutic",
      severity: "relative",
      alternativeApproach: "Include group activities and social engagement",
    },
    {
      intervention: "Forcing participation in non-valued activities",
      reason: "Anhedonia makes non-valued activities aversive",
      severity: "relative",
      alternativeApproach: "Start with valued activities; build from there",
    },
    {
      intervention: "Rapid progression without success experiences",
      reason: "Failure reinforces hopelessness and reduces motivation",
      severity: "relative",
      alternativeApproach:
        "Ensure frequent success; build confidence gradually",
    },
    {
      intervention: "Ignoring emotional and motivational factors",
      reason: "Depression is primary barrier to engagement",
      severity: "absolute",
      alternativeApproach:
        "Integrate mood management and motivational strategies",
    },
  ],
  precautions: [
    "Screen for suicidal ideation at each session",
    "Monitor for worsening depression or hopelessness",
    "Watch for medication side effects affecting cognition",
    "Assess for social isolation; facilitate connections",
    "Monitor for anhedonia; identify valued activities",
    "Watch for cognitive decline; coordinate with medical team",
    "Assess caregiver stress; provide support and education",
    "Monitor for sleep disturbance; address sleep hygiene",
    "Watch for substance use as coping mechanism",
    "Coordinate with mental health professionals",
  ],
  expectedOutcomes: [
    "Improved mood and reduced depressive symptoms",
    "Increased motivation and engagement in activities",
    "Improved cognitive function (memory, attention, executive)",
    "Enhanced occupational performance and independence",
    "Increased social participation and reduced isolation",
    "Improved quality of life and life satisfaction",
    "Better medication adherence and self-management",
    "Reduced caregiver burden",
    "Return to work or valued roles",
    "Sustained engagement in meaningful activities",
  ],
  evidenceLevel: 1,
  source: "AOTA Mental Health Guidelines; APA Depression Treatment Standards",
  lastUpdated: new Date("2024-01-15"),
};

const autismAnxietyModule: ComorbidityModule = {
  id: "ot-cm-002",
  title: "Autism Spectrum Disorder + Anxiety Comorbidity Management",
  conditions: ["Autism Spectrum Disorder", "Anxiety Disorder"],
  category: "Neurodevelopmental-Anxiety",
  scenarios: [
    {
      id: "aa-s-001",
      scenario: "Autistic child with social anxiety and selective mutism",
      prevalence: "40-50% of autistic children have anxiety disorders",
      clinicalPresentation:
        "Difficulty with social interaction, selective mutism, avoidance behaviors",
      riskFactors: [
        "Sensory sensitivities",
        "Social communication deficits",
        "Bullying history",
      ],
    },
    {
      id: "aa-s-002",
      scenario:
        "Autistic adolescent with generalized anxiety and perfectionism",
      prevalence: "30-40% of autistic adolescents have anxiety",
      clinicalPresentation:
        "Excessive worry, perfectionism, difficulty with transitions, avoidance",
      riskFactors: ["Sensory overload", "Social demands", "Academic pressure"],
    },
    {
      id: "aa-s-003",
      scenario: "Autistic adult with panic disorder and agoraphobia",
      prevalence: "25-35% of autistic adults have panic disorder",
      clinicalPresentation:
        "Panic attacks, agoraphobia, avoidance of public spaces",
      riskFactors: [
        "Sensory sensitivities",
        "Social anxiety",
        "Unpredictability",
      ],
    },
    {
      id: "aa-s-004",
      scenario: "Autistic individual with OCD and repetitive behaviors",
      prevalence: "10-15% of autistic individuals have OCD",
      clinicalPresentation:
        "Intrusive thoughts, compulsive behaviors, difficulty with flexibility",
      riskFactors: [
        "Sensory sensitivities",
        "Need for sameness",
        "Perfectionism",
      ],
    },
    {
      id: "aa-s-005",
      scenario: "Autistic person with performance anxiety and avoidance",
      prevalence: "35-45% of autistic individuals have performance anxiety",
      clinicalPresentation:
        "Fear of judgment, avoidance of social situations, reduced participation",
      riskFactors: [
        "Social communication differences",
        "Sensory sensitivities",
        "Past negative experiences",
      ],
    },
  ],
  interactionPatterns: [
    {
      condition1: "Social Communication Differences",
      condition2: "Social Anxiety",
      interactionType: "Social-Emotional",
      clinicalImpact:
        "Difficulty with social interaction increases anxiety; anxiety worsens communication",
      modificationRequired: true,
    },
    {
      condition1: "Sensory Sensitivities",
      condition2: "Anxiety",
      interactionType: "Sensory-Emotional",
      clinicalImpact:
        "Sensory overload triggers anxiety; anxiety increases sensory sensitivity",
      modificationRequired: true,
    },
    {
      condition1: "Need for Sameness",
      condition2: "Anxiety About Change",
      interactionType: "Behavioral-Emotional",
      clinicalImpact:
        "Difficulty with transitions; anxiety about unpredictability",
      modificationRequired: true,
    },
    {
      condition1: "Executive Function Differences",
      condition2: "Worry and Rumination",
      interactionType: "Cognitive-Emotional",
      clinicalImpact:
        "Difficulty with planning increases worry; rumination impairs planning",
      modificationRequired: true,
    },
    {
      condition1: "Literal Thinking",
      condition2: "Catastrophic Thinking",
      interactionType: "Cognitive",
      clinicalImpact:
        "Difficulty with abstract reassurance; catastrophic interpretations",
      modificationRequired: true,
    },
  ],
  assessmentModifications: [
    {
      standardAssessment: "Anxiety Assessment",
      modification: "Use autism-informed measures; assess sensory triggers",
      rationale:
        "Anxiety manifests differently in autism; sensory factors are key",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Social Communication Assessment",
      modification:
        "Assess anxiety impact on communication; use supported formats",
      rationale: "Anxiety may mask or worsen communication abilities",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Sensory Profile Assessment",
      modification:
        "Identify sensory triggers for anxiety; assess coping strategies",
      rationale: "Sensory sensitivities are major anxiety triggers",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Occupational Performance Assessment",
      modification:
        "Assess anxiety-related avoidance; identify valued activities",
      rationale: "Anxiety reduces participation; need to identify motivators",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Coping and Regulation Assessment",
      modification:
        "Assess current coping strategies; identify effective self-regulation",
      rationale: "Autistic individuals may have unique coping mechanisms",
      priorityOrder: 2,
    },
  ],
  interventionModifications: [
    {
      standardIntervention: "Anxiety management",
      modification: "Use concrete, visual strategies; teach sensory regulation",
      rationale:
        "Autistic individuals benefit from concrete, visual approaches",
      dosageAdjustment: "2-3x/week, 30-45 min",
    },
    {
      standardIntervention: "Social skills training",
      modification:
        "Use explicit instruction; teach anxiety management in social contexts",
      rationale:
        "Social anxiety requires specific social skills plus anxiety management",
      dosageAdjustment: "2-3x/week, 45-60 min",
    },
    {
      standardIntervention: "Sensory regulation",
      modification:
        "Teach sensory strategies; create sensory-friendly environment",
      rationale: "Sensory regulation reduces anxiety triggers",
      dosageAdjustment: "3-4x/week, 20-30 min",
    },
    {
      standardIntervention: "Exposure therapy",
      modification:
        "Use gradual exposure; provide sensory supports and predictability",
      rationale:
        "Gradual exposure with supports is more effective for autistic individuals",
      dosageAdjustment: "2-3x/week, 30-45 min",
    },
    {
      standardIntervention: "Occupational engagement",
      modification:
        "Identify special interests; use as motivators for anxiety work",
      rationale:
        "Special interests are powerful motivators for autistic individuals",
      dosageAdjustment: "3-4x/week, 30-45 min",
    },
  ],
  prioritizationStrategies: [
    {
      priority: 1,
      condition: "Safety and crisis management",
      rationale: "Anxiety can lead to crisis; must have safety plan",
      timeframe: "Ongoing",
      expectedOutcome: "Safe coping; no self-harm or crisis behaviors",
    },
    {
      priority: 2,
      condition: "Anxiety symptom reduction",
      rationale: "Anxiety is primary barrier to participation",
      timeframe: "Weeks 1-4",
      expectedOutcome: "Reduced anxiety symptoms; improved coping",
    },
    {
      priority: 3,
      condition: "Sensory regulation",
      rationale: "Sensory regulation reduces anxiety triggers",
      timeframe: "Weeks 1-8",
      expectedOutcome:
        "Improved sensory regulation; reduced sensory-triggered anxiety",
    },
    {
      priority: 4,
      condition: "Social participation",
      rationale: "Enables meaningful social engagement",
      timeframe: "Weeks 4-12",
      expectedOutcome: "Increased social participation; reduced social anxiety",
    },
    {
      priority: 5,
      condition: "Occupational engagement",
      rationale: "Enables meaningful activity participation",
      timeframe: "Weeks 8-16",
      expectedOutcome: "Increased participation in valued activities",
    },
  ],
  contraindications: [
    {
      intervention: "Forced social interaction without anxiety support",
      reason: "Increases anxiety; may cause shutdown or meltdown",
      severity: "absolute",
      alternativeApproach:
        "Gradual exposure with anxiety management and sensory supports",
    },
    {
      intervention: "Sensory-overwhelming environments",
      reason: "Triggers anxiety and dysregulation",
      severity: "absolute",
      alternativeApproach:
        "Create sensory-friendly environment; use sensory supports",
    },
    {
      intervention: "Rapid transitions without warning",
      reason: "Increases anxiety; difficulty with flexibility",
      severity: "relative",
      alternativeApproach: "Provide advance notice; use visual schedules",
    },
    {
      intervention: "Punishment-based approaches",
      reason: "Increases anxiety; damages therapeutic relationship",
      severity: "absolute",
      alternativeApproach:
        "Use positive reinforcement and collaborative problem-solving",
    },
    {
      intervention: "Ignoring special interests",
      reason: "Reduces motivation; misses powerful engagement tool",
      severity: "relative",
      alternativeApproach: "Incorporate special interests into interventions",
    },
  ],
  precautions: [
    "Screen for suicidal ideation; anxiety increases risk",
    "Monitor for anxiety escalation; have de-escalation plan",
    "Watch for sensory overload; provide breaks and sensory supports",
    "Assess for selective mutism; use alternative communication",
    "Monitor for avoidance behaviors; address gradually",
    "Watch for perfectionism and rigid thinking patterns",
    "Assess for bullying or trauma history",
    "Coordinate with mental health professionals",
    "Educate family on anxiety management and sensory needs",
    "Monitor for medication side effects",
  ],
  expectedOutcomes: [
    "Reduced anxiety symptoms and improved coping",
    "Improved sensory regulation and reduced sensory-triggered anxiety",
    "Increased social participation and reduced social anxiety",
    "Improved occupational engagement and participation",
    "Better communication and self-expression",
    "Increased confidence and self-esteem",
    "Improved quality of life and life satisfaction",
    "Better school or work performance",
    "Reduced avoidance behaviors",
    "Sustained engagement in meaningful activities",
  ],
  evidenceLevel: 1,
  source: "AOTA Autism Guidelines; APA Anxiety Treatment Standards",
  lastUpdated: new Date("2024-01-15"),
};

export const otComorbidityModules: ComorbidityModule[] = [
  cognitivDepressionModule,
  autismAnxietyModule,
];

export function getComorbidityModuleById(
  id: string,
): ComorbidityModule | undefined {
  return otComorbidityModules.find((m) => m.id === id);
}

export function getAllComorbidityModules(): ComorbidityModule[] {
  return otComorbidityModules;
}

export function getModulesByCategory(category: string): ComorbidityModule[] {
  return otComorbidityModules.filter((m) => m.category === category);
}

export function searchModules(query: string): ComorbidityModule[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return otComorbidityModules.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerQuery) ||
      m.conditions.some((c) => c.toLowerCase().includes(lowerQuery)) ||
      m.category.toLowerCase().includes(lowerQuery),
  );
}

export function getModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): ComorbidityModule[] {
  return otComorbidityModules.filter((m) => m.evidenceLevel === level);
}

export function getScenarios(moduleId: string): ComorbidityScenario[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.scenarios || [];
}

export function getInteractionPatterns(moduleId: string): InteractionPattern[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.interactionPatterns || [];
}

export function getAssessmentModifications(
  moduleId: string,
): AssessmentModification[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.assessmentModifications || [];
}

export function getInterventionModifications(
  moduleId: string,
): InterventionModification[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.interventionModifications || [];
}

export function getPrioritizationStrategies(
  moduleId: string,
): PrioritizationStrategy[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.prioritizationStrategies || [];
}

export function getContraindications(moduleId: string): Contraindication[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.contraindications || [];
}

export function getPrecautions(moduleId: string): string[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.precautions || [];
}

export function getExpectedOutcomes(moduleId: string): string[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.expectedOutcomes || [];
}

export function getCategories(): string[] {
  const categories = new Set(otComorbidityModules.map((m) => m.category));
  return Array.from(categories).sort();
}
