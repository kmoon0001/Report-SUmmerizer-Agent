import { describe, it, expect } from "vitest";
import {
  interpretOxfordScale,
  scoreICIQUI,
  analyzeBladderDiary,
  calculateVoidingProgression,
} from "../../utils/pelvic-floor-assessment";

describe("pelvic-floor-assessment utils", () => {
  describe("interpretOxfordScale", () => {
    it("score 0 = No contraction", () => {
      const r = interpretOxfordScale(0);
      expect(r.label).toBe("No contraction");
      expect(r.score).toBe(0);
    });
    it("score 1 = Flicker", () =>
      expect(interpretOxfordScale(1).label).toBe("Flicker"));
    it("score 2 = Weak", () =>
      expect(interpretOxfordScale(2).label).toBe("Weak"));
    it("score 3 = Moderate", () =>
      expect(interpretOxfordScale(3).label).toBe("Moderate"));
    it("score 4 = Good", () =>
      expect(interpretOxfordScale(4).label).toBe("Good"));
    it("score 5 = Strong", () =>
      expect(interpretOxfordScale(5).label).toBe("Strong"));
    it("clamps below 0 to 0", () =>
      expect(interpretOxfordScale(-1).score).toBe(0));
    it("clamps above 5 to 5", () =>
      expect(interpretOxfordScale(6).score).toBe(5));
    it("rounds decimal scores", () =>
      expect(interpretOxfordScale(2.7).label).toBe("Moderate"));
    it("includes recommendation", () =>
      expect(interpretOxfordScale(3).recommendation).toBeTruthy());
  });

  describe("scoreICIQUI", () => {
    it("score 0 = None", () => {
      const r = scoreICIQUI(0, 0, 0);
      expect(r.severity).toBe("None");
      expect(r.score).toBe(0);
    });
    it("score 3 = Slight", () => {
      const r = scoreICIQUI(1, 1, 1);
      expect(r.severity).toBe("Slight");
    });
    it("score 10 = Moderate", () => {
      const r = scoreICIQUI(3, 3, 4);
      expect(r.severity).toBe("Moderate");
    });
    it("score 15 = Severe", () => {
      const r = scoreICIQUI(5, 4, 6);
      expect(r.severity).toBe("Severe");
    });
    it("score 20 = Very severe", () => {
      const r = scoreICIQUI(5, 6, 9);
      expect(r.severity).toBe("Very severe");
    });
    it("MCID is 2", () => expect(scoreICIQUI(0, 0, 0).mcid).toBe(2));
  });

  describe("analyzeBladderDiary", () => {
    it("frequency >8 triggers bladder training message", () => {
      const r = analyzeBladderDiary(10, 0, 0);
      expect(r.interpretation).toContain("bladder training");
    });
    it("urgency >3 triggers urge suppression message", () => {
      const r = analyzeBladderDiary(6, 4, 0);
      expect(r.interpretation).toContain("urge suppression");
    });
    it("leakage >0 triggers PFMT message", () => {
      const r = analyzeBladderDiary(6, 1, 2);
      expect(r.interpretation).toContain("PFMT");
    });
    it("normal pattern returns WNL message", () => {
      const r = analyzeBladderDiary(6, 0, 0);
      expect(r.interpretation).toContain("normal");
    });
    it("calculates average voiding interval", () => {
      const r = analyzeBladderDiary(8, 0, 0, 24);
      expect(r.averageVoidingInterval).toBe(3.0);
    });
    it("target interval is 3 hours", () => {
      expect(analyzeBladderDiary(6, 0, 0).targetInterval).toBe(3);
    });
    it("handles 0 voids without division error", () => {
      const r = analyzeBladderDiary(0, 0, 0);
      expect(r.averageVoidingInterval).toBe(24);
    });
  });

  describe("calculateVoidingProgression", () => {
    it("generates steps from current to target", () => {
      const steps = calculateVoidingProgression(60, 120, 15);
      expect(steps[0]).toBe(60);
      expect(steps[steps.length - 1]).toBe(120);
    });
    it("includes target as last step", () => {
      const steps = calculateVoidingProgression(150, 180, 15);
      expect(steps[steps.length - 1]).toBe(180);
    });
    it("returns just target when already at target", () => {
      const steps = calculateVoidingProgression(180, 180, 15);
      expect(steps).toEqual([180]);
    });
    it("uses default target of 180 minutes", () => {
      const steps = calculateVoidingProgression(150);
      expect(steps[steps.length - 1]).toBe(180);
    });
  });
});
