import { describe, it, expect } from "vitest";
import {
  getPTPatientEducationById,
  getPTPatientEducationByCategory,
  searchPTPatientEducation,
  getAllPTPatientEducation,
  getPTPatientEducationCategories,
  getPTPatientEducationForTopic,
} from "../../data/pt-patient-education";

describe("PT Module 9: Patient Education", () => {
  describe("getPTPatientEducationById", () => {
    it("should return education material by valid ID", () => {
      const education = getPTPatientEducationById("pt-edu-001");
      expect(education).toBeDefined();
      expect(education?.title).toBe("Understanding Low Back Pain");
    });

    it("should return undefined for invalid ID", () => {
      const education = getPTPatientEducationById("invalid-id");
      expect(education).toBeUndefined();
    });

    it("should return correct education properties", () => {
      const education = getPTPatientEducationById("pt-edu-001");
      expect(education?.category).toBe("pain-management");
      expect(education?.keyPoints.length).toBeGreaterThan(0);
      expect(education?.homeExercises.length).toBeGreaterThan(0);
    });
  });

  describe("getPTPatientEducationByCategory", () => {
    it("should return pain management education", () => {
      const materials = getPTPatientEducationByCategory("pain-management");
      expect(materials.length).toBeGreaterThan(0);
      expect(materials.every((m) => m.category === "pain-management")).toBe(
        true,
      );
    });

    it("should return post-operative education", () => {
      const materials = getPTPatientEducationByCategory("post-operative");
      expect(materials.length).toBeGreaterThan(0);
      expect(materials.every((m) => m.category === "post-operative")).toBe(
        true,
      );
    });

    it("should return neurological education", () => {
      const materials = getPTPatientEducationByCategory("neurological");
      expect(materials.length).toBeGreaterThan(0);
      expect(materials.every((m) => m.category === "neurological")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const materials = getPTPatientEducationByCategory("non-existent");
      expect(materials.length).toBe(0);
    });
  });

  describe("searchPTPatientEducation", () => {
    it("should find education by title", () => {
      const results = searchPTPatientEducation("Low Back Pain");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.title.includes("Low Back Pain"))).toBe(true);
    });

    it("should find education by topic", () => {
      const results = searchPTPatientEducation("Stroke");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTPatientEducation("arthritis");
      const results2 = searchPTPatientEducation("ARTHRITIS");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTPatientEducation("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTPatientEducation", () => {
    it("should return all PT patient education materials", () => {
      const materials = getAllPTPatientEducation();
      expect(materials.length).toBe(10);
    });

    it("should have valid education structure", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((material) => {
        expect(material.id).toBeDefined();
        expect(material.title).toBeDefined();
        expect(material.topic).toBeDefined();
        expect(material.category).toBeDefined();
        expect(material.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.targetAudience).toBeDefined();
        expect(m.keyPoints.length).toBeGreaterThan(0);
        expect(m.homeExercises.length).toBeGreaterThan(0);
        expect(m.precautions.length).toBeGreaterThan(0);
        expect(m.whenToContact.length).toBeGreaterThan(0);
        expect(m.resources.length).toBeGreaterThan(0);
        expect(m.readingLevel).toBeDefined();
        expect(m.estimatedReadTime).toBeDefined();
        expect(m.source).toBeDefined();
        expect(m.citation).toBeDefined();
        expect(m.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have home exercises with required structure", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        m.homeExercises.forEach((exercise) => {
          expect(exercise.name).toBeDefined();
          expect(exercise.description).toBeDefined();
          expect(exercise.frequency).toBeDefined();
          expect(exercise.duration).toBeDefined();
        });
      });
    });
  });

  describe("getPTPatientEducationCategories", () => {
    it("should return all categories", () => {
      const categories = getPTPatientEducationCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTPatientEducationCategories();
      expect(categories).toContain("pain-management");
      expect(categories).toContain("post-operative");
      expect(categories).toContain("neurological");
    });

    it("should not have duplicates", () => {
      const categories = getPTPatientEducationCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getPTPatientEducationForTopic", () => {
    it("should return education for low back pain", () => {
      const materials = getPTPatientEducationForTopic("Low Back Pain");
      expect(materials.length).toBeGreaterThan(0);
    });

    it("should return education for stroke recovery", () => {
      const materials = getPTPatientEducationForTopic("Stroke");
      expect(materials.length).toBeGreaterThan(0);
    });

    it("should return education for fall prevention", () => {
      const materials = getPTPatientEducationForTopic("Fall");
      expect(materials.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent topic", () => {
      const materials = getPTPatientEducationForTopic("non-existent-topic");
      expect(materials.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getPTPatientEducationForTopic("arthritis");
      const results2 = getPTPatientEducationForTopic("ARTHRITIS");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Key Points", () => {
    it("should have meaningful key points", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.keyPoints.length).toBeGreaterThan(0);
        expect(m.keyPoints.every((k) => k.length > 0)).toBe(true);
      });
    });
  });

  describe("Home Exercises", () => {
    it("should have home exercises", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.homeExercises.length).toBeGreaterThan(0);
      });
    });

    it("should have exercise descriptions", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        m.homeExercises.forEach((exercise) => {
          expect(exercise.description.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.precautions.length).toBeGreaterThan(0);
        expect(m.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("When to Contact", () => {
    it("should have when to contact information", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.whenToContact.length).toBeGreaterThan(0);
        expect(m.whenToContact.every((w) => w.length > 0)).toBe(true);
      });
    });
  });

  describe("Resources", () => {
    it("should have resources", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.resources.length).toBeGreaterThan(0);
        expect(m.resources.every((r) => r.length > 0)).toBe(true);
      });
    });
  });

  describe("Reading Level", () => {
    it("should have reading level", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.readingLevel).toBeDefined();
        expect(m.readingLevel.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Estimated Read Time", () => {
    it("should have estimated read time", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.estimatedReadTime).toBeDefined();
        expect(m.estimatedReadTime.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each material", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each material", () => {
      const materials = getAllPTPatientEducation();
      materials.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Education Coverage", () => {
    it("should cover major education topics", () => {
      const materials = getAllPTPatientEducation();
      const topics = materials.map((m) => m.topic);
      expect(topics).toContain("Low Back Pain");
      expect(topics).toContain("Stroke Recovery");
      expect(topics).toContain("Fall Prevention");
    });

    it("should have 10 education materials total", () => {
      const materials = getAllPTPatientEducation();
      expect(materials.length).toBe(10);
    });
  });
});
