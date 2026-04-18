/**
 * Orthopedic Rehabilitation Clinical Content
 *
 * Comprehensive orthopedic PT data including:
 * - Joint-specific treatment protocols
 * - Assessment tools (DASH, LEFS, ODI, NDI, PSFS)
 * - Treatment protocols with contraindications
 * - APTA Orthopedic Section CPG citations
 *
 * Requirements: 1.2, 1.3, 1.5, 6.1
 *
 * Evidence Sources:
 * - APTA Orthopedic Section Clinical Practice Guidelines
 * - Journal of Orthopaedic & Sports Physical Therapy (JOSPT)
 * - Cochrane Reviews for musculoskeletal interventions
 */

import type { BodyRegion } from "../types/pt-assessment";

// ============================================================================
// Assessment Tools with Scoring and Interpretation
// ============================================================================

export interface AssessmentTool {
  name: string;
  acronym: string;
  bodyRegion: BodyRegion[];
  description: string;
  scoringRange: {
    min: number;
    max: number;
  };
  mcid: number; // Minimal Clinically Important Difference
  interpretation: (score: number) => string;
  evidenceLevel: 3 | 4 | 5; // APTA evidence rating
  citation: string;
}

export const assessmentTools: AssessmentTool[] = [
  {
    name: "Disabilities of the Arm, Shoulder and Hand",
    acronym: "DASH",
    bodyRegion: ["shoulder", "elbow", "wrist", "hand"],
    description:
      "Self-report questionnaire measuring upper extremity disability and symptoms",
    scoringRange: { min: 0, max: 100 },
    mcid: 10,
    interpretation: (score: number) => {
      if (score <= 20) return "Minimal disability";
      if (score <= 40) return "Mild disability";
      if (score <= 60) return "Moderate disability";
      return "Severe disability";
    },
    evidenceLevel: 5,
    citation:
      "Hudak PL, et al. Development of an upper extremity outcome measure: the DASH. Am J Ind Med. 1996;29(6):602-8.",
  },
  {
    name: "Lower Extremity Functional Scale",
    acronym: "LEFS",
    bodyRegion: ["hip", "knee", "ankle", "foot"],
    description: "Self-report questionnaire measuring lower extremity function",
    scoringRange: { min: 0, max: 80 },
    mcid: 9,
    interpretation: (score: number) => {
      if (score >= 60) return "Minimal functional limitation";
      if (score >= 40) return "Moderate functional limitation";
      return "Severe functional limitation";
    },
    evidenceLevel: 5,
    citation:
      "Binkley JM, et al. The Lower Extremity Functional Scale (LEFS): scale development, measurement properties, and clinical application. Phys Ther. 1999;79(4):371-83.",
  },
  {
    name: "Oswestry Disability Index",
    acronym: "ODI",
    bodyRegion: ["lumbar-spine"],
    description:
      "Self-report questionnaire measuring low back pain-related disability",
    scoringRange: { min: 0, max: 100 },
    mcid: 10,
    interpretation: (score: number) => {
      if (score <= 20) return "Minimal disability";
      if (score <= 40) return "Moderate disability";
      if (score <= 60) return "Severe disability";
      if (score <= 80) return "Crippled";
      return "Bed-bound or exaggerating";
    },
    evidenceLevel: 5,
    citation:
      "Fairbank JC, Pynsent PB. The Oswestry Disability Index. Spine. 2000;25(22):2940-52.",
  },
  {
    name: "Neck Disability Index",
    acronym: "NDI",
    bodyRegion: ["cervical-spine"],
    description:
      "Self-report questionnaire measuring neck pain-related disability",
    scoringRange: { min: 0, max: 100 },
    mcid: 7,
    interpretation: (score: number) => {
      if (score <= 8) return "No disability";
      if (score <= 18) return "Mild disability";
      if (score <= 34) return "Moderate disability";
      if (score <= 50) return "Severe disability";
      return "Complete disability";
    },
    evidenceLevel: 5,
    citation:
      "Vernon H, Mior S. The Neck Disability Index: a study of reliability and validity. J Manipulative Physiol Ther. 1991;14(7):409-15.",
  },
  {
    name: "Patient-Specific Functional Scale",
    acronym: "PSFS",
    bodyRegion: [
      "shoulder",
      "elbow",
      "wrist",
      "hand",
      "hip",
      "knee",
      "ankle",
      "foot",
      "cervical-spine",
      "thoracic-spine",
      "lumbar-spine",
    ],
    description:
      "Self-report measure where patients identify and rate activities they have difficulty performing",
    scoringRange: { min: 0, max: 10 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 8) return "Minimal functional limitation";
      if (score >= 5) return "Moderate functional limitation";
      return "Severe functional limitation";
    },
    evidenceLevel: 4,
    citation:
      "Stratford P, et al. Assessing disability and change on individual patients: a report of a patient specific measure. Physiother Can. 1995;47:258-63.",
  },
];

// ============================================================================
// Joint-Specific Treatment Protocols
// ============================================================================

export interface TreatmentProtocol {
  joint: BodyRegion;
  condition: string;
  icdCode?: string;
  phase: "acute" | "subacute" | "chronic";
  interventions: Intervention[];
  contraindications: string[];
  precautions: string[];
  expectedOutcomes: string;
  timeframe: string;
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface Intervention {
  name: string;
  category:
    | "therapeutic-exercise"
    | "manual-therapy"
    | "modalities"
    | "neuromuscular-reeducation"
    | "gait-training";
  cptCode: string;
  dosage: string;
  frequency: string;
  rationale: string;
}

export const treatmentProtocols: TreatmentProtocol[] = [
  // Shoulder Protocols
  {
    joint: "shoulder",
    condition: "Rotator Cuff Tendinopathy",
    icdCode: "M75.1",
    phase: "acute",
    interventions: [
      {
        name: "Pendulum exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10 repetitions, 3 sets",
        frequency: "Daily",
        rationale:
          "Gentle ROM to maintain mobility without aggravating inflammation",
      },
      {
        name: "Scapular stabilization exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2-3 sets",
        frequency: "3x/week",
        rationale: "Improve scapulohumeral rhythm and reduce impingement",
      },
      {
        name: "Soft tissue mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 minutes per muscle group",
        frequency: "2-3x/week",
        rationale: "Reduce muscle tension and improve tissue extensibility",
      },
    ],
    contraindications: [
      "Complete rotator cuff tear requiring surgical repair",
      "Acute fracture",
      "Severe osteoporosis",
      "Active infection",
    ],
    precautions: [
      "Avoid overhead activities during acute phase",
      "Monitor for increased pain or swelling",
      "Avoid aggressive stretching in acute phase",
    ],
    expectedOutcomes:
      "Reduced pain, improved ROM to 140° flexion, improved function for ADLs",
    timeframe: "4-6 weeks",
    evidenceLevel: 4,
    citation:
      "APTA Shoulder Pain CPG. J Orthop Sports Phys Ther. 2013;43(5):A1-A31.",
  },
  {
    joint: "shoulder",
    condition: "Adhesive Capsulitis (Frozen Shoulder)",
    icdCode: "M75.0",
    phase: "subacute",
    interventions: [
      {
        name: "Joint mobilization (Grade III-IV)",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "3-5 minutes per direction",
        frequency: "2-3x/week",
        rationale: "Restore capsular mobility and reduce adhesions",
      },
      {
        name: "Progressive ROM exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "Daily",
        rationale: "Gradually restore functional ROM",
      },
      {
        name: "Stretching (sleeper stretch, cross-body stretch)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "30 seconds hold, 3 repetitions",
        frequency: "Daily",
        rationale: "Improve posterior capsule and rotator cuff flexibility",
      },
    ],
    contraindications: [
      "Acute fracture",
      "Severe osteoporosis",
      "Recent surgery (<6 weeks)",
    ],
    precautions: [
      "Avoid aggressive mobilization in acute inflammatory phase",
      "Monitor for excessive pain during treatment",
      "Progress ROM gradually to avoid re-inflammation",
    ],
    expectedOutcomes:
      "Improved ROM to 120° flexion, 90° abduction, reduced pain with movement",
    timeframe: "12-18 months (natural history), 6-12 weeks with PT",
    evidenceLevel: 4,
    citation:
      "Kelley MJ, et al. Shoulder Pain and Mobility Deficits: Adhesive Capsulitis. J Orthop Sports Phys Ther. 2013;43(5):A1-A31.",
  },
  // Knee Protocols
  {
    joint: "knee",
    condition: "Patellofemoral Pain Syndrome",
    icdCode: "M25.56",
    phase: "subacute",
    interventions: [
      {
        name: "Hip strengthening (abduction, external rotation)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Improve hip control to reduce abnormal patellar tracking",
      },
      {
        name: "Quadriceps strengthening (VMO emphasis)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Improve patellar stability and tracking",
      },
      {
        name: "Patellar mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "2-3 minutes per direction",
        frequency: "2-3x/week",
        rationale: "Improve patellar mobility and reduce pain",
      },
      {
        name: "Neuromuscular re-education (balance, proprioception)",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Improve dynamic knee control and reduce injury risk",
      },
    ],
    contraindications: [
      "Acute patellar dislocation",
      "Patellar fracture",
      "Acute ligament injury",
      "Septic arthritis",
    ],
    precautions: [
      "Avoid deep squatting in acute phase",
      "Monitor for patellar crepitus and swelling",
      "Avoid high-impact activities until pain-free",
    ],
    expectedOutcomes:
      "Reduced anterior knee pain, improved function for stairs and squatting, return to activity",
    timeframe: "6-12 weeks",
    evidenceLevel: 5,
    citation:
      "Willy RW, et al. Patellofemoral Pain. J Orthop Sports Phys Ther. 2019;49(9):CPG1-CPG95.",
  },
  {
    joint: "knee",
    condition: "Post-Total Knee Arthroplasty",
    icdCode: "Z96.65",
    phase: "subacute",
    interventions: [
      {
        name: "Progressive ROM exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3-4 sets",
        frequency: "Daily",
        rationale: "Achieve functional ROM (0-110° minimum for ADLs)",
      },
      {
        name: "Quadriceps strengthening",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Restore strength for functional mobility",
      },
      {
        name: "Gait training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "15-20 minutes",
        frequency: "3x/week",
        rationale:
          "Normalize gait pattern and reduce assistive device dependence",
      },
      {
        name: "Balance training",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce fall risk and improve functional mobility",
      },
    ],
    contraindications: [
      "Active infection",
      "Prosthetic loosening",
      "Acute DVT",
      "Uncontrolled pain",
    ],
    precautions: [
      "Follow surgeon weight-bearing restrictions",
      "Monitor for signs of infection (fever, increased swelling, redness)",
      "Avoid excessive force during ROM exercises",
      "Monitor for DVT signs (calf pain, swelling, warmth)",
    ],
    expectedOutcomes: "ROM 0-110°, independent ambulation, return to ADLs",
    timeframe: "6-12 weeks post-op",
    evidenceLevel: 4,
    citation:
      "APTA Post-TKA Rehabilitation Guidelines. J Orthop Sports Phys Ther. 2017;47(11):A1-A37.",
  },
  // Lumbar Spine Protocols
  {
    joint: "lumbar-spine",
    condition: "Non-Specific Low Back Pain",
    icdCode: "M54.5",
    phase: "subacute",
    interventions: [
      {
        name: "Core stabilization exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2-3 sets",
        frequency: "3x/week",
        rationale: "Improve spinal stability and reduce pain recurrence",
      },
      {
        name: "Lumbar mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 minutes",
        frequency: "2-3x/week",
        rationale: "Improve segmental mobility and reduce pain",
      },
      {
        name: "Flexibility exercises (hamstrings, hip flexors)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "30 seconds hold, 3 repetitions",
        frequency: "Daily",
        rationale: "Reduce biomechanical stress on lumbar spine",
      },
      {
        name: "Neuromuscular re-education (postural training)",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Improve movement patterns and reduce pain triggers",
      },
    ],
    contraindications: [
      "Cauda equina syndrome",
      "Spinal fracture",
      "Spinal infection",
      "Severe osteoporosis",
      "Progressive neurological deficit",
    ],
    precautions: [
      "Red flags: saddle anesthesia, bowel/bladder dysfunction, progressive weakness",
      "Avoid flexion-based exercises if disc herniation suspected",
      "Monitor for radicular symptoms",
    ],
    expectedOutcomes:
      "Reduced pain intensity (≥30% reduction), improved function, return to work",
    timeframe: "4-8 weeks",
    evidenceLevel: 5,
    citation:
      "Delitto A, et al. Low Back Pain. J Orthop Sports Phys Ther. 2012;42(4):A1-A57.",
  },
  {
    joint: "lumbar-spine",
    condition: "Lumbar Radiculopathy",
    icdCode: "M54.16",
    phase: "acute",
    interventions: [
      {
        name: "Mechanical diagnosis and therapy (McKenzie)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10 repetitions, hourly",
        frequency: "Daily",
        rationale: "Centralize symptoms and reduce nerve root irritation",
      },
      {
        name: "Neural mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 repetitions",
        frequency: "2-3x/week",
        rationale: "Improve nerve mobility and reduce radicular symptoms",
      },
      {
        name: "Traction (mechanical or manual)",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce disc pressure and nerve root compression",
      },
    ],
    contraindications: [
      "Cauda equina syndrome",
      "Progressive motor weakness",
      "Spinal instability",
      "Severe osteoporosis",
      "Pregnancy (for traction)",
    ],
    precautions: [
      "Monitor for symptom peripheralization",
      "Avoid exercises that increase leg pain",
      "Red flags: progressive weakness, saddle anesthesia, bowel/bladder changes",
    ],
    expectedOutcomes:
      "Centralization of symptoms, reduced radicular pain, improved function",
    timeframe: "6-12 weeks",
    evidenceLevel: 4,
    citation:
      "Delitto A, et al. Low Back Pain. J Orthop Sports Phys Ther. 2012;42(4):A1-A57.",
  },
  // Hip Protocols
  {
    joint: "hip",
    condition: "Hip Osteoarthritis",
    icdCode: "M16.1",
    phase: "chronic",
    interventions: [
      {
        name: "Hip strengthening (abductors, extensors)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Improve joint stability and reduce pain",
      },
      {
        name: "ROM exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 2 sets",
        frequency: "Daily",
        rationale: "Maintain functional mobility",
      },
      {
        name: "Gait training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "15-20 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce compensatory patterns and improve efficiency",
      },
      {
        name: "Manual therapy (joint mobilization)",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 minutes",
        frequency: "2x/week",
        rationale: "Improve hip mobility and reduce pain",
      },
    ],
    contraindications: [
      "Acute fracture",
      "Severe osteoporosis",
      "Active infection",
      "Avascular necrosis (advanced)",
    ],
    precautions: [
      "Avoid high-impact activities",
      "Monitor for increased pain or swelling",
      "Consider assistive device if antalgic gait present",
    ],
    expectedOutcomes:
      "Reduced pain, improved function for ADLs, delayed need for surgery",
    timeframe: "8-12 weeks",
    evidenceLevel: 5,
    citation:
      "Cibulka MT, et al. Hip Pain and Mobility Deficits—Hip Osteoarthritis. J Orthop Sports Phys Ther. 2017;47(6):A1-A37.",
  },
  {
    joint: "hip",
    condition: "Post-Total Hip Arthroplasty",
    icdCode: "Z96.64",
    phase: "subacute",
    interventions: [
      {
        name: "Progressive strengthening (hip abductors, extensors)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Restore strength for functional mobility",
      },
      {
        name: "Gait training",
        category: "gait-training",
        cptCode: "97116",
        dosage: "15-20 minutes",
        frequency: "3x/week",
        rationale: "Normalize gait pattern and reduce assistive device",
      },
      {
        name: "ROM exercises (within precautions)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10 repetitions, 3 sets",
        frequency: "Daily",
        rationale: "Maintain functional ROM while respecting precautions",
      },
      {
        name: "Balance training",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce fall risk and improve confidence",
      },
    ],
    contraindications: [
      "Active infection",
      "Prosthetic dislocation",
      "Uncontrolled pain",
      "DVT",
    ],
    precautions: [
      "Posterior approach: Avoid hip flexion >90°, adduction past midline, internal rotation",
      "Anterior approach: Avoid hip extension, external rotation, adduction",
      "Follow surgeon-specific precautions (typically 6-12 weeks)",
      "Monitor for dislocation signs (sudden pain, leg length discrepancy, rotation)",
    ],
    expectedOutcomes:
      "Independent ambulation, return to ADLs, ROM within functional limits",
    timeframe: "6-12 weeks post-op",
    evidenceLevel: 4,
    citation:
      "APTA Post-THA Rehabilitation Guidelines. J Orthop Sports Phys Ther. 2016;46(11):A1-A35.",
  },
  // Ankle Protocols
  {
    joint: "ankle",
    condition: "Lateral Ankle Sprain",
    icdCode: "S93.4",
    phase: "subacute",
    interventions: [
      {
        name: "Progressive strengthening (peroneal, gastrocnemius)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Restore dynamic ankle stability",
      },
      {
        name: "Balance and proprioception training",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "3x/week",
        rationale: "Reduce re-injury risk and improve functional stability",
      },
      {
        name: "ROM exercises (dorsiflexion, plantarflexion)",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "Daily",
        rationale: "Restore full ankle mobility",
      },
      {
        name: "Joint mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "3-5 minutes",
        frequency: "2-3x/week",
        rationale: "Improve talocrural and subtalar mobility",
      },
    ],
    contraindications: [
      "Acute fracture",
      "Complete ligament rupture requiring surgery",
      "Severe instability",
      "DVT",
    ],
    precautions: [
      "Avoid inversion stress in acute phase",
      "Use ankle brace or taping during activity",
      "Progress weight-bearing as tolerated",
    ],
    expectedOutcomes:
      "Full ROM, return to sport/activity, reduced re-injury risk",
    timeframe: "4-8 weeks",
    evidenceLevel: 5,
    citation:
      "Martin RL, et al. Ankle Stability and Movement Coordination Impairments: Ankle Ligament Sprains. J Orthop Sports Phys Ther. 2013;43(9):A1-A40.",
  },
  // Cervical Spine Protocols
  {
    joint: "cervical-spine",
    condition: "Cervical Radiculopathy",
    icdCode: "M54.12",
    phase: "acute",
    interventions: [
      {
        name: "Cervical traction",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce nerve root compression and radicular symptoms",
      },
      {
        name: "Neural mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 repetitions",
        frequency: "2-3x/week",
        rationale: "Improve nerve mobility and reduce symptoms",
      },
      {
        name: "Deep neck flexor strengthening",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Improve cervical stability and posture",
      },
      {
        name: "Postural training",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce mechanical stress on cervical spine",
      },
    ],
    contraindications: [
      "Cervical myelopathy",
      "Spinal cord compression",
      "Vertebral artery insufficiency",
      "Acute fracture",
      "Severe osteoporosis",
    ],
    precautions: [
      "Red flags: progressive weakness, gait disturbance, bowel/bladder dysfunction",
      "Avoid exercises that peripheralize symptoms",
      "Monitor for dizziness or visual disturbances",
    ],
    expectedOutcomes:
      "Reduced radicular pain, improved ROM, return to function",
    timeframe: "6-12 weeks",
    evidenceLevel: 4,
    citation:
      "Blanpied PR, et al. Neck Pain. J Orthop Sports Phys Ther. 2017;47(7):A1-A83.",
  },
  // Elbow/Wrist Protocols
  {
    joint: "elbow",
    condition: "Lateral Epicondylalgia (Tennis Elbow)",
    icdCode: "M77.1",
    phase: "subacute",
    interventions: [
      {
        name: "Eccentric wrist extensor strengthening",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Promote tendon healing and improve load tolerance",
      },
      {
        name: "Forearm stretching",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "30 seconds hold, 3 repetitions",
        frequency: "Daily",
        rationale: "Improve flexibility and reduce tendon stress",
      },
      {
        name: "Soft tissue mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce muscle tension and improve tissue quality",
      },
      {
        name: "Activity modification education",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "10-15 minutes",
        frequency: "1-2x/week",
        rationale: "Reduce aggravating activities and promote healing",
      },
    ],
    contraindications: [
      "Acute fracture",
      "Elbow instability",
      "Active infection",
    ],
    precautions: [
      "Avoid painful gripping activities",
      "Use counterforce brace during activity",
      "Progress loading gradually",
    ],
    expectedOutcomes:
      "Reduced pain with gripping, improved function, return to activity",
    timeframe: "6-12 weeks",
    evidenceLevel: 4,
    citation:
      "Coombes BK, et al. Elbow Pain. J Orthop Sports Phys Ther. 2015;45(11):A1-A34.",
  },
  {
    joint: "wrist",
    condition: "Carpal Tunnel Syndrome",
    icdCode: "G56.0",
    phase: "subacute",
    interventions: [
      {
        name: "Median nerve gliding exercises",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10 repetitions, 3 sets",
        frequency: "Daily",
        rationale: "Improve nerve mobility and reduce symptoms",
      },
      {
        name: "Wrist and hand strengthening",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "10-15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Improve functional strength and endurance",
      },
      {
        name: "Ergonomic education",
        category: "neuromuscular-reeducation",
        cptCode: "97112",
        dosage: "15-20 minutes",
        frequency: "1-2x/week",
        rationale: "Reduce repetitive stress and prevent symptom recurrence",
      },
    ],
    contraindications: [
      "Severe nerve compression requiring surgery",
      "Thenar atrophy",
      "Progressive weakness",
      "Acute fracture",
    ],
    precautions: [
      "Night splinting recommended",
      "Avoid repetitive wrist flexion/extension",
      "Monitor for progressive symptoms",
    ],
    expectedOutcomes:
      "Reduced paresthesias, improved grip strength, return to work",
    timeframe: "6-12 weeks",
    evidenceLevel: 4,
    citation:
      "APTA Carpal Tunnel Syndrome Guidelines. J Orthop Sports Phys Ther. 2019;49(5):CPG1-CPG85.",
  },
  // Elbow/Wrist Protocols
  {
    joint: "elbow",
    condition: "Lateral Epicondylalgia (Tennis Elbow)",
    icdCode: "M77.1",
    phase: "subacute",
    interventions: [
      {
        name: "Eccentric wrist extensor strengthening",
        category: "therapeutic-exercise",
        cptCode: "97110",
        dosage: "15 repetitions, 3 sets",
        frequency: "3x/week",
        rationale: "Promote tendon healing and improve load tolerance",
      },
      {
        name: "Soft tissue mobilization",
        category: "manual-therapy",
        cptCode: "97140",
        dosage: "5-10 minutes",
        frequency: "2-3x/week",
        rationale: "Reduce muscle tension and improve tissue quality",
      },
    ],
    contraindications: [
      "Acute fracture",
      "Elbow instability",
      "Active infection",
    ],
    precautions: [
      "Avoid painful gripping",
      "Use counterforce brace",
      "Progress loading gradually",
    ],
    expectedOutcomes: "Reduced pain with gripping, improved function",
    timeframe: "6-12 weeks",
    evidenceLevel: 4,
    citation:
      "Coombes BK, et al. Elbow Pain. J Orthop Sports Phys Ther. 2015;45(11):A1-A34.",
  },
];

// ============================================================================
// Special Tests Library
// ============================================================================

export interface SpecialTest {
  name: string;
  joint: BodyRegion;
  purpose: string;
  procedure: string;
  positiveTest: string;
  sensitivity: number; // 0-1
  specificity: number; // 0-1
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export const specialTests: SpecialTest[] = [
  {
    name: "Neer's Impingement Test",
    joint: "shoulder",
    purpose: "Detect subacromial impingement",
    procedure: "Passively flex shoulder to end range while stabilizing scapula",
    positiveTest: "Pain with forced flexion",
    sensitivity: 0.79,
    specificity: 0.53,
    evidenceLevel: 4,
    citation:
      "Hegedus EJ, et al. Physical examination tests of the shoulder: a systematic review. Br J Sports Med. 2008;42(2):80-92.",
  },
  {
    name: "Hawkins-Kennedy Test",
    joint: "shoulder",
    purpose: "Detect subacromial impingement",
    procedure: "Shoulder at 90° flexion, passively internally rotate",
    positiveTest: "Pain with internal rotation",
    sensitivity: 0.79,
    specificity: 0.59,
    evidenceLevel: 4,
    citation:
      "Hegedus EJ, et al. Physical examination tests of the shoulder: a systematic review. Br J Sports Med. 2008;42(2):80-92.",
  },
  {
    name: "Empty Can Test (Jobe Test)",
    joint: "shoulder",
    purpose: "Assess supraspinatus integrity",
    procedure:
      "Shoulder at 90° abduction, 30° horizontal adduction, thumbs down, resist abduction",
    positiveTest: "Pain or weakness with resistance",
    sensitivity: 0.63,
    specificity: 0.65,
    evidenceLevel: 4,
    citation:
      "Hegedus EJ, et al. Physical examination tests of the shoulder: a systematic review. Br J Sports Med. 2008;42(2):80-92.",
  },
  {
    name: "Lachman Test",
    joint: "knee",
    purpose: "Assess ACL integrity",
    procedure:
      "Knee at 20-30° flexion, stabilize femur, anteriorly translate tibia",
    positiveTest: "Excessive anterior translation, soft end-feel",
    sensitivity: 0.85,
    specificity: 0.94,
    evidenceLevel: 5,
    citation:
      "Solomon DH, et al. The rational clinical examination. Does this patient have a torn meniscus or ligament of the knee? JAMA. 2001;286(13):1610-20.",
  },
  {
    name: "Anterior Drawer Test",
    joint: "knee",
    purpose: "Assess ACL integrity",
    procedure:
      "Knee at 90° flexion, stabilize foot, anteriorly translate tibia",
    positiveTest: "Excessive anterior translation",
    sensitivity: 0.62,
    specificity: 0.67,
    evidenceLevel: 4,
    citation:
      "Solomon DH, et al. The rational clinical examination. Does this patient have a torn meniscus or ligament of the knee? JAMA. 2001;286(13):1610-20.",
  },
  {
    name: "McMurray Test",
    joint: "knee",
    purpose: "Detect meniscal tear",
    procedure:
      "Knee fully flexed, externally rotate tibia and extend knee (medial meniscus), internally rotate and extend (lateral meniscus)",
    positiveTest: "Palpable click or pop with pain",
    sensitivity: 0.61,
    specificity: 0.84,
    evidenceLevel: 4,
    citation:
      "Solomon DH, et al. The rational clinical examination. Does this patient have a torn meniscus or ligament of the knee? JAMA. 2001;286(13):1610-20.",
  },
  {
    name: "Straight Leg Raise (SLR)",
    joint: "lumbar-spine",
    purpose: "Detect lumbar nerve root irritation",
    procedure: "Patient supine, passively flex hip with knee extended",
    positiveTest: "Radicular pain below knee at <70° hip flexion",
    sensitivity: 0.91,
    specificity: 0.26,
    evidenceLevel: 4,
    citation:
      "Devillé WL, et al. The test of Lasègue: systematic review of the accuracy in diagnosing herniated discs. Spine. 2000;25(9):1140-7.",
  },
  {
    name: "Spurling Test",
    joint: "cervical-spine",
    purpose: "Detect cervical radiculopathy",
    procedure:
      "Extend and laterally flex neck to affected side, apply axial compression",
    positiveTest: "Radicular pain into arm",
    sensitivity: 0.5,
    specificity: 0.93,
    evidenceLevel: 4,
    citation:
      "Rubinstein SM, et al. A systematic review on the effectiveness of complementary and alternative medicine for chronic non-specific low-back pain. Eur Spine J. 2010;19(8):1213-28.",
  },
];

// ============================================================================
// CPT Code Reference
// ============================================================================

export interface CPTCode {
  code: string;
  description: string;
  category: string;
  typicalDuration: string;
  medicareReimbursement?: string; // Approximate, varies by region
}

export const cptCodes: CPTCode[] = [
  {
    code: "97110",
    description: "Therapeutic Exercise",
    category: "Therapeutic Procedures",
    typicalDuration: "15 minutes",
    medicareReimbursement: "$30-35",
  },
  {
    code: "97112",
    description: "Neuromuscular Re-education",
    category: "Therapeutic Procedures",
    typicalDuration: "15 minutes",
    medicareReimbursement: "$30-35",
  },
  {
    code: "97116",
    description: "Gait Training",
    category: "Therapeutic Procedures",
    typicalDuration: "15 minutes",
    medicareReimbursement: "$28-32",
  },
  {
    code: "97140",
    description: "Manual Therapy",
    category: "Therapeutic Procedures",
    typicalDuration: "15 minutes",
    medicareReimbursement: "$30-35",
  },
  {
    code: "97161",
    description: "PT Evaluation - Low Complexity",
    category: "Evaluation",
    typicalDuration: "30 minutes",
    medicareReimbursement: "$65-75",
  },
  {
    code: "97162",
    description: "PT Evaluation - Moderate Complexity",
    category: "Evaluation",
    typicalDuration: "45 minutes",
    medicareReimbursement: "$95-110",
  },
  {
    code: "97163",
    description: "PT Evaluation - High Complexity",
    category: "Evaluation",
    typicalDuration: "60 minutes",
    medicareReimbursement: "$130-150",
  },
  {
    code: "97164",
    description: "PT Re-evaluation",
    category: "Evaluation",
    typicalDuration: "20 minutes",
    medicareReimbursement: "$45-55",
  },
];

// ============================================================================
// Evidence-Based Resources
// ============================================================================

export interface ClinicalResource {
  title: string;
  organization: string;
  url: string;
  description: string;
  evidenceLevel: 3 | 4 | 5;
}

export const clinicalResources: ClinicalResource[] = [
  {
    title: "APTA Clinical Practice Guidelines",
    organization: "American Physical Therapy Association",
    url: "https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs",
    description: "Evidence-based clinical practice guidelines for PT",
    evidenceLevel: 5,
  },
  {
    title: "Journal of Orthopaedic & Sports Physical Therapy (JOSPT)",
    organization: "APTA Orthopaedic Section",
    url: "https://www.jospt.org",
    description: "Peer-reviewed journal with orthopedic PT research",
    evidenceLevel: 5,
  },
  {
    title: "Cochrane Musculoskeletal Reviews",
    organization: "Cochrane Collaboration",
    url: "https://musculoskeletal.cochrane.org",
    description: "Systematic reviews of musculoskeletal interventions",
    evidenceLevel: 5,
  },
  {
    title: "PEDro Database",
    organization: "Centre for Evidence-Based Physiotherapy",
    url: "https://pedro.org.au",
    description: "Database of randomized trials and systematic reviews in PT",
    evidenceLevel: 4,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getAssessmentToolByAcronym(
  acronym: string,
): AssessmentTool | undefined {
  return assessmentTools.find((tool) => tool.acronym === acronym);
}

export function getProtocolsByJoint(joint: BodyRegion): TreatmentProtocol[] {
  return treatmentProtocols.filter((protocol) => protocol.joint === joint);
}

export function getSpecialTestsByJoint(joint: BodyRegion): SpecialTest[] {
  return specialTests.filter((test) => test.joint === joint);
}

export function interpretOutcomeMeasure(
  acronym: string,
  score: number,
): string {
  const tool = getAssessmentToolByAcronym(acronym);
  return tool ? tool.interpretation(score) : "Unknown assessment tool";
}
