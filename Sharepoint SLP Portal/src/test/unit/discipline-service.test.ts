import { describe, it, expect, beforeEach } from "vitest";
import { DisciplineService } from "../../services/DisciplineService";

describe("DisciplineService", () => {
  beforeEach(() => {
    // Reset service state
    (DisciplineService as any).initialized = false;
    (DisciplineService as any).disciplineRegistry.clear();
  });

  describe("Initialization", () => {
    it("should initialize on first call", () => {
      DisciplineService.initialize();
      expect((DisciplineService as any).initialized).toBe(true);
    });

    it("should not reinitialize if already initialized", () => {
      DisciplineService.initialize();
      const registrySize = (DisciplineService as any).disciplineRegistry.size;
      DisciplineService.initialize();
      expect((DisciplineService as any).disciplineRegistry.size).toBe(
        registrySize,
      );
    });

    it("should register PT discipline", () => {
      DisciplineService.initialize();
      expect(DisciplineService.isDisciplineRegistered("pt")).toBe(true);
    });

    it("should register OT discipline", () => {
      DisciplineService.initialize();
      expect(DisciplineService.isDisciplineRegistered("ot")).toBe(true);
    });

    it("should register SLP discipline", () => {
      DisciplineService.initialize();
      expect(DisciplineService.isDisciplineRegistered("slp")).toBe(true);
    });
  });

  describe("Discipline Registration", () => {
    it("should register custom discipline", () => {
      const customDiscipline = {
        id: "custom" as any,
        name: "Custom Discipline",
        displayName: "CD",
        description: "Custom discipline for testing",
        icon: "star",
        color: "#ff0000",
        hubs: [],
        complianceRules: [],
        assessmentTools: [],
        interventionLibrary: [],
        cptCodes: [],
      };
      DisciplineService.registerDiscipline(customDiscipline);
      expect(DisciplineService.isDisciplineRegistered("custom" as any)).toBe(
        true,
      );
    });

    it("should overwrite existing discipline", () => {
      DisciplineService.initialize();
      const config = DisciplineService.getDisciplineConfig("pt");
      expect(config?.name).toBe("Physical Therapy");

      const updated = {
        id: "pt" as any,
        name: "Updated PT",
        displayName: "PT",
        description: "Updated description",
        icon: "activity",
        color: "#3b82f6",
        hubs: [],
        complianceRules: [],
        assessmentTools: [],
        interventionLibrary: [],
        cptCodes: [],
      };
      DisciplineService.registerDiscipline(updated);
      const newConfig = DisciplineService.getDisciplineConfig("pt");
      expect(newConfig?.name).toBe("Updated PT");
    });
  });

  describe("Get Discipline Config", () => {
    it("should return PT config", () => {
      const config = DisciplineService.getDisciplineConfig("pt");
      expect(config).toBeDefined();
      expect(config?.id).toBe("pt");
      expect(config?.name).toBe("Physical Therapy");
    });

    it("should return OT config", () => {
      const config = DisciplineService.getDisciplineConfig("ot");
      expect(config).toBeDefined();
      expect(config?.id).toBe("ot");
      expect(config?.name).toBe("Occupational Therapy");
    });

    it("should return SLP config", () => {
      const config = DisciplineService.getDisciplineConfig("slp");
      expect(config).toBeDefined();
      expect(config?.id).toBe("slp");
      expect(config?.name).toBe("Speech-Language Pathology");
    });

    it("should return null for unregistered discipline", () => {
      DisciplineService.initialize();
      const config = DisciplineService.getDisciplineConfig("unknown" as any);
      expect(config).toBeNull();
    });

    it("should auto-initialize if not initialized", () => {
      const config = DisciplineService.getDisciplineConfig("pt");
      expect(config).toBeDefined();
      expect((DisciplineService as any).initialized).toBe(true);
    });
  });

  describe("Get All Disciplines", () => {
    it("should return all disciplines", () => {
      const disciplines = DisciplineService.getAllDisciplines();
      expect(disciplines.length).toBe(3);
    });

    it("should include PT, OT, and SLP", () => {
      const disciplines = DisciplineService.getAllDisciplines();
      const ids = disciplines.map((d) => d.id);
      expect(ids).toContain("pt");
      expect(ids).toContain("ot");
      expect(ids).toContain("slp");
    });

    it("should auto-initialize if not initialized", () => {
      (DisciplineService as any).initialized = false;
      (DisciplineService as any).disciplineRegistry.clear();
      const disciplines = DisciplineService.getAllDisciplines();
      expect(disciplines.length).toBe(3);
      expect((DisciplineService as any).initialized).toBe(true);
    });
  });

  describe("Check Discipline Registration", () => {
    it("should return true for registered PT", () => {
      expect(DisciplineService.isDisciplineRegistered("pt")).toBe(true);
    });

    it("should return true for registered OT", () => {
      expect(DisciplineService.isDisciplineRegistered("ot")).toBe(true);
    });

    it("should return true for registered SLP", () => {
      expect(DisciplineService.isDisciplineRegistered("slp")).toBe(true);
    });

    it("should return false for unregistered discipline", () => {
      DisciplineService.initialize();
      expect(DisciplineService.isDisciplineRegistered("unknown" as any)).toBe(
        false,
      );
    });

    it("should auto-initialize if not initialized", () => {
      (DisciplineService as any).initialized = false;
      (DisciplineService as any).disciplineRegistry.clear();
      const result = DisciplineService.isDisciplineRegistered("pt");
      expect(result).toBe(true);
      expect((DisciplineService as any).initialized).toBe(true);
    });
  });

  describe("Get Hubs", () => {
    it("should return PT hubs", () => {
      const hubs = DisciplineService.getHubs("pt");
      expect(hubs.length).toBeGreaterThan(0);
      expect(hubs[0].discipline).toBe("pt");
    });

    it("should return OT hubs", () => {
      const hubs = DisciplineService.getHubs("ot");
      expect(hubs.length).toBeGreaterThan(0);
      expect(hubs[0].discipline).toBe("ot");
    });

    it("should return SLP hubs", () => {
      const hubs = DisciplineService.getHubs("slp");
      expect(hubs.length).toBeGreaterThan(0);
      expect(hubs[0].discipline).toBe("slp");
    });

    it("should return empty array for unregistered discipline", () => {
      DisciplineService.initialize();
      const hubs = DisciplineService.getHubs("unknown" as any);
      expect(hubs).toEqual([]);
    });

    it("PT should have orthopedic hub", () => {
      const hubs = DisciplineService.getHubs("pt");
      const orthopedic = hubs.find((h) => h.id === "orthopedic-hub");
      expect(orthopedic).toBeDefined();
      expect(orthopedic?.name).toBe("Orthopedic Rehabilitation");
    });

    it("OT should have hand therapy hub", () => {
      const hubs = DisciplineService.getHubs("ot");
      const handTherapy = hubs.find((h) => h.id === "hand-therapy-hub");
      expect(handTherapy).toBeDefined();
      expect(handTherapy?.name).toBe("Hand & Upper Extremity");
    });

    it("SLP should have dysphagia hub", () => {
      const hubs = DisciplineService.getHubs("slp");
      const dysphagia = hubs.find((h) => h.id === "dysphagia");
      expect(dysphagia).toBeDefined();
      expect(dysphagia?.name).toBe("Dysphagia");
    });
  });

  describe("Get Specific Hub", () => {
    it("should return PT orthopedic hub", () => {
      const hub = DisciplineService.getHub("pt", "orthopedic-hub");
      expect(hub).toBeDefined();
      expect(hub?.id).toBe("orthopedic-hub");
      expect(hub?.name).toBe("Orthopedic Rehabilitation");
    });

    it("should return OT hand therapy hub", () => {
      const hub = DisciplineService.getHub("ot", "hand-therapy-hub");
      expect(hub).toBeDefined();
      expect(hub?.id).toBe("hand-therapy-hub");
    });

    it("should return SLP dysphagia hub", () => {
      const hub = DisciplineService.getHub("slp", "dysphagia");
      expect(hub).toBeDefined();
      expect(hub?.id).toBe("dysphagia");
    });

    it("should return null for non-existent hub", () => {
      const hub = DisciplineService.getHub("pt", "non-existent");
      expect(hub).toBeNull();
    });

    it("should return null for hub in unregistered discipline", () => {
      DisciplineService.initialize();
      const hub = DisciplineService.getHub("unknown" as any, "some-hub");
      expect(hub).toBeNull();
    });
  });

  describe("Hub Properties", () => {
    it("PT hubs should have correct properties", () => {
      const hubs = DisciplineService.getHubs("pt");
      hubs.forEach((hub) => {
        expect(hub.id).toBeDefined();
        expect(hub.name).toBeDefined();
        expect(hub.description).toBeDefined();
        expect(hub.icon).toBeDefined();
        expect(hub.discipline).toBe("pt");
        expect(hub.component).toBeDefined();
        expect(hub.order).toBeDefined();
        expect(hub.enabled).toBe(true);
      });
    });

    it("OT hubs should have correct properties", () => {
      const hubs = DisciplineService.getHubs("ot");
      hubs.forEach((hub) => {
        expect(hub.id).toBeDefined();
        expect(hub.name).toBeDefined();
        expect(hub.description).toBeDefined();
        expect(hub.icon).toBeDefined();
        expect(hub.discipline).toBe("ot");
        expect(hub.component).toBeDefined();
        expect(hub.order).toBeDefined();
        expect(hub.enabled).toBe(true);
      });
    });

    it("SLP hubs should have correct properties", () => {
      const hubs = DisciplineService.getHubs("slp");
      hubs.forEach((hub) => {
        expect(hub.id).toBeDefined();
        expect(hub.name).toBeDefined();
        expect(hub.description).toBeDefined();
        expect(hub.icon).toBeDefined();
        expect(hub.discipline).toBe("slp");
        expect(hub.component).toBeDefined();
        expect(hub.order).toBeDefined();
        expect(hub.enabled).toBe(true);
      });
    });
  });

  describe("Discipline Configuration Properties", () => {
    it("PT config should have correct properties", () => {
      const config = DisciplineService.getDisciplineConfig("pt");
      expect(config?.id).toBe("pt");
      expect(config?.name).toBe("Physical Therapy");
      expect(config?.displayName).toBe("PT");
      expect(config?.icon).toBe("activity");
      expect(config?.color).toBe("#3b82f6");
      expect(Array.isArray(config?.hubs)).toBe(true);
    });

    it("OT config should have correct properties", () => {
      const config = DisciplineService.getDisciplineConfig("ot");
      expect(config?.id).toBe("ot");
      expect(config?.name).toBe("Occupational Therapy");
      expect(config?.displayName).toBe("OT");
      expect(config?.icon).toBe("hand");
      expect(config?.color).toBe("#10b981");
    });

    it("SLP config should have correct properties", () => {
      const config = DisciplineService.getDisciplineConfig("slp");
      expect(config?.id).toBe("slp");
      expect(config?.name).toBe("Speech-Language Pathology");
      expect(config?.displayName).toBe("SLP");
      expect(config?.icon).toBe("message-square");
      expect(config?.color).toBe("#8b5cf6");
    });
  });
});
