/**
 * PT Interventions: Exercise Progressions
 *
 * Evidence-based therapeutic exercise paradigms for strengthening, balance, and endurance.
 * Source: ACSM, Kisner & Colby, APTA guidelines
 */

import { auditService } from "../core/audit/AuditService";

export interface PTIntervention {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  parameters: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
}

const exerciseInterventions: PTIntervention[] = [
  {
    id: "pt-iex-001",
    name: "Resistance Training (Hypertrophy / Strength)",
    category: "strengthening",
    description:
      "Progressive overload applied via external resistance (weights, bands) to increase muscle cross-sectional area and maximal force generation.",
    indications: [
      "Muscle weakness (<4/5 MMT)",
      "Disuse atrophy",
      "Osteoporosis/Osteopenia",
      "Sarcopenia",
    ],
    contraindications: [
      "Acute inflammation in target joint",
      "Severe cardiovascular disease (unstable)",
      "Unhealed fracture",
    ],
    precautions: [
      "Valsalva maneuver (educate on breathing)",
      "DOMS (expected but monitor)",
      "Improper form leading to substitution",
    ],
    parameters: [
      "Strength: 2-6 reps, >85% 1-RM, 2-5 min rest, 2-6 sets",
      "Hypertrophy: 6-12 reps, 67-85% 1-RM, 30-90s rest, 3-6 sets",
      "Endurance: >12 reps, <67% 1-RM, <30s rest, 2-3 sets",
      "Progression: Increase load by 2-10% when current load feels easy",
    ],
    evidenceLevel: 1,
    source: "ACSM",
    citation:
      "American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription.",
  },
  {
    id: "pt-iex-002",
    name: "Eccentric Muscle Training",
    category: "strengthening",
    description:
      "Muscle lengthening under tension. Generates high force with lower metabolic cost. Crucial for deceleration and tendinopathy rehab.",
    indications: [
      "Tendinopathy (e.g., Achilles, Patellar - Alfredson Protocol)",
      "Muscle strain recovery (late phase)",
      "High fall risk (deceleration deficits)",
    ],
    contraindications: [
      "Acute severe pain",
      "Acute muscle tear (Grade III)",
      "Joint instability",
    ],
    precautions: [
      "High likelihood of DOMS (educate patient)",
      "Overtraining (requires longer recovery)",
    ],
    parameters: [
      "Alfredson (Achilles): 3 sets of 15 reps (straight & bent knee), 2x/day, 12 weeks",
      "Pain monitoring: Mild-moderate pain (up to 5/10) during exercise is acceptable",
      "Progression: Increase speed then load (e.g., add backpack weights)",
    ],
    evidenceLevel: 1,
    source: "Alfredson / APTA",
    citation:
      "Alfredson H, et al. Heavy-load eccentric calf muscle training for the treatment of chronic Achilles tendinosis.",
  },
  {
    id: "pt-iex-003",
    name: "Sensorimotor / Balance Progression (Static to Dynamic)",
    category: "balance-proprioception",
    description:
      "Systematic manipulation of sensory inputs (visual, somatosensory, vestibular) and motor demands to improve postural stability.",
    indications: [
      "Fall risk (>14s TUG, <45/56 BBS)",
      "Ankle sprain recovery",
      "Neuropathy",
      "Vestibular disorders",
    ],
    contraindications: [
      "Severe, uncompensated dizziness during standing",
      "Inability to stand independently (without mechanical support)",
    ],
    precautions: [
      "Always guard patient (gait belt)",
      "Position in a corner or near parallel bars",
      "Clear area of hazards",
    ],
    parameters: [
      "Base of Support (BoS): Wide -> Narrow -> Tandem -> Single Leg",
      "Surface: Firm -> Foam -> Wobble Board/BOSU",
      "Vision: Open -> Closed -> Moving surround (Optokinetic)",
      "Perturbations: Expected -> Unexpected",
    ],
    evidenceLevel: 1,
    source: "Shumway-Cook",
    citation:
      "Shumway-Cook A, Woollacott MH. Motor Control: Translating Research into Clinical Practice.",
  },
  {
    id: "pt-iex-004",
    name: "Aerobic Endurance Training (Continuous & Interval)",
    category: "endurance",
    description:
      "Exercises engaging large muscle groups for prolonged periods to improve cardiovascular and respiratory efficiency.",
    indications: [
      "Deconditioning",
      "Post-MI/CABG (Phase II+ rehab)",
      "COPD",
      "Obesity",
      "Diabetes management",
    ],
    contraindications: [
      "Unstable angina",
      "Resting SBP >200 or DBP >110",
      "Orthostatic BP drop >20 mmHg with symptoms",
      "Uncontrolled arrhythmias",
    ],
    precautions: [
      "Beta-blockers (blunts HR response, use RPE instead)",
      "Exercise-induced asthma",
      "Hypoglycemia risk in diabetics",
    ],
    parameters: [
      "Frequency: 3-5 days/week",
      "Intensity: Moderate (40-59% HRR, RPE 12-13) to Vigorous (60-89% HRR, RPE 14-17)",
      "Time: 20-60 minutes continuous or accumulated in 10-min bouts",
      "Type: Rhythmic, continuous (walking, cycling, swimming, ergometry)",
    ],
    evidenceLevel: 1,
    source: "ACSM",
    citation: "ACSM Guidelines for Exercise Testing and Prescription.",
  },
  {
    id: "pt-iex-005",
    name: "Plyometric Training (Stretch-Shortening Cycle)",
    category: "power-agility",
    description:
      "High-velocity exercises involving a rapid eccentric stretch followed immediately by a rapid concentric contraction (power development).",
    indications: [
      "Return to sport testing",
      "Late-phase ACL rehab",
      "Agility/Power deficits in athletes",
    ],
    contraindications: [
      "Acute inflammation",
      "Pain during weight-bearing",
      "Joint instability",
      "Post-operative tissue healing limits (<12 weeks typical)",
    ],
    precautions: [
      "Requires baseline strength (e.g., squat 1.5x BW, or good single leg press)",
      "Monitor landing mechanics (valgus collapse)",
      "Fatigue rapidly degrades form",
    ],
    parameters: [
      'Volume is measured in "foot contacts" (e.g., 80-100 per session is moderate)',
      "Progression: Bilateral in-place -> Bilateral moving -> Unilateral in-place -> Unilateral moving -> Depth jumps",
      "Rest: 48-72 hours between plyometric sessions",
    ],
    evidenceLevel: 2,
    source: "NSCA / Kisner",
    citation:
      "Kisner C, Colby LA. Therapeutic Exercise: Foundations and Techniques.",
  },
];

export const getAllPTExerciseInterventions = (): PTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "pt",
    metadata: {
      count: exerciseInterventions.length,
      category: "exercise_progressions",
    },
  });
  return exerciseInterventions;
};

export const getPTExerciseInterventionsByCategory = (
  category: string,
): PTIntervention[] => {
  return exerciseInterventions.filter((i) => i.category === category);
};

export const getPTExerciseInterventionById = (
  id: string,
): PTIntervention | undefined => {
  return exerciseInterventions.find((i) => i.id === id);
};

export const searchPTExerciseInterventions = (
  query: string,
): PTIntervention[] => {
  const q = query.toLowerCase();
  return exerciseInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
