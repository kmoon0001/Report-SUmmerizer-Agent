import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GenericProtocolService,
  BaseProtocol,
} from "../../services/generic-protocol-service";

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

describe("GenericProtocolService", () => {
  let service: GenericProtocolService<BaseProtocol>;
  let mockProtocols: BaseProtocol[];

  beforeEach(() => {
    mockProtocols = [
      {
        id: "proto-1",
        condition: "Stroke",
        category: "Neurological",
        description: "Acute stroke protocol",
        evidenceLevel: "A",
        riskLevel: "high",
        lastUpdated: new Date("2023-01-01"),
        requiresClinicalReview: true,
      },
      {
        id: "proto-2",
        condition: "ACL Tear",
        category: "Orthopedic",
        description: "ACL reconstruction protocol",
        evidenceLevel: "B",
        riskLevel: "medium",
        lastUpdated: new Date("2023-06-01"),
        requiresClinicalReview: false,
      },
      {
        id: "proto-3",
        condition: "Fall Risk",
        category: "Geriatric",
        description: "Fall prevention protocol",
        evidenceLevel: "A",
        riskLevel: "critical",
        lastUpdated: new Date("2023-12-01"),
        requiresClinicalReview: true,
      },
    ];

    service = new GenericProtocolService(
      mockProtocols,
      "PT Protocols",
      "PT_PROTOCOL",
    );
  });

  describe("Get Protocol by ID", () => {
    it("should return protocol by ID", () => {
      const result = service.getProtocolById("proto-1");
      expect(result).toEqual(mockProtocols[0]);
    });

    it("should return undefined for non-existent ID", () => {
      const result = service.getProtocolById("non-existent");
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid ID", () => {
      const result = service.getProtocolById("");
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-string ID", () => {
      const result = service.getProtocolById(123 as any);
      expect(result).toBeUndefined();
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolById("proto-1");
      expect(result).toBeUndefined();
    });
  });

  describe("Get All Protocols", () => {
    it("should return all protocols", () => {
      const result = service.getAllProtocols();
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockProtocols);
    });

    it("should return empty array when no protocols", () => {
      const emptyService = new GenericProtocolService(
        [],
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = emptyService.getAllProtocols();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getAllProtocols();
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocols by Category", () => {
    it("should return protocols by category", () => {
      const result = service.getProtocolsByCategory("Neurological");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-1");
    });

    it("should return multiple protocols in same category", () => {
      const result = service.getProtocolsByCategory("Orthopedic");
      expect(result).toHaveLength(1);
    });

    it("should return empty array for non-existent category", () => {
      const result = service.getProtocolsByCategory("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid category", () => {
      const result = service.getProtocolsByCategory("");
      expect(result).toEqual([]);
    });

    it("should return empty array for non-string category", () => {
      const result = service.getProtocolsByCategory(123 as any);
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolsByCategory("Neurological");
      expect(result).toEqual([]);
    });
  });

  describe("Search Protocols", () => {
    it("should search by condition", () => {
      const result = service.searchProtocols("Stroke");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-1");
    });

    it("should search by description", () => {
      const result = service.searchProtocols("reconstruction");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-2");
    });

    it("should search by category", () => {
      const result = service.searchProtocols("Geriatric");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-3");
    });

    it("should be case-insensitive", () => {
      const result = service.searchProtocols("STROKE");
      expect(result).toHaveLength(1);
    });

    it("should return empty array for no matches", () => {
      const result = service.searchProtocols("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid query", () => {
      const result = service.searchProtocols("");
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.searchProtocols("test");
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocols by Evidence Level", () => {
    it("should return protocols with evidence level A", () => {
      const result = service.getProtocolsByEvidenceLevel("A");
      expect(result).toHaveLength(2);
    });

    it("should return protocols with evidence level B", () => {
      const result = service.getProtocolsByEvidenceLevel("B");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-2");
    });

    it("should return empty array for non-existent evidence level", () => {
      const result = service.getProtocolsByEvidenceLevel("D");
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid evidence level", () => {
      const result = service.getProtocolsByEvidenceLevel("X" as any);
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolsByEvidenceLevel("A");
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocols by Risk Level", () => {
    it("should return protocols with high risk", () => {
      const result = service.getProtocolsByRiskLevel("high");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-1");
    });

    it("should return protocols with critical risk", () => {
      const result = service.getProtocolsByRiskLevel("critical");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-3");
    });

    it("should return protocols with medium risk", () => {
      const result = service.getProtocolsByRiskLevel("medium");
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("proto-2");
    });

    it("should return empty array for non-existent risk level", () => {
      const result = service.getProtocolsByRiskLevel("low");
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolsByRiskLevel("high");
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocol Categories", () => {
    it("should return all unique categories", () => {
      const result = service.getProtocolCategories();
      expect(result).toContain("Neurological");
      expect(result).toContain("Orthopedic");
      expect(result).toContain("Geriatric");
    });

    it("should not return duplicate categories", () => {
      const result = service.getProtocolCategories();
      const uniqueResult = new Set(result);
      expect(result.length).toBe(uniqueResult.size);
    });

    it("should return empty array when no categories", () => {
      const protocolsWithoutCategory = [{ id: "proto-1", condition: "Test" }];
      const emptyService = new GenericProtocolService(
        protocolsWithoutCategory as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = emptyService.getProtocolCategories();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolCategories();
      expect(result).toEqual([]);
    });
  });

  describe("Get Evidence Levels", () => {
    it("should return all unique evidence levels", () => {
      const result = service.getEvidenceLevels();
      expect(result).toContain("A");
      expect(result).toContain("B");
    });

    it("should not return duplicate evidence levels", () => {
      const result = service.getEvidenceLevels();
      const uniqueResult = new Set(result);
      expect(result.length).toBe(uniqueResult.size);
    });

    it("should return empty array when no evidence levels", () => {
      const protocolsWithoutEvidence = [{ id: "proto-1", condition: "Test" }];
      const emptyService = new GenericProtocolService(
        protocolsWithoutEvidence as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = emptyService.getEvidenceLevels();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getEvidenceLevels();
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocols Requiring Review", () => {
    it("should return protocols requiring clinical review", () => {
      const result = service.getProtocolsRequiringReview();
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toContain("proto-1");
      expect(result.map((p) => p.id)).toContain("proto-3");
    });

    it("should return empty array when no protocols require review", () => {
      const protocolsNoReview = [
        { id: "proto-1", requiresClinicalReview: false },
      ];
      const noReviewService = new GenericProtocolService(
        protocolsNoReview as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = noReviewService.getProtocolsRequiringReview();
      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", () => {
      const badService = new GenericProtocolService(
        null as any,
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = badService.getProtocolsRequiringReview();
      expect(result).toEqual([]);
    });
  });

  describe("Get Protocol Count", () => {
    it("should return correct count", () => {
      const result = service.getProtocolCount();
      expect(result).toBe(3);
    });

    it("should return 0 for empty service", () => {
      const emptyService = new GenericProtocolService(
        [],
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = emptyService.getProtocolCount();
      expect(result).toBe(0);
    });
  });

  describe("Protocol Properties", () => {
    it("should preserve all protocol properties", () => {
      const result = service.getProtocolById("proto-1");
      expect(result?.condition).toBe("Stroke");
      expect(result?.category).toBe("Neurological");
      expect(result?.description).toBeDefined();
      expect(result?.evidenceLevel).toBe("A");
      expect(result?.riskLevel).toBe("high");
      expect(result?.requiresClinicalReview).toBe(true);
      expect(result?.lastUpdated).toBeDefined();
    });

    it("should handle protocols with missing optional properties", () => {
      const minimalProtocol: BaseProtocol = { id: "minimal" };
      const minimalService = new GenericProtocolService(
        [minimalProtocol],
        "PT Protocols",
        "PT_PROTOCOL",
      );
      const result = minimalService.getProtocolById("minimal");
      expect(result).toEqual(minimalProtocol);
    });
  });

  describe("Risk Level Filtering", () => {
    it("should correctly identify high-risk protocols", () => {
      const result = service.getProtocolsByRiskLevel("high");
      expect(result.every((p) => p.riskLevel === "high")).toBe(true);
    });

    it("should correctly identify critical-risk protocols", () => {
      const result = service.getProtocolsByRiskLevel("critical");
      expect(result.every((p) => p.riskLevel === "critical")).toBe(true);
    });
  });
});
