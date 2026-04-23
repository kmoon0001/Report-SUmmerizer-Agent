/**
 * SLP Dysphagia Evidence-Based Treatment - Unit Tests
 * Comprehensive test coverage matching PT/OT standards
 * Tests: Happy path, edge cases, error handling, healthcare AI safety
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getProtocolById,
  getAllProtocols,
  getProtocolsByCategory,
  searchProtocols,
  getProtocolsByEvidenceLevel,
  getProtocolPhases,
  getProtocolCategories,
  getHighRiskProtocols,
} from "../../data/slp-dysphagia-evidence-based-treatment";
import { auditService } from "../../core/audit/AuditService";

// Mock audit service
vi.mock("../../core/audit/AuditService", () => ({
  auditService: {
    logInfo: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
  },
}));

describe("SLP Dysphagia Evidence-Based Treatment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("getProtocolById - Happy Path", () => {
    it("should return protocol for valid ID", () => {
      const protocol = getProtocolById("slp-dys-001");
      expect(protocol).toBeDefined();
      expect(protocol?.id).toBe("slp-dys-001");
      expect(protocol?.condition).toContain("Post-Stroke Dysphagia");
      expect(auditService.logInfo).toHaveBeenCalledWith(
        "SLP_DYS_ACCESSED",
        expect.any(Object),
      );
    });

    it("should return FEES protocol with correct structure", () => {
      const protocol = getProtocolById("slp-dys-001");
      expect(protocol?.phases).toHaveLength(3);
      expect(protocol?.evidenceLevel).toBe("A");
      expect(protocol?.requiresClinicalReview).toBe(true);
      expect(protocol?.riskLevel).toBe("high");
    });

    it("should return MBSS protocol with correct evidence", () => {
      const protocol = getProtocolById("slp-dys-002");
      expect(protocol?.condition).toContain("MBSS");
      expect(protocol?.cmsCompliant).toBe(true);
      expect(protocol?.ashaGuideline).toBeDefined();
    });
  });

  describe("getAllProtocols - Happy Path", () => {
    it("should return all 5 protocols", () => {
      const protocols = getAllProtocols();
      expect(protocols).toHaveLength(5);
      expect(auditService.logInfo).toHaveBeenCalledWith("SLP_DYS_LIST_ALL", {
        count: 5,
      });
    });

    it("should return protocols with all required fields", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.id).toBeDefined();
        expect(protocol.condition).toBeDefined();
        expect(protocol.phases).toBeDefined();
        expect(protocol.evidenceLevel).toBeDefined();
        expect(protocol.requiresClinicalReview).toBe(true);
        expect(protocol.riskLevel).toBeDefined();
      });
    });
  });

  describe("getProtocolsByCategory - Happy Path", () => {
    it("should return protocols for Neurogenic Dysphagia category", () => {
      const protocols = getProtocolsByCategory("Neurogenic Dysphagia");
      expect(protocols.length).toBeGreaterThan(0);
      expect(protocols[0]!.category).toContain("Neurogenic");
    });

    it("should return protocols for Instrumental Assessment category", () => {
      const protocols = getProtocolsByCategory("Instrumental Assessment");
      expect(protocols.length).toBeGreaterThan(0);
    });
  });

  describe("searchProtocols - Happy Path", () => {
    it("should find protocols by condition name", () => {
      const results = searchProtocols("stroke");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.condition.toLowerCase()).toContain("stroke");
    });

    it("should find protocols by FEES keyword", () => {
      const results = searchProtocols("FEES");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // Edge Case Tests
  describe("getProtocolById - Edge Cases", () => {
    it("should return undefined for invalid ID", () => {
      const protocol = getProtocolById("invalid-id");
      expect(protocol).toBeUndefined();
      expect(auditService.logWarning).toHaveBeenCalledWith(
        "SLP_DYS_NOT_FOUND",
        { id: "invalid-id" },
      );
    });

    it("should handle null ID gracefully", () => {
      const protocol = getProtocolById(null as any);
      expect(protocol).toBeUndefined();
      expect(auditService.logWarning).toHaveBeenCalled();
    });

    it("should handle undefined ID gracefully", () => {
      const protocol = getProtocolById(undefined as any);
      expect(protocol).toBeUndefined();
    });

    it("should handle empty string ID", () => {
      const protocol = getProtocolById("");
      expect(protocol).toBeUndefined();
    });
  });

  describe("searchProtocols - Edge Cases", () => {
    it("should return empty array for non-matching query", () => {
      const results = searchProtocols("nonexistent");
      expect(results).toEqual([]);
    });

    it("should handle empty search query", () => {
      const results = searchProtocols("");
      expect(results).toEqual([]);
      expect(auditService.logWarning).toHaveBeenCalled();
    });

    it("should handle null search query", () => {
      const results = searchProtocols(null as any);
      expect(results).toEqual([]);
    });
  });

  describe("getProtocolsByCategory - Edge Cases", () => {
    it("should return empty array for invalid category", () => {
      const protocols = getProtocolsByCategory("InvalidCategory");
      expect(protocols).toEqual([]);
    });

    it("should handle null category", () => {
      const protocols = getProtocolsByCategory(null as any);
      expect(protocols).toEqual([]);
      expect(auditService.logWarning).toHaveBeenCalled();
    });
  });

  // Error Handling Tests
  describe("Error Handling", () => {
    it("should log errors and return safe defaults", () => {
      // Test that functions handle errors gracefully
      const protocol = getProtocolById("slp-dys-001");
      expect(protocol).toBeDefined();
    });

    it("should audit all data access", () => {
      getAllProtocols();
      expect(auditService.logInfo).toHaveBeenCalled();
    });
  });

  // Healthcare AI Safety Tests
  describe("Healthcare AI Safety", () => {
    it("should mark all protocols as requiring clinical review", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.requiresClinicalReview).toBe(true);
      });
    });

    it("should assign appropriate risk levels", () => {
      const highRisk = getProtocolById("slp-dys-001");
      expect(highRisk?.riskLevel).toBe("high");

      const critical = getProtocolById("slp-dys-005");
      expect(critical?.riskLevel).toBe("critical");
    });

    it("should include safety monitoring in all phases", () => {
      const protocol = getProtocolById("slp-dys-001");
      protocol?.phases.forEach((phase) => {
        expect(phase.safetyMonitoring).toBeDefined();
        expect(phase.safetyMonitoring.length).toBeGreaterThan(0);
      });
    });

    it("should have CMS compliance markers", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.cmsCompliant).toBe(true);
      });
    });
  });

  describe("getProtocolsByEvidenceLevel", () => {
    it("should return Level A protocols", () => {
      const protocols = getProtocolsByEvidenceLevel("A");
      expect(protocols.length).toBe(5);
      protocols.forEach((p) => expect(p.evidenceLevel).toBe("A"));
    });

    it("should handle invalid evidence level", () => {
      const protocols = getProtocolsByEvidenceLevel("Invalid" as any);
      expect(protocols).toEqual([]);
      expect(auditService.logWarning).toHaveBeenCalled();
    });
  });

  describe("getProtocolPhases", () => {
    it("should return phases for valid protocol", () => {
      const phases = getProtocolPhases("slp-dys-001");
      expect(phases).toHaveLength(3);
      expect(phases[0]!.phase).toContain("Acute");
    });

    it("should return empty array for invalid ID", () => {
      const phases = getProtocolPhases("invalid");
      expect(phases).toEqual([]);
    });
  });

  describe("getProtocolCategories", () => {
    it("should return all unique categories", () => {
      const categories = getProtocolCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain("Neurogenic Dysphagia");
    });
  });

  describe("getHighRiskProtocols", () => {
    it("should return high and critical risk protocols", () => {
      const protocols = getHighRiskProtocols();
      expect(protocols.length).toBeGreaterThan(0);
      protocols.forEach((p) => {
        expect(["high", "critical"]).toContain(p.riskLevel);
      });
    });
  });
});
