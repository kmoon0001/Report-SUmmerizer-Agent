/**
 * PT Clinical Red Flags & Safety Screening Tests
 */

import { describe, it, expect } from "vitest";
import {
  getSafetyScreeningById,
  getAllSafetyScreenings,
  getSafetyScreeningsByCategory,
  searchSafetyScreenings,
  getRedFlagsByCategory,
  getRedFlagsBySeverity,
  getScreeningCategories,
  assessSafetyRisk,
} from "../../data/pt-clinical-red-flags-safety";

describe("PT Clinical Red Flags & Safety Screening", () => {
  it("should have 5 safety screenings", () => {
    expect(getAllSafetyScreenings().length).toBe(5);
  });

  it("should return screening by ID", () => {
    const screening = getSafetyScreeningById("pt-sf-001");
    expect(screening?.condition).toContain("Cardiovascular");
  });

  it("should return undefined for invalid ID", () => {
    expect(getSafetyScreeningById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const screenings = getSafetyScreeningsByCategory("Cardiovascular");
    expect(screenings.length).toBeGreaterThan(0);
  });

  it("should search screenings", () => {
    const results = searchSafetyScreenings("red");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should get red flags by category", () => {
    const flags = getRedFlagsByCategory("Cardiac");
    expect(flags.length).toBeGreaterThan(0);
  });

  it("should get red flags by severity", () => {
    const flags = getRedFlagsBySeverity("Critical");
    expect(flags.length).toBeGreaterThan(0);
  });

  it("should return screening categories", () => {
    const categories = getScreeningCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should assess safety risk", () => {
    const assessment = assessSafetyRisk("pt-sf-001", [
      "Chest Pain with Exertion",
    ]);
    expect(assessment.riskLevel).toBeDefined();
    expect(Array.isArray(assessment.criticalFlags)).toBe(true);
    expect(Array.isArray(assessment.recommendations)).toBe(true);
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getSafetyScreeningById(null as any);
      getAllSafetyScreenings();
      getSafetyScreeningsByCategory("test");
      searchSafetyScreenings("test");
      getRedFlagsByCategory("test");
      getRedFlagsBySeverity("High");
      getScreeningCategories();
      assessSafetyRisk("test", ["test"]);
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllSafetyScreenings();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.condition).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.redFlags).toBeDefined();
      expect(s.screeningQuestions).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.precautions).toBeDefined();
      expect(s.emergencyIndicators).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllSafetyScreenings();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllSafetyScreenings();
    all.forEach((s) => {
      expect(s.redFlags.length).toBeGreaterThan(0);
      expect(s.screeningQuestions.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.precautions.length).toBeGreaterThan(0);
      expect(s.emergencyIndicators.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllSafetyScreenings();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should have red flags with required properties", () => {
    const all = getAllSafetyScreenings();
    all.forEach((s) => {
      s.redFlags.forEach((rf) => {
        expect(rf.name).toBeDefined();
        expect(rf.description).toBeDefined();
        expect(rf.category).toBeDefined();
        expect(["Critical", "High", "Moderate"]).toContain(rf.severity);
        expect(rf.clinicalSignificance).toBeDefined();
        expect(rf.requiredAction).toBeDefined();
        expect(rf.timeframe).toBeDefined();
      });
    });
  });

  it("should identify critical risk flags", () => {
    const criticalFlags = getRedFlagsBySeverity("Critical");
    expect(criticalFlags.length).toBeGreaterThan(0);
    criticalFlags.forEach((flag) => {
      expect(flag.severity).toBe("Critical");
    });
  });

  it("should assess high risk correctly", () => {
    const assessment = assessSafetyRisk("pt-sf-001", ["Dyspnea at Rest"]);
    expect(assessment.riskLevel).toBe("Critical");
    expect(assessment.criticalFlags.length).toBeGreaterThan(0);
  });

  it("should assess low risk correctly", () => {
    const assessment = assessSafetyRisk("pt-sf-001", ["No symptoms"]);
    expect(assessment.riskLevel).toBe("Low");
    expect(assessment.criticalFlags.length).toBe(0);
  });
});
