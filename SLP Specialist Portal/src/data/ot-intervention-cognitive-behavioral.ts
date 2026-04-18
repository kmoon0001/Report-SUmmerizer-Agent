/**
 * OT Intervention Strategies - Cognitive & Behavioral Strategies
 */

import { auditService } from "../core/audit/AuditService";

export interface OTCognitiveBehavioralStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  components: string[];
  indications: string[];
  contraindications: string[];
  implementationApproaches: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const strategies: OTCognitiveBehavioralStrategy[] = [
  {
    id: "strat-ot-cb-001",
    name: "Cognitive Retraining",
    category: "Cognitive & Behavioral Strategies",
    description: "Structured training to improve cognitive functions",
    components: [
      "Memory training",
      "Attention training",
      "Executive function training",
      "Problem-solving training",
      "Processing speed training",
    ],
    indications: [
      "Cognitive impairment",
      "Memory deficit",
      "Attention deficit",
      "Executive dysfunction",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Computerized training",
      "Paper-based training",
      "Real-world practice",
      "Errorless learning",
      "Spaced retrieval",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Cognitive Retraining Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-002",
    name: "Behavior Modification",
    category: "Cognitive & Behavioral Strategies",
    description: "Systematic approach to change maladaptive behaviors",
    components: [
      "Reinforcement",
      "Punishment",
      "Extinction",
      "Shaping",
      "Chaining",
    ],
    indications: [
      "Behavioral dysfunction",
      "Maladaptive behavior",
      "Behavioral challenge",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Positive reinforcement",
      "Negative reinforcement",
      "Token economy",
      "Contingency management",
      "Self-monitoring",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Behavior Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-003",
    name: "Coping Strategies Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training in adaptive coping strategies",
    components: [
      "Problem-focused coping",
      "Emotion-focused coping",
      "Stress management",
      "Relaxation techniques",
      "Mindfulness",
    ],
    indications: ["Stress", "Anxiety", "Depression", "Coping difficulty"],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Psychoeducation",
      "Skill training",
      "Practice",
      "Feedback",
      "Generalization",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Coping Strategies Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-004",
    name: "Mindfulness-Based Intervention",
    category: "Cognitive & Behavioral Strategies",
    description: "Mindfulness practices to improve awareness and reduce stress",
    components: [
      "Meditation",
      "Breathing exercises",
      "Body awareness",
      "Present-moment focus",
      "Acceptance",
    ],
    indications: ["Stress", "Anxiety", "Pain", "Emotional dysregulation"],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Guided meditation",
      "Self-practice",
      "Group sessions",
      "Individual sessions",
      "Home practice",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Mindfulness-Based Intervention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-005",
    name: "Cognitive-Behavioral Therapy",
    category: "Cognitive & Behavioral Strategies",
    description:
      "Integrated approach addressing thoughts, feelings, and behaviors",
    components: [
      "Cognitive restructuring",
      "Behavioral activation",
      "Exposure therapy",
      "Problem-solving",
      "Skill training",
    ],
    indications: ["Depression", "Anxiety", "PTSD", "Behavioral dysfunction"],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Individual therapy",
      "Group therapy",
      "Homework assignments",
      "Skill practice",
      "Monitoring",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Cognitive-Behavioral Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-006",
    name: "Motivational Interviewing",
    category: "Cognitive & Behavioral Strategies",
    description: "Client-centered approach to enhance motivation for change",
    components: [
      "Open-ended questions",
      "Affirmations",
      "Reflective listening",
      "Summarization",
      "Eliciting change talk",
    ],
    indications: [
      "Low motivation",
      "Ambivalence",
      "Resistance to change",
      "Behavioral challenge",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Collaborative discussion",
      "Exploring ambivalence",
      "Strengthening commitment",
      "Planning change",
      "Follow-up",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Motivational Interviewing Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-007",
    name: "Social Skills Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training to improve social interaction and communication",
    components: [
      "Conversation skills",
      "Assertiveness",
      "Empathy",
      "Conflict resolution",
      "Relationship skills",
    ],
    indications: [
      "Social dysfunction",
      "Communication difficulty",
      "Relationship difficulty",
      "Social isolation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Role-playing",
      "Modeling",
      "Feedback",
      "Practice",
      "Generalization",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Social Skills Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-008",
    name: "Habit Formation Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training to establish positive habits and routines",
    components: [
      "Habit stacking",
      "Environmental cues",
      "Reward systems",
      "Consistency",
      "Monitoring",
    ],
    indications: [
      "Habit difficulty",
      "Routine establishment",
      "Behavioral change",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Goal setting",
      "Planning",
      "Implementation intentions",
      "Tracking",
      "Adjustment",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Habit Formation Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-009",
    name: "Acceptance and Commitment Therapy",
    category: "Cognitive & Behavioral Strategies",
    description: "Approach focusing on acceptance and values-based living",
    components: [
      "Acceptance",
      "Cognitive defusion",
      "Being present",
      "Self-as-context",
      "Values clarification",
    ],
    indications: [
      "Chronic pain",
      "Anxiety",
      "Depression",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Metaphors",
      "Experiential exercises",
      "Values work",
      "Committed action",
      "Monitoring",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Acceptance and Commitment Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-010",
    name: "Dialectical Behavior Therapy",
    category: "Cognitive & Behavioral Strategies",
    description: "Integrated approach combining CBT with acceptance strategies",
    components: [
      "Mindfulness",
      "Distress tolerance",
      "Emotion regulation",
      "Interpersonal effectiveness",
      "Validation",
    ],
    indications: [
      "Emotional dysregulation",
      "Self-harm",
      "Suicidal ideation",
      "Behavioral dysfunction",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Individual therapy",
      "Skills training",
      "Phone coaching",
      "Consultation team",
      "Homework",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Dialectical Behavior Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-011",
    name: "Positive Psychology Intervention",
    category: "Cognitive & Behavioral Strategies",
    description: "Approach focusing on strengths and well-being",
    components: [
      "Strengths identification",
      "Gratitude practice",
      "Meaning-making",
      "Resilience building",
      "Flourishing",
    ],
    indications: [
      "Low mood",
      "Low motivation",
      "Reduced well-being",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Strengths assessment",
      "Gratitude exercises",
      "Meaning exploration",
      "Goal setting",
      "Monitoring",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Positive Psychology Intervention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-012",
    name: "Exposure Therapy",
    category: "Cognitive & Behavioral Strategies",
    description: "Systematic exposure to feared stimuli to reduce anxiety",
    components: [
      "Graduated exposure",
      "Imaginal exposure",
      "In-vivo exposure",
      "Habituation",
      "Extinction",
    ],
    indications: ["Anxiety", "PTSD", "Phobia", "Avoidance behavior"],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Hierarchy development",
      "Relaxation training",
      "Exposure practice",
      "Monitoring",
      "Relapse prevention",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Exposure Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-013",
    name: "Problem-Solving Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training in systematic problem-solving approach",
    components: [
      "Problem definition",
      "Goal setting",
      "Solution generation",
      "Evaluation",
      "Implementation",
    ],
    indications: [
      "Problem-solving difficulty",
      "Executive dysfunction",
      "Functional limitation",
      "Decision-making difficulty",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Structured steps",
      "Practice problems",
      "Real-world application",
      "Feedback",
      "Generalization",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Problem-Solving Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-014",
    name: "Emotion Regulation Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training to improve emotional awareness and regulation",
    components: [
      "Emotion identification",
      "Emotion expression",
      "Coping strategies",
      "Tolerance building",
      "Regulation skills",
    ],
    indications: [
      "Emotional dysregulation",
      "Mood instability",
      "Emotional difficulty",
      "Behavioral challenge",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Psychoeducation",
      "Skill training",
      "Practice",
      "Feedback",
      "Generalization",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Emotion Regulation Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-cb-015",
    name: "Relapse Prevention Training",
    category: "Cognitive & Behavioral Strategies",
    description: "Training to prevent relapse and maintain gains",
    components: [
      "High-risk situation identification",
      "Coping strategy development",
      "Support system building",
      "Monitoring",
      "Action planning",
    ],
    indications: [
      "Addiction",
      "Behavioral relapse risk",
      "Maintenance difficulty",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationApproaches: [
      "Assessment",
      "Planning",
      "Skill training",
      "Support building",
      "Monitoring",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Relapse Prevention Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTCognitiveBehavioralStrategyById(
  id: string,
): OTCognitiveBehavioralStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CB_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_CB_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_CB_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTCognitiveBehavioralStrategies(): OTCognitiveBehavioralStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_CB_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCognitiveBehavioralStrategiesByCategory(
  category: string,
): OTCognitiveBehavioralStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_CB_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CB_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTCognitiveBehavioralStrategies(
  query: string,
): OTCognitiveBehavioralStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CB_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return strategies.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_CB_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCognitiveBehavioralStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTCognitiveBehavioralStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_CB_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_CB_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCognitiveBehavioralComponents(): string[] {
  try {
    const components = new Set<string>();
    strategies.forEach((s) => s.components.forEach((c) => components.add(c)));
    return Array.from(components).sort();
  } catch (error) {
    auditService.logError("GET_OT_CB_COMPONENTS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTCognitiveBehavioralApproach(
  strategyId: string,
  approach: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTCognitiveBehavioralStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!approach || typeof approach !== "string")
      return { valid: false, message: "Approach must be a string" };
    const hasApproach = strategy.implementationApproaches.some((a) =>
      a.toLowerCase().includes(approach.toLowerCase()),
    );
    return {
      valid: hasApproach,
      message: hasApproach ? "Approach found" : "Approach not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_CB_APPROACH_ERROR", {
      strategyId,
      approach,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
