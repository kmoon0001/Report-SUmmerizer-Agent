/**
 * Property-Based Test: Outcome Measure Interpretation (Task 6.4)
 *
 * Property 23: Outcome Measure Interpretation
 * Validates: Requirement 6.3
 *
 * Correctness Property:
 * For all valid scores within each tool's range:
 * - interpretOutcomeMeasure() always returns a non-empty string
 * - DASH (0-100): 4 disability levels
 * - LEFS (0-80): 3 functional limitation levels
 * - ODI (0-100): 5 disability levels
 * - NDI (0-100): 5 disability levels
 * - PSFS (0-10): 3 functional limitation levels
 *
 * Evidence: APTA Orthopedic Section CPGs, validated PRO instruments
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  interpretOutcomeMeasure,
  assessmentTools,
} from "../../../src/data/pt-orthopedic-data";

describe("Property 23: Outcome Measure Interpretation", () => {
  describe("DASH (Disabilities of the Arm, Shoulder and Hand) - 0 to 100", () => {
    it("always returns a non-empty string for any valid DASH score", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
          const result = interpretOutcomeMeasure("DASH", score);
          expect(result).toBeDefined();
          expect(typeof result).toBe("string");
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 200 },
      );
    });

    it("returns Minimal disability for DASH 0-20", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 20 }), (score) => {
          expect(interpretOutcomeMeasure("DASH", score)).toBe(
            "Minimal disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Mild disability for DASH 21-40", () => {
      fc.assert(
        fc.property(fc.integer({ min: 21, max: 40 }), (score) => {
          expect(interpretOutcomeMeasure("DASH", score)).toBe(
            "Mild disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Moderate disability for DASH 41-60", () => {
      fc.assert(
        fc.property(fc.integer({ min: 41, max: 60 }), (score) => {
          expect(interpretOutcomeMeasure("DASH", score)).toBe(
            "Moderate disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Severe disability for DASH 61-100", () => {
      fc.assert(
        fc.property(fc.integer({ min: 61, max: 100 }), (score) => {
          expect(interpretOutcomeMeasure("DASH", score)).toBe(
            "Severe disability",
          );
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("LEFS (Lower Extremity Functional Scale) - 0 to 80", () => {
    it("always returns a non-empty string for any valid LEFS score", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 80 }), (score) => {
          const result = interpretOutcomeMeasure("LEFS", score);
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 200 },
      );
    });

    it("returns Minimal functional limitation for LEFS 60-80", () => {
      fc.assert(
        fc.property(fc.integer({ min: 60, max: 80 }), (score) => {
          expect(interpretOutcomeMeasure("LEFS", score)).toBe(
            "Minimal functional limitation",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Moderate functional limitation for LEFS 40-59", () => {
      fc.assert(
        fc.property(fc.integer({ min: 40, max: 59 }), (score) => {
          expect(interpretOutcomeMeasure("LEFS", score)).toBe(
            "Moderate functional limitation",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Severe functional limitation for LEFS 0-39", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 39 }), (score) => {
          expect(interpretOutcomeMeasure("LEFS", score)).toBe(
            "Severe functional limitation",
          );
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("ODI (Oswestry Disability Index) - 0 to 100", () => {
    it("always returns a non-empty string for any valid ODI score", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
          const result = interpretOutcomeMeasure("ODI", score);
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 200 },
      );
    });

    it("returns Minimal disability for ODI 0-20", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 20 }), (score) => {
          expect(interpretOutcomeMeasure("ODI", score)).toBe(
            "Minimal disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Moderate disability for ODI 21-40", () => {
      fc.assert(
        fc.property(fc.integer({ min: 21, max: 40 }), (score) => {
          expect(interpretOutcomeMeasure("ODI", score)).toBe(
            "Moderate disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Severe disability for ODI 41-60", () => {
      fc.assert(
        fc.property(fc.integer({ min: 41, max: 60 }), (score) => {
          expect(interpretOutcomeMeasure("ODI", score)).toBe(
            "Severe disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Crippled for ODI 61-80", () => {
      fc.assert(
        fc.property(fc.integer({ min: 61, max: 80 }), (score) => {
          expect(interpretOutcomeMeasure("ODI", score)).toBe("Crippled");
        }),
        { numRuns: 100 },
      );
    });

    it("returns Bed-bound or exaggerating for ODI 81-100", () => {
      fc.assert(
        fc.property(fc.integer({ min: 81, max: 100 }), (score) => {
          expect(interpretOutcomeMeasure("ODI", score)).toBe(
            "Bed-bound or exaggerating",
          );
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("NDI (Neck Disability Index) - 0 to 100", () => {
    it("always returns a non-empty string for any valid NDI score", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
          const result = interpretOutcomeMeasure("NDI", score);
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 200 },
      );
    });

    it("returns No disability for NDI 0-8", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 8 }), (score) => {
          expect(interpretOutcomeMeasure("NDI", score)).toBe("No disability");
        }),
        { numRuns: 100 },
      );
    });

    it("returns Mild disability for NDI 9-18", () => {
      fc.assert(
        fc.property(fc.integer({ min: 9, max: 18 }), (score) => {
          expect(interpretOutcomeMeasure("NDI", score)).toBe("Mild disability");
        }),
        { numRuns: 100 },
      );
    });

    it("returns Moderate disability for NDI 19-34", () => {
      fc.assert(
        fc.property(fc.integer({ min: 19, max: 34 }), (score) => {
          expect(interpretOutcomeMeasure("NDI", score)).toBe(
            "Moderate disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Severe disability for NDI 35-50", () => {
      fc.assert(
        fc.property(fc.integer({ min: 35, max: 50 }), (score) => {
          expect(interpretOutcomeMeasure("NDI", score)).toBe(
            "Severe disability",
          );
        }),
        { numRuns: 100 },
      );
    });

    it("returns Complete disability for NDI 51-100", () => {
      fc.assert(
        fc.property(fc.integer({ min: 51, max: 100 }), (score) => {
          expect(interpretOutcomeMeasure("NDI", score)).toBe(
            "Complete disability",
          );
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("PSFS (Patient-Specific Functional Scale) - 0 to 10", () => {
    it("always returns a non-empty string for any valid PSFS score", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 10 }), (score) => {
          const result = interpretOutcomeMeasure("PSFS", score);
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("returns Minimal functional limitation for PSFS 8-10", () => {
      fc.assert(
        fc.property(fc.integer({ min: 8, max: 10 }), (score) => {
          expect(interpretOutcomeMeasure("PSFS", score)).toBe(
            "Minimal functional limitation",
          );
        }),
        { numRuns: 50 },
      );
    });

    it("returns Moderate functional limitation for PSFS 5-7", () => {
      fc.assert(
        fc.property(fc.integer({ min: 5, max: 7 }), (score) => {
          expect(interpretOutcomeMeasure("PSFS", score)).toBe(
            "Moderate functional limitation",
          );
        }),
        { numRuns: 50 },
      );
    });

    it("returns Severe functional limitation for PSFS 0-4", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 4 }), (score) => {
          expect(interpretOutcomeMeasure("PSFS", score)).toBe(
            "Severe functional limitation",
          );
        }),
        { numRuns: 50 },
      );
    });
  });

  describe("Unknown tool handling", () => {
    it("returns a non-empty string for unknown acronym", () => {
      const result = interpretOutcomeMeasure("UNKNOWN", 50);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("Assessment tool metadata integrity", () => {
    it("all tools have valid scoring ranges (min < max)", () => {
      assessmentTools.forEach((tool) => {
        expect(tool.scoringRange.min).toBeLessThan(tool.scoringRange.max);
      });
    });

    it("all tools have positive MCID values", () => {
      assessmentTools.forEach((tool) => {
        expect(tool.mcid).toBeGreaterThan(0);
      });
    });

    it("all tools have evidence level 3, 4, or 5", () => {
      assessmentTools.forEach((tool) => {
        expect([3, 4, 5]).toContain(tool.evidenceLevel);
      });
    });

    it("all tools have non-empty citations", () => {
      assessmentTools.forEach((tool) => {
        expect(tool.citation.length).toBeGreaterThan(0);
      });
    });
  });
});
