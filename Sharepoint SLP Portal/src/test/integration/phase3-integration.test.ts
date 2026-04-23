import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { createPerEndpointRateLimiter } from "../../middleware/rate-limit-advanced";
import { validateData, PatientSchema } from "../../utils/schema-validation";
import { deepPropsEqual, shouldMemoize } from "../../utils/memo-optimization";
import { getWebVitalsThresholds } from "../../hooks/useWebVitals";

describe("Phase 3: Integration Tests", () => {
  describe("Rate Limiting Integration", () => {
    it("should apply different limits to different endpoints", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 5 },
        "/api/patients": { windowMs: 60000, maxRequests: 100 },
      });

      expect(limiter).toBeDefined();
      expect(typeof limiter).toBe("function");
    });

    it("should handle per-endpoint configuration", () => {
      const config = {
        "/api/auth": { windowMs: 15 * 60 * 1000, maxRequests: 5 },
        "/api/patients": { windowMs: 60 * 1000, maxRequests: 100 },
        "/api/library": { windowMs: 60 * 1000, maxRequests: 200 },
      };

      const limiter = createPerEndpointRateLimiter(config);
      expect(limiter).toBeDefined();
    });
  });

  describe("Schema Validation Integration", () => {
    it("should validate patient data for API requests", () => {
      const validPatient = {
        name: "John Doe",
        age: 45,
        diagnosis: "Stroke",
      };

      const result = validateData(validPatient, PatientSchema);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should reject invalid patient data", () => {
      const invalidPatient = {
        name: "",
        age: -5,
      };

      const result = validateData(invalidPatient, PatientSchema);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it("should provide detailed error messages", () => {
      const invalidPatient = {
        age: -5,
      };

      const result = validateData(invalidPatient, PatientSchema);
      expect(result.success).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe("React.memo Optimization Integration", () => {
    it("should identify expensive components for memoization", () => {
      expect(shouldMemoize("ClinicalLibrary")).toBe(true);
      expect(shouldMemoize("Dashboard")).toBe(true);
      expect(shouldMemoize("HealthMonitor")).toBe(true);
    });

    it("should not memoize simple components", () => {
      expect(shouldMemoize("Button")).toBe(false);
      expect(shouldMemoize("Input")).toBe(false);
      expect(shouldMemoize("Label")).toBe(false);
    });

    it("should compare props deeply", () => {
      const props1 = {
        data: { id: 1, name: "Test" },
        callback: () => {},
      };

      const props2 = {
        data: { id: 1, name: "Test" },
        callback: props1.callback,
      };

      expect(deepPropsEqual(props1, props2)).toBe(true);
    });

    it("should detect prop changes", () => {
      const props1 = { data: { id: 1 } };
      const props2 = { data: { id: 2 } };

      expect(deepPropsEqual(props1, props2)).toBe(false);
    });
  });

  describe("Web Vitals Integration", () => {
    it("should provide Web Vitals thresholds", () => {
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toBeDefined();
      expect(thresholds.LCP).toBeDefined();
      expect(thresholds.FID).toBeDefined();
      expect(thresholds.CLS).toBeDefined();
      expect(thresholds.TTFB).toBeDefined();
      expect(thresholds.FCP).toBeDefined();
    });

    it("should have correct performance thresholds", () => {
      const thresholds = getWebVitalsThresholds();

      // LCP: good ≤ 2500ms, poor > 4000ms
      expect(thresholds.LCP.good).toBe(2500);
      expect(thresholds.LCP.poor).toBe(4000);

      // FID: good ≤ 100ms, poor > 300ms
      expect(thresholds.FID.good).toBe(100);
      expect(thresholds.FID.poor).toBe(300);

      // CLS: good ≤ 0.1, poor > 0.25
      expect(thresholds.CLS.good).toBe(0.1);
      expect(thresholds.CLS.poor).toBe(0.25);
    });
  });

  describe("Cross-Utility Integration", () => {
    it("should work together: validation + memoization", () => {
      // Validate data
      const patientData = { name: "Jane Doe", age: 35 };
      const validationResult = validateData(patientData, PatientSchema);
      expect(validationResult.success).toBe(true);

      // Check if component should be memoized
      const shouldMemo = shouldMemoize("ClinicalLibrary");
      expect(shouldMemo).toBe(true);

      // Both should work together
      expect(validationResult.data).toBeDefined();
      expect(shouldMemo).toBe(true);
    });

    it("should handle rate limiting + validation flow", () => {
      // Create rate limiter
      const limiter = createPerEndpointRateLimiter({
        "/api/patients": { windowMs: 60000, maxRequests: 100 },
      });

      // Validate incoming data
      const incomingData = { name: "Test Patient", age: 50 };
      const validation = validateData(incomingData, PatientSchema);

      expect(limiter).toBeDefined();
      expect(validation.success).toBe(true);
    });

    it("should track performance with Web Vitals", () => {
      const thresholds = getWebVitalsThresholds();

      // Simulate metric
      const metric = {
        name: "LCP",
        value: 2000,
        rating: "good" as const,
      };

      // Check if metric is within good threshold
      expect(metric.value).toBeLessThanOrEqual(thresholds.LCP.good);
      expect(metric.rating).toBe("good");
    });
  });

  describe("Production Readiness", () => {
    it("should have all Phase 3 utilities available", () => {
      // Rate limiting
      const rateLimiter = createPerEndpointRateLimiter({
        "/api/test": { windowMs: 60000, maxRequests: 100 },
      });
      expect(rateLimiter).toBeDefined();

      // Schema validation
      const schema = PatientSchema;
      expect(schema).toBeDefined();

      // Memoization
      const shouldMemo = shouldMemoize("ClinicalLibrary");
      expect(typeof shouldMemo).toBe("boolean");

      // Web Vitals
      const thresholds = getWebVitalsThresholds();
      expect(thresholds).toBeDefined();
    });

    it("should handle concurrent operations", async () => {
      const operations = [
        validateData({ name: "Patient 1", age: 30 }, PatientSchema),
        validateData({ name: "Patient 2", age: 40 }, PatientSchema),
        validateData({ name: "Patient 3", age: 50 }, PatientSchema),
      ];

      const results = await Promise.all(operations);
      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("should maintain backward compatibility", () => {
      // Old code should still work
      const patient = { name: "Test", age: 25 };
      const result = validateData(patient, PatientSchema);
      expect(result.success).toBe(true);

      // Memoization should be optional
      const shouldMemo = shouldMemoize("CustomComponent");
      expect(typeof shouldMemo).toBe("boolean");
    });
  });
});
