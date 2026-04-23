import { describe, it, expect } from "vitest";
import {
  getOTAssessmentToolById,
  getOTAssessmentToolsByCategory,
  searchOTAssessmentTools,
  getAllOTAssessmentTools,
  getOTAssessmentToolCategories,
  getOTAssessmentToolsForIndication,
} from "../../data/ot-assessment-tools";

describe("OT Module 3: Assessment Tools", () => {
  describe("getOTAssessmentToolById", () => {
    it("should return assessment tool by valid ID", () => {
      const tool = getOTAssessmentToolById("ot-at-001");
      expect(tool).toBeDefined();
      expect(tool?.name).toBe("Activities of Daily Living Assessment");
    });

    it("should return undefined for invalid ID", () => {
      const tool = getOTAssessmentToolById("invalid-id");
      expect(tool).toBeUndefined();
    });

    it("should return correct tool properties", () => {
      const tool = getOTAssessmentToolById("ot-at-001");
      expect(tool?.category).toBe("functional-assessment");
      expect(tool?.domains.length).toBeGreaterThan(0);
      expect(tool?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getOTAssessmentToolsByCategory", () => {
    it("should return functional-assessment tools", () => {
      const tools = getOTAssessmentToolsByCategory("functional-assessment");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "functional-assessment")).toBe(
        true,
      );
    });

    it("should return work-assessment tools", () => {
      const tools = getOTAssessmentToolsByCategory("work-assessment");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "work-assessment")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const tools = getOTAssessmentToolsByCategory("non-existent");
      expect(tools.length).toBe(0);
    });
  });

  describe("searchOTAssessmentTools", () => {
    it("should find tool by name", () => {
      const results = searchOTAssessmentTools("Activities");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.name.includes("Activities"))).toBe(true);
    });

    it("should find tool by abbreviation", () => {
      const results = searchOTAssessmentTools("ADL-A");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTAssessmentTools("assessment");
      const results2 = searchOTAssessmentTools("ASSESSMENT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTAssessmentTools("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTAssessmentTools", () => {
    it("should return all OT assessment tools", () => {
      const tools = getAllOTAssessmentTools();
      expect(tools.length).toBe(10);
    });

    it("should have valid tool structure", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((tool) => {
        expect(tool.id).toBeDefined();
        expect(tool.name).toBeDefined();
        expect(tool.abbreviation).toBeDefined();
        expect(tool.category).toBeDefined();
        expect(tool.domains.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTAssessmentToolCategories", () => {
    it("should return all categories", () => {
      const categories = getOTAssessmentToolCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTAssessmentToolCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTAssessmentToolsForIndication", () => {
    it("should return tools for functional limitation", () => {
      const tools = getOTAssessmentToolsForIndication("Functional limitation");
      expect(tools.length).toBeGreaterThan(0);
    });

    it("should return tools for disability assessment", () => {
      const tools = getOTAssessmentToolsForIndication("Disability assessment");
      expect(tools.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const tools = getOTAssessmentToolsForIndication(
        "non-existent-indication",
      );
      expect(tools.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getOTAssessmentToolsForIndication(
        "functional limitation",
      );
      const results2 = getOTAssessmentToolsForIndication(
        "FUNCTIONAL LIMITATION",
      );
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Domains", () => {
    it("should have meaningful domains", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.domains.length).toBeGreaterThan(0);
        expect(t.domains.every((d) => d.length > 0)).toBe(true);
      });
    });
  });

  describe("Administration", () => {
    it("should have administration information", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.administration).toBeDefined();
        expect(t.administration.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Scoring", () => {
    it("should have scoring information", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.scoring).toBeDefined();
        expect(t.scoring.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each tool", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each tool", () => {
      const tools = getAllOTAssessmentTools();
      tools.forEach((t) => {
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Tool Coverage", () => {
    it("should have 10 assessment tools total", () => {
      const tools = getAllOTAssessmentTools();
      expect(tools.length).toBe(10);
    });
  });
});
