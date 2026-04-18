import { describe, it, expect } from "vitest";
import {
  calculateTotalScore,
  calculateWabScore,
  getMocaInterpretation,
} from "./clinical-calculators";

describe("Clinical Calculators", () => {
  describe("calculateTotalScore", () => {
    it("sums all values in the object and returns SHAP attribution", () => {
      const scores = { a: 5, b: 3, c: 2 };
      const result = calculateTotalScore(scores);
      expect(result.value).toBe(10);
      expect(result.shapValues).toEqual({ a: 5, b: 3, c: 2 });
    });

    it("handles empty object", () => {
      const result = calculateTotalScore({});
      expect(result.value).toBe(0);
      expect(result.shapValues).toEqual({});
    });
  });

  describe("calculateWabScore", () => {
    it("calculates AQ correctly (sum * 2) and returns SHAP attribution", () => {
      const scores = { spontaneous: 10, auditory: 5, repetition: 5, naming: 5 };
      // Sum = 25, AQ = 50
      const result = calculateWabScore(scores);
      expect(result.value).toBe(50);
      expect(result.shapValues["spontaneous"]).toBe(20);
      expect(result.shapValues["naming"]).toBe(10);
    });
  });

  describe("getMocaInterpretation", () => {
    it("returns Normal for 26-30", () => {
      expect(getMocaInterpretation(26)?.label).toBe("Normal");
      expect(getMocaInterpretation(30)?.label).toBe("Normal");
    });

    it("returns MCI for 18-25", () => {
      expect(getMocaInterpretation(18)?.label).toBe(
        "Mild Cognitive Impairment (MCI)",
      );
      expect(getMocaInterpretation(25)?.label).toBe(
        "Mild Cognitive Impairment (MCI)",
      );
    });

    it("returns Moderate for 10-17", () => {
      expect(getMocaInterpretation(10)?.label).toBe(
        "Moderate Cognitive Impairment",
      );
      expect(getMocaInterpretation(17)?.label).toBe(
        "Moderate Cognitive Impairment",
      );
    });

    it("returns Severe for 0-9", () => {
      expect(getMocaInterpretation(0)?.label).toBe(
        "Severe Cognitive Impairment",
      );
      expect(getMocaInterpretation(9)?.label).toBe(
        "Severe Cognitive Impairment",
      );
    });

    it("returns null for out of range", () => {
      expect(getMocaInterpretation(31)).toBeNull();
      expect(getMocaInterpretation(-1)).toBeNull();
    });
  });
});
