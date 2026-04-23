/**
 * Property-Based Test: Compliance Flag Regulation References
 *
 * Property 15: Compliance Flag Regulation References
 * Validates: Requirement 8.4
 *
 * Correctness Property:
 * For all compliance flags produced by validateMedicareCompliance():
 * - Every flag has a non-empty regulation reference string
 * - Every regulation reference matches CMS/Medicare/Jimmo pattern
 * - Regulation references are specific (contain section numbers or identifiers)
 *
 * Sources:
 * - CMS Medicare Benefit Policy Manual Chapter 15
 * - Jimmo v. Sebelius Settlement Agreement (2013)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validateMedicareCompliance } from "../../utils/medicare-compliance-validator";

// Pattern: must contain CMS, Medicare, or Jimmo reference
const REGULATION_PATTERN = /CMS|Medicare|Jimmo/i;

// Pattern: must contain a section number, chapter, or year identifier
const SPECIFICITY_PATTERN = /Chapter\s+\d+|Section\s+\d+|20\d{2}|\d{3}\.\d/i;

describe("Property 15: Compliance Flag Regulation References", () => {
  describe("All flags have non-empty regulation references", () => {
    it("should produce flags with non-empty regulation strings for any note text", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 500 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);

          flags.forEach((flag, index) => {
            // Property: regulation field is a non-empty string
            expect(
              typeof flag.regulation,
              `Flag[${index}] regulation should be a string`,
            ).toBe("string");

            expect(
              flag.regulation.trim().length,
              `Flag[${index}] regulation should not be empty`,
            ).toBeGreaterThan(0);
          });
        }),
        { numRuns: 200 },
      );
    });

    it("should produce flags with regulation references matching CMS/Medicare/Jimmo pattern", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 500 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);

          flags.forEach((flag, index) => {
            expect(
              REGULATION_PATTERN.test(flag.regulation),
              `Flag[${index}] regulation "${flag.regulation}" must reference CMS, Medicare, or Jimmo`,
            ).toBe(true);
          });
        }),
        { numRuns: 200 },
      );
    });

    it("should produce flags with specific regulation references (section/chapter/year)", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 500 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);

          flags.forEach((flag, index) => {
            expect(
              SPECIFICITY_PATTERN.test(flag.regulation),
              `Flag[${index}] regulation "${flag.regulation}" must contain a specific section, chapter, or year`,
            ).toBe(true);
          });
        }),
        { numRuns: 200 },
      );
    });
  });

  describe("Regulation references are consistent across flag categories", () => {
    it("skilled-need flags always reference CMS Chapter 15", () => {
      fc.assert(
        fc.property(
          // Notes without any skilled need keywords
          fc
            .string({ minLength: 1, maxLength: 200 })
            .filter(
              (s) =>
                !/(therapeutic|neuromuscular|manual therapy|gait training|skilled|clinical judgment|complex|specialized|professional skill)/i.test(
                  s,
                ),
            ),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const skilledNeedFlags = flags.filter(
              (f) => f.category === "skilled-need",
            );

            skilledNeedFlags.forEach((flag, index) => {
              expect(
                /Chapter\s*15/i.test(flag.regulation),
                `skilled-need flag[${index}] regulation "${flag.regulation}" must reference Chapter 15`,
              ).toBe(true);
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    it("objective-data flags always reference CMS Chapter 15", () => {
      fc.assert(
        fc.property(
          // Notes without objective data indicators
          fc
            .string({ minLength: 1, maxLength: 200 })
            .filter(
              (s) =>
                !/(rom|range of motion|degrees|strength|mmt|manual muscle|gait speed|balance|berg|tug|timed up and go|meters|seconds|repetitions|distance|measurement)/i.test(
                  s,
                ),
            ),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const objectiveFlags = flags.filter(
              (f) => f.category === "objective-data",
            );

            objectiveFlags.forEach((flag, index) => {
              expect(
                /Chapter\s*15/i.test(flag.regulation),
                `objective-data flag[${index}] regulation "${flag.regulation}" must reference Chapter 15`,
              ).toBe(true);
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    it("vague-language flags always reference CMS Chapter 15 Section 220.3", () => {
      fc.assert(
        fc.property(
          // Notes containing vague language
          fc.constantFrom(
            "patient continue therapy",
            "tolerated well today",
            "as tolerated exercise",
            "patient did well with treatment",
            "good session overall",
            "patient is progressing nicely",
            "patient is improving",
            "maintain current level",
            "same as last time",
          ),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const vagueFlags = flags.filter(
              (f) => f.category === "vague-language",
            );

            vagueFlags.forEach((flag, index) => {
              expect(
                /Chapter\s*15/i.test(flag.regulation),
                `vague-language flag[${index}] regulation "${flag.regulation}" must reference Chapter 15`,
              ).toBe(true);

              expect(
                /220\.3/i.test(flag.regulation),
                `vague-language flag[${index}] regulation "${flag.regulation}" must reference Section 220.3`,
              ).toBe(true);
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it("medical-necessity flags reference Jimmo v. Sebelius or CMS Chapter 15", () => {
      fc.assert(
        fc.property(
          // Notes without progress documentation
          fc
            .string({ minLength: 1, maxLength: 200 })
            .filter(
              (s) =>
                !/(progress|goal|improved|increased|decreased pain|functional|independence|assist level)/i.test(
                  s,
                ),
            ),
          (noteText) => {
            const flags = validateMedicareCompliance(noteText);
            const medNecFlags = flags.filter(
              (f) => f.category === "medical-necessity",
            );

            medNecFlags.forEach((flag, index) => {
              const hasJimmo = /Jimmo/i.test(flag.regulation);
              const hasCMS = /CMS|Medicare/i.test(flag.regulation);

              expect(
                hasJimmo || hasCMS,
                `medical-necessity flag[${index}] regulation "${flag.regulation}" must reference Jimmo or CMS`,
              ).toBe(true);
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Regulation references are well-formed strings", () => {
    it("regulation references should have minimum meaningful length", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 500 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);

          flags.forEach((flag, index) => {
            // A meaningful regulation reference should be at least 20 chars
            // e.g., "CMS Chapter 15, Section 220.2" = 30 chars
            expect(
              flag.regulation.length,
              `Flag[${index}] regulation "${flag.regulation}" is too short to be meaningful`,
            ).toBeGreaterThanOrEqual(20);
          });
        }),
        { numRuns: 200 },
      );
    });

    it("all flags from a single note share the same authoritative source domain", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 500 }), (noteText) => {
          const flags = validateMedicareCompliance(noteText);

          // Every regulation reference must come from an authoritative source
          flags.forEach((flag, index) => {
            const isAuthoritative =
              /CMS/i.test(flag.regulation) ||
              /Medicare/i.test(flag.regulation) ||
              /Jimmo/i.test(flag.regulation) ||
              /APTA/i.test(flag.regulation);

            expect(
              isAuthoritative,
              `Flag[${index}] regulation "${flag.regulation}" must come from an authoritative source (CMS, Medicare, Jimmo, or APTA)`,
            ).toBe(true);
          });
        }),
        { numRuns: 200 },
      );
    });
  });

  describe("Specific known inputs produce expected regulation references", () => {
    it("note missing skilled need language produces Chapter 15 Section 220.2 reference", () => {
      const flags = validateMedicareCompliance(
        "patient performed exercises today",
      );
      const skilledFlag = flags.find((f) => f.category === "skilled-need");

      expect(skilledFlag).toBeDefined();
      expect(skilledFlag!.regulation).toMatch(/Chapter\s*15/i);
      expect(skilledFlag!.regulation).toMatch(/220\.2/i);
    });

    it("note missing objective data produces Chapter 15 Section 220.1 reference", () => {
      const flags = validateMedicareCompliance(
        "patient performed therapeutic exercise today",
      );
      const objectiveFlag = flags.find((f) => f.category === "objective-data");

      expect(objectiveFlag).toBeDefined();
      expect(objectiveFlag!.regulation).toMatch(/Chapter\s*15/i);
      expect(objectiveFlag!.regulation).toMatch(/220\.1/i);
    });

    it('note with "tolerated well" produces Section 220.3 reference', () => {
      const flags = validateMedicareCompliance(
        "patient performed therapeutic exercise with ROM 90 degrees, tolerated well",
      );
      const vagueFlag = flags.find(
        (f) =>
          f.category === "vague-language" &&
          f.message.includes("tolerated well"),
      );

      expect(vagueFlag).toBeDefined();
      expect(vagueFlag!.regulation).toMatch(/220\.3/i);
    });

    it("note missing progress documentation produces Jimmo reference", () => {
      const flags = validateMedicareCompliance(
        "patient performed therapeutic exercise with ROM 90 degrees, skilled PT required",
      );
      const progressFlag = flags.find(
        (f) => f.category === "medical-necessity",
      );

      expect(progressFlag).toBeDefined();
      expect(progressFlag!.regulation).toMatch(/Jimmo/i);
    });
  });
});
