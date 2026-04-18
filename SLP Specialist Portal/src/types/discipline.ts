/**
 * Discipline Types
 *
 * Shared types for multi-discipline portal supporting PT, OT, and SLP
 * Requirements: 1.1, 1.2, 1.3
 */

export type Discipline = "pt" | "ot" | "slp";

export interface DisciplineConfig {
  id: Discipline;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  hubs: HubConfig[];
  tools?: ToolConfig[];
  resources?: ResourceConfig[];
  complianceRules: ComplianceRule[];
  assessmentTools: AssessmentTool[];
  interventionLibrary: Intervention[];
  cptCodes: CPTCode[];
}

export interface ToolConfig {
  id: string;
  name: string;
  description?: string;
  icon: string;
  component?: string;
}

export interface ResourceConfig {
  id: string;
  name: string;
  description?: string;
  icon: string;
  url?: string;
}

export interface HubConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  discipline: Discipline;
  component: string; // Component name to lazy load
  order: number;
  enabled: boolean;
}

export interface ComplianceRule {
  id: string;
  discipline: Discipline;
  type: "documentation" | "billing" | "clinical";
  name: string;
  description: string;
  rule: (content: any) => ValidationResult;
}

export interface AssessmentTool {
  id: string;
  discipline: Discipline;
  name: string;
  acronym: string;
  description: string;
  scoringRange: {
    min: number;
    max: number;
  };
  mcid: number; // Minimal Clinically Important Difference
  evidenceLevel: 3 | 4 | 5;
  citation: string;
}

export interface Intervention {
  id: string;
  discipline: Discipline;
  name: string;
  indications: string[];
  contraindications: string[];
  cptCode?: string;
  evidenceLevel: number;
  sources: string[];
}

export interface CPTCode {
  code: string;
  discipline: Discipline;
  description: string;
  timeUnit: number; // minutes
  unitValue: number; // 15-minute units
  complexity?: "low" | "moderate" | "high";
  category: "evaluation" | "treatment" | "other";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface DisciplineContext {
  currentDiscipline: Discipline;
  config: DisciplineConfig;
  switchDiscipline: (discipline: Discipline) => void;
  getDisciplineConfig: (discipline: Discipline) => DisciplineConfig | null;
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
}

export interface DisciplineUser {
  id: string;
  email: string;
  name: string;
  disciplines: Discipline[];
  primaryDiscipline: Discipline;
  roles: Record<Discipline, string[]>;
}
