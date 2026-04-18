/**
 * PT Module 8: Specialty Areas
 * Comprehensive specialty area protocols for physical therapy
 * Evidence-based protocols from APTA specialty sections
 */

export interface PTSpecialtyArea {
  id: string;
  name: string;
  abbreviation: string;
  specialty: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  assessmentTools: string[];
  interventionStrategies: string[];
  expectedOutcomes: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptSpecialtyAreasData: PTSpecialtyArea[] = [
  {
    id: "pt-spec-001",
    name: "Cardiovascular Rehabilitation",
    abbreviation: "CR",
    specialty: "cardiovascular",
    description:
      "Comprehensive rehabilitation for cardiac patients and cardiovascular disease management",
    indications: [
      "Post-MI",
      "Heart failure",
      "Cardiac surgery",
      "Arrhythmia",
      "Hypertension",
    ],
    contraindications: [
      "Acute MI",
      "Unstable angina",
      "Uncontrolled arrhythmia",
      "Severe heart failure",
    ],
    precautions: [
      "Continuous monitoring",
      "RPE monitoring",
      "Vital sign assessment",
      "Medication awareness",
    ],
    assessmentTools: [
      "6-Minute Walk Test",
      "Graded Exercise Test",
      "Borg RPE Scale",
      "Cardiac risk stratification",
    ],
    interventionStrategies: [
      "Aerobic conditioning",
      "Resistance training",
      "Flexibility training",
      "Psychosocial support",
      "Education",
    ],
    expectedOutcomes: [
      "Improved exercise tolerance",
      "Reduced cardiac risk",
      "Enhanced quality of life",
      "Return to activities",
    ],
    evidenceLevel: 2,
    source: "APTA Cardiovascular and Pulmonary Section",
    citation:
      "American Physical Therapy Association (2023). Cardiovascular Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-002",
    name: "Pulmonary Rehabilitation",
    abbreviation: "PR",
    specialty: "pulmonary",
    description:
      "Rehabilitation for patients with chronic respiratory conditions and pulmonary disease",
    indications: [
      "COPD",
      "Asthma",
      "Cystic fibrosis",
      "Pulmonary fibrosis",
      "Post-lung surgery",
    ],
    contraindications: [
      "Acute respiratory distress",
      "Uncontrolled asthma",
      "Severe hypoxemia",
    ],
    precautions: [
      "Oxygen saturation monitoring",
      "Breathing pattern assessment",
      "Fatigue management",
    ],
    assessmentTools: [
      "6-Minute Walk Test",
      "Pulmonary Function Tests",
      "Dyspnea Scale",
      "Oxygen saturation monitoring",
    ],
    interventionStrategies: [
      "Aerobic conditioning",
      "Breathing techniques",
      "Airway clearance",
      "Energy conservation",
      "Education",
    ],
    expectedOutcomes: [
      "Improved exercise tolerance",
      "Reduced dyspnea",
      "Enhanced functional capacity",
      "Better quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Cardiovascular and Pulmonary Section",
    citation:
      "American Physical Therapy Association (2023). Pulmonary Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-003",
    name: "Neurological Rehabilitation",
    abbreviation: "NR",
    specialty: "neurological",
    description:
      "Rehabilitation for patients with neurological disorders and brain/spinal cord injuries",
    indications: [
      "Stroke",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Spinal cord injury",
      "Traumatic brain injury",
    ],
    contraindications: [
      "Acute neurological event",
      "Uncontrolled seizures",
      "Severe cognitive impairment",
    ],
    precautions: [
      "Fall risk assessment",
      "Seizure precautions",
      "Cognitive limitations",
      "Behavioral changes",
    ],
    assessmentTools: [
      "NIHSS",
      "Berg Balance Scale",
      "Fugl-Meyer Assessment",
      "MoCA",
      "Timed Up and Go",
    ],
    interventionStrategies: [
      "Task-specific training",
      "Balance training",
      "Gait training",
      "Neuroplasticity-based exercises",
      "Cognitive training",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Enhanced balance",
      "Increased independence",
      "Better quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Neurology Section",
    citation:
      "American Physical Therapy Association (2023). Neurological Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-004",
    name: "Orthopedic Surgery Rehabilitation",
    abbreviation: "OSR",
    specialty: "orthopedic",
    description:
      "Post-operative rehabilitation following orthopedic surgical procedures",
    indications: [
      "Joint replacement",
      "Arthroscopy",
      "Fracture repair",
      "Ligament reconstruction",
      "Rotator cuff repair",
    ],
    contraindications: [
      "Acute post-operative complications",
      "Infection",
      "Unhealed incision",
    ],
    precautions: [
      "Surgical precautions",
      "Weight-bearing restrictions",
      "Range of motion limitations",
      "Swelling management",
    ],
    assessmentTools: [
      "ROM measurement",
      "Strength testing",
      "Functional assessment",
      "Pain scales",
      "Swelling measurement",
    ],
    interventionStrategies: [
      "Progressive ROM",
      "Strengthening",
      "Functional training",
      "Swelling management",
      "Scar tissue management",
    ],
    expectedOutcomes: [
      "Restored ROM",
      "Improved strength",
      "Functional independence",
      "Return to activities",
    ],
    evidenceLevel: 2,
    source: "APTA Orthopedic Section",
    citation:
      "American Physical Therapy Association (2023). Orthopedic Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-005",
    name: "Geriatric Rehabilitation",
    abbreviation: "GR",
    specialty: "geriatric",
    description:
      "Specialized rehabilitation for elderly patients with age-related conditions",
    indications: [
      "Fall risk",
      "Frailty",
      "Cognitive decline",
      "Multiple comorbidities",
      "Functional decline",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe cognitive impairment",
      "Uncontrolled medical disease",
    ],
    precautions: [
      "Fall prevention",
      "Medication interactions",
      "Cognitive limitations",
      "Caregiver involvement",
    ],
    assessmentTools: [
      "Timed Up and Go",
      "Berg Balance Scale",
      "SPPB",
      "Functional Reach Test",
      "Geriatric Depression Scale",
    ],
    interventionStrategies: [
      "Balance training",
      "Strength training",
      "Functional training",
      "Fall prevention",
      "Cognitive engagement",
    ],
    expectedOutcomes: [
      "Improved balance",
      "Reduced fall risk",
      "Maintained independence",
      "Enhanced quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Geriatrics Section",
    citation:
      "American Physical Therapy Association (2023). Geriatric Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-006",
    name: "Pediatric Rehabilitation",
    abbreviation: "PedR",
    specialty: "pediatric",
    description:
      "Specialized rehabilitation for children with developmental and acquired disorders",
    indications: [
      "Cerebral palsy",
      "Developmental delay",
      "Pediatric fracture",
      "Juvenile arthritis",
      "Congenital disorder",
    ],
    contraindications: [
      "Acute illness",
      "Uncontrolled seizures",
      "Severe behavioral issues",
    ],
    precautions: [
      "Age-appropriate activities",
      "Parental involvement",
      "Play-based learning",
      "Growth considerations",
    ],
    assessmentTools: [
      "GMFM",
      "Peabody Developmental Scales",
      "Gross Motor Function Classification",
      "Functional assessment",
    ],
    interventionStrategies: [
      "Play-based therapy",
      "Developmental training",
      "Family education",
      "Adaptive equipment",
      "School coordination",
    ],
    expectedOutcomes: [
      "Improved motor development",
      "Enhanced functional skills",
      "Better school participation",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Pediatrics Section",
    citation:
      "American Physical Therapy Association (2023). Pediatric Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-007",
    name: "Women's Health Rehabilitation",
    abbreviation: "WHR",
    specialty: "womens-health",
    description:
      "Specialized rehabilitation for women's health conditions including pelvic floor dysfunction",
    indications: [
      "Pelvic floor dysfunction",
      "Incontinence",
      "Pelvic pain",
      "Post-partum recovery",
      "Lymphedema",
    ],
    contraindications: ["Acute infection", "Severe pain", "Active bleeding"],
    precautions: [
      "Privacy and comfort",
      "Pelvic floor awareness",
      "Psychosocial factors",
      "Medication effects",
    ],
    assessmentTools: [
      "Pelvic floor assessment",
      "Functional assessment",
      "Pain scales",
      "Quality of life measures",
    ],
    interventionStrategies: [
      "Pelvic floor training",
      "Behavioral modification",
      "Manual therapy",
      "Education",
      "Psychosocial support",
    ],
    expectedOutcomes: [
      "Improved continence",
      "Reduced pelvic pain",
      "Enhanced sexual function",
      "Better quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Women's Health Section",
    citation:
      "American Physical Therapy Association (2023). Women's Health Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-008",
    name: "Sports Physical Therapy",
    abbreviation: "SPT",
    specialty: "sports",
    description:
      "Specialized rehabilitation for athletic injuries and return to sport",
    indications: [
      "Sports injury",
      "Overuse injury",
      "Return to sport",
      "Athletic performance",
      "Injury prevention",
    ],
    contraindications: ["Acute injury", "Incomplete healing", "Severe pain"],
    precautions: [
      "Progressive loading",
      "Sport-specific mechanics",
      "Injury prevention",
      "Performance optimization",
    ],
    assessmentTools: [
      "Sport-specific testing",
      "Functional movement assessment",
      "Strength testing",
      "Agility testing",
    ],
    interventionStrategies: [
      "Sport-specific training",
      "Injury prevention",
      "Performance enhancement",
      "Return to sport progression",
    ],
    expectedOutcomes: [
      "Safe return to sport",
      "Improved athletic performance",
      "Reduced re-injury risk",
      "Enhanced confidence",
    ],
    evidenceLevel: 2,
    source: "APTA Sports Physical Therapy Section",
    citation:
      "American Physical Therapy Association (2023). Sports Physical Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-009",
    name: "Wound Care and Lymphedema",
    abbreviation: "WCL",
    specialty: "wound-care",
    description:
      "Specialized management of wounds, lymphedema, and related conditions",
    indications: [
      "Chronic wound",
      "Lymphedema",
      "Venous insufficiency",
      "Diabetic ulcer",
      "Post-surgical swelling",
    ],
    contraindications: [
      "Active infection",
      "Acute cellulitis",
      "Uncontrolled diabetes",
    ],
    precautions: [
      "Infection control",
      "Skin integrity",
      "Circulation assessment",
      "Compression tolerance",
    ],
    assessmentTools: [
      "Wound assessment",
      "Lymphedema measurement",
      "Circulation testing",
      "Functional assessment",
    ],
    interventionStrategies: [
      "Wound care",
      "Compression therapy",
      "Manual lymph drainage",
      "Exercise",
      "Skin care education",
    ],
    expectedOutcomes: [
      "Improved wound healing",
      "Reduced lymphedema",
      "Enhanced circulation",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA Wound Management Section",
    citation:
      "American Physical Therapy Association (2023). Wound Care and Lymphedema Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-spec-010",
    name: "Vestibular Rehabilitation",
    abbreviation: "VR",
    specialty: "vestibular",
    description:
      "Specialized rehabilitation for vestibular disorders and balance dysfunction",
    indications: [
      "BPPV",
      "Vestibular neuritis",
      "Labyrinthitis",
      "Dizziness",
      "Balance disorder",
    ],
    contraindications: [
      "Acute vertigo",
      "Uncontrolled hypertension",
      "Severe cardiovascular disease",
    ],
    precautions: [
      "Dizziness management",
      "Fall prevention",
      "Gradual progression",
      "Habituation exercises",
    ],
    assessmentTools: [
      "Dix-Hallpike test",
      "Romberg test",
      "Gaze stabilization test",
      "Dynamic Gait Index",
    ],
    interventionStrategies: [
      "Canalith repositioning",
      "Gaze stabilization",
      "Balance training",
      "Habituation exercises",
      "Vestibular adaptation",
    ],
    expectedOutcomes: [
      "Reduced dizziness",
      "Improved balance",
      "Enhanced gaze stability",
      "Return to activities",
    ],
    evidenceLevel: 2,
    source: "APTA Vestibular Section",
    citation:
      "American Physical Therapy Association (2023). Vestibular Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get specialty area protocol by ID
 */
export function getPTSpecialtyAreaById(
  id: string,
): PTSpecialtyArea | undefined {
  return ptSpecialtyAreasData.find((sa) => sa.id === id);
}

/**
 * Get specialty area protocols by specialty
 */
export function getPTSpecialtyAreaBySpecialty(
  specialty: string,
): PTSpecialtyArea[] {
  return ptSpecialtyAreasData.filter((sa) => sa.specialty === specialty);
}

/**
 * Search specialty area protocols
 */
export function searchPTSpecialtyArea(query: string): PTSpecialtyArea[] {
  const lowerQuery = query.toLowerCase();
  return ptSpecialtyAreasData.filter(
    (sa) =>
      sa.name.toLowerCase().includes(lowerQuery) ||
      sa.abbreviation.toLowerCase().includes(lowerQuery) ||
      sa.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all specialty area protocols
 */
export function getAllPTSpecialtyAreas(): PTSpecialtyArea[] {
  return ptSpecialtyAreasData;
}

/**
 * Get specialty area specialties
 */
export function getPTSpecialtyAreaSpecialties(): string[] {
  return Array.from(new Set(ptSpecialtyAreasData.map((sa) => sa.specialty)));
}

/**
 * Get specialty area protocols for indication
 */
export function getPTSpecialtyAreaForIndication(
  indication: string,
): PTSpecialtyArea[] {
  return ptSpecialtyAreasData.filter((sa) =>
    sa.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}
