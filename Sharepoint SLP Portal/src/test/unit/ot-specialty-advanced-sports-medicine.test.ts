/**
 * OT Advanced Specialty - Sports Medicine Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTSportsMedicineModuleById,
  getAllOTSportsMedicineModules,
  getOTSportsMedicineModulesByCategory,
  searchOTSportsMedicineModules,
  getOTSportsMedicineModulesByEvidenceLevel,
  getOTSportsMedicineInterventionStrategies,
  validateOTSportsMedicineAdaptiveEquipment,
} from "../../data/ot-specialty-advanced-sports-medicine";

describe("OT Advanced Specialty - Sports Medicine Rehabilitation", () => {
  it("should have 5 sports medicine modules", () => {
    expect(getAllOTSportsMedicineModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTSportsMedicineModuleById("ot-sm-001");
    expect(module?.name).toBe("Hand & Wrist Injury Management");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTSportsMedicineModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTSportsMedicineModulesByCategory("Sports");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTSportsMedicineModules("Hand");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTSportsMedicineModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTSportsMedicineInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate adaptive equipment", () => {
    const result = validateOTSportsMedicineAdaptiveEquipment(
      "ot-sm-001",
      "Splints",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid equipment", () => {
    const result = validateOTSportsMedicineAdaptiveEquipment(
      "ot-sm-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTSportsMedicineModules();
    all.forEach((m) => {
      expect(getOTSportsMedicineModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTSportsMedicineModuleById(null as any);
      getAllOTSportsMedicineModules();
      getOTSportsMedicineModulesByCategory("test");
      searchOTSportsMedicineModules("test");
      getOTSportsMedicineModulesByEvidenceLevel(1);
      getOTSportsMedicineInterventionStrategies();
      validateOTSportsMedicineAdaptiveEquipment("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTSportsMedicineModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.injuryTypes).toBeDefined();
      expect(m.assessmentFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.adaptiveEquipment).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTSportsMedicineModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTSportsMedicineModules();
    all.forEach((m) => {
      expect(m.injuryTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.adaptiveEquipment.length).toBeGreaterThan(0);
    });
  });
});
