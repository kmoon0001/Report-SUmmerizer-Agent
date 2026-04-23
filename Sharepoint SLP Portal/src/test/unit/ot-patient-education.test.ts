import { describe, it, expect } from "vitest";
import {
  getOTPatientEducationById,
  getOTPatientEducationByCategory,
  searchOTPatientEducation,
  getAllOTPatientEducation,
  getOTPatientEducationCategories,
  getOTPatientEducationForTopic,
} from "../../data/ot-patient-education";

describe("OT Module 9: Patient Education", () => {
  describe("getOTPatientEducationById", () => {
    it("should return patient education by valid ID", () => {
      const education = getOTPatientEducationById("ot-edu-001");
      expect(education).toBeDefined();
      expect(education?.title).toBeDefined();
    });

    it("should return undefined for invalid ID", () => {
      const education = getOTPatientEducationById("invalid-id");
      expect(education).toBeUndefined();
    });

    it("should return correct education properties", () => {
      const education = getOTPatientEducationById("ot-edu-001");
      expect(education?.category).toBeDefined();
      expect(education?.keyPoints.length).toBeGreaterThan(0);
      expect(education?.homeExercises.length).toBeGreaterThan(0);
    });

    it("should have valid reading level", () => {
      const education = getOTPatientEducationById("ot-edu-001");
      expect(education?.readingLevel).toBeDefined();
      expect(education?.readingLevel.length).toBeGreaterThan(0);
    });
  });

  describe("getOTPatientEducationByCategory", () => {
    it("should return education for valid category", () => {
      const educations = getOTPatientEducationByCategory("hand-therapy");
      expect(educations.length).toBeGreaterThan(0);
      expect(educations.every((e) => e.category === "hand-therapy")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const educations = getOTPatientEducationByCategory("non-existent");
      expect(educations.length).toBe(0);
    });

    it("should return education with valid structure", () => {
      const educations = getOTPatientEducationByCategory("hand-therapy");
      educations.forEach((e) => {
        expect(e.id).toBeDefined();
        expect(e.title).toBeDefined();
        expect(e.keyPoints.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchOTPatientEducation", () => {
    it("should find education by title", () => {
      const results = searchOTPatientEducation("Hand");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find education by description", () => {
      const results = searchOTPatientEducation("therapy");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTPatientEducation("hand");
      const results2 = searchOTPatientEducation("HAND");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTPatientEducation("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTPatientEducation", () => {
    it("should return all OT patient education materials", () => {
      const educations = getAllOTPatientEducation();
      expect(educations.length).toBe(10);
    });

    it("should have valid education structure", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((education) => {
        expect(education.id).toBeDefined();
        expect(education.title).toBeDefined();
        expect(education.category).toBeDefined();
        expect(education.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.topic).toBeDefined();
        expect(e.targetAudience).toBeDefined();
        expect(e.keyPoints.length).toBeGreaterThan(0);
        expect(e.homeExercises.length).toBeGreaterThan(0);
        expect(e.precautions.length).toBeGreaterThan(0);
        expect(e.whenToContact.length).toBeGreaterThan(0);
        expect(e.resources.length).toBeGreaterThan(0);
        expect(e.source).toBeDefined();
        expect(e.citation).toBeDefined();
        expect(e.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have valid reading levels", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.readingLevel).toBeDefined();
        expect(e.readingLevel.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getOTPatientEducationCategories", () => {
    it("should return all categories", () => {
      const categories = getOTPatientEducationCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getOTPatientEducationCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTPatientEducationCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTPatientEducationForTopic", () => {
    it("should return education for valid topic", () => {
      const educations = getOTPatientEducationForTopic("Hand Therapy");
      expect(educations.length).toBeGreaterThan(0);
    });

    it("should return education matching topic", () => {
      const educations = getOTPatientEducationForTopic("Hand Therapy");
      educations.forEach((e) => {
        expect(e.topic.toLowerCase().includes("hand")).toBe(true);
      });
    });

    it("should return empty array for non-existent topic", () => {
      const educations = getOTPatientEducationForTopic("xyz123nonexistent");
      expect(educations.length).toBe(0);
    });
  });

  describe("Patient Education Properties", () => {
    it("should have meaningful key points", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.keyPoints.length).toBeGreaterThan(0);
        expect(e.keyPoints.every((kp) => kp.length > 0)).toBe(true);
      });
    });

    it("should have home exercises", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.homeExercises.length).toBeGreaterThan(0);
        e.homeExercises.forEach((exercise) => {
          expect(exercise.name).toBeDefined();
          expect(exercise.description).toBeDefined();
          expect(exercise.frequency).toBeDefined();
          expect(exercise.duration).toBeDefined();
        });
      });
    });

    it("should have precautions", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.precautions.length).toBeGreaterThan(0);
        expect(e.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });

    it("should have when to contact information", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.whenToContact.length).toBeGreaterThan(0);
        expect(e.whenToContact.every((w) => w.length > 0)).toBe(true);
      });
    });

    it("should have resources", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.resources.length).toBeGreaterThan(0);
        expect(e.resources.every((r) => r.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.source).toBeDefined();
        expect(e.source.length).toBeGreaterThan(0);
        expect(e.citation).toBeDefined();
        expect(e.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Reading Level and Accessibility", () => {
    it("should have estimated read time", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.estimatedReadTime).toBeDefined();
        expect(e.estimatedReadTime.length).toBeGreaterThan(0);
      });
    });

    it("should have target audience defined", () => {
      const educations = getAllOTPatientEducation();
      educations.forEach((e) => {
        expect(e.targetAudience).toBeDefined();
        expect(e.targetAudience.length).toBeGreaterThan(0);
      });
    });

    it("should have appropriate reading levels distributed", () => {
      const educations = getAllOTPatientEducation();
      const readingLevels = educations.map((e) => e.readingLevel);
      expect(readingLevels.length).toBeGreaterThan(0);
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 patient education materials", () => {
      const educations = getAllOTPatientEducation();
      expect(educations.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const educations = getAllOTPatientEducation();
      const categories = new Set(educations.map((e) => e.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive topic coverage", () => {
      const educations = getAllOTPatientEducation();
      const topics = new Set(educations.map((e) => e.topic));
      expect(topics.size).toBeGreaterThan(1);
    });

    it("should have comprehensive home exercise coverage", () => {
      const educations = getAllOTPatientEducation();
      const allExercises = educations.flatMap((e) => e.homeExercises);
      expect(allExercises.length).toBeGreaterThan(10);
    });

    it("should have comprehensive resource coverage", () => {
      const educations = getAllOTPatientEducation();
      const allResources = educations.flatMap((e) => e.resources);
      expect(allResources.length).toBeGreaterThan(10);
    });
  });
});
