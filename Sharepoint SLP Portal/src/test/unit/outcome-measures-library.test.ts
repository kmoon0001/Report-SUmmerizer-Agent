import { describe, it, expect } from "vitest";
import {
  getMeasureById,
  getMeasuresByDiscipline,
  getMeasuresByType,
  getMeasuresForCondition,
  searchMeasures,
  getSharedMeasures,
  getPTMeasures,
  getOTMeasures,
  getAllMeasures,
  type OutcomeMeasure,
  type Discipline,
  type MeasureType,
} from "../../shared/data/outcome-measures-library";

describe("Outcome Measures Library", () => {
  describe("getMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getMeasureById("fim-001");
      expect(measure).toBeDefined();
      expect(measure?.name).toBe("Functional Independence Measure");
      expect(measure?.abbreviation).toBe("FIM");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getMeasureById("lefs-001");
      expect(measure?.discipline).toBe("pt");
      expect(measure?.type).toBe("functional");
      expect(measure?.minScore).toBe(0);
      expect(measure?.maxScore).toBe(80);
      expect(measure?.scoringDirection).toBe("higher-better");
    });
  });

  describe("getMeasuresByDiscipline", () => {
    it("should return shared measures for shared discipline", () => {
      const measures = getMeasuresByDiscipline("shared");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.discipline === "shared")).toBe(true);
    });

    it("should return PT measures including shared measures", () => {
      const measures = getMeasuresByDiscipline("pt");
      expect(measures.length).toBeGreaterThan(0);
      const hasPT = measures.some((m) => m.discipline === "pt");
      const hasShared = measures.some((m) => m.discipline === "shared");
      expect(hasPT).toBe(true);
      expect(hasShared).toBe(true);
    });

    it("should return OT measures including shared measures", () => {
      const measures = getMeasuresByDiscipline("ot");
      expect(measures.length).toBeGreaterThan(0);
      const hasOT = measures.some((m) => m.discipline === "ot");
      const hasShared = measures.some((m) => m.discipline === "shared");
      expect(hasOT).toBe(true);
      expect(hasShared).toBe(true);
    });
  });

  describe("getMeasuresByType", () => {
    it("should return functional measures", () => {
      const measures = getMeasuresByType("functional");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.type === "functional")).toBe(true);
    });

    it("should return quality-of-life measures", () => {
      const measures = getMeasuresByType("quality-of-life");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.type === "quality-of-life")).toBe(true);
    });

    it("should return balance measures", () => {
      const measures = getMeasuresByType("balance");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.type === "balance")).toBe(true);
    });
  });

  describe("getMeasuresForCondition", () => {
    it("should return measures for stroke condition", () => {
      const measures = getMeasuresForCondition("stroke");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.applicableTo.includes("stroke"))).toBe(
        true,
      );
    });

    it("should return measures for low-back-pain condition", () => {
      const measures = getMeasuresForCondition("low-back-pain");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.applicableTo.includes("low-back-pain")),
      ).toBe(true);
    });

    it("should return empty array for non-existent condition", () => {
      const measures = getMeasuresForCondition("non-existent-condition");
      expect(measures.length).toBe(0);
    });
  });

  describe("searchMeasures", () => {
    it("should find measure by name", () => {
      const results = searchMeasures("Functional Independence");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((m) => m.name.includes("Functional Independence")),
      ).toBe(true);
    });

    it("should find measure by abbreviation", () => {
      const results = searchMeasures("LEFS");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.abbreviation === "LEFS")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchMeasures("dash");
      const results2 = searchMeasures("DASH");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchMeasures("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getSharedMeasures", () => {
    it("should return only shared measures", () => {
      const measures = getSharedMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.discipline === "shared")).toBe(true);
    });

    it("should include FIM and Barthel Index", () => {
      const measures = getSharedMeasures();
      const hasFIM = measures.some((m) => m.abbreviation === "FIM");
      const hasBarth = measures.some((m) => m.abbreviation === "BI");
      expect(hasFIM).toBe(true);
      expect(hasBarth).toBe(true);
    });
  });

  describe("getPTMeasures", () => {
    it("should return PT-specific measures", () => {
      const measures = getPTMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.discipline === "pt")).toBe(true);
    });

    it("should include LEFS and DASH", () => {
      const measures = getPTMeasures();
      const hasLEFS = measures.some((m) => m.abbreviation === "LEFS");
      const hasDASH = measures.some((m) => m.abbreviation === "DASH");
      expect(hasLEFS).toBe(true);
      expect(hasDASH).toBe(true);
    });
  });

  describe("getOTMeasures", () => {
    it("should return OT-specific measures", () => {
      const measures = getOTMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.discipline === "ot")).toBe(true);
    });

    it("should include COPM and AMPS", () => {
      const measures = getOTMeasures();
      const hasCOPM = measures.some((m) => m.abbreviation === "COPM");
      const hasAMPS = measures.some((m) => m.abbreviation === "AMPS");
      expect(hasCOPM).toBe(true);
      expect(hasAMPS).toBe(true);
    });
  });

  describe("getAllMeasures", () => {
    it("should return all measures", () => {
      const all = getAllMeasures();
      const shared = getSharedMeasures();
      const pt = getPTMeasures();
      const ot = getOTMeasures();
      expect(all.length).toBeGreaterThanOrEqual(
        shared.length + pt.length + ot.length,
      );
    });

    it("should have valid measure structure", () => {
      const measures = getAllMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.discipline).toMatch(/^(pt|ot|shared)$/);
        expect(measure.type).toBeDefined();
        expect(measure.minScore).toBeLessThanOrEqual(measure.maxScore);
        expect(measure.mcid).toBeGreaterThan(0);
        expect(measure.adminTime).toBeGreaterThan(0);
        expect(measure.interpretation).toBeDefined();
        expect(measure.applicableTo.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Measure Scoring Direction", () => {
    it("should have correct scoring direction for functional measures", () => {
      const lefs = getMeasureById("lefs-001");
      expect(lefs?.scoringDirection).toBe("higher-better");
    });

    it("should have correct scoring direction for disability measures", () => {
      const odi = getMeasureById("odi-001");
      expect(odi?.scoringDirection).toBe("lower-better");
    });
  });

  describe("Measure Interpretation", () => {
    it("should have complete interpretation levels", () => {
      const measure = getMeasureById("fim-001");
      expect(measure?.interpretation.excellent).toBeDefined();
      expect(measure?.interpretation.good).toBeDefined();
      expect(measure?.interpretation.fair).toBeDefined();
      expect(measure?.interpretation.poor).toBeDefined();
    });

    it("should have meaningful interpretation text", () => {
      const measure = getMeasureById("berg-001");
      expect(measure?.interpretation.excellent).toContain("Low fall risk");
      expect(measure?.interpretation.poor).toContain("Very high fall risk");
    });
  });

  describe("MCID Values", () => {
    it("should have positive MCID values", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.mcid).toBeGreaterThan(0);
      });
    });

    it("should have clinically meaningful MCID values", () => {
      const lefs = getMeasureById("lefs-001");
      expect(lefs?.mcid).toBe(9); // 9 points on 80-point scale

      const fim = getMeasureById("fim-001");
      expect(fim?.mcid).toBe(13); // 13 points on 126-point scale
    });
  });

  describe("Admin Time", () => {
    it("should have reasonable admin times", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.adminTime).toBeGreaterThan(0);
        expect(m.adminTime).toBeLessThan(120); // Less than 2 hours
      });
    });

    it("should have shorter times for simple measures", () => {
      const tug = getMeasureById("tug-001");
      expect(tug?.adminTime).toBeLessThan(10);
    });
  });

  describe("Applicable Conditions", () => {
    it("should have applicable conditions for each measure", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.applicableTo.length).toBeGreaterThan(0);
        expect(m.applicableTo.every((c) => typeof c === "string")).toBe(true);
      });
    });

    it("should have consistent condition naming", () => {
      const measures = getAllMeasures();
      const conditions = new Set<string>();
      measures.forEach((m) => {
        m.applicableTo.forEach((c) => conditions.add(c));
      });
      expect(conditions.size).toBeGreaterThan(0);
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each measure", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each measure", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Last Updated", () => {
    it("should have valid last updated date", () => {
      const measures = getAllMeasures();
      measures.forEach((m) => {
        expect(m.lastUpdated).toBeInstanceOf(Date);
        expect(m.lastUpdated.getTime()).toBeLessThanOrEqual(
          new Date().getTime(),
        );
      });
    });
  });
});
