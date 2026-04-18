/**
 * OT Evidence-Based Guidelines - Geriatric & Cognitive
 * AOTA Clinical Practice Guidelines for older adults and cognitive health
 */



export interface OTGeriatricCognitiveGuideline {
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

const guidelines: OTGeriatricCognitiveGuideline[] = [
  {
    id: "gl-ot-051",
    name: "Dementia Care (Geriatric)",
    condition: "Dementia",
    description:
      "AOTA evidence-based interventions for dementia Across the Stages",
    recommendations: [
      "Environmental modification",
      "Caregiver training",
      "Meaningful occupation focus",
      "Safety/Risk management",
    ],
    assessments: [
      "MoCA",
      "Allen Cognitive Level Screen (ACLS)",
      "FES (Falls Efficacy Scale)",
    ],
    interventions: [
      "Validation therapy techniques",
      "Errorless learning",
      "Sensory stimulation protocols",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2015). Occupational Therapy Practice Guideline for Adults With Alzheimer’s Disease and Related Dementias.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-052",
    name: "Alzheimer's Disease (Functional Management)",
    condition: "Alzheimer's Disease",
    description:
      "Supporting IADL and ADL participation in progressive Alzheimer's",
    recommendations: [
      "Visual cueing/Sequencing",
      "Task simplification (Breaking down stages)",
      "Physical contact/Guiding during tasks",
    ],
    assessments: [
      "AMPS (Assessment of Motor and Process Skills)",
      "Functional Independent Measure (FIM)",
    ],
    interventions: [
      "Home modification recommendation",
      "Memory aides (calendars, digital reminders)",
      "Social participation support",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2014). OT Practice Guideline for Adults with Alzheimer's.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-053",
    name: "Mild Cognitive Impairment (MCI)",
    condition: "MCI",
    description:
      "Enhancing safety and preserving function in individuals with early-stage MCI",
    recommendations: [
      "Cognitive training tasks",
      "Metacognitive strategies",
      "Lifestyle modification",
      "Compensatory tools training",
    ],
    assessments: [
      "SLUMS (Saint Louis University Mental Status)",
      "Montreal Cognitive Assessment (MoCA)",
    ],
    interventions: [
      "Self-monitoring techniques",
      "External memory strategies training",
      "Health literacy coaching",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2018). Occupational Therapy and MCI Interventions.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-054",
    name: "Fall Prevention in Older Adults",
    condition: "Fall Risk",
    description:
      "Evidence-based multi-factorial fall prevention strategies from an OT perspective",
    recommendations: [
      "Home hazard assessment and removal",
      "Assistive device training",
      "Vision/Perceptual work",
      "Balance within ADLs training",
    ],
    assessments: [
      "TUG (Timed Up and Go)",
      "Berg Balance Scale",
      "STEADI (Stopping Elderly Accidents, Deaths & Injuries)",
    ],
    interventions: [
      "Home safety modification (Grab bars, rug removal)",
      "Functional balance exercises",
      "Fear of falling desensitization",
    ],
    evidenceLevel: 1,
    source: "AOTA/CDC",
    citation:
      "AOTA (2020). Fall Prevention in Older Adults Practice Guidelines.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-055",
    name: "Age-Related Low Vision Support",
    condition: "Low Vision",
    description:
      "Maximizing occupational performance in geriatric patients with vision loss (Macular Degeneration, Glaucoma)",
    recommendations: [
      "Lighting optimization",
      "Contrast enhancement",
      "Magnification education",
      "Non-visual task performance methods",
    ],
    assessments: [
      "LV-VFQ (Low Vision Visual Functioning Questionnaire)",
      "MNREAD Acuity Charts",
    ],
    interventions: [
      "Scanning technique training",
      "Tactile marking of home appliances",
      "Assistive technology for visual reading",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2016). Practice Guideline for Older Adults With Low Vision.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-056",
    name: "Home Safety and Aging in Place",
    condition: "Frailty",
    description:
      "Comprehensive environmental interventions for the geriatric population",
    recommendations: [
      "Accessibility modification (ramps, stair lifts)",
      "Universal design consultation",
      "Technology-enabled care (tele-health, alarms)",
    ],
    assessments: [
      "Westmead Home Safety Assessment",
      "SAAFE (Safety Assessment of Function and the Environment)",
    ],
    interventions: [
      "Environmental remodeling coaching",
      "Caregiver load reduction techniques",
      "Activity modification in residence",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2018). Home Safety and Performance Guide.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-057",
    name: "Driving and Community Mobility (Older Adult)",
    condition: "Geriatric Independence",
    description:
      "Ensuring safe community participation and transition from driving for seniors",
    recommendations: [
      "Driving cessation counseling",
      "Alternative transportation navigation",
      "Physical/cognitive screen for safety",
    ],
    assessments: [
      "TMT (Trail Making Test)",
      "Drake Health Screen for Driving",
      "Drive-Safe Assessment",
    ],
    interventions: [
      "Vision-motor rehabilitation",
      "Public transit navigation training",
      "Family transition planning",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "AOTA (2016). Occupational Therapy Practice Guideline for Driving and Community Mobility.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-058",
    name: "Palliative and End-of-Life OT",
    condition: "Palliative Care",
    description:
      "Maximizing quality of life and comfort in terminal geriatric illness",
    recommendations: [
      "Comfort positioning",
      "Meaningful occupation (legacy projects)",
      "Caregiver emotional support",
      "Symptom-limited activity grading",
    ],
    assessments: [
      "Palliative Performance Scale",
      "Quality of Life Inventory",
      "COPM",
    ],
    interventions: [
      "ADL assistance techniques for caregivers",
      "Energy conservation for final wishes",
      "Spiritual/Existential occupation support",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Occupational Therapy in Palliative Care.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-059",
    name: "Geriatric Mental Health (Depression/Anxiety)",
    condition: "Mental Health (Older Adult)",
    description:
      "Role of OT in addressing late-life depression and associated functional decline",
    recommendations: [
      "Behavioral activation",
      "Meaningful leisure engagement",
      "Sleep hygiene enhancement",
      "Social connection facilitation",
    ],
    assessments: [
      "Geriatric Depression Scale (GDS)",
      "PHQ-9",
      "Modified Interest Checklist",
    ],
    interventions: [
      "Occupational role restoration",
      "Relaxation/Mindfulness for seniors",
      "Community group linkage",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "AOTA (2017). Practice Guideline for Mental Health in Older Adults.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-060",
    name: "Chronic Disease Management (Geriatric)",
    condition: "Diabetes/Heart Disease",
    description:
      "OT interventions for self-management of multiple chronic conditions in aging",
    recommendations: [
      "Medication management training",
      "Symptom monitoring (BP, Glucose)",
      "Energy conservation for multi-morbidities",
    ],
    assessments: [
      "MedMaIDE (Medication Management Instrument for Deficiencies in the Elderly)",
      "COPM",
    ],
    interventions: [
      "Self-monitoring routine development",
      "Adherence strategies (visual/auditory aids)",
      "Lifestyle redesign",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "AOTA (2021). Occupational Therapy and Chronic Disease Management.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getAllOTGeriatricCognitiveGuidelines(): OTGeriatricCognitiveGuideline[] {
  return [...guidelines];
}

export function getOTGeriatricCognitiveGuidelineById(
  id: string,
): OTGeriatricCognitiveGuideline | undefined {
  return guidelines.find((g) => g.id === id);
}

export function searchOTGeriatricCognitiveGuidelines(
  query: string,
): OTGeriatricCognitiveGuideline[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return guidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.condition.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery),
  );
}
