import { describe, it, expect } from "vitest";
import {
  getOTSpecialtyAreaById,
  getOTSpecialtyAreaBySpecialty,
  searchOTSpecialtyArea,
  getAllOTSpecialtyAreas,
  getOTSpecialtyAreaSpecialties,
  getOTSpecialtyAreaForIndication,
} from "../../data/ot-specialty-areas";

describe("OT Module 8: Specialty Areas", () => {
  describe("getOTSpecialtyAreaById", () => {
    it("should return specialty area by valid ID", () => {
      const specialty = getOTSpecialtyAreaById("ot-spec-001");
      expect(specialty).toBeDefined();
      expect(specialty?.name).toBeDefined();
    });

    it("should return undefined for invalid ID", () => {
      const specialty = getOTSpecialtyAreaById("invalid-id");
      expect(specialty).toBeUndefined();
    });

    it("should return correct specialty properties", () => {
      const specialty = getOTSpecialtyAreaById("ot-spec-001");
      expect(specialty?.specialty).toBeDefined();
      expect(specialty?.indications.length).toBeGreaterThan(0);
      expect(specialty?.assessmentTools.length).toBeGreaterThan(0);
    });

    it("should have valid abbreviation", () => {
      const specialty = getOTSpecialtyAreaById("ot-spec-001");
      expect(specialty?.abbreviation).toBeDefined();
      expect(specialty?.abbreviation.length).toBeGreaterThan(0);
    });
  });

  describe("getOTSpecialtyAreaBySpecialty", () => {
    it("should return specialty areas for valid specialty", () => {
      const specialties = getOTSpecialtyAreaBySpecialty("pediatric");
      expect(specialties.length).toBeGreaterThan(0);
      expect(specialties.every((s) => s.specialty === "pediatric")).toBe(true);
    });

    it("should return empty array for non-existent specialty", () => {
      const specialties = getOTSpecialtyAreaBySpecialty("non-existent");
      expect(specialties.length).toBe(0);
    });

    it("should return specialty areas with valid structure", () => {
      const specialties = getOTSpecialtyAreaBySpecialty("pediatric");
      specialties.forEach((s) => {
        expect(s.id).toBeDefined();
        expect(s.name).toBeDefined();
        expect(s.abbreviation).toBeDefined();
      });
    });
  });

  describe("searchOTSpecialtyArea", () => {
    it("should find specialty by name", () => {
      const results = searchOTSpecialtyArea("Pediatric");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find specialty by description", () => {
      const results = searchOTSpecialtyArea("therapy");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTSpecialtyArea("pediatric");
      const results2 = searchOTSpecialtyArea("PEDIATRIC");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTSpecialtyArea("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTSpecialtyAreas", () => {
    it("should return all OT specialty areas", () => {
      const specialties = getAllOTSpecialtyAreas();
      expect(specialties.length).toBe(10);
    });

    it("should have valid specialty structure", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((specialty) => {
        expect(specialty.id).toBeDefined();
        expect(specialty.name).toBeDefined();
        expect(specialty.specialty).toBeDefined();
        expect(specialty.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.abbreviation).toBeDefined();
        expect(s.indications.length).toBeGreaterThan(0);
        expect(s.contraindications.length).toBeGreaterThan(0);
        expect(s.precautions.length).toBeGreaterThan(0);
        expect(s.assessmentTools.length).toBeGreaterThan(0);
        expect(s.interventionStrategies.length).toBeGreaterThan(0);
        expect(s.expectedOutcomes.length).toBeGreaterThan(0);
        expect(s.source).toBeDefined();
        expect(s.citation).toBeDefined();
        expect(s.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have valid evidence levels", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.evidenceLevel).toBeGreaterThan(0);
        expect(s.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("getOTSpecialtyAreaSpecialties", () => {
    it("should return all specialties", () => {
      const specialties = getOTSpecialtyAreaSpecialties();
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should include expected specialties", () => {
      const specialties = getOTSpecialtyAreaSpecialties();
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const specialties = getOTSpecialtyAreaSpecialties();
      const uniqueSpecialties = new Set(specialties);
      expect(specialties.length).toBe(uniqueSpecialties.size);
    });
  });

  describe("getOTSpecialtyAreaForIndication", () => {
    it("should return specialty areas for valid indication", () => {
      const specialties = getOTSpecialtyAreaForIndication(
        "Developmental delay",
      );
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should return specialty areas matching indication", () => {
      const specialties = getOTSpecialtyAreaForIndication(
        "Developmental delay",
      );
      specialties.forEach((s) => {
        expect(s.indications.some((i) => i.includes("Developmental"))).toBe(
          true,
        );
      });
    });

    it("should return empty array for non-existent indication", () => {
      const specialties = getOTSpecialtyAreaForIndication("xyz123nonexistent");
      expect(specialties.length).toBe(0);
    });
  });

  describe("Specialty Area Properties", () => {
    it("should have meaningful indications", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.indications.length).toBeGreaterThan(0);
        expect(s.indications.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.contraindications.length).toBeGreaterThan(0);
        expect(s.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have precautions", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.precautions.length).toBeGreaterThan(0);
        expect(s.precautions.every((pr) => pr.length > 0)).toBe(true);
      });
    });

    it("should have assessment tools", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.assessmentTools.length).toBeGreaterThan(0);
        expect(s.assessmentTools.every((t) => t.length > 0)).toBe(true);
      });
    });

    it("should have intervention strategies", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.interventionStrategies.length).toBeGreaterThan(0);
        expect(s.interventionStrategies.every((st) => st.length > 0)).toBe(
          true,
        );
      });
    });

    it("should have expected outcomes", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.expectedOutcomes.length).toBeGreaterThan(0);
        expect(s.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const specialties = getAllOTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.source).toBeDefined();
        expect(s.source.length).toBeGreaterThan(0);
        expect(s.citation).toBeDefined();
        expect(s.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 specialty areas", () => {
      const specialties = getAllOTSpecialtyAreas();
      expect(specialties.length).toBe(10);
    });

    it("should cover multiple specialties", () => {
      const specialties = getAllOTSpecialtyAreas();
      const uniqueSpecialties = new Set(specialties.map((s) => s.specialty));
      expect(uniqueSpecialties.size).toBeGreaterThan(1);
    });

    it("should have comprehensive indication coverage", () => {
      const specialties = getAllOTSpecialtyAreas();
      const allIndications = specialties.flatMap((s) => s.indications);
      expect(allIndications.length).toBeGreaterThan(10);
    });

    it("should have comprehensive assessment tool coverage", () => {
      const specialties = getAllOTSpecialtyAreas();
      const allTools = specialties.flatMap((s) => s.assessmentTools);
      expect(allTools.length).toBeGreaterThan(10);
    });

    it("should have comprehensive intervention strategy coverage", () => {
      const specialties = getAllOTSpecialtyAreas();
      const allStrategies = specialties.flatMap(
        (s) => s.interventionStrategies,
      );
      expect(allStrategies.length).toBeGreaterThan(10);
    });
  });
});
