/**
 * Property-Based Test: Medicare Compliance Validation (Task 9.4)
 *
 * Property 3: Medicare Compliance Validation
 * Validates: Requirements 3.2, 8.1, 8.2, 8.3
 *
 * Correctness Properties:
 * - For any note missing skilled need keywords, always returns critical flag
 * - For any note with objective data, does NOT return objective-data critical flag
 * - All compliance flags always have regulation references
 * - All compliance flags always have suggestion text
 * - Severity is always 'critical' | 'warning' | 'info'
 *
 * Evidence: Medicare Benefit Policy Manual Chapter 15, Jimmo v. Sebelius (2013)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validateMedicareCompliance } from "../../../src/utils/medicare-compliance-validator";

// Skilled need keywords from the validator
const SKILLED_KEYWORDS = [
  "therapeutic",
  "neuromuscular",
  "manual therapy",
  "gait training",
  "skilled",
  "clinical judgment",
  "clinical decision",
  "complex",
  "specialized",
  "professional skill",
];

// Objective data indicators from the validator
const OBJECTIVE_INDICATORS = [
  "rom",
  "range of motion",
  "degrees",
  "strength",
  "mmt",
  "manual muscle test",
  "gait speed",
  "balance",
  "berg",
  "tug",
  "timed up and go",
  "meters",
  "seconds",
  "repetitions",
  "distance",
  "measurement",
];

describe("Property 3: Medicare Compliance Validation", () => {
  describe("Compliance flag structure invariants", () => {
    it("all flags always have non-empty regulation references", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 200 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);
          flags.forEach((flag) => {
            expect(flag.regulation).toBeDefined();
            expect(flag.regulation.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("all flags always have non-empty suggestion text", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 200 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);
          flags.forEach((flag) => {
            expect(flag.suggestion).toBeDefined();
            expect(flag.suggestion.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("all flags always have valid severity level", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 200 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);
          flags.forEach((flag) => {
            expect(["critical", "warning", "info"]).toContain(flag.severity);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("all flags always have non-empty category", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 200 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);
          flags.forEach((flag) => {
            expect(flag.category).toBeDefined();
            expect(flag.category.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Skilled need justification (Medicare Chapter 15, Section 220.2)", () => {
    it("note without any skilled keyword always returns critical skilled-need flag", () => {
      fc.assert(
        fc.property(
          // Generate text that contains none of the skilled keywords
          fc.string({ minLength: 10, maxLength: 200 }).filter((s) => {
            const lower = s.toLowerCase();
            return !SKILLED_KEYWORDS.some((kw) => lower.includes(kw));
          }),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const hasSkilledFlag = flags.some(
              (f) => f.severity === "critical" && f.category === "skilled-need",
            );
            expect(hasSkilledFlag).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });

    it("note containing a skilled keyword does NOT return skilled-need critical flag", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SKILLED_KEYWORDS),
          fc.string({ minLength: 5, maxLength: 50 }),
          (keyword, prefix) => {
            const noteText = `${prefix} ${keyword} assessment performed`;
            const flags = validateMedicareCompliance(noteText);
            const hasSkilledFlag = flags.some(
              (f) => f.severity === "critical" && f.category === "skilled-need",
            );
            expect(hasSkilledFlag).toBe(false);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Objective data presence (Medicare Chapter 15, Section 220.1.3)", () => {
    it("note without objective data always returns critical objective-data flag", () => {
      fc.assert(
        fc.property(
          // Text with no objective indicators and no skilled keywords
          fc.constantFrom(
            "Patient attended session today.",
            "Treatment was provided.",
            "Patient participated in therapy.",
            "Session completed without issues.",
            "Patient was seen for physical therapy.",
          ),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const hasObjectiveFlag = flags.some(
              (f) =>
                f.severity === "critical" && f.category === "objective-data",
            );
            expect(hasObjectiveFlag).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });

    it("note containing objective data does NOT return objective-data critical flag", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...OBJECTIVE_INDICATORS),
          fc.string({ minLength: 5, maxLength: 50 }),
          (indicator, prefix) => {
            const noteText = `${prefix} ${indicator} measured during session`;
            const flags = validateMedicareCompliance(noteText);
            const hasObjectiveFlag = flags.some(
              (f) =>
                f.severity === "critical" && f.category === "objective-data",
            );
            expect(hasObjectiveFlag).toBe(false);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Regulation reference format", () => {
    it("skilled-need flags always reference Medicare Benefit Policy Manual Chapter 15", () => {
      const noteText = "Patient attended session.";
      const flags = validateMedicareCompliance(noteText);
      const skilledFlag = flags.find((f) => f.category === "skilled-need");
      expect(skilledFlag).toBeDefined();
      expect(skilledFlag!.regulation).toContain(
        "Medicare Benefit Policy Manual Chapter 15",
      );
    });

    it("objective-data flags always reference Medicare Benefit Policy Manual Chapter 15", () => {
      const noteText = "Patient attended session.";
      const flags = validateMedicareCompliance(noteText);
      const objectiveFlag = flags.find((f) => f.category === "objective-data");
      expect(objectiveFlag).toBeDefined();
      expect(objectiveFlag!.regulation).toContain(
        "Medicare Benefit Policy Manual Chapter 15",
      );
    });

    it("vague-language flags always reference Medicare Benefit Policy Manual Chapter 15", () => {
      const noteText = "Patient tolerated well and is progressing.";
      const flags = validateMedicareCompliance(noteText);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      vagueFlags.forEach((flag) => {
        expect(flag.regulation).toContain(
          "Medicare Benefit Policy Manual Chapter 15",
        );
      });
    });
  });

  describe("Compliant note produces no critical flags", () => {
    it("a well-documented note with skilled language and objective data has no critical flags", () => {
      const compliantNote = [
        "Patient presents with right shoulder pain limiting ADLs.",
        "Skilled therapeutic exercise performed requiring clinical judgment for progression.",
        "ROM: Shoulder flexion 110 degrees (limited from 180 degrees normal).",
        "Strength: MMT 3/5 right shoulder abductors.",
        "Patient improved from moderate assist to minimal assist for overhead reaching.",
        "Continue manual therapy and neuromuscular re-education 3x/week.",
      ].join(" ");

      const flags = validateMedicareCompliance(compliantNote);
      const criticalFlags = flags.filter((f) => f.severity === "critical");
      expect(criticalFlags.length).toBe(0);
    });
  });
});
