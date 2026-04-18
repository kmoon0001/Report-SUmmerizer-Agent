/**
 * Cardiopulmonary & Vestibular Rehabilitation Clinical Content
 *
 * Sources:
 * - AACVPR Guidelines for Cardiac Rehabilitation (2021)
 * - ATS/ERS Standards for Pulmonary Rehabilitation (2013, updated 2022)
 * - Vestibular Disorders Association (VeDA) Clinical Guidelines
 * - Bhattacharyya et al. CPG for BPPV (Otolaryngology 2017, updated 2019)
 * - Borg RPE Scale (Borg 1982)
 * - AHA/ACC Cardiac Rehab Guidelines (2021)
 *
 * Requirements: 1.2, 1.3
 */

// ============================================================================
// CARDIOPULMONARY ASSESSMENT TOOLS
// ============================================================================

export interface CardiopulmonaryAssessmentTool {
  name: string;
  acronym: string;
  domain: "cardiac" | "pulmonary" | "general";
  description: string;
  scoringRange: { min: number; max: number; unit: string };
  mcid?: number;
  interpretation: (
    score: number,
    age?: number,
    sex?: "male" | "female",
  ) => string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const cardiopulmonaryAssessmentTools: CardiopulmonaryAssessmentTool[] = [
  {
    name: "Six-Minute Walk Test",
    acronym: "6MWT",
    domain: "general",
    description:
      "Submaximal exercise test measuring distance walked in 6 minutes on flat surface",
    scoringRange: { min: 0, max: 800, unit: "meters" },
    mcid: 30,
    interpretation: (score: number, age = 65, sex = "male") => {
      // Normative reference: Enright & Sherrill (1998), ATS 2002
      const predicted =
        sex === "male"
          ? 7.57 * 170 - 5.02 * age - 1.76 * 80 - 309
          : 2.11 * 160 - 2.29 * 60 - 5.78 * age + 667;
      const pct = Math.round((score / Math.max(predicted, 1)) * 100);
      if (pct >= 90) return `Normal (${pct}% predicted) — community ambulation`;
      if (pct >= 70)
        return `Mildly reduced (${pct}% predicted) — limited community`;
      if (pct >= 50)
        return `Moderately reduced (${pct}% predicted) — household ambulation`;
      return `Severely reduced (${pct}% predicted) — requires assistance`;
    },
    evidenceLevel: 5,
    citation:
      "ATS Committee on Proficiency Standards for Clinical Pulmonary Function Laboratories. ATS statement: guidelines for the six-minute walk test. Am J Respir Crit Care Med. 2002;166(1):111-7.",
  },
  {
    name: "Borg Rate of Perceived Exertion Scale",
    acronym: "Borg RPE",
    domain: "general",
    description: "Subjective measure of exercise intensity (6–20 scale)",
    scoringRange: { min: 6, max: 20, unit: "RPE" },
    interpretation: (score: number) => {
      if (score <= 9) return "Very light — warm-up/cool-down intensity";
      if (score <= 11) return "Light — comfortable, can hold full conversation";
      if (score <= 13)
        return "Somewhat hard — target for cardiac rehab (Phase II)";
      if (score <= 15) return "Hard — vigorous, short sentences only";
      if (score <= 17) return "Very hard — near maximal, not sustained";
      return "Maximal — cannot continue";
    },
    evidenceLevel: 5,
    citation:
      "Borg GA. Psychophysical bases of perceived exertion. Med Sci Sports Exerc. 1982;14(5):377-81.",
  },
  {
    name: "Modified Borg Dyspnea Scale",
    acronym: "mBorg",
    domain: "pulmonary",
    description: "Measures breathlessness intensity (0–10 scale)",
    scoringRange: { min: 0, max: 10, unit: "dyspnea" },
    mcid: 1,
    interpretation: (score: number) => {
      if (score === 0) return "No breathlessness";
      if (score <= 2) return "Slight — acceptable during exercise";
      if (score <= 4) return "Moderate — monitor closely";
      if (score <= 6) return "Severe — reduce intensity or stop";
      return "Very severe — stop exercise, assess immediately";
    },
    evidenceLevel: 5,
    citation:
      "Borg GA. Psychophysical bases of perceived exertion. Med Sci Sports Exerc. 1982;14(5):377-81.",
  },
  {
    name: "New York Heart Association Functional Classification",
    acronym: "NYHA",
    domain: "cardiac",
    description:
      "Classifies heart failure severity based on functional limitation",
    scoringRange: { min: 1, max: 4, unit: "class" },
    interpretation: (score: number) => {
      if (score === 1)
        return "Class I — No limitation; ordinary activity does not cause symptoms";
      if (score === 2)
        return "Class II — Slight limitation; comfortable at rest, ordinary activity causes symptoms";
      if (score === 3)
        return "Class III — Marked limitation; comfortable at rest, less than ordinary activity causes symptoms";
      return "Class IV — Unable to carry on any activity without discomfort; symptoms at rest";
    },
    evidenceLevel: 5,
    citation:
      "Criteria Committee, New York Heart Association. Nomenclature and Criteria for Diagnosis of Diseases of the Heart and Great Vessels. 9th ed. Boston: Little, Brown & Co; 1994.",
  },
  {
    name: "MRC Dyspnea Scale",
    acronym: "MRC",
    domain: "pulmonary",
    description: "Grades breathlessness severity based on activity level (1–5)",
    scoringRange: { min: 1, max: 5, unit: "grade" },
    interpretation: (score: number) => {
      if (score === 1)
        return "Grade 1 — Breathless only with strenuous exercise";
      if (score === 2)
        return "Grade 2 — Short of breath when hurrying or walking up slight hill";
      if (score === 3)
        return "Grade 3 — Walks slower than contemporaries or stops after 15 min on flat";
      if (score === 4)
        return "Grade 4 — Stops for breath after 100 meters or after a few minutes on flat";
      return "Grade 5 — Too breathless to leave house or breathless when dressing/undressing";
    },
    evidenceLevel: 5,
    citation:
      "Fletcher CM. Standardised questionnaire on respiratory symptoms: a statement prepared and approved by the MRC Committee on the Aetiology of Chronic Bronchitis. BMJ. 1960;2:1665.",
  },
];

// ============================================================================
// CARDIAC REHABILITATION PHASES
// ============================================================================

export interface CardiacRehabPhase {
  phase: "I" | "II" | "III" | "IV";
  name: string;
  setting: string;
  timing: string;
  goals: string[];
  ptInterventions: string[];
  vitalSignTargets: {
    heartRateMax: string;
    bpMax: string;
    spo2Min: number;
    borgRPETarget: string;
  };
  contraindications: string[];
  progressionCriteria: string[];
  evidenceLevel: 3 | 4 | 5;
}

export const cardiacRehabPhases: CardiacRehabPhase[] = [
  {
    phase: "I",
    name: "Inpatient / Acute",
    setting: "Hospital (ICU → step-down → floor)",
    timing: "Day 1–7 post-event (MI, CABG, valve surgery)",
    goals: [
      "Prevent deconditioning and complications of bed rest",
      "Achieve independence with ADLs and low-level ambulation",
      "Patient and family education on cardiac disease",
      "Risk factor identification",
    ],
    ptInterventions: [
      "Passive and active ROM exercises",
      "Dangling at bedside → sitting → standing",
      "Ambulation: 50–100 feet with monitoring",
      "Stair training before discharge (1 flight)",
      "Energy conservation education",
      "Breathing exercises (diaphragmatic, pursed-lip)",
      "Vital sign monitoring before/during/after activity",
    ],
    vitalSignTargets: {
      heartRateMax: "Resting HR + 20 bpm (or per physician order)",
      bpMax: "SBP <180 mmHg, DBP <110 mmHg",
      spo2Min: 90,
      borgRPETarget: "11–13 (light to somewhat hard)",
    },
    contraindications: [
      "Unstable angina",
      "Uncontrolled arrhythmia",
      "Decompensated heart failure",
      "Acute pericarditis or myocarditis",
      "Severe aortic stenosis (symptomatic)",
      "Recent embolism",
      "Fever >38°C",
    ],
    progressionCriteria: [
      "Hemodynamically stable ≥24h",
      "No new ischemic changes on ECG",
      "Pain controlled (≤3/10)",
      "SpO2 ≥90% on room air or supplemental O2",
    ],
    evidenceLevel: 5,
  },
  {
    phase: "II",
    name: "Outpatient / Early Recovery",
    setting: "Supervised outpatient cardiac rehab center",
    timing: "1–6 weeks post-discharge (typically 36 sessions over 12 weeks)",
    goals: [
      "Improve cardiovascular fitness (VO2max)",
      "Return to work and recreational activities",
      "Risk factor modification (lipids, BP, weight, smoking)",
      "Psychological recovery (anxiety, depression)",
      "Medication adherence education",
    ],
    ptInterventions: [
      "Aerobic exercise: treadmill, cycle ergometer, arm ergometer",
      "Target: 40–80% heart rate reserve (Karvonen formula)",
      "Duration: 20–40 min continuous or interval training",
      "Resistance training: 40–60% 1RM, 10–15 reps, 1–3 sets",
      "Flexibility and warm-up/cool-down (10 min each)",
      "Continuous ECG monitoring (telemetry)",
      "Vital signs before, during, after each session",
      "Borg RPE target: 12–14 (somewhat hard)",
    ],
    vitalSignTargets: {
      heartRateMax: "40–80% HRR (Karvonen) or per stress test",
      bpMax: "SBP <220 mmHg, DBP <110 mmHg during exercise",
      spo2Min: 88,
      borgRPETarget: "12–14 (somewhat hard)",
    },
    contraindications: [
      "Unstable angina or recent MI (<3 days)",
      "Uncontrolled arrhythmia causing symptoms",
      "Symptomatic severe aortic stenosis",
      "Decompensated heart failure",
      "Acute pulmonary embolism",
      "Acute myocarditis or pericarditis",
      "Resting SBP >200 or DBP >110",
    ],
    progressionCriteria: [
      "Tolerating 20+ min continuous aerobic exercise",
      "Borg RPE ≤14 at target HR",
      "No angina or significant arrhythmia during exercise",
      "SpO2 maintained ≥88% throughout",
    ],
    evidenceLevel: 5,
  },
  {
    phase: "III",
    name: "Maintenance / Community",
    setting: "Community fitness center or home",
    timing: "After Phase II completion — lifelong",
    goals: [
      "Maintain cardiovascular fitness gains",
      "Long-term lifestyle modification",
      "Independent exercise management",
      "Ongoing risk factor control",
    ],
    ptInterventions: [
      "Independent aerobic exercise program (150+ min/week moderate)",
      "Home exercise program with self-monitoring",
      "Heart rate and RPE self-monitoring",
      "Resistance training 2–3x/week",
      "Annual reassessment with 6MWT or stress test",
      "Symptom recognition and emergency action plan",
    ],
    vitalSignTargets: {
      heartRateMax: "40–70% HRR (self-monitored)",
      bpMax: "Per physician guidance",
      spo2Min: 88,
      borgRPETarget: "12–14 (self-monitored)",
    },
    contraindications: ["New cardiac symptoms — return to supervised care"],
    progressionCriteria: [
      "Demonstrated safe independent exercise for ≥4 weeks",
    ],
    evidenceLevel: 5,
  },
  {
    phase: "IV",
    name: "Long-Term Maintenance",
    setting: "Community / home / gym",
    timing: "Lifelong",
    goals: [
      "Lifelong cardiovascular health maintenance",
      "Secondary prevention of cardiac events",
      "Quality of life optimization",
    ],
    ptInterventions: [
      "Annual PT reassessment",
      "Exercise prescription updates as needed",
      "Fall prevention integration (especially elderly)",
      "Comorbidity management (diabetes, COPD, obesity)",
    ],
    vitalSignTargets: {
      heartRateMax: "Per individual capacity",
      bpMax: "Per physician guidance",
      spo2Min: 88,
      borgRPETarget: "11–14",
    },
    contraindications: [],
    progressionCriteria: [],
    evidenceLevel: 4,
  },
];

// ============================================================================
// PULMONARY REHABILITATION PROTOCOLS
// ============================================================================

export interface PulmonaryRehabProtocol {
  condition: string;
  icdCode: string;
  interventions: string[];
  breathingTechniques: BreathingTechnique[];
  exercisePrescription: string;
  outcomesMeasures: string[];
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface BreathingTechnique {
  name: string;
  indication: string;
  technique: string;
  frequency: string;
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    name: "Pursed-Lip Breathing (PLB)",
    indication: "COPD, dyspnea, anxiety-related breathlessness",
    technique:
      "Inhale through nose 2 counts; exhale through pursed lips 4 counts (2:1 ratio). Slows respiratory rate, increases tidal volume, reduces air trapping.",
    frequency: "During exertion and dyspnea episodes; practice 4–5x/day",
  },
  {
    name: "Diaphragmatic Breathing",
    indication: "COPD, post-surgical, anxiety, general deconditioning",
    technique:
      "Hand on abdomen; inhale through nose, abdomen rises (not chest); exhale slowly. Improves ventilation efficiency and reduces accessory muscle use.",
    frequency: "10 min, 2–3x/day; use during all exercise sessions",
  },
  {
    name: "Active Cycle of Breathing Technique (ACBT)",
    indication:
      "Secretion clearance: COPD, bronchiectasis, cystic fibrosis, post-surgical",
    technique:
      "3-phase cycle: (1) Breathing control (diaphragmatic, 3–4 breaths); (2) Thoracic expansion exercises (3–4 deep breaths with 3s hold); (3) Forced expiration technique (huffing). Repeat 3–4 cycles.",
    frequency: "2x/day or as needed for secretion clearance",
  },
  {
    name: "Incentive Spirometry",
    indication: "Post-surgical atelectasis prevention, pneumonia recovery",
    technique:
      "Slow maximal inhalation to target volume; hold 3–5 seconds; exhale slowly. Promotes alveolar recruitment.",
    frequency: "10 repetitions every 1–2 hours while awake (post-surgical)",
  },
  {
    name: "Paced Breathing for Exertion",
    indication: "COPD, heart failure, pulmonary hypertension",
    technique:
      "Coordinate breathing with activity: exhale during exertion phase (e.g., exhale when pushing up from chair, climbing stairs). Reduces dyspnea during functional tasks.",
    frequency: "Apply during all ADLs and exercise",
  },
];

export const pulmonaryRehabProtocols: PulmonaryRehabProtocol[] = [
  {
    condition: "COPD (Moderate–Severe)",
    icdCode: "J44.1",
    interventions: [
      "Aerobic exercise: walking or cycling, 20–30 min, 3–5x/week",
      "Interval training if continuous exercise not tolerated",
      "Resistance training: upper and lower extremity, 2–3x/week",
      "Pursed-lip breathing and diaphragmatic breathing training",
      "ACBT for secretion clearance if productive cough",
      "Energy conservation and pacing education",
      "Supplemental O2 if SpO2 <88% during exercise (per order)",
      "Inspiratory muscle training (IMT) if MIP <60 cmH2O",
    ],
    breathingTechniques: breathingTechniques.filter((t) =>
      [
        "Pursed-Lip Breathing (PLB)",
        "Diaphragmatic Breathing",
        "Active Cycle of Breathing Technique (ACBT)",
      ].includes(t.name),
    ),
    exercisePrescription:
      "Aerobic: 60–80% peak work rate or Borg 4–6/10 dyspnea; 20–30 min; 3–5x/week. Resistance: 60–70% 1RM; 8–12 reps; 2–3 sets; 2–3x/week.",
    outcomesMeasures: [
      "6MWT (MCID: 30m)",
      "MRC Dyspnea Scale",
      "COPD Assessment Test (CAT)",
      "St. George Respiratory Questionnaire (SGRQ)",
      "Borg dyspnea during 6MWT",
    ],
    evidenceLevel: 5,
    citation:
      "Spruit MA, et al. An official American Thoracic Society/European Respiratory Society statement: key concepts and advances in pulmonary rehabilitation. Am J Respir Crit Care Med. 2013;188(8):e13-64.",
  },
  {
    condition: "Heart Failure (Stable)",
    icdCode: "I50.9",
    interventions: [
      "Aerobic exercise: walking, cycling; start 10–15 min, progress to 30–45 min",
      "Target: 40–70% HRR or Borg RPE 12–14",
      "Resistance training: low-moderate intensity, 40–60% 1RM",
      "Diaphragmatic breathing and energy conservation",
      "Daily weight monitoring education (>2 lb/day = call physician)",
      "Symptom recognition: dyspnea, edema, fatigue, palpitations",
      "Activity pacing for ADLs",
    ],
    breathingTechniques: breathingTechniques.filter((t) =>
      ["Diaphragmatic Breathing", "Paced Breathing for Exertion"].includes(
        t.name,
      ),
    ),
    exercisePrescription:
      "Start: 10–15 min/session; progress 5 min/week to 30–45 min. Frequency: 3–5x/week. Intensity: 40–70% HRR or Borg 12–14.",
    outcomesMeasures: [
      "6MWT (MCID: 30m)",
      "NYHA Class",
      "Kansas City Cardiomyopathy Questionnaire (KCCQ)",
      "Borg RPE",
      "Daily weight log",
    ],
    evidenceLevel: 5,
    citation:
      "Piepoli MF, et al. Exercise training in heart failure: from theory to practice. A consensus document of the Heart Failure Association and the European Association for Cardiovascular Prevention and Rehabilitation. Eur J Heart Fail. 2011;13(4):347-57.",
  },
];

// ============================================================================
// VESTIBULAR REHABILITATION
// ============================================================================

export type BPPVCanal = "posterior" | "anterior" | "horizontal";
export type BPPVSide = "left" | "right";

export interface VestibularAssessmentTool {
  name: string;
  acronym: string;
  description: string;
  scoringRange: { min: number; max: number; unit: string };
  mcid?: number;
  interpretation: (score: number) => string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const vestibularAssessmentTools: VestibularAssessmentTool[] = [
  {
    name: "Dizziness Handicap Inventory",
    acronym: "DHI",
    description:
      "Self-report measure of dizziness-related disability (28 items, 0–100)",
    scoringRange: { min: 0, max: 100, unit: "points" },
    mcid: 18,
    interpretation: (score: number) => {
      if (score <= 16) return "No/mild handicap";
      if (score <= 34) return "Mild handicap";
      if (score <= 54) return "Moderate handicap";
      return "Severe handicap — significant functional limitation";
    },
    evidenceLevel: 5,
    citation:
      "Jacobson GP, Newman CW. The development of the Dizziness Handicap Inventory. Arch Otolaryngol Head Neck Surg. 1990;116(4):424-7.",
  },
  {
    name: "Dynamic Gait Index",
    acronym: "DGI",
    description: "8-item gait assessment under varying conditions (0–24)",
    scoringRange: { min: 0, max: 24, unit: "points" },
    mcid: 3,
    interpretation: (score: number) => {
      if (score >= 22) return "Safe community ambulator — low fall risk";
      if (score >= 19) return "Mostly safe — mild fall risk";
      return "Fall risk — vestibular/balance intervention indicated";
    },
    evidenceLevel: 5,
    citation:
      "Shumway-Cook A, Woollacott MH. Motor Control: Theory and Practical Applications. Baltimore: Williams & Wilkins; 1995.",
  },
  {
    name: "Activities-Specific Balance Confidence Scale",
    acronym: "ABC",
    description: "Self-report balance confidence in 16 activities (0–100%)",
    scoringRange: { min: 0, max: 100, unit: "%" },
    mcid: 13,
    interpretation: (score: number) => {
      if (score >= 80) return "High confidence — low fall risk";
      if (score >= 50) return "Moderate confidence — moderate fall risk";
      return "Low confidence — high fall risk, fear of falling";
    },
    evidenceLevel: 4,
    citation:
      "Powell LE, Myers AM. The Activities-specific Balance Confidence (ABC) Scale. J Gerontol A Biol Sci Med Sci. 1995;50A(1):M28-34.",
  },
];

export interface BPPVManeuver {
  name: string;
  targetCanal: BPPVCanal;
  steps: string[];
  positionHoldTime: number; // seconds
  successRate: string;
  contraindications: string[];
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const bppvManeuvers: BPPVManeuver[] = [
  {
    name: "Epley Canalith Repositioning Maneuver",
    targetCanal: "posterior",
    steps: [
      "Start: Patient seated, head turned 45° toward affected ear",
      "Position 1: Rapidly recline to supine with head extended 20° below table (Dix-Hallpike positive side). Hold 30–60s until nystagmus resolves.",
      "Position 2: Rotate head 90° toward unaffected side (now 45° away from affected ear). Hold 30–60s.",
      "Position 3: Roll body and head together 90° further toward unaffected side (patient now facing down at 45°). Hold 30–60s.",
      "Return to seated position slowly. Instruct patient to remain upright for 24–48h.",
    ],
    positionHoldTime: 60,
    successRate: "80–90% resolution in 1–3 treatments (Cochrane 2014)",
    contraindications: [
      "Cervical spine instability or severe stenosis",
      "Severe carotid artery disease",
      "Unstable cardiovascular disease",
      "Inability to extend neck",
      "Acute neck injury",
    ],
    evidenceLevel: 5,
    citation:
      "Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo (Update). Otolaryngol Head Neck Surg. 2017;156(3_suppl):S1-S47.",
  },
  {
    name: "Semont Liberatory Maneuver",
    targetCanal: "posterior",
    steps: [
      "Start: Patient seated on edge of table, head turned 45° toward unaffected side.",
      "Position 1: Rapidly tilt patient to lie on affected side (head now facing up). Hold 1–3 min.",
      "Position 2: Rapidly swing patient to opposite side in one continuous motion (head now facing down). Hold 1–3 min.",
      "Return to seated position slowly.",
    ],
    positionHoldTime: 180,
    successRate: "70–90% (alternative to Epley for posterior canal BPPV)",
    contraindications: [
      "Cervical spine instability",
      "Severe obesity limiting positioning",
      "Acute neck injury",
    ],
    evidenceLevel: 4,
    citation:
      "Semont A, Freyss G, Vitte E. Curing the BPPV with a liberatory maneuver. Adv Otorhinolaryngol. 1988;42:290-3.",
  },
  {
    name: "Barbecue Roll (Lempert) Maneuver",
    targetCanal: "horizontal",
    steps: [
      "Start: Patient supine, head flat.",
      "Position 1: Turn head 90° toward affected ear. Hold 30–60s.",
      "Position 2: Roll entire body 90° toward unaffected side (now lying on unaffected side). Hold 30–60s.",
      "Position 3: Continue rolling 90° to prone position (face down). Hold 30–60s.",
      "Position 4: Roll 90° to lie on affected side. Hold 30–60s.",
      "Return to supine, then sit up slowly.",
    ],
    positionHoldTime: 60,
    successRate: "75–80% for horizontal canal BPPV",
    contraindications: [
      "Cervical spine instability",
      "Severe hip or shoulder pathology limiting rolling",
    ],
    evidenceLevel: 4,
    citation:
      "Lempert T, Tiel-Wilck K. A positional maneuver for treatment of horizontal-canal benign positional vertigo. Laryngoscope. 1996;106(4):476-8.",
  },
];

export interface VestibularExerciseProgram {
  name: string;
  indication: string;
  exercises: VestibularExercise[];
  frequency: string;
  duration: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface VestibularExercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  progressions: string[];
}

export const vestibularExercisePrograms: VestibularExerciseProgram[] = [
  {
    name: "Gaze Stabilization Exercises (VOR Adaptation)",
    indication:
      "Unilateral or bilateral vestibular hypofunction, chronic dizziness",
    exercises: [
      {
        name: "VOR x1 — Head Horizontal",
        description:
          "Hold target at arm's length. Move head side-to-side while keeping target in focus. Target stays still.",
        sets: 3,
        reps: 20,
        progressions: [
          "Increase speed",
          "Use busy background",
          "Perform while walking",
        ],
      },
      {
        name: "VOR x1 — Head Vertical",
        description:
          "Hold target at arm's length. Move head up-down while keeping target in focus.",
        sets: 3,
        reps: 20,
        progressions: [
          "Increase speed",
          "Use busy background",
          "Perform while walking",
        ],
      },
      {
        name: "VOR x2 — Target Moves Opposite",
        description:
          "Move head and target in opposite directions simultaneously. More challenging VOR adaptation.",
        sets: 2,
        reps: 15,
        progressions: [
          "Increase speed",
          "Reduce target size",
          "Perform on foam surface",
        ],
      },
    ],
    frequency: "3–5x/day",
    duration: "1–2 min per exercise; 6–8 week program",
    evidenceLevel: 5,
    citation:
      "Hall CD, et al. Vestibular Rehabilitation for Peripheral Vestibular Hypofunction: An Evidence-Based Clinical Practice Guideline. J Neurol Phys Ther. 2022;46(2):118-177.",
  },
  {
    name: "Habituation Exercises",
    indication:
      "Motion sensitivity, BPPV residual symptoms, central vestibular dysfunction",
    exercises: [
      {
        name: "Brandt-Daroff Exercises",
        description:
          "Sit upright. Quickly lie on one side with head at 45° angle. Hold 30s or until dizziness resolves. Return to sitting. Repeat on other side.",
        sets: 5,
        reps: 1,
        progressions: [
          "Increase repetitions",
          "Decrease rest time between sides",
        ],
      },
      {
        name: "Motion Sensitivity Quotient Exercises",
        description:
          "Perform movements that provoke mild dizziness (e.g., head turns, bending, rolling). Repeat until habituation occurs.",
        sets: 3,
        reps: 10,
        progressions: [
          "Increase speed",
          "Add head movements during walking",
          "Perform in busy environments",
        ],
      },
    ],
    frequency: "2–3x/day",
    duration: "10–15 min/session; 4–6 week program",
    evidenceLevel: 4,
    citation:
      "Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo (Update). Otolaryngol Head Neck Surg. 2017;156(3_suppl):S1-S47.",
  },
  {
    name: "Balance and Gait Training",
    indication: "All vestibular disorders with balance impairment",
    exercises: [
      {
        name: "Romberg Progression",
        description:
          "Stand with feet together, eyes open → eyes closed → on foam → on foam eyes closed. Progress through levels as tolerated.",
        sets: 3,
        reps: 1,
        progressions: [
          "Reduce base of support",
          "Add head movements",
          "Tandem stance",
          "Single-leg stance",
        ],
      },
      {
        name: "Tandem Walking",
        description:
          "Walk heel-to-toe in straight line, 10 steps. Eyes open → eyes closed → with head turns.",
        sets: 3,
        reps: 10,
        progressions: ["Add head turns", "Perform on foam", "Increase speed"],
      },
      {
        name: "Dynamic Balance — Head Turns During Walking",
        description:
          "Walk at comfortable pace while turning head side-to-side every 2 steps. Challenges VOR-gait integration.",
        sets: 3,
        reps: 1,
        progressions: [
          "Increase speed",
          "Add vertical head movements",
          "Perform on uneven surface",
        ],
      },
    ],
    frequency: "2x/day",
    duration: "15–20 min/session; 6–8 week program",
    evidenceLevel: 5,
    citation:
      "Hall CD, et al. Vestibular Rehabilitation for Peripheral Vestibular Hypofunction: An Evidence-Based Clinical Practice Guideline. J Neurol Phys Ther. 2022;46(2):118-177.",
  },
];

// ============================================================================
// KARVONEN FORMULA UTILITY
// ============================================================================

/**
 * Calculates target heart rate range using Karvonen formula
 * Source: Karvonen MJ, et al. Ann Med Exp Biol Fenn. 1957;35(3):307-15.
 */
export function calculateTargetHeartRate(
  age: number,
  restingHR: number,
  intensityLow: number = 0.4,
  intensityHigh: number = 0.7,
): { low: number; high: number; hrr: number; maxHR: number } {
  const maxHR = 220 - age; // Tanaka formula: 208 - 0.7*age is more accurate but 220-age is standard
  const hrr = maxHR - restingHR; // Heart Rate Reserve
  return {
    low: Math.round(hrr * intensityLow + restingHR),
    high: Math.round(hrr * intensityHigh + restingHR),
    hrr,
    maxHR,
  };
}

/**
 * Interprets Borg RPE for exercise prescription
 */
export function interpretBorgRPE(rpe: number): {
  intensity: string;
  recommendation: string;
} {
  if (rpe <= 9)
    return {
      intensity: "Very Light",
      recommendation: "Warm-up/cool-down only",
    };
  if (rpe <= 11)
    return {
      intensity: "Light",
      recommendation: "Suitable for Phase I cardiac rehab",
    };
  if (rpe <= 13)
    return {
      intensity: "Somewhat Hard",
      recommendation: "Target for Phase II cardiac rehab and COPD",
    };
  if (rpe <= 15)
    return {
      intensity: "Hard",
      recommendation: "Vigorous — Phase III maintenance",
    };
  if (rpe <= 17)
    return {
      intensity: "Very Hard",
      recommendation: "Near maximal — not for sustained exercise",
    };
  return { intensity: "Maximal", recommendation: "Stop — maximal exertion" };
}

/**
 * Interprets 6MWT distance relative to predicted normal
 * Reference: Enright PL, Sherrill DL. Am J Respir Crit Care Med. 1998;158(5 Pt 1):1384-7.
 */
export function interpret6MWT(
  distance: number,
  age: number,
  sex: "male" | "female",
  heightCm: number,
  weightKg: number,
): { predicted: number; percentPredicted: number; interpretation: string } {
  const predicted =
    sex === "male"
      ? Math.round(7.57 * heightCm - 5.02 * age - 1.76 * weightKg - 309)
      : Math.round(2.11 * heightCm - 2.29 * weightKg - 5.78 * age + 667);
  const percentPredicted = Math.round(
    (distance / Math.max(predicted, 1)) * 100,
  );
  let interpretation: string;
  if (percentPredicted >= 90) interpretation = "Normal — community ambulation";
  else if (percentPredicted >= 70)
    interpretation = "Mildly reduced — limited community";
  else if (percentPredicted >= 50)
    interpretation = "Moderately reduced — household ambulation";
  else interpretation = "Severely reduced — requires assistance";
  return { predicted, percentPredicted, interpretation };
}
