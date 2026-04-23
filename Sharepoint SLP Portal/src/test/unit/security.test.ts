/**
 * Unit tests for security utilities
 * Tests PHI detection, masking, encryption, and input sanitization
 */

import { describe, it, expect } from "vitest";
import { detectPHI, maskPHI, sanitizeInput } from "../../utils/encryption";

describe("PHI Detection and Masking", () => {
  describe("PHI Detection", () => {
    it("should detect SSN", () => {
      const text = "Patient SSN: 123-45-6789";
      const detected = detectPHI(text);
      expect(detected.length).toBeGreaterThan(0);
    });

    it("should detect phone number", () => {
      const text = "Contact: 555-123-4567";
      const detected = detectPHI(text);
      expect(detected.length).toBeGreaterThan(0);
    });

    it("should detect email", () => {
      const text = "Email: patient@example.com";
      const detected = detectPHI(text);
      expect(detected.length).toBeGreaterThan(0);
    });

    it("should not detect non-PHI text", () => {
      const text = "Patient is stable and improving.";
      const detected = detectPHI(text);
      expect(detected.length).toBe(0);
    });
  });

  describe("PHI Masking", () => {
    it("should mask SSN", () => {
      const text = "SSN: 123-45-6789";
      const masked = maskPHI(text);
      expect(masked).not.toContain("123-45-6789");
      expect(masked).toContain("XXX-XX-XXXX");
    });

    it("should mask phone", () => {
      const text = "Phone: 555-123-4567";
      const masked = maskPHI(text);
      expect(masked).not.toContain("555-123-4567");
      expect(masked).toContain("XXX-XXX-XXXX");
    });

    it("should mask email", () => {
      const text = "Email: patient@example.com";
      const masked = maskPHI(text);
      expect(masked).not.toContain("patient@example.com");
      expect(masked).toContain("[email]");
    });

    it("should preserve non-PHI text", () => {
      const text = "Patient is stable.";
      const masked = maskPHI(text);
      expect(masked).toBe(text);
    });
  });

  describe("Input Sanitization", () => {
    it("should remove XSS vectors", () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
    });

    it("should remove SQL injection vectors", () => {
      const input = "'; DROP TABLE users; --";
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain(";");
    });

    it("should preserve safe input", () => {
      const input = "John Doe, 123 Main St.";
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain("John Doe");
      expect(sanitized).toContain("123 Main St");
    });
  });
});

describe("Security Compliance", () => {
  it("should implement PHI detection and masking", () => {
    // Verify encryption utilities exist
    expect(detectPHI).toBeDefined();
    expect(maskPHI).toBeDefined();
    expect(sanitizeInput).toBeDefined();
  });
});
