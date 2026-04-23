import { describe, it, expect } from "vitest";
import {
  getClinicalDecisionRuleById,
  getClinicalDecisionRulesByDiscipline,
  getClinicalDecisionRulesByCategory,
  searchClinicalDecisionRules,
  getAllClinicalDecisionRules,
  getClinicalDecisionRuleCategories,
  getClinicalDecisionRulesByDisciplineAndCategory,
} from "../../data/clinical-decision-support";

describe("Clinical Decision Support System", () => {
  describe("getClinicalDecisionRuleById", () => {
    it("should return decision rule by valid ID", () => {
      const rule = getClinicalDecisionRuleById("cds-001");
      expect(rule).toBeDefined();
      expect(rule?.name).toBe("Ottawa Ankle Rules");
    });

    it("should return undefined for invalid ID", () => {
      const rule = getClinicalDecisionRuleById("invalid-id");
      expect(rule).toBeUndefined();
    });

    it("should return correct rule properties", () => {
      const rule = getClinicalDecisionRuleById("cds-001");
      expect(rule?.discipline).toBeDefined();
      expect(rule?.criteria.length).toBeGreaterThan(0);
      expect(rule?.recommendations.length).toBeGreaterThan(0);
    });

    it("should have psychometric properties", () => {
      const rule = getClinicalDecisionRuleById("cds-001");
      expect(rule?.sensitivity).toBeGreaterThan(0);
      expect(rule?.sensitivity).toBeLessThanOrEqual(1);
      expect(rule?.specificity).toBeGreaterThan(0);
      expect(rule?.specificity).toBeLessThanOrEqual(1);
    });
  });

  describe("getClinicalDecisionRulesByDiscipline", () => {
    it("should return rules for PT discipline", () => {
      const rules = getClinicalDecisionRulesByDiscipline("PT");
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.discipline.includes("PT"))).toBe(true);
    });

    it("should return rules for OT discipline", () => {
      const rules = getClinicalDecisionRulesByDiscipline("OT");
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.discipline.includes("OT"))).toBe(true);
    });

    it("should return rules for PT/OT shared", () => {
      const rules = getClinicalDecisionRulesByDiscipline("PT/OT");
      expect(rules.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent discipline", () => {
      const rules = getClinicalDecisionRulesByDiscipline("SLP");
      expect(rules.length).toBe(0);
    });
  });

  describe("getClinicalDecisionRulesByCategory", () => {
    it("should return rules for valid category", () => {
      const rules = getClinicalDecisionRulesByCategory("ankle-injury");
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.category === "ankle-injury")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const rules = getClinicalDecisionRulesByCategory("non-existent");
      expect(rules.length).toBe(0);
    });

    it("should return rules with valid structure", () => {
      const rules = getClinicalDecisionRulesByCategory("ankle-injury");
      rules.forEach((r) => {
        expect(r.id).toBeDefined();
        expect(r.name).toBeDefined();
        expect(r.criteria.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchClinicalDecisionRules", () => {
    it("should find rule by name", () => {
      const results = searchClinicalDecisionRules("Ottawa");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find rule by description", () => {
      const results = searchClinicalDecisionRules("ankle");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchClinicalDecisionRules("ottawa");
      const results2 = searchClinicalDecisionRules("OTTAWA");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchClinicalDecisionRules("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllClinicalDecisionRules", () => {
    it("should return all clinical decision rules", () => {
      const rules = getAllClinicalDecisionRules();
      expect(rules.length).toBe(10);
    });

    it("should have valid rule structure", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((rule) => {
        expect(rule.id).toBeDefined();
        expect(rule.name).toBeDefined();
        expect(rule.discipline).toBeDefined();
        expect(rule.category).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.criteria.length).toBeGreaterThan(0);
        expect(r.recommendations.length).toBeGreaterThan(0);
        expect(r.contraindications.length).toBeGreaterThan(0);
        expect(r.source).toBeDefined();
        expect(r.citation).toBeDefined();
        expect(r.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have valid psychometric properties", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.sensitivity).toBeGreaterThan(0);
        expect(r.sensitivity).toBeLessThanOrEqual(1);
        expect(r.specificity).toBeGreaterThan(0);
        expect(r.specificity).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("getClinicalDecisionRuleCategories", () => {
    it("should return all categories", () => {
      const categories = getClinicalDecisionRuleCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getClinicalDecisionRuleCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getClinicalDecisionRulesByDisciplineAndCategory", () => {
    it("should return PT rules for specific category", () => {
      const rules = getClinicalDecisionRulesByDisciplineAndCategory(
        "PT",
        "ankle-injury",
      );
      expect(rules.length).toBeGreaterThan(0);
      expect(
        rules.every(
          (r) => r.discipline.includes("PT") && r.category === "ankle-injury",
        ),
      ).toBe(true);
    });

    it("should return OT rules for specific category", () => {
      const rules = getClinicalDecisionRulesByDisciplineAndCategory(
        "OT",
        "swallowing-safety",
      );
      expect(rules.length).toBeGreaterThan(0);
      expect(
        rules.every(
          (r) =>
            r.discipline.includes("OT") && r.category === "swallowing-safety",
        ),
      ).toBe(true);
    });

    it("should return empty array for non-existent combination", () => {
      const rules = getClinicalDecisionRulesByDisciplineAndCategory(
        "SLP",
        "non-existent",
      );
      expect(rules.length).toBe(0);
    });
  });

  describe("Decision Rule Properties", () => {
    it("should have meaningful criteria", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.criteria.length).toBeGreaterThan(0);
        expect(r.criteria.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have meaningful recommendations", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.recommendations.length).toBeGreaterThan(0);
        expect(r.recommendations.every((rec) => rec.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.contraindications.length).toBeGreaterThan(0);
        expect(r.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.source).toBeDefined();
        expect(r.source.length).toBeGreaterThan(0);
        expect(r.citation).toBeDefined();
        expect(r.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Psychometric Properties", () => {
    it("should have valid sensitivity values", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.sensitivity).toBeGreaterThan(0.75);
        expect(r.sensitivity).toBeLessThanOrEqual(1);
      });
    });

    it("should have valid specificity values", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.specificity).toBeGreaterThan(0.75);
        expect(r.specificity).toBeLessThanOrEqual(1);
      });
    });

    it("should have valid evidence levels", () => {
      const rules = getAllClinicalDecisionRules();
      rules.forEach((r) => {
        expect(r.evidenceLevel).toBeGreaterThan(0);
        expect(r.evidenceLevel).toBeLessThanOrEqual(3);
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 decision rules", () => {
      const rules = getAllClinicalDecisionRules();
      expect(rules.length).toBe(10);
    });

    it("should cover multiple disciplines", () => {
      const rules = getAllClinicalDecisionRules();
      const disciplines = new Set();
      rules.forEach((r) => {
        if (r.discipline.includes("PT")) disciplines.add("PT");
        if (r.discipline.includes("OT")) disciplines.add("OT");
      });
      expect(disciplines.size).toBeGreaterThan(1);
    });

    it("should cover multiple categories", () => {
      const rules = getAllClinicalDecisionRules();
      const categories = new Set(rules.map((r) => r.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive coverage", () => {
      const rules = getAllClinicalDecisionRules();
      const allCriteria = rules.flatMap((r) => r.criteria);
      expect(allCriteria.length).toBeGreaterThan(30);
    });
  });
});
