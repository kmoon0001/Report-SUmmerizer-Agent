import { describe, it, expect } from "vitest";
import {
  calculateTargetHeartRate,
  calculateVO2MaxRockport,
  interpretSixMWT,
} from "./pt-clinical-calculators";

describe("PT Clinical Calculators with SHAP Attribution", () => {
  describe("calculateTargetHeartRate", () => {
    it("calculates Karvonen zones and includes SHAP attribution for age and RHR", () => {
      const result = calculateTargetHeartRate(65, 70); // age 65, rhr 70

      expect(result.zones.moderate.min).toBeGreaterThan(70);
      expect(result.shapValues?.["age"]).toBeDefined();
      expect(result.shapValues?.["restingHR"]).toBeDefined();
    });
  });

  describe("calculateVO2MaxRockport", () => {
    it("calculates VO2Max and includes SHAP attribution", () => {
      // ageMinutes, weightKg, walkTimeMinutes, heartRateBpm, isMale
      const result = calculateVO2MaxRockport(65, 75, 12.5, 110, true);

      expect(result.vo2MaxMlKgMin).toBeGreaterThan(0);
      expect(result.shapValues?.["weight"]).toBeDefined();
    });
  });

  describe("interpretSixMWT", () => {
    it("calculates predicted 6MWT distance with demographic attribution", () => {
      const result = interpretSixMWT(300, 70, 175, 75, true);

      expect(result.predictedNormal).toBeGreaterThan(0);
      expect(result.shapValues?.["age"]).toBeDefined();
      expect(result.shapValues?.["height"]).toBeDefined();
      expect(result.shapValues?.["weight"]).toBeDefined();
    });
  });
});
