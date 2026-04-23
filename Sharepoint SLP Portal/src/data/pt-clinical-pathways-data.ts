/**
 * PT Clinical Pathways Data
 * Sources: APTA CPGs, CMS, JOSPT, Cochrane Reviews, AHA/ASA Stroke Guidelines
 */

export interface Intervention {
  name: string;
  cptCode: string;
  frequency: string;
  duration: string;
  evidenceLevel: number;
}

export interface PathwayPhase {
  phase: number;
  name: string;
  timeframe: string;
  goals: string[];
  interventions: Intervention[];
  progressionCriteria: string[];
  outcomeMeasures: string[];
}

export interface RedFlag {
  flag: string;
  urgency: "immediate" | "urgent" | "monitor";
  action: string;
}

export interface ClinicalPathway {
  id: string;
  name: string;
  description: string;
  category: "post-surgical" | "musculoskeletal" | "neurological" | "geriatric";
  icdCode: string;
  evidenceSource: string;
  phases: PathwayPhase[];
  redFlags: RedFlag[];
}

// PT Clinical Pathways Data
export const ptClinicalPathways: ClinicalPathway[] = [
  {
    id: "post-tka",
    name: "Total Knee Arthroplasty",
    description: "Clinical pathway for post-operative TKA rehabilitation",
    category: "post-surgical",
    icdCode: "Z96.651",
    evidenceSource: "APTA CPG, JOSPT",
    phases: [
      {
        phase: 1,
        name: "Immediate Post-Op (0-6 weeks)",
        timeframe: "0-6 weeks",
        goals: ["Reduce swelling", "Restore ROM", "Restore strength"],
        interventions: [
          {
            name: "ROM exercises",
            cptCode: "97110",
            frequency: "Daily",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "Daily",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Gait training",
            cptCode: "97116",
            frequency: "Daily",
            duration: "20 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Knee flexion 0-90°",
          "Quad strength 3/5",
          "Independent ambulation",
        ],
        outcomeMeasures: ["LEFS", "ROM", "Strength"],
      },
      {
        phase: 2,
        name: "Early Mobilization (6-12 weeks)",
        timeframe: "6-12 weeks",
        goals: ["Improve ROM", "Improve strength", "Improve function"],
        interventions: [
          {
            name: "Advanced ROM",
            cptCode: "97110",
            frequency: "3x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "3x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "ROM 0-110 degrees",
          "Quad strength 4/5",
          "Ambulation without device",
          "Stairs with rail",
        ],
        outcomeMeasures: ["LEFS", "ROM", "Strength", "TUG"],
      },
      {
        phase: 3,
        name: "Late Mobilization (12+ weeks)",
        timeframe: "12+ weeks",
        goals: [
          "Return to function",
          "Return to activity",
          "Prevent complications",
        ],
        interventions: [
          {
            name: "Advanced strengthening",
            cptCode: "97110",
            frequency: "2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Community ambulation",
            cptCode: "97116",
            frequency: "2x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "ROM 0-120 degrees",
          "Quad strength 5/5",
          "Stairs without rail",
          "LEFS score >60",
          "TUG <12 seconds",
        ],
        outcomeMeasures: [
          "LEFS",
          "ROM",
          "Strength",
          "TUG",
          "Return to activity",
        ],
      },
    ],
    redFlags: [
      {
        flag: "DVT signs (calf swelling, warmth, pain)",
        urgency: "immediate",
        action: "Refer to physician immediately",
      },
      {
        flag: "Infection signs (fever, increased swelling, drainage)",
        urgency: "immediate",
        action: "Refer to physician immediately",
      },
      {
        flag: "Excessive swelling",
        urgency: "urgent",
        action: "Modify treatment, elevate, ice",
      },
    ],
  },
  {
    id: "low-back-pain",
    name: "Low Back Pain",
    description: "Clinical pathway for mechanical low back pain",
    category: "musculoskeletal",
    icdCode: "M54.5",
    evidenceSource: "APTA CPG, Cochrane",
    phases: [
      {
        phase: 1,
        name: "Acute Phase (0-2 weeks)",
        timeframe: "0-2 weeks",
        goals: ["Reduce pain", "Restore mobility", "Patient education"],
        interventions: [
          {
            name: "Manual therapy",
            cptCode: "97140",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Therapeutic exercise",
            cptCode: "97110",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Patient education",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "15 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain reduced 50%",
          "Improved mobility",
          "Compliance with HEP",
        ],
        outcomeMeasures: ["VAS", "ODI", "ROM"],
      },
      {
        phase: 2,
        name: "Subacute Phase (2-6 weeks)",
        timeframe: "2-6 weeks",
        goals: [
          "Continue pain reduction",
          "Improve strength",
          "Improve function",
        ],
        interventions: [
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "2x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Ergonomic training",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "15 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain minimal",
          "Strength 4/5",
          "ODI <20%",
          "Return to work",
        ],
        outcomeMeasures: ["VAS", "ODI", "Strength", "Functional capacity"],
      },
      {
        phase: 3,
        name: "Chronic Phase (6+ weeks)",
        timeframe: "6+ weeks",
        goals: ["Prevent recurrence", "Return to activity", "Self-management"],
        interventions: [
          {
            name: "Advanced strengthening",
            cptCode: "97110",
            frequency: "1-2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "1-2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Self-management training",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "20 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain resolved",
          "Strength 5/5",
          "Return to activity",
        ],
        outcomeMeasures: ["VAS", "ODI", "Strength", "Return to activity"],
      },
    ],
    redFlags: [
      {
        flag: "Cauda equina syndrome (bilateral leg pain, bowel/bladder dysfunction)",
        urgency: "immediate",
        action: "Refer to emergency department immediately",
      },
      {
        flag: "Fracture signs (trauma, osteoporosis, age >70)",
        urgency: "urgent",
        action: "Refer for imaging",
      },
      {
        flag: "Infection signs (fever, night sweats, weight loss)",
        urgency: "urgent",
        action: "Refer to physician",
      },
    ],
  },
  {
    id: "stroke-rehab",
    name: "Stroke Rehabilitation",
    description: "Clinical pathway for post-stroke rehabilitation",
    category: "neurological",
    icdCode: "I63.9",
    evidenceSource: "AHA/ASA Guidelines, APTA CPG",
    phases: [
      {
        phase: 1,
        name: "Acute Phase (0-3 months)",
        timeframe: "0-3 months",
        goals: [
          "Prevent complications",
          "Restore mobility",
          "Improve function",
        ],
        interventions: [
          {
            name: "Bed mobility training",
            cptCode: "97110",
            frequency: "Daily",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Transfer training",
            cptCode: "97116",
            frequency: "Daily",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Task-specific training",
            cptCode: "97116",
            frequency: "Daily",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Sitting balance",
          "Standing balance",
          "Ambulation with assist",
        ],
        outcomeMeasures: ["FMA", "NIHSS", "Functional independence"],
      },
      {
        phase: 2,
        name: "Subacute Phase (3-6 months)",
        timeframe: "3-6 months",
        goals: ["Improve strength", "Improve coordination", "Improve function"],
        interventions: [
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "3-5x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "CIMT (Constraint-Induced Movement Therapy)",
            cptCode: "97110",
            frequency: "3-5x/week",
            duration: "60 min",
            evidenceLevel: 5,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "3-5x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Strength 3/5",
          "Coordination improving",
          "BBS ≥45",
          "Independent ambulation",
        ],
        outcomeMeasures: [
          "FMA",
          "Strength",
          "Coordination",
          "Gait speed",
          "BBS",
        ],
      },
      {
        phase: 3,
        name: "Chronic Phase (6+ months)",
        timeframe: "6+ months",
        goals: ["Return to activity", "Prevent recurrence", "Self-management"],
        interventions: [
          {
            name: "Advanced strengthening",
            cptCode: "97110",
            frequency: "2-3x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Community ambulation",
            cptCode: "97116",
            frequency: "2-3x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Fall prevention training",
            cptCode: "97116",
            frequency: "1x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Strength 4-5/5",
          "Community ambulation",
          "Return to activity",
        ],
        outcomeMeasures: [
          "FMA",
          "Strength",
          "Gait speed",
          "Return to activity",
        ],
      },
    ],
    redFlags: [
      {
        flag: "Stroke recurrence symptoms",
        urgency: "immediate",
        action: "Call 911 immediately",
      },
      { flag: "Severe headache", urgency: "immediate", action: "Refer to ED" },
      { flag: "Seizure activity", urgency: "immediate", action: "Refer to ED" },
    ],
  },
  {
    id: "shoulder-impingement",
    name: "Shoulder Impingement Syndrome",
    description: "Clinical pathway for shoulder impingement syndrome",
    category: "musculoskeletal",
    icdCode: "M75.4",
    evidenceSource: "APTA CPG, JOSPT",
    phases: [
      {
        phase: 1,
        name: "Acute Phase (0-2 weeks)",
        timeframe: "0-2 weeks",
        goals: ["Reduce pain", "Restore mobility", "Patient education"],
        interventions: [
          {
            name: "Manual therapy",
            cptCode: "97140",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Therapeutic exercise",
            cptCode: "97110",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Patient education",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "15 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain reduced 50%",
          "Improved ROM",
          "Compliance with HEP",
        ],
        outcomeMeasures: ["VAS", "SPADI", "ROM"],
      },
      {
        phase: 2,
        name: "Subacute Phase (2-6 weeks)",
        timeframe: "2-6 weeks",
        goals: [
          "Continue pain reduction",
          "Improve strength",
          "Improve function",
        ],
        interventions: [
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "2-3x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Ergonomic training",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "15 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain minimal",
          "Strength 4/5",
          "Return to activity",
        ],
        outcomeMeasures: ["VAS", "SPADI", "Strength", "Functional capacity"],
      },
      {
        phase: 3,
        name: "Chronic Phase (6+ weeks)",
        timeframe: "6+ weeks",
        goals: ["Prevent recurrence", "Return to activity", "Self-management"],
        interventions: [
          {
            name: "Advanced strengthening",
            cptCode: "97110",
            frequency: "1-2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Functional training",
            cptCode: "97116",
            frequency: "1-2x/week",
            duration: "45 min",
            evidenceLevel: 3,
          },
          {
            name: "Self-management training",
            cptCode: "98960",
            frequency: "1x/week",
            duration: "20 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Pain resolved",
          "Strength 5/5",
          "Return to activity",
        ],
        outcomeMeasures: ["VAS", "SPADI", "Strength", "Return to activity"],
      },
    ],
    redFlags: [
      {
        flag: "Severe pain with minimal movement",
        urgency: "urgent",
        action: "Refer for imaging",
      },
      {
        flag: "Signs of rotator cuff tear",
        urgency: "urgent",
        action: "Refer for imaging",
      },
      {
        flag: "Neurological symptoms",
        urgency: "urgent",
        action: "Refer to physician",
      },
    ],
  },
  {
    id: "fall-prevention-snf",
    name: "Fall Prevention (SNF)",
    description:
      "Clinical pathway for fall prevention in skilled nursing facility",
    category: "geriatric",
    icdCode: "R29.6",
    evidenceSource: "CDC, APTA CPG, Cochrane",
    phases: [
      {
        phase: 1,
        name: "Assessment Phase (0-1 week)",
        timeframe: "0-1 week",
        goals: [
          "Identify fall risk",
          "Assess balance and mobility",
          "Establish baseline",
        ],
        interventions: [
          {
            name: "Fall risk assessment",
            cptCode: "97161",
            frequency: "1x",
            duration: "60 min",
            evidenceLevel: 3,
          },
          {
            name: "Balance assessment (BBS)",
            cptCode: "97161",
            frequency: "1x",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Gait assessment (TUG)",
            cptCode: "97161",
            frequency: "1x",
            duration: "15 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "Assessment complete",
          "Risk level identified",
          "Baseline established",
        ],
        outcomeMeasures: ["TUG", "BBS", "Fall risk score"],
      },
      {
        phase: 2,
        name: "Intervention Phase (1-4 weeks)",
        timeframe: "1-4 weeks",
        goals: ["Improve balance", "Improve strength", "Reduce fall risk"],
        interventions: [
          {
            name: "Balance training",
            cptCode: "97110",
            frequency: "3-5x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Otago exercises",
            cptCode: "97110",
            frequency: "3-5x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Strengthening",
            cptCode: "97110",
            frequency: "3-5x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "BBS improved 4+ points",
          "TUG improved",
          "Confidence improved",
        ],
        outcomeMeasures: ["TUG", "BBS", "Strength", "Confidence"],
      },
      {
        phase: 3,
        name: "Maintenance Phase (4+ weeks)",
        timeframe: "4+ weeks",
        goals: ["Maintain gains", "Prevent falls", "Community reintegration"],
        interventions: [
          {
            name: "Home exercise program",
            cptCode: "97110",
            frequency: "5-7x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
          {
            name: "Environmental modification",
            cptCode: "97161",
            frequency: "1x/week",
            duration: "20 min",
            evidenceLevel: 3,
          },
          {
            name: "Community ambulation",
            cptCode: "97116",
            frequency: "2-3x/week",
            duration: "30 min",
            evidenceLevel: 3,
          },
        ],
        progressionCriteria: [
          "BBS >45",
          "TUG <12 seconds",
          "No falls",
          "Independent with HEP",
        ],
        outcomeMeasures: ["TUG", "BBS", "Fall rate", "Functional independence"],
      },
    ],
    redFlags: [
      {
        flag: "TUG >30s",
        urgency: "urgent",
        action: "Increase supervision and intervention",
      },
      {
        flag: "BBS <21",
        urgency: "urgent",
        action: "High fall risk - increase supervision",
      },
      {
        flag: "Fall during assessment",
        urgency: "urgent",
        action: "Modify environment and increase supervision",
      },
    ],
  },
];

// Helper functions
export function getPathwayById(id: string): ClinicalPathway | undefined {
  return ptClinicalPathways.find((p) => p.id === id);
}

export function getPathwaysByCategory(category: string): ClinicalPathway[] {
  return ptClinicalPathways.filter((p) => p.category === category);
}

export function getImmediateRedFlags(pathway: ClinicalPathway): RedFlag[] {
  return pathway.redFlags.filter((f) => f.urgency === "immediate");
}
