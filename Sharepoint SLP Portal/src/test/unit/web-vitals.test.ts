import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWebVitalsThresholds } from "../../hooks/useWebVitals";

describe("Web Vitals Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWebVitalsThresholds", () => {
    it("should return Web Vitals thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toBeDefined();
      expect(thresholds.LCP).toBeDefined();
      expect(thresholds.FID).toBeDefined();
      expect(thresholds.CLS).toBeDefined();
      expect(thresholds.TTFB).toBeDefined();
      expect(thresholds.FCP).toBeDefined();
    });

    it("should have good and poor thresholds for each metric", () => {
      const thresholds = getWebVitalsThresholds();

      Object.values(thresholds).forEach((threshold) => {
        expect(threshold.good).toBeDefined();
        expect(threshold.poor).toBeDefined();
        expect(threshold.good).toBeLessThan(threshold.poor);
      });
    });

    it("should have correct LCP thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds.LCP.good).toBe(2500);
      expect(thresholds.LCP.poor).toBe(4000);
    });

    it("should have correct FID thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds.FID.good).toBe(100);
      expect(thresholds.FID.poor).toBe(300);
    });

    it("should have correct CLS thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds.CLS.good).toBe(0.1);
      expect(thresholds.CLS.poor).toBe(0.25);
    });

    it("should have correct TTFB thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds.TTFB.good).toBe(600);
      expect(thresholds.TTFB.poor).toBe(1800);
    });

    it("should have correct FCP thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds.FCP.good).toBe(1800);
      expect(thresholds.FCP.poor).toBe(3000);
    });
  });
});
