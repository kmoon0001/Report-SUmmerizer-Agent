/**
 * Property-Based Test: CPT Code Mapping Consistency (Task 9.7)
 *
 * Property 12: CPT Code Mapping Consistency
 * Validates: Requirements 3.5, 8.5
 *
 * Correctness Properties:
 * - mapInterventionToCPT() always returns one of the 4 valid codes or empty string
 * - Therapeutic exercise variants always map to 97110
 * - Manual therapy variants always map to 97140
 * - Gait training variants always map to 97116
 * - Neuromuscular re-education variants always map to 97112
 *
 * CPT Code Reference (AMA CPT 2026):
 * - 97110: Therapeutic exercise
 * - 97140: Manual therapy techniques
 * - 97116: Gait training
 * - 97112: Neuromuscular reeducation
 *
 * Evidence: AMA CPT Manual 2026, CMS Medicare Physician Fee Schedule
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { mapInterventionToCPT } from "../../../src/utils/medicare-compliance-validator";

const VALID_CPT_CODES = ["97110", "97140", "97116", "97112", ""] as const;

// Intervention keyword sets per CPT code
const THERAPEUTIC_EXERCISE_KEYWORDS = [
  "therapeutic exercise",
  "strengthening",
  "stretching",
  "rom exercise",
  "range of motion exercise",
];

const MANUAL_THERAPY_KEYWORDS = [
  "manual therapy",
  "joint mobilization",
  "soft tissue mobilization",
  "massage",
  "myofascial release",
];

const GAIT_TRAINING_KEYWORDS = [
  "gait training",
  "gait",
  "ambulation training",
  "walking training",
];

const NEUROMUSCULAR_KEYWORDS = [
  "neuromuscular",
  "balance training",
  "proprioception",
  "coordination training",
  "postural training",
];

describe("Property 12: CPT Code Mapping Consistency", () => {
  describe("Return value invariants", () => {
    it("always returns one of the 4 valid CPT codes or empty string", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (intervention) => {
            const result = mapInterventionToCPT(intervention);
            expect(VALID_CPT_CODES).toContain(result);
          },
        ),
        { numRuns: 200 },
      );
    });

    it("returns a string type for any input", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (intervention) => {
            const result = mapInterventionToCPT(intervention);
            expect(typeof result).toBe("string");
          },
        ),
        { numRuns: 200 },
      );
    });
  });

  describe("97110 - Therapeutic Exercise", () => {
    it("therapeutic exercise keyword always maps to 97110", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...THERAPEUTIC_EXERCISE_KEYWORDS),
          fc.string({ minLength: 0, maxLength: 30 }),
          fc.string({ minLength: 0, maxLength: 30 }),
          (keyword, prefix, suffix) => {
            const intervention = `${prefix} ${keyword} ${suffix}`;
            expect(mapInterventionToCPT(intervention)).toBe("97110");
          },
        ),
        { numRuns: 100 },
      );
    });

    it('"strengthening" always maps to 97110', () => {
      const variants = [
        "strengthening exercises",
        "hip strengthening",
        "quadriceps strengthening",
        "rotator cuff strengthening",
        "core strengthening program",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97110");
      });
    });

    it('"stretching" always maps to 97110', () => {
      const variants = [
        "hamstring stretching",
        "stretching program",
        "hip flexor stretching",
        "calf stretching",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97110");
      });
    });
  });

  describe("97140 - Manual Therapy", () => {
    it("manual therapy keyword always maps to 97140", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...MANUAL_THERAPY_KEYWORDS),
          fc.string({ minLength: 0, maxLength: 30 }),
          fc.string({ minLength: 0, maxLength: 30 }),
          (keyword, prefix, suffix) => {
            const intervention = `${prefix} ${keyword} ${suffix}`;
            expect(mapInterventionToCPT(intervention)).toBe("97140");
          },
        ),
        { numRuns: 100 },
      );
    });

    it('"joint mobilization" always maps to 97140', () => {
      const variants = [
        "joint mobilization grade III",
        "lumbar joint mobilization",
        "shoulder joint mobilization",
        "cervical joint mobilization",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97140");
      });
    });

    it('"myofascial release" always maps to 97140', () => {
      const variants = [
        "myofascial release technique",
        "thoracic myofascial release",
        "myofascial release for hip flexors",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97140");
      });
    });
  });

  describe("97116 - Gait Training", () => {
    it("gait training keyword always maps to 97116", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...GAIT_TRAINING_KEYWORDS),
          fc.string({ minLength: 0, maxLength: 30 }),
          fc.string({ minLength: 0, maxLength: 30 }),
          (keyword, prefix, suffix) => {
            const intervention = `${prefix} ${keyword} ${suffix}`;
            expect(mapInterventionToCPT(intervention)).toBe("97116");
          },
        ),
        { numRuns: 100 },
      );
    });

    it('"ambulation training" always maps to 97116', () => {
      const variants = [
        "ambulation training with walker",
        "community ambulation training",
        "stair ambulation training",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97116");
      });
    });
  });

  describe("97112 - Neuromuscular Reeducation", () => {
    it("neuromuscular keyword always maps to 97112", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...NEUROMUSCULAR_KEYWORDS),
          fc.string({ minLength: 0, maxLength: 30 }),
          fc.string({ minLength: 0, maxLength: 30 }),
          (keyword, prefix, suffix) => {
            const intervention = `${prefix} ${keyword} ${suffix}`;
            expect(mapInterventionToCPT(intervention)).toBe("97112");
          },
        ),
        { numRuns: 100 },
      );
    });

    it('"balance training" always maps to 97112', () => {
      const variants = [
        "balance training on foam",
        "dynamic balance training",
        "single-leg balance training",
        "balance training with perturbation",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97112");
      });
    });

    it('"proprioception" always maps to 97112', () => {
      const variants = [
        "proprioception training",
        "ankle proprioception exercises",
        "knee proprioception retraining",
      ];
      variants.forEach((v) => {
        expect(mapInterventionToCPT(v)).toBe("97112");
      });
    });
  });

  describe("Unrecognized interventions", () => {
    it("returns empty string for unrecognized interventions", () => {
      const unrecognized = [
        "ultrasound",
        "electrical stimulation",
        "hot pack",
        "ice pack",
        "traction",
        "iontophoresis",
      ];
      unrecognized.forEach((intervention) => {
        expect(mapInterventionToCPT(intervention)).toBe("");
      });
    });

    it("empty string input returns empty string", () => {
      expect(mapInterventionToCPT("")).toBe("");
    });
  });

  describe("Case insensitivity", () => {
    it("maps correctly regardless of case", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            { keyword: "therapeutic exercise", expected: "97110" },
            { keyword: "manual therapy", expected: "97140" },
            { keyword: "gait training", expected: "97116" },
            { keyword: "neuromuscular", expected: "97112" },
          ),
          fc.constantFrom("lower", "upper"),
          ({ keyword, expected }, caseType) => {
            const cased =
              caseType === "upper"
                ? keyword.toUpperCase()
                : keyword.toLowerCase();
            expect(mapInterventionToCPT(cased)).toBe(expected);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
