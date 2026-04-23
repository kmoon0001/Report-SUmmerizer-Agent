/**
 * PT Module 11: Advanced Techniques
 * Advanced physical therapy techniques and specialized interventions
 * Evidence-based from APTA and clinical best practices
 */

export interface PTAdvancedTechnique {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  procedures: string[];
  expectedOutcomes: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptAdvancedTechniquesData: PTAdvancedTechnique[] = [
  {
    id: "pt-at-001",
    name: "Proprioceptive Neuromuscular Facilitation",
    abbreviation: "PNF",
    category: "neuromuscular-facilitation",
    description:
      "Advanced technique using diagonal patterns and proprioceptive input for neuromuscular re-education",
    indications: [
      "Neurological disorder",
      "Motor control deficit",
      "Weakness",
      "Coordination impairment",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Unstable fracture",
    ],
    precautions: [
      "Monitor vital signs",
      "Avoid overexertion",
      "Proper positioning",
    ],
    procedures: [
      "Assessment of movement patterns",
      "Pattern selection",
      "Resistance application",
      "Verbal cueing",
      "Tactile feedback",
      "Progression monitoring",
    ],
    expectedOutcomes: [
      "Improved motor control",
      "Increased strength",
      "Better coordination",
      "Functional improvement",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2023). Proprioceptive Neuromuscular Facilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-002",
    name: "Manual Therapy - Mobilization",
    abbreviation: "MTM",
    category: "manual-therapy",
    description:
      "Skilled passive movement techniques to improve joint mobility and reduce pain",
    indications: [
      "Joint stiffness",
      "Reduced ROM",
      "Joint pain",
      "Mobility limitation",
    ],
    contraindications: [
      "Acute inflammation",
      "Fracture",
      "Severe osteoporosis",
    ],
    precautions: [
      "Monitor pain response",
      "Proper positioning",
      "Gradual progression",
    ],
    procedures: [
      "Joint assessment",
      "Grade determination",
      "Mobilization application",
      "Response monitoring",
      "Progression planning",
      "Home program instruction",
    ],
    expectedOutcomes: [
      "Improved ROM",
      "Reduced pain",
      "Improved function",
      "Better mobility",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2023). Manual Therapy Mobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-003",
    name: "Dry Needling",
    abbreviation: "DN",
    category: "dry-needling",
    description:
      "Insertion of thin needles into myofascial trigger points for pain relief and muscle relaxation",
    indications: [
      "Myofascial pain",
      "Trigger points",
      "Muscle tension",
      "Pain syndrome",
    ],
    contraindications: [
      "Bleeding disorder",
      "Severe needle phobia",
      "Infection risk",
    ],
    precautions: [
      "Sterile technique",
      "Proper needle depth",
      "Patient positioning",
    ],
    procedures: [
      "Trigger point identification",
      "Needle insertion",
      "Twitch response elicitation",
      "Needle manipulation",
      "Post-treatment care",
      "Follow-up assessment",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved muscle function",
      "Better ROM",
      "Functional improvement",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2023). Dry Needling Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-004",
    name: "Kinesiology Taping",
    abbreviation: "KT",
    category: "taping-techniques",
    description:
      "Application of elastic tape to support muscles and joints while allowing movement",
    indications: [
      "Muscle weakness",
      "Joint instability",
      "Pain management",
      "Proprioceptive support",
    ],
    contraindications: ["Skin sensitivity", "Severe edema", "Open wounds"],
    precautions: [
      "Skin preparation",
      "Proper tension",
      "Monitoring for irritation",
    ],
    procedures: [
      "Skin assessment and preparation",
      "Tape selection",
      "Application technique",
      "Tension adjustment",
      "Wear time monitoring",
      "Reapplication as needed",
    ],
    expectedOutcomes: [
      "Improved proprioception",
      "Reduced pain",
      "Better muscle activation",
      "Functional support",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2023). Kinesiology Taping Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-005",
    name: "Instrument-Assisted Soft Tissue Mobilization",
    abbreviation: "IASTM",
    category: "soft-tissue-mobilization",
    description:
      "Use of specialized instruments to mobilize soft tissue and promote healing",
    indications: [
      "Soft tissue restriction",
      "Scar tissue",
      "Chronic pain",
      "Mobility limitation",
    ],
    contraindications: [
      "Acute inflammation",
      "Skin infection",
      "Bleeding disorder",
    ],
    precautions: [
      "Proper technique",
      "Appropriate pressure",
      "Skin monitoring",
    ],
    procedures: [
      "Tissue assessment",
      "Instrument selection",
      "Mobilization technique",
      "Pressure adjustment",
      "Treatment duration",
      "Post-treatment care",
    ],
    expectedOutcomes: [
      "Improved tissue mobility",
      "Reduced pain",
      "Better function",
      "Scar tissue remodeling",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation:
      "APTA (2023). Instrument-Assisted Soft Tissue Mobilization Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-006",
    name: "Blood Flow Restriction Training",
    abbreviation: "BFRT",
    category: "resistance-training",
    description:
      "Low-load resistance training with restricted blood flow for strength and hypertrophy gains",
    indications: [
      "Weakness",
      "Post-operative rehabilitation",
      "Deconditioning",
      "Strength deficit",
    ],
    contraindications: [
      "Vascular disease",
      "Hypertension",
      "Bleeding disorder",
    ],
    precautions: [
      "Proper cuff application",
      "Pressure monitoring",
      "Gradual progression",
    ],
    procedures: [
      "Baseline assessment",
      "Cuff selection and application",
      "Pressure determination",
      "Exercise prescription",
      "Monitoring during exercise",
      "Progression planning",
    ],
    expectedOutcomes: [
      "Increased strength",
      "Muscle hypertrophy",
      "Improved function",
      "Faster recovery",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2023). Blood Flow Restriction Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-007",
    name: "Neuromuscular Re-education",
    abbreviation: "NRE",
    category: "neuromuscular-training",
    description:
      "Systematic training to restore normal movement patterns and motor control",
    indications: [
      "Motor control deficit",
      "Neurological disorder",
      "Post-operative rehabilitation",
      "Movement dysfunction",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe behavioral issues",
      "Acute medical instability",
    ],
    precautions: [
      "Monitor fatigue",
      "Proper positioning",
      "Gradual complexity increase",
    ],
    procedures: [
      "Movement assessment",
      "Pattern identification",
      "Exercise prescription",
      "Feedback provision",
      "Complexity progression",
      "Functional integration",
    ],
    expectedOutcomes: [
      "Improved motor control",
      "Normalized movement patterns",
      "Better function",
      "Injury prevention",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2023). Neuromuscular Re-education Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-008",
    name: "Aquatic Therapy",
    abbreviation: "AT",
    category: "aquatic-therapy",
    description:
      "Therapeutic exercises performed in water to reduce weight-bearing and improve function",
    indications: [
      "Joint pain",
      "Weight-bearing limitation",
      "Weakness",
      "Mobility restriction",
    ],
    contraindications: [
      "Open wounds",
      "Severe infection",
      "Uncontrolled incontinence",
    ],
    precautions: ["Water temperature", "Safety monitoring", "Proper support"],
    procedures: [
      "Pool assessment",
      "Water temperature adjustment",
      "Exercise prescription",
      "Buoyancy utilization",
      "Resistance application",
      "Progress monitoring",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved mobility",
      "Increased strength",
      "Better function",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2023). Aquatic Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-009",
    name: "Vestibular Rehabilitation",
    abbreviation: "VR",
    category: "vestibular-training",
    description:
      "Specialized training to improve balance and reduce dizziness through vestibular adaptation",
    indications: ["Dizziness", "Balance disorder", "Vertigo", "Fall risk"],
    contraindications: [
      "Acute vertigo",
      "Severe anxiety",
      "Uncontrolled hypertension",
    ],
    precautions: [
      "Safety monitoring",
      "Gradual progression",
      "Symptom monitoring",
    ],
    procedures: [
      "Vestibular assessment",
      "Gaze stabilization training",
      "Balance training",
      "Habituation exercises",
      "Adaptation exercises",
      "Functional integration",
    ],
    expectedOutcomes: [
      "Reduced dizziness",
      "Improved balance",
      "Better fall prevention",
      "Improved quality of life",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2023). Vestibular Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-010",
    name: "Telehealth Physical Therapy",
    abbreviation: "TPT",
    category: "telehealth-delivery",
    description:
      "Remote delivery of physical therapy services using technology platforms",
    indications: [
      "Distance limitation",
      "Mobility restriction",
      "Convenience need",
      "Follow-up care",
    ],
    contraindications: [
      "Acute injury requiring hands-on care",
      "Severe cognitive impairment",
      "Technology limitation",
    ],
    precautions: [
      "Technology reliability",
      "Privacy and security",
      "Proper setup",
    ],
    procedures: [
      "Technology setup",
      "Assessment via video",
      "Exercise instruction",
      "Real-time feedback",
      "Documentation",
      "Follow-up planning",
    ],
    expectedOutcomes: [
      "Improved access to care",
      "Maintained function",
      "Better compliance",
      "Cost reduction",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2023). Telehealth Physical Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT advanced technique by ID
 */
export function getPTAdvancedTechniqueById(
  id: string,
): PTAdvancedTechnique | undefined {
  return ptAdvancedTechniquesData.find((at) => at.id === id);
}

/**
 * Get PT advanced techniques by category
 */
export function getPTAdvancedTechniquesByCategory(
  category: string,
): PTAdvancedTechnique[] {
  return ptAdvancedTechniquesData.filter((at) => at.category === category);
}

/**
 * Search PT advanced techniques
 */
export function searchPTAdvancedTechniques(
  query: string,
): PTAdvancedTechnique[] {
  const lowerQuery = query.toLowerCase();
  return ptAdvancedTechniquesData.filter(
    (at) =>
      at.name.toLowerCase().includes(lowerQuery) ||
      at.abbreviation.toLowerCase().includes(lowerQuery) ||
      at.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT advanced techniques
 */
export function getAllPTAdvancedTechniques(): PTAdvancedTechnique[] {
  return ptAdvancedTechniquesData;
}

/**
 * Get PT advanced technique categories
 */
export function getPTAdvancedTechniqueCategories(): string[] {
  return Array.from(new Set(ptAdvancedTechniquesData.map((at) => at.category)));
}

/**
 * Get PT advanced techniques for indication
 */
export function getPTAdvancedTechniquesForIndication(
  indication: string,
): PTAdvancedTechnique[] {
  return ptAdvancedTechniquesData.filter((at) =>
    at.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}
