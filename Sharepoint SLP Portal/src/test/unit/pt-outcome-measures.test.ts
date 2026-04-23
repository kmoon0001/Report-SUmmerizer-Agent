import { describe, it, expect } from "vitest";
import {
  getPTOutcomeMeasureById,
  getPTOutcomeMeasuresByCategory,
  getPTOutcomeMeasuresForCondition,
  searchPTOutcomeMeasures,
  getAllPTOutcomeMeasures,
  getPTOutcomeMeasuresByScoringDirection,
  getQuickPTOutcomeMeasures,
  getPTOutcomeMeasureCategories,
  type PTOutcomeMeasure,
} from "../../data/pt-outcome-measures";

describe("PT Module 1: Outcome Measures", () => {
  describe("getPTOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getPTOutcomeMeasureById("pt-om-001");
      expect(measure).toBeDefined();
      expect(measure?.name).toBe("Lower Extremity Functional Scale");
      expect(measure?.abbreviation).toBe("LEFS");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getPTOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getPTOutcomeMeasureById("pt-om-001");
      expect(measure?.category).toBe("lower-extremity");
      expect(measure?.minScore).toBe(0);
      expect(measure?.maxScore).toBe(80);
      expect(measure?.scoringDirection).toBe("higher-better");
      expect(measure?.mcid).toBe(9);
    });
  });

  describe("getPTOutcomeMeasuresByCategory", () => {
    it("should return lower-extremity measures", () => {
      const measures = getPTOutcomeMeasuresByCategory("lower-extremity");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "lower-extremity")).toBe(
        true,
      );
    });

    it("should return upper-extremity measures", () => {
      const measures = getPTOutcomeMeasuresByCategory("upper-extremity");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "upper-extremity")).toBe(
        true,
      );
    });

    it("should return balance measures", () => {
      const measures = getPTOutcomeMeasuresByCategory("balance");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "balance")).toBe(true);
    });

    it("should return pain measures", () => {
      const measures = getPTOutcomeMeasuresByCategory("pain");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "pain")).toBe(true);
    });

    it("should return neurological measures", () => {
      const measures = getPTOutcomeMeasuresByCategory("neurological");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "neurological")).toBe(true);
    });
  });

  describe("getPTOutcomeMeasuresForCondition", () => {
    it("should return measures for low-back-pain", () => {
      const measures = getPTOutcomeMeasuresForCondition("low-back-pain");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.applicableConditions.includes("low-back-pain")),
      ).toBe(true);
    });

    it("should return measures for stroke", () => {
      const measures = getPTOutcomeMeasuresForCondition("stroke");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.applicableConditions.includes("stroke")),
      ).toBe(true);
    });

    it("should return measures for fall-prevention", () => {
      const measures = getPTOutcomeMeasuresForCondition("fall-prevention");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) =>
          m.applicableConditions.includes("fall-prevention"),
        ),
      ).toBe(true);
    });

    it("should return empty array for non-existent condition", () => {
      const measures = getPTOutcomeMeasuresForCondition(
        "non-existent-condition",
      );
      expect(measures.length).toBe(0);
    });
  });

  describe("searchPTOutcomeMeasures", () => {
    it("should find measure by name", () => {
      const results = searchPTOutcomeMeasures("Lower Extremity");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.name.includes("Lower Extremity"))).toBe(
        true,
      );
    });

    it("should find measure by abbreviation", () => {
      const results = searchPTOutcomeMeasures("DASH");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.abbreviation === "DASH")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTOutcomeMeasures("berg");
      const results2 = searchPTOutcomeMeasures("BERG");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTOutcomeMeasures("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTOutcomeMeasures", () => {
    it("should return all PT outcome measures", () => {
      const measures = getAllPTOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should have valid measure structure", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.category).toBeDefined();
        expect(measure.minScore).toBeLessThanOrEqual(measure.maxScore);
        expect(measure.mcid).toBeGreaterThan(0);
        expect(measure.adminTime).toBeGreaterThan(0);
        expect(measure.applicableConditions.length).toBeGreaterThan(0);
        expect(measure.interpretation).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.scoringMethod).toBeDefined();
        expect(m.clinicalUtility).toBeDefined();
        expect(m.source).toBeDefined();
        expect(m.citation).toBeDefined();
        expect(m.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getPTOutcomeMeasuresByScoringDirection", () => {
    it("should return higher-better measures", () => {
      const measures = getPTOutcomeMeasuresByScoringDirection("higher-better");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.scoringDirection === "higher-better"),
      ).toBe(true);
    });

    it("should return lower-better measures", () => {
      const measures = getPTOutcomeMeasuresByScoringDirection("lower-better");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.scoringDirection === "lower-better")).toBe(
        true,
      );
    });
  });

  describe("getQuickPTOutcomeMeasures", () => {
    it("should return measures with admin time < 10 minutes", () => {
      const measures = getQuickPTOutcomeMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.adminTime < 10)).toBe(true);
    });

    it("should include VAS and NPRS", () => {
      const measures = getQuickPTOutcomeMeasures();
      expect(measures.some((m) => m.abbreviation === "VAS")).toBe(true);
      expect(measures.some((m) => m.abbreviation === "NPRS")).toBe(true);
    });
  });

  describe("getPTOutcomeMeasureCategories", () => {
    it("should return all categories", () => {
      const categories = getPTOutcomeMeasureCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTOutcomeMeasureCategories();
      expect(categories).toContain("lower-extremity");
      expect(categories).toContain("upper-extremity");
      expect(categories).toContain("balance");
      expect(categories).toContain("pain");
    });
  });

  describe("Measure Scoring Direction", () => {
    it("should have correct scoring direction for functional measures", () => {
      const lefs = getPTOutcomeMeasureById("pt-om-001");
      expect(lefs?.scoringDirection).toBe("higher-better");
    });

    it("should have correct scoring direction for disability measures", () => {
      const odi = getPTOutcomeMeasureById("pt-om-003");
      expect(odi?.scoringDirection).toBe("lower-better");
    });
  });

  describe("MCID Values", () => {
    it("should have positive MCID values", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.mcid).toBeGreaterThan(0);
      });
    });

    it("should have clinically meaningful MCID values", () => {
      const lefs = getPTOutcomeMeasureById("pt-om-001");
      expect(lefs?.mcid).toBe(9);

      const odi = getPTOutcomeMeasureById("pt-om-003");
      expect(odi?.mcid).toBe(10);
    });
  });

  describe("Admin Time", () => {
    it("should have reasonable admin times", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.adminTime).toBeGreaterThan(0);
        expect(m.adminTime).toBeLessThan(60);
      });
    });

    it("should have shorter times for simple measures", () => {
      const vas = getPTOutcomeMeasureById("pt-om-011");
      expect(vas?.adminTime).toBeLessThan(5);
    });
  });

  describe("Applicable Conditions", () => {
    it("should have applicable conditions for each measure", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.applicableConditions.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Interpretation Levels", () => {
    it("should have complete interpretation levels", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.interpretation.excellent).toBeDefined();
        expect(m.interpretation.good).toBeDefined();
        expect(m.interpretation.fair).toBeDefined();
        expect(m.interpretation.poor).toBeDefined();
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each measure", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each measure", () => {
      const measures = getAllPTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });
  });
});
