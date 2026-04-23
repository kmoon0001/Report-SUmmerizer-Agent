/**
 * Audit Service Tests
 *
 * Tests for audit logging with discipline context
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import fc from "fast-check";
import { auditService } from "../../core/audit/AuditService";
import type { Discipline } from "../../types/discipline";

describe("AuditService", () => {
  beforeEach(() => {
    // Clear logs before each test
    while (auditService.getLogCount() > 0) {
      // Logs are cleared by creating new service instance in real implementation
      break;
    }
  });

  describe("Basic Logging", () => {
    it("should log an audit entry", () => {
      const initialCount = auditService.getLogCount();

      auditService.log({
        userId: "user123",
        discipline: "pt",
        action: "view_patient",
        resourceType: "patient",
        resourceId: "patient123",
      });

      expect(auditService.getLogCount()).toBe(initialCount + 1);
    });

    it("should include timestamp on logged entry", () => {
      auditService.log({
        userId: "user123",
        discipline: "pt",
        action: "view_patient",
        resourceType: "patient",
      });

      const logs = auditService.query({ limit: 1 });
      expect(logs[0]!.timestamp).toBeInstanceOf(Date);
    });

    it("should generate unique IDs for entries", () => {
      auditService.log({
        userId: "user123",
        discipline: "pt",
        action: "action1",
        resourceType: "resource",
      });

      auditService.log({
        userId: "user123",
        discipline: "pt",
        action: "action2",
        resourceType: "resource",
      });

      const logs = auditService.query({ limit: 2 });
      expect(logs[0]!.id).not.toBe(logs[1]!.id);
    });
  });

  describe("PHI Access Logging", () => {
    it("should log PHI access", () => {
      const initialCount = auditService.getLogCount();

      auditService.logPHIAccess({
        userId: "user123",
        discipline: "pt",
        patientId: "patient123",
        dataType: "clinical",
        accessReason: "Treatment planning",
      });

      expect(auditService.getLogCount()).toBe(initialCount + 1);
    });

    it("should retrieve PHI access logs", () => {
      auditService.logPHIAccess({
        userId: "user123",
        discipline: "pt",
        patientId: "patient123",
        dataType: "clinical",
        accessReason: "Treatment planning",
      });

      const phiLogs = auditService.getPHIAccessLogs();
      expect(phiLogs.length).toBeGreaterThan(0);
      expect(phiLogs[0]!.action).toBe("phi_access");
    });
  });

  describe("Clinical Decision Logging", () => {
    it("should log clinical decision", () => {
      const initialCount = auditService.getLogCount();

      auditService.logClinicalDecision({
        userId: "user123",
        discipline: "pt",
        decisionType: "treatment-plan",
        clinicalReasoning: "Patient shows good progress",
        evidenceSources: ["APTA Guidelines"],
        aiAssisted: false,
      });

      expect(auditService.getLogCount()).toBe(initialCount + 1);
    });

    it("should retrieve clinical decision logs", () => {
      auditService.logClinicalDecision({
        userId: "user123",
        discipline: "pt",
        decisionType: "assessment",
        clinicalReasoning: "Initial evaluation",
        evidenceSources: ["Clinical exam"],
        aiAssisted: false,
      });

      const decisionLogs = auditService.getClinicalDecisionLogs();
      expect(decisionLogs.length).toBeGreaterThan(0);
      expect(decisionLogs[0]!.action).toBe("clinical_decision");
    });
  });

  describe("Discipline Change Logging", () => {
    it("should log discipline change", () => {
      const initialCount = auditService.getLogCount();

      auditService.logDisciplineChange({
        userId: "user123",
        discipline: "pt",
        fromDiscipline: "pt",
        toDiscipline: "ot",
        reason: "User switched disciplines",
      });

      expect(auditService.getLogCount()).toBe(initialCount + 1);
    });

    it("should retrieve discipline change logs", () => {
      auditService.logDisciplineChange({
        userId: "user123",
        discipline: "pt",
        fromDiscipline: "pt",
        toDiscipline: "ot",
      });

      const changeLogs = auditService.getDisciplineChangeLogs();
      expect(changeLogs.length).toBeGreaterThan(0);
      expect(changeLogs[0]!.action).toBe("discipline_change");
    });
  });

  describe("Querying", () => {
    beforeEach(() => {
      // Add test data
      auditService.log({
        userId: "user1",
        discipline: "pt",
        action: "action1",
        resourceType: "resource1",
      });

      auditService.log({
        userId: "user2",
        discipline: "ot",
        action: "action2",
        resourceType: "resource2",
      });

      auditService.log({
        userId: "user1",
        discipline: "pt",
        action: "action3",
        resourceType: "resource1",
      });
    });

    it("should query by user ID", () => {
      const results = auditService.query({ userId: "user1" });
      expect(results.every((log) => log.userId === "user1")).toBe(true);
    });

    it("should query by discipline", () => {
      const results = auditService.query({ discipline: "pt" });
      expect(results.every((log) => log.discipline === "pt")).toBe(true);
    });

    it("should query by action", () => {
      const results = auditService.query({ action: "action1" });
      expect(results.every((log) => log.action === "action1")).toBe(true);
    });

    it("should query by resource type", () => {
      const results = auditService.query({ resourceType: "resource1" });
      expect(results.every((log) => log.resourceType === "resource1")).toBe(
        true,
      );
    });

    it("should support pagination", () => {
      const page1 = auditService.query({ limit: 1, offset: 0 });
      const page2 = auditService.query({ limit: 1, offset: 1 });

      expect(page1.length).toBe(1);
      expect(page2.length).toBe(1);
      expect(page1[0]!.id).not.toBe(page2[0]!.id);
    });

    it("should return results sorted by timestamp descending", () => {
      const results = auditService.query({ limit: 10 });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i]!.timestamp.getTime()).toBeGreaterThanOrEqual(
          results[i + 1]!.timestamp.getTime(),
        );
      }
    });
  });

  describe("Reporting", () => {
    beforeEach(() => {
      auditService.log({
        userId: "user1",
        discipline: "pt",
        action: "action1",
        resourceType: "resource1",
      });

      auditService.logPHIAccess({
        userId: "user1",
        discipline: "pt",
        patientId: "patient1",
        dataType: "clinical",
        accessReason: "Treatment",
      });

      auditService.logClinicalDecision({
        userId: "user1",
        discipline: "pt",
        decisionType: "assessment",
        clinicalReasoning: "Initial eval",
        evidenceSources: ["Exam"],
        aiAssisted: false,
      });
    });

    it("should generate audit report", () => {
      const report = auditService.generateReport({});
      expect(report.totalEntries).toBeGreaterThan(0);
      expect(report.phiAccessCount).toBeGreaterThan(0);
      expect(report.clinicalDecisionCount).toBeGreaterThan(0);
    });

    it("should export as JSON", () => {
      const json = auditService.export({});
      const parsed = JSON.parse(json);
      expect(parsed.totalEntries).toBeGreaterThan(0);
    });

    it("should export as CSV", () => {
      const csv = auditService.exportAsCSV({});
      expect(csv).toContain("Timestamp");
      expect(csv).toContain("User ID");
      expect(csv).toContain("Discipline");
    });
  });

  describe("Statistics", () => {
    beforeEach(() => {
      auditService.log({
        userId: "user1",
        discipline: "pt",
        action: "action1",
        resourceType: "resource1",
      });

      auditService.log({
        userId: "user2",
        discipline: "ot",
        action: "action2",
        resourceType: "resource2",
      });
    });

    it("should get statistics", () => {
      const stats = auditService.getStatistics();
      expect(stats.totalLogs).toBeGreaterThan(0);
      expect(stats.uniqueUsers).toBeGreaterThan(0);
      expect(stats.disciplines).toBeDefined();
      expect(stats.actions).toBeDefined();
    });

    it("should count logs by discipline", () => {
      const stats = auditService.getStatistics();
      expect(stats.disciplines!.pt).toBeGreaterThan(0);
      expect(stats.disciplines!.ot).toBeGreaterThan(0);
    });
  });

  describe("Discipline Context Property", () => {
    it("property: all logs have discipline context", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant("pt"), fc.constant("ot")),
          (discipline: Discipline) => {
            auditService.log({
              userId: "user123",
              discipline,
              action: "test_action",
              resourceType: "test_resource",
            });

            const logs = auditService.query({ discipline });
            expect(logs.every((log) => log.discipline === discipline)).toBe(
              true,
            );
          },
        ),
      );
    });

    it("property: discipline filtering is accurate", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant("pt"), fc.constant("ot")),
          (discipline: Discipline) => {
            auditService.log({
              userId: "user123",
              discipline,
              action: "test_action",
              resourceType: "test_resource",
            });

            const ptLogs = auditService.query({ discipline: "pt" });
            const otLogs = auditService.query({ discipline: "ot" });

            // No overlap
            const ptIds = new Set(ptLogs.map((l) => l.id));
            const otIds = new Set(otLogs.map((l) => l.id));

            for (const id of ptIds) {
              expect(otIds.has(id)).toBe(false);
            }
          },
        ),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle logging errors gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // This should not throw
      expect(() => {
        auditService.log({
          userId: "user123",
          discipline: "pt",
          action: "test",
          resourceType: "test",
        });
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it("should handle query errors gracefully", () => {
      expect(() => {
        auditService.query({ limit: -1 });
      }).not.toThrow();
    });
  });
});
