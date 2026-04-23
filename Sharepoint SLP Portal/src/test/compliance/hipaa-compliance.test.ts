/**
 * Compliance Tests — HIPAA Security Rule & Medicare Documentation
 * Reference: TESTING-STRATEGY.md section 11
 * Sources: HIPAA Security Rule 45 CFR §164; CMS Medicare Benefit Policy Manual Ch. 15
 * Requirements: 9.1, 9.2, 9.3, 10.1, 10.2, 10.3, 10.4, 8.1, 8.2
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  encryptPHI,
  decryptPHI,
  generateMasterKey,
  ENCRYPTION_CONFIG,
} from "../../utils/encryption";
import { sanitizePrompt, detectPHI } from "../../utils/sanitizer";
import { auditService } from "../../services/audit-service";
import { validateMedicareCompliance } from "../../utils/medicare-compliance-validator";

// ── HIPAA: PHI Encryption at Rest (45 CFR §164.312(a)(2)(ii)) ────────────────
describe("HIPAA Compliance: PHI Encryption at Rest", () => {
  const masterKey = generateMasterKey();

  it("uses AES-256 algorithm", () => {
    expect(ENCRYPTION_CONFIG.algorithm).toBe("aes-256-gcm");
  });

  it("uses 256-bit key length", () => {
    expect(ENCRYPTION_CONFIG.keyLength).toBe(32); // 32 bytes = 256 bits
  });

  it("uses GCM mode (authenticated encryption)", () => {
    expect(ENCRYPTION_CONFIG.algorithm).toContain("gcm");
  });

  it("encrypts PHI — ciphertext does not contain plaintext", () => {
    const phi = "Patient: John Doe, SSN: 123-45-6789, DOB: 01/15/1950";
    const encrypted = encryptPHI(phi, masterKey);
    expect(encrypted).not.toContain("John Doe");
    expect(encrypted).not.toContain("123-45-6789");
  });

  it("decrypts PHI correctly (data integrity)", () => {
    const phi = "MRN: 987654, Diagnosis: M54.5 Low back pain";
    const encrypted = encryptPHI(phi, masterKey);
    expect(decryptPHI(encrypted, masterKey)).toBe(phi);
  });

  it("uses PBKDF2 with ≥100,000 iterations (NIST SP 800-132)", () => {
    expect(ENCRYPTION_CONFIG.iterations).toBeGreaterThanOrEqual(100000);
  });

  it("uses random IV per encryption (prevents pattern analysis)", () => {
    const phi = "test data";
    const enc1 = encryptPHI(phi, masterKey);
    const enc2 = encryptPHI(phi, masterKey);
    expect(enc1).not.toBe(enc2);
  });
});

// ── HIPAA: PHI Transmission Security (45 CFR §164.312(e)(2)(ii)) ─────────────
describe("HIPAA Compliance: PHI Sanitization Before Transmission", () => {
  it("sanitizes SSN before AI transmission", () => {
    const result = sanitizePrompt("Patient SSN: 123-45-6789", false);
    expect(result).not.toContain("123-45-6789");
  });

  it("sanitizes phone number before AI transmission", () => {
    const result = sanitizePrompt("Phone: 555-867-5309", false);
    expect(result).not.toContain("867-5309");
  });

  it("sanitizes email before AI transmission", () => {
    const result = sanitizePrompt("Email: patient@clinic.com", false);
    expect(result).not.toContain("@clinic.com");
  });

  it("sanitizes IP address before AI transmission", () => {
    const result = sanitizePrompt("IP: 10.0.0.1", false);
    expect(result).not.toContain("10.0.0.1");
  });

  it("detectPHI correctly identifies PHI presence", () => {
    expect(detectPHI("SSN 123-45-6789").containsPHI).toBe(true);
    expect(detectPHI("TUG 14s, Berg 42/56").containsPHI).toBe(false);
  });
});

// ── HIPAA: Audit Controls (45 CFR §164.312(b)) ───────────────────────────────
describe("HIPAA Compliance: Audit Logging", () => {
  beforeEach(() => {
    auditService.clearAuditLog();
  });

  it("logs PHI access events with required fields", () => {
    auditService.logPHIAccess({
      action: "VIEW_PATIENT_RECORD",
      patientId: "PT-001",
      dataType: "clinical",
      accessReason: "Treatment — initial evaluation",
      phiAccessed: true,
      userId: "clinician-123",
      module: "DocumentationStudio",
    });
    const log = auditService.getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0].phiAccessed).toBe(true);
    expect((log[0] as any).patientId).toBe("PT-001");
  });

  it("logs clinical decisions with evidence sources", () => {
    auditService.logClinicalDecision({
      action: "GENERATE_SMART_GOAL",
      decisionType: "goal-setting",
      clinicalReasoning: "Patient presents with TUG 18s, indicating fall risk",
      evidenceSources: ["APTA CPG 2021", "CDC STEADI"],
      aiAssisted: true,
      module: "GoalGenerator",
    });
    const log = auditService.getAuditLog();
    expect(log).toHaveLength(1);
    expect((log[0] as any).evidenceSources).toContain("APTA CPG 2021");
  });

  it("timestamps all audit entries", () => {
    auditService.logInteraction({ action: "TEST_ACTION" });
    const log = auditService.getAuditLog();
    expect(log[0].timestamp).toBeDefined();
    expect(new Date(log[0].timestamp).getTime()).toBeGreaterThan(0);
  });

  it("exports audit trail with correct structure", () => {
    auditService.logInteraction({ action: "ACTION_1", module: "TestModule" });
    auditService.logInteraction({ action: "ACTION_2", module: "TestModule" });
    const start = new Date(Date.now() - 1000);
    const end = new Date(Date.now() + 1000);
    const report = auditService.exportAuditTrail(start, end);
    expect(report.totalEntries).toBe(2);
    expect(report.entries).toHaveLength(2);
    expect(report.generatedAt).toBeDefined();
  });

  it("exports audit trail as CSV with headers", () => {
    auditService.logInteraction({ action: "CSV_TEST", module: "Test" });
    const start = new Date(Date.now() - 1000);
    const end = new Date(Date.now() + 1000);
    const csv = auditService.exportAuditTrailAsCSV(start, end);
    expect(csv).toContain("Timestamp");
    expect(csv).toContain("Action");
    expect(csv).toContain("CSV_TEST");
  });

  it("tracks PHI access count separately", () => {
    auditService.logPHIAccess({
      action: "VIEW",
      patientId: "PT-001",
      dataType: "clinical",
      accessReason: "Treatment",
      phiAccessed: true,
    });
    auditService.logInteraction({ action: "NON_PHI_ACTION" });
    const start = new Date(Date.now() - 1000);
    const end = new Date(Date.now() + 1000);
    const report = auditService.exportAuditTrail(start, end);
    expect(report.phiAccessCount).toBe(1);
    expect(report.totalEntries).toBe(2);
  });

  it("getStatistics returns correct counts", () => {
    auditService.logInteraction({ action: "A1" });
    auditService.logInteraction({ action: "A2" });
    const stats = auditService.getStatistics();
    expect(stats.totalEntries).toBe(2);
  });
});

// ── Medicare Documentation Compliance ────────────────────────────────────────
describe("Medicare Compliance: Documentation Requirements (CMS Ch. 15)", () => {
  it("flags missing skilled need justification", () => {
    const note = "Patient performed exercises. Tolerated well.";
    const flags = validateMedicareCompliance(note);
    expect(Array.isArray(flags)).toBe(true);
    expect(flags.some((f) => /skilled/i.test(f.message))).toBe(true);
  });

  it('flags vague language "tolerated well"', () => {
    const note = "Patient tolerated well. Continue exercises.";
    const flags = validateMedicareCompliance(note);
    expect(flags.some((f) => /vague|tolerated/i.test(f.message))).toBe(true);
  });

  it('flags vague language "as tolerated"', () => {
    const note = "Patient performed exercises as tolerated.";
    const flags = validateMedicareCompliance(note);
    expect(flags.some((f) => /vague|as tolerated/i.test(f.message))).toBe(true);
  });

  it("passes compliant note — no critical flags", () => {
    const note = [
      "Skilled PT required for gait training and balance retraining.",
      "Patient demonstrates fall risk with TUG 18s (high risk >12s).",
      "Objective: Berg Balance Scale 38/56 (high fall risk <45).",
      "Patient ambulated 50 feet with rolling walker, requiring moderate assist for safety.",
      "Plan: Progress to 100 feet ambulation with minimal assist within 2 weeks.",
    ].join(" ");
    const flags = validateMedicareCompliance(note);
    const criticalFlags = flags.filter((f) => f.severity === "critical");
    expect(criticalFlags).toHaveLength(0);
  });

  it("compliance check returns flags array", () => {
    const flags = validateMedicareCompliance("Short note.");
    expect(Array.isArray(flags)).toBe(true);
  });
});
