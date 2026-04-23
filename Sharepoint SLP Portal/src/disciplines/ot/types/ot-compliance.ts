/**
 * OT Compliance Type Definitions
 *
 * Defines TypeScript interfaces for Occupational Therapy compliance rules
 * Based on Medicare Part B OT requirements and AOTA standards
 * Requirements: 2.5, 2.6, 2.7, 2.8
 */

// ============================================================================
// OT Compliance Rule Types
// ============================================================================

export type ComplianceRuleType =
  | "documentation"
  | "billing"
  | "clinical-practice"
  | "ethical"
  | "safety";

export type ComplianceSeverity = "critical" | "high" | "medium" | "low";

export type ComplianceStatus =
  | "compliant"
  | "non-compliant"
  | "warning"
  | "needs-review";

// ============================================================================
// OT Compliance Rule
// ============================================================================

export interface OTComplianceRule {
  id: string;
  code: string; // e.g., OT_COMP_001
  name: string;
  description: string;
  type: ComplianceRuleType;
  severity: ComplianceSeverity;
  requirement: string;
  rationale: string;
  source: "medicare" | "aota" | "hipaa" | "state-board" | "insurance";
  applicableTo: string[]; // e.g., ['evaluation', 'treatment', 'documentation']
  validationCriteria: string[];
  examples: string[];
  counterexamples: string[];
  references: string[];
  effectiveDate: Date;
  expirationDate?: Date;
  active: boolean;
}

// ============================================================================
// Medicare Part B OT Compliance
// ============================================================================

export interface MedicareOTRequirement {
  id: string;
  code: string;
  requirement: string;
  description: string;
  applicableSettings: string[];
  documentation: string[];
  billing: string[];
  penalties: string;
  references: string[];
}

export interface OTCPTCodeCompliance {
  code: string;
  name: string;
  complexity?: "low" | "moderate" | "high";
  timeRequirement: number; // minutes
  minTime: number; // minimum billable time
  billingUnit: number; // minutes per unit
  applicableSettings: string[];
  documentation: string[];
  validationRules: string[];
}

// ============================================================================
// OT Documentation Compliance
// ============================================================================

export interface OTDocumentationRequirement {
  id: string;
  section: "subjective" | "objective" | "assessment" | "plan";
  requirement: string;
  description: string;
  requiredElements: string[];
  examples: string[];
  commonMistakes: string[];
  complianceChecklist: string[];
}

export interface OTDocumentationCompliance {
  id: string;
  documentationId: string;
  discipline: "ot";
  evaluationDate: Date;

  // SOAP compliance
  subjectiveCompliant: boolean;
  objectiveCompliant: boolean;
  assessmentCompliant: boolean;
  planCompliant: boolean;

  // Content compliance
  occupationalFocusPresent: boolean;
  functionalLimitationsDocumented: boolean;
  skilledNeedJustified: boolean;
  medicalNecessityDocumented: boolean;

  // Billing compliance
  cptCodeValid: boolean;
  timeDocumented: boolean;
  timeCompliant: boolean;

  // Overall status
  status: ComplianceStatus;
  issues: ComplianceIssue[];
  recommendations: string[];
  reviewedBy: string;
  reviewDate: Date;
}

export interface ComplianceIssue {
  id: string;
  code: string;
  severity: ComplianceSeverity;
  message: string;
  field: string;
  suggestion: string;
  reference: string;
}

// ============================================================================
// AOTA Standards Compliance
// ============================================================================

export interface AOTAStandardCompliance {
  id: string;
  standardCode: string;
  standardName: string;
  requirement: string;
  description: string;
  applicableContexts: string[];
  complianceIndicators: string[];
  nonComplianceIndicators: string[];
  references: string[];
}

export interface OTEthicsCompliance {
  id: string;
  coreValue:
    | "altruism"
    | "equality"
    | "freedom"
    | "justice"
    | "dignity"
    | "truth"
    | "prudence";
  principle: string;
  description: string;
  applicableScenarios: string[];
  complianceChecklist: string[];
  violationExamples: string[];
}

// ============================================================================
// OT Compliance Audit
// ============================================================================

export interface OTComplianceAudit {
  id: string;
  auditDate: Date;
  auditType: "internal" | "external" | "insurance" | "regulatory";
  scope: string;
  sampledRecords: number;

  // Results
  totalIssuesFound: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;

  // Compliance rate
  overallComplianceRate: number;
  documentationComplianceRate: number;
  billingComplianceRate: number;
  clinicalComplianceRate: number;

  // Findings
  findings: AuditFinding[];
  recommendations: string[];
  correctionPlan: string;
  followUpDate: Date;

  // Metadata
  auditedBy: string;
  approvedBy: string;
  status: "draft" | "completed" | "in-progress";
}

export interface AuditFinding {
  id: string;
  code: string;
  severity: ComplianceSeverity;
  description: string;
  affectedRecords: number;
  rootCause: string;
  correctionAction: string;
  targetCompletionDate: Date;
  status: "open" | "in-progress" | "completed" | "closed";
}

// ============================================================================
// OT Compliance Dashboard
// ============================================================================

export interface OTComplianceDashboard {
  id: string;
  period: string; // e.g., "2024-Q1"

  // Metrics
  totalDocuments: number;
  compliantDocuments: number;
  nonCompliantDocuments: number;
  complianceRate: number;

  // Breakdown by type
  documentationCompliance: number;
  billingCompliance: number;
  clinicalCompliance: number;
  ethicsCompliance: number;

  // Trends
  complianceTrend: "improving" | "stable" | "declining";
  commonIssues: string[];

  // Actions needed
  criticalIssues: ComplianceIssue[];
  recommendedActions: string[];

  // Last updated
  lastUpdated: Date;
  nextReviewDate: Date;
}

// ============================================================================
// OT Compliance Checklist
// ============================================================================

export interface OTComplianceChecklist {
  id: string;
  name: string;
  description: string;
  category: ComplianceRuleType;
  items: ChecklistItem[];
  applicableTo: string[];
  frequency: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  guidance: string;
  examples: string[];
  completed: boolean;
  notes: string;
}
