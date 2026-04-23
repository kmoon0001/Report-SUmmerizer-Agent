/**
 * SLP Aphasia Treatment Protocols - Unit Tests
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
  getIntensiveTreatmentProtocols,
} from "../../data/slp-aphasia-treatment-protocols";

vi.mock("../../core/audit/AuditService", () => ({
  auditService: {
    logInfo: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
  },
}));

describe("SLP Aphasia Treatment Protocols", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProtocolById - Happy Path", () => {
    it("should return CILT protocol", () => {
      const protocol = getProtocolById("slp-aph-001");
      expect(protocol).toBeDefined();
      expect(protocol?.condition).toContain("CILT");
      expect(protocol?.evidenceLevel).toBe("A");
    });

    it("should return SFA protocol", () => {
      const protocol = getProtocolById("slp-aph-002");
      expect(protocol?.condition).toContain("SFA");
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
    it("should filter by category", () => {
      const protocols = getProtocolsByCategory("Intensive Aphasia Treatment");
      expect(protocols.length).toBeGreaterThan(0);
    });
  });

  describe("searchProtocols", () => {
    it("should find MIT protocol", () => {
      const results = searchProtocols("MIT");
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
  });

  describe("Healthcare AI Safety", () => {
    it("should mark all as requiring review", () => {
      const protocols = getAllProtocols();
      protocols.forEach((p) => expect(p.requiresClinicalReview).toBe(true));
    });

    it("should have low risk levels", () => {
      const protocols = getAllProtocols();
      protocols.forEach((p) => expect(p.riskLevel).toBe("low"));
    });
  });

  describe("getProtocolsByEvidenceLevel", () => {
    it("should filter by evidence level A", () => {
      const protocols = getProtocolsByEvidenceLevel("A");
      expect(protocols).toHaveLength(5);
    });
  });

  describe("getProtocolPhases", () => {
    it("should return phases", () => {
      const phases = getProtocolPhases("slp-aph-001");
      expect(phases.length).toBeGreaterThan(0);
    });
  });

  describe("getProtocolCategories", () => {
    it("should return categories", () => {
      const categories = getProtocolCategories();
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("getIntensiveTreatmentProtocols", () => {
    it("should return intensive protocols", () => {
      const protocols = getIntensiveTreatmentProtocols();
      expect(protocols.length).toBeGreaterThan(0);
    });
  });
});
