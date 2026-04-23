import { describe, it, expect } from "vitest";
import { sanitizePrompt, detectPHI } from "../../utils/sanitizer";

describe("Adversarial PHI Safety Verification", () => {
  describe("Name Obfuscation", () => {
    it("should detect standard names", () => {
      const input = "Patient named John Smith was admitted";
      const sanitized = sanitizePrompt(input);
      // Standard names should be detected
      expect(sanitized).toContain("[PATIENT_NAME_REMOVED]");
    });

    it("should handle names in clinical context", () => {
      const input = "Patient: John Smith, age 45";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).toContain("[NAME_REMOVED]");
    });
  });

  describe("SSN & ID Obfuscation", () => {
    it("should detect standard SSN format", () => {
      const input = "SSN is 123-45-6789";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).toContain("[SSN_REMOVED]");
    });

    it("should handle SSN without dashes", () => {
      const input = "SSN: 123456789";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).toContain("[SSN_REMOVED]");
    });
  });

  describe("Data Minimization & Context Leakage", () => {
    it("should remove patient names from clinical descriptions", () => {
      const input = "The patient John Smith has shown improvement in gait.";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).not.toContain("John Smith");
      expect(sanitized).toContain("[NAME_REMOVED]");
    });

    it("should handle possessive names", () => {
      const input = "John Smith's ROM is 90 degrees.";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).not.toContain("John Smith");
      expect(sanitized).toContain("[NAME_REMOVED]");
    });
  });

  describe("Homoglyph Attacks", () => {
    it("should detect names using look-alike characters (Cyrillic/Greek)", () => {
      // Cyrillic 'а' instead of Latin 'a'
      const input = "Patient: Jаne Smith";
      const sanitized = sanitizePrompt(input);
      expect(sanitized).not.toContain("Jаne");
    });
  });
});
