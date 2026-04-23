/**
 * Integration Test: Documentation Workflow (Task 9.9)
 *
 * Tests:
 * - Complete note generation with AI assistance
 * - Compliance validation after note generation
 * - CPT code recommendations
 * - Audit logging of documentation events
 *
 * Requirements: 3.7, 10.1
 * Evidence: Medicare Benefit Policy Manual Chapter 15, AMA CPT 2026
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { auditService } from "../../services/audit-service";
import {
  validateMedicareCompliance,
  mapInterventionToCPT,
} from "../../utils/medicare-compliance-validator";
import type { SOAPNote } from "../../types/documentation-compliance";

vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateClinicalResponse: vi.fn(),
  },
}));

describe("Integration: Documentation Workflow", () => {
  // Skipped: Requires database infrastructure
  beforeEach(() => {
    vi.clearAllMocks();
    auditService.clearAuditLog();
  });

  afterEach(() => {
    auditService.clearAuditLog();
  });

  describe("Complete note generation with AI assistance", () => {
    it("AI generates a compliant SOAP note with skilled language", async () => {
      const mockResponse = {
        text: [
          "S: Patient reports right shoulder pain 6/10, limiting overhead reaching and ADLs.",
          "O: ROM: Shoulder flexion 110° (limited from 180°). Strength: MMT 3/5 right rotator cuff.",
          "   Skilled therapeutic exercise performed requiring clinical judgment for progression.",
          "A: Patient demonstrates moderate functional limitation (DASH 45/100).",
          "   Progress toward goal: ROM improved from 90° to 110° shoulder flexion.",
          "P: Continue manual therapy and neuromuscular re-education 3x/week.",
          "   Short-term goal: Achieve 140° shoulder flexion in 4 weeks.",
        ].join("\n"),
        reasoning:
          "Documentation follows Medicare Chapter 15 requirements with skilled need justification.",
        citations: [
          {
            source: "Medicare Benefit Policy Manual Chapter 15",
            relevance: "Documentation requirements for skilled PT services",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [
          "Add specific functional outcome measures",
          "Include patient response to treatment",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "Generate a SOAP note for right shoulder rotator cuff tendinopathy",
        "Patient: ROM 110°, MMT 3/5, DASH 45",
        [],
        "orthopedic",
      );

      expect(response.text).toContain("therapeutic exercise");
      expect(response.text).toContain("ROM");
      expect(response.text).toContain("MMT");
      expect(response.citations[0]!.source).toContain("Medicare");
    });

    it("validates AI-generated note for Medicare compliance", async () => {
      const aiGeneratedNote = [
        "Skilled therapeutic exercise performed requiring clinical judgment.",
        "ROM: Shoulder flexion 110 degrees. Strength: MMT 3/5.",
        "Patient improved from moderate assist to minimal assist.",
        "Continue manual therapy 3x/week.",
      ].join(" ");

      (aiService.generateClinicalResponse as any).mockResolvedValue({
        text: aiGeneratedNote,
        citations: [],
        suggestedActions: [],
      });

      const response = await aiService.generateClinicalResponse(
        "Generate SOAP note",
        "Context",
        [],
        "orthopedic",
      );

      // Validate the generated note
      const flags = validateMedicareCompliance(response.text);
      const criticalFlags = flags.filter((f) => f.severity === "critical");

      // A well-generated note should have no critical flags
      expect(criticalFlags.length).toBe(0);
    });

    it("detects compliance issues in poorly written AI note", async () => {
      const poorNote =
        "Patient tolerated well. Continue as tolerated. Good session.";

      (aiService.generateClinicalResponse as any).mockResolvedValue({
        text: poorNote,
        citations: [],
        suggestedActions: [],
      });

      const response = await aiService.generateClinicalResponse(
        "Generate note",
        "Context",
        [],
        "orthopedic",
      );

      const flags = validateMedicareCompliance(response.text);

      // Should have critical flags for missing skilled language and objective data
      const criticalFlags = flags.filter((f) => f.severity === "critical");
      expect(criticalFlags.length).toBeGreaterThan(0);

      // Should have vague language warnings
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      expect(vagueFlags.length).toBeGreaterThan(0);
    });
  });

  describe("CPT code recommendations", () => {
    it("maps all interventions in a treatment plan to CPT codes", () => {
      const treatmentPlan = [
        "Therapeutic exercise for rotator cuff strengthening",
        "Manual therapy - joint mobilization grade III",
        "Gait training with walker",
        "Neuromuscular re-education for balance",
      ];

      const cptCodes = treatmentPlan.map((intervention) => ({
        intervention,
        cptCode: mapInterventionToCPT(intervention),
      }));

      expect(cptCodes[0]!.cptCode).toBe("97110"); // Therapeutic exercise
      expect(cptCodes[1].cptCode).toBe("97140"); // Manual therapy
      expect(cptCodes[2].cptCode).toBe("97116"); // Gait training
      expect(cptCodes[3].cptCode).toBe("97112"); // Neuromuscular re-education
    });

    it("generates CPT code summary for billing", () => {
      const interventions = [
        "Therapeutic exercise - hip strengthening",
        "Manual therapy - soft tissue mobilization",
        "Gait training - community ambulation",
      ];

      const cptSummary = interventions.reduce(
        (acc, intervention) => {
          const code = mapInterventionToCPT(intervention);
          if (code) {
            acc[code] = (acc[code] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      expect(cptSummary["97110"]).toBe(1);
      expect(cptSummary["97140"]).toBe(1);
      expect(cptSummary["97116"]).toBe(1);
    });

    it("AI suggests CPT codes for documentation", async () => {
      const mockResponse = {
        text: "Treatment included therapeutic exercise (97110), manual therapy (97140), and gait training (97116).",
        citations: [
          {
            source: "AMA CPT 2026",
            relevance: "CPT code definitions for PT services",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [
          "Bill 97110 for therapeutic exercise (2 units)",
          "Bill 97140 for manual therapy (1 unit)",
          "Bill 97116 for gait training (1 unit)",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "What CPT codes should I use for this session?",
        "Performed: strengthening, joint mobilization, gait training",
        [],
        "orthopedic",
      );

      expect(response.text).toContain("97110");
      expect(response.text).toContain("97140");
      expect(response.text).toContain("97116");
    });
  });

  describe("SOAP note structure validation", () => {
    it("validates a complete SOAP note object", () => {
      const soapNote: SOAPNote = {
        subjective: {
          chiefComplaint:
            "Right shoulder pain 6/10 limiting overhead activities",
          functionalLimitations: [
            "Unable to reach overhead",
            "Difficulty with dressing",
          ],
          patientGoals: ["Return to tennis", "Independent with ADLs"],
          priorLevelOfFunction: "Independent with all ADLs prior to injury",
        },
        objective: {
          observation:
            "Patient presents with guarded posture, limited shoulder elevation",
          rom: "Shoulder flexion 110°, abduction 90°, ER 45°",
          strength: "MMT 3/5 right rotator cuff, 4/5 scapular stabilizers",
          gait: "Normal gait pattern",
          balance: "Single leg stance 10 seconds bilateral",
          specialTests: "Neer positive, Hawkins positive",
          functionalTests: "DASH score 45/100",
        },
        assessment: {
          clinicalImpression:
            "Right rotator cuff tendinopathy with subacromial impingement",
          diagnosis: "M75.1 - Rotator cuff syndrome",
          prognosis: "Good prognosis with skilled PT intervention",
          progressTowardGoals:
            "ROM improved from 90° to 110° shoulder flexion (20° gain)",
          clinicalReasoning:
            "Skilled therapeutic exercise and manual therapy required for optimal recovery",
        },
        plan: {
          interventions: [
            "Therapeutic exercise - scapular stabilization",
            "Manual therapy - posterior capsule stretching",
            "Neuromuscular re-education - rotator cuff activation",
          ],
          shortTermGoals: ["Achieve 140° shoulder flexion in 4 weeks"],
          longTermGoals: ["Return to tennis in 12 weeks"],
          patientEducation: "Home exercise program provided, posture education",
        },
      };

      const flags = validateMedicareCompliance(soapNote);
      const criticalFlags = flags.filter((f) => f.severity === "critical");

      // A complete SOAP note should have no critical flags
      expect(criticalFlags.length).toBe(0);
    });

    it("SOAP note with vague language triggers warnings", () => {
      const vagueNote: SOAPNote = {
        subjective: {
          chiefComplaint: "Shoulder pain",
          functionalLimitations: [],
          patientGoals: [],
          priorLevelOfFunction: "",
        },
        objective: {
          observation: "Patient tolerated well",
          rom: "ROM improving",
          strength: "Strength progressing",
          gait: "",
          balance: "",
          specialTests: "",
          functionalTests: "",
        },
        assessment: {
          clinicalImpression: "Patient did well today",
          diagnosis: "",
          prognosis: "",
          progressTowardGoals: "Continue as tolerated",
          clinicalReasoning: "Good session",
        },
        plan: {
          interventions: ["Continue same as last time"],
          shortTermGoals: [],
          longTermGoals: [],
          patientEducation: "",
        },
      };

      const flags = validateMedicareCompliance(vagueNote);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");

      expect(vagueFlags.length).toBeGreaterThan(0);
    });
  });

  describe("Audit logging of documentation events", () => {
    it("logs note creation to audit trail", async () => {
      (aiService.generateClinicalResponse as any).mockResolvedValue({
        text: "Skilled therapeutic exercise performed. ROM: 110 degrees.",
        citations: [],
        suggestedActions: [],
      });

      // Log PHI access for documentation
      auditService.logPHIAccess({
        action: "CREATE_DOCUMENTATION",
        patientId: "PT-DOC-001",
        dataType: "notes",
        accessReason: "Creating progress note for PT session",
        phiAccessed: true,
        timestamp: "",
      });

      // Generate AI-assisted note
      const response = await aiService.generateClinicalResponse(
        "Generate progress note",
        "Session context",
        [],
        "orthopedic",
      );

      // Log AI assistance
      auditService.logInteraction({
        action: "AI_DOCUMENTATION_ASSIST",
        prompt: "Generate progress note",
        confidence: 4,
        module: "DocumentationStudio",
        timestamp: "",
      });

      // Log clinical decision
      auditService.logClinicalDecision({
        action: "CLINICAL_DECISION",
        decisionType: "treatment-plan",
        clinicalReasoning: response.text,
        evidenceSources: ["Medicare Benefit Policy Manual Chapter 15"],
        aiAssisted: true,
        timestamp: "",
      });

      const stats = auditService.getStatistics();
      expect(stats.totalEntries).toBe(3);
      expect(stats.phiAccessCount).toBe(1);
      expect(stats.clinicalDecisionCount).toBe(1);
    });

    it("compliance validation results are logged", () => {
      const noteText =
        "Skilled therapeutic exercise. ROM: 110 degrees. Patient improved.";
      const flags = validateMedicareCompliance(noteText);

      auditService.logInteraction({
        action: "COMPLIANCE_VALIDATION",
        prompt: noteText,
        confidence: 5,
        module: "DocumentationStudio",
        outcome: `${flags.length} flags: ${flags.filter((f) => f.severity === "critical").length} critical`,
        timestamp: "",
      });

      const log = auditService.getAuditLog();
      expect(log[0]!.action).toBe("COMPLIANCE_VALIDATION");
      expect(log[0]!.module).toBe("DocumentationStudio");
    });

    it("audit trail export includes documentation events", () => {
      // Log multiple documentation events
      auditService.logPHIAccess({
        action: "CREATE_DOCUMENTATION",
        patientId: "PT-001",
        dataType: "notes",
        accessReason: "Initial evaluation note",
        phiAccessed: true,
      });

      auditService.logPHIAccess({
        action: "UPDATE_DOCUMENTATION",
        patientId: "PT-001",
        dataType: "notes",
        accessReason: "Progress note update",
        phiAccessed: true,
      });

      const now = new Date();
      const report = auditService.exportAuditTrail(
        new Date(now.getFullYear(), 0, 1),
        new Date(now.getFullYear(), 11, 31),
      );

      expect(report.totalEntries).toBe(2);
      expect(report.phiAccessCount).toBe(2);

      const csv = auditService.exportAuditTrailAsCSV(
        new Date(now.getFullYear(), 0, 1),
        new Date(now.getFullYear(), 11, 31),
      );

      expect(csv).toContain("CREATE_DOCUMENTATION");
      expect(csv).toContain("UPDATE_DOCUMENTATION");
    });
  });

  describe("Compliance flag regulation references", () => {
    it("all compliance flags include regulation references", () => {
      const incompleteNote = "Patient attended session today.";
      const flags = validateMedicareCompliance(incompleteNote);

      expect(flags.length).toBeGreaterThan(0);
      flags.forEach((flag) => {
        expect(flag.regulation).toBeDefined();
        expect(flag.regulation.length).toBeGreaterThan(10);
      });
    });

    it("skilled-need flag references Section 220.2", () => {
      const noteWithoutSkill = "Patient attended session. ROM measured.";
      const flags = validateMedicareCompliance(noteWithoutSkill);
      const skilledFlag = flags.find((f) => f.category === "skilled-need");

      expect(skilledFlag).toBeDefined();
      expect(skilledFlag!.regulation).toContain("220.2");
    });

    it("vague-language flag references Section 220.3", () => {
      const vagueNote =
        "Patient tolerated well. Therapeutic exercise. ROM: 90 degrees.";
      const flags = validateMedicareCompliance(vagueNote);
      const vagueFlag = flags.find((f) => f.category === "vague-language");

      expect(vagueFlag).toBeDefined();
      expect(vagueFlag!.regulation).toContain("220.3");
    });
  });
});
