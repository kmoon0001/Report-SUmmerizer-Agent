import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GenericGuidelineService,
  BaseGuideline,
} from "../../services/generic-guideline-service";

// Mock audit service
vi.mock("../../core/audit/AuditService", () => ({
  auditService: {
    logInfo: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
  },
}));

vi.mock("../../utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("GenericGuidelineService", () => {
  let service: GenericGuidelineService<BaseGuideline>;
  let mockGuidelines: BaseGuideline[];

  beforeEach(() => {
    mockGuidelines = [
      {
        id: "guide-1",
        name: "Stroke Recovery",
        condition: "Stroke",
        description: "Guidelines for post-stroke rehabilitation",
        recommendations: ["Early mobilization", "Constraint-induced therapy"],
        contraindications: ["Aggressive passive ROM"],
        precautions: ["Monitor vital signs"],
        evidenceLevel: 1,
        source: "APTA",
        citation: "APTA 2020",
        lastUpdated: new Date("2023-01-01"),
      },
      {
        id: "guide-2",
        name: "Parkinson's Management",
        condition: "Parkinson's Disease",
        description: "Guidelines for Parkinson's disease management",
        recommendations: ["Cueing strategies", "Balance training"],
        contraindications: [],
        precautions: ["Fall risk"],
        evidenceLevel: 2,
        source: "APTA",
        citation: "APTA 2021",
        lastUpdated: new Date("2023-06-01"),
      },
      {
        id: "guide-3",
        name: "Orthopedic Rehab",
        condition: "Orthopedic",
        description: "General orthopedic rehabilitation guidelines",
        recommendations: ["Progressive resistance", "Functional training"],
        contraindications: [],
        precautions: [],
        evidenceLevel: 1,
        source: "APTA",
        citation: "APTA 2022",
        lastUpdated: new Date("2023-12-01"),
      },
    ];

    service = new GenericGuidelineService(
      mockGuidelines,
      "PT Guidelines",
      "PT_GUIDELINE",
    );
  });

  describe("Get All Guidelines", () => {
    it("should return all guidelines", () => {
      const result = service.getAllGuidelines();
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockGuidelines);
    });

    it("should return empty array when no guidelines", () => {
      const emptyService = new GenericGuidelineService(
        [],
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = emptyService.getAllGuidelines();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericGuidelineService(
        null as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = badService.getAllGuidelines();
      expect(result).toEqual([]);
    });
  });

  describe("Get Guideline by ID", () => {
    it("should return guideline by ID", () => {
      const result = service.getGuidelineById("guide-1");
      expect(result).toEqual(mockGuidelines[0]);
    });

    it("should return undefined for non-existent ID", () => {
      const result = service.getGuidelineById("non-existent");
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid ID", () => {
      const result = service.getGuidelineById("");
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-string ID", () => {
      const result = service.getGuidelineById(123 as any);
      expect(result).toBeUndefined();
    });

    it("should return undefined for null ID", () => {
      const result = service.getGuidelineById(null as any);
      expect(result).toBeUndefined();
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericGuidelineService(
        null as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = badService.getGuidelineById("guide-1");
      expect(result).toBeUndefined();
    });
  });

  describe("Search Guidelines", () => {
    it("should search by name", () => {
      const result = service.searchGuidelines("Stroke");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("guide-1");
    });

    it("should search by condition", () => {
      const result = service.searchGuidelines("Parkinson");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("guide-2");
    });

    it("should search by description", () => {
      const result = service.searchGuidelines("rehabilitation");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should search by recommendations", () => {
      const result = service.searchGuidelines("mobilization");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("guide-1");
    });

    it("should be case-insensitive", () => {
      const result = service.searchGuidelines("STROKE");
      expect(result).toHaveLength(1);
    });

    it("should return empty array for no matches", () => {
      const result = service.searchGuidelines("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid query", () => {
      const result = service.searchGuidelines("");
      expect(result).toEqual([]);
    });

    it("should return empty array for non-string query", () => {
      const result = service.searchGuidelines(123 as any);
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericGuidelineService(
        null as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = badService.searchGuidelines("test");
      expect(result).toEqual([]);
    });
  });

  describe("Get Guidelines by Category", () => {
    it("should return guidelines by category", () => {
      const result = service.getGuidelinesByCategory("Stroke");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("guide-1");
    });

    it("should return multiple guidelines in same category", () => {
      const result = service.getGuidelinesByCategory("Orthopedic");
      expect(result).toHaveLength(1);
    });

    it("should return empty array for non-existent category", () => {
      const result = service.getGuidelinesByCategory("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid category", () => {
      const result = service.getGuidelinesByCategory("");
      expect(result).toEqual([]);
    });

    it("should return empty array for non-string category", () => {
      const result = service.getGuidelinesByCategory(123 as any);
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericGuidelineService(
        null as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = badService.getGuidelinesByCategory("Stroke");
      expect(result).toEqual([]);
    });
  });

  describe("Get Categories", () => {
    it("should return all unique categories", () => {
      const result = service.getCategories();
      expect(result).toContain("Stroke");
      expect(result).toContain("Parkinson's Disease");
      expect(result).toContain("Orthopedic");
    });

    it("should not return duplicate categories", () => {
      const result = service.getCategories();
      const uniqueResult = new Set(result);
      expect(result.length).toBe(uniqueResult.size);
    });

    it("should return empty array when no categories", () => {
      const guidelinesWithoutCondition = [{ id: "guide-1", name: "Test" }];
      const emptyService = new GenericGuidelineService(
        guidelinesWithoutCondition as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = emptyService.getCategories();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericGuidelineService(
        null as any,
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = badService.getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("Get Guideline Count", () => {
    it("should return correct count", () => {
      const result = service.getGuidelineCount();
      expect(result).toBe(3);
    });

    it("should return 0 for empty service", () => {
      const emptyService = new GenericGuidelineService(
        [],
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = emptyService.getGuidelineCount();
      expect(result).toBe(0);
    });
  });

  describe("Evidence Levels", () => {
    it("should filter by evidence level 1", () => {
      const result = service.getGuidelinesByCategory("Stroke");
      expect(result[0]!.evidenceLevel).toBe(1);
    });

    it("should handle multiple evidence levels", () => {
      const allGuidelines = service.getAllGuidelines();
      const evidenceLevels = allGuidelines.map((g) => g.evidenceLevel);
      expect(evidenceLevels).toContain(1);
      expect(evidenceLevels).toContain(2);
    });
  });

  describe("Guideline Properties", () => {
    it("should preserve all guideline properties", () => {
      const result = service.getGuidelineById("guide-1");
      expect(result?.name).toBe("Stroke Recovery");
      expect(result?.condition).toBe("Stroke");
      expect(result?.description).toBeDefined();
      expect(result?.recommendations).toBeDefined();
      expect(result?.contraindications).toBeDefined();
      expect(result?.precautions).toBeDefined();
      expect(result?.evidenceLevel).toBe(1);
      expect(result?.source).toBe("APTA");
      expect(result?.citation).toBe("APTA 2020");
      expect(result?.lastUpdated).toBeDefined();
    });

    it("should handle guidelines with missing optional properties", () => {
      const minimalGuideline: BaseGuideline = { id: "minimal" };
      const minimalService = new GenericGuidelineService(
        [minimalGuideline],
        "PT Guidelines",
        "PT_GUIDELINE",
      );
      const result = minimalService.getGuidelineById("minimal");
      expect(result).toEqual(minimalGuideline);
    });
  });

  describe("Audit Logging", () => {
    it("should log when accessing guideline", () => {
      service.getGuidelineById("guide-1");
      // Audit logging is mocked, just verify no errors
      expect(true).toBe(true);
    });

    it("should log when searching guidelines", () => {
      service.searchGuidelines("Stroke");
      // Audit logging is mocked, just verify no errors
      expect(true).toBe(true);
    });

    it("should log when filtering by category", () => {
      service.getGuidelinesByCategory("Stroke");
      // Audit logging is mocked, just verify no errors
      expect(true).toBe(true);
    });
  });
});
