/**
 * PT Wound Care & Integumentary Data
 * Sources: NPUAP/EPUAP/PPPIA 2019, WOCN 2021, ADA/IWGDF 2023, Noridian LCD L38779
 */

// ── Pressure Injury Stages ────────────────────────────────────────────────────

export interface PressureInjuryStage {
  stage: string;
  name: string;
  description: string;
  clinicalFeatures: string[];
  treatment: string[];
  dressingOptions: string[];
}

export const pressureInjuryStages: PressureInjuryStage[] = [
  {
    stage: "Stage 1",
    name: "Non-Blanchable Erythema",
    description:
      "Intact skin with non-blanchable erythema of a localized area, usually over a bony prominence.",
    clinicalFeatures: [
      "Non-blanchable redness on intact skin",
      "Area may be painful, firm, soft, warmer or cooler than adjacent tissue",
      "Darkly pigmented skin may not have visible blanching",
    ],
    treatment: [
      "Relieve pressure immediately — reposition every 2 hours",
      "Protect with transparent film or thin foam dressing",
      "Optimize nutrition and hydration",
      "Skin inspection every shift",
    ],
    dressingOptions: ["Transparent Film", "Thin Foam", "Silicone Foam"],
  },
  {
    stage: "Stage 2",
    name: "Partial-Thickness Skin Loss",
    description:
      "Partial-thickness loss of skin with exposed dermis. The wound bed is viable, pink or red, moist.",
    clinicalFeatures: [
      "Shallow open ulcer with red-pink wound bed",
      "May present as intact or ruptured serum-filled blister",
      "No slough or bruising present",
    ],
    treatment: [
      "Moist wound healing environment",
      "Hydrocolloid or foam dressing",
      "Pressure redistribution surface",
      "Nutritional support — protein 1.2–1.5 g/kg/day",
    ],
    dressingOptions: ["Hydrocolloid", "Foam", "Transparent Film", "Alginate"],
  },
  {
    stage: "Stage 3",
    name: "Full-Thickness Skin Loss",
    description:
      "Full-thickness loss of skin. Subcutaneous fat may be visible but bone, tendon, or muscle is not exposed.",
    clinicalFeatures: [
      "Full-thickness tissue loss",
      "Slough may be present but does not obscure depth",
      "May include undermining and tunneling",
      "Depth varies by anatomical location",
    ],
    treatment: [
      "Debridement of necrotic tissue",
      "Moist wound healing with alginate or foam",
      "Consider NPWT for large wounds",
      "Consider UltraMIST for stalled wounds >4 weeks",
      "Nutritional consult — protein 1.5–2.0 g/kg/day",
    ],
    dressingOptions: ["Alginate", "Foam", "NPWT", "Collagen", "Hydrogel"],
  },
  {
    stage: "Stage 4",
    name: "Full-Thickness Tissue Loss",
    description:
      "Full-thickness tissue loss with exposed or directly palpable fascia, muscle, tendon, ligament, cartilage, or bone.",
    clinicalFeatures: [
      "Exposed bone, tendon, or muscle",
      "Slough or eschar may be present",
      "Often includes undermining and tunneling",
      "Risk of osteomyelitis — bone biopsy may be required",
    ],
    treatment: [
      "Urgent surgical consult for debridement",
      "NPWT as bridge to surgical closure",
      "Bone biopsy if osteomyelitis suspected",
      "Aggressive nutritional support",
      "Specialty pressure redistribution mattress",
    ],
    dressingOptions: ["NPWT", "Alginate", "Collagen", "Foam"],
  },
  {
    stage: "DTI",
    name: "Deep Tissue Pressure Injury",
    description:
      "Intact or non-intact skin with localized area of persistent non-blanchable deep red, maroon, or purple discoloration.",
    clinicalFeatures: [
      "Deep red, maroon, or purple discoloration",
      "Pain and temperature change often precede skin color changes",
      "May evolve rapidly to reveal actual extent of tissue injury",
      "Wound may evolve or resolve without tissue loss",
    ],
    treatment: [
      "Immediate pressure offloading",
      "Do not massage area",
      "Monitor closely for evolution",
      "Protect with silicone foam dressing",
    ],
    dressingOptions: ["Silicone Foam", "Transparent Film"],
  },
  {
    stage: "Unstageable",
    name: "Obscured Full-Thickness Skin and Tissue Loss",
    description:
      "Full-thickness skin and tissue loss in which the extent of tissue damage within the ulcer cannot be confirmed because it is obscured by slough or eschar.",
    clinicalFeatures: [
      "Wound base covered by slough (yellow, tan, gray, green, brown) or eschar (tan, brown, black)",
      "True depth cannot be determined until slough/eschar removed",
      "Stable eschar on heels — do not remove",
    ],
    treatment: [
      "Debridement to determine true stage (except stable heel eschar)",
      "Enzymatic or autolytic debridement",
      "Surgical debridement for urgent cases",
      "Protect stable heel eschar — do not debride",
    ],
    dressingOptions: ["Enzymatic Debrider", "Hydrogel", "Alginate"],
  },
];

// ── Braden Scale ──────────────────────────────────────────────────────────────

export interface BradenResult {
  total: number;
  riskLevel: string;
  interventions: string[];
}

export const calculateBradenScore = (scores: number[]): BradenResult => {
  const total = scores.reduce((a, b) => a + b, 0);

  let riskLevel: string;
  let interventions: string[];

  if (total <= 9) {
    riskLevel = "Very High Risk";
    interventions = [
      "Specialty mattress — low air loss or alternating pressure",
      "Reposition every 1–2 hours",
      "Heel offloading boots",
      "Nutritional consult — protein 1.5–2.0 g/kg/day",
      "Moisture barrier cream with every incontinent episode",
      "Wound care consult",
    ];
  } else if (total <= 12) {
    riskLevel = "High Risk";
    interventions = [
      "Pressure redistribution mattress overlay",
      "Reposition every 2 hours",
      "Heel protection device",
      "Nutritional support — protein 1.2–1.5 g/kg/day",
      "Moisture management protocol",
    ];
  } else if (total <= 14) {
    riskLevel = "Moderate Risk";
    interventions = [
      "Foam mattress overlay",
      "Reposition every 2–4 hours",
      "Protect bony prominences with foam dressings",
      "Nutritional screening",
    ];
  } else if (total <= 18) {
    riskLevel = "Mild Risk";
    interventions = [
      "Standard hospital mattress with repositioning schedule",
      "Reposition every 4 hours",
      "Skin inspection every shift",
      "Patient and caregiver education",
    ];
  } else {
    riskLevel = "No Risk";
    interventions = [
      "Routine skin inspection",
      "Maintain mobility and activity",
      "Adequate nutrition and hydration",
    ];
  }

  return { total, riskLevel, interventions };
};

// ── UltraMIST Protocol ────────────────────────────────────────────────────────

export interface UltraMISTProtocol {
  indication: string;
  contraindications: string[];
  setupSteps: string[];
  documentationRequirements: string[];
  outcomeMeasures: string[];
  citations: string[];
}

export const ultraMISTProtocol: UltraMISTProtocol = {
  indication:
    "Non-healing wounds stalled >4 weeks despite standard care. Promotes healing via low-frequency ultrasound (40 kHz) delivered through saline mist.",
  contraindications: [
    "Active malignancy in or near wound",
    "Implanted pacemaker or electronic device near treatment area",
    "Osteomyelitis (untreated)",
    "Exposed bone, tendon, or joint capsule",
    "Pregnancy",
    "Thrombophlebitis in treatment area",
  ],
  setupSteps: [
    "Verify physician order and LCD L38779 criteria",
    "Screen for all contraindications",
    "Obtain informed consent and document",
    "Position patient for optimal wound access",
    "Prepare sterile saline solution per manufacturer protocol",
    "Measure and photograph wound before treatment",
    "Apply UltraMIST device at prescribed distance (0.5–1.5 cm)",
    "Deliver treatment for calculated duration",
    "Apply appropriate post-treatment dressing",
  ],
  documentationRequirements: [
    "CPT 97610 — Low-frequency non-contact ultrasound, each 15 minutes",
    "Wound measurements (length × width × depth) at each visit",
    "Wound bed characteristics and exudate description",
    "Contraindication screening documented",
    "Patient response and tolerance",
    "Physician order on file",
  ],
  outcomeMeasures: [
    "≥50% wound area reduction at 4 weeks indicates positive response",
    "Wound bed tissue quality improvement (granulation vs. slough)",
    "Exudate reduction",
    "Pain score (NRS 0–10)",
    "BWAT score trend",
  ],
  citations: [
    "NICE MTG5 — Mist Therapy System for Wound Healing (2011)",
    "Ennis WJ et al. Ultrasound therapy for recalcitrant diabetic foot ulcers. Wound Repair Regen. 2005",
    "Noridian LCD L38779 — Ultrasound Wound Therapy",
  ],
};

// ── UltraMIST Duration Calculator ────────────────────────────────────────────

export const calculateUltraMISTDuration = (
  length: number,
  width: number,
): number => {
  const area = length * width;
  if (area < 10) return 3;
  if (area < 25) return 7;
  if (area < 50) return 12;
  return 20;
};

// ── Wound Healing Progress ────────────────────────────────────────────────────

export interface WoundMeasurement {
  length: number;
  width: number;
  depth: number;
}

export interface HealingProgressResult {
  percentReduction: number;
  weeklyRate: number;
  onTrack: boolean;
  recommendation: string;
}

export const assessHealingProgress = (
  baseline: WoundMeasurement,
  current: WoundMeasurement,
  weeks: number,
): HealingProgressResult => {
  const baselineArea = baseline.length * baseline.width;
  const currentArea = current.length * current.width;

  const percentReduction =
    baselineArea === 0
      ? 100
      : Math.round(((baselineArea - currentArea) / baselineArea) * 100);

  const weeklyRate =
    weeks > 0 ? Math.round((percentReduction / weeks) * 10) / 10 : 0;

  const onTrack = percentReduction >= 50;

  let recommendation: string;
  if (percentReduction >= 100) {
    recommendation = "Wound fully healed. Discharge from wound care.";
  } else if (onTrack) {
    recommendation = "Continue current treatment plan. On track for healing.";
  } else {
    recommendation =
      "Reassess treatment plan. Consider advanced therapies: NPWT, UltraMIST, collagen dressings, or surgical consult.";
  }

  return { percentReduction, weeklyRate, onTrack, recommendation };
};

// ── BWAT Scoring ──────────────────────────────────────────────────────────────

export interface BWATResult {
  healingStatus: "regeneration" | "stable" | "degeneration";
  interpretation: string;
}

export const interpretBWAT = (score: number): BWATResult => {
  if (score <= 20) {
    return {
      healingStatus: "regeneration",
      interpretation: "Wound is healing well. Continue current treatment plan.",
    };
  } else if (score <= 35) {
    return {
      healingStatus: "stable",
      interpretation:
        "Wound is stable. Monitor closely and reassess treatment if no improvement in 2 weeks.",
    };
  } else {
    return {
      healingStatus: "degeneration",
      interpretation:
        "Wound is deteriorating. Reassess treatment plan immediately. Consider advanced therapies.",
    };
  }
};

// ── Diabetic Foot Protocols ───────────────────────────────────────────────────

export interface DiabeticFootProtocol {
  wagnGrade: number;
  description: string;
  offloadingOptions: string[];
  ptRole: string[];
  referralCriteria: string[];
  outcomeMeasures: string[];
}

export const diabeticFootProtocols: DiabeticFootProtocol[] = [
  {
    wagnGrade: 0,
    description: "No open lesion; may have deformity or cellulitis",
    offloadingOptions: [
      "Therapeutic footwear with custom orthotics",
      "Extra-depth shoes",
      "Accommodative insoles",
    ],
    ptRole: [
      "Footwear assessment and education",
      "Gait training and fall prevention",
      "Patient education on daily foot inspection",
      "Strengthening and balance exercises",
    ],
    referralCriteria: [
      "Charcot foot deformity",
      "Peripheral arterial disease (ABI <0.9)",
      "Neuropathy with loss of protective sensation",
    ],
    outcomeMeasures: [
      "Monofilament sensation testing",
      "ABI measurement",
      "Foot deformity assessment",
    ],
  },
  {
    wagnGrade: 1,
    description: "Superficial ulcer without subcutaneous tissue involvement",
    offloadingOptions: [
      "Total Contact Cast (TCC) — gold standard",
      "Removable Cast Walker (RCW)",
      "Instant Total Contact Cast (iTCC)",
      "Forefoot offloading shoe",
    ],
    ptRole: [
      "Wound measurement and documentation",
      "Dressing selection and application",
      "Offloading device fitting and education",
      "Gait training with offloading device",
    ],
    referralCriteria: [
      "Wound not healing after 4 weeks of standard care",
      "Signs of infection (erythema, warmth, purulence)",
      "Peripheral arterial disease",
    ],
    outcomeMeasures: [
      "Wound area reduction (target ≥50% at 4 weeks)",
      "Wound bed tissue quality",
      "Offloading compliance",
    ],
  },
  {
    wagnGrade: 2,
    description: "Deeper ulcer penetrating to tendon, capsule, or bone",
    offloadingOptions: [
      "Total Contact Cast (TCC)",
      "Non-weight-bearing with assistive device",
      "Surgical offloading procedures",
    ],
    ptRole: [
      "Advanced wound care and debridement assistance",
      "Non-weight-bearing gait training",
      "Edema management",
      "Functional mobility training",
    ],
    referralCriteria: [
      "Osteomyelitis workup required (bone biopsy, MRI)",
      "Vascular surgery for revascularization",
      "Orthopedic surgery for bone resection",
      "Infectious disease for antibiotic management",
    ],
    outcomeMeasures: [
      "Wound area and depth measurements",
      "Bone scan or MRI results",
      "Functional mobility status",
    ],
  },
];

// ── Venous Ulcer Protocol ─────────────────────────────────────────────────────

export interface VenousUlcerProtocol {
  evidenceLevel: number;
  citation: string;
  compressionOptions: string[];
  compressionTherapy: string;
  exerciseProtocol: string[];
  outcomeMeasures: string[];
}

export const venousUlcerProtocol: VenousUlcerProtocol = {
  evidenceLevel: 5,
  citation:
    "Cochrane Review: O'Meara S et al. Compression for venous leg ulcers. Cochrane Database Syst Rev. 2012.",
  compressionOptions: [
    "4-layer compression bandage — gold standard (Cochrane Level 1A)",
    "Short-stretch compression bandage",
    "Compression stockings (20–30 mmHg or 30–40 mmHg)",
    "Intermittent pneumatic compression (IPC)",
  ],
  compressionTherapy:
    "Sustained graduated compression is the cornerstone of venous ulcer management. ABPI ≥0.8 required before applying compression. Target 40 mmHg at ankle.",
  exerciseProtocol: [
    "Ankle pump exercises — 10 reps × 3 sets hourly",
    "Calf raises — 15 reps × 3 sets daily",
    "Walking program — 30 minutes daily as tolerated",
    "Leg elevation — 30 minutes 3–4× daily above heart level",
    "Avoid prolonged standing or sitting",
  ],
  outcomeMeasures: [
    "ABPI measurement before and during compression therapy",
    "Wound area reduction (target ≥50% at 12 weeks)",
    "Exudate level and wound bed quality",
    "Pain score (NRS 0–10)",
    "Edema circumference measurements",
    "RESVECH 2.0 or PUSH tool score",
  ],
};

// ── Dressing Guide ────────────────────────────────────────────────────────────

export interface DressingGuide {
  name: string;
  indications: string[];
  contraindications: string[];
  changeFrequency: string;
}

export const dressingGuide: DressingGuide[] = [
  {
    name: "Hydrocolloid",
    indications: [
      "Stage 2 pressure injuries",
      "Partial-thickness wounds",
      "Low to moderate exudate",
      "Autolytic debridement",
    ],
    contraindications: ["Infected wounds", "Heavy exudate", "Stage 3–4 wounds"],
    changeFrequency: "3–7 days or when seal is broken",
  },
  {
    name: "Foam",
    indications: [
      "Stage 2–3 pressure injuries",
      "Moderate to heavy exudate",
      "Fragile periwound skin",
    ],
    contraindications: ["Dry wounds", "Wounds requiring autolytic debridement"],
    changeFrequency: "2–7 days depending on exudate",
  },
  {
    name: "Alginate",
    indications: [
      "Heavy exudate",
      "Bleeding wounds",
      "Stage 3–4 pressure injuries",
      "Infected wounds with packing",
    ],
    contraindications: ["Dry wounds", "Low exudate", "Wounds with eschar"],
    changeFrequency: "1–3 days",
  },
  {
    name: "Transparent Film",
    indications: [
      "Stage 1 pressure injuries",
      "Superficial wounds",
      "IV site protection",
      "Secondary dressing",
    ],
    contraindications: [
      "Infected wounds",
      "Moderate to heavy exudate",
      "Fragile skin",
    ],
    changeFrequency: "3–7 days",
  },
  {
    name: "Silicone Foam",
    indications: [
      "Fragile skin",
      "DTI protection",
      "Periwound maceration prevention",
    ],
    contraindications: ["Heavy exudate without absorbent layer"],
    changeFrequency: "3–7 days",
  },
];
