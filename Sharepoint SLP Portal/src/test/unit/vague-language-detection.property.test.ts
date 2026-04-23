/**
 * Property-Based Test: Vague Language Detection (Task 9.5)
 *
 * Property 16: Vague Language Detection
 * Validates: Requirements 3.6, 8.7
 *
 * Correctness Property:
 * For any note text containing any of the 10 prohibited vague patterns,
 * validateMedicareCompliance() always returns at least one vague-language warning flag.
 *
 * The 10 prohibited patterns (Medicare Benefit Policy Manual Chapter 15, Section 220.3):
 * 1. continue
 * 2. tolerated well
 * 3. as tolerated
 * 4. patient did well
 * 5. good session
 * 6. progressing
 * 7. improving
 * 8. maintain
 * 9. same as last time
 * 10. no complaints
 *
 * Evidence: Medicare Benefit Policy Manual Chapter 15, Section 220.3
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validateMedicareCompliance } from "../../../src/utils/medicare-compliance-validator";

const VAGUE_PATTERNS = [
  "continue",
  "tolerated well",
  "as tolerated",
  "patient did well",
  "good session",
  "progressing",
  "improving",
  "maintain",
  "same as last time",
  "no complaints",
] as const;

describe("Property 16: Vague Language Detection", () => {
  describe("Each vague pattern triggers a warning", () => {
    VAGUE_PATTERNS.forEach((pattern) => {
      it(`"${pattern}" always triggers a vague-language warning`, () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 0, maxLength: 50 }),
            fc.string({ minLength: 0, maxLength: 50 }),
            (prefix, suffix) => {
              // Embed the vague pattern in a note that also has skilled language and objective data
              // so we isolate only the vague-language flag
              const noteText = `${prefix} ${pattern} ${suffix} therapeutic exercise rom degrees`;
              const flags = validateMedicareCompliance(noteText);
              const hasVagueFlag = flags.some(
                (f) => f.category === "vague-language",
              );
              expect(hasVagueFlag).toBe(true);
            },
          ),
          { numRuns: 50 },
        );
      });
    });
  });

  describe("Vague flag properties", () => {
    it("each vague flag includes the detected phrase in the message", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VAGUE_PATTERNS), (pattern) => {
          const noteText = `Patient ${pattern} during therapeutic exercise. ROM: 90 degrees.`;
          const flags = validateMedicareCompliance(noteText);
          const vagueFlags = flags.filter(
            (f) => f.category === "vague-language",
          );
          expect(vagueFlags.length).toBeGreaterThan(0);
          const matchingFlag = vagueFlags.find((f) =>
            f.message.toLowerCase().includes(pattern.toLowerCase()),
          );
          expect(matchingFlag).toBeDefined();
        }),
        { numRuns: 100 },
      );
    });

    it("vague flags always have warning severity (not critical)", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VAGUE_PATTERNS), (pattern) => {
          const noteText = `Patient ${pattern}. Therapeutic exercise performed. ROM: 90 degrees.`;
          const flags = validateMedicareCompliance(noteText);
          const vagueFlags = flags.filter(
            (f) => f.category === "vague-language",
          );
          vagueFlags.forEach((flag) => {
            expect(flag.severity).toBe("warning");
          });
        }),
        { numRuns: 100 },
      );
    });

    it("vague flags always include a specific replacement suggestion", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VAGUE_PATTERNS), (pattern) => {
          const noteText = `Patient ${pattern}. Therapeutic exercise. ROM: 90 degrees.`;
          const flags = validateMedicareCompliance(noteText);
          const vagueFlags = flags.filter(
            (f) => f.category === "vague-language",
          );
          vagueFlags.forEach((flag) => {
            expect(flag.suggestion.length).toBeGreaterThan(10);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("multiple vague patterns in one note produce multiple flags", () => {
      const noteText =
        "Patient tolerated well and is progressing. Continue as tolerated. Therapeutic exercise. ROM: 90 degrees.";
      const flags = validateMedicareCompliance(noteText);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      // Should detect: tolerated well, progressing, continue, as tolerated
      expect(vagueFlags.length).toBeGreaterThanOrEqual(3);
    });

    it("note with no vague patterns produces no vague-language flags", () => {
      const cleanNote = [
        "Skilled therapeutic exercise performed requiring clinical judgment.",
        "ROM: Shoulder flexion improved from 90 to 110 degrees.",
        "Strength: MMT 3/5 to 4/5 right shoulder abductors.",
        "Patient ambulated 150 feet with walker, minimal assist.",
        "Patient achieved 3/5 short-term goals this session.",
      ].join(" ");

      const flags = validateMedicareCompliance(cleanNote);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      expect(vagueFlags.length).toBe(0);
    });
  });

  describe("Case insensitivity", () => {
    it("detects vague patterns regardless of case", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VAGUE_PATTERNS),
          fc.constantFrom("lower", "upper", "mixed"),
          (pattern, caseType) => {
            let cased: string;
            if (caseType === "upper") {
              cased = pattern.toUpperCase();
            } else if (caseType === "mixed") {
              cased = pattern
                .split("")
                .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
                .join("");
            } else {
              cased = pattern.toLowerCase();
            }
            const noteText = `Patient ${cased}. Therapeutic exercise. ROM: 90 degrees.`;
            const flags = validateMedicareCompliance(noteText);
            const hasVagueFlag = flags.some(
              (f) => f.category === "vague-language",
            );
            expect(hasVagueFlag).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Regulation reference", () => {
    it("all vague-language flags reference Section 220.3", () => {
      const noteText =
        "Patient tolerated well. Therapeutic exercise. ROM: 90 degrees.";
      const flags = validateMedicareCompliance(noteText);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      vagueFlags.forEach((flag) => {
        expect(flag.regulation).toContain("220.3");
      });
    });
  });
});
