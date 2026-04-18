/**
 * Sports Rehabilitation & Pelvic Health Clinical Content
 *
 * Sources:
 * - APTA Sports Physical Therapy Section CPGs
 * - JOSPT Return-to-Sport Guidelines (Ardern et al. 2016)
 * - Functional Movement Screen (Cook et al. 2006)
 * - APTA Academy of Pelvic Health Physical Therapy
 * - Bø et al. Evidence-Based Physical Therapy for the Pelvic Floor (2015)
 * - ICS/IUGA Joint Report on Terminology (2010)
 * - NICE CG171 Urinary Incontinence in Women (2013, updated 2019)
 *
 * Requirements: 1.2, 1.3
 */

// ============================================================================
// SPORTS REHABILITATION
// ============================================================================

export interface FMSTest {
  name: string;
  description: string;
  maxScore: number;
  scoringCriteria: { score: number; description: string }[];
  commonDysfunctions: string[];
  correctives: string[];
}

export const fmsTests: FMSTest[] = [
  {
    name: "Deep Squat",
    description:
      "Bilateral, symmetrical, functional mobility of hips, knees, ankles; thoracic extension; shoulder flexion",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Torso parallel to tibia; femur below horizontal; knees aligned over feet; dowel aligned over feet",
      },
      {
        score: 2,
        description:
          "Torso parallel to tibia with 2×4 under heels; femur below horizontal; knees aligned over feet",
      },
      {
        score: 1,
        description:
          "Tibia and torso not parallel; femur not below horizontal; knees not aligned; lumbar flexion noted",
      },
      { score: 0, description: "Pain with any portion of test" },
    ],
    commonDysfunctions: [
      "Limited ankle dorsiflexion",
      "Hip flexor tightness",
      "Thoracic kyphosis",
      "Limited shoulder flexion",
    ],
    correctives: [
      "Ankle mobility drills",
      "Hip flexor stretching",
      "Thoracic extension mobilization",
      "Overhead squat with band",
    ],
  },
  {
    name: "Hurdle Step",
    description:
      "Stride mechanics and step-over-step stability; hip, knee, ankle mobility and stability",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Hips, knees, ankles aligned in sagittal plane; minimal lumbar movement; dowel remains parallel to hurdle",
      },
      {
        score: 2,
        description:
          "Alignment or movement lost; contact between foot and hurdle; lumbar movement noted",
      },
      {
        score: 1,
        description: "Contact made between foot and hurdle; loss of balance",
      },
      { score: 0, description: "Pain with any portion of test" },
    ],
    commonDysfunctions: [
      "Hip flexor weakness",
      "Ankle instability",
      "Contralateral hip drop",
      "Trunk lateral shift",
    ],
    correctives: [
      "Single-leg balance",
      "Hip flexor strengthening",
      "Ankle proprioception",
      "Lateral hip strengthening",
    ],
  },
  {
    name: "Inline Lunge",
    description:
      "Thoracic spine, hip, knee, ankle mobility and stability in sagittal plane",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Dowel contacts maintained; no torso movement; knee touches board behind heel; feet remain in sagittal plane",
      },
      {
        score: 2,
        description:
          "Dowel contacts not maintained; movement noted in torso; knee does not touch board",
      },
      { score: 1, description: "Loss of balance" },
      { score: 0, description: "Pain with any portion of test" },
    ],
    commonDysfunctions: [
      "Hip mobility restriction",
      "Ankle dorsiflexion deficit",
      "Knee valgus",
      "Trunk rotation",
    ],
    correctives: [
      "Hip mobility work",
      "Ankle dorsiflexion stretching",
      "VMO strengthening",
      "Core stability",
    ],
  },
  {
    name: "Shoulder Mobility",
    description:
      "Bilateral shoulder ROM combining internal rotation/adduction and external rotation/abduction",
    maxScore: 3,
    scoringCriteria: [
      { score: 3, description: "Fists within one hand length of each other" },
      {
        score: 2,
        description: "Fists within one-and-a-half hand lengths of each other",
      },
      {
        score: 1,
        description:
          "Fists not within one-and-a-half hand lengths of each other",
      },
      {
        score: 0,
        description: "Pain with any portion of test or clearing test positive",
      },
    ],
    commonDysfunctions: [
      "Posterior capsule tightness",
      "Pec minor tightness",
      "Thoracic kyphosis",
      "Rotator cuff restriction",
    ],
    correctives: [
      "Sleeper stretch",
      "Pec minor stretch",
      "Thoracic extension",
      "Shoulder ER strengthening",
    ],
  },
  {
    name: "Active Straight-Leg Raise",
    description:
      "Active hamstring and gastroc-soleus flexibility; core stability during lower extremity movement",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Vertical line of ankle between mid-thigh and ASIS; opposite leg remains flat",
      },
      {
        score: 2,
        description:
          "Vertical line of ankle between mid-thigh and joint line; opposite leg remains flat",
      },
      {
        score: 1,
        description: "Vertical line of ankle falls below joint line",
      },
      { score: 0, description: "Pain with any portion of test" },
    ],
    commonDysfunctions: [
      "Hamstring tightness",
      "Hip flexor tightness contralateral",
      "Core instability",
      "Posterior chain restriction",
    ],
    correctives: [
      "Hamstring stretching",
      "Hip flexor stretching",
      "Dead bug exercises",
      "Posterior chain mobility",
    ],
  },
  {
    name: "Trunk Stability Push-Up",
    description:
      "Reflexive core stability in sagittal plane during upper extremity push pattern",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Male: thumbs at forehead; Female: thumbs at chin — body lifts as unit, no lag in lumbar spine",
      },
      {
        score: 2,
        description:
          "Male: thumbs at chin; Female: thumbs at clavicle — body lifts as unit",
      },
      {
        score: 1,
        description: "Unable to perform with thumbs at chin/clavicle",
      },
      {
        score: 0,
        description:
          "Pain with any portion of test or spinal extension clearing test positive",
      },
    ],
    commonDysfunctions: [
      "Core instability",
      "Scapular dyskinesis",
      "Lumbar extension compensation",
      "Shoulder weakness",
    ],
    correctives: [
      "Dead bug",
      "Plank progressions",
      "Scapular stabilization",
      "Push-up progressions",
    ],
  },
  {
    name: "Rotary Stability",
    description:
      "Multi-planar trunk stability during combined upper and lower extremity movement",
    maxScore: 3,
    scoringCriteria: [
      {
        score: 3,
        description:
          "Performs unilateral repetition with balance; spine parallel to board; knee touches elbow in sagittal plane",
      },
      {
        score: 2,
        description:
          "Performs diagonal pattern without loss of balance; spine parallel to board",
      },
      {
        score: 1,
        description:
          "Unable to perform diagonal pattern without loss of balance",
      },
      {
        score: 0,
        description:
          "Pain with any portion of test or posterior rocking clearing test positive",
      },
    ],
    commonDysfunctions: [
      "Rotational instability",
      "Hip mobility restriction",
      "Shoulder instability",
      "Core asymmetry",
    ],
    correctives: [
      "Bird-dog",
      "Pallof press",
      "Hip mobility",
      "Rotational core work",
    ],
  },
];

export function calculateFMSScore(scores: number[]): {
  total: number;
  asymmetries: number;
  riskLevel: string;
  recommendation: string;
} {
  const total = scores.reduce((sum, s) => sum + s, 0);
  const asymmetries = scores.filter((s) => s === 1).length;
  let riskLevel: string;
  let recommendation: string;
  if (total <= 14) {
    riskLevel = "Elevated injury risk";
    recommendation =
      "Address movement dysfunctions before return to sport; corrective exercise program indicated";
  } else if (total <= 17) {
    riskLevel = "Moderate — monitor asymmetries";
    recommendation =
      "Address asymmetries; sport-specific training with corrective integration";
  } else {
    riskLevel = "Low injury risk";
    recommendation =
      "Cleared for sport-specific training; reassess every 6–8 weeks";
  }
  return { total, asymmetries, riskLevel, recommendation };
}

export interface ReturnToSportCriteria {
  sport: string;
  criteria: {
    category: string;
    tests: string[];
    passingThreshold: string;
  }[];
  timelineMinimum: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const returnToSportCriteria: ReturnToSportCriteria[] = [
  {
    sport: "ACL Reconstruction (General)",
    criteria: [
      {
        category: "Strength",
        tests: [
          "Quadriceps LSI ≥90% (isokinetic or single-leg press)",
          "Hamstring LSI ≥90%",
          "Hip abductor LSI ≥90%",
        ],
        passingThreshold: "All ≥90% limb symmetry index (LSI)",
      },
      {
        category: "Functional Performance",
        tests: [
          "Single-leg hop LSI ≥90%",
          "Triple hop LSI ≥90%",
          "Crossover hop LSI ≥90%",
          "6-meter timed hop LSI ≥90%",
        ],
        passingThreshold: "All 4 hop tests ≥90% LSI",
      },
      {
        category: "Psychological Readiness",
        tests: ["ACL-RSI score ≥65", "Tampa Scale of Kinesiophobia <37"],
        passingThreshold: "ACL-RSI ≥65",
      },
      {
        category: "Movement Quality",
        tests: [
          "FMS ≥14 with no asymmetries",
          "Landing Error Scoring System (LESS) ≤5",
          "Tuck jump assessment",
        ],
        passingThreshold: "FMS ≥14; LESS ≤5",
      },
    ],
    timelineMinimum:
      "9 months post-surgery (Grindem et al. 2016 — each additional month reduces re-injury risk 51%)",
    evidenceLevel: 5,
    citation:
      "Ardern CL, et al. 2016 Consensus statement on return to sport from the First World Congress in Sports Physical Therapy. Br J Sports Med. 2016;50(14):853-64.",
  },
  {
    sport: "Ankle Sprain (Grade II–III)",
    criteria: [
      {
        category: "Strength",
        tests: ["Peroneal strength LSI ≥90%", "Plantarflexion LSI ≥90%"],
        passingThreshold: "LSI ≥90%",
      },
      {
        category: "Balance/Proprioception",
        tests: [
          "SEBT anterior reach ≥90% LSI",
          "Single-leg stance eyes closed ≥10s",
          "Star Excursion Balance Test",
        ],
        passingThreshold: "SEBT ≥90% LSI",
      },
      {
        category: "Functional Performance",
        tests: [
          "Figure-8 run",
          "Carioca",
          "Side-step cutting",
          "Sport-specific agility",
        ],
        passingThreshold: "Pain-free, full speed",
      },
    ],
    timelineMinimum: "4–8 weeks (Grade II); 8–12 weeks (Grade III)",
    evidenceLevel: 4,
    citation:
      "Vuurberg G, et al. Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. Br J Sports Med. 2018;52(15):956.",
  },
];

export interface SportSpecificProtocol {
  phase: string;
  name: string;
  weeks: string;
  activities: string[];
  progressionCriteria: string[];
}

export const aclRehabProtocol: SportSpecificProtocol[] = [
  {
    phase: "1",
    name: "Acute / Inflammatory",
    weeks: "0–2",
    activities: [
      "RICE protocol; crutches as needed",
      "Quad sets, SLR (4 planes)",
      "Ankle pumps, heel slides",
      "Patellar mobilization",
      "Gait training — normalize pattern",
      "Cryotherapy 20 min q2h",
    ],
    progressionCriteria: [
      "Full knee extension",
      "Flexion ≥90°",
      "Minimal effusion",
      "Normal gait without assistive device",
    ],
  },
  {
    phase: "2",
    name: "Strengthening / Neuromuscular",
    weeks: "2–12",
    activities: [
      "Closed-chain: mini-squats, leg press, step-ups",
      "Open-chain terminal knee extension (TKE)",
      "Hip strengthening: abduction, extension, ER",
      "Balance: single-leg stance, BOSU, perturbation training",
      "Stationary bike (ROM permitting)",
      "Pool walking/running (if available)",
    ],
    progressionCriteria: [
      "Flexion ≥120°",
      "Quad strength ≥60% LSI",
      "Single-leg squat without valgus",
      "No effusion",
    ],
  },
  {
    phase: "3",
    name: "Power / Plyometric",
    weeks: "12–24",
    activities: [
      "Double-leg → single-leg plyometrics",
      "Box jumps, depth jumps, lateral bounds",
      "Agility ladder, cone drills",
      "Running progression: straight → curves → cutting",
      "Sport-specific movement patterns",
      "Perturbation training on unstable surfaces",
    ],
    progressionCriteria: [
      "Quad LSI ≥80%",
      "All 4 hop tests ≥80% LSI",
      "Pain-free running",
      "No effusion post-activity",
    ],
  },
  {
    phase: "4",
    name: "Return to Sport",
    weeks: "24–36+",
    activities: [
      "Full sport-specific training",
      "Contact drills (if applicable)",
      "Game simulation",
      "Maintenance strength program",
      "Psychological readiness assessment",
    ],
    progressionCriteria: [
      "All RTS criteria met (LSI ≥90%, FMS ≥14, ACL-RSI ≥65)",
      "Physician clearance",
      "Minimum 9 months post-op",
    ],
  },
];

// ============================================================================
// PELVIC HEALTH REHABILITATION
// ============================================================================

export type IncontinenceType =
  | "stress"
  | "urge"
  | "mixed"
  | "overflow"
  | "functional";
export type PelvicFloorTone =
  | "hypertonic"
  | "hypotonic"
  | "normal"
  | "incoordination";

export interface PelvicFloorAssessment {
  modifiedOxfordScale: {
    grade: number;
    description: string;
    clinicalImplication: string;
  }[];
  iciqSF: {
    description: string;
    scoringRange: { min: number; max: number };
    interpretation: (score: number) => string;
    mcid: number;
  };
  pfdiShort: {
    description: string;
    scoringRange: { min: number; max: number };
    interpretation: (score: number) => string;
  };
}

export const pelvicFloorAssessment: PelvicFloorAssessment = {
  modifiedOxfordScale: [
    {
      grade: 0,
      description: "No contraction",
      clinicalImplication: "Severe weakness — begin with biofeedback/e-stim",
    },
    {
      grade: 1,
      description: "Flicker only",
      clinicalImplication:
        "Severe weakness — biofeedback, e-stim, awareness training",
    },
    {
      grade: 2,
      description: "Weak contraction, no lift",
      clinicalImplication: "Moderate weakness — begin PFMT with feedback",
    },
    {
      grade: 3,
      description: "Moderate contraction with some lift",
      clinicalImplication: "Moderate — PFMT, progress to functional activities",
    },
    {
      grade: 4,
      description: "Good contraction with lift, some resistance",
      clinicalImplication:
        "Mild weakness — PFMT with resistance, functional training",
    },
    {
      grade: 5,
      description: "Strong contraction, full lift, full resistance",
      clinicalImplication:
        "Normal — maintenance program, address contributing factors",
    },
  ],
  iciqSF: {
    description:
      "International Consultation on Incontinence Questionnaire Short Form — 3 scored items (0–21)",
    scoringRange: { min: 0, max: 21 },
    interpretation: (score: number) => {
      if (score === 0) return "No incontinence";
      if (score <= 5) return "Slight — lifestyle modification, PFMT";
      if (score <= 12)
        return "Moderate — PFMT, bladder training, consider referral";
      if (score <= 18)
        return "Severe — intensive PFMT, multidisciplinary management";
      return "Very severe — urgent referral, intensive intervention";
    },
    mcid: 2,
  },
  pfdiShort: {
    description:
      "Pelvic Floor Distress Inventory Short Form 20 — 20 items across 3 subscales (0–300)",
    scoringRange: { min: 0, max: 300 },
    interpretation: (score: number) => {
      if (score <= 50) return "Minimal distress";
      if (score <= 100) return "Mild distress — PFMT and education";
      if (score <= 200) return "Moderate distress — comprehensive pelvic PT";
      return "Severe distress — multidisciplinary care indicated";
    },
  },
};

export interface PFMTProtocol {
  name: string;
  indication: IncontinenceType[];
  toneTarget: PelvicFloorTone[];
  exercises: {
    name: string;
    description: string;
    sets: number;
    reps: number;
    holdSeconds: number;
    restSeconds: number;
    progressions: string[];
  }[];
  frequency: string;
  duration: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const pfmtProtocols: PFMTProtocol[] = [
  {
    name: "Standard PFMT — Stress Urinary Incontinence",
    indication: ["stress", "mixed"],
    toneTarget: ["hypotonic"],
    exercises: [
      {
        name: "Maximal Voluntary Contraction (MVC)",
        description:
          "Contract pelvic floor muscles as hard as possible (as if stopping urine flow AND gas). Hold, then fully relax. Ensure no breath-holding or gluteal co-contraction.",
        sets: 3,
        reps: 8,
        holdSeconds: 8,
        restSeconds: 8,
        progressions: [
          "Increase hold to 10s",
          "Add quick flicks after each hold",
          "Perform in standing/functional positions",
        ],
      },
      {
        name: "Quick Flicks",
        description:
          "Rapid maximal contraction and immediate full relaxation. Trains fast-twitch fibers for cough/sneeze response.",
        sets: 3,
        reps: 10,
        holdSeconds: 1,
        restSeconds: 1,
        progressions: [
          "Increase to 15 reps",
          "Perform during functional tasks",
          "Add with cough/sneeze simulation",
        ],
      },
      {
        name: "The Knack Maneuver",
        description:
          "Pre-contract pelvic floor 1–2 seconds BEFORE and during cough, sneeze, or lift. Prevents stress leakage.",
        sets: 3,
        reps: 5,
        holdSeconds: 3,
        restSeconds: 5,
        progressions: [
          "Practice with actual cough",
          "Apply during exercise",
          "Automate as habit",
        ],
      },
    ],
    frequency: "Daily (minimum 3x/day)",
    duration:
      "12-week minimum; NICE CG171 recommends supervised PFMT ≥3 months before surgery consideration",
    evidenceLevel: 5,
    citation:
      "Bø K, et al. Evidence-Based Physical Therapy for the Pelvic Floor. 2nd ed. Churchill Livingstone; 2015. | NICE CG171 (2013, updated 2019).",
  },
  {
    name: "Bladder Training — Urge Urinary Incontinence",
    indication: ["urge", "mixed"],
    toneTarget: ["hypotonic", "incoordination"],
    exercises: [
      {
        name: "Urge Suppression Technique",
        description:
          "When urge occurs: STOP, stand still or sit down, contract pelvic floor 5–6 times rapidly (quick flicks), breathe slowly, wait for urge to pass, then walk calmly to toilet. Do NOT rush.",
        sets: 1,
        reps: 1,
        holdSeconds: 0,
        restSeconds: 0,
        progressions: [
          "Increase delay time by 15 min/week",
          "Apply in progressively challenging situations",
        ],
      },
      {
        name: "Timed Voiding / Bladder Diary",
        description:
          "Void on schedule (every 2–3h initially) regardless of urge. Gradually extend interval by 15–30 min/week toward 3–4h goal. Track in bladder diary.",
        sets: 1,
        reps: 1,
        holdSeconds: 0,
        restSeconds: 0,
        progressions: [
          "Extend voiding interval weekly",
          "Target 3–4h between voids",
          "Reduce nocturia episodes",
        ],
      },
    ],
    frequency: "Continuous behavioral strategy; bladder diary 3 days/week",
    duration: "6–12 weeks; combine with PFMT for mixed incontinence",
    evidenceLevel: 5,
    citation:
      "Bø K, et al. Evidence-Based Physical Therapy for the Pelvic Floor. 2nd ed. Churchill Livingstone; 2015.",
  },
  {
    name: "Pelvic Floor Downtraining — Hypertonic/Pelvic Pain",
    indication: ["functional"],
    toneTarget: ["hypertonic"],
    exercises: [
      {
        name: "Diaphragmatic Breathing with Pelvic Floor Release",
        description:
          "Inhale deeply into abdomen — allow pelvic floor to descend and relax with breath. Exhale slowly. Focus on LETTING GO rather than contracting.",
        sets: 3,
        reps: 10,
        holdSeconds: 5,
        restSeconds: 3,
        progressions: [
          "Add visualization of pelvic floor opening",
          "Progress to functional positions",
          "Combine with hip stretching",
        ],
      },
      {
        name: "Happy Baby / Child's Pose",
        description:
          "Yoga-derived positions that promote pelvic floor lengthening. Hold each position with diaphragmatic breathing.",
        sets: 2,
        reps: 1,
        holdSeconds: 60,
        restSeconds: 30,
        progressions: [
          "Increase hold time",
          "Add gentle rocking",
          "Progress to squatting",
        ],
      },
    ],
    frequency: "2–3x/day",
    duration: "8–12 weeks; may require manual therapy adjunct",
    evidenceLevel: 4,
    citation:
      "Bø K, et al. Evidence-Based Physical Therapy for the Pelvic Floor. 2nd ed. Churchill Livingstone; 2015.",
  },
];

export interface BladderBowelProtocol {
  name: string;
  condition: string;
  interventions: string[];
  patientEducation: string[];
  outcomesMeasures: string[];
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const bladderBowelProtocols: BladderBowelProtocol[] = [
  {
    name: "Bowel Retraining Program",
    condition: "Constipation, fecal incontinence, neurogenic bowel",
    interventions: [
      "Establish regular bowel routine (same time daily, 20–30 min after meal — gastrocolic reflex)",
      "Defecation posture: feet elevated on stool (squatty potty), lean forward, elbows on knees — reduces puborectalis angle",
      "Abdominal massage: I-love-U technique (ascending → transverse → descending colon), 10 min daily",
      "Pelvic floor coordination training: relax pelvic floor during defecation (paradoxical contraction correction)",
      "Biofeedback for dyssynergia: surface EMG to train pelvic floor relaxation during bearing down",
      "Dietary counseling: 25–35g fiber/day, 6–8 glasses water/day",
      "Physical activity: 30 min moderate exercise daily to stimulate peristalsis",
    ],
    patientEducation: [
      "Never ignore the urge to defecate",
      "Allow adequate time — do not rush",
      "Avoid straining — use breathing techniques",
      "Fiber and fluid intake guidelines",
      "Recognize signs of constipation vs. normal variation",
    ],
    outcomesMeasures: [
      "Bristol Stool Scale",
      "Wexner Constipation Score",
      "Fecal Incontinence Severity Index (FISI)",
      "Bowel diary",
    ],
    evidenceLevel: 4,
    citation:
      "Rao SS, et al. Diagnosis and management of chronic constipation in adults. Nat Rev Gastroenterol Hepatol. 2016;13(5):295-305.",
  },
  {
    name: "Catheter Removal / Bladder Retraining Post-Catheterization",
    condition:
      "Post-surgical urinary retention, neurogenic bladder, post-catheter removal",
    interventions: [
      "Timed voiding: void every 2h initially; extend by 30 min/week",
      "PFMT to restore sphincter control post-catheter removal",
      "Bladder diary: track void times, volumes, leakage episodes",
      "Fluid management: 1.5–2L/day; avoid caffeine, alcohol, carbonated beverages",
      "Urge suppression techniques (see bladder training protocol)",
      "Pelvic floor biofeedback if sphincter weakness identified",
      "Coordinate with nursing for post-void residual (PVR) monitoring — goal PVR <100 mL",
    ],
    patientEducation: [
      "Normal voiding frequency: 6–8 times/day, 0–1 times at night",
      "Normal void volume: 250–400 mL",
      "Signs of UTI: burning, frequency, cloudy urine — report immediately",
      'Avoid "just in case" voiding — trains bladder to hold less',
      "Pelvic floor exercises before and after catheter removal",
    ],
    outcomesMeasures: [
      "Post-void residual (PVR) volume",
      "Voiding diary",
      "ICIQ-SF score",
      "Time to catheter-free status",
    ],
    evidenceLevel: 4,
    citation:
      "Newman DK, et al. Continence promotion, education & primary prevention. In: Abrams P, et al. (eds). Incontinence. 6th ed. ICI-ICS; 2017.",
  },
];

export interface PrePostPartumProtocol {
  phase: "prenatal" | "postpartum-early" | "postpartum-late";
  name: string;
  timing: string;
  interventions: string[];
  precautions: string[];
  returnToActivityGuidelines: string[];
  evidenceLevel: 3 | 4 | 5;
}

export const prePostPartumProtocols: PrePostPartumProtocol[] = [
  {
    phase: "prenatal",
    name: "Prenatal Pelvic Floor & Core Program",
    timing: "Throughout pregnancy (all trimesters)",
    interventions: [
      "PFMT: 3 sets × 8–12 reps, 6–8s hold, daily — prevents incontinence and prolapse",
      "Transverse abdominis activation (gentle core)",
      "Pelvic girdle pain management: SIJ stabilization, posture education",
      "Breathing mechanics: diaphragmatic breathing, avoid Valsalva",
      "Safe exercise: walking, swimming, prenatal yoga, stationary cycling",
      "Diastasis recti screening and education (linea alba separation)",
      "Perineal massage from 34 weeks: reduces perineal trauma during delivery",
    ],
    precautions: [
      "Avoid supine exercise after 20 weeks (vena cava compression)",
      "Avoid high-impact activities if pelvic girdle pain present",
      "No contact sports or activities with fall risk",
      "Stop if: vaginal bleeding, dyspnea, chest pain, contractions, decreased fetal movement",
    ],
    returnToActivityGuidelines: ["N/A — prenatal phase"],
    evidenceLevel: 5,
  },
  {
    phase: "postpartum-early",
    name: "Early Postpartum Recovery (0–6 weeks)",
    timing: "0–6 weeks postpartum",
    interventions: [
      "Gentle PFMT: begin day 1–2 post-vaginal delivery (or when comfortable post-C-section)",
      "Diaphragmatic breathing and gentle core activation",
      "Walking: begin with short distances, progress gradually",
      "Perineal care: sitz baths, ice packs, hygiene education",
      "Scar management (C-section or episiotomy): gentle massage after 6 weeks",
      "Posture and body mechanics for infant care (feeding, lifting)",
      "Diastasis recti assessment at 6-week check",
    ],
    precautions: [
      "No high-impact exercise until 12 weeks minimum",
      "No running until 12 weeks (Groom et al. 2019 guidelines)",
      "Avoid heavy lifting (>baby weight) for 6 weeks",
      "Monitor for prolapse symptoms: heaviness, bulge, dragging sensation",
    ],
    returnToActivityGuidelines: [
      "Walking: immediate, gradual progression",
      "Swimming: after lochia stops (~6 weeks)",
      "Cycling: 8–10 weeks",
      "Running: minimum 12 weeks with PFMT clearance",
    ],
    evidenceLevel: 4,
  },
  {
    phase: "postpartum-late",
    name: "Return to Sport / High-Impact Activity (12+ weeks)",
    timing: "12+ weeks postpartum",
    interventions: [
      "Progressive PFMT: advance to functional and sport-specific loading",
      "Core rehabilitation: progress from gentle activation to loaded exercises",
      "Running readiness assessment: single-leg balance, hop tests, no leakage with impact",
      "Diastasis recti management: functional loading progression",
      "Return-to-sport criteria: no symptoms with 20 min walking, single-leg balance ≥10s, no leakage with impact",
      "Strength training: progressive overload, monitor for prolapse symptoms",
    ],
    precautions: [
      "Any leakage, prolapse symptoms, or pelvic pain = reduce load and reassess",
      "Breastfeeding: relaxin still elevated — joint laxity persists",
      "Individual variation: timeline is minimum, not guarantee",
    ],
    returnToActivityGuidelines: [
      "Running: 12 weeks minimum + PFMT clearance + no symptoms",
      "HIIT/CrossFit: 16+ weeks with progressive loading",
      "Heavy lifting: 16+ weeks with core and PF assessment",
      "Contact sports: 16+ weeks with physician clearance",
    ],
    evidenceLevel: 4,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function interpretICIQSF(score: number): string {
  return pelvicFloorAssessment.iciqSF.interpretation(score);
}

export function interpretModifiedOxford(grade: number): {
  description: string;
  clinicalImplication: string;
} {
  const entry = pelvicFloorAssessment.modifiedOxfordScale.find(
    (e) => e.grade === grade,
  );
  return entry
    ? {
        description: entry.description,
        clinicalImplication: entry.clinicalImplication,
      }
    : { description: "Invalid grade", clinicalImplication: "Reassess" };
}
