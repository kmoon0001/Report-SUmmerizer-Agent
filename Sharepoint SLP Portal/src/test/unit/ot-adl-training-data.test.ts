/**
 * OT ADL Training Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTADLActivityById,
  getAllOTADLActivities,
  getOTADLActivitiesByCategory,
  searchOTADLActivities,
  getOTADLActivitiesByEvidenceLevel,
  getAdaptiveEquipmentList,
  validateADLActivity,
} from "../../data/ot-adl-training-data";

describe("OT ADL Training Data", () => {
  it("should have 5 ADL activities", () => {
    expect(getAllOTADLActivities().length).toBe(5);
  });

  it("should return activity by ID", () => {
    const activity = getOTADLActivityById("ot-adl-001");
    expect(activity?.name).toContain("Dressing");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTADLActivityById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const activities = getOTADLActivitiesByCategory("Self-Care");
    expect(activities.length).toBeGreaterThan(0);
  });

  it("should search activities", () => {
    const results = searchOTADLActivities("Bathing");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const activities = getOTADLActivitiesByEvidenceLevel(1);
    expect(activities.length).toBeGreaterThan(0);
  });

  it("should return adaptive equipment list", () => {
    const equipment = getAdaptiveEquipmentList();
    expect(Array.isArray(equipment)).toBe(true);
    expect(equipment.length).toBeGreaterThan(0);
  });

  it("should validate ADL activity", () => {
    const result = validateADLActivity("ot-adl-001", "Seated dressing");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid strategy", () => {
    const result = validateADLActivity("ot-adl-001", "Invalid strategy");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTADLActivities();
    all.forEach((a) => {
      expect(getOTADLActivityById(a.id)).toEqual(a);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTADLActivityById(null as any);
      getAllOTADLActivities();
      getOTADLActivitiesByCategory("test");
      searchOTADLActivities("test");
      getOTADLActivitiesByEvidenceLevel(1);
      getAdaptiveEquipmentList();
      validateADLActivity("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTADLActivities();
    all.forEach((a) => {
      expect(a.id).toBeDefined();
      expect(a.name).toBeDefined();
      expect(a.category).toBeDefined();
      expect(a.description).toBeDefined();
      expect(a.occupationalGoals).toBeDefined();
      expect(a.adaptiveStrategies).toBeDefined();
      expect(a.adaptiveEquipment).toBeDefined();
      expect(a.environmentalModifications).toBeDefined();
      expect(a.cognitiveConsiderations).toBeDefined();
      expect(a.safetyConsiderations).toBeDefined();
      expect(a.evidenceLevel).toBeDefined();
      expect(a.source).toBeDefined();
      expect(a.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTADLActivities();
    all.forEach((a) => {
      expect([1, 2, 3]).toContain(a.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTADLActivities();
    all.forEach((a) => {
      expect(a.occupationalGoals.length).toBeGreaterThan(0);
      expect(a.adaptiveStrategies.length).toBeGreaterThan(0);
      expect(a.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(a.environmentalModifications.length).toBeGreaterThan(0);
      expect(a.cognitiveConsiderations.length).toBeGreaterThan(0);
      expect(a.safetyConsiderations.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTADLActivities();
    all.forEach((a) => {
      expect(a.lastUpdated instanceof Date).toBe(true);
      expect(a.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
