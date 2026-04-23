import { describe, it, expect } from "vitest";
import {
  sanitizePrompt,
  sanitizeChatContent,
  detectPHI,
  hasPHI,
  sanitizeText,
} from "../../utils/sanitizer";

describe("Sanitizer Utility", () => {
  describe("sanitizePrompt", () => {
    it("should sanitize basic prompt", () => {
      const result = sanitizePrompt("What is the patient status?");
      expect(typeof result).toBe("string");
    });

    it("should remove PHI from prompt", () => {
      const result = sanitizePrompt("Patient John Doe with SSN 123-45-6789");
      expect(result).not.toContain("123-45-6789");
    });

    it("should handle empty prompt", () => {
      const result = sanitizePrompt("");
      expect(result).toBe("");
    });

    it("should accept logAccess parameter", () => {
      const result = sanitizePrompt("test prompt", true);
      expect(typeof result).toBe("string");
    });

    it("should handle long prompts", () => {
      const longPrompt = "a".repeat(1000);
      const result = sanitizePrompt(longPrompt);
      expect(typeof result).toBe("string");
    });

    it("should preserve clinical terms", () => {
      const result = sanitizePrompt("Patient has hypertension and diabetes");
      expect(result).toContain("hypertension");
      expect(result).toContain("diabetes");
    });

    it("should handle special characters", () => {
      const result = sanitizePrompt("Test with !@#$%^&*()");
      expect(typeof result).toBe("string");
    });

    it("should handle multiple spaces", () => {
      const result = sanitizePrompt("test    with    spaces");
      expect(typeof result).toBe("string");
    });
  });

  describe("sanitizeChatContent", () => {
    it("should sanitize chat message", () => {
      const result = sanitizeChatContent("Hello, how are you?");
      expect(typeof result).toBe("string");
    });

    it("should remove email addresses", () => {
      const result = sanitizeChatContent("Contact me at test@example.com");
      expect(result).not.toContain("test@example.com");
    });

    it("should remove phone numbers", () => {
      const result = sanitizeChatContent("Call me at 555-123-4567");
      expect(result).not.toContain("555-123-4567");
    });

    it("should handle empty content", () => {
      const result = sanitizeChatContent("");
      expect(result).toBe("");
    });

    it("should accept logAccess parameter", () => {
      const result = sanitizeChatContent("test content", true);
      expect(typeof result).toBe("string");
    });

    it("should preserve message intent", () => {
      const result = sanitizeChatContent("Patient needs PT evaluation");
      expect(result).toContain("Patient");
      expect(result).toContain("PT");
    });

    it("should handle multiline content", () => {
      const result = sanitizeChatContent("Line 1\nLine 2\nLine 3");
      expect(typeof result).toBe("string");
    });

    it("should handle URLs", () => {
      const result = sanitizeChatContent("Visit https://example.com for info");
      expect(typeof result).toBe("string");
    });
  });

  describe("detectPHI", () => {
    it("should detect SSN", () => {
      const result = detectPHI("SSN: 123-45-6789");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("SSN");
    });

    it("should detect email", () => {
      const result = detectPHI("Email: john@example.com");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("EMAIL");
    });

    it("should detect phone number", () => {
      const result = detectPHI("Phone: 555-123-4567");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("PHONE");
    });

    it("should detect credit card", () => {
      const result = detectPHI("Card: 4532-1234-5678-9010");
      expect(result.containsPHI).toBe(true);
    });

    it("should not detect PHI in clean text", () => {
      const result = detectPHI("Patient has hypertension");
      expect(result.containsPHI).toBe(false);
    });

    it("should return PHIDetectionResult structure", () => {
      const result = detectPHI("test");
      expect(result).toHaveProperty("containsPHI");
      expect(result).toHaveProperty("detectedTypes");
    });

    it("should handle empty string", () => {
      const result = detectPHI("");
      expect(result.containsPHI).toBe(false);
      expect(result.detectedTypes).toEqual([]);
    });

    it("should detect multiple PHI types", () => {
      const result = detectPHI("John Doe, SSN 123-45-6789, john@example.com");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes.length).toBeGreaterThan(0);
    });

    it("should handle case insensitivity", () => {
      const result1 = detectPHI("EMAIL: test@example.com");
      const result2 = detectPHI("email: test@example.com");
      expect(result1.containsPHI).toBe(result2.containsPHI);
    });

    it("should detect date of birth patterns", () => {
      const result = detectPHI("DOB: 01/15/1990");
      expect(result.containsPHI).toBe(true);
    });

    it("should detect medical record numbers", () => {
      const result = detectPHI("MRN: 123456789");
      expect(result.containsPHI).toBe(true);
    });
  });

  describe("hasPHI", () => {
    it("should return true for SSN", () => {
      const result = hasPHI("123-45-6789");
      expect(result).toBe(true);
    });

    it("should return true for email", () => {
      const result = hasPHI("test@example.com");
      expect(result).toBe(true);
    });

    it("should return true for phone", () => {
      const result = hasPHI("555-123-4567");
      expect(result).toBe(true);
    });

    it("should return false for clean text", () => {
      const result = hasPHI("Patient assessment completed");
      expect(result).toBe(false);
    });

    it("should return false for empty string", () => {
      const result = hasPHI("");
      expect(result).toBe(false);
    });

    it("should handle clinical data", () => {
      const result = hasPHI("BP: 120/80, HR: 72");
      expect(result).toBe(false);
    });

    it("should be boolean", () => {
      const result = hasPHI("test");
      expect(typeof result).toBe("boolean");
    });

    it("should handle mixed content", () => {
      const result = hasPHI("Patient John Doe with email john@example.com");
      expect(result).toBe(true);
    });

    it("should handle special characters", () => {
      const result = hasPHI("!@#$%^&*()");
      expect(typeof result).toBe("boolean");
    });

    it("should handle numbers only", () => {
      const result = hasPHI("123456789");
      expect(typeof result).toBe("boolean");
    });
  });

  describe("sanitizeText", () => {
    it("should sanitize text with PHI", () => {
      const result = sanitizeText("John Doe, SSN 123-45-6789");
      expect(result).not.toContain("123-45-6789");
    });

    it("should handle empty string", () => {
      const result = sanitizeText("");
      expect(result).toBe("");
    });

    it("should preserve clinical content", () => {
      const result = sanitizeText("Patient has hypertension and diabetes");
      expect(result).toContain("hypertension");
    });

    it("should remove email addresses", () => {
      const result = sanitizeText("Contact: john@example.com");
      expect(result).not.toContain("john@example.com");
    });

    it("should remove phone numbers", () => {
      const result = sanitizeText("Phone: 555-123-4567");
      expect(result).not.toContain("555-123-4567");
    });

    it("should handle multiple PHI instances", () => {
      const result = sanitizeText("John 123-45-6789 and jane@example.com");
      expect(result).not.toContain("123-45-6789");
      expect(result).not.toContain("jane@example.com");
    });

    it("should be idempotent", () => {
      const input = "Test with email@example.com";
      const first = sanitizeText(input);
      const second = sanitizeText(first);
      expect(first).toBe(second);
    });

    it("should handle long text", () => {
      const longText = "a".repeat(5000) + " email@example.com";
      const result = sanitizeText(longText);
      expect(typeof result).toBe("string");
    });

    it("should handle special characters", () => {
      const result = sanitizeText("Test !@#$%^&*() with special chars");
      expect(typeof result).toBe("string");
    });

    it("should handle unicode characters", () => {
      const result = sanitizeText("Test with émojis 🎉 and ñ");
      expect(typeof result).toBe("string");
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete patient note", () => {
      const note = `Patient: John Doe
SSN: 123-45-6789
Email: john@example.com
Phone: 555-123-4567
Assessment: Patient presents with hypertension and diabetes`;

      const sanitized = sanitizeText(note);
      expect(sanitized).not.toContain("123-45-6789");
      expect(sanitized).not.toContain("john@example.com");
      expect(sanitized).not.toContain("555-123-4567");
      expect(sanitized).toContain("hypertension");
    });

    it("should handle multi-pass sanitization", () => {
      const text = "John Doe, SSN 123-45-6789, email john@example.com";
      const pass1 = sanitizeText(text);
      const pass2 = sanitizeText(pass1);
      expect(pass1).toBe(pass2);
    });

    it("should detect and sanitize consistently", () => {
      const text = "Contact: 555-123-4567";
      const detected = detectPHI(text);
      const sanitized = sanitizeText(text);

      if (detected.containsPHI) {
        expect(sanitized).not.toContain("555-123-4567");
      }
    });

    it("should handle prompt and chat sanitization", () => {
      const content = "Patient john@example.com needs evaluation";
      const promptSanitized = sanitizePrompt(content);
      const chatSanitized = sanitizeChatContent(content);

      expect(typeof promptSanitized).toBe("string");
      expect(typeof chatSanitized).toBe("string");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null-like strings", () => {
      expect(() => sanitizeText("null")).not.toThrow();
      expect(() => sanitizeText("undefined")).not.toThrow();
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      const result = sanitizeText(longString);
      expect(typeof result).toBe("string");
    });

    it("should handle repeated patterns", () => {
      const result = sanitizeText(
        "test@example.com test@example.com test@example.com",
      );
      expect(result).not.toContain("test@example.com");
    });

    it("should handle mixed case PHI", () => {
      const result = detectPHI("EMAIL: TEST@EXAMPLE.COM");
      expect(result.containsPHI).toBe(true);
    });

    it("should handle whitespace variations", () => {
      const result = sanitizeText("  test@example.com  ");
      expect(typeof result).toBe("string");
    });

    it("should handle newlines and tabs", () => {
      const result = sanitizeText("test@example.com\n\tmore content");
      expect(typeof result).toBe("string");
    });
  });
});
