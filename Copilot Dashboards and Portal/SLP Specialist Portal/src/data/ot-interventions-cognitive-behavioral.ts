/**
 * OT Interventions: Cognitive & Behavioral Strategies
 *
 * Evidence-based cognitive and psychosocial/behavioral interventions.
 * Source: AOTA Guidelines, CBT, DBT, and Toglia dynamic interactional model.
 */

import { auditService } from "../core/audit/AuditService";

export interface OTIntervention {
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

const cognitiveBehavioralInterventions: OTIntervention[] = [
  {
    id: "ot-icb-001",
    name: "Cognitive-Behavioral Therapy (CBT) Integration in OT",
    category: "behavioral",
    description:
      "Using CBT principles (identifying and challenging cognitive distortions) to improve occupational engagement and self-efficacy.",
    indications: [
      "Chronic pain (FABQ/Kinesiophobia)",
      "Depression",
      "Anxiety",
      "Substance use recovery",
      "PTSD",
    ],
    contraindications: [
      "Severe psychosis (active hallucinations/delusions)",
      "Severe cognitive impairment preventing abstract thought",
    ],
    precautions: [
      "Must stay within OT scope of practice (occupational focus, not deep psychotherapy)",
      "Suicidal ideation (requires immediate psychiatric referral)",
    ],
    parameters: [
      "Identify the trigger -> thought -> feeling -> behavior cycle",
      'Cognitive Restructuring: Replace "I can\'t do this" with "I am learning a new way to do this"',
      "Behavioral Activation: Scheduling valued activities to improve mood",
      "Provide homework (e.g., activity diary, thought record)",
    ],
    evidenceLevel: 1,
    source: "Beck Institute / AOTA",
    citation: "Beck AT. Cognitive Therapy of Depression.",
  },
  {
    id: "ot-icb-002",
    name: "Metacognitive Strategy Training (CO-OP)",
    category: "cognitive",
    description:
      "Cognitive Orientation to daily Occupational Performance (CO-OP): A client-centered approach teaching problem-solving to acquire motor/cognitive skills.",
    indications: [
      "Developmental Coordination Disorder (DCD)",
      "Stroke (mild/moderate)",
      "TBI (mild/moderate)",
      "ASD",
    ],
    contraindications: [
      "Severe aphasia precluding verbal problem-solving",
      "Severe memory deficit (cannot recall the strategy)",
    ],
    precautions: [
      "Requires high motivation and self-awareness from the client",
      "Therapist must strictly avoid giving the solution (guided discovery)",
    ],
    parameters: [
      "Global Strategy: Goal - Plan - Do - Check",
      "Client selects 3 occupational goals",
      "Therapist uses guided discovery (asking questions rather than giving answers)",
      'Domain-specific strategies (e.g., "body position", "task specification") are developed by the client',
    ],
    evidenceLevel: 1,
    source: "Polatajko",
    citation:
      "Polatajko HJ, Mandich A. Enabling Occupation in Children: The Cognitive Orientation to daily Occupational Performance (CO-OP) Approach.",
  },
  {
    id: "ot-icb-003",
    name: "Motivation Interviewing (MI)",
    category: "behavioral",
    description:
      "A collaborative, goal-oriented style of communication aimed at eliciting a person's own internal motivation to change.",
    indications: [
      "Medication non-adherence",
      "Refusal to participate in therapy",
      "Weight management/lifestyle changes",
      "Substance abuse",
    ],
    contraindications: [
      "Acute crises requiring immediate directive action (e.g., medical emergency, acute suicidality)",
    ],
    precautions: [
      'Avoid the "righting reflex" (the urge to tell the client what to do)',
      "Requires active listening and empathy",
    ],
    parameters: [
      "OARS: Open-ended questions, Affirmations, Reflective listening, Summarizing",
      "Assess readiness to change (Transtheoretical Model: Precontemplation -> Action)",
      "Roll with resistance",
      "Develop discrepancy between current behavior and core values",
    ],
    evidenceLevel: 1,
    source: "Miller & Rollnick",
    citation:
      "Miller WR, Rollnick S. Motivational Interviewing: Helping People Change.",
  },
  {
    id: "ot-icb-004",
    name: "Dialectical Behavior Therapy (DBT) Skills Training",
    category: "behavioral",
    description:
      "Teaching skills for emotional regulation, distress tolerance, mindfulness, and interpersonal effectiveness.",
    indications: [
      "Borderline Personality Disorder (BPD)",
      "Severe emotional dysregulation",
      "Self-harm behaviors",
      "Eating disorders",
    ],
    contraindications: ["Active psychosis", "Severe cognitive impairment"],
    precautions: [
      "Group dynamics in skills training groups",
      "Emotional flooding during distress tolerance exercises",
    ],
    parameters: [
      "Mindfulness: Observing and describing the present moment without judgment (Wise Mind)",
      "Emotion Regulation: Identifying emotions and decreasing vulnerability (PLEASE skills)",
      "Distress Tolerance: Surviving crises without making things worse (TIPP skills: Temp, Intense exercise, Paced breathing, Paired muscle relax)",
      "Interpersonal Effectiveness: DEAR MAN skills for assertive communication",
    ],
    evidenceLevel: 1,
    source: "Linehan / AOTA",
    citation: "Linehan MM. DBT Skills Training Manual.",
  },
  {
    id: "ot-icb-005",
    name: "Remedial Cognitive Rehabilitation (Brain Training)",
    category: "cognitive",
    description:
      "Bottom-up approach using repeated exercises to restore specific cognitive capacities like working memory or sustained attention.",
    indications: [
      "Mild TBI / Concussion",
      "Early stage MS",
      "Chemo-brain",
      "Age-related cognitive decline",
    ],
    contraindications: [
      "Severe, widespread anoxic brain injury (where compensatory is preferred)",
      "Advanced Dementia (Stage 6-7)",
    ],
    precautions: [
      "Fatigue (cognitive fatigue impacts all other participation)",
      'Ensure the tasks are "just right" challenge to prevent frustration',
    ],
    parameters: [
      "Graded attention tasks (Sustained -> Selective -> Alternating -> Divided)",
      "Computerized cognitive training programs (e.g., Lumosity, APT)",
      "Memory exercises (spaced retrieval, chaining)",
      "MUST be paired with generalization activities to ensure impact on daily life",
    ],
    evidenceLevel: 2,
    source: "Sohlberg & Mateer",
    citation:
      "Sohlberg MM, Mateer CA. Cognitive Rehabilitation: An Integrative Neuropsychological Approach.",
  },
];

export const getAllOTCognitiveBehavioralInterventions =
  (): OTIntervention[] => {
    auditService.log({
      action: "read",
      resourceType: "interventions",
      discipline: "ot",
      metadata: {
        count: cognitiveBehavioralInterventions.length,
        category: "cognitive_behavioral",
      },
    });
    return cognitiveBehavioralInterventions;
  };

export const getOTCognitiveBehavioralInterventionsByCategory = (
  category: string,
): OTIntervention[] => {
  return cognitiveBehavioralInterventions.filter(
    (i) => i.category === category,
  );
};

export const getOTCognitiveBehavioralInterventionById = (
  id: string,
): OTIntervention | undefined => {
  return cognitiveBehavioralInterventions.find((i) => i.id === id);
};

export const searchOTCognitiveBehavioralInterventions = (
  query: string,
): OTIntervention[] => {
  const q = query.toLowerCase();
  return cognitiveBehavioralInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
