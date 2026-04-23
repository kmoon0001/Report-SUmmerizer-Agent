import { describe, it, expect, beforeEach } from "vitest";
import { auditService } from "../../services/audit-service";

describe("Compliance: in-memory audit trail", () => {
  beforeEach(() => {
    auditService.clearAuditLog();
  });

  it("records PHI access events", () => {
    auditService.logPHIAccess({
      action: "VIEW",
      patientId: "PT-99",
      dataType: "clinical",
      accessReason: "Treatment",
      phiAccessed: true,
      userId: "u1",
    });
    const log = auditService.getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0].phiAccessed).toBe(true);
    expect(log[0].patientId).toBe("PT-99");
  });

  it("exports CSV with header row", () => {
    auditService.logInteraction({ action: "SMOKE", module: "Test" });
    const csv = auditService.exportAuditTrailAsCSV(
      new Date(Date.now() - 60_000),
      new Date(Date.now() + 60_000),
    );
    expect(csv.split("\n")[0]).toContain("Timestamp");
    expect(csv).toContain("SMOKE");
  });

  it("reports statistics", () => {
    auditService.logInteraction({ action: "A" });
    auditService.logInteraction({ action: "B" });
    expect(auditService.getStatistics().totalEntries).toBeGreaterThanOrEqual(2);
  });
});
