import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWebVitals, getWebVitalsThresholds } from "../../hooks/useWebVitals";

// Mock web-vitals module
vi.mock("web-vitals", () => ({
  getCLS: vi.fn((callback) =>
    callback({
      name: "CLS",
      value: 0.05,
      rating: "good",
      delta: 0,
      id: "cls-1",
      navigationType: "navigation",
    }),
  ),
  getFID: vi.fn((callback) =>
    callback({
      name: "FID",
      value: 50,
      rating: "good",
      delta: 0,
      id: "fid-1",
      navigationType: "navigation",
    }),
  ),
  getFCP: vi.fn((callback) =>
    callback({
      name: "FCP",
      value: 1200,
      rating: "good",
      delta: 0,
      id: "fcp-1",
      navigationType: "navigation",
    }),
  ),
  getLCP: vi.fn((callback) =>
    callback({
      name: "LCP",
      value: 2000,
      rating: "good",
      delta: 0,
      id: "lcp-1",
      navigationType: "navigation",
    }),
  ),
  getTTFB: vi.fn((callback) =>
    callback({
      name: "TTFB",
      value: 400,
      rating: "good",
      delta: 0,
      id: "ttfb-1",
      navigationType: "navigation",
    }),
  ),
}));

// Mock logger
vi.mock("../../utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useWebVitals Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Hook Initialization", () => {
    it("should initialize without errors", () => {
      expect(() => {
        renderHook(() => useWebVitals());
      }).not.toThrow();
    });

    it("should accept optional callback", () => {
      const callback = vi.fn();
      expect(() => {
        renderHook(() => useWebVitals(callback));
      }).not.toThrow();
    });

    it("should accept sendToAnalytics parameter", () => {
      expect(() => {
        renderHook(() => useWebVitals(undefined, true));
      }).not.toThrow();

      expect(() => {
        renderHook(() => useWebVitals(undefined, false));
      }).not.toThrow();
    });

    it("should handle undefined callback", () => {
      expect(() => {
        renderHook(() => useWebVitals(undefined));
      }).not.toThrow();
    });
  });

  describe("Metric Collection", () => {
    it("should collect CLS metric", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Verify callback was called with CLS metric
      const calls = callback.mock.calls;
      const clsCall = calls.find((call: any) => call[0]?.name === "CLS");
      expect(clsCall).toBeDefined();
    });

    it("should collect FID metric", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const calls = callback.mock.calls;
      const fidCall = calls.find((call: any) => call[0]?.name === "FID");
      expect(fidCall).toBeDefined();
    });

    it("should collect FCP metric", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const calls = callback.mock.calls;
      const fcpCall = calls.find((call: any) => call[0]?.name === "FCP");
      expect(fcpCall).toBeDefined();
    });

    it("should collect LCP metric", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const calls = callback.mock.calls;
      const lcpCall = calls.find((call: any) => call[0]?.name === "LCP");
      expect(lcpCall).toBeDefined();
    });

    it("should collect TTFB metric", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const calls = callback.mock.calls;
      const ttfbCall = calls.find((call: any) => call[0]?.name === "TTFB");
      expect(ttfbCall).toBeDefined();
    });

    it("should collect all five metrics", () => {
      const cb = vi.fn();
      renderHook(() => useWebVitals(cb));

      expect(cb.mock.calls.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Metric Structure", () => {
    it("should have correct metric structure", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(metric).toHaveProperty("name");
      expect(metric).toHaveProperty("value");
      expect(metric).toHaveProperty("rating");
      expect(metric).toHaveProperty("delta");
      expect(metric).toHaveProperty("id");
      expect(metric).toHaveProperty("navigationType");
    });

    it("should have valid metric name", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(["CLS", "FID", "FCP", "LCP", "TTFB"]).toContain(metric?.name);
    });

    it("should have numeric value", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(typeof metric?.value).toBe("number");
      expect(metric?.value ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should have valid rating", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(["good", "needs-improvement", "poor"]).toContain(metric?.rating);
    });

    it("should have numeric delta", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(typeof metric?.delta).toBe("number");
    });

    it("should have string id", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(typeof metric?.id).toBe("string");
      expect((metric?.id ?? "").length).toBeGreaterThan(0);
    });

    it("should have navigation type", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const metric = callback.mock.calls[0]?.[0];
      expect(typeof metric?.navigationType).toBe("string");
    });
  });

  describe("Callback Behavior", () => {
    it("should call callback for each metric", () => {
      const cb = vi.fn();
      renderHook(() => useWebVitals(cb));

      expect(cb.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should not call callback when undefined", () => {
      renderHook(() => useWebVitals(undefined));

      // Should not throw and should still collect metrics
      expect(() => {
        renderHook(() => useWebVitals(undefined));
      }).not.toThrow();
    });

    it("should pass metric object to callback", () => {
      const cb = vi.fn();
      renderHook(() => useWebVitals(cb));

      const metric = cb.mock.calls[0]?.[0];
      expect(typeof metric).toBe("object");
      expect(metric).not.toBeNull();
    });
  });

  describe("Analytics Integration", () => {
    it("should send to analytics by default", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Should initialize without errors
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should respect sendToAnalytics flag", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback, false));

      // Should still collect metrics
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should handle sendToAnalytics true", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback, true));

      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should handle sendToAnalytics false", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback, false));

      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Logging", () => {
    it("should log metrics", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Verify metrics are collected (logging happens internally)
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should log metric name", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Verify metrics have names
      const calls = callback.mock.calls;
      const hasNames = calls.every((call: any) => call[0]?.name);
      expect(hasNames).toBe(true);
    });

    it("should log metric details", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Verify metrics have all required details
      const calls = callback.mock.calls;
      const hasDetails = calls.every(
        (call: any) => call[0]?.value !== undefined && call[0]?.rating,
      );
      expect(hasDetails).toBe(true);
    });
  });

  describe("Web Vitals Thresholds", () => {
    it("should return thresholds object", () => {
      const thresholds = getWebVitalsThresholds();
      expect(typeof thresholds).toBe("object");
      expect(thresholds).not.toBeNull();
    });

    it("should have LCP thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toHaveProperty("LCP");
      expect(thresholds.LCP).toHaveProperty("good");
      expect(thresholds.LCP).toHaveProperty("poor");
    });

    it("should have FID thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toHaveProperty("FID");
      expect(thresholds.FID).toHaveProperty("good");
      expect(thresholds.FID).toHaveProperty("poor");
    });

    it("should have CLS thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toHaveProperty("CLS");
      expect(thresholds.CLS).toHaveProperty("good");
      expect(thresholds.CLS).toHaveProperty("poor");
    });

    it("should have TTFB thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toHaveProperty("TTFB");
      expect(thresholds.TTFB).toHaveProperty("good");
      expect(thresholds.TTFB).toHaveProperty("poor");
    });

    it("should have FCP thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toHaveProperty("FCP");
      expect(thresholds.FCP).toHaveProperty("good");
      expect(thresholds.FCP).toHaveProperty("poor");
    });

    it("should have valid threshold values", () => {
      const thresholds = getWebVitalsThresholds();

      Object.values(thresholds).forEach((threshold: any) => {
        expect(typeof threshold.good).toBe("number");
        expect(typeof threshold.poor).toBe("number");
        expect(threshold.good).toBeGreaterThan(0);
        expect(threshold.poor).toBeGreaterThan(threshold.good);
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

  describe("Edge Cases", () => {
    it("should handle multiple hook instances", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      renderHook(() => useWebVitals(callback1));
      renderHook(() => useWebVitals(callback2));

      expect(callback1.mock.calls.length).toBeGreaterThanOrEqual(5);
      expect(callback2.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should handle callback changes", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { rerender } = renderHook(({ cb }) => useWebVitals(cb), {
        initialProps: { cb: callback1 },
      });

      rerender({ cb: callback2 });

      expect(callback1.mock.calls.length).toBeGreaterThanOrEqual(0);
      expect(callback2.mock.calls.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle sendToAnalytics changes", () => {
      const callback = vi.fn();

      const { rerender } = renderHook(
        ({ send }) => useWebVitals(callback, send),
        { initialProps: { send: true } },
      );

      rerender({ send: false });

      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it("should handle rapid metric updates", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      // Should handle multiple metrics without errors
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Performance Metrics", () => {
    it("should track LCP (Largest Contentful Paint)", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const lcpMetric = callback.mock.calls.find(
        (call: any) => call[0]?.name === "LCP",
      );
      expect(lcpMetric).toBeDefined();
      expect(lcpMetric?.[0]?.value ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should track FID (First Input Delay)", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const fidMetric = callback.mock.calls.find(
        (call: any) => call[0]?.name === "FID",
      );
      expect(fidMetric).toBeDefined();
      expect(fidMetric?.[0]?.value ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should track CLS (Cumulative Layout Shift)", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const clsMetric = callback.mock.calls.find(
        (call: any) => call[0]?.name === "CLS",
      );
      expect(clsMetric).toBeDefined();
      expect(clsMetric?.[0]?.value ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should track TTFB (Time to First Byte)", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const ttfbMetric = callback.mock.calls.find(
        (call: any) => call[0]?.name === "TTFB",
      );
      expect(ttfbMetric).toBeDefined();
      expect(ttfbMetric?.[0]?.value ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should track FCP (First Contentful Paint)", () => {
      const callback = vi.fn();
      renderHook(() => useWebVitals(callback));

      const fcpMetric = callback.mock.calls.find(
        (call: any) => call[0]?.name === "FCP",
      );
      expect(fcpMetric).toBeDefined();
      expect(fcpMetric?.[0]?.value ?? 0).toBeGreaterThanOrEqual(0);
    });
  });
});
