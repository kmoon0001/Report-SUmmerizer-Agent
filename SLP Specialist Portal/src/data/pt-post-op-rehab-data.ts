// ============================================================================
// SNF Post-Operative Rehabilitation Data
// Sources: APTA, AAOS, ACS, Medicare guidelines
// ============================================================================

export interface PostOpProtocol {
  procedure: string;
  phases: {
    phase: number;
    name: string;
    timeframe: string;
    goals: string[];
    exercises: string[];
    precautions: string[];
    dischargeCriteria: string[];
  }[];
  evidenceLevel: number;
  citation: string;
}

export const postOpProtocols: PostOpProtocol[] = [
  {
    procedure: "Total Knee Arthroplasty (TKA)",
    phases: [
      {
        phase: 1,
        name: "Immediate Post-Op (Days 0-3)",
        timeframe: "Days 0-3",
        goals: ["Pain control", "Prevent complications", "Initiate mobility"],
        exercises: [
          "Ankle pumps",
          "Quad sets",
          "Heel slides",
          "Straight leg raises",
        ],
        precautions: [
          "Knee extension brace",
          "Weight-bearing as tolerated",
          "Monitor for DVT",
        ],
        dischargeCriteria: [
          "Pain controlled",
          "Ambulate with assistive device",
          "Independent transfers",
        ],
      },
      {
        phase: 2,
        name: "Early Rehabilitation (Weeks 1-4)",
        timeframe: "Weeks 1-4",
        goals: ["Restore ROM", "Improve strength", "Gait training"],
        exercises: [
          "Quad sets",
          "Hamstring sets",
          "Heel slides",
          "Straight leg raises",
          "Mini squats",
        ],
        precautions: [
          "Continue brace as needed",
          "Weight-bearing as tolerated",
          "Avoid excessive flexion",
        ],
        dischargeCriteria: [
          "90° flexion",
          "100° extension",
          "Ambulate 50 feet with assistive device",
        ],
      },
      {
        phase: 3,
        name: "Intermediate (Weeks 5-12)",
        timeframe: "Weeks 5-12",
        goals: ["Full ROM", "Strengthening", "Functional training"],
        exercises: [
          "Stationary bike",
          "Step-ups",
          "Leg press",
          "Balance training",
          "Gait training",
        ],
        precautions: [
          "Progress resistance gradually",
          "Monitor for swelling",
          "Avoid high impact",
        ],
        dischargeCriteria: [
          "Full ROM",
          "Strength 80% contralateral",
          "Independent community ambulation",
        ],
      },
    ],
    evidenceLevel: 1,
    citation: "AAOS Clinical Practice Guideline: Total Knee Arthroplasty, 2021",
  },
  {
    procedure: "Total Hip Arthroplasty (THA)",
    phases: [
      {
        phase: 1,
        name: "Immediate Post-Op (Days 0-3)",
        timeframe: "Days 0-3",
        goals: ["Pain control", "Prevent dislocation", "Initiate mobility"],
        exercises: ["Ankle pumps", "Glute sets", "Quad sets", "Heel slides"],
        precautions: [
          "Hip precautions (no flexion >90°, no crossing legs, no internal rotation)",
          "Weight-bearing as tolerated",
          "Use raised toilet seat",
        ],
        dischargeCriteria: [
          "Pain controlled",
          "Ambulate 50 feet with assistive device",
          "Independent transfers",
        ],
      },
      {
        phase: 2,
        name: "Early Rehabilitation (Weeks 1-6)",
        timeframe: "Weeks 1-6",
        goals: ["Restore ROM", "Improve strength", "Gait training"],
        exercises: [
          "Hip abductions",
          "Hip extensions",
          "Mini squats",
          "Stationary bike",
          "Gait training",
        ],
        precautions: [
          "Continue hip precautions",
          "Weight-bearing as tolerated",
          "Monitor for dislocation",
        ],
        dischargeCriteria: [
          "Ambulate 100 feet",
          "Stair negotiation",
          "Independent ADLs",
        ],
      },
      {
        phase: 3,
        name: "Intermediate (Weeks 7-12+)",
        timeframe: "Weeks 7-12+",
        goals: ["Full strength", "Functional training", "Return to activities"],
        exercises: [
          "Leg press",
          "Step-ups",
          "Balance training",
          "Functional training",
        ],
        precautions: [
          "Progress resistance gradually",
          "Avoid high impact",
          "Monitor for complications",
        ],
        dischargeCriteria: [
          "Strength 80% contralateral",
          "Independent community ambulation",
          "Return to desired activities",
        ],
      },
    ],
    evidenceLevel: 1,
    citation: "AAOS Clinical Practice Guideline: Total Hip Arthroplasty, 2021",
  },
  {
    procedure: "ACL Reconstruction",
    phases: [
      {
        phase: 1,
        name: "Immediate Post-Op (Weeks 0-2)",
        timeframe: "Weeks 0-2",
        goals: ["Control pain/swelling", "Restore ROM", "Activate quadriceps"],
        exercises: [
          "Ankle pumps",
          "Quad sets",
          "Hamstring sets",
          "Heel slides",
          "Straight leg raises",
        ],
        precautions: [
          "Knee brace locked in extension",
          "Weight-bearing as tolerated",
          "Ice frequently",
        ],
        dischargeCriteria: ["Full extension", "90° flexion", "Quad activation"],
      },
      {
        phase: 2,
        name: "Early Rehabilitation (Weeks 3-6)",
        timeframe: "Weeks 3-6",
        goals: ["Restore full ROM", "Improve strength", "Gait normalization"],
        exercises: [
          "Quad sets",
          "Hamstring sets",
          "Mini squats",
          "Stationary bike",
          "Gait training",
        ],
        precautions: [
          "Continue brace as needed",
          "Avoid excessive flexion",
          "Monitor for swelling",
        ],
        dischargeCriteria: [
          "Full ROM",
          "Strength 50% contralateral",
          "Gait normal",
        ],
      },
      {
        phase: 3,
        name: "Intermediate (Weeks 7-12)",
        timeframe: "Weeks 7-12",
        goals: ["Strengthening", "Proprioception", "Functional training"],
        exercises: [
          "Leg press",
          "Step-ups",
          "Balance training",
          "Plyometrics (progressive)",
        ],
        precautions: [
          "Progress resistance gradually",
          "Monitor for pain",
          "Avoid high impact initially",
        ],
        dischargeCriteria: [
          "Strength 80% contralateral",
          "Proprioception normal",
          "Functional tests pass",
        ],
      },
    ],
    evidenceLevel: 1,
    citation: "AAOS Clinical Practice Guideline: ACL Reconstruction, 2021",
  },
  {
    procedure: "Hip Fracture Repair",
    phases: [
      {
        phase: 1,
        name: "Immediate Post-Op (Days 0-3)",
        timeframe: "Days 0-3",
        goals: ["Pain control", "Prevent complications", "Initiate mobility"],
        exercises: ["Ankle pumps", "Quad sets", "Heel slides"],
        precautions: [
          "Weight-bearing as tolerated or as ordered",
          "Monitor for DVT",
          "Pain management",
        ],
        dischargeCriteria: [
          "Pain controlled",
          "Ambulate with assistive device",
          "Independent transfers",
        ],
      },
      {
        phase: 2,
        name: "Early Rehabilitation (Weeks 1-6)",
        timeframe: "Weeks 1-6",
        goals: ["Restore mobility", "Improve strength", "Gait training"],
        exercises: [
          "Quad sets",
          "Hamstring sets",
          "Mini squats",
          "Gait training",
          "Balance training",
        ],
        precautions: [
          "Weight-bearing as tolerated",
          "Monitor for complications",
          "Progress gradually",
        ],
        dischargeCriteria: [
          "Ambulate 50 feet",
          "Independent transfers",
          "Stair negotiation",
        ],
      },
      {
        phase: 3,
        name: "Intermediate (Weeks 7-12+)",
        timeframe: "Weeks 7-12+",
        goals: [
          "Full strength",
          "Functional independence",
          "Return to community",
        ],
        exercises: [
          "Leg press",
          "Step-ups",
          "Balance training",
          "Functional training",
        ],
        precautions: [
          "Progress resistance gradually",
          "Monitor for fatigue",
          "Avoid high impact",
        ],
        dischargeCriteria: [
          "Independent community ambulation",
          "Independent ADLs",
          "Return to desired activities",
        ],
      },
    ],
    evidenceLevel: 1,
    citation: "AAOS Clinical Practice Guideline: Hip Fracture, 2021",
  },
];

export interface SurgicalPrecautions {
  procedure: string;
  precautions: string[];
  warningSigns: string[];
  activityRestrictions: string[];
}

export const surgicalPrecautions: SurgicalPrecautions[] = [
  {
    procedure: "Total Hip Arthroplasty",
    precautions: [
      "No hip flexion >90 degrees",
      "No crossing legs or ankles",
      "No internal rotation of affected leg",
      "Use elevated toilet seat",
      "Use high chair or armchair",
      "Sleep with pillow between legs",
    ],
    warningSigns: [
      "Sudden pain",
      "Inability to bear weight",
      "Significant swelling",
      "Redness or drainage",
      "Fever",
    ],
    activityRestrictions: [
      "No bending at hip",
      "No twisting at hip",
      "No lifting >5 lbs initially",
      "No driving until cleared",
    ],
  },
  {
    procedure: "Total Knee Arthroplasty",
    precautions: [
      "Keep incision clean and dry",
      "Monitor for signs of infection",
      "Follow weight-bearing instructions",
      "Continue brace as directed",
      "Elevate leg when resting",
    ],
    warningSigns: [
      "Fever >101°F",
      "Increased redness/swelling",
      "Drainage from incision",
      "Severe pain",
      "Calf pain or swelling",
    ],
    activityRestrictions: [
      "No kneeling initially",
      "No squatting initially",
      "No high impact activities",
      "Follow PT guidance",
    ],
  },
  {
    procedure: "ACL Reconstruction",
    precautions: [
      "Keep incision clean and dry",
      "Monitor for signs of infection",
      "Follow weight-bearing instructions",
      "Continue brace as directed",
      "Elevate leg when resting",
    ],
    warningSigns: [
      "Fever >101°F",
      "Increased redness/swelling",
      "Drainage from incision",
      "Severe pain",
      "Inability to extend knee",
    ],
    activityRestrictions: [
      "No sports initially",
      "No high impact activities",
      "Follow PT progression",
      "Avoid twisting motions",
    ],
  },
];

export interface DischargeCriteria {
  criteria: string;
  description: string;
  assessmentMethod: string;
}

export const dischargeCriteria: DischargeCriteria[] = [
  {
    criteria: "Pain Control",
    description: "Pain managed to acceptable level for home setting",
    assessmentMethod: "Patient self-report, medication review",
  },
  {
    criteria: "Mobility",
    description: "Safe ambulation with appropriate assistive device",
    assessmentMethod: "Timed Up & Go, gait assessment",
  },
  {
    criteria: "Transfers",
    description: "Independent or safe assistance for transfers",
    assessmentMethod: "Observation, functional assessment",
  },
  {
    criteria: "Stair Negotiation",
    description: "Safe stair negotiation for home discharge",
    assessmentMethod: "Stair test, observation",
  },
  {
    criteria: "ADL Independence",
    description: "Independent or safe assistance for basic ADLs",
    assessmentMethod: "Functional Independence Measure (FIM)",
  },
  {
    criteria: "Home Safety",
    description: "Home environment safe for discharge",
    assessmentMethod: "Home safety assessment",
  },
];

export interface PostOpComplication {
  complication: string;
  signsSymptoms: string[];
  prevention: string[];
  management: string[];
}

export const postOpComplications: PostOpComplication[] = [
  {
    complication: "Deep Vein Thrombosis (DVT)",
    signsSymptoms: [
      "Calf pain",
      "Swelling",
      "Redness",
      "Warmth",
      "Shortness of breath",
    ],
    prevention: [
      "Ankle pumps",
      "Compression stockings",
      "Early mobilization",
      "Anticoagulants as ordered",
    ],
    management: [
      "Immediate medical attention",
      "Ultrasound evaluation",
      "Anticoagulation therapy",
    ],
  },
  {
    complication: "Pulmonary Embolism (PE)",
    signsSymptoms: [
      "Sudden shortness of breath",
      "Chest pain",
      "Rapid heart rate",
      "Cough",
      "Lightheadedness",
    ],
    prevention: [
      "DVT prevention",
      "Early mobilization",
      "Incentive spirometry",
      "Hydration",
    ],
    management: [
      "Emergency medical attention",
      "Oxygen therapy",
      "Anticoagulation therapy",
    ],
  },
  {
    complication: "Infection",
    signsSymptoms: [
      "Fever",
      "Redness",
      "Swelling",
      "Warmth",
      "Drainage",
      "Increased pain",
    ],
    prevention: [
      "Wound care",
      "Hand hygiene",
      "Antibiotics as ordered",
      "Monitor for signs",
    ],
    management: ["Medical evaluation", "Wound culture", "Antibiotic therapy"],
  },
  {
    complication: "Joint Dislocation (Hip)",
    signsSymptoms: [
      "Severe pain",
      "Inability to move leg",
      "Leg deformity",
      "Shortening of leg",
    ],
    prevention: [
      "Follow hip precautions",
      "Proper transfer techniques",
      "Avoid high-risk movements",
    ],
    management: ["Emergency reduction", "Imaging evaluation", "Immobilization"],
  },
];

export interface PainManagement {
  technique: string;
  description: string;
  indications: string[];
  contraindications: string[];
  procedure: string[];
  frequency: string;
}

export const painManagementTechniques: PainManagement[] = [
  {
    technique: "Ice Therapy",
    description: "Reduces inflammation and pain",
    indications: ["Post-operative swelling", "Acute pain", "Inflammation"],
    contraindications: [
      "Cold sensitivity",
      "Raynaud's phenomenon",
      "Impaired sensation",
    ],
    procedure: [
      "Apply ice pack for 15-20 minutes",
      "Use cloth barrier",
      "Elevate affected limb",
    ],
    frequency: "Every 2-4 hours as needed",
  },
  {
    technique: "Elevation",
    description: "Reduces swelling and promotes venous return",
    indications: ["Post-operative swelling", "Edema", "Inflammation"],
    contraindications: [
      "Compromised circulation",
      "Severe pain with elevation",
    ],
    procedure: [
      "Elevate limb above heart level",
      "Support limb comfortably",
      "Monitor for numbness",
    ],
    frequency: "As needed, especially with swelling",
  },
  {
    technique: "Positioning",
    description: "Optimizes comfort and healing",
    indications: [
      "Post-operative recovery",
      "Pain management",
      "Swelling reduction",
    ],
    contraindications: ["Specific surgical restrictions"],
    procedure: [
      "Use pillows for support",
      "Maintain neutral alignment",
      "Change positions regularly",
    ],
    frequency: "As needed, with position changes every 2 hours",
  },
];

export interface RehabilitationProgression {
  phase: string;
  goals: string[];
  exercises: string[];
  frequency: string;
  progressionCriteria: string[];
}

export const rehabilitationProgression: RehabilitationProgression[] = [
  {
    phase: "Acute Phase",
    goals: ["Pain control", "Swelling reduction", "Prevent complications"],
    exercises: ["Ankle pumps", "Quad sets", "Heel slides", "Deep breathing"],
    frequency: "Multiple times daily",
    progressionCriteria: [
      "Pain controlled",
      "Swelling reduced",
      "No complications",
    ],
  },
  {
    phase: "Subacute Phase",
    goals: ["Restore ROM", "Improve strength", "Gait training"],
    exercises: [
      "ROM exercises",
      "Strengthening",
      "Gait training",
      "Balance training",
    ],
    frequency: "Daily PT, home exercise program",
    progressionCriteria: [
      "ROM restored",
      "Strength improved",
      "Gait normalized",
    ],
  },
  {
    phase: "Functional Phase",
    goals: ["Functional training", "Return to activities", "Prevent re-injury"],
    exercises: [
      "Functional training",
      "Plyometrics",
      "Sport-specific training",
    ],
    frequency: "3-5x/week",
    progressionCriteria: [
      "Functional tests pass",
      "Strength 80% contralateral",
      "Return to activities",
    ],
  },
];
