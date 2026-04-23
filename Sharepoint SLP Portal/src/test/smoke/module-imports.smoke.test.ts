import { describe, it, expect } from "vitest";

describe("Smoke: critical modules load", () => {
  it("loads sanitizer exports", async () => {
    const m = await import("../../utils/sanitizer");
    expect(typeof m.sanitizeText).toBe("function");
    expect(typeof m.detectPHI).toBe("function");
    expect(typeof m.hasPHI).toBe("function");
  });

  it("loads reliability helpers", async () => {
    const m = await import("../../utils/reliability");
    expect(typeof m.withTimeout).toBe("function");
    expect(typeof m.CircuitBreaker).toBe("function");
  });

  it("loads audit service", async () => {
    const m = await import("../../services/audit-service");
    expect(typeof m.auditService.logInteraction).toBe("function");
    expect(typeof m.auditService.getAuditLog).toBe("function");
  });

  it("loads encryption helpers", async () => {
    const m = await import("../../utils/encryption");
    expect(typeof m.sanitizeInput).toBe("function");
    expect(typeof m.maskPHI).toBe("function");
  });
});
