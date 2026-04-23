/**
 * PT Evidence-Based Guidelines - Musculoskeletal
 * APTA Clinical Practice Guidelines with evidence-based recommendations
 */

import { auditService } from "../core/audit/AuditService";

export interface PTGuideline {
  id: string;
  name: string;
  condition: string;
  description: string;
  recommendations: string[];
  contraindications: string[];
  precautions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const guidelines: PTGuideline[] = [
  {
    id: "gl-pt-001",
    name: "Acute Low Back Pain",
    condition: "Low Back Pain",
    description: "Evidence-based management of acute low back pain",
    recommendations: [
      "Early mobilization",
      "Patient education",
      "Manual therapy",
      "Exercise progression",
      "Activity modification",
    ],
    contraindications: ["Cauda equina syndrome", "Fracture", "Infection"],
    precautions: [
      "Monitor neurological status",
      "Assess red flags",
      "Gradual progression",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2017). Acute Low Back Pain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-002",
    name: "Chronic Low Back Pain",
    condition: "Low Back Pain",
    description: "Long-term management strategies for chronic low back pain",
    recommendations: [
      "Strengthening exercises",
      "Functional training",
      "Cognitive behavioral approach",
      "Psychosocial support",
    ],
    contraindications: [
      "Severe psychological distress",
      "Active substance abuse",
    ],
    precautions: [
      "Monitor pain levels",
      "Assess psychosocial factors",
      "Gradual progression",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2017). Chronic Low Back Pain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-003",
    name: "Neck Pain",
    condition: "Neck Pain",
    description: "Management of cervical spine pain and dysfunction",
    recommendations: [
      "Manual therapy",
      "Cervical stabilization",
      "Postural training",
      "Ergonomic modification",
    ],
    contraindications: [
      "Vertebral artery insufficiency",
      "Myelopathy",
      "Fracture",
    ],
    precautions: [
      "Assess vascular status",
      "Monitor neurological signs",
      "Careful mobilization",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2017). Neck Pain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-004",
    name: "Shoulder Pain",
    condition: "Shoulder Pain",
    description: "Management of rotator cuff and shoulder dysfunction",
    recommendations: [
      "Rotator cuff strengthening",
      "Scapular stabilization",
      "Manual therapy",
      "Functional training",
    ],
    contraindications: ["Severe rotator cuff tear", "Fracture", "Dislocation"],
    precautions: [
      "Monitor pain response",
      "Gradual loading",
      "Assess scapular mechanics",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2016). Shoulder Pain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-005",
    name: "Knee Osteoarthritis",
    condition: "Knee Osteoarthritis",
    description: "Management of knee OA with exercise and manual therapy",
    recommendations: [
      "Strengthening exercises",
      "Aerobic activity",
      "Manual therapy",
      "Weight management",
    ],
    contraindications: ["Severe joint destruction", "Acute inflammation"],
    precautions: [
      "Monitor pain levels",
      "Gradual progression",
      "Activity modification",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Knee Osteoarthritis Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-006",
    name: "Hip Osteoarthritis",
    condition: "Hip Osteoarthritis",
    description: "Management of hip OA with exercise and functional training",
    recommendations: [
      "Hip strengthening",
      "Functional training",
      "Manual therapy",
      "Activity modification",
    ],
    contraindications: ["Severe joint destruction", "Acute inflammation"],
    precautions: ["Monitor pain levels", "Gradual progression", "Assess gait"],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Hip Osteoarthritis Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-007",
    name: "Plantar Fasciitis / Heel Pain",
    condition: "Heel Pain",
    description: "Management of plantar fasciitis and related heel dysfunction",
    recommendations: [
      "Manual therapy",
      "Stretching (Gastrocnemius/Plantar Fascia)",
      "Taping",
      "Orthoses",
      "Night splints",
    ],
    contraindications: ["Ruptured plantar fascia", "Acute calcaneal fracture"],
    precautions: [
      "Avoid over-stretching in acute phase",
      "Assess footwear",
      "Monitor training load",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2014). Heel Pain—Plantar Fasciitis Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-008",
    name: "Ankle Sprain (Lateral)",
    condition: "Ankle Sprain",
    description:
      "Acute and chronic management of lateral ankle ligamentous sprains",
    recommendations: [
      "Early weight-bearing with support",
      "Manual therapy (lymphatic drainage, mobilization)",
      "Therapeutic exercise",
      "Neuromuscular training",
    ],
    contraindications: [
      "Unstable fracture (Ottawa Ankle Rules +)",
      "Talar shift",
    ],
    precautions: [
      "Monitor for chronic instability",
      "Gradual return to sport",
      "Assess proprioception",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2013). Lateral Ankle Sprain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-009",
    name: "Adhesive Capsulitis",
    condition: "Frozen Shoulder",
    description:
      "Management of shoulder pain and mobility deficits (Frozen Shoulder)",
    recommendations: [
      "Corticosteroid injections (in coordination with MD)",
      "Patient education on natural history",
      "Stretching (intensity based on irritability)",
      "Joint mobilization",
    ],
    contraindications: ["Joint infection", "Malignancy in shoulder region"],
    precautions: [
      "Highly irritable phase requires low intensity",
      "Monitor for complex regional pain syndrome",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2013). Shoulder Pain and Mobility Deficits: Adhesive Capsulitis.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-pt-010",
    name: "Patellofemoral Pain Syndrome",
    condition: "Knee Pain",
    description:
      "Evidence-based management of anterior knee pain and patellofemoral dysfunction",
    recommendations: [
      "Hip and knee strengthening",
      "Patellar taping",
      "Foot orthoses (if over-pronated)",
      "Running gait retraining",
    ],
    contraindications: [
      "Acute patellar dislocation",
      "Patellar tendon rupture",
    ],
    precautions: [
      "Avoid excessive loaded deep squats in early phase",
      "Assess kinetic chain (hip/ankle)",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2019). Patellofemoral Pain Clinical Practice Guideline.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getPTGuidelineById(id: string): PTGuideline | undefined {
  try {
    if (!id || typeof id !== "string") return undefined;
    return guidelines.find((g) => g.id === id);
  } catch (error) {
    auditService.logError("GET_PT_GL_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTGuidelines(): PTGuideline[] {
  try {
    return [...guidelines];
  } catch (error) {
    auditService.logError("GET_ALL_PT_GL_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGuidelinesByCondition(condition: string): PTGuideline[] {
  try {
    if (!condition) return [];
    return guidelines.filter((g) =>
      g.condition.toLowerCase().includes(condition.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_GL_BY_CONDITION_ERROR", {
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTGuidelines(query: string): PTGuideline[] {
  try {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return guidelines.filter(
      (g) =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.condition.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_GL_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGuidelinesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTGuideline[] {
  try {
    return guidelines.filter((g) => g.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_GL_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGuidelineConditions(): string[] {
  try {
    return Array.from(new Set(guidelines.map((g) => g.condition))).sort();
  } catch (error) {
    auditService.logError("GET_PT_GL_CONDITIONS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
