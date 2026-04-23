/**
 * Security Tests — Input Validation, XSS, PHI Sanitization
 * Reference: TESTING-STRATEGY.md section 9; OWASP Testing Guide
 * Requirements: 9.4, 22.1
 */
import { describe, it, expect } from "vitest";
import { sanitizePrompt, detectPHI } from "../../utils/sanitizer";
import {
  sanitizeInput,
  encryptPHI,
  decryptPHI,
  maskPHI,
  generateMasterKey,
  validateKeyStrength,
  hashPassword,
  verifyPassword,
  generateSecureToken,
} from "../../utils/encryption";

// ── XSS Prevention ────────────────────────────────────────────────────────────
describe("Security: XSS Prevention", () => {
  it("sanitizeInput removes script tags", () => {
    const result = sanitizeInput('<script>alert("XSS")</script>');
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("</script>");
  });

  it("sanitizeInput removes angle brackets", () => {
    const result = sanitizeInput('<img src=x onerror="alert(1)">');
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("sanitizeInput removes quotes", () => {
    const result = sanitizeInput('"; DROP TABLE users; --');
    expect(result).not.toContain('"');
    expect(result).not.toContain("'");
  });

  it("sanitizeInput removes semicolons", () => {
    const result = sanitizeInput("value; malicious()");
    expect(result).not.toContain(";");
  });

  it("sanitizeInput preserves safe clinical text", () => {
    const safe = "Patient ambulates 150 feet with rolling walker";
    expect(sanitizeInput(safe)).toBe(safe);
  });

  it("sanitizeInput trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });
});

// ── PHI Sanitization ──────────────────────────────────────────────────────────
describe("Security: PHI Sanitization (sanitizePrompt)", () => {
  it("removes SSN pattern", () => {
    const result = sanitizePrompt("Patient SSN is 123-45-6789", false);
    expect(result).not.toContain("123-45-6789");
    expect(result).toContain("[SSN_REMOVED]");
  });

  it("removes phone number", () => {
    const result = sanitizePrompt("Call patient at (555) 123-4567", false);
    expect(result).not.toContain("555");
  });

  it("removes email address", () => {
    const result = sanitizePrompt("Email: patient@example.com", false);
    expect(result).not.toContain("@example.com");
    expect(result).toContain("[EMAIL_REMOVED]");
  });

  it("removes street address", () => {
    const result = sanitizePrompt("Lives at 123 Main Street", false);
    expect(result).not.toContain("123 Main Street");
  });

  it("removes IP address", () => {
    const result = sanitizePrompt("Connected from 192.168.1.100", false);
    expect(result).not.toContain("192.168.1.100");
    expect(result).toContain("[IP_REMOVED]");
  });

  it("removes titled names (Mr./Dr.)", () => {
    const result = sanitizePrompt("Patient is Mr. John Smith", false);
    expect(result).not.toContain("Mr. John Smith");
  });

  it("preserves clinical content without PHI", () => {
    const clinical =
      "Patient presents with knee pain, TUG 18s, Berg Balance 38/56";
    const result = sanitizePrompt(clinical, false);
    expect(result).toContain("TUG 18s");
    expect(result).toContain("Berg Balance");
  });
});

// ── PHI Detection ─────────────────────────────────────────────────────────────
describe("Security: PHI Detection (detectPHI)", () => {
  it("detects SSN", () => {
    const result = detectPHI("SSN: 123-45-6789");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("SSN");
  });

  it("detects email", () => {
    const result = detectPHI("Email: test@hospital.org");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("EMAIL");
  });

  it("returns false for clean clinical text", () => {
    const result = detectPHI("Patient ambulates with rolling walker, TUG 14s");
    expect(result.containsPHI).toBe(false);
  });

  it("detects multiple PHI types", () => {
    const result = detectPHI("SSN 123-45-6789, email test@test.com");
    expect(result.detectedTypes.length).toBeGreaterThanOrEqual(2);
  });
});

// ── PHI Masking ───────────────────────────────────────────────────────────────
describe("Security: PHI Masking", () => {
  it("masks SSN", () => {
    const result = maskPHI("SSN: 123-45-6789");
    expect(result).toContain("XXX-XX-XXXX");
    expect(result).not.toContain("123-45-6789");
  });

  it("masks email", () => {
    const result = maskPHI("Email: user@hospital.com");
    expect(result).toContain("[email]");
  });

  it("masks phone number", () => {
    const result = maskPHI("Phone: 555-123-4567");
    expect(result).toContain("XXX-XXX-XXXX");
  });
});

// ── Encryption ────────────────────────────────────────────────────────────────
describe("Security: AES-256 PHI Encryption", () => {
  const masterKey = generateMasterKey();

  it("encrypts PHI — output differs from plaintext", () => {
    const phi = "John Doe, DOB 01/15/1950, MRN 123456";
    const encrypted = encryptPHI(phi, masterKey);
    expect(encrypted).not.toContain("John Doe");
    expect(encrypted).not.toContain("123456");
  });

  it("decrypts back to original plaintext", () => {
    const phi = "Patient name: Jane Smith";
    const encrypted = encryptPHI(phi, masterKey);
    const decrypted = decryptPHI(encrypted, masterKey);
    expect(decrypted).toBe(phi);
  });

  it("different encryptions of same text produce different ciphertext (random IV)", () => {
    const phi = "test patient data";
    const enc1 = encryptPHI(phi, masterKey);
    const enc2 = encryptPHI(phi, masterKey);
    expect(enc1).not.toBe(enc2);
  });

  it("wrong key fails to decrypt", () => {
    const phi = "sensitive data";
    const encrypted = encryptPHI(phi, masterKey);
    const wrongKey = generateMasterKey();
    expect(() => decryptPHI(encrypted, wrongKey)).toThrow();
  });

  it("generateMasterKey produces 64-char hex string", () => {
    const key = generateMasterKey();
    expect(key).toHaveLength(64);
    expect(/^[0-9a-f]+$/i.test(key)).toBe(true);
  });

  it("validateKeyStrength accepts valid key", () => {
    expect(validateKeyStrength(masterKey)).toBe(true);
  });

  it("validateKeyStrength rejects short key", () => {
    expect(validateKeyStrength("tooshort")).toBe(false);
  });
});

// ── Password Security ─────────────────────────────────────────────────────────
describe("Security: Password Hashing", () => {
  it("hashPassword produces hash different from plaintext", () => {
    const { hash } = hashPassword("SecureP@ssw0rd!");
    expect(hash).not.toBe("SecureP@ssw0rd!");
  });

  it("verifyPassword returns true for correct password", () => {
    const { hash, salt } = hashPassword("MyPassword123");
    expect(verifyPassword("MyPassword123", hash, salt)).toBe(true);
  });

  it("verifyPassword returns false for wrong password", () => {
    const { hash, salt } = hashPassword("MyPassword123");
    expect(verifyPassword("WrongPassword", hash, salt)).toBe(false);
  });

  it("same password produces different hashes (random salt)", () => {
    const { hash: h1 } = hashPassword("SamePassword");
    const { hash: h2 } = hashPassword("SamePassword");
    expect(h1).not.toBe(h2);
  });
});

// ── Secure Token Generation ───────────────────────────────────────────────────
describe("Security: Secure Token Generation", () => {
  it("generates token of correct length", () => {
    const token = generateSecureToken(32);
    expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
  });

  it("generates unique tokens", () => {
    const t1 = generateSecureToken();
    const t2 = generateSecureToken();
    expect(t1).not.toBe(t2);
  });
});
