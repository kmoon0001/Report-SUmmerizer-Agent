/**
 * Red Flags & Contraindications Library
 * Safety alerts, referral criteria, and contraindications for PT and OT
 * Sources: APTA, AOTA, CMS, clinical practice standards
 */

export type RedFlagCategory =
  | "cardiovascular"
  | "neurological"
  | "systemic"
  | "musculoskeletal"
  | "occupational"
  | "cognitive"
  | "psychiatric";
export type Severity = "critical" | "high" | "moderate" | "low";
export type Discipline = "pt" | "ot" | "shared";
export type Action =
  | "stop-immediately"
  | "refer-physician"
  | "refer-specialist"
  | "monitor-closely"
  | "modify-treatment"
  | "educate-patient";

export interface RedFlag {
  id: string;
  name: string;
  category: RedFlagCategory;
  discipline: Discipline;
  severity: Severity;
  description: string;
  signs: string[];
  symptoms: string[];
  immediateActions: string[];
  referralCriteria: string;
  contraindications: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

// Cardiovascular Red Flags
const cardiovascularFlags: RedFlag[] = [
  {
    id: "cv-001",
    name: "Acute Myocardial Infarction",
    category: "cardiovascular",
    discipline: "shared",
    severity: "critical",
    description:
      "Signs and symptoms of acute heart attack requiring immediate medical attention",
    signs: [
      "Chest pain or pressure",
      "Diaphoresis",
      "Pallor",
      "Tachycardia",
      "Arrhythmia",
    ],
    symptoms: [
      "Chest pain radiating to arm/jaw",
      "Shortness of breath",
      "Nausea",
      "Dizziness",
      "Anxiety",
    ],
    immediateActions: [
      "Stop all treatment immediately",
      "Call 911",
      "Position patient supine",
      "Administer oxygen if available",
      "Monitor vital signs",
    ],
    referralCriteria: "Immediate emergency referral",
    contraindications: [
      "All physical therapy",
      "All occupational therapy",
      "All exercise",
    ],
    source: "American Heart Association",
    citation: "AHA Guidelines for Acute Coronary Syndrome",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cv-002",
    name: "Uncontrolled Hypertension",
    category: "cardiovascular",
    discipline: "shared",
    severity: "high",
    description: "Blood pressure >180/110 mmHg indicating inadequate control",
    signs: [
      "Elevated BP readings",
      "Headache",
      "Flushed face",
      "Shortness of breath",
    ],
    symptoms: [
      "Headache",
      "Dizziness",
      "Chest discomfort",
      "Visual disturbances",
    ],
    immediateActions: [
      "Pause treatment",
      "Recheck vital signs",
      "Contact physician",
      "Rest patient in supine position",
    ],
    referralCriteria: "Refer to physician for medication adjustment",
    contraindications: [
      "Vigorous exercise",
      "Valsalva maneuver",
      "Isometric exercises",
    ],
    source: "American Heart Association",
    citation: "AHA Hypertension Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cv-003",
    name: "Deep Vein Thrombosis (DVT)",
    category: "cardiovascular",
    discipline: "shared",
    severity: "critical",
    description: "Blood clot in deep veins, risk of pulmonary embolism",
    signs: [
      "Unilateral leg swelling",
      "Warmth over vein",
      "Positive Homan's sign",
      "Calf tenderness",
    ],
    symptoms: ["Leg pain", "Swelling", "Warmth", "Redness"],
    immediateActions: [
      "Stop treatment immediately",
      "Elevate leg",
      "Contact physician",
      "Do not massage leg",
    ],
    referralCriteria: "Immediate physician referral for imaging",
    contraindications: [
      "Massage",
      "Aggressive mobilization",
      "Vigorous exercise",
      "Heat therapy",
    ],
    source: "American Academy of Orthopaedic Surgeons",
    citation: "AAOS DVT Prevention Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cv-004",
    name: "Pulmonary Embolism",
    category: "cardiovascular",
    discipline: "shared",
    severity: "critical",
    description: "Blood clot in pulmonary artery, life-threatening emergency",
    signs: [
      "Sudden dyspnea",
      "Tachycardia",
      "Tachypnea",
      "Chest pain",
      "Syncope",
    ],
    symptoms: [
      "Sudden shortness of breath",
      "Chest pain",
      "Dizziness",
      "Anxiety",
      "Hemoptysis",
    ],
    immediateActions: [
      "Stop all treatment",
      "Call 911",
      "Position upright",
      "Administer oxygen",
      "Monitor vital signs",
    ],
    referralCriteria: "Immediate emergency referral",
    contraindications: [
      "All physical therapy",
      "All occupational therapy",
      "All exercise",
    ],
    source: "American Heart Association",
    citation: "AHA Pulmonary Embolism Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Neurological Red Flags
const neurologicalFlags: RedFlag[] = [
  {
    id: "neuro-001",
    name: "Acute Stroke",
    category: "neurological",
    discipline: "shared",
    severity: "critical",
    description:
      "Sudden onset neurological deficit indicating acute cerebrovascular accident",
    signs: [
      "Facial drooping",
      "Arm weakness",
      "Speech difficulty",
      "Gait disturbance",
      "Nystagmus",
    ],
    symptoms: [
      "Sudden weakness",
      "Numbness",
      "Speech difficulty",
      "Vision changes",
      "Dizziness",
    ],
    immediateActions: [
      "Stop treatment immediately",
      "Call 911",
      "Note time of onset",
      "Monitor vital signs",
      "Keep NPO",
    ],
    referralCriteria: "Immediate emergency referral (within 3-hour window)",
    contraindications: [
      "All therapy until medical clearance",
      "Aggressive mobilization",
    ],
    source: "American Heart Association",
    citation: "AHA Stroke Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "neuro-002",
    name: "Spinal Cord Compression",
    category: "neurological",
    discipline: "shared",
    severity: "critical",
    description:
      "Acute compression of spinal cord requiring emergency decompression",
    signs: [
      "Bilateral leg weakness",
      "Saddle anesthesia",
      "Bowel/bladder dysfunction",
      "Progressive neurological deficit",
    ],
    symptoms: [
      "Severe back pain",
      "Bilateral leg pain",
      "Numbness in saddle area",
      "Loss of bowel/bladder control",
    ],
    immediateActions: [
      "Stop all mobilization",
      "Contact physician immediately",
      "Immobilize spine",
      "Monitor neurological status",
    ],
    referralCriteria:
      "Immediate physician referral for imaging and possible surgery",
    contraindications: [
      "Spinal mobilization",
      "Aggressive stretching",
      "Manipulation",
    ],
    source: "American Academy of Orthopaedic Surgeons",
    citation: "AAOS Spinal Cord Compression Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "neuro-003",
    name: "Seizure Disorder",
    category: "neurological",
    discipline: "shared",
    severity: "high",
    description: "Active seizure activity or uncontrolled seizure disorder",
    signs: [
      "Loss of consciousness",
      "Muscle rigidity",
      "Rhythmic jerking",
      "Incontinence",
      "Tongue biting",
    ],
    symptoms: ["Aura", "Confusion", "Fatigue post-seizure"],
    immediateActions: [
      "Protect from injury",
      "Do not restrain",
      "Position on side",
      "Call 911 if prolonged",
      "Monitor post-ictal state",
    ],
    referralCriteria:
      "Physician contact for medication adjustment if uncontrolled",
    contraindications: [
      "Therapy during active seizure",
      "Certain modalities",
      "Triggers identified by patient",
    ],
    source: "American Epilepsy Society",
    citation: "AES Seizure Management Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "neuro-004",
    name: "Acute Confusion or Altered Mental Status",
    category: "neurological",
    discipline: "shared",
    severity: "high",
    description:
      "Sudden change in mental status indicating possible serious condition",
    signs: [
      "Disorientation",
      "Agitation",
      "Lethargy",
      "Incoherence",
      "Hallucinations",
    ],
    symptoms: ["Confusion", "Memory loss", "Behavioral changes"],
    immediateActions: [
      "Stop treatment",
      "Contact physician",
      "Assess vital signs",
      "Ensure safety",
      "Monitor closely",
    ],
    referralCriteria: "Physician referral for evaluation",
    contraindications: [
      "Therapy until cause identified",
      "Certain medications",
    ],
    source: "American Academy of Neurology",
    citation: "AAN Altered Mental Status Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Systemic Red Flags
const systemicFlags: RedFlag[] = [
  {
    id: "sys-001",
    name: "Fever >101.5°F (38.6°C)",
    category: "systemic",
    discipline: "shared",
    severity: "high",
    description:
      "Elevated body temperature indicating possible infection or systemic illness",
    signs: ["Elevated temperature", "Chills", "Diaphoresis", "Malaise"],
    symptoms: ["Chills", "Fatigue", "Headache", "Body aches"],
    immediateActions: [
      "Postpone treatment",
      "Contact physician",
      "Recommend rest",
      "Monitor temperature",
    ],
    referralCriteria: "Physician contact for evaluation",
    contraindications: [
      "Vigorous exercise",
      "Heat therapy",
      "Therapy until fever resolves",
    ],
    source: "CDC",
    citation: "CDC Infection Control Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "sys-002",
    name: "Unexplained Weight Loss",
    category: "systemic",
    discipline: "shared",
    severity: "moderate",
    description:
      "Unintentional weight loss >10 lbs in 6 months suggesting systemic disease",
    signs: ["Weight loss", "Fatigue", "Weakness", "Pallor"],
    symptoms: ["Fatigue", "Weakness", "Loss of appetite"],
    immediateActions: [
      "Document weight loss",
      "Contact physician",
      "Assess nutritional status",
    ],
    referralCriteria: "Physician referral for medical workup",
    contraindications: ["Vigorous exercise until cause identified"],
    source: "American Medical Association",
    citation: "AMA Unintentional Weight Loss Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "sys-003",
    name: "Night Sweats",
    category: "systemic",
    discipline: "shared",
    severity: "moderate",
    description:
      "Profuse sweating at night suggesting infection, malignancy, or systemic disease",
    signs: ["Drenching sweats", "Soaked bedding", "Fever", "Chills"],
    symptoms: ["Night sweats", "Fatigue", "Fever"],
    immediateActions: [
      "Document symptoms",
      "Contact physician",
      "Assess for other symptoms",
    ],
    referralCriteria: "Physician referral for medical evaluation",
    contraindications: ["Vigorous exercise until cause identified"],
    source: "American Medical Association",
    citation: "AMA Night Sweats Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Musculoskeletal Red Flags
const musculoskeletalFlags: RedFlag[] = [
  {
    id: "msk-001",
    name: "Fracture",
    category: "musculoskeletal",
    discipline: "pt",
    severity: "high",
    description: "Suspected or confirmed bone fracture",
    signs: [
      "Deformity",
      "Swelling",
      "Bruising",
      "Crepitus",
      "Inability to bear weight",
    ],
    symptoms: ["Severe pain", "Inability to move", "Swelling"],
    immediateActions: [
      "Immobilize",
      "Apply ice",
      "Elevate",
      "Contact physician",
      "Obtain imaging",
    ],
    referralCriteria: "Physician referral for imaging and treatment plan",
    contraindications: [
      "Mobilization before imaging",
      "Weight-bearing before clearance",
      "Aggressive stretching",
    ],
    source: "American Academy of Orthopaedic Surgeons",
    citation: "AAOS Fracture Management Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "msk-002",
    name: "Severe Acute Inflammation",
    category: "musculoskeletal",
    discipline: "pt",
    severity: "moderate",
    description:
      "Acute inflammatory response with significant swelling and pain",
    signs: [
      "Severe swelling",
      "Warmth",
      "Redness",
      "Severe pain",
      "Limited ROM",
    ],
    symptoms: ["Severe pain", "Swelling", "Warmth"],
    immediateActions: [
      "Rest",
      "Ice",
      "Compression",
      "Elevation",
      "Contact physician",
    ],
    referralCriteria: "Physician contact if no improvement in 48 hours",
    contraindications: [
      "Aggressive mobilization",
      "Heat therapy",
      "Vigorous exercise",
    ],
    source: "APTA",
    citation: "APTA Inflammation Management Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Occupational Red Flags
const occupationalFlags: RedFlag[] = [
  {
    id: "occ-001",
    name: "Severe Cognitive Impairment",
    category: "occupational",
    discipline: "ot",
    severity: "high",
    description:
      "Significant cognitive deficits affecting safety and occupational performance",
    signs: [
      "Disorientation",
      "Memory loss",
      "Poor judgment",
      "Inability to follow commands",
    ],
    symptoms: ["Confusion", "Memory problems", "Difficulty with tasks"],
    immediateActions: [
      "Ensure safety",
      "Simplify instructions",
      "Contact physician",
      "Involve caregiver",
    ],
    referralCriteria: "Physician referral for cognitive evaluation",
    contraindications: ["Complex tasks", "Unsupervised activities", "Driving"],
    source: "AOTA",
    citation: "AOTA Cognitive Assessment Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "occ-002",
    name: "Severe Psychiatric Symptoms",
    category: "psychiatric",
    discipline: "ot",
    severity: "high",
    description:
      "Active psychiatric symptoms affecting safety and participation",
    signs: [
      "Suicidal ideation",
      "Homicidal ideation",
      "Severe agitation",
      "Hallucinations",
      "Delusions",
    ],
    symptoms: [
      "Suicidal thoughts",
      "Violent thoughts",
      "Severe anxiety",
      "Paranoia",
    ],
    immediateActions: [
      "Ensure safety",
      "Contact mental health professional",
      "Do not leave alone",
      "Call 911 if imminent danger",
    ],
    referralCriteria: "Immediate mental health referral",
    contraindications: ["Therapy until stabilized", "Certain activities"],
    source: "AOTA",
    citation: "AOTA Mental Health Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Combined library
const allFlags: RedFlag[] = [
  ...cardiovascularFlags,
  ...neurologicalFlags,
  ...systemicFlags,
  ...musculoskeletalFlags,
  ...occupationalFlags,
];

/**
 * Get red flag by ID
 */
export function getRedFlagById(id: string): RedFlag | undefined {
  return allFlags.find((f) => f.id === id);
}

/**
 * Get red flags by category
 */
export function getRedFlagsByCategory(category: RedFlagCategory): RedFlag[] {
  return allFlags.filter((f) => f.category === category);
}

/**
 * Get red flags by severity
 */
export function getRedFlagsBySeverity(severity: Severity): RedFlag[] {
  return allFlags.filter((f) => f.severity === severity);
}

/**
 * Get critical red flags
 */
export function getCriticalRedFlags(): RedFlag[] {
  return allFlags.filter((f) => f.severity === "critical");
}

/**
 * Get red flags for discipline
 */
export function getRedFlagsForDiscipline(discipline: Discipline): RedFlag[] {
  return allFlags.filter(
    (f) => f.discipline === discipline || f.discipline === "shared",
  );
}

/**
 * Search red flags by name
 */
export function searchRedFlags(query: string): RedFlag[] {
  const lowerQuery = query.toLowerCase();
  return allFlags.filter(
    (f) =>
      f.name.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get red flags by action required
 */
export function getRedFlagsByAction(action: Action): RedFlag[] {
  return allFlags.filter((f) => {
    if (action === "stop-immediately") return f.severity === "critical";
    if (action === "refer-physician")
      return f.severity === "high" || f.severity === "critical";
    return true;
  });
}

/**
 * Get all red flags
 */
export function getAllRedFlags(): RedFlag[] {
  return allFlags;
}

/**
 * Get cardiovascular red flags
 */
export function getCardiovascularRedFlags(): RedFlag[] {
  return cardiovascularFlags;
}

/**
 * Get neurological red flags
 */
export function getNeurologicalRedFlags(): RedFlag[] {
  return neurologicalFlags;
}

/**
 * Get systemic red flags
 */
export function getSystemicRedFlags(): RedFlag[] {
  return systemicFlags;
}

/**
 * Get musculoskeletal red flags
 */
export function getMusculoskeletalRedFlags(): RedFlag[] {
  return musculoskeletalFlags;
}

/**
 * Get occupational red flags
 */
export function getOccupationalRedFlags(): RedFlag[] {
  return occupationalFlags;
}
