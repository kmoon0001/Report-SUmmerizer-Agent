/**
 * PT Guidelines - CMS & Red Flags
 * CMS Local Coverage Determinations and clinical red flags for PT
 */



export interface PTRedFlagGuideline {
  id: string;
  name: string;
  category: string;
  description: string;
  redFlags: string[];
  contraindications: string[];
  referralCriteria: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const guidelines: PTRedFlagGuideline[] = [
  {
    id: "gl-pt-021",
    name: "CMS Local Coverage Determinations (LCD)",
    category: "CMS Coverage",
    description:
      "Medicare coverage requirements and documentation standards for PT services",
    redFlags: [
      "Lack of functional improvement",
      "No clear rehabilitation potential",
      "Maintenance therapy only",
    ],
    contraindications: [
      "Patient refusal",
      "No medical necessity",
      "No physician referral",
    ],
    referralCriteria: [
      "Functional limitation present",
      "Skilled intervention needed",
      "In-person evaluation required",
    ],
    evidenceLevel: 1,
    source: "CMS",
    citation: "CMS (2024). Local Coverage Determinations for Physical Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-022",
    name: "Serious Spinal Pathology Red Flags",
    category: "Red Flags",
    description:
      "Clinical indicators suggesting malignancy, infection, or fracture in the spine",
    redFlags: [
      "Unexplained weight loss",
      "Night pain/pain at rest",
      "Fever/chills",
      "Saddle anesthesia",
      "Bowel/bladder dysfunction",
    ],
    contraindications: [
      "Spinal manipulation if fracture suspected",
      "Joint mobilization if infection present",
    ],
    referralCriteria: [
      "Immediate medical workup",
      "Neurological consultation",
      "Emergency imaging",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Red Flags for Serious Spinal Pathology.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-023",
    name: "Cardiovascular Adverse Events Red Flags",
    category: "Red Flags",
    description:
      "Indicators of cardiovascular instability requiring immediate referral",
    redFlags: [
      "Unstable angina",
      "Resting HR >100 or <50 bpm",
      "Systolic BP >200 or <90 mmHg",
      "Sudden dyspnea",
    ],
    contraindications: [
      "Exercise if vital symbols unstable",
      "Chest pain during exertion",
    ],
    referralCriteria: [
      "Emergency medical services (911)",
      "Cardiac consultation before further therapy",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cardiovascular Safety in Physical Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-024",
    name: "Acute Neurological Red Flags",
    category: "Red Flags",
    description:
      "Clinical indicators of acute stroke or intracranial neurological events",
    redFlags: [
      "Sudden facial drooping",
      "Unilateral arm weakness",
      "Slurred speech (FAST)",
      "Vision loss",
      "Vomiting with headache",
    ],
    contraindications: ["Forced exertion during acute neurological crisis"],
    referralCriteria: [
      "Emergency room evaluation",
      "Immediate stroke protocol activation",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Neurological Emergencies in Rehabilitation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-025",
    name: "Musculoskeletal Absolute Contraindications",
    category: "Contraindications",
    description:
      " Situations where physical therapy intervention is strictly prohibited",
    redFlags: [
      "Clinical instability of bone/joint",
      "Acute post-surgical hemorrhage",
      "Unmanaged pulmonary embolism",
    ],
    contraindications: [
      "Any therapy to involved limb",
      "Passive movement of unstable fracture",
    ],
    referralCriteria: ["Surgical consultation", "Trauma stabilization"],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Contraindications to Physical Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-026",
    name: "Geriatric Fall Risk Criteria (CMS)",
    category: "CMS Coverage",
    description:
      "Medicare criteria for fall prevention and safety-based physical therapy",
    redFlags: [
      "Two or more falls in past 12 months",
      "Significant fear of falling",
      "Unable to stand without assistance",
    ],
    contraindications: [
      "Forcing balance activity on patient with unmanaged dizziness",
    ],
    referralCriteria: [
      "Home safety evaluation",
      "Ophthalmology consultation",
      "Medication review",
    ],
    evidenceLevel: 1,
    source: "CMS",
    citation:
      "CMS (2024). Fall Prevention Guidelines for Geriatric Beneficiaries.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-027",
    name: "Post-Surgical General Protocol (APTA)",
    category: "APTA Standards",
    description:
      "Standard clinical expectations for managing post-surgical PT patients",
    redFlags: [
      "Excessive drainage/infection signs",
      "Unexpected neural deficit post-op",
      "Deep Vein Thrombosis (DVT) signs (Wells Criteria)",
    ],
    contraindications: [
      "Active movement beyond specified surgical precautions",
      "Submersion of wound if not healed",
    ],
    referralCriteria: [
      "Orthopedic surgeon immediate notification",
      "Vascular workup for DVT suspicion",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2018). Post-Operative Management Standards.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-028",
    name: "Skin and Wound Red Flags",
    category: "Red Flags",
    description:
      "Indicators of serious integumentary issues in physical therapy",
    redFlags: [
      "Suspected stage 3/4 pressure injury",
      "Ischemic ulcer progression",
      "Dermal infection (Cellulitis)",
    ],
    contraindications: [
      "Direct pressure on ischemic area",
      "Hot packs over impaired sensation regions",
    ],
    referralCriteria: [
      "Wound care specialist referral",
      "Vascular studies if arterial insufficiency suspected",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2015). Integumentary Guidelines in Rehabilitation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-029",
    name: "Home Health Eligibility (CMS)",
    category: "CMS Coverage",
    description: "Homebound status and eligibility for Part A PT services",
    redFlags: [
      "Inability to leave home without taxing effort",
      "Safety risks with community ambulation",
    ],
    contraindications: ["Stable condition manageable in outpatient setting"],
    referralCriteria: [
      "Patient requires home-based environmental modification",
      "Transitions of care support needed",
    ],
    evidenceLevel: 1,
    source: "CMS",
    citation: "CMS (2024). Chapter 7 - Home Health Services Eligibility.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-030",
    name: "Telehealth Clinical Standards",
    category: "APTA Standards",
    description:
      "Rules and precautions for providing PT via telehealth platforms",
    redFlags: [
      "Lack of patient safety guardian if fall risk is high",
      "Technical failure preventing critical instruction",
    ],
    contraindications: [
      "Patient requires hands-on guarding for basic mobility",
      "Severe cognitive deficit without support",
    ],
    referralCriteria: [
      "Switch to in-person therapy if safety concerns persist",
      "Emergency local contact info must be available",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "APTA (2021). Standards for the Provision of Physical Therapy via Telehealth.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getPTRedFlagGuidelineById(
  id: string,
): PTRedFlagGuideline | undefined {
  try {
    if (!id || typeof id !== "string") return undefined;
    return guidelines.find((g) => g.id === id);
  } catch (error) {
    return undefined;
  }
}

export function getAllPTRedFlagGuidelines(): PTRedFlagGuideline[] {
  try {
    return [...guidelines];
  } catch (error) {
    return [];
  }
}

export function searchPTRedFlagGuidelines(query: string): PTRedFlagGuideline[] {
  try {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return guidelines.filter(
      (g) =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.category.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    return [];
  }
}

export function getPTRedFlagCategories(): string[] {
  try {
    return Array.from(new Set(guidelines.map((g) => g.category))).sort();
  } catch (error) {
    return [];
  }
}
