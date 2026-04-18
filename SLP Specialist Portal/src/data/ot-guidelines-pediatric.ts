/**
 * OT Evidence-Based Guidelines - Pediatric
 * AOTA Clinical Practice Guidelines for infants, children, and adolescents
 */



export interface OTPediatricGuideline {
  id: string;
  name: string;
  condition: string;
  description: string;
  recommendations: string[];
  assessments: string[];
  interventions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const guidelines: OTPediatricGuideline[] = [
  {
    id: "gl-ot-031",
    name: "Autism Spectrum Disorder Support",
    condition: "Autism Spectrum Disorder",
    description:
      "Occupational therapy interventions for individuals with autism across the lifespan",
    recommendations: [
      "Sensory integration",
      "Social skills training",
      "Family education",
      "Environmental modification",
    ],
    assessments: ["Sensory Profile-2", "Social Skills Rating System", "ABAS-3"],
    interventions: [
      "Sensory motor activities",
      "Social communication training",
      "Transition planning",
      "Self-regulation strategies",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2015). Occupational Therapy for Autism Spectrum Disorder.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-032",
    name: "ADHD Management in Children",
    condition: "ADHD",
    description:
      "OT role in managing executive function and sensory-motor deficits in ADHD",
    recommendations: [
      "Task adaptation",
      "Cognitive-behavioral strategies",
      "Sensory environmental supports",
      "Parent coaching",
    ],
    assessments: [
      "AMPS",
      "Sensory Profile",
      "Behavior Rating Inventory of Executive Function (BRIEF)",
    ],
    interventions: [
      "Executive function training",
      "Organizational skill building",
      "Sensory modulation training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2018). Occupational Therapy Interventions for ADHD.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-033",
    name: "Developmental Coordination Disorder (DCD)",
    condition: "DCD",
    description:
      "Interventions to improve motor coordination and participation in DCD",
    recommendations: [
      "Task-oriented training",
      "CO-OP approach",
      "Canoeing/Swimming for trunk control",
      "Small group sessions",
    ],
    assessments: ["MABC-2", "BOT-2", "DCDQ"],
    interventions: [
      "Cognitive Orientation to Daily Occupational Performance (CO-OP)",
      "Motor skill acquisition",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2020). Occupational Therapy and Developmental Coordination Disorder.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-034",
    name: "Cerebral Palsy (Pediatric)",
    condition: "Cerebral Palsy",
    description: "Enhancing functional independence in children with CP",
    recommendations: [
      "Constraint-Induced Movement Therapy (CIMT)",
      "Bimanual training",
      "Adaptive equipment for ADLs",
      "Passive stretching precautions",
    ],
    assessments: ["GMFM", "PEDI-CAT", "QUEST"],
    interventions: [
      "Bimanual intensive therapy",
      "Assistive technology training",
      "Orthotic management education",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2017). Practice Guideline for Children and Adolescents with Cerebral Palsy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-035",
    name: "Sensory Processing Disorder (SPD)",
    condition: "SPD",
    description:
      "Direct and indirect interventions for sensory modulation and discrimination",
    recommendations: [
      "Ayres Sensory Integration (ASI)",
      "Sensory dietary consultation",
      "Modification of school environment",
    ],
    assessments: [
      "SIPT",
      "Sensory Profile-2",
      "Sensory Processing Measure (SPM)",
    ],
    interventions: [
      "ASI-based clinic therapy",
      "Sensory lifestyle development",
      "Teacher/Parent education",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2018). Sensory Integration and Processing Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-036",
    name: "Feeding, Eating, and Swallowing (Pediatric)",
    condition: "Feeding Disorder",
    description:
      "OT interventions for pediatric dysphagia and oral-motor deficits",
    recommendations: [
      "Positioning for feeding",
      "Texture modification",
      "Behavioral desensitization",
      "Oral-motor exercises",
    ],
    assessments: [
      "Behavioral Pediatric Feeding Assessment Scale",
      "Clinical Swallow Evaluation",
    ],
    interventions: [
      "Sequential Sensory Oral (SSO) approach",
      "Oral-motor facilitation",
      "Equipment modification",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2017). Occupational Therapy for Pediatric Feeding.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-037",
    name: "Handwriting and Literacy Support",
    condition: "Handwriting Deficit",
    description:
      "Interventions for fine motor and visual-perceptual components of writing",
    recommendations: [
      "Multi-sensory writing approach",
      "Keyboarding as alternative",
      "Postural support during desk tasks",
    ],
    assessments: ["ETCH", "VMI (Beery)", "DASH"],
    interventions: [
      "Handwriting Without Tears protocol",
      "Pencil grasp modification",
      "Visual-motor integration training",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2016). OT Interventions for Early Childhood Literacy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-038",
    name: "Down Syndrome (Early Childhood)",
    condition: "Down Syndrome",
    description:
      "Supporting developmental milestones and participation in children with Trisomy 21",
    recommendations: [
      "Early motor stimulation",
      "Total communication support",
      "Joint protection (atlantoaxial instability precautions)",
    ],
    assessments: ["Bayley Scales", "PEDI-CAT", "VMI"],
    interventions: [
      "Functional reach and grasp",
      "Self-care skill building",
      "Play-based motor development",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2019). Occupational Therapy and Down Syndrome.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-039",
    name: "Early Intervention Services (0-3)",
    condition: "Developmental Delay",
    description: "Family-centered services under IDEA Part C",
    recommendations: [
      "Natural environment focus",
      "Parent-implemented interventions",
      "Routine-based mapping",
    ],
    assessments: [
      "HELP (Hawaii Early Learning Profile)",
      "Ages and Stages Questionnaire (ASQ)",
    ],
    interventions: [
      "Coaching model",
      "Play-based developmental facilitation",
      "Environmental set-up for success",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2021). Best Practices in Early Intervention.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-040",
    name: "School-Based OT Services",
    condition: "Educational Disability",
    description: "Supporting students under IDEA Part B to access curriculum",
    recommendations: [
      "Collaborative goal setting",
      "Least restrictive environment interventions",
      "Functional classroom support",
    ],
    assessments: ["School AMPS", "SFA (School Function Assessment)", "VMI"],
    interventions: [
      "Classroom modification",
      "Direct service for goal attainment",
      "Staff consultation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2022). Guidelines for Occupational Therapy in School Systems.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getAllOTPediatricGuidelines(): OTPediatricGuideline[] {
  return [...guidelines];
}

export function getOTPediatricGuidelineById(
  id: string,
): OTPediatricGuideline | undefined {
  return guidelines.find((g) => g.id === id);
}

export function searchOTPediatricGuidelines(
  query: string,
): OTPediatricGuideline[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return guidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.condition.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery),
  );
}
