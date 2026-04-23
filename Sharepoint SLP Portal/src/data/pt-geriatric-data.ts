/**
 * Geriatric Rehabilitation Clinical Content
 *
 * Comprehensive geriatric PT data including:
 * - Fall prevention protocols (CDC STEADI)
 * - Balance training interventions
 * - Functional mobility assessment
 * - Osteoporosis and arthritis management
 * - Frailty assessment and intervention
 *
 * Requirements: 1.2, 1.3, 7.6
 *
 * Evidence Sources:
 * - CDC STEADI (Stopping Elderly Accidents, Deaths & Injuries) Initiative
 * - American Geriatrics Society (AGS) Fall Prevention Guidelines
 * - APTA Geriatrics Section Clinical Practice Guidelines
 * - Cochrane Reviews for fall prevention interventions
 */

// ============================================================================
// Assessment Tools with Scoring and Interpretation
// ============================================================================

export interface GeriatricAssessmentTool {
  name: string;
  acronym: string;
  domain:
    | "fall-risk"
    | "balance"
    | "mobility"
    | "frailty"
    | "cognition"
    | "function";
  description: string;
  scoringRange: {
    min: number;
    max: number;
  };
  mcid?: number; // Minimal Clinically Important Difference
  interpretation: (score: number) => string;
  evidenceLevel: 3 | 4 | 5; // APTA evidence rating
  citation: string;
}

export const geriatricAssessmentTools: GeriatricAssessmentTool[] = [
  {
    name: "Timed Up and Go",
    acronym: "TUG",
    domain: "mobility",
    description:
      "Functional mobility test measuring time to stand from chair, walk 3 meters, turn, and return to sit",
    scoringRange: { min: 0, max: 999 },
    mcid: 3.5,
    interpretation: (score: number) => {
      if (score <= 10) return "Normal mobility - Low fall risk";
      if (score <= 14) return "Mild mobility impairment - Moderate fall risk";
      if (score <= 20) return "Moderate mobility impairment - High fall risk";
      return "Severe mobility impairment - Very high fall risk";
    },
    evidenceLevel: 5,
    citation:
      'Podsiadlo D, Richardson S. The timed "Up & Go": a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991;39(2):142-8.',
  },
  {
    name: "Berg Balance Scale",
    acronym: "BBS",
    domain: "balance",
    description: "14-item scale assessing balance during functional activities",
    scoringRange: { min: 0, max: 56 },
    mcid: 5,
    interpretation: (score: number) => {
      if (score >= 56) return "Independent - Low fall risk";
      if (score >= 45)
        return "Independent with assistive device - Moderate fall risk";
      if (score >= 21) return "Requires assistance - High fall risk";
      return "Wheelchair bound - Very high fall risk";
    },
    evidenceLevel: 5,
    citation:
      "Berg K, et al. Measuring balance in the elderly: preliminary development of an instrument. Physiother Can. 1989;41:304-311.",
  },
  {
    name: "30-Second Chair Stand Test",
    acronym: "30CST",
    domain: "mobility",
    description:
      "Measure of lower extremity strength - number of stands completed in 30 seconds",
    scoringRange: { min: 0, max: 99 },
    interpretation: (score: number) => {
      if (score >= 12) return "Above average lower extremity strength";
      if (score >= 8) return "Average lower extremity strength";
      if (score >= 4) return "Below average - increased fall risk";
      return "Poor lower extremity strength - high fall risk";
    },
    evidenceLevel: 4,
    citation:
      "Jones CJ, et al. A 30-s chair-stand test as a measure of lower body strength in community-residing older adults. Res Q Exerc Sport. 1999;70(2):113-9.",
  },
  {
    name: "Four-Stage Balance Test",
    acronym: "4SBT",
    domain: "balance",
    description:
      "Progressive balance test: feet together, semi-tandem, tandem, single-leg stance",
    scoringRange: { min: 0, max: 4 },
    interpretation: (score: number) => {
      if (score === 4)
        return "Excellent balance - completed all stages including single-leg stance";
      if (score === 3) return "Good balance - completed tandem stance";
      if (score === 2) return "Fair balance - completed semi-tandem stance";
      if (score === 1) return "Poor balance - only completed feet together";
      return "Very poor balance - unable to complete feet together stance";
    },
    evidenceLevel: 4,
    citation:
      "Rossiter-Fornoff JE, et al. A cross-sectional validation study of the FICSIT common data base static balance measures. J Gerontol A Biol Sci Med Sci. 1995;50(6):M291-7.",
  },
  {
    name: "Functional Reach Test",
    acronym: "FRT",
    domain: "balance",
    description:
      "Measure of dynamic balance - maximum forward reach distance while standing",
    scoringRange: { min: 0, max: 99 },
    mcid: 4,
    interpretation: (score: number) => {
      if (score >= 10) return "Normal functional reach - low fall risk";
      if (score >= 6) return "Moderate functional reach - moderate fall risk";
      return "Limited functional reach - high fall risk";
    },
    evidenceLevel: 4,
    citation:
      "Duncan PW, et al. Functional reach: a new clinical measure of balance. J Gerontol. 1990;45(6):M192-7.",
  },
  {
    name: "Gait Speed (10-Meter Walk Test)",
    acronym: "10MWT",
    domain: "mobility",
    description:
      "Measure of functional mobility - time to walk 10 meters at comfortable pace",
    scoringRange: { min: 0, max: 10 },
    mcid: 0.1,
    interpretation: (score: number) => {
      if (score >= 1.0) return "Normal gait speed - community ambulator";
      if (score >= 0.8) return "Limited community ambulation";
      if (score >= 0.4) return "Household ambulation only";
      return "Non-functional ambulation";
    },
    evidenceLevel: 5,
    citation:
      "Studenski S, et al. Gait speed and survival in older adults. JAMA. 2011;305(1):50-8.",
  },
  {
    name: "Short Physical Performance Battery",
    acronym: "SPPB",
    domain: "function",
    description:
      "Composite measure of balance, gait speed, and lower extremity strength",
    scoringRange: { min: 0, max: 12 },
    mcid: 1,
    interpretation: (score: number) => {
      if (score >= 10) return "Minimal or no functional limitation";
      if (score >= 7) return "Mild functional limitation";
      if (score >= 4)
        return "Moderate functional limitation - increased fall risk";
      return "Severe functional limitation - very high fall risk";
    },
    evidenceLevel: 5,
    citation:
      "Guralnik JM, et al. A short physical performance battery assessing lower extremity function. J Gerontol. 1994;49(2):M85-94.",
  },
  {
    name: "Clinical Frailty Scale",
    acronym: "CFS",
    domain: "frailty",
    description:
      "Visual scale assessing frailty from very fit to terminally ill",
    scoringRange: { min: 1, max: 9 },
    interpretation: (score: number) => {
      if (score <= 3) return "Fit to managing well - low frailty";
      if (score <= 5) return "Vulnerable to mildly frail - moderate frailty";
      if (score <= 7) return "Moderately to severely frail - high risk";
      return "Very severely frail or terminally ill";
    },
    evidenceLevel: 4,
    citation:
      "Rockwood K, et al. A global clinical measure of fitness and frailty in elderly people. CMAJ. 2005;173(5):489-95.",
  },
  {
    name: "Activities-Specific Balance Confidence Scale",
    acronym: "ABC",
    domain: "balance",
    description:
      "Self-report measure of balance confidence in performing 16 activities",
    scoringRange: { min: 0, max: 100 },
    mcid: 13,
    interpretation: (score: number) => {
      if (score >= 80) return "High level of physical functioning";
      if (score >= 50) return "Moderate level of physical functioning";
      return "Low level of physical functioning - high fall risk";
    },
    evidenceLevel: 4,
    citation:
      "Powell LE, Myers AM. The Activities-specific Balance Confidence (ABC) Scale. J Gerontol A Biol Sci Med Sci. 1995;50A(1):M28-34.",
  },
];

// ============================================================================
// Geriatric Treatment Protocols
// ============================================================================

export interface GeriatricTreatmentProtocol {
  condition: string;
  icdCode?: string;
  phase: "acute" | "subacute" | "chronic";
  interventions: GeriatricIntervention[];
  contraindications: string[];
  precautions: string[];
  expectedOutcomes: string;
  timeframe: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface GeriatricIntervention {
  name: string;
  category:
    | "balance-training"
    | "strength-training"
    | "gait-training"
    | "fall-prevention"
    | "functional-training"
    | "flexibility";
  cptCode: string;
  dosage: string;
  frequency: string;
  rationale: string;
}

export const geriatricTreatmentProtocols: GeriatricTreatmentProtocol[] = [
  // Fall Prevention Protocol
  {
    condition: "High Fall Risk (Multiple Risk Factors)",
    icdCode: "Z91.81",
    phase: "chronic",
    interventions: [
      {
        name: "Multifactorial balance training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "30-45 minutes",
        frequency: "2-3x/week for 12 weeks",
        rationale:
          "Comprehensive balance training reduces falls by 24% in high-risk older adults (CDC STEADI)",
      },
      {
        name: "Progressive resistance training",
        category: "strength-training",
        cptCode: "97110",
        dosage: "8-12 repetitions, 2-3 sets at 60-80% 1RM",
        frequency: "2-3x/week",
        rationale:
          "Lower extremity strengthening improves balance and reduces fall risk by 17% (Cochrane Review)",
      },
      {
        name: "Gait training with assistive device",
        category: "gait-training",
        cptCode: "97116",
        dosage: "20-30 minutes",
        frequency: "2-3x/week",
        rationale:
          "Proper assistive device use and gait training reduces fall risk in high-risk individuals",
      },
      {
        name: "Tai Chi for balance",
        category: "balance-training",
        cptCode: "97112",
        dosage: "60 minutes",
        frequency: "2x/week for 12 weeks",
        rationale:
          "Tai Chi reduces falls by 29% in community-dwelling older adults (Cochrane Review)",
      },
      {
        name: "Home safety assessment and modification",
        category: "fall-prevention",
        cptCode: "97535",
        dosage: "45-60 minutes",
        frequency: "1-2 sessions",
        rationale:
          "Home modifications reduce fall risk by addressing environmental hazards (AGS Guidelines)",
      },
    ],
    contraindications: [
      "Acute fracture or recent surgery (<6 weeks)",
      "Uncontrolled cardiovascular disease",
      "Severe cognitive impairment preventing participation",
      "Acute illness or infection",
    ],
    precautions: [
      "Monitor vital signs during exercise",
      "Use gait belt for all mobility activities",
      "Ensure safe environment - remove trip hazards",
      "Adjust intensity based on patient tolerance",
      "Monitor for orthostatic hypotension",
      "Consider medication effects on balance",
    ],
    expectedOutcomes:
      "Reduced fall risk score, improved balance (BBS ≥45), improved TUG (<14 seconds), increased confidence in mobility",
    timeframe: "8-12 weeks",
    evidenceLevel: 5,
    citation:
      "CDC STEADI Initiative. Stopping Elderly Accidents, Deaths & Injuries. 2023. https://www.cdc.gov/steadi/",
  },
  // Osteoporosis Management
  {
    condition: "Osteoporosis",
    icdCode: "M81.0",
    phase: "chronic",
    interventions: [
      {
        name: "Weight-bearing aerobic exercise",
        category: "strength-training",
        cptCode: "97110",
        dosage: "30 minutes at moderate intensity",
        frequency: "3-5x/week",
        rationale:
          "Weight-bearing exercise increases bone mineral density and reduces fracture risk",
      },
      {
        name: "Progressive resistance training",
        category: "strength-training",
        cptCode: "97110",
        dosage: "8-12 repetitions, 2-3 sets",
        frequency: "2-3x/week",
        rationale:
          "Resistance training improves bone density, muscle strength, and reduces fall risk",
      },
      {
        name: "Balance and postural training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "20-30 minutes",
        frequency: "2-3x/week",
        rationale:
          "Balance training reduces fall risk and subsequent fracture risk in osteoporotic patients",
      },
      {
        name: "Spinal extension exercises",
        category: "strength-training",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2 sets",
        frequency: "Daily",
        rationale:
          "Spinal extensor strengthening reduces kyphosis and improves posture in osteoporosis",
      },
    ],
    contraindications: [
      "Acute vertebral fracture",
      "Severe osteoporosis with T-score < -3.5",
      "Uncontrolled pain",
      "Recent fracture (<12 weeks)",
    ],
    precautions: [
      "Avoid spinal flexion exercises",
      "Avoid high-impact activities",
      "No trunk rotation with resistance",
      "Monitor for pain during exercise",
      "Ensure adequate calcium and vitamin D intake",
      "Coordinate with physician for bone density monitoring",
    ],
    expectedOutcomes:
      "Maintained or improved bone density, reduced fracture risk, improved posture, enhanced functional mobility",
    timeframe: "12-24 weeks (ongoing maintenance)",
    evidenceLevel: 4,
    citation:
      "Giangregorio LM, et al. Too Fit To Fracture: exercise recommendations for individuals with osteoporosis or osteoporotic vertebral fracture. Osteoporos Int. 2014;25(3):821-35.",
  },
  // Osteoarthritis in Older Adults
  {
    condition: "Osteoarthritis (Geriatric Population)",
    icdCode: "M19.90",
    phase: "chronic",
    interventions: [
      {
        name: "Aquatic therapy",
        category: "functional-training",
        cptCode: "97113",
        dosage: "30-45 minutes",
        frequency: "2-3x/week",
        rationale:
          "Aquatic exercise reduces joint stress while improving strength and function in OA",
      },
      {
        name: "Low-impact aerobic exercise",
        category: "functional-training",
        cptCode: "97110",
        dosage: "20-30 minutes at moderate intensity",
        frequency: "3-5x/week",
        rationale:
          "Aerobic exercise reduces pain and improves function in older adults with OA",
      },
      {
        name: "Strengthening exercises",
        category: "strength-training",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2-3 sets",
        frequency: "2-3x/week",
        rationale:
          "Strengthening periarticular muscles reduces joint stress and improves function",
      },
      {
        name: "Joint protection education",
        category: "functional-training",
        cptCode: "97535",
        dosage: "30 minutes",
        frequency: "1-2 sessions",
        rationale:
          "Joint protection strategies reduce pain and preserve function in daily activities",
      },
    ],
    contraindications: [
      "Acute joint inflammation",
      "Severe joint instability",
      "Uncontrolled pain",
      "Recent joint replacement (<12 weeks)",
    ],
    precautions: [
      "Avoid high-impact activities",
      "Monitor for increased joint pain or swelling",
      "Modify exercises based on pain response",
      "Consider assistive devices for weight-bearing joints",
      "Coordinate with physician for pain management",
    ],
    expectedOutcomes:
      "Reduced pain, improved joint function, enhanced mobility for ADLs, delayed need for joint replacement",
    timeframe: "8-12 weeks",
    evidenceLevel: 5,
    citation:
      "Kolasinski SL, et al. 2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis. Arthritis Care Res. 2020;72(2):149-162.",
  },
  // Frailty Management
  {
    condition: "Frailty Syndrome",
    icdCode: "R54",
    phase: "chronic",
    interventions: [
      {
        name: "Multicomponent exercise program",
        category: "functional-training",
        cptCode: "97110",
        dosage: "45-60 minutes",
        frequency: "2-3x/week",
        rationale:
          "Multicomponent exercise (strength, balance, endurance) reverses frailty in older adults",
      },
      {
        name: "Progressive resistance training",
        category: "strength-training",
        cptCode: "97110",
        dosage: "8-12 repetitions, 2-3 sets at low-moderate intensity",
        frequency: "2-3x/week",
        rationale:
          "Resistance training improves muscle mass, strength, and physical function in frail older adults",
      },
      {
        name: "Balance and gait training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "20-30 minutes",
        frequency: "2-3x/week",
        rationale:
          "Balance training reduces fall risk and improves mobility in frail individuals",
      },
      {
        name: "Functional task practice",
        category: "functional-training",
        cptCode: "97535",
        dosage: "30 minutes",
        frequency: "2-3x/week",
        rationale:
          "Task-specific training improves ADL performance and independence",
      },
      {
        name: "Nutritional counseling coordination",
        category: "functional-training",
        cptCode: "97535",
        dosage: "30 minutes",
        frequency: "1-2 sessions",
        rationale:
          "Adequate protein and calorie intake essential for reversing frailty",
      },
    ],
    contraindications: [
      "Acute illness or infection",
      "Severe cognitive impairment",
      "Uncontrolled cardiovascular disease",
      "Terminal illness",
    ],
    precautions: [
      "Start with very low intensity and progress slowly",
      "Monitor vital signs closely",
      "Watch for excessive fatigue",
      "Ensure adequate rest between sessions",
      "Coordinate with interdisciplinary team",
      "Monitor nutritional status",
    ],
    expectedOutcomes:
      "Improved SPPB score, increased gait speed, enhanced ADL independence, reduced frailty level",
    timeframe: "12-24 weeks",
    evidenceLevel: 4,
    citation:
      "Theou O, et al. What do we know about frailty in the acute care setting? A scoping review. BMC Geriatr. 2018;18(1):139.",
  },
  // Post-Hip Fracture Rehabilitation
  {
    condition: "Post-Hip Fracture (Geriatric)",
    icdCode: "S72.009A",
    phase: "subacute",
    interventions: [
      {
        name: "Progressive weight-bearing gait training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "20-30 minutes",
        frequency: "5x/week",
        rationale:
          "Early mobilization improves functional outcomes and reduces complications post-hip fracture",
      },
      {
        name: "Hip strengthening exercises",
        category: "strength-training",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2-3 sets",
        frequency: "3x/week",
        rationale:
          "Hip abductor and extensor strengthening essential for gait and fall prevention",
      },
      {
        name: "Balance training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "15-20 minutes",
        frequency: "3x/week",
        rationale:
          "Balance training reduces re-fall risk in post-hip fracture patients",
      },
      {
        name: "Transfer training",
        category: "functional-training",
        cptCode: "97535",
        dosage: "20 minutes",
        frequency: "Daily",
        rationale:
          "Safe transfer techniques essential for ADL independence and fall prevention",
      },
    ],
    contraindications: [
      "Unstable fracture fixation",
      "Uncontrolled pain",
      "Acute medical complications",
      "Non-weight-bearing restrictions (if applicable)",
    ],
    precautions: [
      "Follow surgeon weight-bearing restrictions",
      "Monitor for hip dislocation signs (if arthroplasty)",
      "Watch for signs of DVT",
      "Ensure adequate pain management",
      "Fall prevention strategies during all activities",
      "Monitor for delirium in acute phase",
    ],
    expectedOutcomes:
      "Return to pre-fracture mobility level, independent ambulation with/without assistive device, reduced fall risk",
    timeframe: "8-12 weeks",
    evidenceLevel: 4,
    citation:
      "Handoll HH, et al. Interventions for improving mobility after hip fracture surgery in adults. Cochrane Database Syst Rev. 2011;(3):CD001704.",
  },
];

// ============================================================================
// Fall Prevention Interventions
// ============================================================================

export interface FallPreventionIntervention {
  name: string;
  type:
    | "exercise"
    | "environmental"
    | "medication-review"
    | "education"
    | "assistive-device";
  description: string;
  evidenceLevel: 3 | 4 | 5;
  fallReduction: string;
  implementation: string;
  citation: string;
}

export const fallPreventionInterventions: FallPreventionIntervention[] = [
  {
    name: "Otago Exercise Program",
    type: "exercise",
    description:
      "Home-based strength and balance retraining program with leg strengthening, balance exercises, and walking plan",
    evidenceLevel: 5,
    fallReduction: "35% reduction in falls",
    implementation:
      "30 minutes, 3x/week for 12 months. Includes 5 leg strengthening exercises, 12 balance exercises, and walking program",
    citation:
      "Cochrane Review: Exercise for preventing falls in older people living in the community. Thomas S, et al. 2019.",
  },
  {
    name: "Tai Chi",
    type: "exercise",
    description:
      "Group-based balance and coordination training focusing on weight shifting, postural control, and coordination",
    evidenceLevel: 5,
    fallReduction: "29% reduction in falls",
    implementation:
      "60 minutes, 2x/week for 12-24 weeks. Yang-style Tai Chi most studied for fall prevention",
    citation:
      "Cochrane Review: Tai Chi for preventing falls in older adults. Huang ZG, et al. 2017.",
  },
  {
    name: "Multifactorial Fall Prevention",
    type: "exercise",
    description:
      "Comprehensive approach addressing multiple risk factors including exercise, medication review, vision assessment, and home modification",
    evidenceLevel: 5,
    fallReduction: "24% reduction in falls",
    implementation:
      "Individualized program based on fall risk assessment. Typically includes exercise 2-3x/week plus risk factor modification",
    citation:
      "CDC STEADI Initiative and AGS/BGS Clinical Practice Guideline for Prevention of Falls in Older Persons. 2010.",
  },
  {
    name: "Home Safety Modification",
    type: "environmental",
    description:
      "Assessment and modification of home environment to remove fall hazards",
    evidenceLevel: 4,
    fallReduction: "26% reduction in falls when combined with exercise",
    implementation:
      "Home visit by PT or OT to assess hazards. Install grab bars, improve lighting, remove trip hazards, secure rugs",
    citation:
      "Gillespie LD, et al. Interventions for preventing falls in older people living in the community. Cochrane Database Syst Rev. 2012.",
  },
  {
    name: "Medication Review",
    type: "medication-review",
    description:
      "Systematic review of medications to identify and reduce fall-risk drugs",
    evidenceLevel: 4,
    fallReduction: "20% reduction in falls",
    implementation:
      "Review all medications with physician. Target: benzodiazepines, antidepressants, antipsychotics, opioids, antihypertensives",
    citation:
      "AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults. 2019.",
  },
  {
    name: "Vitamin D Supplementation",
    type: "medication-review",
    description: "Vitamin D supplementation for deficient older adults",
    evidenceLevel: 4,
    fallReduction: "14% reduction in falls in deficient individuals",
    implementation:
      "800-1000 IU daily for individuals with vitamin D deficiency (<30 ng/mL)",
    citation:
      "Bischoff-Ferrari HA, et al. Fall prevention with supplemental and active forms of vitamin D. BMJ. 2009;339:b3692.",
  },
  {
    name: "Vision Assessment and Correction",
    type: "education",
    description:
      "Annual vision examination and correction of visual impairments",
    evidenceLevel: 4,
    fallReduction: "Reduces fall risk when combined with other interventions",
    implementation:
      "Annual eye exam, update prescriptions, cataract surgery if indicated, avoid multifocal lenses for high-risk individuals",
    citation:
      "AGS/BGS Clinical Practice Guideline: Prevention of Falls in Older Persons. 2010.",
  },
  {
    name: "Assistive Device Training",
    type: "assistive-device",
    description:
      "Proper selection, fitting, and training in use of assistive devices",
    evidenceLevel: 4,
    fallReduction: "Reduces falls when properly fitted and used",
    implementation:
      "Assess need for cane, walker, or rollator. Proper height adjustment, gait training with device, regular maintenance checks",
    citation:
      "Bateni H, Maki BE. Assistive devices for balance and mobility: benefits, demands, and adverse consequences. Arch Phys Med Rehabil. 2005;86(1):134-45.",
  },
  {
    name: "Fall Prevention Education",
    type: "education",
    description:
      "Patient and caregiver education on fall risk factors and prevention strategies",
    evidenceLevel: 4,
    fallReduction: "Enhances adherence to fall prevention programs",
    implementation:
      "Individual or group education sessions covering risk factors, home safety, exercise importance, medication awareness",
    citation:
      "CDC STEADI: Stopping Elderly Accidents, Deaths & Injuries. Patient education materials. 2023.",
  },
];

// ============================================================================
// Balance Training Exercises
// ============================================================================

export interface BalanceExercise {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  dosage: string;
  progression: string;
  safetyConsiderations: string[];
  evidenceLevel: 3 | 4 | 5;
}

export const balanceTrainingExercises: BalanceExercise[] = [
  {
    name: "Sit-to-Stand",
    level: "beginner",
    description:
      "Stand up from chair without using hands, then sit back down with control",
    dosage: "10 repetitions, 2-3 sets, daily",
    progression:
      "Progress from using armrests → hands on thighs → arms crossed → single-leg stand",
    safetyConsiderations: [
      "Use sturdy chair with armrests initially",
      "Ensure chair is against wall",
      "Therapist or caregiver standby for safety",
    ],
    evidenceLevel: 5,
  },
  {
    name: "Tandem Stance",
    level: "intermediate",
    description:
      "Stand with one foot directly in front of the other (heel-to-toe)",
    dosage: "Hold 30 seconds, 3 repetitions each side, daily",
    progression:
      "Progress from holding support → fingertip support → no support → eyes closed",
    safetyConsiderations: [
      "Perform near wall or counter for support",
      "Use gait belt if high fall risk",
      "Progress slowly to eyes closed",
    ],
    evidenceLevel: 5,
  },
  {
    name: "Single-Leg Stance",
    level: "intermediate",
    description: "Stand on one leg while maintaining balance",
    dosage: "Hold 10-30 seconds, 3 repetitions each leg, daily",
    progression:
      "Progress from holding support → fingertip support → no support → eyes closed → unstable surface",
    safetyConsiderations: [
      "Perform near wall or counter",
      "Start with shorter hold times",
      "Avoid if severe balance impairment",
    ],
    evidenceLevel: 5,
  },
  {
    name: "Heel-Toe Walking",
    level: "intermediate",
    description:
      "Walk in straight line placing heel of front foot directly against toes of back foot",
    dosage: "10-20 steps, 3 repetitions, daily",
    progression:
      "Progress from holding wall → fingertip support → no support → eyes closed",
    safetyConsiderations: [
      "Perform in hallway with walls on both sides",
      "Use gait belt",
      "Clear path of obstacles",
    ],
    evidenceLevel: 5,
  },
  {
    name: "Weight Shifts",
    level: "beginner",
    description:
      "Shift weight side-to-side and forward-backward while standing",
    dosage: "10 repetitions each direction, 2 sets, daily",
    progression:
      "Progress from wide base → narrow base → single-leg → reaching movements",
    safetyConsiderations: [
      "Perform near support surface",
      "Start with small weight shifts",
      "Ensure stable footwear",
    ],
    evidenceLevel: 4,
  },
  {
    name: "Step-Ups",
    level: "intermediate",
    description: "Step up onto low step or platform and back down",
    dosage: "10 repetitions each leg, 2-3 sets, 3x/week",
    progression:
      "Progress from 2-inch step → 4-inch → 6-inch → no handrail support",
    safetyConsiderations: [
      "Use sturdy step with handrail",
      "Ensure good lighting",
      "Therapist standby initially",
    ],
    evidenceLevel: 5,
  },
  {
    name: "Gait with Head Turns",
    level: "advanced",
    description: "Walk while turning head side-to-side or up-and-down",
    dosage: "20-30 steps, 3 repetitions, daily",
    progression:
      "Progress from slow head turns → faster turns → obstacle course → dual-task",
    safetyConsiderations: [
      "Use gait belt",
      "Clear walking path",
      "Monitor for dizziness",
      "Contraindicated if severe vestibular dysfunction",
    ],
    evidenceLevel: 4,
  },
  {
    name: "Backward Walking",
    level: "advanced",
    description: "Walk backward in straight line",
    dosage: "10-20 steps, 3 repetitions, daily",
    progression:
      "Progress from holding support → fingertip support → no support → obstacle course",
    safetyConsiderations: [
      "Clear path of all obstacles",
      "Use gait belt",
      "Therapist walks behind patient",
      "Ensure adequate space",
    ],
    evidenceLevel: 4,
  },
  {
    name: "Foam Surface Balance",
    level: "advanced",
    description: "Stand on foam pad or cushion to challenge balance",
    dosage: "30-60 seconds, 3 repetitions, 3x/week",
    progression:
      "Progress from feet apart → feet together → tandem → single-leg → eyes closed",
    safetyConsiderations: [
      "Perform near wall or parallel bars",
      "Use gait belt",
      "Not appropriate for severe balance impairment",
      "Monitor for excessive postural sway",
    ],
    evidenceLevel: 4,
  },
];

// ============================================================================
// Patient Education Materials
// ============================================================================

export interface PatientEducationMaterial {
  topic: string;
  targetAudience: "patient" | "caregiver" | "both";
  keyPoints: string[];
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const patientEducationMaterials: PatientEducationMaterial[] = [
  {
    topic: "Fall Prevention Basics",
    targetAudience: "both",
    keyPoints: [
      "Falls are NOT a normal part of aging - they can be prevented",
      "Most falls happen at home during routine activities",
      "Multiple risk factors increase fall risk: weak muscles, poor balance, medications, vision problems, home hazards",
      "Exercise is the single most effective fall prevention strategy",
      "Talk to your doctor about all medications - some increase fall risk",
      "Have your vision checked annually and update glasses",
      "Make your home safer: remove clutter, improve lighting, install grab bars",
      "Use assistive devices properly if recommended",
      "Wear supportive, non-slip footwear - avoid slippers and socks on smooth floors",
    ],
    evidenceLevel: 5,
    citation:
      "CDC STEADI: Stopping Elderly Accidents, Deaths & Injuries. Patient Education Materials. 2023.",
  },
  {
    topic: "Home Safety Checklist",
    targetAudience: "both",
    keyPoints: [
      "FLOORS: Remove throw rugs, secure carpet edges, clean up spills immediately, remove clutter from walkways",
      "LIGHTING: Install bright lights in all rooms, use nightlights in bedroom and bathroom, keep flashlight by bed",
      "BATHROOM: Install grab bars in shower/tub and near toilet, use non-slip bath mat, consider raised toilet seat",
      "STAIRS: Install handrails on both sides, ensure good lighting, mark edge of top and bottom steps with bright tape",
      "BEDROOM: Keep lamp within reach of bed, arrange furniture for clear pathways, keep phone by bed",
      "KITCHEN: Store frequently used items at waist level, use step stool with handrail (never chair), clean spills immediately",
      "OUTDOORS: Repair uneven sidewalks, install handrails on steps, ensure good lighting at entrances, remove ice/snow promptly",
    ],
    evidenceLevel: 4,
    citation: "CDC STEADI Home Safety Checklist. 2023.",
  },
  {
    topic: "Exercise for Fall Prevention",
    targetAudience: "patient",
    keyPoints: [
      "Exercise is proven to reduce falls by up to 35%",
      "Best exercises include: balance training, leg strengthening, walking",
      "Aim for at least 30 minutes of exercise most days of the week",
      "Start slowly and gradually increase difficulty",
      "Tai Chi and yoga are excellent for balance",
      "Strength training 2-3 times per week helps prevent falls",
      "Always exercise in safe environment with support nearby",
      "Stop if you feel dizzy, short of breath, or have chest pain",
      "Consistency is key - make exercise a daily habit",
    ],
    evidenceLevel: 5,
    citation:
      "Sherrington C, et al. Exercise for preventing falls in older people living in the community. Cochrane Database Syst Rev. 2019.",
  },
  {
    topic: "Osteoporosis and Bone Health",
    targetAudience: "patient",
    keyPoints: [
      "Osteoporosis weakens bones and increases fracture risk",
      "Weight-bearing exercise strengthens bones: walking, dancing, stair climbing",
      "Resistance training builds muscle and bone: use weights, resistance bands, or body weight",
      "Get adequate calcium (1200 mg/day) and vitamin D (800-1000 IU/day)",
      "Avoid smoking and excessive alcohol",
      "Prevent falls to prevent fractures",
      "AVOID: forward bending exercises, twisting with resistance, high-impact activities",
      "SAFE exercises: standing exercises, back extension, balance training",
      "Take medications as prescribed by your doctor",
      "Have bone density tested as recommended",
    ],
    evidenceLevel: 4,
    citation:
      "Giangregorio LM, et al. Too Fit To Fracture: exercise recommendations for osteoporosis. Osteoporos Int. 2014.",
  },
  {
    topic: "Managing Arthritis Pain",
    targetAudience: "patient",
    keyPoints: [
      "Exercise does NOT make arthritis worse - it helps!",
      "Low-impact activities are best: walking, swimming, cycling, tai chi",
      "Start with 5-10 minutes and gradually increase",
      "Some discomfort during exercise is normal, but stop if pain is severe",
      "Apply heat before exercise to loosen joints",
      "Apply ice after exercise if joints are swollen",
      "Maintain healthy weight to reduce joint stress",
      "Use assistive devices to protect joints: cane, jar openers, long-handled tools",
      "Balance activity with rest - pace yourself",
      "Take medications as prescribed for pain management",
    ],
    evidenceLevel: 5,
    citation:
      "Kolasinski SL, et al. 2019 ACR/AF Guideline for Management of Osteoarthritis. Arthritis Care Res. 2020.",
  },
  {
    topic: "Safe Use of Assistive Devices",
    targetAudience: "both",
    keyPoints: [
      "CANE: Hold on opposite side of weak/painful leg, advance cane with weak leg, adjust height so elbow bent 15-20 degrees",
      "WALKER: Adjust height so handles at wrist level with arms at sides, push walker forward, step into walker (don't walk behind it)",
      "ROLLATOR: Use hand brakes when sitting or standing, don't lean too far forward, lock brakes when stationary",
      "Check rubber tips regularly - replace if worn",
      "Keep device within reach at all times",
      "Use device consistently - don't try to walk without it",
      "Ensure proper fit - have PT check height adjustment",
      "Practice on level surfaces before attempting stairs or uneven ground",
    ],
    evidenceLevel: 4,
    citation:
      "Bateni H, Maki BE. Assistive devices for balance and mobility. Arch Phys Med Rehabil. 2005.",
  },
  {
    topic: "What to Do If You Fall",
    targetAudience: "both",
    keyPoints: [
      "Stay calm and assess for injuries",
      "If injured or unable to get up, call for help (use medical alert device if available)",
      "If not injured: rest for a few minutes, roll onto side, get onto hands and knees, crawl to sturdy furniture",
      "Use furniture to pull yourself up to kneeling, then standing",
      "Sit and rest before walking",
      "Tell your doctor about ALL falls, even if not injured",
      "Consider medical alert system if you live alone",
      "Practice getting up from floor with therapist",
      "Don't be embarrassed - falls are common and reporting them helps prevent future falls",
    ],
    evidenceLevel: 4,
    citation: "CDC STEADI: What to Do If You Fall. Patient Education. 2023.",
  },
];

// ============================================================================
// Clinical Resources
// ============================================================================

export interface GeriatricClinicalResource {
  title: string;
  organization: string;
  url: string;
  description: string;
  evidenceLevel: 3 | 4 | 5;
}

export const geriatricClinicalResources: GeriatricClinicalResource[] = [
  {
    title: "CDC STEADI Initiative",
    organization: "Centers for Disease Control and Prevention",
    url: "https://www.cdc.gov/steadi/",
    description:
      "Stopping Elderly Accidents, Deaths & Injuries - comprehensive fall prevention toolkit with assessment tools, patient education, and clinical resources",
    evidenceLevel: 5,
  },
  {
    title:
      "AGS/BGS Clinical Practice Guideline: Prevention of Falls in Older Persons",
    organization: "American Geriatrics Society / British Geriatrics Society",
    url: "https://geriatricscareonline.org/ProductAbstract/american-geriatrics-societybritish-geriatrics-society-clinical-practice-guideline-prevention-of-falls-in-older-persons/CL014",
    description:
      "Evidence-based guidelines for fall risk assessment and multifactorial interventions",
    evidenceLevel: 5,
  },
  {
    title: "APTA Geriatrics Section",
    organization: "American Physical Therapy Association",
    url: "https://aptageriatrics.org/",
    description:
      "Clinical resources, practice guidelines, and continuing education for geriatric physical therapy",
    evidenceLevel: 5,
  },
  {
    title: "Cochrane Review: Exercise for Preventing Falls in Older People",
    organization: "Cochrane Collaboration",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007146.pub3/full",
    description:
      "Systematic review of exercise interventions for fall prevention with meta-analysis of effectiveness",
    evidenceLevel: 5,
  },
  {
    title: "National Council on Aging Falls Prevention Resources",
    organization: "National Council on Aging",
    url: "https://www.ncoa.org/article/get-the-facts-on-falls-prevention",
    description:
      "Patient and provider resources for fall prevention including evidence-based programs",
    evidenceLevel: 4,
  },
  {
    title: "AGS Beers Criteria",
    organization: "American Geriatrics Society",
    url: "https://geriatricscareonline.org/ProductAbstract/american-geriatrics-society-2019-updated-ags-beers-criteria-for-potentially-inappropriate-medication-use-in-older-adults/CL001",
    description:
      "Guidelines for potentially inappropriate medications in older adults including fall-risk drugs",
    evidenceLevel: 5,
  },
  {
    title: "Too Fit To Fracture: Exercise Recommendations for Osteoporosis",
    organization: "Osteoporosis Canada",
    url: "https://osteoporosis.ca/bone-health-osteoporosis/exercise-for-healthy-bones/",
    description:
      "Evidence-based exercise recommendations for individuals with osteoporosis or vertebral fracture",
    evidenceLevel: 4,
  },
  {
    title: "Journal of Geriatric Physical Therapy",
    organization: "APTA Geriatrics Section",
    url: "https://journals.lww.com/jgpt/pages/default.aspx",
    description:
      "Peer-reviewed journal publishing research on geriatric physical therapy interventions",
    evidenceLevel: 5,
  },
  {
    title: "Otago Exercise Programme",
    organization: "ACC (Accident Compensation Corporation) New Zealand",
    url: "https://www.acc.co.nz/im-injured/injuries-we-cover/older-persons-falls/otago-exercise-programme/",
    description:
      "Evidence-based home exercise program proven to reduce falls by 35%",
    evidenceLevel: 5,
  },
];

// ============================================================================
// Fall Risk Factors
// ============================================================================

export interface FallRiskFactor {
  category: "intrinsic" | "extrinsic" | "behavioral";
  factor: string;
  description: string;
  modifiable: boolean;
  interventions: string[];
}

export const fallRiskFactors: FallRiskFactor[] = [
  {
    category: "intrinsic",
    factor: "History of falls",
    description: "Previous fall in past 12 months",
    modifiable: false,
    interventions: [
      "Comprehensive fall risk assessment",
      "Multifactorial intervention program",
      "Balance and strength training",
    ],
  },
  {
    category: "intrinsic",
    factor: "Muscle weakness",
    description: "Reduced lower extremity strength",
    modifiable: true,
    interventions: [
      "Progressive resistance training 2-3x/week",
      "Functional strengthening exercises",
      "Nutritional optimization",
    ],
  },
  {
    category: "intrinsic",
    factor: "Gait and balance deficits",
    description: "Impaired balance, slow gait speed, abnormal gait pattern",
    modifiable: true,
    interventions: [
      "Balance training exercises",
      "Gait training",
      "Tai Chi or yoga",
      "Assistive device if appropriate",
    ],
  },
  {
    category: "intrinsic",
    factor: "Visual impairment",
    description: "Poor vision, cataracts, glaucoma, macular degeneration",
    modifiable: true,
    interventions: [
      "Annual eye examination",
      "Update eyeglass prescription",
      "Cataract surgery if indicated",
      "Improve home lighting",
    ],
  },
  {
    category: "intrinsic",
    factor: "Cognitive impairment",
    description: "Dementia, delirium, impaired judgment",
    modifiable: false,
    interventions: [
      "Supervised exercise program",
      "Environmental modifications",
      "Caregiver education",
      "Medical management",
    ],
  },
  {
    category: "intrinsic",
    factor: "Polypharmacy",
    description: "Taking 4 or more medications",
    modifiable: true,
    interventions: [
      "Medication review with physician",
      "Reduce or eliminate fall-risk medications",
      "Simplify medication regimen",
    ],
  },
  {
    category: "intrinsic",
    factor: "Psychoactive medications",
    description: "Benzodiazepines, antidepressants, antipsychotics, sedatives",
    modifiable: true,
    interventions: [
      "Medication review and reduction",
      "Consider non-pharmacological alternatives",
      "Taper slowly under physician supervision",
    ],
  },
  {
    category: "intrinsic",
    factor: "Orthostatic hypotension",
    description: "Drop in blood pressure upon standing",
    modifiable: true,
    interventions: [
      "Medication adjustment",
      "Adequate hydration",
      "Compression stockings",
      "Rise slowly from sitting/lying",
    ],
  },
  {
    category: "intrinsic",
    factor: "Chronic conditions",
    description:
      "Arthritis, Parkinson's, stroke, neuropathy, vestibular disorders",
    modifiable: true,
    interventions: [
      "Disease-specific management",
      "Targeted physical therapy",
      "Pain management",
      "Adaptive equipment",
    ],
  },
  {
    category: "intrinsic",
    factor: "Vitamin D deficiency",
    description: "Serum 25(OH)D < 30 ng/mL",
    modifiable: true,
    interventions: [
      "Vitamin D supplementation 800-1000 IU daily",
      "Increase sun exposure (with sun protection)",
      "Dietary sources: fatty fish, fortified foods",
    ],
  },
  {
    category: "extrinsic",
    factor: "Home hazards",
    description: "Clutter, poor lighting, loose rugs, lack of grab bars",
    modifiable: true,
    interventions: [
      "Home safety assessment",
      "Remove trip hazards",
      "Install grab bars and handrails",
      "Improve lighting",
    ],
  },
  {
    category: "extrinsic",
    factor: "Inappropriate footwear",
    description: "Slippers, high heels, loose shoes, socks on smooth floors",
    modifiable: true,
    interventions: [
      "Wear supportive, non-slip shoes",
      "Avoid walking in socks",
      "Ensure proper fit",
      "Replace worn footwear",
    ],
  },
  {
    category: "extrinsic",
    factor: "Improper assistive device use",
    description: "Wrong device, improper height, poor technique",
    modifiable: true,
    interventions: [
      "PT assessment for appropriate device",
      "Proper fitting and height adjustment",
      "Gait training with device",
      "Regular maintenance",
    ],
  },
  {
    category: "behavioral",
    factor: "Fear of falling",
    description: "Activity restriction due to fear, reduced confidence",
    modifiable: true,
    interventions: [
      "Gradual exposure to activities",
      "Balance confidence training",
      "Group exercise programs",
      "Cognitive behavioral therapy if severe",
    ],
  },
  {
    category: "behavioral",
    factor: "Risky behavior",
    description: "Rushing, multitasking, climbing on furniture",
    modifiable: true,
    interventions: [
      "Patient education on safe practices",
      "Environmental modifications",
      "Use step stool with handrail",
      "Avoid rushing",
    ],
  },
  {
    category: "behavioral",
    factor: "Alcohol use",
    description: "Excessive alcohol consumption",
    modifiable: true,
    interventions: [
      "Limit alcohol intake",
      "Avoid alcohol with medications",
      "Substance abuse counseling if needed",
    ],
  },
];

// ============================================================================
// Functional Mobility Levels
// ============================================================================

export interface FunctionalMobilityLevel {
  level: string;
  description: string;
  tugScore: string;
  bbsScore: string;
  gaitSpeed: string;
  assistiveDevice: string;
  fallRisk: "low" | "moderate" | "high" | "very-high";
  interventionFocus: string[];
}

export const functionalMobilityLevels: FunctionalMobilityLevel[] = [
  {
    level: "Independent Community Ambulator",
    description:
      "Fully independent in all mobility tasks, no assistive device needed",
    tugScore: "< 10 seconds",
    bbsScore: "56/56",
    gaitSpeed: "≥ 1.0 m/s",
    assistiveDevice: "None",
    fallRisk: "low",
    interventionFocus: [
      "Maintain current function",
      "General fitness and strengthening",
      "Fall prevention education",
    ],
  },
  {
    level: "Limited Community Ambulator",
    description:
      "Independent for short distances, may use assistive device outdoors",
    tugScore: "10-14 seconds",
    bbsScore: "45-55/56",
    gaitSpeed: "0.8-1.0 m/s",
    assistiveDevice: "Cane for outdoor use",
    fallRisk: "moderate",
    interventionFocus: [
      "Balance training",
      "Lower extremity strengthening",
      "Gait training",
      "Fall prevention strategies",
    ],
  },
  {
    level: "Household Ambulator",
    description:
      "Independent indoors with assistive device, limited outdoor mobility",
    tugScore: "14-20 seconds",
    bbsScore: "21-44/56",
    gaitSpeed: "0.4-0.8 m/s",
    assistiveDevice: "Walker or rollator",
    fallRisk: "high",
    interventionFocus: [
      "Intensive balance training",
      "Strengthening program",
      "Assistive device training",
      "Home safety modifications",
      "Fall prevention education",
    ],
  },
  {
    level: "Limited Household Ambulator",
    description: "Requires assistance for most mobility, high fall risk",
    tugScore: "> 20 seconds",
    bbsScore: "0-20/56",
    gaitSpeed: "< 0.4 m/s",
    assistiveDevice: "Walker with standby assistance",
    fallRisk: "very-high",
    interventionFocus: [
      "Safety-focused mobility training",
      "Caregiver training",
      "Wheelchair mobility skills",
      "Transfer training",
      "Environmental modifications",
      "Consider wheelchair for community mobility",
    ],
  },
];
