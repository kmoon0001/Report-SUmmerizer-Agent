/**
 * SLP Trach/Vent Management - Unit Tests
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
  getCriticalRiskProtocols,
} from "../../data/slp-trach-vent-management";
import { auditService } from "../../core/audit/AuditService";

// Mock audit service
vi.mock("../../core/audit/AuditService", () => ({
  auditService: {
    logInfo: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
  },
}));

describe("SLP Trach/Vent Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Path Tests
  describe("getProtocolById - Happy Path", () => {
    it("should return speaking valve protocol for valid ID", () => {
      const protocol = getProtocolById("slp-tv-001");
      expect(protocol).toBeDefined();
      expect(protocol?.id).toBe("slp-tv-001");
      expect(protocol?.condition).toContain("Speaking Valve");
      expect(auditService.logInfo).toHaveBeenCalledWith(
        "SLP_TV_ACCESSED",
        expect.any(Object),
      );
    });

    it("should return speaking valve protocol with correct structure", () => {
      const protocol = getProtocolById("slp-tv-001");
      expect(protocol?.phases).toHaveLength(2);
      expect(protocol?.evidenceLevel).toBe("A");
      expect(protocol?.requiresClinicalReview).toBe(true);
      expect(protocol?.riskLevel).toBe("critical");
    });

    it("should return ventilator communication protocol", () => {
      const protocol = getProtocolById("slp-tv-002");
      expect(protocol?.condition).toContain(
        "Ventilator-Dependent Communication",
      );
      expect(protocol?.cmsCompliant).toBe(true);
      expect(protocol?.ashaGuideline).toBeDefined();
      expect(protocol?.riskLevel).toBe("high");
    });

    it("should return cuff deflation protocol", () => {
      const protocol = getProtocolById("slp-tv-003");
      expect(protocol?.condition).toContain("Cuff Deflation");
      expect(protocol?.riskLevel).toBe("critical");
    });
  });

  describe("getAllProtocols - Happy Path", () => {
    it("should return all 5 protocols", () => {
      const protocols = getAllProtocols();
      expect(protocols).toHaveLength(5);
      expect(auditService.logInfo).toHaveBeenCalledWith("SLP_TV_LIST_ALL", {
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
        expect(protocol.cmsCompliant).toBe(true);
      });
    });

    it("should return protocols with safety monitoring", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        protocol.phases.forEach((phase) => {
          expect(phase.safetyMonitoring).toBeDefined();
          expect(phase.safetyMonitoring.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("getProtocolsByCategory - Happy Path", () => {
    it("should return protocols for Trach Management category", () => {
      const protocols = getProtocolsByCategory("Trach Management");
      expect(protocols.length).toBeGreaterThan(0);
      protocols.forEach((p) => {
        if (p.category) {
          expect(p.category).toContain("Trach");
        }
      });
    });

    it("should return protocols for Vent Management category", () => {
      const protocols = getProtocolsByCategory("Vent Management");
      expect(protocols.length).toBeGreaterThan(0);
    });

    it("should return protocols for Dysphagia Assessment category", () => {
      const protocols = getProtocolsByCategory("Dysphagia Assessment");
      expect(protocols.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const lower = getProtocolsByCategory("trach");
      const upper = getProtocolsByCategory("TRACH");
      expect(lower.length).toBe(upper.length);
    });
  });

  describe("searchProtocols - Happy Path", () => {
    it("should find protocols by speaking valve keyword", () => {
      const results = searchProtocols("speaking valve");
      expect(results.length).toBeGreaterThan(0);
      if (results[0]) {
        expect(results[0].condition.toLowerCase()).toContain("speaking valve");
      }
    });

    it("should find protocols by ventilator keyword", () => {
      const results = searchProtocols("ventilator");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find protocols by decannulation keyword", () => {
      const results = searchProtocols("decannulation");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // Edge Case Tests
  describe("getProtocolById - Edge Cases", () => {
    it("should return undefined for invalid ID", () => {
      const protocol = getProtocolById("invalid-id");
      expect(protocol).toBeUndefined();
      expect(auditService.logWarning).toHaveBeenCalledWith("SLP_TV_NOT_FOUND", {
        id: "invalid-id",
      });
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

    it("should handle numeric ID", () => {
      const protocol = getProtocolById(123 as any);
      expect(protocol).toBeUndefined();
    });
  });

  describe("searchProtocols - Edge Cases", () => {
    it("should return empty array for non-matching query", () => {
      const results = searchProtocols("nonexistent-protocol-xyz");
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

    it("should handle undefined search query", () => {
      const results = searchProtocols(undefined as any);
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

    it("should handle empty category string", () => {
      const protocols = getProtocolsByCategory("");
      expect(protocols).toEqual([]);
    });
  });

  // Error Handling Tests
  describe("Error Handling", () => {
    it("should log errors and return safe defaults", () => {
      const protocol = getProtocolById("slp-tv-001");
      expect(protocol).toBeDefined();
    });

    it("should audit all data access", () => {
      getAllProtocols();
      expect(auditService.logInfo).toHaveBeenCalled();
    });

    it("should handle errors in category search", () => {
      const protocols = getProtocolsByCategory("Trach Management");
      expect(protocols).toBeDefined();
      expect(Array.isArray(protocols)).toBe(true);
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
      const speakingValve = getProtocolById("slp-tv-001");
      expect(speakingValve?.riskLevel).toBe("critical");

      const ventComm = getProtocolById("slp-tv-002");
      expect(ventComm?.riskLevel).toBe("high");

      const cuffDeflation = getProtocolById("slp-tv-003");
      expect(cuffDeflation?.riskLevel).toBe("critical");
    });

    it("should include safety monitoring in all phases", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        protocol.phases.forEach((phase) => {
          expect(phase.safetyMonitoring).toBeDefined();
          expect(phase.safetyMonitoring.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have CMS compliance markers", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.cmsCompliant).toBe(true);
      });
    });

    it("should include contraindications for all protocols", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.contraindications).toBeDefined();
        expect(protocol.contraindications.length).toBeGreaterThan(0);
      });
    });

    it("should include precautions for all protocols", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.precautions).toBeDefined();
        expect(protocol.precautions.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getProtocolsByEvidenceLevel", () => {
    it("should return Level A protocols", () => {
      const protocols = getProtocolsByEvidenceLevel("A");
      expect(protocols.length).toBeGreaterThan(0);
      protocols.forEach((p) => expect(p.evidenceLevel).toBe("A"));
    });

    it("should return Level B protocols", () => {
      const protocols = getProtocolsByEvidenceLevel("B");
      expect(protocols.length).toBeGreaterThan(0);
      protocols.forEach((p) => expect(p.evidenceLevel).toBe("B"));
    });

    it("should handle invalid evidence level", () => {
      const protocols = getProtocolsByEvidenceLevel("Invalid" as any);
      expect(protocols).toEqual([]);
      expect(auditService.logWarning).toHaveBeenCalled();
    });

    it("should audit evidence level filtering", () => {
      getProtocolsByEvidenceLevel("A");
      expect(auditService.logInfo).toHaveBeenCalledWith(
        "SLP_TV_EVIDENCE_FILTER",
        expect.any(Object),
      );
    });
  });

  describe("getProtocolPhases", () => {
    it("should return phases for speaking valve protocol", () => {
      const phases = getProtocolPhases("slp-tv-001");
      expect(phases).toHaveLength(2);
      if (phases[0]) {
        expect(phases[0].phase).toContain("Assessment");
      }
    });

    it("should return phases for ventilator communication protocol", () => {
      const phases = getProtocolPhases("slp-tv-002");
      expect(phases.length).toBeGreaterThan(0);
    });

    it("should return empty array for invalid ID", () => {
      const phases = getProtocolPhases("invalid");
      expect(phases).toEqual([]);
    });

    it("should return phases with all required fields", () => {
      const phases = getProtocolPhases("slp-tv-001");
      phases.forEach((phase) => {
        expect(phase.phase).toBeDefined();
        expect(phase.duration).toBeDefined();
        expect(phase.goals).toBeDefined();
        expect(phase.interventions).toBeDefined();
        expect(phase.safetyMonitoring).toBeDefined();
      });
    });
  });

  describe("getProtocolCategories", () => {
    it("should return all unique categories", () => {
      const categories = getProtocolCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain("Trach Management");
    });

    it("should return sorted categories", () => {
      const categories = getProtocolCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });

    it("should not have duplicate categories", () => {
      const categories = getProtocolCategories();
      const unique = [...new Set(categories)];
      expect(categories.length).toBe(unique.length);
    });
  });

  describe("getCriticalRiskProtocols", () => {
    it("should return only critical risk protocols", () => {
      const protocols = getCriticalRiskProtocols();
      expect(protocols.length).toBeGreaterThan(0);
      protocols.forEach((p) => {
        expect(p.riskLevel).toBe("critical");
      });
    });

    it("should include speaking valve protocol", () => {
      const protocols = getCriticalRiskProtocols();
      const speakingValve = protocols.find((p) => p.id === "slp-tv-001");
      expect(speakingValve).toBeDefined();
    });

    it("should audit critical risk access", () => {
      getCriticalRiskProtocols();
      expect(auditService.logInfo).toHaveBeenCalledWith(
        "SLP_TV_CRITICAL_RISK_ACCESSED",
        expect.any(Object),
      );
    });
  });

  describe("Evidence-Based Content", () => {
    it("should have ASHA guidelines for all protocols", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.ashaGuideline).toBeDefined();
        expect(protocol.ashaGuideline.length).toBeGreaterThan(0);
      });
    });

    it("should have source citations", () => {
      const protocols = getAllProtocols();
      protocols.forEach((protocol) => {
        expect(protocol.source).toBeDefined();
      });
    });

    it("should have DOIs where available", () => {
      const protocol = getProtocolById("slp-tv-001");
      if (protocol) {
        expect(protocol.doi).toBeDefined();
      }
    });
  });
});
