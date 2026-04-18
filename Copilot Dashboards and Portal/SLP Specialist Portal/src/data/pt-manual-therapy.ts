/**
 * PT Module 4: Manual Therapy
 * Comprehensive manual therapy techniques, procedures, and evidence-based recommendations
 * Sources: APTA Manual Therapy Guidelines, Evidence-based manual therapy research, Clinical best practices
 */

export interface PTManualTherapyTechnique {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  category:
    | "mobilization"
    | "manipulation"
    | "soft-tissue"
    | "myofascial"
    | "trigger-point"
    | "iastm"
    | "dry-needling"
    | "joint-mobilization"
    | "muscle-energy"
    | "pnf";
  indications: string[];
  contraindications: string[];
  precautions: string[];
  technique: string;
  dosage: string;
  expectedOutcomes: string[];
  evidenceLevel: 1 | 2 | 3 | 4 | 5;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptManualTherapyTechniques: PTManualTherapyTechnique[] = [
  {
    id: "pt-mt-001",
    name: "Joint Mobilization - Grade I",
    abbreviation: "Mob I",
    description:
      "Small amplitude movements within the range of motion, used for pain relief",
    category: "joint-mobilization",
    indications: [
      "Pain relief",
      "Early phase rehabilitation",
      "Acute joint pain",
      "Protective muscle guarding",
    ],
    contraindications: [
      "Fracture",
      "Severe inflammation",
      "Infection",
      "Malignancy",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for increased pain",
      "Assess vital signs",
    ],
    technique:
      "Small amplitude oscillations performed at the beginning of available range of motion",
    dosage: "1-2 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Reduced pain",
      "Improved comfort",
      "Reduced muscle guarding",
      "Improved tolerance to movement",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Maitland GD. Vertebral Manipulation. 7th ed. Oxford: Butterworth-Heinemann; 2005.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-002",
    name: "Joint Mobilization - Grade II",
    abbreviation: "Mob II",
    description:
      "Large amplitude movements within the range of motion, used for pain relief and mobility",
    category: "joint-mobilization",
    indications: [
      "Pain relief",
      "Improved mobility",
      "Reduced stiffness",
      "Improved function",
    ],
    contraindications: [
      "Fracture",
      "Severe inflammation",
      "Infection",
      "Malignancy",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for increased pain",
      "Assess vital signs",
    ],
    technique:
      "Large amplitude oscillations performed throughout the available range of motion",
    dosage: "1-2 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Reduced pain",
      "Improved mobility",
      "Improved function",
      "Reduced stiffness",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Maitland GD. Vertebral Manipulation. 7th ed. Oxford: Butterworth-Heinemann; 2005.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-003",
    name: "Joint Mobilization - Grade III",
    abbreviation: "Mob III",
    description:
      "Large amplitude movements to the limit of available range of motion, used for mobility",
    category: "joint-mobilization",
    indications: [
      "Reduced mobility",
      "Stiffness",
      "Functional limitation",
      "Chronic pain",
    ],
    contraindications: [
      "Fracture",
      "Severe inflammation",
      "Infection",
      "Malignancy",
      "Hypermobility",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for increased pain",
      "Assess vital signs",
    ],
    technique:
      "Large amplitude oscillations performed at the limit of available range of motion",
    dosage: "1-2 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Improved mobility",
      "Reduced stiffness",
      "Improved function",
      "Reduced pain",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Maitland GD. Vertebral Manipulation. 7th ed. Oxford: Butterworth-Heinemann; 2005.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-004",
    name: "High-Velocity Low-Amplitude Thrust Manipulation",
    abbreviation: "HVLAT",
    description:
      "Rapid, forceful movement to end range, used to restore mobility and reduce pain",
    category: "manipulation",
    indications: [
      "Restricted mobility",
      "Acute pain",
      "Functional limitation",
      "Segmental dysfunction",
    ],
    contraindications: [
      "Fracture",
      "Severe osteoporosis",
      "Infection",
      "Malignancy",
      "Myelopathy",
      "Vertebral artery insufficiency",
    ],
    precautions: [
      "Screen for contraindications",
      "Monitor patient response",
      "Avoid excessive force",
      "Assess vital signs",
      "Educate patient",
    ],
    technique:
      "Rapid, forceful movement applied at end range of motion to restore mobility",
    dosage: "1-3 thrusts, 1-2 times per week",
    expectedOutcomes: [
      "Improved mobility",
      "Reduced pain",
      "Improved function",
      "Reduced muscle guarding",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Coulter ID, et al. Manipulation and mobilization techniques for chronic low back pain: a systematic review. Spine. 2018;43(1):E1-E12.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-005",
    name: "Soft Tissue Mobilization",
    abbreviation: "STM",
    description:
      "Manual techniques to mobilize soft tissue, reduce tension, and improve circulation",
    category: "soft-tissue",
    indications: [
      "Muscle tension",
      "Reduced mobility",
      "Pain",
      "Muscle guarding",
      "Adhesions",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Fracture",
      "Severe pain",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive pressure",
      "Watch for bruising",
      "Assess vital signs",
    ],
    technique:
      "Manual pressure and movement applied to soft tissue to mobilize and reduce tension",
    dosage: "5-10 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Reduced muscle tension",
      "Improved mobility",
      "Reduced pain",
      "Improved circulation",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Schleip R, et al. Fascia: The Tensional Network of the Human Body. Edinburgh: Elsevier; 2012.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-006",
    name: "Myofascial Release",
    abbreviation: "MFR",
    description:
      "Sustained pressure applied to myofascial tissue to release tension and improve mobility",
    category: "myofascial",
    indications: [
      "Myofascial pain",
      "Restricted mobility",
      "Muscle tension",
      "Functional limitation",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Fracture",
      "Severe pain",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive pressure",
      "Watch for bruising",
      "Assess vital signs",
    ],
    technique:
      "Sustained pressure applied to myofascial tissue, held until release is felt",
    dosage: "5-10 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Reduced myofascial pain",
      "Improved mobility",
      "Reduced muscle tension",
      "Improved function",
    ],
    evidenceLevel: 3,
    source: "APTA",
    citation:
      "Schleip R, et al. Fascia: The Tensional Network of the Human Body. Edinburgh: Elsevier; 2012.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-007",
    name: "Trigger Point Release",
    abbreviation: "TPR",
    description:
      "Direct pressure applied to trigger points to release tension and reduce referred pain",
    category: "trigger-point",
    indications: [
      "Trigger point pain",
      "Referred pain",
      "Muscle tension",
      "Myofascial pain syndrome",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Fracture",
      "Severe pain",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive pressure",
      "Watch for bruising",
      "Assess vital signs",
    ],
    technique:
      "Direct pressure applied to trigger point, held until release is felt",
    dosage: "30-90 seconds per point, 2-3 times per week",
    expectedOutcomes: [
      "Reduced trigger point pain",
      "Reduced referred pain",
      "Improved mobility",
      "Reduced muscle tension",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Simons DG, et al. Myofascial Pain and Dysfunction: The Trigger Point Manual. 2nd ed. Baltimore: Williams & Wilkins; 1999.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-008",
    name: "Instrument-Assisted Soft Tissue Mobilization",
    abbreviation: "IASTM",
    description:
      "Use of specialized instruments to mobilize soft tissue and promote healing",
    category: "iastm",
    indications: [
      "Soft tissue injury",
      "Scar tissue",
      "Chronic pain",
      "Reduced mobility",
      "Adhesions",
    ],
    contraindications: [
      "Acute inflammation",
      "Infection",
      "Fracture",
      "Severe pain",
      "Skin conditions",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive pressure",
      "Watch for bruising",
      "Assess vital signs",
      "Use proper technique",
    ],
    technique:
      "Specialized instruments used to mobilize soft tissue with controlled pressure and movement",
    dosage: "5-10 minutes, 2-3 times per week",
    expectedOutcomes: [
      "Improved soft tissue mobility",
      "Reduced scar tissue",
      "Reduced pain",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Schleip R, et al. Fascia: The Tensional Network of the Human Body. Edinburgh: Elsevier; 2012.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-009",
    name: "Dry Needling",
    abbreviation: "DN",
    description:
      "Insertion of thin needles into trigger points to release tension and reduce pain",
    category: "dry-needling",
    indications: [
      "Trigger point pain",
      "Myofascial pain",
      "Muscle tension",
      "Referred pain",
    ],
    contraindications: [
      "Infection",
      "Severe pain",
      "Pneumothorax risk",
      "Anticoagulation therapy",
      "Needle phobia",
    ],
    precautions: [
      "Use sterile technique",
      "Monitor patient response",
      "Watch for adverse reactions",
      "Assess vital signs",
      "Proper training required",
    ],
    technique:
      "Thin needles inserted into trigger points to elicit local twitch response",
    dosage: "5-15 minutes, 1-2 times per week",
    expectedOutcomes: [
      "Reduced trigger point pain",
      "Reduced myofascial pain",
      "Improved mobility",
      "Reduced muscle tension",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Cagnie B, et al. Dry needling in trigger point management. Curr Pain Headache Rep. 2015;19(6):23.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-mt-010",
    name: "Muscle Energy Techniques",
    abbreviation: "MET",
    description:
      "Patient-assisted techniques using muscle contraction to improve mobility and reduce pain",
    category: "muscle-energy",
    indications: [
      "Restricted mobility",
      "Muscle tension",
      "Pain",
      "Functional limitation",
      "Postural dysfunction",
    ],
    contraindications: [
      "Fracture",
      "Severe pain",
      "Acute inflammation",
      "Severe weakness",
    ],
    precautions: [
      "Monitor patient response",
      "Avoid excessive force",
      "Watch for pain",
      "Assess vital signs",
    ],
    technique:
      "Patient contracts muscle against resistance, then relaxes to improve mobility",
    dosage: "5-10 repetitions, 2-3 times per week",
    expectedOutcomes: [
      "Improved mobility",
      "Reduced muscle tension",
      "Reduced pain",
      "Improved function",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "Chaitow L. Muscle Energy Techniques. 3rd ed. Edinburgh: Elsevier; 2006.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT manual therapy technique by ID
 */
export function getPTManualTherapyTechniqueById(
  id: string,
): PTManualTherapyTechnique | undefined {
  return ptManualTherapyTechniques.find((t) => t.id === id);
}

/**
 * Get PT manual therapy techniques by category
 */
export function getPTManualTherapyTechniquesByCategory(
  category: string,
): PTManualTherapyTechnique[] {
  return ptManualTherapyTechniques.filter((t) => t.category === category);
}

/**
 * Get PT manual therapy techniques by evidence level
 */
export function getPTManualTherapyTechniquesByEvidenceLevel(
  level: number,
): PTManualTherapyTechnique[] {
  return ptManualTherapyTechniques.filter((t) => t.evidenceLevel === level);
}

/**
 * Search PT manual therapy techniques
 */
export function searchPTManualTherapyTechniques(
  query: string,
): PTManualTherapyTechnique[] {
  const lowerQuery = query.toLowerCase();
  return ptManualTherapyTechniques.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.abbreviation.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT manual therapy techniques
 */
export function getAllPTManualTherapyTechniques(): PTManualTherapyTechnique[] {
  return ptManualTherapyTechniques;
}

/**
 * Get PT manual therapy technique categories
 */
export function getPTManualTherapyCategories(): string[] {
  const categories = new Set(ptManualTherapyTechniques.map((t) => t.category));
  return Array.from(categories);
}

/**
 * Get PT manual therapy techniques for indication
 */
export function getPTManualTherapyTechniquesForIndication(
  indication: string,
): PTManualTherapyTechnique[] {
  return ptManualTherapyTechniques.filter((t) =>
    t.indications.includes(indication),
  );
}
