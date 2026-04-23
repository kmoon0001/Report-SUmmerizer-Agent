/**
 * OT Community Mobility & Stair Navigation Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTCommunityMobilityStrategyById,
  getAllOTCommunityMobilityStrategies,
  getOTCommunityMobilityStrategiesByCategory,
  searchOTCommunityMobilityStrategies,
  getOTCommunityMobilityStrategiesByEvidenceLevel,
  getMobilityEquipmentList,
  validateCommunityMobilityStrategy,
} from "../../data/ot-community-mobility-stair-navigation-data";

describe("OT Community Mobility & Stair Navigation Data", () => {
  it("should have 5 community mobility strategies", () => {
    expect(getAllOTCommunityMobilityStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTCommunityMobilityStrategyById("ot-cm-001");
    expect(strategy?.name).toContain("Stair");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTCommunityMobilityStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTCommunityMobilityStrategiesByCategory("Stair");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTCommunityMobilityStrategies("Mobility");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTCommunityMobilityStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return mobility equipment list", () => {
    const equipment = getMobilityEquipmentList();
    expect(Array.isArray(equipment)).toBe(true);
    expect(equipment.length).toBeGreaterThan(0);
  });

  it("should validate community mobility strategy", () => {
    const result = validateCommunityMobilityStrategy(
      "ot-cm-001",
      "Community access",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid application", () => {
    const result = validateCommunityMobilityStrategy(
      "ot-cm-001",
      "Invalid application",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTCommunityMobilityStrategies();
    all.forEach((s) => {
      expect(getOTCommunityMobilityStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTCommunityMobilityStrategyById(null as any);
      getAllOTCommunityMobilityStrategies();
      getOTCommunityMobilityStrategiesByCategory("test");
      searchOTCommunityMobilityStrategies("test");
      getOTCommunityMobilityStrategiesByEvidenceLevel(1);
      getMobilityEquipmentList();
      validateCommunityMobilityStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTCommunityMobilityStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.occupationalApplications).toBeDefined();
      expect(s.mobilityTechniques).toBeDefined();
      expect(s.adaptiveEquipment).toBeDefined();
      expect(s.environmentalConsiderations).toBeDefined();
      expect(s.safetyStrategies).toBeDefined();
      expect(s.progressionStages).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTCommunityMobilityStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTCommunityMobilityStrategies();
    all.forEach((s) => {
      expect(s.occupationalApplications.length).toBeGreaterThan(0);
      expect(s.mobilityTechniques.length).toBeGreaterThan(0);
      expect(s.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(s.environmentalConsiderations.length).toBeGreaterThan(0);
      expect(s.safetyStrategies.length).toBeGreaterThan(0);
      expect(s.progressionStages.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTCommunityMobilityStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
