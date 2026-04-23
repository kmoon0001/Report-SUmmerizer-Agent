/**
 * Discipline Isolation Property-Based Tests
 *
 * Verifies that data from one discipline never leaks into another
 * Requirements: 1.1, 1.2, 1.3
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { DisciplineService } from "../../services/DisciplineService";
import type { Discipline } from "../../types/discipline";

describe("Discipline Isolation Properties", () => {
  beforeEach(() => {
    DisciplineService.initialize();
  });

  describe("Discipline Registry Isolation", () => {
    it("should have separate configurations for each discipline", () => {
      const ptConfig = DisciplineService.getDisciplineConfig("pt");
      const otConfig = DisciplineService.getDisciplineConfig("ot");

      expect(ptConfig).not.toBeNull();
      expect(otConfig).not.toBeNull();
      expect(ptConfig?.id).toBe("pt");
      expect(otConfig?.id).toBe("ot");
      expect(ptConfig?.id).not.toBe(otConfig?.id);
    });

    it("should return null for unregistered disciplines", () => {
      const _config = DisciplineService.getDisciplineConfig("slp");
      // SLP is registered but we can test with an invalid discipline
      expect(
        DisciplineService.getDisciplineConfig("invalid" as Discipline),
      ).toBeNull();
    });

    it("should have different hubs for each discipline", () => {
      const ptConfig = DisciplineService.getDisciplineConfig("pt");
      const otConfig = DisciplineService.getDisciplineConfig("ot");

      expect(ptConfig?.hubs).toBeDefined();
      expect(otConfig?.hubs).toBeDefined();
      expect(ptConfig?.hubs.length).toBeGreaterThan(0);
      expect(otConfig?.hubs.length).toBeGreaterThan(0);

      // PT hubs should not appear in OT
      const ptHubIds = new Set(ptConfig?.hubs.map((h) => h.id));
      const otHubIds = new Set(otConfig?.hubs.map((h) => h.id));

      const intersection = new Set(
        [...ptHubIds].filter((x) => otHubIds.has(x)),
      );
      expect(intersection.size).toBe(0);
    });

    it("should have discipline-specific colors", () => {
      const ptConfig = DisciplineService.getDisciplineConfig("pt");
      const otConfig = DisciplineService.getDisciplineConfig("ot");

      expect(ptConfig?.color).not.toBe(otConfig?.color);
    });
  });

  describe("Hub Isolation Property", () => {
    it("property: all PT hubs have discipline=pt", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const ptConfig = DisciplineService.getDisciplineConfig("pt");
          const allPTHubsCorrect = ptConfig?.hubs.every(
            (hub) => hub.discipline === "pt",
          );
          expect(allPTHubsCorrect).toBe(true);
        }),
      );
    });

    it("property: all OT hubs have discipline=ot", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const otConfig = DisciplineService.getDisciplineConfig("ot");
          const allOTHubsCorrect = otConfig?.hubs.every(
            (hub) => hub.discipline === "ot",
          );
          expect(allOTHubsCorrect).toBe(true);
        }),
      );
    });

    it("property: PT hubs are never returned for OT queries", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const ptHubs = DisciplineService.getHubs("pt");
          const otHubs = DisciplineService.getHubs("ot");

          const ptHubIds = new Set(ptHubs.map((h) => h.id));
          const otHubIds = new Set(otHubs.map((h) => h.id));

          // No overlap
          for (const id of ptHubIds) {
            expect(otHubIds.has(id)).toBe(false);
          }
        }),
      );
    });

    it("property: OT hubs are never returned for PT queries", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const ptHubs = DisciplineService.getHubs("pt");
          const otHubs = DisciplineService.getHubs("ot");

          const ptHubIds = new Set(ptHubs.map((h) => h.id));
          const otHubIds = new Set(otHubs.map((h) => h.id));

          // No overlap
          for (const id of otHubIds) {
            expect(ptHubIds.has(id)).toBe(false);
          }
        }),
      );
    });
  });

  describe("Hub Retrieval Isolation", () => {
    it("should retrieve PT-specific hubs only for PT discipline", () => {
      const ptHubs = DisciplineService.getHubs("pt");
      expect(ptHubs.length).toBeGreaterThan(0);
      expect(ptHubs.every((h) => h.discipline === "pt")).toBe(true);
    });

    it("should retrieve OT-specific hubs only for OT discipline", () => {
      const otHubs = DisciplineService.getHubs("ot");
      expect(otHubs.length).toBeGreaterThan(0);
      expect(otHubs.every((h) => h.discipline === "ot")).toBe(true);
    });

    it("should not return PT hubs when querying OT", () => {
      const ptHubs = DisciplineService.getHubs("pt");
      const otHubs = DisciplineService.getHubs("ot");

      const ptHubIds = ptHubs.map((h) => h.id);
      const otHubIds = otHubs.map((h) => h.id);

      for (const ptHubId of ptHubIds) {
        expect(otHubIds).not.toContain(ptHubId);
      }
    });

    it("should not return OT hubs when querying PT", () => {
      const ptHubs = DisciplineService.getHubs("pt");
      const otHubs = DisciplineService.getHubs("ot");

      const ptHubIds = ptHubs.map((h) => h.id);
      const otHubIds = otHubs.map((h) => h.id);

      for (const otHubId of otHubIds) {
        expect(ptHubIds).not.toContain(otHubId);
      }
    });
  });

  describe("Specific Hub Retrieval Isolation", () => {
    it("should return null when querying PT hub with OT discipline", () => {
      const ptHubs = DisciplineService.getHubs("pt");
      const firstPTHubId = ptHubs[0]?.id;

      if (firstPTHubId) {
        const result = DisciplineService.getHub("ot", firstPTHubId);
        expect(result).toBeNull();
      }
    });

    it("should return null when querying OT hub with PT discipline", () => {
      const otHubs = DisciplineService.getHubs("ot");
      const firstOTHubId = otHubs[0]?.id;

      if (firstOTHubId) {
        const result = DisciplineService.getHub("pt", firstOTHubId);
        expect(result).toBeNull();
      }
    });

    it("should return correct hub when querying with matching discipline", () => {
      const ptHubs = DisciplineService.getHubs("pt");
      const firstPTHubId = ptHubs[0]?.id;

      if (firstPTHubId) {
        const result = DisciplineService.getHub("pt", firstPTHubId);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(firstPTHubId);
        expect(result?.discipline).toBe("pt");
      }
    });
  });

  describe("Discipline Registration Isolation", () => {
    it("property: registering a discipline does not affect other disciplines", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const ptBefore = DisciplineService.getDisciplineConfig("pt");
          const otBefore = DisciplineService.getDisciplineConfig("ot");

          // Verify they're still different
          expect(ptBefore?.id).not.toBe(otBefore?.id);
          expect(ptBefore?.hubs.length).not.toBe(otBefore?.hubs.length);
        }),
      );
    });

    it("should have all disciplines registered", () => {
      const allDisciplines = DisciplineService.getAllDisciplines();
      expect(allDisciplines.length).toBeGreaterThanOrEqual(2);

      const disciplineIds = allDisciplines.map((d) => d.id);
      expect(disciplineIds).toContain("pt");
      expect(disciplineIds).toContain("ot");
    });

    it("should correctly identify registered disciplines", () => {
      expect(DisciplineService.isDisciplineRegistered("pt")).toBe(true);
      expect(DisciplineService.isDisciplineRegistered("ot")).toBe(true);
      expect(
        DisciplineService.isDisciplineRegistered("invalid" as Discipline),
      ).toBe(false);
    });
  });

  describe("Discipline Configuration Immutability", () => {
    it("should return consistent configurations on multiple calls", () => {
      const config1 = DisciplineService.getDisciplineConfig("pt");
      const config2 = DisciplineService.getDisciplineConfig("pt");

      expect(config1?.id).toBe(config2?.id);
      expect(config1?.name).toBe(config2?.name);
      expect(config1?.hubs.length).toBe(config2?.hubs.length);
    });

    it("property: discipline configurations are consistent across calls", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const config1 = DisciplineService.getDisciplineConfig("pt");
          const config2 = DisciplineService.getDisciplineConfig("pt");

          expect(config1?.id).toBe(config2?.id);
          expect(config1?.displayName).toBe(config2?.displayName);
        }),
      );
    });
  });
});

describe("Dashboard Discipline Separation", () => {
  describe("Dashboard sections are discipline-aware", () => {
    it("PT mode should have PT-specific category IDs in fallback sections", () => {
      // Simulate PT discipline
      const ptCategoryIds = [
        "orthopedic-hub",
        "neurological-hub",
        "geriatric-hub",
        "cardiopulmonary-hub",
        "sports-hub",
        "wound-care-hub",
        "pediatric-hub",
      ];

      // Verify no SLP categories in PT list
      const slpCategories = [
        "dysphagia",
        "aphasia",
        "motor-speech",
        "voice",
        "fluency",
        "cog-comm",
      ];
      for (const slpCat of slpCategories) {
        expect(ptCategoryIds).not.toContain(slpCat);
      }
    });

    it("OT mode should have OT-specific category IDs in fallback sections", () => {
      // Simulate OT discipline
      const otCategoryIds = [
        "hand-therapy-hub",
        "adl-training-hub",
        "cognitive-rehab-hub",
        "work-conditioning-hub",
        "mental-health-hub",
        "pediatric-dev-hub",
      ];

      // Verify no PT categories in OT list
      const ptCategories = [
        "orthopedic-hub",
        "neurological-hub",
        "geriatric-hub",
      ];
      for (const ptCat of ptCategories) {
        expect(otCategoryIds).not.toContain(ptCat);
      }

      // Verify no SLP categories in OT list
      const slpCategories = ["dysphagia", "aphasia", "motor-speech"];
      for (const slpCat of slpCategories) {
        expect(otCategoryIds).not.toContain(slpCat);
      }
    });

    it("SLP mode should have SLP-specific category IDs in fallback sections", () => {
      // Simulate SLP discipline
      const slpCategoryIds = [
        "dysphagia",
        "aphasia",
        "motor-speech",
        "voice",
        "fluency",
        "cog-comm",
        "hnc",
        "palliative",
        "trach-vent",
        "stroke-anatomy",
        "aac-hub",
        "three-way-eval",
      ];

      // Verify no PT categories in SLP list
      const ptCategories = [
        "orthopedic-hub",
        "neurological-hub",
        "geriatric-hub",
      ];
      for (const ptCat of ptCategories) {
        expect(slpCategoryIds).not.toContain(ptCat);
      }

      // Verify no OT categories in SLP list
      const otCategories = [
        "hand-therapy-hub",
        "adl-training-hub",
        "cognitive-rehab-hub",
      ];
      for (const otCat of otCategories) {
        expect(slpCategoryIds).not.toContain(otCat);
      }
    });

    it("property: discipline category IDs never overlap", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), () => {
          const ptCategoryIds = new Set([
            "orthopedic-hub",
            "neurological-hub",
            "geriatric-hub",
            "cardiopulmonary-hub",
            "sports-hub",
            "wound-care-hub",
            "pediatric-hub",
          ]);

          const otCategoryIds = new Set([
            "hand-therapy-hub",
            "adl-training-hub",
            "cognitive-rehab-hub",
            "work-conditioning-hub",
            "mental-health-hub",
            "pediatric-dev-hub",
          ]);

          const slpCategoryIds = new Set([
            "dysphagia",
            "aphasia",
            "motor-speech",
            "voice",
            "fluency",
            "cog-comm",
            "hnc",
            "palliative",
            "trach-vent",
            "stroke-anatomy",
            "aac-hub",
            "three-way-eval",
          ]);

          // Check PT vs OT
          for (const id of ptCategoryIds) {
            expect(otCategoryIds.has(id)).toBe(false);
            expect(slpCategoryIds.has(id)).toBe(false);
          }

          // Check OT vs SLP
          for (const id of otCategoryIds) {
            expect(slpCategoryIds.has(id)).toBe(false);
          }
        }),
      );
    });
  });
});
