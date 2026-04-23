/**
 * OT Evidence-Based Guidelines - Adult Physical
 * AOTA Clinical Practice Guidelines for adult physical rehabilitation
 */



export interface OTAdultPhysicalGuideline {
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

const guidelines: OTAdultPhysicalGuideline[] = [
  {
    id: "gl-ot-041",
    name: "Stroke Rehabilitation (Adult)",
    condition: "Stroke",
    description: "AOTA Evidence-based management of adult stroke recovery",
    recommendations: [
      "Repetitive task practice",
      "Bimanual training",
      "Mental imagery",
      "Constraint-Induced Movement Therapy",
    ],
    assessments: [
      "Wolf Motor Function Test",
      "Fugl-Meyer Upper Extremity",
      "Chedoke-McMaster Stroke Assessment",
    ],
    interventions: [
      "ADL/IADL retraining",
      "Mirror therapy",
      "Weight-bearing facilitation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2015). Occupational Therapy Practice Guideline for Adults With Stroke.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-042",
    name: "Spinal Cord Injury Management (Adult)",
    condition: "SCI",
    description:
      "Occupational therapy for adults with spinal cord injury across all levels",
    recommendations: [
      "Adaptive equipment for self-care",
      "Pressure relief education",
      "Upper limb stabilization",
      "Sexual health education",
    ],
    assessments: [
      "SCIM",
      "FIM (Legacy)",
      "GRASSP (Graded Redefined Assessment of Sensation, Strength and Prehension)",
    ],
    interventions: [
      "Self-care training",
      "Tenodesis facilitation (if applicable)",
      "Wheelchair seating evaluation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2015). Occupational Therapy for Spinal Cord Injury.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-043",
    name: "Traumatic Brain Injury (Adult Physical)",
    condition: "TBI",
    description:
      "Physical and functional recovery strategies following adult TBI",
    recommendations: [
      "Arousal and attention protocols",
      "Dual-task training",
      "Errorless learning",
      "Environmental adaptation",
    ],
    assessments: [
      "Rivermead Behavioral Memory Test",
      "Executive Function Performance Test (EFPT)",
      "TMT",
    ],
    interventions: [
      "Cognitive-functional training",
      "Social participation facilitation",
      "Visual rehabilitation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2015). Occupational Therapy for Traumatic Brain Injury.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-044",
    name: "Hand and Upper Extremity (Distal Radius Fracture)",
    condition: "Fracture",
    description:
      "Post-fracture rehabilitation and wrist/hand functional training (AOTA/ASHT)",
    recommendations: [
      "Early protected motion",
      "Edema management",
      "Blocking exercises",
      "Scar management",
    ],
    assessments: [
      "DASH (Disabilities of the Arm, Shoulder and Hand)",
      "Grip/Pinch Strength",
      "Michigan Hand Questionnaire",
    ],
    interventions: [
      "Custom orthoses fabrication",
      "Desensitization",
      "Functional use retraining",
    ],
    evidenceLevel: 1,
    source: "AOTA/ASHT",
    citation: "AOTA (2018). Interventions for Distal Radius Fracture.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-045",
    name: "Parkinson's Disease (Adult Physical)",
    condition: "Parkinson's Disease",
    description:
      "Evidence-based OT for maintaining functional participation in PD",
    recommendations: [
      "Cued gait transitions",
      "Fall prevention education",
      "Simplified kitchen/ADL environment",
      "Micrographia management",
    ],
    assessments: [
      "Unified Parkinson's Disease Rating Scale (UPDRS)",
      "COPM",
      "Modified Ashworth Scale",
    ],
    interventions: [
      "Amplitude-based training (LSVT BIG)",
      "Energy conservation",
      "Cognitive cueing training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2014). OT Practice Guideline for Adults With Neurodegenerative Diseases.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-046",
    name: "Multiple Sclerosis (Adult Physical)",
    condition: "Multiple Sclerosis",
    description:
      "OT role in managing physical fatigue and functional decline in MS",
    recommendations: [
      "Fatigue management (FACETS)",
      "Cooling protocols during exercise",
      "Adaptive equipment for tremor",
      "Home computer use modification",
    ],
    assessments: [
      "Fatigue Severity Scale",
      "Nine-Hole Peg Test",
      "MSFC (Multiple Sclerosis Functional Composite)",
    ],
    interventions: [
      "Energy conservation education",
      "Ataxia/Tremor management techniques",
      "Job modification consultation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2014). OT Practice Guideline for Adults With Neurodegenerative Diseases.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-047",
    name: "Hip and Knee Arthroplasty Recovery",
    condition: "Post-Surgical",
    description: "Ensuring safe return to ADLs post-joint replacement",
    recommendations: [
      "Total hip precautions (Posterior/Anterior)",
      "Adaptive equipment (reacher, sock aid)",
      "Gait safety with assistive device",
      "Home management (getting in/out of bed)",
    ],
    assessments: ["Harris Hip Score", "Oxford Knee Score", "FIM"],
    interventions: [
      "ADL retraining with precautions",
      "Equipment training",
      "Home safety assessment",
    ],
    evidenceLevel: 1,
    source: "AOTA/AAOS",
    citation: "AOTA (2017). Orthopedic Rehabilitation Standards.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-048",
    name: "Cardiovascular Rehab (Adult OT)",
    condition: "Cardiovascular",
    description:
      "OT interventions for managing ADL participation post-MI and heart failure",
    recommendations: [
      "Sternal precautions education",
      "MET level monitoring during ADLs",
      "Breathlessness management training",
    ],
    assessments: ["Borg RPE Scale", "NYHA Functional Classification"],
    interventions: [
      "Graded activity progression",
      "Lifestyle modification",
      "Cardiac-safe ADL training",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2019). Occupational Therapy and Cardiac Rehabilitation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-049",
    name: "Chronic Pain Management (OT)",
    condition: "Chronic Pain",
    description:
      "Biopsychosocial OT approach to chronic pain and functional limiting",
    recommendations: [
      "Pacing techniques",
      "Body mechanics during occupations",
      "Stress management",
      "Sleep hygiene enhancement",
    ],
    assessments: [
      "Brief Pain Inventory",
      "PSEQ (Pain Self-Efficacy Questionnaire)",
      "COPM",
    ],
    interventions: [
      "Activity grading",
      "Relaxation techniques",
      "Occupational role restoration",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Occupational Therapy in Pain Management.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-050",
    name: "Lymphedema Management (Adult)",
    condition: "Lymphedema",
    description:
      "OT interventions for upper and lower limb lymphedema secondary to cancer or trauma",
    recommendations: [
      "Complete Decongestive Therapy (CDT)",
      "Skin care protocols",
      "Compression garment education",
      "Functional limb activity monitoring",
    ],
    assessments: [
      "Circumferential measurement",
      "Lymphoedema Life Impact Questionnaire (LLIQ)",
    ],
    interventions: [
      "Manual Lymphatic Drainage (MLD) techniques",
      "Bandaging",
      "Self-management coaching",
    ],
    evidenceLevel: 2,
    source: "AOTA/ALN",
    citation: "AOTA (2021). Lymphedema Best Practice Guidelines.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getAllOTAdultPhysicalGuidelines(): OTAdultPhysicalGuideline[] {
  return [...guidelines];
}

export function getOTAdultPhysicalGuidelineById(
  id: string,
): OTAdultPhysicalGuideline | undefined {
  return guidelines.find((g) => g.id === id);
}

export function searchOTAdultPhysicalGuidelines(
  query: string,
): OTAdultPhysicalGuideline[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return guidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.condition.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery),
  );
}
