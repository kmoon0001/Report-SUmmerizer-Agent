import { describe, it, expect } from "vitest";
import {
  getEducationContentById,
  getEducationContentByCondition,
  getEducationContentByType,
  getEducationContentByDiscipline,
  getEducationContentByReadingLevel,
  searchEducationContent,
  getPrintableEducationContent,
  getAllEducationContent,
  getSharedEducationContent,
  getPTEducationContent,
  getOTEducationContent,
  type PatientEducationContent,
  type EducationContentType,
  type Discipline,
} from "../../shared/data/patient-education-library";

describe("Patient Education Library", () => {
  describe("getEducationContentById", () => {
    it("should return content by valid ID", () => {
      const content = getEducationContentById("edu-shared-001");
      expect(content).toBeDefined();
      expect(content?.title).toBe("Understanding Stroke Recovery");
    });

    it("should return undefined for invalid ID", () => {
      const content = getEducationContentById("invalid-id");
      expect(content).toBeUndefined();
    });

    it("should return correct content properties", () => {
      const content = getEducationContentById("edu-pt-001");
      expect(content?.discipline).toBe("pt");
      expect(content?.contentType).toBe("cause-prevention");
      expect(content?.condition).toBe("low-back-pain");
    });
  });

  describe("getEducationContentByCondition", () => {
    it("should return content for stroke condition", () => {
      const content = getEducationContentByCondition("stroke");
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.applicableTo.includes("stroke"))).toBe(
        true,
      );
    });

    it("should return content for low-back-pain condition", () => {
      const content = getEducationContentByCondition("low-back-pain");
      expect(content.length).toBeGreaterThan(0);
      expect(
        content.every((c) => c.applicableTo.includes("low-back-pain")),
      ).toBe(true);
    });

    it("should return empty array for non-existent condition", () => {
      const content = getEducationContentByCondition("non-existent-condition");
      expect(content.length).toBe(0);
    });
  });

  describe("getEducationContentByType", () => {
    it("should return condition-description content", () => {
      const content = getEducationContentByType("condition-description");
      expect(content.length).toBeGreaterThan(0);
      expect(
        content.every((c) => c.contentType === "condition-description"),
      ).toBe(true);
    });

    it("should return home-program content", () => {
      const content = getEducationContentByType("home-program");
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.contentType === "home-program")).toBe(true);
    });

    it("should return safety-precautions content", () => {
      const content = getEducationContentByType("safety-precautions");
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.contentType === "safety-precautions")).toBe(
        true,
      );
    });
  });

  describe("getEducationContentByDiscipline", () => {
    it("should return shared content for shared discipline", () => {
      const content = getEducationContentByDiscipline("shared");
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.discipline === "shared")).toBe(true);
    });

    it("should return PT content including shared", () => {
      const content = getEducationContentByDiscipline("pt");
      expect(content.length).toBeGreaterThan(0);
      const hasPT = content.some((c) => c.discipline === "pt");
      const hasShared = content.some((c) => c.discipline === "shared");
      expect(hasPT).toBe(true);
      expect(hasShared).toBe(true);
    });

    it("should return OT content including shared", () => {
      const content = getEducationContentByDiscipline("ot");
      expect(content.length).toBeGreaterThan(0);
      const hasOT = content.some((c) => c.discipline === "ot");
      const hasShared = content.some((c) => c.discipline === "shared");
      expect(hasOT).toBe(true);
      expect(hasShared).toBe(true);
    });
  });

  describe("getEducationContentByReadingLevel", () => {
    it("should return high-school level content", () => {
      const content = getEducationContentByReadingLevel("high-school");
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.readingLevel === "high-school")).toBe(true);
    });

    it("should return content at various reading levels", () => {
      const allContent = getAllEducationContent();
      const levels = new Set(allContent.map((c) => c.readingLevel));
      expect(levels.size).toBeGreaterThan(0);
    });
  });

  describe("searchEducationContent", () => {
    it("should find content by title", () => {
      const results = searchEducationContent("Stroke Recovery");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((c) => c.title.includes("Stroke"))).toBe(true);
    });

    it("should find content by description", () => {
      const results = searchEducationContent("home safety");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find content by condition", () => {
      const results = searchEducationContent("low-back-pain");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchEducationContent("fall prevention");
      const results2 = searchEducationContent("FALL PREVENTION");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchEducationContent("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getPrintableEducationContent", () => {
    it("should return only printable content", () => {
      const content = getPrintableEducationContent();
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.printable === true)).toBe(true);
    });

    it("should include fall prevention guide", () => {
      const content = getPrintableEducationContent();
      expect(content.some((c) => c.title.includes("Fall Prevention"))).toBe(
        true,
      );
    });
  });

  describe("getSharedEducationContent", () => {
    it("should return only shared content", () => {
      const content = getSharedEducationContent();
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.discipline === "shared")).toBe(true);
    });

    it("should include stroke recovery content", () => {
      const content = getSharedEducationContent();
      expect(content.some((c) => c.title.includes("Stroke"))).toBe(true);
    });
  });

  describe("getPTEducationContent", () => {
    it("should return only PT content", () => {
      const content = getPTEducationContent();
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.discipline === "pt")).toBe(true);
    });

    it("should include low back pain content", () => {
      const content = getPTEducationContent();
      expect(content.some((c) => c.condition === "low-back-pain")).toBe(true);
    });
  });

  describe("getOTEducationContent", () => {
    it("should return only OT content", () => {
      const content = getOTEducationContent();
      expect(content.length).toBeGreaterThan(0);
      expect(content.every((c) => c.discipline === "ot")).toBe(true);
    });

    it("should include energy conservation content", () => {
      const content = getOTEducationContent();
      expect(content.some((c) => c.title.includes("Energy Conservation"))).toBe(
        true,
      );
    });
  });

  describe("getAllEducationContent", () => {
    it("should return all education content", () => {
      const all = getAllEducationContent();
      expect(all.length).toBeGreaterThan(0);
    });

    it("should have valid content structure", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.id).toBeDefined();
        expect(c.title).toBeDefined();
        expect(c.contentType).toBeDefined();
        expect(c.discipline).toMatch(/^(pt|ot|shared)$/);
        expect(c.condition).toBeDefined();
        expect(c.readingLevel).toMatch(
          /^(elementary|high-school|college|professional)$/,
        );
        expect(c.description).toBeDefined();
        expect(c.content).toBeDefined();
        expect(c.keyPoints.length).toBeGreaterThan(0);
        expect(typeof c.printable).toBe("boolean");
        expect(c.estimatedReadTime).toBeGreaterThan(0);
      });
    });
  });

  describe("Content Quality", () => {
    it("should have meaningful key points", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.keyPoints.length).toBeGreaterThan(0);
        expect(c.keyPoints.every((kp) => kp.length > 0)).toBe(true);
      });
    });

    it("should have substantial content", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.content.length).toBeGreaterThan(50);
      });
    });

    it("should have reasonable read times", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.estimatedReadTime).toBeGreaterThan(0);
        expect(c.estimatedReadTime).toBeLessThan(60);
      });
    });
  });

  describe("Content Types", () => {
    it("should have diverse content types", () => {
      const content = getAllEducationContent();
      const types = new Set(content.map((c) => c.contentType));
      expect(types.size).toBeGreaterThan(1);
    });

    it("should include home program content", () => {
      const content = getAllEducationContent();
      expect(content.some((c) => c.contentType === "home-program")).toBe(true);
    });

    it("should include safety precautions content", () => {
      const content = getAllEducationContent();
      expect(content.some((c) => c.contentType === "safety-precautions")).toBe(
        true,
      );
    });
  });

  describe("Reading Levels", () => {
    it("should have high-school level content", () => {
      const content = getAllEducationContent();
      expect(content.some((c) => c.readingLevel === "high-school")).toBe(true);
    });

    it("should have consistent reading levels", () => {
      const content = getAllEducationContent();
      const validLevels = [
        "elementary",
        "high-school",
        "college",
        "professional",
      ];
      content.forEach((c) => {
        expect(validLevels).toContain(c.readingLevel);
      });
    });
  });

  describe("Applicable Conditions", () => {
    it("should have applicable conditions for each content", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.applicableTo.length).toBeGreaterThan(0);
        expect(c.applicableTo.every((a) => typeof a === "string")).toBe(true);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each content", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.source).toBeDefined();
        expect(c.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each content", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.citation).toBeDefined();
        expect(c.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Last Updated", () => {
    it("should have valid last updated date", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(c.lastUpdated).toBeInstanceOf(Date);
        expect(c.lastUpdated.getTime()).toBeLessThanOrEqual(
          new Date().getTime(),
        );
      });
    });
  });

  describe("Printability", () => {
    it("should have printable flag", () => {
      const content = getAllEducationContent();
      content.forEach((c) => {
        expect(typeof c.printable).toBe("boolean");
      });
    });

    it("should have mostly printable content", () => {
      const content = getAllEducationContent();
      const printable = content.filter((c) => c.printable);
      expect(printable.length / content.length).toBeGreaterThan(0.8);
    });
  });
});
