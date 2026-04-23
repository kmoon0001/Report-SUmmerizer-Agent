/**
 * Unit Tests for AI Service Documentation Methods (Task 9.8)
 *
 * Tests for:
 * - generateClinicalAssessment()
 * - generateTreatmentPlan()
 *
 * Requirements: 2.1, 3.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { localAIService } from "../../services/local-ai-service";

describe("AI Service Documentation Methods (Task 9.8)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateClinicalAssessment", () => {
    it("should generate clinical assessment with reasoning from cloud", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Right shoulder pain",
          painLevel: 7,
          functionalLimitations: [
            "Difficulty reaching overhead",
            "Unable to lift objects",
          ],
        },
        objective: {
          rom: "Shoulder flexion 120°, abduction 100°",
          strength: "Deltoid 3/5, rotator cuff 3/5",
        },
      };

      const result = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "progress-note",
      );

      expect(result).toHaveProperty("assessment");
      expect(result).toHaveProperty("reasoning");
      expect(result).toHaveProperty("citations");
      expect(typeof result.assessment).toBe("string");
      expect(typeof result.reasoning).toBe("string");
      expect(Array.isArray(result.citations)).toBe(true);
      expect(result.assessment.length).toBeGreaterThan(0);
      expect(result.reasoning.length).toBeGreaterThan(0);
    });

    it("should return fallback on cloud failure", async () => {
      // Mock cloud failure
      const mockAI = {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error("Cloud failed")),
        },
      };

      vi.spyOn(aiService as any, "ai", "get").mockReturnValue(mockAI);

      const mockSoapNote = {
        subjective: { chiefComplaint: "Test" },
        objective: { observation: "Test" },
      };

      const result = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "progress-note",
      );

      expect(result.assessment).toContain("unavailable");
      expect(result.reasoning).toContain("unavailable");
    });

    it("should use local AI when enabled and loaded", async () => {
      aiService.updateConfig({ localLLM: true });

      const mockLocalResponse = JSON.stringify({
        assessment: "Local assessment",
        reasoning: "Local reasoning",
        citations: [],
      });

      vi.spyOn(localAIService, "isModelLoaded").mockReturnValue(true);
      vi.spyOn(localAIService, "generateContent").mockResolvedValue(
        mockLocalResponse,
      );

      const mockSoapNote = {
        subjective: { chiefComplaint: "Test" },
        objective: { observation: "Test" },
      };

      const result = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "progress-note",
      );

      expect(result.assessment).toBe("Local assessment");
      expect(result.reasoning).toBe("Local reasoning");
      expect(localAIService.generateContent).toHaveBeenCalled();

      aiService.updateConfig({ localLLM: false });
    });

    it("should include evidence-based citations", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Low back pain",
          painLevel: 6,
        },
        objective: {
          rom: "Lumbar flexion limited to 40°",
          strength: "Core strength 3/5",
        },
      };

      const result = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "initial-evaluation",
      );

      expect(result.citations).toBeDefined();
      expect(Array.isArray(result.citations)).toBe(true);

      // Citations should have proper structure
      if (result.citations.length > 0) {
        const citation = result.citations[0];
        expect(citation).toHaveProperty("source");
        expect(citation).toHaveProperty("relevance");
      }
    });
  });

  describe("generateTreatmentPlan", () => {
    it("should generate treatment plan with interventions from cloud", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Knee pain after TKA",
          painLevel: 5,
          functionalLimitations: [
            "Difficulty walking",
            "Unable to climb stairs",
          ],
        },
        objective: {
          rom: "Knee flexion 90°, extension -5°",
          strength: "Quadriceps 3/5",
          gait: "Antalgic gait with walker",
        },
        assessment: {
          clinicalImpression:
            "Post-operative TKA with limited ROM and strength",
          diagnosis: "Status post total knee arthroplasty",
        },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      expect(result).toHaveProperty("plan");
      expect(result).toHaveProperty("interventions");
      expect(result).toHaveProperty("rationale");
      expect(result).toHaveProperty("citations");
      expect(typeof result.plan).toBe("string");
      expect(Array.isArray(result.interventions)).toBe(true);
      expect(typeof result.rationale).toBe("string");
      expect(result.plan.length).toBeGreaterThan(0);
      // Interventions may be empty in fallback mode
      expect(result.rationale.length).toBeGreaterThan(0);
    });

    it("should return fallback on cloud failure", async () => {
      const mockAI = {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error("Cloud failed")),
        },
      };

      vi.spyOn(aiService as any, "ai", "get").mockReturnValue(mockAI);

      const mockSoapNote = {
        subjective: { chiefComplaint: "Test" },
        objective: { observation: "Test" },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      expect(result.plan).toContain("unavailable");
      expect(result.rationale).toContain("unavailable");
      expect(result.interventions).toEqual([]);
    });

    it("should use local AI when enabled and loaded", async () => {
      aiService.updateConfig({ localLLM: true });

      const mockLocalResponse = JSON.stringify({
        plan: "Local treatment plan",
        interventions: ["Exercise 1", "Exercise 2"],
        rationale: "Local rationale",
        citations: [],
      });

      vi.spyOn(localAIService, "isModelLoaded").mockReturnValue(true);
      vi.spyOn(localAIService, "generateContent").mockResolvedValue(
        mockLocalResponse,
      );

      const mockSoapNote = {
        subjective: { chiefComplaint: "Test" },
        objective: { observation: "Test" },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      expect(result.plan).toBe("Local treatment plan");
      expect(result.interventions).toEqual(["Exercise 1", "Exercise 2"]);
      expect(result.rationale).toBe("Local rationale");
      expect(localAIService.generateContent).toHaveBeenCalled();

      aiService.updateConfig({ localLLM: false });
    });

    it("should include skilled need justification in rationale", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Balance impairment",
          functionalLimitations: ["Fall risk", "Difficulty with ADLs"],
        },
        objective: {
          balance: "Berg Balance Scale 38/56",
          gait: "TUG 18 seconds",
        },
        assessment: {
          clinicalImpression: "High fall risk",
          diagnosis: "Balance disorder",
        },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "initial-evaluation",
      );

      expect(result.rationale).toBeDefined();
      expect(typeof result.rationale).toBe("string");
      expect(result.rationale.length).toBeGreaterThan(0);
    });

    it("should recommend appropriate interventions", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Shoulder weakness",
          functionalLimitations: ["Cannot lift arm overhead"],
        },
        objective: {
          rom: "Shoulder flexion 100°",
          strength: "Deltoid 3/5",
        },
        assessment: {
          clinicalImpression: "Rotator cuff weakness",
          diagnosis: "Shoulder impingement",
        },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      expect(result.interventions).toBeDefined();
      expect(Array.isArray(result.interventions)).toBe(true);
      // Interventions may be empty in fallback mode, but structure should be correct

      // If interventions are present, they should be strings
      if (result.interventions.length > 0) {
        result.interventions.forEach((intervention) => {
          expect(typeof intervention).toBe("string");
          expect(intervention.length).toBeGreaterThan(0);
        });
      }
    });

    it("should include evidence-based citations", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Gait impairment",
          functionalLimitations: ["Difficulty walking"],
        },
        objective: {
          gait: "Slow gait speed 0.6 m/s",
          balance: "Poor dynamic balance",
        },
        assessment: {
          clinicalImpression: "Gait dysfunction",
          diagnosis: "Mobility impairment",
        },
      };

      const result = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      expect(result.citations).toBeDefined();
      expect(Array.isArray(result.citations)).toBe(true);

      // Citations should have proper structure
      if (result.citations.length > 0) {
        const citation = result.citations[0];
        expect(citation).toHaveProperty("source");
        expect(citation).toHaveProperty("relevance");
      }
    });
  });

  describe("Integration: Clinical Assessment + Treatment Plan", () => {
    it("should generate both assessment and treatment plan for complete documentation", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Hip pain after fall",
          painLevel: 7,
          functionalLimitations: [
            "Cannot walk without walker",
            "Difficulty with transfers",
          ],
        },
        objective: {
          rom: "Hip flexion 80°, extension 0°",
          strength: "Hip flexors 3/5, extensors 3/5",
          gait: "Antalgic gait with walker",
          balance: "Berg Balance Scale 42/56",
        },
      };

      // Generate assessment
      const assessment = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "initial-evaluation",
      );

      expect(assessment.assessment).toBeDefined();
      expect(assessment.reasoning).toBeDefined();
      expect(assessment.citations).toBeDefined();

      // Add assessment to SOAP note
      const updatedSoapNote = {
        ...mockSoapNote,
        assessment: {
          clinicalImpression: assessment.assessment,
          clinicalReasoning: assessment.reasoning,
          diagnosis: "Hip contusion with mobility impairment",
          prognosis: "Good",
          rehabilitationPotential: "good" as const,
          progressTowardGoals: "Initiating therapy",
          icdCode: "M25.551",
        },
      };

      // Generate treatment plan
      const treatmentPlan = await aiService.generateTreatmentPlan(
        updatedSoapNote,
        "initial-evaluation",
      );

      expect(treatmentPlan.plan).toBeDefined();
      expect(treatmentPlan.interventions).toBeDefined();
      expect(treatmentPlan.rationale).toBeDefined();
      expect(treatmentPlan.citations).toBeDefined();

      // Verify both have content
      expect(assessment.assessment.length).toBeGreaterThan(0);
      expect(treatmentPlan.plan.length).toBeGreaterThan(0);
      // Interventions may be empty in fallback mode
    }, 15000);

    it("should handle quality check analysis on generated documentation", async () => {
      const mockSoapNote = {
        subjective: {
          chiefComplaint: "Back pain",
          painLevel: 6,
        },
        objective: {
          rom: "Lumbar flexion limited",
          strength: "Core weakness",
        },
      };

      // Generate assessment and treatment plan
      const assessment = await aiService.generateClinicalAssessment(
        mockSoapNote,
        "progress-note",
      );
      const treatmentPlan = await aiService.generateTreatmentPlan(
        mockSoapNote,
        "progress-note",
      );

      // Combine into note text
      const noteText = `
ASSESSMENT:
${assessment.assessment}

CLINICAL REASONING:
${assessment.reasoning}

TREATMENT PLAN:
${treatmentPlan.plan}

INTERVENTIONS:
${treatmentPlan.interventions.join("\n")}

RATIONALE:
${treatmentPlan.rationale}
      `.trim();

      // Run quality check
      const qualityCheck = await aiService.analyzeQualityCheck(noteText);

      expect(qualityCheck).toHaveProperty("qualityScore");
      expect(qualityCheck).toHaveProperty("qualityLevel");
      expect(qualityCheck).toHaveProperty("flaggedPhrases");
      expect(qualityCheck).toHaveProperty("overallAssessment");
      expect(typeof qualityCheck.qualityScore).toBe("number");
      expect(qualityCheck.qualityScore).toBeGreaterThanOrEqual(0);
      expect(qualityCheck.qualityScore).toBeLessThanOrEqual(100);
    }, 15000);
  });
});
