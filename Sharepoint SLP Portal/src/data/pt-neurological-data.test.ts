import { describe, it, expect } from "vitest";
import {
  interpretNeurologicalAssessment,
  calculateFallRiskFromBBS,
  calculateFallRiskFromTUG,
} from "./pt-neurological-data";

describe("Neurological Data Interpretations", () => {
  describe("interpretNeurologicalAssessment", () => {
    it("correctly interprets Fugl-Meyer Assessment (FMA) scores", () => {
      expect(interpretNeurologicalAssessment("FMA", 100)).toBe(
        "Excellent motor recovery",
      );
      expect(interpretNeurologicalAssessment("FMA", 90)).toBe(
        "Good motor recovery",
      );
      expect(interpretNeurologicalAssessment("FMA", 60)).toBe(
        "Moderate motor recovery",
      );
      expect(interpretNeurologicalAssessment("FMA", 30)).toBe(
        "Severe motor impairment",
      );
    });

    it("correctly interprets Berg Balance Scale (BBS) scores", () => {
      expect(interpretNeurologicalAssessment("BBS", 56)).toBe(
        "Independent - Low fall risk",
      );
      expect(interpretNeurologicalAssessment("BBS", 45)).toBe(
        "Independent with assistive device - Moderate fall risk",
      );
      expect(interpretNeurologicalAssessment("BBS", 30)).toBe(
        "Requires assistance - High fall risk",
      );
      expect(interpretNeurologicalAssessment("BBS", 10)).toBe(
        "Wheelchair bound - Very high fall risk",
      );
    });

    it("correctly interprets Timed Up and Go (TUG) scores", () => {
      expect(interpretNeurologicalAssessment("TUG", 8)).toBe(
        "Normal mobility - Low fall risk",
      );
      expect(interpretNeurologicalAssessment("TUG", 12)).toBe(
        "Mild mobility impairment - Moderate fall risk",
      );
      expect(interpretNeurologicalAssessment("TUG", 18)).toBe(
        "Moderate mobility impairment - High fall risk",
      );
      expect(interpretNeurologicalAssessment("TUG", 25)).toBe(
        "Severe mobility impairment - Very high fall risk",
      );
    });

    it("returns default message for unknown tools", () => {
      expect(interpretNeurologicalAssessment("XYZ", 50)).toBe(
        "Unknown assessment tool",
      );
    });
  });

  describe("calculateFallRiskFromBBS", () => {
    it("identifies Low risk for BBS >= 56", () => {
      const result = calculateFallRiskFromBBS(56);
      expect(result.risk).toBe("Low");
      expect(result.recommendations).toContain("Annual balance reassessment");
    });

    it("identifies Moderate risk for BBS between 45 and 55", () => {
      const result = calculateFallRiskFromBBS(50);
      expect(result.risk).toBe("Moderate");
      expect(result.recommendations).toContain("Home safety assessment");
    });

    it("identifies High risk for BBS between 21 and 44", () => {
      const result = calculateFallRiskFromBBS(30);
      expect(result.risk).toBe("High");
      expect(result.recommendations).toContain("Assistive device required");
    });

    it("identifies Very High risk for BBS < 21", () => {
      const result = calculateFallRiskFromBBS(10);
      expect(result.risk).toBe("Very High");
      expect(result.recommendations).toContain("Wheelchair mobility primary");
    });
  });

  describe("calculateFallRiskFromTUG", () => {
    it("identifies Low risk for TUG <= 10", () => {
      const result = calculateFallRiskFromTUG(5);
      expect(result.risk).toBe("Low");
    });

    it("identifies Moderate risk for TUG 11-14", () => {
      const result = calculateFallRiskFromTUG(12);
      expect(result.risk).toBe("Moderate");
    });

    it("identifies High risk for TUG 15-20", () => {
      const result = calculateFallRiskFromTUG(18);
      expect(result.risk).toBe("High");
    });

    it("identifies Very High risk for TUG > 20", () => {
      const result = calculateFallRiskFromTUG(30);
      expect(result.risk).toBe("Very High");
    });
  });
});
