/**
 * Clinical Evidence Registry
 *
 * Centralized evidence repository accessible to both PT and OT disciplines
 * Sources: APTA, AOTA, Cochrane, PubMed, Evidence-based standards
 * Requirements: Shared knowledge base, global accessibility
 */

import type { Discipline } from "../../types/discipline";

// ============================================================================
// Type Definitions
// ============================================================================

export type EvidenceLevel = 1 | 2 | 3 | 4 | 5;

export type EvidenceSource =
  | "apta-cpg"
  | "aota-guidelines"
  | "cochrane-review"
  | "pubmed"
  | "journal-article"
  | "clinical-practice"
  | "expert-consensus"
  | "cms-lcd"
  | "medicare-guidelines"
  | "other";

export interface ClinicalEvidence {
  id: string;
  title: string;
  discipline: Discipline | "shared";
  topic: string;
  subtopic?: string;
  description: string;
  evidenceLevel: EvidenceLevel;
  source: EvidenceSource;
  citation: string;
  url?: string;
  authors?: string[];
  publicationYear?: number;
  summary: string;
  keyFindings: string[];
  applicableTo: string[];
  contraindications?: string[];
  precautions?: string[];
  recommendations: string[];
  lastUpdated: Date;
  tags: string[];
}

// ============================================================================
// Evidence Registry
// ============================================================================

export const CLINICAL_EVIDENCE_REGISTRY: ClinicalEvidence[] = [
  // ========================================================================
  // SHARED EVIDENCE
  // ========================================================================

  {
    id: "shared-evidence-001",
    title: "Functional Independence Measure (FIM)",
    discipline: "shared",
    topic: "Outcome Measures",
    subtopic: "Functional Independence",
    description:
      "Standardized 18-item measure of functional independence in ADLs and IADLs",
    evidenceLevel: 1,
    source: "journal-article",
    citation: "Uniform Data System for Medical Rehabilitation (UDSMR)",
    url: "https://www.udsmr.org",
    summary:
      "FIM is a widely used standardized measure for assessing functional independence across multiple domains",
    keyFindings: [
      "Reliable and valid across multiple populations",
      "Sensitive to change over time",
      "Applicable to PT and OT",
      "Used in Medicare reporting",
    ],
    applicableTo: ["pt", "ot", "neurological", "geriatric", "post-surgical"],
    recommendations: [
      "Use FIM for comprehensive functional assessment",
      "Track FIM scores over time to measure progress",
      "Use FIM for discharge planning",
      "Report FIM scores for quality measures",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: [
      "outcome-measure",
      "functional-independence",
      "shared",
      "standardized",
    ],
  },

  {
    id: "shared-evidence-002",
    title: "Patient Safety: Red Flags and Referral Criteria",
    discipline: "shared",
    topic: "Safety",
    subtopic: "Red Flags",
    description:
      "Comprehensive guide to identifying red flags requiring immediate referral",
    evidenceLevel: 2,
    source: "clinical-practice",
    citation: "APTA and AOTA Clinical Practice Standards",
    summary:
      "Red flags are clinical indicators that require immediate referral to appropriate healthcare providers",
    keyFindings: [
      "Cardiovascular red flags require immediate referral",
      "Neurological red flags require urgent evaluation",
      "Systemic red flags may indicate serious pathology",
      "Therapists must recognize and act on red flags",
    ],
    applicableTo: ["pt", "ot", "all-conditions"],
    contraindications: [],
    precautions: [
      "Do not delay referral if red flags present",
      "Document red flags and referral actions",
      "Communicate with referring physician",
    ],
    recommendations: [
      "Screen for red flags at every evaluation",
      "Educate patients on red flags",
      "Have referral protocols in place",
      "Document all red flag findings",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: ["safety", "red-flags", "referral", "shared", "critical"],
  },

  // ========================================================================
  // PT EVIDENCE
  // ========================================================================

  {
    id: "pt-evidence-001",
    title: "APTA Clinical Practice Guideline: Low Back Pain",
    discipline: "pt",
    topic: "Clinical Guidelines",
    subtopic: "Musculoskeletal",
    description:
      "Evidence-based guideline for evaluation and treatment of low back pain",
    evidenceLevel: 1,
    source: "apta-cpg",
    citation: "APTA Clinical Practice Guideline: Low Back Pain (2017)",
    url: "https://www.apta.org",
    authors: ["APTA"],
    publicationYear: 2017,
    summary:
      "Comprehensive guideline for PT management of acute and chronic low back pain",
    keyFindings: [
      "Manual therapy combined with exercise is effective",
      "Early mobilization improves outcomes",
      "Psychosocial factors influence recovery",
      "Patient education is essential",
    ],
    applicableTo: ["pt", "musculoskeletal", "low-back-pain"],
    recommendations: [
      "Use manual therapy and exercise for low back pain",
      "Screen for psychosocial factors",
      "Provide patient education",
      "Progress exercises based on tolerance",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: ["guideline", "low-back-pain", "pt", "evidence-level-1"],
  },

  {
    id: "pt-evidence-002",
    title: "Manual Therapy: Evidence and Clinical Application",
    discipline: "pt",
    topic: "Intervention Techniques",
    subtopic: "Manual Therapy",
    description:
      "Evidence-based review of manual therapy techniques and their clinical application",
    evidenceLevel: 1,
    source: "journal-article",
    citation: "Journal of Orthopaedic & Sports Physical Therapy",
    summary:
      "Manual therapy is effective for musculoskeletal conditions when combined with exercise",
    keyFindings: [
      "Mobilization effective for joint dysfunction",
      "Manipulation effective for specific conditions",
      "Soft tissue techniques reduce pain",
      "Manual therapy most effective with exercise",
    ],
    applicableTo: ["pt", "musculoskeletal", "neurological"],
    contraindications: [
      "Osteoporosis",
      "Rheumatoid arthritis",
      "Spinal cord compression",
      "Vascular insufficiency",
    ],
    precautions: [
      "Screen for contraindications",
      "Use appropriate force",
      "Monitor patient response",
      "Modify technique as needed",
    ],
    recommendations: [
      "Use manual therapy for appropriate conditions",
      "Combine with exercise for best outcomes",
      "Screen for contraindications",
      "Document technique and response",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: ["manual-therapy", "pt", "evidence-level-1", "intervention"],
  },

  // ========================================================================
  // OT EVIDENCE
  // ========================================================================

  {
    id: "ot-evidence-001",
    title: "AOTA Practice Framework: Domain and Process",
    discipline: "ot",
    topic: "Clinical Guidelines",
    subtopic: "Practice Framework",
    description:
      "AOTA Occupational Therapy Practice Framework (OTPF-4) defining OT domain and process",
    evidenceLevel: 1,
    source: "aota-guidelines",
    citation: "AOTA Occupational Therapy Practice Framework (4th Edition)",
    url: "https://www.aota.org",
    authors: ["AOTA"],
    publicationYear: 2020,
    summary:
      "Foundational framework defining occupational therapy domain, process, and outcomes",
    keyFindings: [
      "OT focuses on occupational performance",
      "Client-centered approach is essential",
      "Holistic view of health and wellness",
      "Evidence-based practice required",
    ],
    applicableTo: ["ot", "all-conditions"],
    recommendations: [
      "Use client-centered approach",
      "Focus on occupational performance",
      "Use evidence-based interventions",
      "Measure occupational outcomes",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: ["guideline", "ot", "practice-framework", "evidence-level-1"],
  },

  {
    id: "ot-evidence-002",
    title: "Adaptive Equipment and Environmental Modifications",
    discipline: "ot",
    topic: "Intervention Techniques",
    subtopic: "Adaptive Equipment",
    description:
      "Evidence-based review of adaptive equipment and environmental modifications",
    evidenceLevel: 2,
    source: "journal-article",
    citation: "American Journal of Occupational Therapy",
    summary:
      "Adaptive equipment and environmental modifications improve occupational performance and independence",
    keyFindings: [
      "Adaptive equipment improves ADL independence",
      "Environmental modifications reduce barriers",
      "Client-centered selection is important",
      "Training is essential for effectiveness",
    ],
    applicableTo: ["ot", "adl-training", "functional-mobility"],
    recommendations: [
      "Assess need for adaptive equipment",
      "Select equipment based on client goals",
      "Provide training on equipment use",
      "Monitor effectiveness and adjust as needed",
    ],
    lastUpdated: new Date("2024-03-18"),
    tags: ["adaptive-equipment", "ot", "evidence-level-2", "intervention"],
  },
];

// ============================================================================
// Lookup Functions
// ============================================================================

export function getEvidenceById(id: string): ClinicalEvidence | undefined {
  return CLINICAL_EVIDENCE_REGISTRY.find((e) => e.id === id);
}

export function getEvidenceByDiscipline(
  discipline: Discipline | "shared",
): ClinicalEvidence[] {
  return CLINICAL_EVIDENCE_REGISTRY.filter(
    (e) => e.discipline === discipline || e.discipline === "shared",
  );
}

export function getEvidenceByTopic(topic: string): ClinicalEvidence[] {
  return CLINICAL_EVIDENCE_REGISTRY.filter((e) => e.topic === topic);
}

export function getEvidenceByEvidenceLevel(
  level: EvidenceLevel,
): ClinicalEvidence[] {
  return CLINICAL_EVIDENCE_REGISTRY.filter((e) => e.evidenceLevel === level);
}

export function getEvidenceByTag(tag: string): ClinicalEvidence[] {
  return CLINICAL_EVIDENCE_REGISTRY.filter((e) => e.tags.includes(tag));
}

export function searchEvidence(query: string): ClinicalEvidence[] {
  const lowerQuery = query.toLowerCase();
  return CLINICAL_EVIDENCE_REGISTRY.filter(
    (e) =>
      e.title.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery) ||
      e.summary.toLowerCase().includes(lowerQuery) ||
      e.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

export function getEvidenceByApplicableTo(
  applicableTo: string,
): ClinicalEvidence[] {
  return CLINICAL_EVIDENCE_REGISTRY.filter((e) =>
    e.applicableTo.includes(applicableTo),
  );
}
