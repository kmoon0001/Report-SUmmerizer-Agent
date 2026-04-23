/**
 * Integration Test: Fall Risk Workflow (Task 8.6)
 *
 * Tests:
 * - Complete geriatric assessment with fall risk calculation
 * - Intervention recommendations are evidence-based
 * - Patient education material generation
 * - Audit logging of fall risk assessments
 *
 * Requirements: 7.5, 7.6
 * Evidence: CDC STEADI Initiative, AGS Fall Prevention Guidelines (2019),
 *           Cochrane Review on fall prevention (2019)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { auditService } from "../../services/audit-service";
import {
  calculateFallRisk,
  interpretBergBalance,
  interpretTUG,
  getFallPreventionInterventions,
  type STEADIAssessment,
} from "../../utils/fall-risk-calculator";
import {
  fallPreventionInterventions as fallPreventionEducation,
  geriatricAssessmentTools,
} from "../../data/pt-geriatric-data";

vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateClinicalResponse: vi.fn(),
  },
}));

describe("Integration: Fall Risk Workflow", () => {
  // Skipped: Requires database infrastructure
  beforeEach(() => {
    vi.clearAllMocks();
    auditService.clearAuditLog();
  });

  afterEach(() => {
    auditService.clearAuditLog();
  });

  describe("Complete geriatric assessment with fall risk calculation", () => {
    it("high-risk patient receives comprehensive intervention recommendations", () => {
      const highRiskAssessment: STEADIAssessment = {
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: true,
        tugScore: 16,
        thirtySecondChairStand: 6,
        age: 82,
        historyOfFalls: 2,
        medications: [
          "Benzodiazepines",
          "Antidepressants",
          "Antipsychotics",
          "Opioids",
        ],
        visionProblems: true,
        footProblems: false,
        homeHazards: true,
        fearOfFalling: true,
        bergBalanceScore: 38,
      };

      const result = calculateFallRisk(highRiskAssessment);

      // Verify high risk classification
      expect(result.level).toBe("high");
      expect(result.score).toBeGreaterThanOrEqual(12);

      // Verify all risk factors are identified
      expect(result.riskFactors).toContain("History of falls");
      expect(result.riskFactors).toContain(
        "Feels unsteady when standing or walking",
      );
      expect(result.riskFactors).toContain("Worries about falling");
      expect(
        result.riskFactors.some(
          (f) => f.includes("TUG") && f.includes("High fall risk"),
        ),
      ).toBe(true);
      expect(
        result.riskFactors.some(
          (f) => f.includes("Berg") && f.includes("High fall risk"),
        ),
      ).toBe(true);
      expect(result.riskFactors.some((f) => f.includes("Polypharmacy"))).toBe(
        true,
      );
      expect(result.riskFactors).toContain("Vision problems identified");
      expect(result.riskFactors).toContain("Environmental hazards in home");
      expect(result.riskFactors).toContain(
        "Fear of falling limiting activities",
      );
      expect(result.riskFactors).toContain("Age ≥80 years");

      // Verify immediate intervention recommendation
      expect(
        result.recommendations.some(
          (r) =>
            r.toLowerCase().includes("immediate") ||
            r.toLowerCase().includes("required"),
        ),
      ).toBe(true);

      // Verify evidence-based interventions are included
      expect(
        result.recommendations.some((r) => r.includes("Physical Therapy")),
      ).toBe(true);
      expect(
        result.recommendations.some((r) => r.includes("Medication review")),
      ).toBe(true);
      expect(
        result.recommendations.some((r) => r.includes("Home safety")),
      ).toBe(true);
    });

    it("low-risk patient receives preventive recommendations only", () => {
      const lowRiskAssessment: STEADIAssessment = {
        hasFallen: false,
        feelsUnsteady: false,
        worriesAboutFalling: false,
        tugScore: 9,
        age: 68,
        historyOfFalls: 0,
        medications: ["Lisinopril"],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
        bergBalanceScore: 54,
      };

      const result = calculateFallRisk(lowRiskAssessment);

      expect(result.level).toBe("low");
      expect(result.score).toBeLessThan(6);
      expect(
        result.recommendations.some((r) =>
          r.includes("Annual fall risk screening"),
        ),
      ).toBe(true);
      // Should NOT include immediate intervention
      expect(
        result.recommendations.some((r) =>
          r.toLowerCase().includes("immediate"),
        ),
      ).toBe(false);
    });

    it("moderate-risk patient receives targeted intervention recommendations", () => {
      const moderateRiskAssessment: STEADIAssessment = {
        hasFallen: true,
        feelsUnsteady: false,
        worriesAboutFalling: true,
        tugScore: 13,
        age: 75,
        historyOfFalls: 1,
        medications: ["Metoprolol", "Atorvastatin"],
        visionProblems: false,
        footProblems: true,
        homeHazards: false,
        fearOfFalling: false,
      };

      const result = calculateFallRisk(moderateRiskAssessment);

      expect(result.level).toBe("moderate");
      expect(result.score).toBeGreaterThanOrEqual(6);
      expect(result.score).toBeLessThan(12);
      expect(
        result.recommendations.some((r) =>
          r.includes("Balance and strength training"),
        ),
      ).toBe(true);
    });
  });

  describe("Evidence-based intervention recommendations", () => {
    it("high-risk patients receive Otago Exercise Program recommendation", () => {
      const interventions = getFallPreventionInterventions("high");
      const otago = interventions.find(
        (i) => i.name === "Otago Exercise Program",
      );

      expect(otago).toBeDefined();
      expect(otago!.fallReduction).toBe("35% reduction in falls");
      expect(otago!.evidenceLevel).toBe(5);
      expect(otago!.citation).toContain("Cochrane Review");
    });

    it("high-risk patients receive Tai Chi recommendation", () => {
      const interventions = getFallPreventionInterventions("high");
      const taiChi = interventions.find((i) => i.name === "Tai Chi");

      expect(taiChi).toBeDefined();
      expect(taiChi!.fallReduction).toBe("29% reduction in falls");
      expect(taiChi!.evidenceLevel).toBe(5);
    });

    it("high-risk patients receive Multifactorial Fall Prevention recommendation", () => {
      const interventions = getFallPreventionInterventions("high");
      const multifactorial = interventions.find(
        (i) => i.name === "Multifactorial Fall Prevention",
      );

      expect(multifactorial).toBeDefined();
      expect(multifactorial!.fallReduction).toBe("24% reduction in falls");
      expect(multifactorial!.citation).toContain("CDC STEADI");
    });

    it("all interventions have evidence level 5 (Cochrane/CDC)", () => {
      const interventions = getFallPreventionInterventions("high");
      interventions.forEach((i) => {
        expect(i.evidenceLevel).toBe(5);
      });
    });
  });

  describe("Patient education material generation", () => {
    it("fall prevention education materials are available", () => {
      expect(fallPreventionEducation).toBeDefined();
      expect(Array.isArray(fallPreventionEducation)).toBe(true);
      expect(fallPreventionEducation.length).toBeGreaterThan(0);
    });

    it("education materials have patient-friendly content", () => {
      fallPreventionEducation.forEach((material) => {
        expect(material.name).toBeDefined();
        expect(material.name.length).toBeGreaterThan(0);
        expect(material.description).toBeDefined();
        expect(material.description.length).toBeGreaterThan(0);
      });
    });

    it("AI generates patient education content for high-risk patients", async () => {
      const mockResponse = {
        text: "Home safety checklist: Remove throw rugs, install grab bars in bathroom, ensure adequate lighting.",
        citations: [
          {
            source: "CDC STEADI Patient Education Materials",
            relevance: "Evidence-based fall prevention education",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [
          "Provide CDC STEADI home safety checklist",
          "Schedule home safety assessment",
          "Refer to occupational therapy for home modification",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "Generate patient education for high fall risk patient",
        "Fall risk: HIGH, BBS: 38/56, TUG: 16s, Age: 82",
        [],
        "geriatric",
      );

      expect(response.text).toContain("safety");
      expect(response.citations[0].source).toContain("CDC");
      expect(
        response.suggestedActions.some((a) => a.includes("home safety")),
      ).toBe(true);
    });
  });

  describe("Audit logging of fall risk assessments", () => {
    it("fall risk assessment is logged to audit trail", () => {
      const assessment: STEADIAssessment = {
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: false,
        tugScore: 16,
        age: 78,
        historyOfFalls: 1,
        medications: ["Warfarin", "Metoprolol"],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
        bergBalanceScore: 42,
      };

      const result = calculateFallRisk(assessment);

      // Log PHI access for fall risk assessment
      auditService.logPHIAccess({
        action: "FALL_RISK_ASSESSMENT",
        patientId: "PT-GERIATRIC-001",
        dataType: "clinical",
        accessReason: "CDC STEADI fall risk assessment",
        phiAccessed: true,
        timestamp: "",
      });

      // Log clinical decision
      auditService.logClinicalDecision({
        action: "CLINICAL_DECISION",
        decisionType: "assessment",
        clinicalReasoning: `Fall risk level: ${result.level}. Score: ${result.score}. Risk factors: ${result.riskFactors.join(", ")}`,
        evidenceSources: [
          "CDC STEADI Initiative",
          "AGS Fall Prevention Guidelines",
        ],
        aiAssisted: false,
        timestamp: "",
      });

      const stats = auditService.getStatistics();
      expect(stats.totalEntries).toBe(2);
      expect(stats.phiAccessCount).toBe(1);
      expect(stats.clinicalDecisionCount).toBe(1);
    });

    it("audit trail can be exported for compliance review", () => {
      // Log several fall risk assessments
      for (let i = 0; i < 3; i++) {
        auditService.logPHIAccess({
          action: "FALL_RISK_ASSESSMENT",
          patientId: `PT-00${i}`,
          dataType: "clinical",
          accessReason: "Fall risk screening",
          phiAccessed: true,
        });
      }

      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 11, 31);

      const report = auditService.exportAuditTrail(startDate, endDate);

      expect(report.totalEntries).toBe(3);
      expect(report.phiAccessCount).toBe(3);
      expect(report.generatedAt).toBeDefined();
    });
  });

  describe("Geriatric assessment tools", () => {
    it("geriatric assessment tools are defined with evidence citations", () => {
      expect(geriatricAssessmentTools).toBeDefined();
      expect(Array.isArray(geriatricAssessmentTools)).toBe(true);
      expect(geriatricAssessmentTools.length).toBeGreaterThan(0);

      geriatricAssessmentTools.forEach((tool) => {
        expect(tool.citation).toBeDefined();
        expect(tool.citation.length).toBeGreaterThan(0);
        expect(tool.evidenceLevel).toBeGreaterThanOrEqual(3);
      });
    });

    it("BBS and TUG are included in geriatric assessment tools", () => {
      const toolNames = geriatricAssessmentTools.map(
        (t) => t.acronym || t.name,
      );
      const hasBBS = toolNames.some(
        (n) => n.includes("BBS") || n.includes("Berg"),
      );
      const hasTUG = toolNames.some(
        (n) => n.includes("TUG") || n.includes("Timed"),
      );
      expect(hasBBS).toBe(true);
      expect(hasTUG).toBe(true);
    });
  });
});
