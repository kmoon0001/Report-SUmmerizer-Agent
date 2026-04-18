/**
 * Neurological Rehabilitation Clinical Content
 *
 * Comprehensive neurological PT data including:
 * - Stroke, TBI, Parkinson's, MS, SCI protocols
 * - Assessment tools (FMA, BBS, TUG, FIM, MAS)
 * - Neuroplasticity-based interventions
 * - APTA Neurology Section CPG citations
 *
 * Requirements: 1.2, 1.3, 1.5
 *
 * Evidence Sources:
 * - APTA Neurology Section Clinical Practice Guidelines
 * - Stroke Rehabilitation CPG (APTA 2016)
 * - Parkinson's Disease CPG (APTA 2020)
 * - Cochrane Reviews for neurological interventions
 */

// Types are defined inline to avoid circular dependencies

// ============================================================================
// Assessment Tools with Scoring and Interpretation
// ============================================================================

export interface NeurologicalAssessmentTool {
  name: string;
  acronym: string;
  domain: "stroke" | "tbi" | "parkinsons" | "ms" | "sci" | "general-neuro";
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

export const neurologicalAssessmentTools: NeurologicalAssessmentTool[] = [
  {
    name: "Fugl-Meyer Assessment",
    acronym: "FMA",
    domain: "stroke",
    description:
      "Quantitative measure of motor recovery, balance, sensation, and joint function after stroke",
    scoringRange: { min: 0, max: 226 },
    mcid: 6,
    interpretation: (score: number) => {
      if (score >= 95) return "Excellent motor recovery";
      if (score >= 85) return "Good motor recovery";
      if (score >= 50) return "Moderate motor recovery";
      return "Severe motor impairment";
    },
    evidenceLevel: 5,
    citation:
      "Fugl-Meyer AR, et al. The post-stroke hemiplegic patient. 1. a method for evaluation of physical performance. Scand J Rehabil Med. 1975;7(1):13-31.",
  },
  {
    name: "Berg Balance Scale",
    acronym: "BBS",
    domain: "general-neuro",
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
    name: "Timed Up and Go",
    acronym: "TUG",
    domain: "general-neuro",
    description:
      "Functional mobility test measuring time to stand, walk 3 meters, turn, and sit",
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
    name: "Functional Independence Measure",
    acronym: "FIM",
    domain: "general-neuro",
    description: "18-item assessment of physical and cognitive disability",
    scoringRange: { min: 18, max: 126 },
    mcid: 22,
    interpretation: (score: number) => {
      if (score >= 108) return "Modified independence or complete independence";
      if (score >= 90) return "Minimal assistance required";
      if (score >= 72) return "Moderate assistance required";
      if (score >= 54) return "Maximal assistance required";
      return "Total assistance or complete dependence";
    },
    evidenceLevel: 5,
    citation:
      "Keith RA, et al. The functional independence measure: a new tool for rehabilitation. Adv Clin Rehabil. 1987;1:6-18.",
  },
  {
    name: "Modified Ashworth Scale",
    acronym: "MAS",
    domain: "general-neuro",
    description:
      "Clinical measure of spasticity in patients with neurological conditions",
    scoringRange: { min: 0, max: 4 },
    interpretation: (score: number) => {
      if (score === 0) return "No increase in muscle tone";
      if (score === 1) return "Slight increase in tone with catch at end range";
      if (score === 1.5)
        return "Slight increase in tone with catch in less than half of ROM";
      if (score === 2)
        return "More marked increase in tone through most of ROM";
      if (score === 3)
        return "Considerable increase in tone, passive movement difficult";
      return "Affected part rigid in flexion or extension";
    },
    evidenceLevel: 4,
    citation:
      "Bohannon RW, Smith MB. Interrater reliability of a modified Ashworth scale of muscle spasticity. Phys Ther. 1987;67(2):206-7.",
  },
  {
    name: "Modified Rankin Scale",
    acronym: "mRS",
    domain: "stroke",
    description: "Measure of degree of disability or dependence after stroke",
    scoringRange: { min: 0, max: 6 },
    interpretation: (score: number) => {
      if (score === 0) return "No symptoms";
      if (score === 1) return "No significant disability despite symptoms";
      if (score === 2)
        return "Slight disability, unable to carry out all previous activities";
      if (score === 3)
        return "Moderate disability, requires some help but walks without assistance";
      if (score === 4)
        return "Moderately severe disability, unable to walk or attend to bodily needs without assistance";
      if (score === 5)
        return "Severe disability, bedridden, incontinent, requires constant care";
      return "Dead";
    },
    evidenceLevel: 5,
    citation:
      "Rankin J. Cerebral vascular accidents in patients over the age of 60. Scott Med J. 1957;2(5):200-15.",
  },
  {
    name: "Unified Parkinson's Disease Rating Scale - Motor",
    acronym: "UPDRS-III",
    domain: "parkinsons",
    description:
      "Motor examination section assessing Parkinson's disease motor symptoms",
    scoringRange: { min: 0, max: 132 },
    mcid: 5,
    interpretation: (score: number) => {
      if (score <= 20) return "Mild motor impairment";
      if (score <= 40) return "Moderate motor impairment";
      return "Severe motor impairment";
    },
    evidenceLevel: 5,
    citation:
      "Fahn S, Elton R. Unified Parkinson's Disease Rating Scale. In: Fahn S, et al., eds. Recent Developments in Parkinson's Disease. Florham Park, NJ: Macmillan Healthcare Information; 1987:153-163.",
  },
  {
    name: "Activities-Specific Balance Confidence Scale",
    acronym: "ABC",
    domain: "general-neuro",
    description:
      "Self-report measure of balance confidence in performing various activities",
    scoringRange: { min: 0, max: 100 },
    mcid: 13,
    interpretation: (score: number) => {
      if (score >= 80) return "High level of physical functioning";
      if (score >= 50) return "Moderate level of physical functioning";
      return "Low level of physical functioning";
    },
    evidenceLevel: 4,
    citation:
      "Powell LE, Myers AM. The Activities-specific Balance Confidence (ABC) Scale. J Gerontol A Biol Sci Med Sci. 1995;50A(1):M28-34.",
  },
];

// ============================================================================
// Neurological Treatment Protocols
// ============================================================================

export interface NeurologicalTreatmentProtocol {
  condition: string;
  icdCode?: string;
  phase: "acute" | "subacute" | "chronic";
  interventions: NeurologicalIntervention[];
  contraindications: string[];
  precautions: string[];
  expectedOutcomes: string;
  timeframe: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface NeurologicalIntervention {
  name: string;
  category:
    | "task-specific-training"
    | "neuroplasticity"
    | "gait-training"
    | "balance-training"
    | "strengthening"
    | "constraint-induced"
    | "robotic-assisted";
  cptCode: string;
  dosage: string;
  frequency: string;
  rationale: string;
}

export const neurologicalTreatmentProtocols: NeurologicalTreatmentProtocol[] = [
  // Stroke Protocols
  {
    condition: "Acute Stroke (CVA)",
    icdCode: "I63.9",
    phase: "acute",
    interventions: [
      {
        name: "Early mobilization",
        category: "task-specific-training",
        cptCode: "97110",
        dosage: "20-30 minutes",
        frequency: "2x/day",
        rationale:
          "Prevent complications, promote neuroplasticity within first 24-48 hours post-stroke",
      },
      {
        name: "Sitting balance training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "15-20 minutes",
        frequency: "Daily",
        rationale:
          "Establish postural control foundation for functional mobility",
      },
      {
        name: "Passive and active-assisted ROM",
        category: "strengthening",
        cptCode: "97110",
        dosage: "10-15 repetitions per joint",
        frequency: "2-3x/day",
        rationale:
          "Prevent contractures, maintain joint mobility, facilitate motor recovery",
      },
    ],
    contraindications: [
      "Unstable medical condition",
      "Uncontrolled hypertension (>220/120)",
      "Acute myocardial infarction",
      "Severe orthostatic hypotension",
      "Progressive neurological deterioration",
    ],
    precautions: [
      "Monitor vital signs during activity",
      "Watch for signs of fatigue",
      "Avoid Valsalva maneuver",
      "Fall risk - use gait belt and appropriate assistance",
    ],
    expectedOutcomes:
      "Improved sitting balance, initiation of standing activities, prevention of secondary complications",
    timeframe: "1-2 weeks",
    evidenceLevel: 5,
    citation:
      "APTA Stroke Rehabilitation CPG. J Neurol Phys Ther. 2016;40(4):1-48.",
  },
  {
    condition: "Subacute Stroke Recovery",
    icdCode: "I69.3",
    phase: "subacute",
    interventions: [
      {
        name: "Task-specific gait training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "30-45 minutes",
        frequency: "5x/week",
        rationale:
          "High-intensity, repetitive practice promotes motor learning and neuroplasticity",
      },
      {
        name: "Constraint-Induced Movement Therapy (CIMT)",
        category: "constraint-induced",
        cptCode: "97110",
        dosage: "3-6 hours/day",
        frequency: "5 days/week for 2 weeks",
        rationale:
          "Force use of affected upper extremity to overcome learned non-use",
      },
      {
        name: "Body weight-supported treadmill training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "20-30 minutes",
        frequency: "3-5x/week",
        rationale:
          "Allows high-intensity gait practice with reduced fall risk and improved kinematics",
      },
      {
        name: "Upper extremity task practice",
        category: "task-specific-training",
        cptCode: "97110",
        dosage: "45-60 minutes",
        frequency: "Daily",
        rationale:
          "Repetitive, goal-directed practice enhances motor recovery through neuroplasticity",
      },
      {
        name: "Balance and coordination training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "20-30 minutes",
        frequency: "3-5x/week",
        rationale:
          "Improve postural control, reduce fall risk, enhance functional independence",
      },
    ],
    contraindications: [
      "Uncontrolled seizures",
      "Severe cognitive impairment preventing participation",
      "Unstable cardiovascular status",
      "Severe spasticity limiting movement",
    ],
    precautions: [
      "Monitor for fatigue - rest breaks as needed",
      "Adjust intensity based on patient tolerance",
      "Fall prevention strategies during all activities",
      "Monitor blood pressure response to exercise",
    ],
    expectedOutcomes:
      "Improved gait speed (>0.8 m/s), increased upper extremity function (FMA-UE increase ≥6 points), enhanced balance (BBS ≥45), return to ADLs",
    timeframe: "6-12 weeks",
    evidenceLevel: 5,
    citation:
      "Winstein CJ, et al. Guidelines for Adult Stroke Rehabilitation and Recovery. Stroke. 2016;47(6):e98-e169.",
  },
  // Traumatic Brain Injury Protocols
  {
    condition: "Traumatic Brain Injury (TBI)",
    icdCode: "S06.9",
    phase: "subacute",
    interventions: [
      {
        name: "Dual-task training",
        category: "task-specific-training",
        cptCode: "97112",
        dosage: "20-30 minutes",
        frequency: "3-5x/week",
        rationale:
          "Address cognitive-motor interference common in TBI, improve functional performance",
      },
      {
        name: "Vestibular rehabilitation",
        category: "balance-training",
        cptCode: "97112",
        dosage: "15-20 minutes",
        frequency: "3x/week",
        rationale:
          "Address dizziness, balance deficits, and visual-vestibular dysfunction post-TBI",
      },
      {
        name: "Aerobic exercise training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "20-30 minutes at 60-80% max HR",
        frequency: "3-5x/week",
        rationale:
          "Improve cardiovascular fitness, reduce fatigue, enhance cognitive function",
      },
      {
        name: "Progressive resistance training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "8-12 repetitions, 2-3 sets",
        frequency: "2-3x/week",
        rationale:
          "Restore strength, improve functional mobility, enhance independence",
      },
    ],
    contraindications: [
      "Uncontrolled intracranial pressure",
      "Acute skull fracture",
      "Severe agitation or combativeness",
      "Uncontrolled seizures",
    ],
    precautions: [
      "Monitor for post-concussive symptoms",
      "Avoid activities that increase intracranial pressure",
      "Provide structured, predictable environment",
      "Adjust for cognitive deficits - use simple instructions",
    ],
    expectedOutcomes:
      "Improved balance (BBS increase ≥5 points), reduced dizziness, enhanced endurance, return to community mobility",
    timeframe: "8-16 weeks",
    evidenceLevel: 4,
    citation:
      "Marshall S, et al. Updated clinical practice guidelines for concussion/mild traumatic brain injury and persistent symptoms. Brain Inj. 2015;29(6):688-700.",
  },
  // Parkinson's Disease Protocols
  {
    condition: "Parkinson's Disease",
    icdCode: "G20",
    phase: "chronic",
    interventions: [
      {
        name: "LSVT BIG therapy",
        category: "task-specific-training",
        cptCode: "97110",
        dosage: "60 minutes",
        frequency: "4x/week for 4 weeks",
        rationale:
          "Amplitude-focused training to counteract hypokinesia and improve functional movements",
      },
      {
        name: "Cueing strategies for gait",
        category: "gait-training",
        cptCode: "97116",
        dosage: "20-30 minutes",
        frequency: "3-5x/week",
        rationale:
          "External cues (auditory, visual, tactile) improve gait parameters and reduce freezing",
      },
      {
        name: "Progressive resistance training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "8-12 repetitions, 2-3 sets at 60-80% 1RM",
        frequency: "2-3x/week",
        rationale:
          "Improve strength, power, and functional mobility in PD patients",
      },
      {
        name: "Balance and fall prevention training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "30-45 minutes",
        frequency: "2-3x/week",
        rationale:
          "Reduce fall risk through challenging balance activities and reactive postural control",
      },
      {
        name: "Aerobic exercise (cycling, walking)",
        category: "strengthening",
        cptCode: "97110",
        dosage: "30-40 minutes at moderate intensity",
        frequency: "3x/week",
        rationale:
          "Neuroprotective effects, improve cardiovascular fitness, reduce motor symptoms",
      },
    ],
    contraindications: [
      "Severe dyskinesias interfering with exercise",
      "Uncontrolled cardiovascular disease",
      "Severe cognitive impairment",
      "Acute musculoskeletal injury",
    ],
    precautions: [
      'Schedule therapy during "ON" medication periods',
      "Monitor for orthostatic hypotension",
      "Fall risk - use gait belt and appropriate assistance",
      "Adjust for cognitive fluctuations",
      "Watch for freezing episodes during gait",
    ],
    expectedOutcomes:
      "Improved gait speed, reduced freezing episodes, enhanced balance (BBS increase ≥5 points), improved quality of life",
    timeframe: "Ongoing - chronic disease management",
    evidenceLevel: 5,
    citation:
      "Osborne JA, et al. Physical Therapist Management of Parkinson Disease: A Clinical Practice Guideline. Phys Ther. 2022;102(4):pzab302.",
  },
  // Multiple Sclerosis Protocol
  {
    condition: "Multiple Sclerosis",
    icdCode: "G35",
    phase: "chronic",
    interventions: [
      {
        name: "Aerobic exercise training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "20-30 minutes at moderate intensity",
        frequency: "2-3x/week",
        rationale:
          "Improve cardiovascular fitness, reduce fatigue, enhance quality of life",
      },
      {
        name: "Progressive resistance training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "8-15 repetitions, 1-3 sets",
        frequency: "2x/week",
        rationale:
          "Improve strength and functional capacity without exacerbating fatigue",
      },
      {
        name: "Balance and coordination training",
        category: "balance-training",
        cptCode: "97112",
        dosage: "20-30 minutes",
        frequency: "2-3x/week",
        rationale: "Address ataxia, improve postural control, reduce fall risk",
      },
      {
        name: "Energy conservation education",
        category: "task-specific-training",
        cptCode: "97110",
        dosage: "30 minutes",
        frequency: "1-2 sessions",
        rationale:
          "Teach strategies to manage fatigue and optimize daily function",
      },
    ],
    contraindications: [
      "Acute MS exacerbation",
      "Severe fatigue limiting participation",
      "Uncontrolled symptoms",
      "Heat intolerance with elevated core temperature",
    ],
    precautions: [
      "Avoid overheating - exercise in cool environment",
      "Monitor for fatigue - use RPE scale",
      "Adjust intensity based on symptom fluctuations",
      "Schedule therapy during optimal energy periods",
    ],
    expectedOutcomes:
      "Reduced fatigue, improved endurance, enhanced balance, maintained functional independence",
    timeframe: "Ongoing - chronic disease management",
    evidenceLevel: 4,
    citation:
      "Latimer-Cheung AE, et al. Development of evidence-informed physical activity guidelines for adults with multiple sclerosis. Arch Phys Med Rehabil. 2013;94(9):1829-36.",
  },
  // Spinal Cord Injury Protocol
  {
    condition: "Incomplete Spinal Cord Injury",
    icdCode: "S14.109A",
    phase: "subacute",
    interventions: [
      {
        name: "Locomotor training with body weight support",
        category: "gait-training",
        cptCode: "97116",
        dosage: "30-45 minutes",
        frequency: "3-5x/week",
        rationale:
          "Promote activity-dependent plasticity, improve gait function in incomplete SCI",
      },
      {
        name: "Functional electrical stimulation (FES)",
        category: "neuroplasticity",
        cptCode: "97032",
        dosage: "20-30 minutes",
        frequency: "3x/week",
        rationale:
          "Facilitate muscle activation, prevent atrophy, enhance motor recovery",
      },
      {
        name: "Upper extremity strengthening",
        category: "strengthening",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2-3 sets",
        frequency: "3x/week",
        rationale: "Maximize independence in wheelchair mobility and transfers",
      },
      {
        name: "Transfer training",
        category: "task-specific-training",
        cptCode: "97110",
        dosage: "20-30 minutes",
        frequency: "Daily",
        rationale:
          "Develop safe, efficient transfer techniques for functional independence",
      },
      {
        name: "Respiratory muscle training",
        category: "strengthening",
        cptCode: "97110",
        dosage: "15-20 minutes",
        frequency: "Daily",
        rationale:
          "Improve respiratory function, reduce pulmonary complications",
      },
    ],
    contraindications: [
      "Spinal instability",
      "Unhealed fractures",
      "Severe autonomic dysreflexia",
      "Deep vein thrombosis",
      "Severe orthostatic hypotension",
    ],
    precautions: [
      "Monitor for autonomic dysreflexia during exercise",
      "Skin integrity checks - prevent pressure ulcers",
      "Orthostatic hypotension management",
      "Temperature regulation - impaired thermoregulation",
      "Bowel/bladder management considerations",
    ],
    expectedOutcomes:
      "Improved motor function (ASIA motor score increase), enhanced mobility, increased independence in ADLs and transfers",
    timeframe: "12-24 weeks",
    evidenceLevel: 4,
    citation:
      "Behrman AL, et al. Locomotor training after human spinal cord injury: a series of case studies. Phys Ther. 2000;80(7):688-700.",
  },
];

// ============================================================================
// Neuroplasticity-Based Interventions
// ============================================================================

export interface NeuroplasticityIntervention {
  name: string;
  principle: string;
  description: string;
  indications: string[];
  dosageParameters: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const neuroplasticityInterventions: NeuroplasticityIntervention[] = [
  {
    name: "Constraint-Induced Movement Therapy (CIMT)",
    principle: "Overcome learned non-use through forced use of affected limb",
    description:
      "Restraint of less-affected upper extremity combined with intensive task practice of affected limb",
    indications: [
      "Stroke with residual upper extremity function (≥10° wrist extension, ≥10° finger extension)",
      "Ability to follow instructions",
      "Motivation for intensive therapy",
    ],
    dosageParameters:
      "Traditional: 6 hours/day for 10-15 consecutive weekdays. Modified: 2-3 hours/day for 10 days",
    evidenceLevel: 5,
    citation:
      "Wolf SL, et al. Effect of constraint-induced movement therapy on upper extremity function 3 to 9 months after stroke: the EXCITE randomized clinical trial. JAMA. 2006;296(17):2095-104.",
  },
  {
    name: "Task-Specific Training",
    principle:
      "Repetitive practice of functional tasks promotes motor learning and cortical reorganization",
    description:
      "High-intensity, repetitive practice of meaningful, goal-directed activities",
    indications: [
      "All neurological conditions with motor impairment",
      "Patient-identified functional goals",
      "Sufficient cognitive ability to engage in practice",
    ],
    dosageParameters:
      "Minimum 300-400 repetitions per session, 3-5x/week for 4-6 weeks",
    evidenceLevel: 5,
    citation:
      "French B, et al. Repetitive task training for improving functional ability after stroke. Cochrane Database Syst Rev. 2016;11(11):CD006073.",
  },
  {
    name: "Mental Practice",
    principle:
      "Motor imagery activates similar neural networks as physical practice",
    description:
      "Cognitive rehearsal of movements without physical execution, combined with physical practice",
    indications: [
      "Stroke recovery",
      "Severe motor impairment limiting physical practice",
      "Supplement to physical practice",
    ],
    dosageParameters:
      "15-20 minutes of mental practice combined with physical practice, 3-5x/week",
    evidenceLevel: 4,
    citation:
      "Braun S, et al. The effects of mental practice in neurological rehabilitation; a systematic review and meta-analysis. Front Hum Neurosci. 2013;7:390.",
  },
  {
    name: "Mirror Therapy",
    principle:
      "Visual feedback of unaffected limb movement activates motor cortex of affected hemisphere",
    description:
      "Patient observes reflection of unaffected limb performing movements while affected limb is hidden",
    indications: [
      "Stroke with severe upper extremity impairment",
      "Complex regional pain syndrome",
      "Phantom limb pain",
    ],
    dosageParameters: "15-30 minutes/day, 5-7 days/week for 4-6 weeks",
    evidenceLevel: 4,
    citation:
      "Thieme H, et al. Mirror therapy for improving motor function after stroke. Cochrane Database Syst Rev. 2018;7(7):CD008449.",
  },
  {
    name: "Aerobic Exercise for Neuroprotection",
    principle:
      "Aerobic exercise promotes BDNF release, neurogenesis, and neuroprotection",
    description: "Moderate to vigorous intensity cardiovascular exercise",
    indications: [
      "Parkinson's disease",
      "Multiple sclerosis",
      "Stroke recovery",
      "Traumatic brain injury",
    ],
    dosageParameters: "30-40 minutes at 60-80% max HR, 3-5x/week",
    evidenceLevel: 5,
    citation:
      "Petzinger GM, et al. Exercise-enhanced neuroplasticity targeting motor and cognitive circuitry in Parkinson's disease. Lancet Neurol. 2013;12(7):716-26.",
  },
  {
    name: "Bilateral Arm Training",
    principle:
      "Simultaneous movement of both arms facilitates affected limb through interhemispheric connections",
    description:
      "Synchronous or alternating movements of both upper extremities",
    indications: [
      "Stroke with moderate to severe upper extremity impairment",
      "Inability to perform CIMT due to insufficient motor control",
    ],
    dosageParameters: "30-60 minutes, 3-5x/week for 4-6 weeks",
    evidenceLevel: 4,
    citation:
      "Coupar F, et al. Simultaneous bilateral training for improving arm function after stroke. Cochrane Database Syst Rev. 2010;(4):CD006432.",
  },
  {
    name: "Virtual Reality Training",
    principle:
      "Immersive, engaging environment promotes high-intensity practice and motivation",
    description:
      "Use of VR technology to provide interactive, game-based rehabilitation exercises",
    indications: [
      "Stroke recovery",
      "Traumatic brain injury",
      "Parkinson's disease",
      "Balance and gait deficits",
    ],
    dosageParameters:
      "30-45 minutes, 3-5x/week, combined with conventional therapy",
    evidenceLevel: 4,
    citation:
      "Laver KE, et al. Virtual reality for stroke rehabilitation. Cochrane Database Syst Rev. 2017;11(11):CD008349.",
  },
  {
    name: "Robotic-Assisted Therapy",
    principle:
      "High-intensity, repetitive movements with precise control and feedback",
    description:
      "Use of robotic devices to assist or resist limb movements during task practice",
    indications: [
      "Stroke with moderate to severe motor impairment",
      "Spinal cord injury",
      "Need for high-intensity practice with limited therapist resources",
    ],
    dosageParameters: "45-60 minutes, 3-5x/week for 6-8 weeks",
    evidenceLevel: 4,
    citation:
      "Mehrholz J, et al. Electromechanical-assisted training for walking after stroke. Cochrane Database Syst Rev. 2017;5(5):CD006185.",
  },
];

// ============================================================================
// Clinical Resources
// ============================================================================

export interface NeurologicalClinicalResource {
  title: string;
  organization: string;
  url: string;
  description: string;
  evidenceLevel: 3 | 4 | 5;
}

export const neurologicalClinicalResources: NeurologicalClinicalResource[] = [
  {
    title: "APTA Stroke Rehabilitation Clinical Practice Guideline",
    organization: "American Physical Therapy Association - Neurology Section",
    url: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs/stroke",
    description:
      "Evidence-based guidelines for stroke rehabilitation across all phases of recovery",
    evidenceLevel: 5,
  },
  {
    title: "APTA Parkinson Disease Clinical Practice Guideline",
    organization: "American Physical Therapy Association - Neurology Section",
    url: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs/parkinson-disease",
    description:
      "Comprehensive guidelines for physical therapy management of Parkinson's disease",
    evidenceLevel: 5,
  },
  {
    title:
      "American Heart Association/American Stroke Association Stroke Rehabilitation Guidelines",
    organization: "AHA/ASA",
    url: "https://www.ahajournals.org/stroke",
    description:
      "Multidisciplinary guidelines for adult stroke rehabilitation and recovery",
    evidenceLevel: 5,
  },
  {
    title: "Cochrane Stroke Group Reviews",
    organization: "Cochrane Collaboration",
    url: "https://stroke.cochrane.org",
    description: "Systematic reviews of stroke rehabilitation interventions",
    evidenceLevel: 5,
  },
  {
    title: "Journal of Neurologic Physical Therapy",
    organization: "APTA Neurology Section",
    url: "https://journals.lww.com/jnpt",
    description:
      "Peer-reviewed journal focused on neurological physical therapy research",
    evidenceLevel: 5,
  },
  {
    title: "National MS Society - Exercise Guidelines",
    organization: "National Multiple Sclerosis Society",
    url: "https://www.nationalmssociety.org/Living-Well-With-MS/Diet-Exercise-Healthy-Behaviors/Exercise",
    description: "Evidence-based exercise recommendations for people with MS",
    evidenceLevel: 4,
  },
  {
    title: "Parkinson's Foundation - Exercise Resources",
    organization: "Parkinson's Foundation",
    url: "https://www.parkinson.org/living-with-parkinsons/treatment/exercise",
    description:
      "Exercise guidelines and resources for Parkinson's disease management",
    evidenceLevel: 4,
  },
  {
    title: "Brain Injury Association of America - Rehabilitation Resources",
    organization: "BIAA",
    url: "https://www.biausa.org",
    description:
      "Resources for traumatic brain injury rehabilitation and recovery",
    evidenceLevel: 3,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getNeurologicalAssessmentByAcronym(
  acronym: string,
): NeurologicalAssessmentTool | undefined {
  return neurologicalAssessmentTools.find((tool) => tool.acronym === acronym);
}

export function getProtocolsByCondition(
  condition: string,
): NeurologicalTreatmentProtocol[] {
  return neurologicalTreatmentProtocols.filter((protocol) =>
    protocol.condition.toLowerCase().includes(condition.toLowerCase()),
  );
}

export function getNeuroplasticityInterventionsByIndication(
  indication: string,
): NeuroplasticityIntervention[] {
  return neuroplasticityInterventions.filter((intervention) =>
    intervention.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

export function interpretNeurologicalAssessment(
  acronym: string,
  score: number,
): string {
  const tool = getNeurologicalAssessmentByAcronym(acronym);
  return tool ? tool.interpretation(score) : "Unknown assessment tool";
}

export function calculateFallRiskFromBBS(bbsScore: number): {
  risk: string;
  recommendations: string[];
} {
  if (bbsScore >= 56) {
    return {
      risk: "Low",
      recommendations: [
        "Continue current activity level",
        "Maintain regular exercise program",
        "Annual balance reassessment",
      ],
    };
  }
  if (bbsScore >= 45) {
    return {
      risk: "Moderate",
      recommendations: [
        "Balance training 2-3x/week",
        "Consider assistive device for community ambulation",
        "Home safety assessment",
        "Reassess balance every 3 months",
      ],
    };
  }
  if (bbsScore >= 21) {
    return {
      risk: "High",
      recommendations: [
        "Intensive balance training 3-5x/week",
        "Assistive device required",
        "Supervision for mobility",
        "Comprehensive fall prevention program",
        "Monthly balance reassessment",
      ],
    };
  }
  return {
    risk: "Very High",
    recommendations: [
      "Wheelchair mobility primary",
      "Intensive rehabilitation program",
      "Constant supervision required",
      "Environmental modifications essential",
      "Weekly reassessment",
    ],
  };
}

export function calculateFallRiskFromTUG(tugScore: number): {
  risk: string;
  interpretation: string;
} {
  if (tugScore <= 10) {
    return {
      risk: "Low",
      interpretation: "Normal mobility, independent community ambulation",
    };
  }
  if (tugScore <= 14) {
    return {
      risk: "Moderate",
      interpretation:
        "Mild mobility impairment, may benefit from assistive device",
    };
  }
  if (tugScore <= 20) {
    return {
      risk: "High",
      interpretation:
        "Moderate mobility impairment, assistive device recommended",
    };
  }
  return {
    risk: "Very High",
    interpretation:
      "Severe mobility impairment, requires assistance for safe mobility",
  };
}
