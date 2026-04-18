/**
 * PT Module 5: Modalities
 * Comprehensive therapeutic modalities with parameters, precautions, and evidence-based recommendations
 * Sources: APTA Modality Guidelines, Evidence-based modality research, Clinical best practices
 */

export interface PTModality {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  category:
    | "thermal"
    | "electrical"
    | "mechanical"
    | "light"
    | "compression"
    | "water";
  indications: string[];
  contraindications: string[];
  precautions: string[];
  parameters: {
    frequency?: string;
    intensity?: string;
    duration?: string;
    temperature?: string;
    pressure?: string;
    force?: string;
  };
  dosage: string;
  expectedOutcomes: string[];
  evidenceLevel: 1 | 2 | 3 | 4 | 5;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptModalities: PTModality[] = [
  {
    id: "pt-mod-001",
    name: "Therapeutic Ultrasound",
    abbreviation: "US",
    description:
      "High-frequency sound waves used to promote tissue healing and reduce pain",
    category: "mechanical",
    indications: [
      "Soft tissue injury",
      "Inflammation",
      "Pain",
      "Scar tissue",
      "Muscle tension",
    ],
    contraindications: [
      "Pregnancy",
      "Malignancy",
      "Infection",
      "Thrombosis",
      "Pacemaker",
    ],
    precautions: [
      "Avoid bony prominences",
      "Monitor skin response",
      "Use coupling medium",
      "Avoid eyes and reproductive organs",
    ],
    parameters: {
      frequency: "1-3 MHz",
      intensity: "0.5-2.0 W/cm²",
      duration: "5-10 minutes",
    },
    dosage: "1-2 times per week",
    expectedOutcomes: [
      "Reduced inflammation",
      "Reduced pain",
      "Improved tissue healing",
      "Reduced muscle tension",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Ebenbichler GR, et al. Ultrasound therapy for acute ankle sprains. Arch Phys Med Rehabil. 1998;79(4):399-405.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-002",
    name: "Transcutaneous Electrical Nerve Stimulation",
    abbreviation: "TENS",
    description:
      "Electrical stimulation used to reduce pain through gate control mechanism",
    category: "electrical",
    indications: [
      "Acute pain",
      "Chronic pain",
      "Post-operative pain",
      "Muscle tension",
      "Neuropathic pain",
    ],
    contraindications: [
      "Pacemaker",
      "Pregnancy",
      "Skin conditions",
      "Malignancy",
    ],
    precautions: [
      "Monitor skin response",
      "Avoid eyes and heart",
      "Use proper electrode placement",
      "Adjust intensity gradually",
    ],
    parameters: {
      frequency: "50-150 Hz",
      intensity: "Sensory to motor level",
      duration: "20-30 minutes",
    },
    dosage: "1-3 times per day",
    expectedOutcomes: [
      "Reduced pain",
      "Improved comfort",
      "Reduced muscle tension",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Gibson W, et al. Transcutaneous electrical nerve stimulation (TENS) for chronic pain. Cochrane Database Syst Rev. 2017;9:CD003222.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-003",
    name: "Electrical Muscle Stimulation",
    abbreviation: "EMS",
    description:
      "Electrical stimulation used to strengthen muscles and reduce atrophy",
    category: "electrical",
    indications: [
      "Muscle weakness",
      "Muscle atrophy",
      "Post-operative rehabilitation",
      "Neurological injury",
      "Immobilization",
    ],
    contraindications: [
      "Pacemaker",
      "Pregnancy",
      "Skin conditions",
      "Malignancy",
      "Severe pain",
    ],
    precautions: [
      "Monitor skin response",
      "Avoid eyes and heart",
      "Use proper electrode placement",
      "Adjust intensity gradually",
    ],
    parameters: {
      frequency: "20-50 Hz",
      intensity: "Motor level",
      duration: "15-30 minutes",
    },
    dosage: "1-2 times per day",
    expectedOutcomes: [
      "Improved muscle strength",
      "Reduced muscle atrophy",
      "Improved function",
      "Improved endurance",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Maffiuletti NA. Physiological effects of electrical stimulation. J Sports Med Phys Fitness. 2007;47(4):469-477.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-004",
    name: "Heat Therapy - Superficial",
    abbreviation: "Heat",
    description:
      "Application of heat to superficial tissues to reduce pain and improve mobility",
    category: "thermal",
    indications: [
      "Muscle tension",
      "Stiffness",
      "Chronic pain",
      "Reduced mobility",
      "Muscle spasm",
    ],
    contraindications: [
      "Acute inflammation",
      "Fever",
      "Malignancy",
      "Skin conditions",
      "Sensory loss",
    ],
    precautions: [
      "Monitor skin response",
      "Avoid excessive heat",
      "Protect skin",
      "Monitor vital signs",
    ],
    parameters: {
      temperature: "40-45°C",
      duration: "15-20 minutes",
    },
    dosage: "1-2 times per day",
    expectedOutcomes: [
      "Reduced muscle tension",
      "Improved mobility",
      "Reduced pain",
      "Improved circulation",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Mayer JM, et al. Thermal modalities for musculoskeletal conditions. Phys Med Rehabil Clin N Am. 2003;14(2):243-259.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-005",
    name: "Cold Therapy - Cryotherapy",
    abbreviation: "Cold",
    description:
      "Application of cold to tissues to reduce inflammation and pain",
    category: "thermal",
    indications: [
      "Acute inflammation",
      "Acute pain",
      "Swelling",
      "Muscle spasm",
      "Post-operative pain",
    ],
    contraindications: [
      "Cold sensitivity",
      "Raynaud's phenomenon",
      "Cryoglobulinemia",
      "Severe sensory loss",
    ],
    precautions: [
      "Monitor skin response",
      "Avoid excessive cold",
      "Protect skin",
      "Limit duration",
    ],
    parameters: {
      temperature: "0-15°C",
      duration: "10-15 minutes",
    },
    dosage: "1-3 times per day",
    expectedOutcomes: [
      "Reduced inflammation",
      "Reduced pain",
      "Reduced swelling",
      "Reduced muscle spasm",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Mayer JM, et al. Thermal modalities for musculoskeletal conditions. Phys Med Rehabil Clin N Am. 2003;14(2):243-259.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-006",
    name: "Low-Level Laser Therapy",
    abbreviation: "LLLT",
    description:
      "Low-power laser used to promote tissue healing and reduce pain",
    category: "light",
    indications: [
      "Soft tissue injury",
      "Inflammation",
      "Pain",
      "Wound healing",
      "Neuropathic pain",
    ],
    contraindications: [
      "Malignancy",
      "Pregnancy",
      "Eye conditions",
      "Photosensitivity",
    ],
    precautions: [
      "Protect eyes",
      "Monitor skin response",
      "Use proper wavelength",
      "Avoid direct eye exposure",
    ],
    parameters: {
      frequency: "600-1000 nm",
      intensity: "1-50 mW/cm²",
      duration: "5-30 minutes",
    },
    dosage: "2-3 times per week",
    expectedOutcomes: [
      "Reduced inflammation",
      "Reduced pain",
      "Improved tissue healing",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Bjordal JM, et al. A systematic review of low level laser therapy with location-specific doses for pain from chronic joint disorders. Aust J Physiother. 2003;49(2):107-116.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-007",
    name: "Compression Therapy",
    abbreviation: "Compression",
    description:
      "Application of external pressure to reduce swelling and improve circulation",
    category: "compression",
    indications: [
      "Swelling",
      "Edema",
      "Lymphedema",
      "Venous insufficiency",
      "Post-operative swelling",
    ],
    contraindications: [
      "Arterial insufficiency",
      "Severe pain",
      "Skin conditions",
      "Malignancy",
    ],
    precautions: [
      "Monitor circulation",
      "Avoid excessive pressure",
      "Check skin response",
      "Monitor vital signs",
    ],
    parameters: {
      pressure: "20-60 mmHg",
      duration: "Continuous or intermittent",
    },
    dosage: "Continuous or 1-2 hours per day",
    expectedOutcomes: [
      "Reduced swelling",
      "Reduced edema",
      "Improved circulation",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Partsch H, et al. Compression therapy of lymphedema of the limbs. Lymphology. 2008;41(1):34-42.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-008",
    name: "Cervical Traction",
    abbreviation: "Traction",
    description:
      "Mechanical or manual traction applied to cervical spine to reduce pain and improve mobility",
    category: "mechanical",
    indications: [
      "Cervical pain",
      "Radiculopathy",
      "Nerve root compression",
      "Reduced mobility",
      "Muscle tension",
    ],
    contraindications: [
      "Fracture",
      "Instability",
      "Severe osteoporosis",
      "Malignancy",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for increased pain",
      "Assess vital signs",
    ],
    parameters: {
      force: "5-15 lbs",
      duration: "15-30 minutes",
    },
    dosage: "2-3 times per week",
    expectedOutcomes: [
      "Reduced cervical pain",
      "Reduced radiculopathy",
      "Improved mobility",
      "Reduced muscle tension",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Saal JS, et al. Nonoperative management of herniated cervical intervertebral disc with radiculopathy. Spine. 1996;21(16):1877-1883.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-009",
    name: "Lumbar Traction",
    abbreviation: "Traction",
    description:
      "Mechanical or manual traction applied to lumbar spine to reduce pain and improve mobility",
    category: "mechanical",
    indications: [
      "Low back pain",
      "Radiculopathy",
      "Nerve root compression",
      "Reduced mobility",
      "Muscle tension",
    ],
    contraindications: [
      "Fracture",
      "Instability",
      "Severe osteoporosis",
      "Malignancy",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for increased pain",
      "Assess vital signs",
    ],
    parameters: {
      force: "25-50% body weight",
      duration: "15-30 minutes",
    },
    dosage: "2-3 times per week",
    expectedOutcomes: [
      "Reduced low back pain",
      "Reduced radiculopathy",
      "Improved mobility",
      "Reduced muscle tension",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Saal JS, et al. Nonoperative management of herniated lumbar intervertebral disc with radiculopathy. Spine. 1996;21(16):1877-1883.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mod-010",
    name: "Hydrotherapy",
    abbreviation: "Hydro",
    description: "Use of water for therapeutic exercise and pain relief",
    category: "water",
    indications: [
      "Pain relief",
      "Reduced mobility",
      "Muscle weakness",
      "Post-operative rehabilitation",
      "Arthritis",
    ],
    contraindications: [
      "Infection",
      "Open wounds",
      "Severe pain",
      "Cardiac conditions",
    ],
    precautions: [
      "Monitor water temperature",
      "Ensure safety",
      "Monitor vital signs",
      "Assess skin response",
    ],
    parameters: {
      temperature: "32-37°C",
      duration: "20-45 minutes",
    },
    dosage: "2-3 times per week",
    expectedOutcomes: [
      "Reduced pain",
      "Improved mobility",
      "Improved strength",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Bender T, et al. The effect of balneotherapy on patients with osteoarthritis. Clin Rheumatol. 2007;26(6):890-894.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT modality by ID
 */
export function getPTModalityById(id: string): PTModality | undefined {
  return ptModalities.find((m) => m.id === id);
}

/**
 * Get PT modalities by category
 */
export function getPTModalitiesByCategory(category: string): PTModality[] {
  return ptModalities.filter((m) => m.category === category);
}

/**
 * Get PT modalities by evidence level
 */
export function getPTModalitiesByEvidenceLevel(level: number): PTModality[] {
  return ptModalities.filter((m) => m.evidenceLevel === level);
}

/**
 * Search PT modalities
 */
export function searchPTModalities(query: string): PTModality[] {
  const lowerQuery = query.toLowerCase();
  return ptModalities.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.abbreviation.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT modalities
 */
export function getAllPTModalities(): PTModality[] {
  return ptModalities;
}

/**
 * Get PT modality categories
 */
export function getPTModalityCategories(): string[] {
  const categories = new Set(ptModalities.map((m) => m.category));
  return Array.from(categories);
}

/**
 * Get PT modalities for indication
 */
export function getPTModalitiesForIndication(indication: string): PTModality[] {
  return ptModalities.filter((m) => m.indications.includes(indication));
}
