import { describe, it, expect } from "vitest";
import {
  scoreCSSConstipation,
  interpretBristolScale,
  scoreWexnerFI,
  analyzeBowelDiary,
} from "../../utils/bowel-program-assessment";

describe("bowel-program-assessment utils", () => {
  describe("scoreCSSConstipation", () => {
    it("score 0-6 = Mild", () => {
      const r = scoreCSSConstipation([1, 1, 1, 1, 1, 0, 0, 0]);
      expect(r.severity).toBe("Mild");
      expect(r.score).toBe(5);
    });
    it("score 7-12 = Moderate", () => {
      const r = scoreCSSConstipation([2, 2, 2, 2, 1, 0, 0, 0]);
      expect(r.severity).toBe("Moderate");
    });
    it("score 13-20 = Severe", () => {
      const r = scoreCSSConstipation([3, 3, 3, 3, 2, 2, 2, 1]);
      expect(r.severity).toBe("Severe");
    });
    it("score >20 = Very severe", () => {
      const r = scoreCSSConstipation([4, 4, 4, 4, 4, 4, 4, 2]);
      expect(r.severity).toBe("Very severe");
    });
    it("includes recommendation", () => {
      expect(
        scoreCSSConstipation([0, 0, 0, 0, 0, 0, 0, 0]).recommendation,
      ).toBeTruthy();
    });
  });

  describe("interpretBristolScale", () => {
    it("type 1 = severe constipation", () =>
      expect(interpretBristolScale(1).interpretation).toContain(
        "constipation",
      ));
    it("type 2 = mild constipation", () =>
      expect(interpretBristolScale(2).interpretation).toContain(
        "constipation",
      ));
    it("type 3 = normal (target)", () => {
      const r = interpretBristolScale(3);
      expect(r.isTarget).toBe(true);
      expect(r.interpretation).toContain("Normal");
    });
    it("type 4 = normal (target)", () =>
      expect(interpretBristolScale(4).isTarget).toBe(true));
    it("type 5 = mild diarrhea tendency", () =>
      expect(interpretBristolScale(5).isTarget).toBe(false));
    it("type 6 = mild diarrhea", () =>
      expect(interpretBristolScale(6).interpretation).toContain("diarrhea"));
    it("type 7 = severe diarrhea", () =>
      expect(interpretBristolScale(7).interpretation).toContain("diarrhea"));
    it("clamps below 1 to 1", () =>
      expect(interpretBristolScale(0).type).toBe(1));
    it("clamps above 7 to 7", () =>
      expect(interpretBristolScale(8).type).toBe(7));
    it("rounds decimal types", () =>
      expect(interpretBristolScale(3.6).type).toBe(4));
  });

  describe("scoreWexnerFI", () => {
    it("score 0 = None (Continent)", () => {
      const r = scoreWexnerFI([0, 0, 0, 0, 0]);
      expect(r.severity).toBe("None");
      expect(r.score).toBe(0);
    });
    it("score 1-4 = Mild", () => {
      const r = scoreWexnerFI([1, 1, 1, 0, 0]);
      expect(r.severity).toBe("Mild");
    });
    it("score 5-9 = Moderate", () => {
      const r = scoreWexnerFI([2, 2, 2, 2, 1]);
      expect(r.severity).toBe("Moderate");
    });
    it("score >9 = Severe", () => {
      const r = scoreWexnerFI([4, 4, 4, 4, 4]);
      expect(r.severity).toBe("Severe");
      expect(r.score).toBe(20);
    });
  });

  describe("analyzeBowelDiary", () => {
    it("frequency <3 = constipation", () => {
      const r = analyzeBowelDiary(2, [2, 2], 3);
      expect(r.interpretation).toContain("constipation");
    });
    it("frequency >21 = diarrhea", () => {
      const r = analyzeBowelDiary(25, [6, 7], 0);
      expect(r.interpretation).toContain("diarrhea");
    });
    it("avgBristol <3 = hard stools", () => {
      const r = analyzeBowelDiary(5, [1, 2, 1], 5);
      expect(r.interpretation).toContain("Hard stools");
    });
    it("avgBristol >5 = loose stools", () => {
      const r = analyzeBowelDiary(10, [6, 7, 6], 0);
      expect(r.interpretation).toContain("Loose stools");
    });
    it("normal pattern returns WNL message", () => {
      const r = analyzeBowelDiary(7, [3, 4, 3], 0);
      expect(r.interpretation).toContain("normal");
    });
    it("calculates average Bristol type", () => {
      const r = analyzeBowelDiary(5, [3, 4, 3, 4], 0);
      expect(r.averageBristolType).toBe(3.5);
    });
    it("handles empty bristolTypes array", () => {
      const r = analyzeBowelDiary(5, [], 0);
      expect(r.averageBristolType).toBe(0);
    });
    it("targetFrequency is set", () => {
      expect(analyzeBowelDiary(5, [3], 0).targetFrequency).toBeTruthy();
    });
  });
});
