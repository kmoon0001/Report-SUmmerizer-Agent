import { describe, it, expect } from "vitest";
import { VNEST_DATA, PACE_SCORING } from "./aphasia-data";

describe("Aphasia Data", () => {
  describe("VNeST Data", () => {
    it("has valid structure for all verbs", () => {
      const verbs = Object.keys(VNEST_DATA);
      expect(verbs.length).toBeGreaterThan(0);

      verbs.forEach((verb) => {
        const data = VNEST_DATA[verb as keyof typeof VNEST_DATA];
        expect(data).toHaveProperty("agents");
        expect(data).toHaveProperty("patients");
        expect(data).toHaveProperty("locations");
        expect(data.agents.length).toBeGreaterThan(0);
        expect(data.patients.length).toBeGreaterThan(0);
      });
    });
  });

  describe("PACE Scoring", () => {
    it("has correct scoring levels", () => {
      expect(PACE_SCORING.length).toBeGreaterThan(0);
      PACE_SCORING.forEach((item) => {
        expect(item.score).toBeDefined();
        expect(item.description).toBeTruthy();
        expect(item.label).toBeTruthy();
      });
    });
  });
});
