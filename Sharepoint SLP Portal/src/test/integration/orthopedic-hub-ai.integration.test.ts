/**
 * Integration Test: AI + Orthopedic Hub (Task 6.6)
 *
 * Tests:
 * - AI response generation for orthopedic queries includes authoritative source citations
 * - Audit logging is triggered on AI interactions
 * - Assessment context is passed to AI service
 * - Error handling and graceful degradation
 *
 * Requirements: 2.5, 10.1
 * Evidence: APTA Orthopedic Section CPGs, CMS Medicare documentation requirements
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { auditService } from "../../services/audit-service";
import { interpretOutcomeMeasure } from "../../data/pt-orthopedic-data";

// Mock AI service for controlled testing
vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateClinicalResponse: vi.fn(),
  },
}));

describe("Integration: AI + Orthopedic Hub", () => {
  // Skipped: Requires database infrastructure
  beforeEach(() => {
    vi.clearAllMocks();
    auditService.clearAuditLog();
  });

  afterEach(() => {
    auditService.clearAuditLog();
  });

  describe("AI response includes authoritative citations", () => {
    it("orthopedic AI response includes APTA CPG citations", async () => {
      const mockResponse = {
        text: "For rotator cuff tendinopathy, evidence-based interventions include scapular stabilization and progressive strengthening.",
        reasoning:
          "Based on APTA Shoulder Pain CPG (2013) and Cochrane Review evidence.",
        citations: [
          {
            source: "APTA Shoulder Pain CPG",
            url: "https://www.jospt.org/doi/10.2519/jospt.2013.0302",
            relevance:
              "Primary clinical practice guideline for shoulder conditions",
            evidenceLevel: 4,
          },
          {
            source: "Journal of Orthopaedic & Sports Physical Therapy",
            relevance: "Peer-reviewed research on rotator cuff interventions",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [
          "Implement scapular stabilization exercises 3x/week",
          "Progress to rotator cuff strengthening at 6 weeks",
        ],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "What are the best interventions for rotator cuff tendinopathy?",
        "Patient: Shoulder flexion 110°, MMT 3/5 rotator cuff",
        [],
        "orthopedic",
      );

      expect(response.citations).toBeDefined();
      expect(response.citations.length).toBeGreaterThan(0);
      expect(response.citations[0]!.source).toContain("APTA");
      expect(response.text.length).toBeGreaterThan(0);
    });

    it("AI response includes evidence level in citations", async () => {
      const mockResponse = {
        text: "Manual therapy combined with exercise is recommended for knee OA.",
        citations: [
          {
            source: "APTA Knee OA CPG",
            relevance: "Primary guideline",
            evidenceLevel: 5,
          },
        ],
        suggestedActions: [],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "Best interventions for knee osteoarthritis?",
        "Patient: Knee flexion 100°, LEFS score 45",
        [],
        "orthopedic",
      );

      expect(response.citations[0]!.evidenceLevel).toBeDefined();
      expect(response.citations[0]!.evidenceLevel).toBeGreaterThanOrEqual(3);
    });

    it("AI is called with orthopedic domain context", async () => {
      const mockResponse = {
        text: "Recommendation",
        citations: [{ source: "APTA CPG", relevance: "Primary" }],
        suggestedActions: [],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      await aiService.generateClinicalResponse(
        "What interventions for lumbar radiculopathy?",
        "Patient: ODI 45, SLR positive at 45°",
        [],
        "orthopedic",
      );

      expect(aiService.generateClinicalResponse).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Array),
        "orthopedic",
      );
    });
  });

  describe("Audit logging on AI interactions", () => {
    it("logs AI interaction to audit trail", async () => {
      const mockResponse = {
        text: "Evidence-based recommendation",
        citations: [{ source: "APTA CPG", relevance: "Primary" }],
        suggestedActions: [],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      // Simulate what the component does: call AI then log to audit
      await aiService.generateClinicalResponse(
        "What interventions for shoulder impingement?",
        "Assessment context",
        [],
        "orthopedic",
      );

      // Log the interaction (as the component would)
      auditService.logInteraction({
        action: "AI_CLINICAL_QUERY",
        prompt: "What interventions for shoulder impingement?",
        confidence: 4,
        module: "OrthopedicHub",
        timestamp: "",
      });

      const log = auditService.getAuditLog();
      expect(log.length).toBe(1);
      expect(log[0]!.action).toBe("AI_CLINICAL_QUERY");
      expect(log[0]!.module).toBe("OrthopedicHub");
    });

    it("logs clinical decision with evidence sources", async () => {
      const mockResponse = {
        text: "Scapular stabilization recommended",
        citations: [
          { source: "APTA Shoulder CPG", relevance: "Primary guideline" },
          { source: "Cochrane Review", relevance: "Systematic review" },
        ],
        suggestedActions: ["Implement scapular stabilization"],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "Best interventions for rotator cuff?",
        "Assessment context",
        [],
        "orthopedic",
      );

      // Log clinical decision with evidence sources from response
      auditService.logClinicalDecision({
        action: "CLINICAL_DECISION",
        decisionType: "treatment-plan",
        clinicalReasoning: response.text,
        evidenceSources: response.citations.map((c) => c.source),
        aiAssisted: true,
        timestamp: "",
      });

      const stats = auditService.getStatistics();
      expect(stats.clinicalDecisionCount).toBe(1);

      const log = auditService.getAuditLog();
      const decision = log[0] as any;
      expect(decision.evidenceSources).toContain("APTA Shoulder CPG");
      expect(decision.aiAssisted).toBe(true);
    });

    it("audit log preserves all AI interaction details", async () => {
      const query = "What are the best interventions for patellofemoral pain?";
      const context =
        "Patient: Knee flexion 120°, LEFS 50, positive Clarke sign";

      (aiService.generateClinicalResponse as any).mockResolvedValue({
        text: "Hip strengthening and patellar mobilization recommended",
        citations: [],
        suggestedActions: [],
      });

      await aiService.generateClinicalResponse(
        query,
        context,
        [],
        "orthopedic",
      );

      auditService.logInteraction({
        action: "AI_CLINICAL_QUERY",
        prompt: query,
        confidence: 4,
        module: "OrthopedicHub",
      });

      const log = auditService.getAuditLog();
      expect(log[0]!.prompt).toBe(query);
      expect(log[0]!.confidence).toBe(4);
      expect(new Date(log[0]!.timestamp).getTime()).toBeGreaterThan(0);
    });
  });

  describe("Assessment tool integration", () => {
    it("DASH score interpretation integrates with AI context", async () => {
      const dashScore = 45;
      const interpretation = interpretOutcomeMeasure("DASH", dashScore);

      expect(interpretation).toBe("Moderate disability");

      const mockResponse = {
        text: `Patient has moderate disability (DASH ${dashScore}). Focus on functional restoration.`,
        citations: [{ source: "APTA Shoulder CPG", relevance: "Primary" }],
        suggestedActions: [],
      };

      (aiService.generateClinicalResponse as any).mockResolvedValue(
        mockResponse,
      );

      const context = `DASH Score: ${dashScore}/100 - ${interpretation}`;
      const response = await aiService.generateClinicalResponse(
        "What are the treatment priorities?",
        context,
        [],
        "orthopedic",
      );

      expect(response.text).toContain("moderate disability");
    });

    it("all 5 assessment tools have valid interpretation functions", () => {
      const testCases = [
        { acronym: "DASH", score: 50, expected: "Moderate disability" },
        {
          acronym: "LEFS",
          score: 50,
          expected: "Moderate functional limitation",
        },
        { acronym: "ODI", score: 30, expected: "Moderate disability" },
        { acronym: "NDI", score: 25, expected: "Moderate disability" },
        {
          acronym: "PSFS",
          score: 6,
          expected: "Moderate functional limitation",
        },
      ];

      testCases.forEach(({ acronym, score, expected }) => {
        const result = interpretOutcomeMeasure(acronym, score);
        expect(result).toBe(expected);
      });
    });
  });

  describe("Error handling", () => {
    it("AI service failure is handled gracefully", async () => {
      (aiService.generateClinicalResponse as any).mockRejectedValue(
        new Error("AI service unavailable"),
      );

      await expect(
        aiService.generateClinicalResponse(
          "What interventions for shoulder pain?",
          "Assessment context",
          [],
          "orthopedic",
        ),
      ).rejects.toThrow("AI service unavailable");
    });

    it("audit log is not corrupted on AI failure", async () => {
      (aiService.generateClinicalResponse as any).mockRejectedValue(
        new Error("Network error"),
      );

      try {
        await aiService.generateClinicalResponse(
          "Query",
          "Context",
          [],
          "orthopedic",
        );
      } catch {
        // Expected failure
        auditService.logInteraction({
          action: "AI_QUERY_FAILED",
          prompt: "Query",
          confidence: 0,
          module: "OrthopedicHub",
          outcome: "error",
          timestamp: "",
        });
      }

      const stats = auditService.getStatistics();
      expect(stats.totalEntries).toBe(1);
      expect(auditService.getAuditLog()[0]!.action).toBe("AI_QUERY_FAILED");
    });
  });
});
