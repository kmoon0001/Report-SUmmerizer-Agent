/**
 * SLP Motor Speech Disorders Treatment - Unit Tests
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
  getLowRiskProtocols,
} from "../../data/slp-motor-speech-disorders-treatment";

vi.mock("../../core/audit/AuditService", () => ({
  auditService: {
    logInfo: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
  },
}));

describe("SLP Motor Speech Disorders Treatment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProtocolById - Happy Path", () => {
    it("should return DTTC protocol", () => {
      const protocol = getProtocolById("slp-msd-001");
      expect(protocol).toBeDefined();
      expect(protocol?.condition).toContain("DTTC");
      expect(protocol?.evidenceLevel).toBe("A");
    });

    it("should return LSVT LOUD protocol", () => {
      const protocol = getProtocolById("slp-msd-002");
      expect(protocol?.condition).toContain("LSVT LOUD");
      expect(protocol?.riskLevel).toBe("medium");
    });
  });

  describe("getAllProtocols", () => {
    it("should return all 5 protocols", () => {
      const protocols = getAllProtocols();
      expect(protocols).toHaveLength(5);
    });

    it("should have clinical review flags", () => {
      const protocols = getAllProtocols();
      protocols.forEach((p) => expect(p.requiresClinicalReview).toBe(true));
    });
  });

  describe("getProtocolsByCategory", () => {
    it("should filter by Apraxia category", () => {
      const protocols = getProtocolsByCategory("Apraxia");
      expect(protocols.length).toBeGreaterThan(0);
    });

    it("should filter by Dysarthria category", () => {
      const protocols = getProtocolsByCategory("Dysarthria");
      expect(protocols.length).toBeGreaterThan(0);
    });
  });

  describe("searchProtocols", () => {
    it("should find LSVT protocol", () => {
      const results = searchProtocols("LSVT");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid ID", () => {
      const protocol = getProtocolById("invalid");
      expect(protocol).toBeUndefined();
    });

    it("should handle null ID", () => {
      const protocol = getProtocolById(null as any);
      expect(protocol).toBeUndefined();
    });

    it("should handle empty search", () => {
      const results = searchProtocols("");
      expect(results).toEqual([]);
    });
  });

  describe("Healthcare AI Safety", () => {
    it("should mark all as requiring review", () => {
      const protocols = getAllProtocols();
      protocols.forEach((p) => expect(p.requiresClinicalReview).toBe(true));
    });

    it("should have appropriate risk levels", () => {
      const protocols = getAllProtocols();
      protocols.forEach((p) => {
        expect(["low", "medium", "high", "critical"]).toContain(p.riskLevel);
      });
    });
  });

  describe("getProtocolsByEvidenceLevel", () => {
    it("should filter by evidence level A", () => {
      const protocols = getProtocolsByEvidenceLevel("A");
      expect(protocols.length).toBeGreaterThan(0);
    });
  });

  describe("getProtocolPhases", () => {
    it("should return phases for valid protocol", () => {
      const phases = getProtocolPhases("slp-msd-001");
      expect(phases.length).toBeGreaterThan(0);
    });
  });

  describe("getProtocolCategories", () => {
    it("should return unique categories", () => {
      const categories = getProtocolCategories();
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("getLowRiskProtocols", () => {
    it("should return low risk protocols", () => {
      const protocols = getLowRiskProtocols();
      protocols.forEach((p) => expect(p.riskLevel).toBe("low"));
    });
  });
});
