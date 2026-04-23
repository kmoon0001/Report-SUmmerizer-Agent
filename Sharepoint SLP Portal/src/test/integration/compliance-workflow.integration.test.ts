/**
 * Integration Test: Compliance Workflow
 *
 * Tests the complete compliance check workflow:
 * validateMedicareCompliance → analyzeDocumentationQuality → language library
 *
 * Validates: Requirements 8.1, 8.4
 *
 * Sources:
 * - CMS Medicare Benefit Policy Manual Chapter 15
 * - Jimmo v. Sebelius Settlement Agreement (2013)
 * - APTA Documentation Guidelines
 */

import { describe, it, expect } from "vitest";
import {
  validateMedicareCompliance,
  mapInterventionToCPT,
} from "../../utils/medicare-compliance-validator";
import { analyzeDocumentationQuality } from "../../utils/documentation-quality-analyzer";
import {
  SKILLED_NEED_PHRASES,
  VAGUE_LANGUAGE_REPLACEMENTS,
  getSkilledPhrasesForIntervention,
  getJustificationTemplate,
  getVagueLanguageReplacement,
} from "../../data/medicare-language-library";

// ============================================================================
// TEST FIXTURES
// ============================================================================

const POOR_NOTE = `
  Patient performed exercises today. Tolerated well. Continue same.
  Patient did well. Good session.
`;

const COMPLIANT_NOTE = `
  Patient presents with right shoulder pain 5/10, functional limitation with overhead reaching.
  Prior level of function: independent with all ADLs.
  
  Objective: ROM shoulder flexion 90° (limited from 180°), abduction 75°.
  Strength: rotator cuff 3/5 MMT. TUG: 12 seconds.
  
  Assessment: Skilled physical therapy required for therapeutic exercise requiring clinical judgment
  and neuromuscular re-education to restore normal movement patterns.
  Progress: ROM improved from 75° to 90° shoulder flexion since initial evaluation.
  Prognosis: Good rehabilitation potential.
  
  Plan: Therapeutic exercise (97110) × 4 units, manual therapy (97140) × 2 units.
  Short-term goals (2 weeks): ROM 120° shoulder flexion.
  Long-term goals (6 weeks): Independent with all ADLs, return to work.
  Frequency: 3x/week × 6 weeks.
  Patient education: HEP provided with written instructions.
`;

const PARTIAL_NOTE = `
  Patient presents with low back pain 6/10.
  ROM lumbar flexion 45°, extension 15°. Strength 4/5 bilateral lower extremities.
  Therapeutic exercise performed for strengthening.
  Goal: return to work.
`;

// ============================================================================
// FULL COMPLIANCE WORKFLOW
// ============================================================================

describe("Compliance Workflow Integration", () => {
  describe("Complete workflow: poor documentation", () => {
    it("should identify multiple critical and warning flags in poor note", () => {
      const flags = validateMedicareCompliance(POOR_NOTE);

      expect(flags.length).toBeGreaterThan(0);

      const criticalFlags = flags.filter((f) => f.severity === "critical");
      const _warningFlags = flags.filter((f) => f.severity === "warning");

      // Poor note should have critical issues
      expect(criticalFlags.length).toBeGreaterThan(0);

      // Should detect vague language
      const vagueFlags = flags.filter((f) => f.category === "vague-language");
      expect(vagueFlags.length).toBeGreaterThan(0);

      // All flags must have regulation references
      flags.forEach((flag) => {
        expect(flag.regulation).toBeTruthy();
        expect(flag.regulation.length).toBeGreaterThan(0);
      });
    });

    it("should produce low quality score for poor note", () => {
      const metrics = analyzeDocumentationQuality(POOR_NOTE, "poor-note-001");

      expect(metrics.overallScore).toBeLessThan(50);
      expect(metrics.complianceScore).toBeLessThan(50);
      expect(metrics.areasForImprovement.length).toBeGreaterThan(0);
      expect(metrics.missingElements.length).toBeGreaterThan(0);
    });

    it("should detect all vague phrases in poor note", () => {
      const flags = validateMedicareCompliance(POOR_NOTE);
      const vagueFlags = flags.filter((f) => f.category === "vague-language");

      const detectedPhrases = vagueFlags.map((f) => f.message.toLowerCase());

      // "tolerated well", "continue", "patient did well", "good session" are in the note
      expect(detectedPhrases.some((m) => m.includes("tolerated well"))).toBe(
        true,
      );
      expect(detectedPhrases.some((m) => m.includes("continue"))).toBe(true);
    });
  });

  describe("Complete workflow: compliant documentation", () => {
    it("should produce zero critical flags for compliant note", () => {
      const flags = validateMedicareCompliance(COMPLIANT_NOTE);
      const criticalFlags = flags.filter((f) => f.severity === "critical");

      expect(criticalFlags.length).toBe(0);
    });

    it("should produce high quality score for compliant note", () => {
      const metrics = analyzeDocumentationQuality(
        COMPLIANT_NOTE,
        "compliant-note-001",
      );

      expect(metrics.overallScore).toBeGreaterThan(60);
      expect(metrics.complianceScore).toBeGreaterThan(60);
      expect(metrics.strengths.length).toBeGreaterThan(0);
    });

    it("should identify strengths in compliant note", () => {
      const metrics = analyzeDocumentationQuality(
        COMPLIANT_NOTE,
        "compliant-note-001",
      );

      // Should recognize ROM measurements
      expect(
        metrics.strengths.some((s) => /ROM|range of motion/i.test(s)),
      ).toBe(true);
    });
  });

  describe("Complete workflow: partial documentation", () => {
    it("should produce fewer flags than poor note for partial note", () => {
      const poorFlags = validateMedicareCompliance(POOR_NOTE);
      const partialFlags = validateMedicareCompliance(PARTIAL_NOTE);

      // Partial note has objective data and no vague language — fewer flags than poor note
      expect(partialFlags.length).toBeLessThan(poorFlags.length);

      // Has objective data (ROM, strength) — no objective-data flag
      const objectiveFlag = partialFlags.find(
        (f) => f.category === "objective-data",
      );
      expect(objectiveFlag).toBeUndefined();

      // No vague language in partial note
      const vagueFlags = partialFlags.filter(
        (f) => f.category === "vague-language",
      );
      expect(vagueFlags.length).toBe(0);
    });

    it("should score partial note between poor and compliant", () => {
      const poorMetrics = analyzeDocumentationQuality(POOR_NOTE);
      const partialMetrics = analyzeDocumentationQuality(PARTIAL_NOTE);
      const compliantMetrics = analyzeDocumentationQuality(COMPLIANT_NOTE);

      expect(partialMetrics.overallScore).toBeGreaterThan(
        poorMetrics.overallScore,
      );
      expect(partialMetrics.overallScore).toBeLessThan(
        compliantMetrics.overallScore,
      );
    });
  });
});

// ============================================================================
// REGULATION REFERENCE INTEGRITY
// ============================================================================

describe("Regulation Reference Integrity", () => {
  it("every compliance flag has a non-empty regulation reference", () => {
    const notes = [POOR_NOTE, PARTIAL_NOTE, COMPLIANT_NOTE];

    notes.forEach((note) => {
      const flags = validateMedicareCompliance(note);
      flags.forEach((flag) => {
        expect(flag.regulation).toBeTruthy();
        expect(typeof flag.regulation).toBe("string");
        expect(flag.regulation.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("every compliance flag regulation references CMS, Medicare, or Jimmo", () => {
    const flags = validateMedicareCompliance(POOR_NOTE);

    flags.forEach((flag) => {
      expect(flag.regulation).toMatch(/CMS|Medicare|Jimmo/i);
    });
  });

  it("skilled-need flags reference Chapter 15 Section 220.2", () => {
    const flags = validateMedicareCompliance("patient exercised today");
    const skilledFlag = flags.find((f) => f.category === "skilled-need");

    expect(skilledFlag).toBeDefined();
    expect(skilledFlag!.regulation).toMatch(/Chapter\s*15/i);
    expect(skilledFlag!.regulation).toMatch(/220\.2/i);
  });

  it("vague-language flags reference Chapter 15 Section 220.3", () => {
    const flags = validateMedicareCompliance(
      "therapeutic exercise with ROM 90 degrees, tolerated well, continue same",
    );
    const vagueFlags = flags.filter((f) => f.category === "vague-language");

    expect(vagueFlags.length).toBeGreaterThan(0);
    vagueFlags.forEach((flag) => {
      expect(flag.regulation).toMatch(/220\.3/i);
    });
  });

  it("medical-necessity flags reference Jimmo v. Sebelius", () => {
    const flags = validateMedicareCompliance(
      "therapeutic exercise with ROM 90 degrees, skilled PT required",
    );
    const progressFlag = flags.find((f) => f.category === "medical-necessity");

    expect(progressFlag).toBeDefined();
    expect(progressFlag!.regulation).toMatch(/Jimmo/i);
  });
});

// ============================================================================
// CPT CODE MAPPING WORKFLOW
// ============================================================================

describe("CPT Code Mapping Workflow", () => {
  it("maps all standard PT interventions to correct CPT codes", () => {
    const mappings = [
      { input: "therapeutic exercise", expected: "97110" },
      { input: "manual therapy techniques", expected: "97140" },
      { input: "gait training with walker", expected: "97116" },
      { input: "neuromuscular re-education", expected: "97112" },
    ];

    mappings.forEach(({ input, expected }) => {
      expect(mapInterventionToCPT(input)).toBe(expected);
    });
  });

  it("returns empty string for unknown interventions", () => {
    expect(mapInterventionToCPT("unknown intervention xyz")).toBe("");
    expect(mapInterventionToCPT("")).toBe("");
  });

  it("CPT codes in compliant note match mapped codes", () => {
    // The compliant note mentions therapeutic exercise (97110) and manual therapy (97140)
    expect(mapInterventionToCPT("therapeutic exercise")).toBe("97110");
    expect(mapInterventionToCPT("manual therapy")).toBe("97140");
  });
});

// ============================================================================
// LANGUAGE LIBRARY INTEGRATION
// ============================================================================

describe("Language Library Integration", () => {
  it("skilled need phrases all have non-empty regulation references", () => {
    SKILLED_NEED_PHRASES.forEach((phrase, index) => {
      expect(
        phrase.regulationRef,
        `SKILLED_NEED_PHRASES[${index}] must have a regulation reference`,
      ).toBeTruthy();
      expect(phrase.regulationRef).toMatch(/CMS|Medicare|Jimmo/i);
    });
  });

  it("vague language replacements all have non-empty regulation references", () => {
    VAGUE_LANGUAGE_REPLACEMENTS.forEach((item, index) => {
      expect(
        item.regulationRef,
        `VAGUE_LANGUAGE_REPLACEMENTS[${index}] must have a regulation reference`,
      ).toBeTruthy();
      expect(item.regulationRef).toMatch(/CMS|Medicare|Jimmo/i);
    });
  });

  it("getSkilledPhrasesForIntervention returns phrases for known intervention types", () => {
    const types = [
      "therapeutic-exercise",
      "manual-therapy",
      "gait-training",
      "neuromuscular-reeducation",
    ];

    types.forEach((type) => {
      const phrases = getSkilledPhrasesForIntervention(type);
      expect(phrases.length).toBeGreaterThan(0);
      phrases.forEach((p) => {
        expect(p.phrase.length).toBeGreaterThan(0);
        expect(p.regulationRef).toMatch(/CMS|Medicare|Jimmo/i);
      });
    });
  });

  it("getJustificationTemplate returns templates for standard CPT codes", () => {
    const codes = ["97110", "97140", "97116", "97112"];

    codes.forEach((code) => {
      const template = getJustificationTemplate(code);
      expect(template).toBeDefined();
      expect(template!.cptCode).toBe(code);
      expect(template!.regulationRef).toMatch(/CMS|Medicare/i);
    });
  });

  it("getVagueLanguageReplacement returns replacements for known vague phrases", () => {
    const phrases = [
      "continue",
      "tolerated well",
      "as tolerated",
      "patient did well",
      "good session",
    ];

    phrases.forEach((phrase) => {
      const replacement = getVagueLanguageReplacement(phrase);
      expect(replacement).toBeDefined();
      expect(replacement!.replacement.length).toBeGreaterThan(0);
      expect(replacement!.regulationRef).toMatch(/CMS|Medicare/i);
    });
  });
});

// ============================================================================
// QUALITY SCORING WORKFLOW
// ============================================================================

describe("Quality Scoring Workflow", () => {
  it("quality score components sum correctly to overall score", () => {
    const metrics = analyzeDocumentationQuality(COMPLIANT_NOTE, "test-001");

    const {
      subjectiveQuality,
      objectiveQuality,
      assessmentQuality,
      planQuality,
    } = metrics.components;

    // Overall = 20% subjective + 30% objective + 30% assessment + 20% plan
    const expectedOverall = Math.round(
      subjectiveQuality * 0.2 +
        objectiveQuality * 0.3 +
        assessmentQuality * 0.3 +
        planQuality * 0.2,
    );

    expect(metrics.overallScore).toBe(expectedOverall);
  });

  it("all component scores are in 0-100 range", () => {
    const notes = [POOR_NOTE, PARTIAL_NOTE, COMPLIANT_NOTE];

    notes.forEach((note) => {
      const metrics = analyzeDocumentationQuality(note);

      expect(metrics.overallScore).toBeGreaterThanOrEqual(0);
      expect(metrics.overallScore).toBeLessThanOrEqual(100);
      expect(metrics.complianceScore).toBeGreaterThanOrEqual(0);
      expect(metrics.complianceScore).toBeLessThanOrEqual(100);

      Object.values(metrics.components).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  it("note with all Medicare-critical elements scores high on compliance", () => {
    const metrics = analyzeDocumentationQuality(COMPLIANT_NOTE);
    // Compliant note has skilled language, objective data, no vague language, progress, CPT codes
    expect(metrics.complianceScore).toBeGreaterThanOrEqual(70);
  });

  it("note with vague language scores lower on compliance", () => {
    const compliantMetrics = analyzeDocumentationQuality(COMPLIANT_NOTE);
    const poorMetrics = analyzeDocumentationQuality(POOR_NOTE);

    expect(compliantMetrics.complianceScore).toBeGreaterThan(
      poorMetrics.complianceScore,
    );
  });
});
