/**
 * Pediatric PT Clinical Content
 * Sources: APTA Pediatrics Section; CDC Developmental Milestones (2022);
 *          PDMS-2 (Folio & Fewell 2000); GMFM-88/66 (Russell et al. 2002);
 *          APTA CPG for Cerebral Palsy (2022); AAP Bright Futures 4th ed.
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

// ── Developmental Milestones (CDC 2022) ───────────────────────────────────────
export interface DevelopmentalMilestone {
  ageMonths: number;
  ageLabel: string;
  grossMotor: string[];
  fineMotor: string[];
  redFlags: string[];
}

export const developmentalMilestones: DevelopmentalMilestone[] = [
  {
    ageMonths: 2,
    ageLabel: "2 months",
    grossMotor: [
      "Holds head up briefly during tummy time",
      "Moves both arms and legs",
    ],
    fineMotor: ["Opens and closes hands", "Brings hands to mouth"],
    redFlags: [
      "Does not hold head up at all during tummy time",
      "Does not move arms or legs",
    ],
  },
  {
    ageMonths: 4,
    ageLabel: "4 months",
    grossMotor: [
      "Holds head steady without support",
      "Pushes up on elbows during tummy time",
      "Rolls from tummy to back",
    ],
    fineMotor: ["Holds toy when placed in hand", "Swings at dangling toys"],
    redFlags: [
      "Cannot hold head steady",
      "Does not push up on elbows",
      "Does not bring hands to mouth",
    ],
  },
  {
    ageMonths: 6,
    ageLabel: "6 months",
    grossMotor: [
      "Rolls from back to tummy",
      "Sits with support",
      "Bears weight on legs when held standing",
    ],
    fineMotor: ["Reaches for toys", "Transfers objects hand to hand"],
    redFlags: [
      "Cannot roll in either direction",
      "Cannot sit with support",
      "Does not reach for objects",
    ],
  },
  {
    ageMonths: 9,
    ageLabel: "9 months",
    grossMotor: [
      "Sits without support",
      "Pulls to stand",
      "Crawls on hands and knees",
    ],
    fineMotor: ["Pincer grasp emerging", "Bangs objects together"],
    redFlags: [
      "Cannot sit without support",
      "Does not bear weight on legs",
      "Does not transfer objects",
    ],
  },
  {
    ageMonths: 12,
    ageLabel: "12 months",
    grossMotor: [
      "Pulls to stand and cruises",
      "May take first independent steps",
      "Stands momentarily without support",
    ],
    fineMotor: [
      "Pincer grasp (thumb + index finger)",
      "Releases objects voluntarily",
    ],
    redFlags: [
      "Cannot pull to stand",
      "Does not cruise along furniture",
      "Does not use pincer grasp",
    ],
  },
  {
    ageMonths: 18,
    ageLabel: "18 months",
    grossMotor: [
      "Walks independently",
      "Climbs onto furniture",
      "Walks up stairs with support",
    ],
    fineMotor: ["Stacks 2–4 blocks", "Scribbles with crayon"],
    redFlags: [
      "Not walking independently",
      "Cannot walk up stairs with support",
      "Frequent falls",
    ],
  },
  {
    ageMonths: 24,
    ageLabel: "24 months",
    grossMotor: ["Runs (stiff-legged)", "Kicks ball", "Jumps with both feet"],
    fineMotor: ["Stacks 6 blocks", "Turns pages of book"],
    redFlags: [
      "Cannot run",
      "Cannot kick a ball",
      "Walks on toes consistently",
    ],
  },
  {
    ageMonths: 36,
    ageLabel: "3 years",
    grossMotor: [
      "Climbs stairs alternating feet",
      "Pedals tricycle",
      "Stands on one foot briefly",
    ],
    fineMotor: ["Copies circle", "Uses scissors with help"],
    redFlags: [
      "Cannot climb stairs",
      "Falls frequently",
      "Cannot stand on one foot",
    ],
  },
  {
    ageMonths: 48,
    ageLabel: "4 years",
    grossMotor: [
      "Hops on one foot",
      "Catches bounced ball",
      "Skips (emerging)",
    ],
    fineMotor: ["Copies cross and square", "Buttons clothing"],
    redFlags: ["Cannot hop", "Cannot catch a ball", "Difficulty with stairs"],
  },
  {
    ageMonths: 60,
    ageLabel: "5 years",
    grossMotor: [
      "Skips alternating feet",
      "Stands on one foot ≥10 seconds",
      "Somersaults",
    ],
    fineMotor: ["Copies triangle", "Writes some letters"],
    redFlags: [
      "Cannot skip",
      "Cannot stand on one foot 5 seconds",
      "Clumsy/frequent falls",
    ],
  },
];

// ── PDMS-2 Subtests ───────────────────────────────────────────────────────────
export interface PDMS2Subtest {
  name: string;
  ageRange: string;
  description: string;
  items: number;
  scoringNote: string;
}

export const pdms2Subtests: PDMS2Subtest[] = [
  {
    name: "Reflexes",
    ageRange: "Birth–11 months",
    description:
      "Assesses primitive and postural reflexes that support motor development",
    items: 8,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
  {
    name: "Stationary",
    ageRange: "Birth–71 months",
    description:
      "Measures ability to sustain control of body within center of gravity",
    items: 30,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
  {
    name: "Locomotion",
    ageRange: "Birth–71 months",
    description:
      "Measures ability to move from one place to another (crawling, walking, running)",
    items: 89,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
  {
    name: "Object Manipulation",
    ageRange: "12–71 months",
    description:
      "Measures ability to manipulate balls (catching, throwing, kicking)",
    items: 24,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
  {
    name: "Grasping",
    ageRange: "Birth–71 months",
    description:
      "Measures ability to use hands (palmar grasp, pincer grasp, manipulation)",
    items: 26,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
  {
    name: "Visual-Motor Integration",
    ageRange: "Birth–71 months",
    description:
      "Measures ability to use visual perceptual skills to perform complex eye-hand tasks",
    items: 72,
    scoringNote: "0 = cannot perform; 1 = emerging; 2 = mastered",
  },
];

export function interpretPDMS2Score(
  rawScore: number,
  ageMonths: number,
): {
  percentileRank: string;
  standardScore: string;
  interpretation: string;
} {
  // Simplified interpretation bands (actual PDMS-2 requires age-normed tables)
  const pct = Math.round((rawScore / (ageMonths * 2)) * 100);
  if (pct >= 84)
    return {
      percentileRank: "≥84th",
      standardScore: "≥115",
      interpretation: "Above average — no delay identified",
    };
  if (pct >= 50)
    return {
      percentileRank: "50th–83rd",
      standardScore: "90–114",
      interpretation: "Average — monitor development",
    };
  if (pct >= 16)
    return {
      percentileRank: "16th–49th",
      standardScore: "75–89",
      interpretation: "Below average — PT evaluation recommended",
    };
  return {
    percentileRank: "<16th",
    standardScore: "<75",
    interpretation: "Significantly below average — PT intervention indicated",
  };
}

// ── GMFM-88 Dimensions ────────────────────────────────────────────────────────
export interface GMFMDimension {
  letter: string;
  name: string;
  items: number;
  description: string;
  examples: string[];
}

export const gmfmDimensions: GMFMDimension[] = [
  {
    letter: "A",
    name: "Lying & Rolling",
    items: 17,
    description: "Supine, prone, and rolling activities",
    examples: [
      "Supine: head in midline",
      "Rolls supine to prone",
      "Prone: lifts head 90°",
    ],
  },
  {
    letter: "B",
    name: "Sitting",
    items: 20,
    description: "Sitting balance and transitions",
    examples: [
      "Sits with arm support 3s",
      "Sits without support 10s",
      "Sits to standing",
    ],
  },
  {
    letter: "C",
    name: "Crawling & Kneeling",
    items: 14,
    description: "Quadruped, crawling, and kneeling activities",
    examples: [
      "Creeps on hands and knees 1.8m",
      "Half-kneeling to standing",
      "Kneels without support 10s",
    ],
  },
  {
    letter: "D",
    name: "Standing",
    items: 13,
    description: "Standing balance and transitions",
    examples: [
      "Stands with support 3s",
      "Stands without support 20s",
      "Stands on one foot 10s",
    ],
  },
  {
    letter: "E",
    name: "Walking, Running & Jumping",
    items: 24,
    description: "Ambulatory activities",
    examples: [
      "Walks 10 steps",
      "Runs 4.5m",
      "Jumps with both feet",
      "Walks up stairs alternating feet",
    ],
  },
];

export function scoreGMFM(dimensionScores: Record<string, number[]>): {
  dimensionPercents: Record<string, number>;
  totalScore: number;
  interpretation: string;
} {
  const maxItems: Record<string, number> = {
    A: 17,
    B: 20,
    C: 14,
    D: 13,
    E: 24,
  };
  const dimensionPercents: Record<string, number> = {};
  let totalPercent = 0;
  let count = 0;

  for (const [dim, scores] of Object.entries(dimensionScores)) {
    const max = maxItems[dim] ?? 1;
    const sum = scores.reduce((a, b) => a + b, 0);
    const pct = Math.round((sum / (max * 3)) * 100);
    dimensionPercents[dim] = pct;
    totalPercent += pct;
    count++;
  }

  const totalScore = count > 0 ? Math.round(totalPercent / count) : 0;
  let interpretation: string;
  if (totalScore >= 80)
    interpretation = "Mild motor impairment — community ambulator";
  else if (totalScore >= 60)
    interpretation = "Moderate impairment — household ambulator with device";
  else if (totalScore >= 40)
    interpretation = "Moderate-severe impairment — limited ambulation";
  else interpretation = "Severe impairment — primarily wheelchair mobility";

  return { dimensionPercents, totalScore, interpretation };
}

// ── GMFCS Levels ──────────────────────────────────────────────────────────────
export interface GMFCSLevel {
  level: number;
  label: string;
  description: string;
  ptGoals: string[];
  equipment: string[];
}

export const gmfcsLevels: GMFCSLevel[] = [
  {
    level: 1,
    label: "Level I — Walks without limitations",
    description:
      "Walks indoors and outdoors, climbs stairs without railing. Runs and jumps but speed, balance, and coordination are reduced.",
    ptGoals: [
      "Improve running mechanics",
      "Enhance sports participation",
      "Optimize balance for community activities",
    ],
    equipment: [
      "None typically required",
      "Orthotics for foot alignment if needed",
    ],
  },
  {
    level: 2,
    label: "Level II — Walks with limitations",
    description:
      "Walks indoors and outdoors, climbs stairs with railing. Difficulty on uneven terrain, inclines, crowds. Minimal ability to run/jump.",
    ptGoals: [
      "Improve community ambulation endurance",
      "Stair training with railing",
      "Fall prevention strategies",
    ],
    equipment: ["AFOs for foot/ankle stability", "Handrail for stairs"],
  },
  {
    level: 3,
    label: "Level III — Walks using handheld mobility device",
    description:
      "Walks indoors and outdoors on level surfaces with assistive device. Climbs stairs with railing. May use wheeled mobility for longer distances.",
    ptGoals: [
      "Optimize gait with assistive device",
      "Transfer training",
      "Endurance for functional distances",
    ],
    equipment: [
      "Forearm crutches or walker",
      "AFOs",
      "Manual wheelchair for community",
    ],
  },
  {
    level: 4,
    label: "Level IV — Self-mobility with limitations",
    description:
      "Walks short distances with walker in controlled settings. Uses wheeled mobility in most settings. May achieve floor mobility.",
    ptGoals: [
      "Maintain standing tolerance",
      "Transfer training",
      "Powered mobility training",
    ],
    equipment: [
      "Posterior walker",
      "Power wheelchair",
      "Standing frame",
      "Adaptive seating",
    ],
  },
  {
    level: 5,
    label: "Level V — Transported in manual wheelchair",
    description:
      "Physical impairments restrict voluntary control of movement. Cannot maintain head/trunk posture against gravity. All areas of motor function limited.",
    ptGoals: [
      "Positioning and pressure relief",
      "ROM maintenance",
      "Caregiver training for handling",
    ],
    equipment: [
      "Custom power wheelchair with postural support",
      "Stander",
      "Specialized seating system",
    ],
  },
];

// ── Cerebral Palsy Protocols ──────────────────────────────────────────────────
export interface CPProtocol {
  name: string;
  evidenceLevel: string;
  indication: string;
  protocol: string[];
  outcomes: string[];
  citation: string;
}

export const cerebralPalsyProtocols: CPProtocol[] = [
  {
    name: "Constraint-Induced Movement Therapy (CIMT)",
    evidenceLevel: "Level I (Cochrane 2019)",
    indication: "Hemiplegic CP, GMFCS I–II, age ≥18 months",
    protocol: [
      "Constrain unaffected limb 6 hours/day for 2–4 weeks",
      "Intensive shaping of affected limb: 3–6 hours/day structured practice",
      "Task-specific training: reaching, grasping, bimanual tasks",
      "Caregiver coaching for home carryover",
    ],
    outcomes: [
      "QUEST (Quality of Upper Extremity Skills Test)",
      "ABILHAND-Kids",
      "COPM (Canadian Occupational Performance Measure)",
    ],
    citation: "Hoare et al. Cochrane Database Syst Rev. 2019",
  },
  {
    name: "Treadmill Training",
    evidenceLevel: "Level II (RCT evidence)",
    indication: "GMFCS I–III, ambulatory or emerging ambulation",
    protocol: [
      "Body-weight supported treadmill: 30–50% body weight support initially",
      "Speed: 0.5–1.5 km/h, progressing to 2–3 km/h",
      "Duration: 20–30 min, 3–5x/week for 6–12 weeks",
      "Reduce support as gait improves; progress to overground walking",
    ],
    outcomes: ["10-Meter Walk Test", "GMFM-E dimension", "6-Minute Walk Test"],
    citation: "Willoughby et al. Dev Med Child Neurol. 2010",
  },
  {
    name: "Botulinum Toxin + PT",
    evidenceLevel: "Level I (APTA CPG 2022)",
    indication: "Spastic CP, focal spasticity limiting function, GMFCS I–IV",
    protocol: [
      "Botox injection by physician (typically gastrocnemius, hamstrings, hip adductors)",
      "PT begins within 2 weeks post-injection (optimal window: 2–6 weeks)",
      "Intensive stretching: 30-min sustained stretch 2x/day",
      "Strengthening of antagonist muscles",
      "Functional task training during optimal window",
      "Serial casting if indicated for equinus",
    ],
    outcomes: ["Modified Ashworth Scale", "GMFM", "Gait analysis (kinematics)"],
    citation: "APTA Pediatrics CPG for CP. 2022",
  },
  {
    name: "Hippotherapy / Therapeutic Horseback Riding",
    evidenceLevel: "Level II–III",
    indication: "GMFCS I–III, trunk control deficits, sensory processing needs",
    protocol: [
      "30-minute sessions, 1–2x/week for 10–12 weeks",
      "Horse movement provides multidimensional sensory input",
      "PT facilitates trunk activation, postural responses, balance reactions",
      "Progress from supported to independent sitting on horse",
    ],
    outcomes: [
      "GMFM-B (sitting dimension)",
      "Trunk control measures",
      "Caregiver-reported QOL",
    ],
    citation: "Zadnikar & Kastrin. Dev Med Child Neurol. 2011",
  },
  {
    name: "Strength Training",
    evidenceLevel: "Level I (Cochrane 2017)",
    indication: "GMFCS I–III, muscle weakness limiting function",
    protocol: [
      "Progressive resistance training: 3 sets × 8–12 reps, 3x/week",
      "Target: hip extensors, knee extensors, ankle dorsiflexors",
      "Start at 60% 1RM; progress 5–10% when 12 reps achieved with good form",
      "Functional integration: squats, step-ups, stair climbing",
      "8–12 week program minimum",
    ],
    outcomes: [
      "Manual Muscle Testing (MMT)",
      "GMFM-D/E dimensions",
      "10-Meter Walk Test",
    ],
    citation: "Ryan et al. Dev Med Child Neurol. 2017",
  },
];

// ── Age-Appropriate Exercise Progressions ─────────────────────────────────────
export interface PediatricExerciseProgression {
  ageGroup: string;
  ageRange: string;
  focus: string[];
  exercises: Array<{ name: string; sets: string; reps: string; notes: string }>;
  precautions: string[];
}

export const pediatricExerciseProgressions: PediatricExerciseProgression[] = [
  {
    ageGroup: "Infant (0–12 months)",
    ageRange: "0–12 months",
    focus: [
      "Tummy time tolerance",
      "Head/neck control",
      "Rolling facilitation",
      "Weight bearing through extremities",
    ],
    exercises: [
      {
        name: "Tummy time on caregiver chest",
        sets: "3–5x/day",
        reps: "3–5 min",
        notes: "Increase duration as tolerated",
      },
      {
        name: "Supported sitting with trunk facilitation",
        sets: "3x/day",
        reps: "5 min",
        notes: "Provide minimal support at hips",
      },
      {
        name: "Rolling facilitation (supine to side)",
        sets: "5x each side",
        reps: "Daily",
        notes: "Use toy to motivate",
      },
      {
        name: "Supported standing at surface",
        sets: "3x/day",
        reps: "2–3 min",
        notes: "Weight bearing through feet",
      },
    ],
    precautions: [
      "No unsupported sitting until developmental readiness",
      "Avoid neck hyperextension",
      "Monitor for fatigue",
    ],
  },
  {
    ageGroup: "Toddler (1–3 years)",
    ageRange: "12–36 months",
    focus: [
      "Walking refinement",
      "Stair training",
      "Balance challenges",
      "Ball skills",
    ],
    exercises: [
      {
        name: "Obstacle course walking",
        sets: "2–3x",
        reps: "5 min",
        notes: "Vary surfaces: carpet, grass, foam",
      },
      {
        name: "Stair climbing with rail",
        sets: "3–5x",
        reps: "Up and down",
        notes: "Progress to alternating feet",
      },
      {
        name: "Single-leg stance (supported)",
        sets: "3x each",
        reps: "5–10s",
        notes: "Use wall or caregiver hand",
      },
      {
        name: "Kicking stationary ball",
        sets: "10x each foot",
        reps: "Daily",
        notes: "Start with large ball",
      },
    ],
    precautions: [
      "Supervise all activities",
      "Padded surfaces for balance activities",
      "Short sessions (10–15 min)",
    ],
  },
  {
    ageGroup: "Preschool (3–5 years)",
    ageRange: "3–5 years",
    focus: ["Hopping/jumping", "Ball skills", "Balance beam", "Coordination"],
    exercises: [
      {
        name: "Bilateral jumping (floor to mat)",
        sets: "3x",
        reps: "10 jumps",
        notes: "Land with soft knees",
      },
      {
        name: "Hopping on one foot",
        sets: "3x each",
        reps: "5–10 hops",
        notes: "Progress to consecutive hops",
      },
      {
        name: "Balance beam walking",
        sets: "3x",
        reps: "Full length",
        notes: "Start wide beam, progress to narrow",
      },
      {
        name: "Catching large ball",
        sets: "3x",
        reps: "10 catches",
        notes: "Progress distance and ball size",
      },
    ],
    precautions: [
      "Spotting for balance activities",
      "Appropriate footwear",
      "Warm-up before activity",
    ],
  },
  {
    ageGroup: "School-age (6–12 years)",
    ageRange: "6–12 years",
    focus: [
      "Sport-specific skills",
      "Strength building",
      "Endurance",
      "Coordination refinement",
    ],
    exercises: [
      {
        name: "Bodyweight squats",
        sets: "3x",
        reps: "10–15",
        notes: "Progress to single-leg squat",
      },
      {
        name: "Lateral band walks",
        sets: "3x",
        reps: "15 each direction",
        notes: "Light resistance band",
      },
      {
        name: "Agility ladder drills",
        sets: "3x",
        reps: "2 lengths",
        notes: "Increase speed progressively",
      },
      {
        name: "Plyometric box jumps",
        sets: "3x",
        reps: "8–10",
        notes: "Start low box (6 inches)",
      },
    ],
    precautions: [
      "Avoid heavy loading during growth spurts",
      "Monitor for apophysitis (Osgood-Schlatter)",
      "Adequate rest between sessions",
    ],
  },
];
