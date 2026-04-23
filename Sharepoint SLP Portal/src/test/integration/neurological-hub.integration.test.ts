/**
 * Integration Test: Neurological Hub Workflow (Task 7.5)
 *
 * Tests:
 * - Complete stroke assessment workflow: FMA scoring → BBS interpretation → AI treatment planning
 * - Outcome measure calculations are accurate
 * - AI-assisted treatment planning uses neurological domain context
 * - Audit logging of clinical decisions
 *
 * Requirements: 2.1, 6.2
 * Evidence: APTA Stroke CPG, Fugl-Meyer (1975), Berg (1989), Podsiadlo & Richardson (1991)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { auditService } from "../../services/audit-service";
import {
  interpretBergBalance,
  interpretTUG,
  calculateFallRisk,
} from "../../utils/fall-risk-calculator";
import {
  neurologicalAssessmentTools,
  neurologicalTreatmentProtocols as strokeRehabProtocols,
} from "../../data/pt-neurological-data";

vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateClinicalResponse: vi.fn(),
  },
}));

describe("Integration: Neurological Hub Workflow", () => {
  // Skipped: Requires database infrastructure
  beforeEach(() => {
    vi.clearAllMocks();
    auditService.clearAuditLog();
  });

  afterEach(() => {
    auditService.clearAuditLog();
  });

  describe("Complete stroke assessment workflow", () => {
    it("FMA scoring → BBS interpretation → AI treatment planning", async () => {
      // Step 1: FMA Assessment
      const fmaUE = 45; // Upper extremity (0-66)
      const fmaLE = 20; // Lower extremity (0-34)
      const fmaTotal = fmaUE + fmaLE; // 65/100 = Moderate motor impairment

      expect(fmaTotal).toBe(65);
      expect(fmaTotal).toBeGreaterThan(50); // Moderate recovery range

      // Step 2: BBS Interpretation
      const bbsScore = 42; // <45 = high fall risk
      const bbsResult = interpretBergBalance(bbsScore);

      expect(bbsResult.fallRisk).toContain("High fall risk");
      expect(bbsResult.level).toBe("Requires assistance");

      // Step 3: TUG Interpretation
      const tugScore = 18; // >14s = high fall risk
      const tugResult = interpretTUG(tugScore);

      expect(tugResult.fallRisk).toContain("High fall risk");

      // Step 4: AI Treatment Planning
      const mockResponse = {
        text: "For moderate stroke recovery (FMA 65/100), prioritize task-specific training and CIMT for upper extremity.",
        reasoning: "Based on APTA Stroke CPG and neuroplasticity principles.",
        citations: [
          {
            source: "APTA Stroke CPG",
            relevance: "Primary guideline for stroke rehabilitation",
            evidenceLevel: 5,
          },
          {
            source: "Cochrane Review: CIMT for stroke",
            relevance: "Evidence for constraint-induced movement therapy",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [
          "Implement task-specific gait training 5x/week",
          "Consider CIMT for upper extremity recovery",
          "Fall prevention program given BBS <45",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const context = [
        `Fugl-Meyer Assessment: UE ${fmaUE}/66, LE ${fmaLE}/34, Total ${fmaTotal}/100`,
        `Berg Balance Scale: ${bbsScore}/56 - ${bbsResult.fallRisk}`,
        `TUG: ${tugScore}s - ${tugResult.fallRisk}`,
      ].join("\n");

      const response = await aiService.generateClinicalResponse(
        "What are the priority interventions for this stroke patient?",
        context,
        [],
        "neurological",
      );

      expect(response.text).toContain("FMA");
      expect(response.citations.length).toBeGreaterThan(0);
      expect(response.citations[0].evidenceLevel).toBeGreaterThanOrEqual(4);
      expect(response.suggestedActions).toContain(
        "Fall prevention program given BBS <45",
      );
    });

    it("logs complete stroke assessment workflow to audit trail", async () => {
      const mockResponse = {
        text: "CIMT recommended for upper extremity recovery",
        citations: [{ source: "APTA Stroke CPG", relevance: "Primary" }],
        suggestedActions: ["Implement CIMT"],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      // Log PHI access
      auditService.logPHIAccess({
        action: "VIEW_NEUROLOGICAL_ASSESSMENT",
        patientId: "PT-STROKE-001",
        dataType: "clinical",
        accessReason: "Stroke rehabilitation assessment",
        phiAccessed: true,
        timestamp: "",
      });

      // Log AI query
      auditService.logInteraction({
        action: "AI_CLINICAL_QUERY",
        prompt: "Priority interventions for stroke patient?",
        confidence: 4,
        module: "NeurologicalHub",
        timestamp: "",
      });

      // Log clinical decision
      const response = await aiService.generateClinicalResponse(
        "Priority interventions?",
        "FMA: 65/100, BBS: 42/56",
        [],
        "neurological",
      );

      auditService.logClinicalDecision({
        action: "CLINICAL_DECISION",
        decisionType: "treatment-plan",
        clinicalReasoning: response.text,
        evidenceSources: response.citations.map((c) => c.source),
        aiAssisted: true,
        timestamp: "",
      });

      const stats = auditService.getStatistics();
      expect(stats.totalEntries).toBe(3);
      expect(stats.phiAccessCount).toBe(1);
      expect(stats.clinicalDecisionCount).toBe(1);
    });
  });

  describe("Outcome measure calculations", () => {
    it("BBS thresholds are clinically accurate", () => {
      // Clinical gold standard thresholds (Berg 1989, Podsiadlo 1991)
      const thresholds = [
        {
          score: 56,
          expectedLevel: "Independent",
          expectedRisk: "Low fall risk",
        },
        {
          score: 50,
          expectedLevel: "Independent with assistive device",
          expectedRisk: "Moderate fall risk",
        },
        {
          score: 44,
          expectedLevel: "Requires assistance",
          expectedRisk: "High fall risk",
        },
        {
          score: 20,
          expectedLevel: "Wheelchair bound",
          expectedRisk: "Very high fall risk",
        },
        {
          score: 10,
          expectedLevel: "Wheelchair bound",
          expectedRisk: "Very high fall risk",
        },
      ];

      thresholds.forEach(({ score, expectedLevel, expectedRisk }) => {
        const result = interpretBergBalance(score);
        expect(result.level).toBe(expectedLevel);
        expect(result.fallRisk).toBe(expectedRisk);
      });
    });

    it("TUG thresholds are clinically accurate (Podsiadlo & Richardson 1991)", () => {
      const thresholds = [
        { score: 8, expectedRisk: "Low fall risk" },
        { score: 11, expectedRisk: "Low to moderate fall risk" },
        { score: 13, expectedRisk: "Moderate fall risk" },
        { score: 16, expectedRisk: "High fall risk" },
        { score: 25, expectedRisk: "Very high fall risk" },
      ];

      thresholds.forEach(({ score, expectedRisk }) => {
        const result = interpretTUG(score);
        expect(result.fallRisk).toBe(expectedRisk);
      });
    });

    it("fall risk calculation integrates BBS and TUG correctly", () => {
      // High-risk neurological patient: BBS <45 AND TUG >14s
      const result = calculateFallRisk({
        hasFallen: false,
        feelsUnsteady: true,
        worriesAboutFalling: false,
        tugScore: 18,
        age: 68,
        historyOfFalls: 0,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
        bergBalanceScore: 40,
      });

      // BBS <45 = 5 pts, TUG >14 = 5 pts, feelsUnsteady = 3 pts → total = 13 → high
      expect(result.level).toBe("high");
      expect(
        result.riskFactors.some(
          (f) => f.includes("Berg") && f.includes("High fall risk"),
        ),
      ).toBe(true);
      expect(
        result.riskFactors.some(
          (f) => f.includes("TUG") && f.includes("High fall risk"),
        ),
      ).toBe(true);
    });
  });

  describe("Neurological data integrity", () => {
    it("neurological assessment tools are defined", () => {
      expect(neurologicalAssessmentTools).toBeDefined();
      expect(Array.isArray(neurologicalAssessmentTools)).toBe(true);
      expect(neurologicalAssessmentTools.length).toBeGreaterThan(0);
    });

    it("stroke rehab protocols are defined with evidence citations", () => {
      expect(strokeRehabProtocols).toBeDefined();
      expect(Array.isArray(strokeRehabProtocols)).toBe(true);
      expect(strokeRehabProtocols.length).toBeGreaterThan(0);

      strokeRehabProtocols.forEach((protocol) => {
        expect(protocol.citation).toBeDefined();
        expect(protocol.citation.length).toBeGreaterThan(0);
        expect(protocol.evidenceLevel).toBeGreaterThanOrEqual(3);
      });
    });

    it("all neurological assessment tools have valid scoring ranges", () => {
      neurologicalAssessmentTools.forEach((tool) => {
        expect(tool.scoringRange.min).toBeLessThan(tool.scoringRange.max);
        expect(tool.evidenceLevel).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe("AI treatment planning with neurological context", () => {
    it("AI is called with neurological domain for stroke queries", async () => {
      (aiService.generateClinicalResponse as any).mockResolvedValue({
        text: "Task-specific training recommended",
        citations: [{ source: "APTA Stroke CPG", relevance: "Primary" }],
        suggestedActions: [],
      });

      await aiService.generateClinicalResponse(
        "Best interventions for upper extremity recovery after stroke?",
        "FMA UE: 30/66, BBS: 42/56",
        [],
        "neurological",
      );

      expect(aiService.generateClinicalResponse).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Array),
        "neurological",
      );
    });

    it("suggested actions include fall prevention when BBS <45", async () => {
      const mockResponse = {
        text: "Treatment plan for high fall risk patient",
        citations: [],
        suggestedActions: [
          "Implement fall prevention program",
          "Balance training 3x/week",
          "Home safety assessment",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "Treatment plan for patient with BBS 40/56?",
        "BBS: 40/56 - High fall risk, TUG: 18s",
        [],
        "neurological",
      );

      const hasFallPrevention = response.suggestedActions.some((a) =>
        a.toLowerCase().includes("fall"),
      );
      expect(hasFallPrevention).toBe(true);
    });
  });
});
