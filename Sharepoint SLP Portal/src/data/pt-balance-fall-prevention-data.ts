// ============================================================================
// SNF Balance & Fall Prevention Data
// Sources: APTA, CDC, Morse Fall Scale, Hendrich II Fall Risk Model
// ============================================================================

export interface FallRiskAssessment {
  name: string;
  acronym: string;
  population: string;
  time: string;
  cost: string;
  link: string;
  instructions: string;
  tags: string[];
  whatItIs: string;
  whatItContains: string;
  tips: string[];
  limitations: string[];
}

export const fallRiskAssessments: FallRiskAssessment[] = [
  {
    name: "Morse Fall Scale",
    acronym: "MFS",
    population: "Adults (Hospital/SNF)",
    time: "2-5 mins",
    cost: "Free",
    link: "https://www.morsefall.com/",
    tags: ["Screening", "Bedside"],
    whatItIs:
      "A quick, evidence-based fall risk assessment tool used in hospitals and SNFs.",
    whatItContains:
      "1. History of falling (yes/no)\n2. Secondary diagnosis (yes/no)\n3. Ambulatory aid (none/walker/cane)\n4. IV therapy (yes/no)\n5. Gait/transfer (normal/impaired)\n6. Mental status (alert/overconfident)",
    instructions:
      "1. Observe patient for history of falls. 2. Check for secondary diagnosis. 3. Assess use of ambulatory aids. 4. Check for IV/heparin lock. 5. Evaluate gait. 6. Assess mental status.",
    tips: [
      "Score ≥45 = High risk, implement fall precautions",
      "Reassess weekly or with condition changes",
      "Use with other assessments for comprehensive evaluation",
    ],
    limitations: [
      "Does not assess environmental hazards",
      "May miss cognitive fall risks",
      "Requires staff training for consistency",
    ],
  },
  {
    name: "Hendrich II Fall Risk Model",
    acronym: "H2FRM",
    population: "Older adults (65+)",
    time: "3-5 mins",
    cost: "Free",
    link: "https://www.iupui.edu/~fallrisk/",
    tags: ["Screening", "Geriatric"],
    whatItIs:
      "Validated model specifically designed for older adults in hospital and SNF settings.",
    whatItContains:
      "1. Diagnosed with delirium (yes/no)\n2. Depressed (yes/no)\n3. Urinary frequency/urgency (yes/no)\n4. Takes 4+ medications (yes/no)\n5. Male (yes/no)\n6. Unsteady gait (yes/no)\n7. Visual impairment (yes/no)",
    instructions:
      '1. Evaluate risk factors including confusion, depression, and altered elimination. 2. Assess gender (male = higher risk). 3. Check for dizziness and medications. 4. Perform "Get Up and Go" test.',
    tips: [
      "Score ≥5 = High risk, implement fall prevention",
      "Strong predictor of falls in older adults",
      "Includes delirium which is critical in SNF",
    ],
    limitations: [
      "Specific to older adults",
      "Does not include environmental factors",
      "Requires documentation review",
    ],
  },
  {
    name: "Timed Up & Go Test",
    acronym: "TUG",
    population: "Older adults, mobility impaired",
    time: "1-2 mins",
    cost: "Free",
    link: "https://www.cdc.gov/steadi/pdf/tug-test.pdf",
    tags: ["Functional", "Gait"],
    whatItIs: "Simple test measuring mobility and fall risk in older adults.",
    whatItContains:
      "1. Sit in chair\n2. Stand up\n3. Walk 3 meters\n4. Turn around\n5. Walk back\n6. Sit down",
    instructions:
      '1. Patient sits in standard armchair. 2. On "Go", patient stands, walks 3 meters, turns, walks back, and sits down. 3. Time the entire sequence.',
    tips: [
      "Time >10s = Low risk",
      "Time 10-19s = Moderate risk",
      "Time ≥20s = High risk",
      "Observe for unsteadiness, hesitation, grab rail",
    ],
    limitations: [
      "May not detect intermittent fallers",
      "Requires space and timer",
      "Affected by cognitive impairment",
    ],
  },
  {
    name: "Get Up and Go Test",
    acronym: "GUG",
    population: "Older adults",
    time: "2-3 mins",
    cost: "Free",
    link: "https://www.cdc.gov/steadi/pdf/gug-test.pdf",
    tags: ["Functional", "Screening"],
    whatItIs: "Observational test assessing mobility and fall risk.",
    whatItContains:
      "1. Sit in chair\n2. Stand up\n3. Walk 10 feet\n4. Turn around\n5. Walk back\n6. Sit down",
    instructions:
      "1. Patient sits in chair. 2. Patient stands and walks 10 feet. 3. Patient turns, walks back, and sits down. 4. Observer scores based on quality of movement.",
    tips: [
      "Score 1-2 = Low risk",
      "Score 3 = Moderate risk",
      "Score 4-5 = High risk",
      "Observe gait, balance, and confidence",
    ],
    limitations: [
      "Subjective scoring",
      "Requires trained observer",
      "May be affected by cognitive status",
    ],
  },
];

export interface BalanceAssessment {
  name: string;
  description: string;
  population: string;
  time: string;
  whatItMeasures: string[];
  scoring: string;
  tips: string[];
}

export const balanceAssessments: BalanceAssessment[] = [
  {
    name: "Berg Balance Scale",
    description: "Gold standard balance assessment for older adults",
    population: "Older adults, mobility impaired",
    time: "15-20 mins",
    whatItMeasures: [
      "Sitting to standing",
      "Standing unsupported",
      "Sitting unsupported",
      "Reaching forward",
      "Standing with eyes closed",
    ],
    scoring:
      "0-56 points (0-4 per item)\n≤40 = High fall risk\n41-56 = Low fall risk",
    tips: [
      "Use for SNF patients with balance concerns",
      "Reassess with interventions",
      "Score <40 indicates need for fall prevention",
    ],
  },
  {
    name: "Functional Reach Test",
    description: "Measures dynamic balance and stability limits",
    population: "Older adults, mobility impaired",
    time: "2-3 mins",
    whatItMeasures: ["Stability limits", "Dynamic balance", "Trunk control"],
    scoring:
      "Distance in cm\n<10cm = High fall risk\n10-25cm = Moderate risk\n>25cm = Low risk",
    tips: [
      "Quick screening tool",
      "Use with other assessments",
      "Monitor changes over time",
    ],
  },
  {
    name: "Tinetti Performance-Oriented Mobility Assessment",
    description: "Assesses gait and balance to predict fall risk",
    population: "Older adults",
    time: "10-15 mins",
    whatItMeasures: [
      "Gait stability",
      "Balance control",
      "Trunk control",
      "Step accuracy",
    ],
    scoring:
      "Gait 0-12, Balance 0-16, Total 0-28\n≤19 = High fall risk\n20-24 = Moderate risk\n25-28 = Low risk",
    tips: [
      "Comprehensive assessment",
      "Predicts fall risk well",
      "Use for discharge planning",
    ],
  },
];

export interface FallPreventionIntervention {
  category: string;
  name: string;
  description: string;
  evidenceLevel: number;
  citation: string;
  implementation: string[];
  precautions: string[];
}

export const fallPreventionInterventions: FallPreventionIntervention[] = [
  {
    category: "Exercise",
    name: "Tai Chi for Fall Prevention",
    description:
      "Evidence-based exercise program improving balance and reducing falls",
    evidenceLevel: 1,
    citation:
      "Li F, et al. Tai Chi and Fall Improvements in Older Adults. JAMA, 2010.",
    implementation: [
      "2x/week for 24 weeks",
      "Group or individual sessions",
      "Focus on weight shifting, balance, coordination",
      "Progress from standing to walking",
    ],
    precautions: [
      "Assess fall risk before starting",
      "Supervise initial sessions",
      "Modify for mobility limitations",
    ],
  },
  {
    category: "Exercise",
    name: "Balance Training Protocol",
    description: "Progressive balance exercises for SNF patients",
    evidenceLevel: 1,
    citation:
      "Shumway-Cook A, et al. A Comparison of Randomized Studies of Balance Training. J Geriatr Phys Ther, 2012.",
    implementation: [
      "Start with static balance (feet together, tandem)",
      "Progress to dynamic balance (weight shifting, reaching)",
      "Add dual-tasking (talking while balancing)",
      "Include perturbation training",
    ],
    precautions: [
      "Supervise all exercises",
      "Use support as needed",
      "Progress gradually",
    ],
  },
  {
    category: "Exercise",
    name: "Strength Training for Balance",
    description: "Lower extremity strength training to improve balance",
    evidenceLevel: 1,
    citation:
      "Campbell A, et al. Strength Training and Falls in Older Adults. JAMA, 2012.",
    implementation: [
      "2-3x/week resistance training",
      "Focus on legs: squats, step-ups, heel raises",
      "Progress resistance gradually",
      "Include functional movements",
    ],
    precautions: [
      "Assess cardiovascular status",
      "Monitor for fatigue",
      "Use proper form",
    ],
  },
  {
    category: "Environmental",
    name: "Home Hazard Assessment",
    description: "Identify and modify home fall hazards",
    evidenceLevel: 1,
    citation:
      "Wolfson H, et al. A Randomized Trial for Reducing Falls. NEJM, 1997.",
    implementation: [
      "Remove throw rugs",
      "Install grab bars in bathroom",
      "Improve lighting",
      "Clear clutter from walkways",
      "Ensure stable furniture",
    ],
    precautions: [
      "Involve patient and family",
      "Consider cultural preferences",
      "Document modifications",
    ],
  },
  {
    category: "Medication",
    name: "Medication Review",
    description: "Review and reduce fall-risk medications",
    evidenceLevel: 1,
    citation:
      "Gillespie LD, et al. Medication Review and Withdrawal for Fall Prevention. Cochrane, 2012.",
    implementation: [
      "Review all medications",
      "Identify high-risk drugs (benzodiazepines, antipsychotics)",
      "Consider deprescribing",
      "Collaborate with pharmacy",
    ],
    precautions: [
      "Do not stop medications abruptly",
      "Monitor for withdrawal",
      "Document rationale",
    ],
  },
  {
    category: "Vision",
    name: "Vision Assessment",
    description: "Address vision problems contributing to falls",
    evidenceLevel: 1,
    citation:
      "Stauffer D, et al. Vision Interventions for Fall Prevention. JAMA, 2012.",
    implementation: [
      "Assess visual acuity",
      "Check for cataracts",
      "Review eyeglass prescriptions",
      "Ensure proper lighting",
    ],
    precautions: [
      "Refer to ophthalmologist if needed",
      "Check for dual vision",
      "Assess depth perception",
    ],
  },
];

export interface BedMobilityProtocol {
  phase: string;
  name: string;
  description: string;
  exercises: string[];
  frequency: string;
  precautions: string[];
}

export const bedMobilityProtocols: BedMobilityProtocol[] = [
  {
    phase: "1",
    name: "Bed Mobility - Supine to Side-lying",
    description: "Initial mobility progression from lying position",
    exercises: [
      "Log roll with assistance",
      "Side-lying to supine",
      "Head control exercises",
      "Breathing exercises",
    ],
    frequency: "2-4x/day",
    precautions: [
      "Assess pain level",
      "Use proper body mechanics",
      "Monitor vital signs",
    ],
  },
  {
    phase: "2",
    name: "Bed Mobility - Sitting",
    description: "Progression to sitting position",
    exercises: [
      "Semi-Fowler's to full sitting",
      "Sitting balance exercises",
      "Sitting to side-lying",
      "Arm support exercises",
    ],
    frequency: "3-5x/day",
    precautions: [
      "Prevent orthostatic hypotension",
      "Monitor for dizziness",
      "Provide support as needed",
    ],
  },
  {
    phase: "3",
    name: "Bed Mobility - Edge of Bed",
    description: "Positioning at edge of bed for transfers",
    exercises: [
      "Sitting at edge of bed",
      "Leg swinging",
      "Weight shifting",
      "Preparation for standing",
    ],
    frequency: "4-6x/day",
    precautions: [
      "Ensure bed height is appropriate",
      "Use bed rails for safety",
      "Monitor for fatigue",
    ],
  },
];

export interface TransferProtocol {
  type: string;
  name: string;
  description: string;
  steps: string[];
  assistanceLevels: string[];
  safetyTips: string[];
}

export const transferProtocols: TransferProtocol[] = [
  {
    type: "Bed to Chair",
    name: "Pivot Transfer",
    description: "Standard transfer technique for most patients",
    steps: [
      "Position chair close to bed",
      "Lock wheelchair brakes",
      "Patient sits at edge of bed",
      "Pivot on foot, use arms for support",
      "Sit in chair",
    ],
    assistanceLevels: [
      "Independent",
      "Contact guard",
      "Minimal assist",
      "Moderate assist",
      "Max assist",
    ],
    safetyTips: [
      "Ensure non-slip footwear",
      "Check chair stability",
      "Use gait belt if needed",
      "Clear path of obstacles",
    ],
  },
  {
    type: "Chair to Toilet",
    name: "Standing Transfer",
    description: "Transfer from chair to toilet",
    steps: [
      "Position chair close to toilet",
      "Lock wheelchair",
      "Patient stands with assistance",
      "Pivot to toilet",
      "Sit on toilet",
    ],
    assistanceLevels: [
      "Independent",
      "Contact guard",
      "Minimal assist",
      "Moderate assist",
    ],
    safetyTips: [
      "Install grab bars",
      "Use raised toilet seat",
      "Ensure floor is dry",
      "Check toilet stability",
    ],
  },
  {
    type: "Car Transfer",
    name: "Swivel Seat Transfer",
    description: "Transfer to and from vehicle",
    steps: [
      "Position vehicle close to curb",
      "Lock parking brake",
      "Rotate seat away from door",
      "Patient pivots into vehicle",
      "Rotate seat back",
    ],
    assistanceLevels: ["Independent", "Minimal assist", "Moderate assist"],
    safetyTips: [
      "Use vehicle handrails",
      "Consider transfer board",
      "Check seatbelt function",
      "Ensure vehicle is stable",
    ],
  },
];

export interface DementiaMobilityStrategy {
  name: string;
  description: string;
  implementation: string[];
  communicationTips: string[];
  environmentalModifications: string[];
}

export const dementiaMobilityStrategies: DementiaMobilityStrategy[] = [
  {
    name: "Simplified Instructions",
    description: "Break down mobility tasks into simple steps",
    implementation: [
      "Use short, clear commands",
      "Demonstrate each step",
      "Allow time for processing",
      "Use visual cues",
    ],
    communicationTips: [
      "Speak slowly and clearly",
      "Use simple words",
      "Repeat instructions as needed",
      "Avoid complex explanations",
    ],
    environmentalModifications: [
      "Clear path to bathroom",
      "Install night lights",
      "Use contrasting colors",
      "Remove clutter",
    ],
  },
  {
    name: "Routine-Based Mobility",
    description: "Establish consistent mobility routines",
    implementation: [
      "Same times for activities",
      "Same caregivers when possible",
      "Consistent environment",
      "Predictable sequence",
    ],
    communicationTips: [
      "Explain what will happen",
      "Use familiar phrases",
      "Reassure throughout",
      "Validate feelings",
    ],
    environmentalModifications: [
      "Consistent room layout",
      "Familiar objects nearby",
      "Minimize changes",
      "Calming environment",
    ],
  },
  {
    name: "Positive Reinforcement",
    description: "Encourage mobility through positive feedback",
    implementation: [
      "Praise effort, not just success",
      "Use encouraging language",
      "Celebrate small achievements",
      "Avoid criticism",
    ],
    communicationTips: [
      "Use positive language",
      "Focus on abilities",
      "Be patient",
      "Maintain eye contact",
    ],
    environmentalModifications: [
      "Comfortable environment",
      "Familiar music",
      "Personal items nearby",
      "Calming colors",
    ],
  },
];

export interface RespiratoryPT {
  technique: string;
  description: string;
  indications: string[];
  contraindications: string[];
  procedure: string[];
  frequency: string;
}

export const respiratoryPTTechniques: RespiratoryPT[] = [
  {
    technique: "Diaphragmatic Breathing",
    description: "Deep breathing using diaphragm to improve oxygenation",
    indications: [
      "Shortness of breath",
      "Chronic obstructive pulmonary disease",
      "Post-operative",
      "Fatigue",
    ],
    contraindications: [
      "Severe respiratory distress",
      "Unstable cardiovascular status",
    ],
    procedure: [
      "Sit or lie comfortably",
      "Place hand on abdomen",
      "Inhale slowly through nose (4 sec)",
      "Exhale slowly through mouth (6 sec)",
      "Repeat for 5-10 minutes",
    ],
    frequency: "2-4x/day, or as needed",
  },
  {
    technique: "Pursed-Lip Breathing",
    description: "Slows breathing rate and improves ventilation",
    indications: [
      "Shortness of breath",
      "Anxiety-related breathing",
      "Chronic lung disease",
    ],
    contraindications: ["Severe respiratory distress"],
    procedure: [
      "Inhale through nose (2 sec)",
      "Purse lips as if whistling",
      "Exhale slowly through pursed lips (4-6 sec)",
      "Repeat for 5-10 minutes",
    ],
    frequency: "As needed, especially with activity",
  },
  {
    technique: "Cough Assist",
    description: "Techniques to improve cough effectiveness",
    indications: [
      "Weak cough",
      "Secretion clearance difficulty",
      "Post-operative",
    ],
    contraindications: [
      "Unstable cardiovascular status",
      "Recent surgery with incisional restrictions",
    ],
    procedure: [
      "Deep breath",
      "Hold for 2-3 seconds",
      "Cough 2-3 times",
      "Rest between cycles",
      "Repeat as needed",
    ],
    frequency: "Every 1-2 hours, or as needed",
  },
  {
    technique: "Incentive Spirometry",
    description: "Device-assisted breathing exercise to prevent atelectasis",
    indications: [
      "Post-operative",
      "Prolonged immobility",
      "Respiratory conditions",
    ],
    contraindications: [
      "Unstable cardiovascular status",
      "Inability to follow instructions",
    ],
    procedure: [
      "Sit upright",
      "Seal mouthpiece in mouth",
      "Inhale slowly and deeply",
      "Hold breath for 3-5 seconds",
      "Exhale slowly",
      "Rest between repetitions",
    ],
    frequency: "10-15 repetitions every 1-2 hours while awake",
  },
];

export interface ContracturePrevention {
  area: string;
  stretches: string[];
  frequency: string;
  positioning: string[];
  equipment: string[];
}

export const contracturePreventionProtocols: ContracturePrevention[] = [
  {
    area: "Ankle",
    stretches: [
      "Ankle circles",
      "Dorsiflexion/plantarflexion",
      "Inversion/eversion",
    ],
    frequency: "2-4x/day",
    positioning: ["Heel support", "Footboard use", "Neutral alignment"],
    equipment: ["Ankle weights (if indicated)", "Splints (if indicated)"],
  },
  {
    area: "Knee",
    stretches: ["Heel slides", "Straight leg raises", "Quad sets"],
    frequency: "2-4x/day",
    positioning: ["Knee extension", "Avoid prolonged flexion"],
    equipment: [
      "Knee immobilizer (if indicated)",
      "Continuous passive motion (if indicated)",
    ],
  },
  {
    area: "Hip",
    stretches: ["Glute sets", "Heel slides", "Abduction/adduction"],
    frequency: "2-4x/day",
    positioning: [
      "Neutral alignment",
      "Avoid excessive flexion",
      "Abduction pillow (if indicated)",
    ],
    equipment: ["Abduction pillow", "Leg lifter (if indicated)"],
  },
  {
    area: "Shoulder",
    stretches: ["Pendulum exercises", "Passive ROM", "Scapular retraction"],
    frequency: "2-4x/day",
    positioning: ["Arm support", "Avoid internal rotation"],
    equipment: ["Sling (if indicated)", "Pulley system (if indicated)"],
  },
  {
    area: "Elbow",
    stretches: ["Wrist flexion/extension", "Forearm pronation/supination"],
    frequency: "2-4x/day",
    positioning: ["Neutral alignment", "Avoid prolonged flexion"],
    equipment: ["Splint (if indicated)"],
  },
  {
    area: "Wrist/Hand",
    stretches: [
      "Finger extensions",
      "Wrist flexion/extension",
      "Thumb opposition",
    ],
    frequency: "2-4x/day",
    positioning: ["Hand in functional position", "Splinting (if indicated)"],
    equipment: ["Hand splint", "Therapy putty", "Tennis ball (for grip)"],
  },
];

export interface ADLTraining {
  activity: string;
  techniques: string[];
  adaptiveEquipment: string[];
  energyConservation: string[];
  safetyConsiderations: string[];
}

export const adlTraining: ADLTraining[] = [
  {
    activity: "Dressing",
    techniques: [
      "Seated dressing",
      "Distal to proximal",
      "Use of assistive devices",
    ],
    adaptiveEquipment: [
      "Button hooks",
      "Zipper pulls",
      "Shoe horns",
      "Dressing sticks",
    ],
    energyConservation: [
      "Sit while dressing",
      "Organize clothes",
      "Take breaks",
    ],
    safetyConsiderations: ["Non-slip footwear", "Secure rugs", "Good lighting"],
  },
  {
    activity: "Bathing",
    techniques: ["Seated bathing", "No-rinse cleansers", "Back washing aids"],
    adaptiveEquipment: [
      "Shower chair",
      "Grab bars",
      "Handheld shower",
      "Long-handled sponges",
    ],
    energyConservation: [
      "Plan bath time",
      "Use warm water",
      "Minimize transfers",
    ],
    safetyConsiderations: [
      "Non-slip mats",
      "Temperature control",
      "Emergency call",
    ],
  },
  {
    activity: "Grooming",
    techniques: ["Seated grooming", "Adaptive techniques"],
    adaptiveEquipment: [
      "Electric razor",
      "Adaptive toothbrush",
      "Long-handled mirrors",
    ],
    energyConservation: [
      "Organize supplies",
      "Take breaks",
      "Use electric devices",
    ],
    safetyConsiderations: [
      "Non-slip surfaces",
      "Safe storage",
      "Emergency access",
    ],
  },
  {
    activity: "Toileting",
    techniques: ["Seated transfer", "Proper positioning"],
    adaptiveEquipment: ["Raised toilet seat", "Grab bars", "Commode chair"],
    energyConservation: [
      "Plan timing",
      "Minimize transfers",
      "Use bedside commode if needed",
    ],
    safetyConsiderations: [
      "Grab bars",
      "Non-slip floor",
      "Call bell within reach",
    ],
  },
];

export interface EnergyConservation {
  strategy: string;
  description: string;
  implementation: string[];
  examples: string[];
}

export const energyConservationStrategies: EnergyConservation[] = [
  {
    strategy: "Prioritize Tasks",
    description: "Focus on essential activities first",
    implementation: [
      "Identify must-do vs nice-to-do",
      "Schedule high-energy tasks first",
      "Delegate when possible",
    ],
    examples: [
      "Do laundry in morning when energy is highest",
      "Save socializing for afternoon",
      "Prepare meals in batches",
    ],
  },
  {
    strategy: "Pace Yourself",
    description: "Balance activity with rest",
    implementation: [
      "Take breaks every 15-20 minutes",
      "Alternate active and rest periods",
      "Stop before exhaustion",
    ],
    examples: [
      "Sit while brushing teeth",
      "Rest after dressing",
      "Take breaks during meal prep",
    ],
  },
  {
    strategy: "Use Energy-Saving Techniques",
    description: "Optimize movement efficiency",
    implementation: [
      "Sit for tasks when possible",
      "Use assistive devices",
      "Organize workspace",
    ],
    examples: [
      "Use rolling cart for cleaning",
      "Sit to cook",
      "Use long-handled tools",
    ],
  },
  {
    strategy: "Plan Ahead",
    description: "Anticipate energy needs",
    implementation: [
      "Schedule rest before activities",
      "Prepare supplies in advance",
      "Consider energy cost",
    ],
    examples: [
      "Rest before shower",
      "Organize clothes the night before",
      "Batch similar tasks",
    ],
  },
];

export interface PositioningProtocol {
  position: string;
  purpose: string;
  technique: string[];
  duration: string;
  precautions: string[];
}

export const positioningProtocols: PositioningProtocol[] = [
  {
    position: "High Fowler's",
    purpose: "Improve breathing, prevent aspiration",
    technique: [
      "Head elevated 60-90 degrees",
      "Support back and arms",
      "Feet flat or on footrest",
    ],
    duration: "As needed for breathing",
    precautions: [
      "Monitor for pressure points",
      "Ensure comfort",
      "Check circulation",
    ],
  },
  {
    position: "Semi-Fowler's",
    purpose: "Comfort, breathing, digestion",
    technique: [
      "Head elevated 30-45 degrees",
      "Support back",
      "Knees slightly elevated",
    ],
    duration: "Extended periods",
    precautions: ["Prevent sliding", "Check skin integrity", "Ensure comfort"],
  },
  {
    position: "Side-lying",
    purpose: "Pressure relief, comfort",
    technique: [
      "30-degree angle",
      "Support head and neck",
      "Place pillow between legs",
      "Support arms",
    ],
    duration: "2 hours max, then reposition",
    precautions: [
      "Check skin on hips and ankles",
      "Ensure proper alignment",
      "Monitor for discomfort",
    ],
  },
  {
    position: "Supine",
    purpose: "Rest, recovery",
    technique: [
      "Head supported",
      "Arms at sides or on pillow",
      "Knees slightly bent",
    ],
    duration: "As needed",
    precautions: [
      "Turn every 2 hours",
      "Check skin integrity",
      "Prevent pressure ulcers",
    ],
  },
];

export interface FallRiskReductionPlan {
  patientRiskLevel: "Low" | "Moderate" | "High";
  interventions: string[];
  environmentalModifications: string[];
  education: string[];
}

export const fallRiskReductionPlans: Record<string, FallRiskReductionPlan> = {
  low: {
    patientRiskLevel: "Low",
    interventions: [
      "Encourage regular exercise",
      "Annual vision check",
      "Medication review",
    ],
    environmentalModifications: [
      "Clear walkways",
      "Good lighting",
      "Non-slip mats",
    ],
    education: [
      "Fall prevention awareness",
      "Safe exercise techniques",
      "Home safety tips",
    ],
  },
  moderate: {
    patientRiskLevel: "Moderate",
    interventions: [
      "Balance training 2x/week",
      "Strength training 2x/week",
      "Medication review",
    ],
    environmentalModifications: [
      "Grab bars in bathroom",
      "Non-slip footwear",
      "Clear pathways",
      "Night lights",
    ],
    education: [
      "Fall risk factors",
      "Safe transfer techniques",
      "Emergency response",
    ],
  },
  high: {
    patientRiskLevel: "High",
    interventions: [
      "Balance training 3x/week",
      "Strength training 3x/week",
      "Medication review",
      "Vision assessment",
    ],
    environmentalModifications: [
      "Grab bars everywhere",
      "Non-slip footwear",
      "Clear pathways",
      "Night lights",
      "Bed alarm",
      "Call bell within reach",
    ],
    education: [
      "Fall prevention strategies",
      "Safe mobility techniques",
      "Emergency response",
      "Family involvement",
    ],
  },
};
