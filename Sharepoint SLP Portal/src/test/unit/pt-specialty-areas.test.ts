import { describe, it, expect } from "vitest";
import {
  getPTSpecialtyAreaById,
  getPTSpecialtyAreaBySpecialty,
  searchPTSpecialtyArea,
  getAllPTSpecialtyAreas,
  getPTSpecialtyAreaSpecialties,
  getPTSpecialtyAreaForIndication,
} from "../../data/pt-specialty-areas";

describe("PT Module 8: Specialty Areas", () => {
  describe("getPTSpecialtyAreaById", () => {
    it("should return specialty area by valid ID", () => {
      const specialty = getPTSpecialtyAreaById("pt-spec-001");
      expect(specialty).toBeDefined();
      expect(specialty?.name).toBe("Cardiovascular Rehabilitation");
    });

    it("should return undefined for invalid ID", () => {
      const specialty = getPTSpecialtyAreaById("invalid-id");
      expect(specialty).toBeUndefined();
    });

    it("should return correct specialty properties", () => {
      const specialty = getPTSpecialtyAreaById("pt-spec-001");
      expect(specialty?.specialty).toBe("cardiovascular");
      expect(specialty?.indications.length).toBeGreaterThan(0);
      expect(specialty?.assessmentTools.length).toBeGreaterThan(0);
    });
  });

  describe("getPTSpecialtyAreaBySpecialty", () => {
    it("should return cardiovascular specialty", () => {
      const specialties = getPTSpecialtyAreaBySpecialty("cardiovascular");
      expect(specialties.length).toBeGreaterThan(0);
      expect(specialties.every((s) => s.specialty === "cardiovascular")).toBe(
        true,
      );
    });

    it("should return neurological specialty", () => {
      const specialties = getPTSpecialtyAreaBySpecialty("neurological");
      expect(specialties.length).toBeGreaterThan(0);
      expect(specialties.every((s) => s.specialty === "neurological")).toBe(
        true,
      );
    });

    it("should return orthopedic specialty", () => {
      const specialties = getPTSpecialtyAreaBySpecialty("orthopedic");
      expect(specialties.length).toBeGreaterThan(0);
      expect(specialties.every((s) => s.specialty === "orthopedic")).toBe(true);
    });

    it("should return empty array for non-existent specialty", () => {
      const specialties = getPTSpecialtyAreaBySpecialty("non-existent");
      expect(specialties.length).toBe(0);
    });
  });

  describe("searchPTSpecialtyArea", () => {
    it("should find specialty by name", () => {
      const results = searchPTSpecialtyArea("Cardiovascular");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.name.includes("Cardiovascular"))).toBe(true);
    });

    it("should find specialty by abbreviation", () => {
      const results = searchPTSpecialtyArea("CR");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTSpecialtyArea("neurological");
      const results2 = searchPTSpecialtyArea("NEUROLOGICAL");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTSpecialtyArea("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTSpecialtyAreas", () => {
    it("should return all PT specialty areas", () => {
      const specialties = getAllPTSpecialtyAreas();
      expect(specialties.length).toBe(10);
    });

    it("should have valid specialty structure", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((specialty) => {
        expect(specialty.id).toBeDefined();
        expect(specialty.name).toBeDefined();
        expect(specialty.abbreviation).toBeDefined();
        expect(specialty.specialty).toBeDefined();
        expect(specialty.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.indications.length).toBeGreaterThan(0);
        expect(s.contraindications.length).toBeGreaterThan(0);
        expect(s.precautions.length).toBeGreaterThan(0);
        expect(s.assessmentTools.length).toBeGreaterThan(0);
        expect(s.interventionStrategies.length).toBeGreaterThan(0);
        expect(s.expectedOutcomes.length).toBeGreaterThan(0);
        expect(s.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(s.evidenceLevel).toBeLessThanOrEqual(5);
        expect(s.source).toBeDefined();
        expect(s.citation).toBeDefined();
        expect(s.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getPTSpecialtyAreaSpecialties", () => {
    it("should return all specialties", () => {
      const specialties = getPTSpecialtyAreaSpecialties();
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should include expected specialties", () => {
      const specialties = getPTSpecialtyAreaSpecialties();
      expect(specialties).toContain("cardiovascular");
      expect(specialties).toContain("neurological");
      expect(specialties).toContain("orthopedic");
    });

    it("should not have duplicates", () => {
      const specialties = getPTSpecialtyAreaSpecialties();
      const uniqueSpecialties = new Set(specialties);
      expect(specialties.length).toBe(uniqueSpecialties.size);
    });
  });

  describe("getPTSpecialtyAreaForIndication", () => {
    it("should return specialty for stroke", () => {
      const specialties = getPTSpecialtyAreaForIndication("Stroke");
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should return specialty for heart failure", () => {
      const specialties = getPTSpecialtyAreaForIndication("Heart failure");
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should return specialty for joint replacement", () => {
      const specialties = getPTSpecialtyAreaForIndication("Joint replacement");
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const specialties = getPTSpecialtyAreaForIndication(
        "non-existent-indication",
      );
      expect(specialties.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getPTSpecialtyAreaForIndication("stroke");
      const results2 = getPTSpecialtyAreaForIndication("STROKE");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.indications.length).toBeGreaterThan(0);
        expect(s.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.contraindications.length).toBeGreaterThan(0);
        expect(s.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.precautions.length).toBeGreaterThan(0);
        expect(s.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Assessment Tools", () => {
    it("should have assessment tools", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.assessmentTools.length).toBeGreaterThan(0);
        expect(s.assessmentTools.every((t) => t.length > 0)).toBe(true);
      });
    });
  });

  describe("Intervention Strategies", () => {
    it("should have intervention strategies", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.interventionStrategies.length).toBeGreaterThan(0);
        expect(s.interventionStrategies.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.expectedOutcomes.length).toBeGreaterThan(0);
        expect(s.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(s.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each specialty", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.source).toBeDefined();
        expect(s.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each specialty", () => {
      const specialties = getAllPTSpecialtyAreas();
      specialties.forEach((s) => {
        expect(s.citation).toBeDefined();
        expect(s.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Specialty Coverage", () => {
    it("should cover major specialty areas", () => {
      const specialties = getAllPTSpecialtyAreas();
      const specialtyTypes = specialties.map((s) => s.specialty);
      expect(specialtyTypes).toContain("cardiovascular");
      expect(specialtyTypes).toContain("neurological");
      expect(specialtyTypes).toContain("orthopedic");
    });

    it("should have 10 specialty areas total", () => {
      const specialties = getAllPTSpecialtyAreas();
      expect(specialties.length).toBe(10);
    });
  });
});
