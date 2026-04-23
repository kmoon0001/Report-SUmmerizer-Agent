// ============================================================================
// SNF Respiratory PT Data
// Sources: APTA, CDC, Medicare guidelines
// ============================================================================

export interface RespiratoryTechnique {
  technique: string;
  description: string;
  indications: string[];
  contraindications: string[];
  procedure: string[];
  frequency: string;
  evidenceLevel: number;
  citation: string;
}

export const respiratoryTechniques: RespiratoryTechnique[] = [
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
    evidenceLevel: 1,
    citation: "APTA Guidelines for Respiratory PT, 2020",
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
    evidenceLevel: 1,
    citation: "CDC Guidelines for COPD Management, 2019",
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
    evidenceLevel: 1,
    citation: "APTA Guidelines for Respiratory PT, 2020",
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
    evidenceLevel: 1,
    citation: "ACSGI Guidelines for Post-Op Care, 2021",
  },
  {
    technique: "Huff Coughing",
    description: "Gentle coughing technique to clear secretions",
    indications: [
      "Weak cough",
      "Secretion clearance difficulty",
      "Chronic lung disease",
    ],
    contraindications: ["Unstable cardiovascular status", "Recent eye surgery"],
    procedure: [
      "Take deep breath",
      "Hold for 2-3 seconds",
      "Exhale forcefully through open mouth (huff)",
      "Repeat 2-3 times",
      "Then cough if needed",
    ],
    frequency: "Every 1-2 hours, or as needed",
    evidenceLevel: 1,
    citation: "Cystic Fibrosis Foundation Guidelines, 2020",
  },
];

export interface BreathingExercise {
  name: string;
  description: string;
  procedure: string[];
  frequency: string;
  duration: string;
  benefits: string[];
}

export const breathingExercises: BreathingExercise[] = [
  {
    name: "Diaphragmatic Breathing",
    description: "Deep breathing using diaphragm",
    procedure: [
      "Sit or lie comfortably",
      "Place hand on abdomen",
      "Inhale through nose (4 sec)",
      "Exhale through mouth (6 sec)",
    ],
    frequency: "2-4x/day",
    duration: "5-10 minutes",
    benefits: [
      "Improves oxygenation",
      "Reduces shortness of breath",
      "Promotes relaxation",
    ],
  },
  {
    name: "Pursed-Lip Breathing",
    description: "Slows breathing rate",
    procedure: [
      "Inhale through nose (2 sec)",
      "Purse lips",
      "Exhale slowly (4-6 sec)",
    ],
    frequency: "As needed",
    duration: "5-10 minutes",
    benefits: [
      "Slows breathing rate",
      "Improves ventilation",
      "Reduces anxiety",
    ],
  },
  {
    name: "Huff Coughing",
    description: "Gentle coughing technique",
    procedure: [
      "Deep breath",
      "Hold 2-3 sec",
      "Huff exhale",
      "Repeat 2-3 times",
    ],
    frequency: "Every 1-2 hours",
    duration: "5 minutes",
    benefits: [
      "Clears secretions",
      "Reduces cough fatigue",
      "Improves airway clearance",
    ],
  },
  {
    name: "Controlled Coughing",
    description: "Effective coughing technique",
    procedure: [
      "Sit comfortably",
      "Cross arms",
      "Take deep breath",
      "Cough 2-3 times",
    ],
    frequency: "Every 2-4 hours",
    duration: "5 minutes",
    benefits: [
      "Clears secretions",
      "Improves airway clearance",
      "Reduces infection risk",
    ],
  },
];

export interface PulmonaryCondition {
  condition: string;
  symptoms: string[];
  PTInterventions: string[];
  goals: string[];
}

export const pulmonaryConditions: PulmonaryCondition[] = [
  {
    condition: "Chronic Obstructive Pulmonary Disease (COPD)",
    symptoms: ["Shortness of breath", "Chronic cough", "Wheezing", "Fatigue"],
    PTInterventions: [
      "Pursed-lip breathing",
      "Diaphragmatic breathing",
      "Energy conservation",
      "Pulmonary rehab",
    ],
    goals: [
      "Improve breathing efficiency",
      "Reduce shortness of breath",
      "Increase activity tolerance",
    ],
  },
  {
    condition: "Post-Operative Atelectasis",
    symptoms: ["Shortness of breath", "Chest pain", "Cough", "Fever"],
    PTInterventions: [
      "Incentive spirometry",
      "Deep breathing",
      "Coughing techniques",
      "Early mobilization",
    ],
    goals: [
      "Prevent atelectasis",
      "Improve lung expansion",
      "Clear secretions",
    ],
  },
  {
    condition: "Pneumonia",
    symptoms: ["Fever", "Cough", "Shortness of breath", "Fatigue"],
    PTInterventions: [
      "Chest physiotherapy",
      "Coughing techniques",
      "Positioning",
      "Breathing exercises",
    ],
    goals: ["Clear secretions", "Improve oxygenation", "Prevent complications"],
  },
  {
    condition: "Post-Operative Respiratory Complications",
    symptoms: ["Shortness of breath", "Cough", "Fatigue", "Low oxygen"],
    PTInterventions: [
      "Incentive spirometry",
      "Deep breathing",
      "Coughing techniques",
      "Early mobilization",
    ],
    goals: [
      "Prevent complications",
      "Improve lung function",
      "Increase activity tolerance",
    ],
  },
];

export interface DischargeCriteria {
  criteria: string;
  description: string;
  assessmentMethod: string;
  minimumRequirement: string;
}

export const dischargeCriteria: DischargeCriteria[] = [
  {
    criteria: "Breathing Efficiency",
    description: "Improved breathing efficiency",
    assessmentMethod: "Respiratory rate, oxygen saturation",
    minimumRequirement: "Respiratory rate 12-20/min, SpO2 ≥92%",
  },
  {
    criteria: "Cough Effectiveness",
    description: "Effective cough for secretion clearance",
    assessmentMethod: "Observation, auscultation",
    minimumRequirement: "Effective cough, clear breath sounds",
  },
  {
    criteria: "Activity Tolerance",
    description: "Improved activity tolerance",
    assessmentMethod: "6-minute walk test, functional assessment",
    minimumRequirement: "Complete ADLs without excessive fatigue",
  },
];

export interface ComplicationPrevention {
  complication: string;
  signsSymptoms: string[];
  prevention: string[];
  management: string[];
}

export const complicationPrevention: ComplicationPrevention[] = [
  {
    complication: "Atelectasis",
    signsSymptoms: ["Shortness of breath", "Cough", "Fever", "Low oxygen"],
    prevention: [
      "Incentive spirometry",
      "Deep breathing",
      "Early mobilization",
      "Coughing techniques",
    ],
    management: [
      "Aggressive breathing exercises",
      "Chest physiotherapy",
      "Oxygen therapy",
      "Medical evaluation",
    ],
  },
  {
    complication: "Pneumonia",
    signsSymptoms: ["Fever", "Cough", "Shortness of breath", "Fatigue"],
    prevention: [
      "Breathing exercises",
      "Coughing techniques",
      "Early mobilization",
      "Oral care",
    ],
    management: [
      "Antibiotics",
      "Oxygen therapy",
      "Respiratory therapy",
      "Hospitalization if severe",
    ],
  },
  {
    complication: "Respiratory Failure",
    signsSymptoms: [
      "Severe shortness of breath",
      "Low oxygen",
      "Rapid breathing",
      "Confusion",
    ],
    prevention: [
      "Monitor oxygen",
      "Breathing exercises",
      "Early intervention",
      "Follow-up care",
    ],
    management: [
      "Emergency medical attention",
      "Oxygen therapy",
      "Mechanical ventilation",
      "ICU admission",
    ],
  },
];
