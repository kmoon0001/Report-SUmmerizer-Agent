/**
 * PT Module 2: Clinical Guidelines
 * APTA Clinical Practice Guidelines for common PT conditions
 * Sources: APTA Clinical Practice Guidelines, CMS Local Coverage Determinations, Evidence-based standards
 */

export interface PTClinicalGuideline {
  id: string;
  name: string;
  condition: string;
  year: number;
  description: string;
  keyRecommendations: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  expectedOutcomes: string[];
  contraindications: string[];
  precautions: string[];
  referralCriteria: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptClinicalGuidelines: PTClinicalGuideline[] = [
  {
    id: "pt-cg-001",
    name: "APTA Clinical Practice Guideline: Acute Low Back Pain",
    condition: "acute-low-back-pain",
    year: 2017,
    description:
      "Evidence-based guideline for management of acute low back pain (≤6 weeks duration)",
    keyRecommendations: [
      "Early mobilization and activity as tolerated",
      "Manual therapy combined with exercise",
      "Avoid prolonged bed rest",
      "Patient education on prognosis and self-management",
      "Consider imaging only if red flags present",
    ],
    assessmentFocus: [
      "Pain location and radiation",
      "Functional limitations",
      "Red flag screening",
      "Neurological examination",
      "Lumbar range of motion",
      "Muscle strength and endurance",
    ],
    interventionStrategies: [
      "Manual therapy (mobilization, manipulation)",
      "Therapeutic exercise (core stabilization)",
      "Modalities (heat, TENS)",
      "Patient education",
      "Ergonomic training",
      "Progressive functional training",
    ],
    expectedOutcomes: [
      "Reduced pain (VAS/NPRS)",
      "Improved functional capacity",
      "Return to work/activities",
      "Improved quality of life",
      "Prevention of chronicity",
    ],
    contraindications: [
      "Spinal cord compression",
      "Cauda equina syndrome",
      "Fracture",
      "Infection",
      "Malignancy",
    ],
    precautions: [
      "Monitor for progressive neurological deficits",
      "Avoid aggressive manipulation if radiculopathy present",
      "Monitor vital signs in elderly patients",
    ],
    referralCriteria: [
      "Persistent symptoms >6 weeks",
      "Progressive neurological deficits",
      "Red flag symptoms",
      "Failed conservative treatment",
    ],
    source: "APTA",
    citation:
      "Delitto A, et al. Low back pain. J Orthop Sports Phys Ther. 2012;42(4):A1-57.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-002",
    name: "APTA Clinical Practice Guideline: Chronic Low Back Pain",
    condition: "chronic-low-back-pain",
    year: 2017,
    description:
      "Evidence-based guideline for management of chronic low back pain (>12 weeks duration)",
    keyRecommendations: [
      "Multimodal approach combining exercise, manual therapy, and behavioral strategies",
      "Progressive exercise program with emphasis on core stability",
      "Cognitive behavioral therapy",
      "Workplace modifications",
      "Regular reassessment and progression",
    ],
    assessmentFocus: [
      "Functional capacity evaluation",
      "Psychosocial factors",
      "Work-related activities",
      "Endurance and strength",
      "Movement patterns",
      "Quality of life",
    ],
    interventionStrategies: [
      "Progressive strengthening program",
      "Flexibility and mobility training",
      "Work conditioning",
      "Behavioral modification",
      "Ergonomic training",
      "Pain management strategies",
    ],
    expectedOutcomes: [
      "Improved functional capacity",
      "Return to work",
      "Reduced pain",
      "Improved quality of life",
      "Prevention of recurrence",
    ],
    contraindications: [
      "Spinal cord compression",
      "Cauda equina syndrome",
      "Fracture",
      "Infection",
      "Malignancy",
    ],
    precautions: [
      "Monitor for depression and anxiety",
      "Avoid overtreatment",
      "Monitor for medication dependency",
      "Consider multidisciplinary approach",
    ],
    referralCriteria: [
      "Significant psychological distress",
      "Failed conservative treatment",
      "Surgical candidacy evaluation",
      "Substance abuse concerns",
    ],
    source: "APTA",
    citation:
      "Delitto A, et al. Low back pain. J Orthop Sports Phys Ther. 2012;42(4):A1-57.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-003",
    name: "APTA Clinical Practice Guideline: Neck Pain",
    condition: "neck-pain",
    year: 2017,
    description:
      "Evidence-based guideline for management of neck pain with or without headache",
    keyRecommendations: [
      "Early mobilization and activity",
      "Manual therapy combined with exercise",
      "Cervical stabilization exercises",
      "Postural training",
      "Patient education on prognosis",
    ],
    assessmentFocus: [
      "Pain location and radiation",
      "Neurological examination",
      "Cervical range of motion",
      "Muscle strength and endurance",
      "Postural assessment",
      "Functional limitations",
    ],
    interventionStrategies: [
      "Manual therapy (mobilization, manipulation)",
      "Therapeutic exercise (stabilization)",
      "Postural correction",
      "Ergonomic training",
      "Modalities (heat, TENS)",
      "Progressive functional training",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved cervical mobility",
      "Improved functional capacity",
      "Return to activities",
      "Prevention of chronicity",
    ],
    contraindications: [
      "Vertebral artery insufficiency",
      "Myelopathy",
      "Fracture",
      "Infection",
      "Malignancy",
    ],
    precautions: [
      "Screen for vertebral artery insufficiency before manipulation",
      "Monitor for progressive neurological deficits",
      "Avoid aggressive manipulation",
    ],
    referralCriteria: [
      "Progressive neurological deficits",
      "Myelopathy symptoms",
      "Failed conservative treatment",
      "Severe headaches",
    ],
    source: "APTA",
    citation:
      "Blanpied PR, et al. Neck pain: revision 2017. J Orthop Sports Phys Ther. 2017;47(7):A1-A83.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-004",
    name: "APTA Clinical Practice Guideline: Shoulder Pain",
    condition: "shoulder-pain",
    year: 2016,
    description:
      "Evidence-based guideline for management of shoulder pain and dysfunction",
    keyRecommendations: [
      "Early mobilization and activity",
      "Rotator cuff strengthening",
      "Scapular stabilization",
      "Manual therapy combined with exercise",
      "Progressive functional training",
    ],
    assessmentFocus: [
      "Shoulder range of motion",
      "Rotator cuff strength",
      "Scapular positioning and movement",
      "Neurological examination",
      "Functional limitations",
      "Impingement signs",
    ],
    interventionStrategies: [
      "Manual therapy (mobilization, soft tissue)",
      "Rotator cuff strengthening",
      "Scapular stabilization exercises",
      "Proprioceptive training",
      "Modalities (heat, ultrasound)",
      "Progressive functional training",
    ],
    expectedOutcomes: [
      "Improved shoulder mobility",
      "Improved strength",
      "Reduced pain",
      "Return to activities",
      "Prevention of recurrence",
    ],
    contraindications: [
      "Fracture",
      "Dislocation",
      "Severe rotator cuff tear",
      "Infection",
    ],
    precautions: [
      "Monitor for progressive weakness",
      "Avoid aggressive stretching in early phase",
      "Monitor for complex regional pain syndrome",
    ],
    referralCriteria: [
      "Severe rotator cuff tear",
      "Failed conservative treatment",
      "Surgical candidacy evaluation",
      "Progressive neurological deficits",
    ],
    source: "APTA",
    citation:
      "Michener LA, et al. Shoulder pain: revision 2015. J Orthop Sports Phys Ther. 2016;46(5):A1-A37.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-005",
    name: "APTA Clinical Practice Guideline: Knee Osteoarthritis",
    condition: "knee-osteoarthritis",
    year: 2020,
    description:
      "Evidence-based guideline for management of knee osteoarthritis",
    keyRecommendations: [
      "Exercise program (strengthening and aerobic)",
      "Weight management",
      "Manual therapy",
      "Activity modification",
      "Patient education",
    ],
    assessmentFocus: [
      "Knee range of motion",
      "Muscle strength",
      "Functional capacity",
      "Pain level",
      "Gait analysis",
      "Quality of life",
    ],
    interventionStrategies: [
      "Strengthening exercises (quadriceps, hip)",
      "Aerobic exercise",
      "Manual therapy (mobilization)",
      "Weight management counseling",
      "Activity modification",
      "Assistive devices",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved function",
      "Improved strength",
      "Improved quality of life",
      "Delayed progression",
    ],
    contraindications: ["Severe joint damage", "Infection", "Fracture"],
    precautions: [
      "Monitor for increased pain",
      "Avoid high-impact activities",
      "Monitor for other joint involvement",
    ],
    referralCriteria: [
      "Failed conservative treatment",
      "Surgical candidacy evaluation",
      "Severe functional limitation",
    ],
    source: "APTA",
    citation:
      "Kolasinski SL, et al. 2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee. Arthritis Rheumatol. 2020;72(2):220-233.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-006",
    name: "APTA Clinical Practice Guideline: Hip Osteoarthritis",
    condition: "hip-osteoarthritis",
    year: 2020,
    description:
      "Evidence-based guideline for management of hip osteoarthritis",
    keyRecommendations: [
      "Exercise program (strengthening and aerobic)",
      "Weight management",
      "Manual therapy",
      "Activity modification",
      "Patient education",
    ],
    assessmentFocus: [
      "Hip range of motion",
      "Muscle strength",
      "Functional capacity",
      "Pain level",
      "Gait analysis",
      "Quality of life",
    ],
    interventionStrategies: [
      "Strengthening exercises (hip, core)",
      "Aerobic exercise",
      "Manual therapy (mobilization)",
      "Weight management counseling",
      "Activity modification",
      "Assistive devices",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved function",
      "Improved strength",
      "Improved quality of life",
      "Delayed progression",
    ],
    contraindications: ["Severe joint damage", "Infection", "Fracture"],
    precautions: [
      "Monitor for increased pain",
      "Avoid high-impact activities",
      "Monitor for other joint involvement",
    ],
    referralCriteria: [
      "Failed conservative treatment",
      "Surgical candidacy evaluation",
      "Severe functional limitation",
    ],
    source: "APTA",
    citation:
      "Kolasinski SL, et al. 2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee. Arthritis Rheumatol. 2020;72(2):220-233.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-007",
    name: "APTA Clinical Practice Guideline: Stroke",
    condition: "stroke",
    year: 2014,
    description:
      "Evidence-based guideline for management of acute stroke and post-stroke rehabilitation",
    keyRecommendations: [
      "Early mobilization",
      "Task-specific training",
      "Repetitive practice",
      "Intensity and duration of therapy",
      "Interdisciplinary approach",
    ],
    assessmentFocus: [
      "Neurological examination",
      "Functional capacity",
      "Balance and gait",
      "Upper extremity function",
      "Cognitive status",
      "Swallowing",
    ],
    interventionStrategies: [
      "Task-specific training",
      "Repetitive practice",
      "Balance training",
      "Gait training",
      "Upper extremity training",
      "Functional training",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Improved balance",
      "Improved gait",
      "Improved functional independence",
      "Return to community",
    ],
    contraindications: [
      "Acute medical instability",
      "Severe cognitive impairment",
      "Severe behavioral issues",
    ],
    precautions: [
      "Monitor vital signs",
      "Monitor for fatigue",
      "Monitor for depression",
      "Prevent falls",
    ],
    referralCriteria: [
      "Plateau in progress",
      "Significant cognitive impairment",
      "Behavioral issues",
      "Medical complications",
    ],
    source: "APTA",
    citation:
      "Winstein CJ, et al. Guidelines for Adult Stroke Rehabilitation and Recovery. Stroke. 2016;47(6):e98-e169.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-008",
    name: "APTA Clinical Practice Guideline: Parkinson's Disease",
    condition: "parkinsons-disease",
    year: 2018,
    description:
      "Evidence-based guideline for management of Parkinson's disease",
    keyRecommendations: [
      "Exercise program (aerobic, strengthening, flexibility)",
      "Balance and gait training",
      "Cueing strategies",
      "Fall prevention",
      "Interdisciplinary approach",
    ],
    assessmentFocus: [
      "Motor symptoms (tremor, rigidity, bradykinesia)",
      "Balance and gait",
      "Functional capacity",
      "Cognitive status",
      "Fall risk",
      "Quality of life",
    ],
    interventionStrategies: [
      "Aerobic exercise",
      "Strengthening exercises",
      "Balance training",
      "Gait training with cueing",
      "Fall prevention strategies",
      "Functional training",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Improved balance",
      "Improved gait",
      "Reduced fall risk",
      "Improved quality of life",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe behavioral issues",
      "Acute medical instability",
    ],
    precautions: [
      "Monitor for medication effects",
      "Monitor for freezing episodes",
      "Monitor for postural hypotension",
      "Prevent falls",
    ],
    referralCriteria: [
      "Plateau in progress",
      "Significant cognitive impairment",
      "Behavioral issues",
      "Medical complications",
    ],
    source: "APTA",
    citation:
      "Keus SH, et al. European Physiotherapy Guideline for Parkinson's Disease. EFNS Task Force. Eur J Neurol. 2014;21(1):16-34.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cg-009",
    name: "APTA Clinical Practice Guideline: Multiple Sclerosis",
    condition: "multiple-sclerosis",
    year: 2017,
    description:
      "Evidence-based guideline for management of multiple sclerosis",
    keyRecommendations: [
      "Exercise program (aerobic, strengthening, flexibility)",
      "Balance and gait training",
      "Fatigue management",
      "Cognitive rehabilitation",
      "Interdisciplinary approach",
    ],
    assessmentFocus: [
      "Neurological examination",
      "Balance and gait",
      "Functional capacity",
      "Fatigue level",
      "Cognitive status",
      "Quality of life",
    ],
    interventionStrategies: [
      "Aerobic exercise",
      "Strengthening exercises",
      "Balance training",
      "Gait training",
      "Fatigue management strategies",
      "Functional training",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Improved balance",
      "Improved gait",
      "Reduced fatigue",
      "Improved quality of life",
    ],
    contraindications: [
      "Acute exacerbation",
      "Severe cognitive impairment",
      "Severe behavioral issues",
    ],
    precautions: [
      "Monitor for heat sensitivity",
      "Monitor for fatigue",
      "Monitor for cognitive changes",
      "Prevent falls",
    ],
    referralCriteria: [
      "Plateau in progress",
      "Significant cognitive impairment",
      "Behavioral issues",
      "Medical complications",
    ],
    source: "APTA",
    citation:
      "Giesser B. Neurological Rehabilitation. In: Burks JS, Johnson KP, eds. Multiple Sclerosis: Diagnosis, Medical Management, and Rehabilitation. New York: Demos Medical Publishing; 2000.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT clinical guideline by ID
 */
export function getPTClinicalGuidelineById(
  id: string,
): PTClinicalGuideline | undefined {
  return ptClinicalGuidelines.find((g) => g.id === id);
}

/**
 * Get PT clinical guidelines by condition
 */
export function getPTClinicalGuidelinesByCondition(
  condition: string,
): PTClinicalGuideline[] {
  return ptClinicalGuidelines.filter((g) => g.condition === condition);
}

/**
 * Search PT clinical guidelines
 */
export function searchPTClinicalGuidelines(
  query: string,
): PTClinicalGuideline[] {
  const lowerQuery = query.toLowerCase();
  return ptClinicalGuidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.condition.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT clinical guidelines
 */
export function getAllPTClinicalGuidelines(): PTClinicalGuideline[] {
  return ptClinicalGuidelines;
}

/**
 * Get PT clinical guidelines by year
 */
export function getPTClinicalGuidelinesByYear(
  year: number,
): PTClinicalGuideline[] {
  return ptClinicalGuidelines.filter((g) => g.year === year);
}

/**
 * Get PT clinical guideline conditions
 */
export function getPTClinicalGuidelineConditions(): string[] {
  const conditions = new Set(ptClinicalGuidelines.map((g) => g.condition));
  return Array.from(conditions);
}
