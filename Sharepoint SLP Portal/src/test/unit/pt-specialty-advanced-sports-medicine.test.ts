/**
 * PT Advanced Specialty - Sports Medicine Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTSportsMedicineModuleById,
  getAllPTSportsMedicineModules,
  getPTSportsMedicineModulesByCategory,
  searchPTSportsMedicineModules,
  getPTSportsMedicineModulesByEvidenceLevel,
  getPTSportsMedicineReturnToPlayCriteria,
  validatePTSportsMedicineIntervention,
} from "../../data/pt-specialty-advanced-sports-medicine";

describe("PT Advanced Specialty - Sports Medicine Rehabilitation", () => {
  it("should have 5 sports medicine modules", () => {
    expect(getAllPTSportsMedicineModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTSportsMedicineModuleById("pt-sm-001");
    expect(module?.name).toBe("Anterior Cruciate Ligament (ACL) Injury");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTSportsMedicineModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTSportsMedicineModulesByCategory("Sports");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTSportsMedicineModules("ACL");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTSportsMedicineModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return return to play criteria", () => {
    const criteria = getPTSportsMedicineReturnToPlayCriteria();
    expect(Array.isArray(criteria)).toBe(true);
    expect(criteria.length).toBeGreaterThan(0);
  });

  it("should validate interventions", () => {
    const result = validatePTSportsMedicineIntervention(
      "pt-sm-001",
      "ROM restoration",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid interventions", () => {
    const result = validatePTSportsMedicineIntervention("pt-sm-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTSportsMedicineModules();
    all.forEach((m) => {
      expect(getPTSportsMedicineModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTSportsMedicineModuleById(null as any);
      getAllPTSportsMedicineModules();
      getPTSportsMedicineModulesByCategory("test");
      searchPTSportsMedicineModules("test");
      getPTSportsMedicineModulesByEvidenceLevel(1);
      getPTSportsMedicineReturnToPlayCriteria();
      validatePTSportsMedicineIntervention("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTSportsMedicineModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.injuryTypes).toBeDefined();
      expect(m.assessmentFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.returnToPlayCriteria).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTSportsMedicineModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTSportsMedicineModules();
    all.forEach((m) => {
      expect(m.injuryTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.returnToPlayCriteria.length).toBeGreaterThan(0);
    });
  });
});
