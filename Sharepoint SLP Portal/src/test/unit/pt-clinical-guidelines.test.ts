import { describe, it, expect } from "vitest";
import {
  getPTClinicalGuidelineById,
  getPTClinicalGuidelinesByCondition,
  searchPTClinicalGuidelines,
  getAllPTClinicalGuidelines,
  getPTClinicalGuidelinesByYear,
  getPTClinicalGuidelineConditions,
  type PTClinicalGuideline,
} from "../../data/pt-clinical-guidelines";

describe("PT Module 2: Clinical Guidelines", () => {
  describe("getPTClinicalGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getPTClinicalGuidelineById("pt-cg-001");
      expect(guideline).toBeDefined();
      expect(guideline?.name).toContain("Acute Low Back Pain");
    });

    it("should return undefined for invalid ID", () => {
      const guideline = getPTClinicalGuidelineById("invalid-id");
      expect(guideline).toBeUndefined();
    });

    it("should return correct guideline properties", () => {
      const guideline = getPTClinicalGuidelineById("pt-cg-001");
      expect(guideline?.condition).toBe("acute-low-back-pain");
      expect(guideline?.year).toBe(2017);
      expect(guideline?.keyRecommendations.length).toBeGreaterThan(0);
    });
  });

  describe("getPTClinicalGuidelinesByCondition", () => {
    it("should return guidelines for acute-low-back-pain", () => {
      const guidelines = getPTClinicalGuidelinesByCondition(
        "acute-low-back-pain",
      );
      expect(guidelines.length).toBeGreaterThan(0);
      expect(
        guidelines.every((g) => g.condition === "acute-low-back-pain"),
      ).toBe(true);
    });

    it("should return guidelines for chronic-low-back-pain", () => {
      const guidelines = getPTClinicalGuidelinesByCondition(
        "chronic-low-back-pain",
      );
      expect(guidelines.length).toBeGreaterThan(0);
      expect(
        guidelines.every((g) => g.condition === "chronic-low-back-pain"),
      ).toBe(true);
    });

    it("should return guidelines for stroke", () => {
      const guidelines = getPTClinicalGuidelinesByCondition("stroke");
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines.every((g) => g.condition === "stroke")).toBe(true);
    });

    it("should return empty array for non-existent condition", () => {
      const guidelines = getPTClinicalGuidelinesByCondition(
        "non-existent-condition",
      );
      expect(guidelines.length).toBe(0);
    });
  });

  describe("searchPTClinicalGuidelines", () => {
    it("should find guideline by name", () => {
      const results = searchPTClinicalGuidelines("Low Back Pain");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((g) => g.name.includes("Low Back Pain"))).toBe(true);
    });

    it("should find guideline by condition", () => {
      const results = searchPTClinicalGuidelines("stroke");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((g) => g.condition === "stroke")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTClinicalGuidelines("shoulder");
      const results2 = searchPTClinicalGuidelines("SHOULDER");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTClinicalGuidelines("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTClinicalGuidelines", () => {
    it("should return all PT clinical guidelines", () => {
      const guidelines = getAllPTClinicalGuidelines();
      expect(guidelines.length).toBe(9);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.condition).toBeDefined();
        expect(guideline.year).toBeGreaterThan(2000);
        expect(guideline.description).toBeDefined();
        expect(guideline.keyRecommendations.length).toBeGreaterThan(0);
        expect(guideline.assessmentFocus.length).toBeGreaterThan(0);
        expect(guideline.interventionStrategies.length).toBeGreaterThan(0);
        expect(guideline.expectedOutcomes.length).toBeGreaterThan(0);
        expect(guideline.contraindications.length).toBeGreaterThan(0);
        expect(guideline.precautions.length).toBeGreaterThan(0);
        expect(guideline.referralCriteria.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.source).toBeDefined();
        expect(g.citation).toBeDefined();
        expect(g.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getPTClinicalGuidelinesByYear", () => {
    it("should return guidelines from 2017", () => {
      const guidelines = getPTClinicalGuidelinesByYear(2017);
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines.every((g) => g.year === 2017)).toBe(true);
    });

    it("should return guidelines from 2014", () => {
      const guidelines = getPTClinicalGuidelinesByYear(2014);
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines.every((g) => g.year === 2014)).toBe(true);
    });

    it("should return empty array for non-existent year", () => {
      const guidelines = getPTClinicalGuidelinesByYear(1990);
      expect(guidelines.length).toBe(0);
    });
  });

  describe("getPTClinicalGuidelineConditions", () => {
    it("should return all conditions", () => {
      const conditions = getPTClinicalGuidelineConditions();
      expect(conditions.length).toBeGreaterThan(0);
    });

    it("should include expected conditions", () => {
      const conditions = getPTClinicalGuidelineConditions();
      expect(conditions).toContain("acute-low-back-pain");
      expect(conditions).toContain("chronic-low-back-pain");
      expect(conditions).toContain("stroke");
      expect(conditions).toContain("shoulder-pain");
    });
  });

  describe("Key Recommendations", () => {
    it("should have meaningful recommendations", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.keyRecommendations.length).toBeGreaterThan(0);
        expect(g.keyRecommendations.every((r) => r.length > 0)).toBe(true);
      });
    });

    it("should have specific recommendations for low back pain", () => {
      const guideline = getPTClinicalGuidelineById("pt-cg-001");
      expect(guideline?.keyRecommendations).toContain(
        "Early mobilization and activity as tolerated",
      );
    });
  });

  describe("Assessment Focus", () => {
    it("should have assessment focus items", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.assessmentFocus.length).toBeGreaterThan(0);
        expect(g.assessmentFocus.every((a) => a.length > 0)).toBe(true);
      });
    });
  });

  describe("Intervention Strategies", () => {
    it("should have intervention strategies", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.interventionStrategies.length).toBeGreaterThan(0);
        expect(g.interventionStrategies.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.expectedOutcomes.length).toBeGreaterThan(0);
        expect(g.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.contraindications.length).toBeGreaterThan(0);
        expect(g.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should list specific contraindications for low back pain", () => {
      const guideline = getPTClinicalGuidelineById("pt-cg-001");
      expect(guideline?.contraindications).toContain("Spinal cord compression");
      expect(guideline?.contraindications).toContain("Cauda equina syndrome");
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.precautions.length).toBeGreaterThan(0);
        expect(g.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Referral Criteria", () => {
    it("should have referral criteria", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.referralCriteria.length).toBeGreaterThan(0);
        expect(g.referralCriteria.every((r) => r.length > 0)).toBe(true);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each guideline", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.source).toBeDefined();
        expect(g.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each guideline", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.citation).toBeDefined();
        expect(g.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Last Updated", () => {
    it("should have valid last updated date", () => {
      const guidelines = getAllPTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.lastUpdated).toBeInstanceOf(Date);
        expect(g.lastUpdated.getTime()).toBeLessThanOrEqual(
          new Date().getTime(),
        );
      });
    });
  });

  describe("Guideline Coverage", () => {
    it("should cover major PT conditions", () => {
      const guidelines = getAllPTClinicalGuidelines();
      const conditions = guidelines.map((g) => g.condition);
      expect(conditions).toContain("acute-low-back-pain");
      expect(conditions).toContain("chronic-low-back-pain");
      expect(conditions).toContain("neck-pain");
      expect(conditions).toContain("shoulder-pain");
      expect(conditions).toContain("stroke");
    });

    it("should have guidelines for neurological conditions", () => {
      const guidelines = getAllPTClinicalGuidelines();
      const neuroConditions = guidelines.filter((g) =>
        ["stroke", "parkinsons-disease", "multiple-sclerosis"].includes(
          g.condition,
        ),
      );
      expect(neuroConditions.length).toBeGreaterThan(0);
    });
  });
});
