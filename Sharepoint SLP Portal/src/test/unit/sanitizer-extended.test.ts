import { describe, it, expect, vi } from "vitest";
import {
  sanitizePrompt,
  sanitizeChatContent,
  detectPHI,
} from "../../utils/sanitizer";

vi.mock("../../services/audit-service", () => ({
  auditService: { logInteraction: vi.fn() },
}));

import { auditService } from "../../services/audit-service";

describe("sanitizePrompt — PHI removal", () => {
  it("removes SSN", () => {
    const result = sanitizePrompt("Patient SSN is 123-45-6789");
    expect(result).not.toContain("123-45-6789");
    expect(result).toContain("[SSN_REMOVED]");
  });

  it("removes phone number", () => {
    const result = sanitizePrompt("Call me at (555) 123-4567");
    expect(result).not.toContain("555");
    expect(result).toContain("[PHONE_REMOVED]");
  });

  it("removes email address", () => {
    const result = sanitizePrompt("Email: patient@example.com");
    expect(result).not.toContain("patient@example.com");
    expect(result).toContain("[EMAIL_REMOVED]");
  });

  it("removes date MM/DD/YYYY", () => {
    const result = sanitizePrompt("DOB: 03/15/1985");
    expect(result).not.toContain("03/15/1985");
    expect(result).toContain("[DATE_REMOVED]");
  });

  it("removes written date", () => {
    const result = sanitizePrompt("Appointment on January 15, 2024");
    expect(result).not.toContain("January 15, 2024");
    expect(result).toContain("[DATE_REMOVED]");
  });

  it("removes IP address", () => {
    const result = sanitizePrompt("Server IP: 192.168.1.100");
    expect(result).not.toContain("192.168.1.100");
    expect(result).toContain("[IP_REMOVED]");
  });

  it("removes URL", () => {
    const result = sanitizePrompt(
      "Visit https://patient-portal.example.com for records",
    );
    expect(result).toContain("[URL_REMOVED]");
  });

  it("removes name with title", () => {
    const result = sanitizePrompt("Dr. Smith evaluated the patient");
    expect(result).toContain("[NAME_REMOVED]");
  });

  it("removes patient name in context", () => {
    const result = sanitizePrompt("Patient named John Smith was seen today");
    expect(result).toContain("[PATIENT_NAME_REMOVED]");
  });

  it("removes street address", () => {
    const result = sanitizePrompt("Lives at 123 Main Street");
    expect(result).toContain("[ADDRESS_REMOVED]");
  });

  it("removes ZIP+4 code", () => {
    const result = sanitizePrompt("ZIP code 12345-6789");
    expect(result).toContain("[ZIP_REMOVED]");
  });

  it("removes VIN", () => {
    const result = sanitizePrompt("VIN: 1HGBH41JXMN109186");
    expect(result).toContain("[VIN_REMOVED]");
  });

  it("does not modify clean text", () => {
    const clean = "Patient presents with left knee pain and limited ROM";
    const result = sanitizePrompt(clean, false);
    expect(result).toBe(clean);
  });

  it("does not log when logAccess is false", () => {
    vi.mocked(auditService.logInteraction).mockClear();
    sanitizePrompt("SSN: 123-45-6789", false);
    expect(auditService.logInteraction).not.toHaveBeenCalled();
  });

  it("logs when PHI is detected and logAccess is true", () => {
    vi.mocked(auditService.logInteraction).mockClear();
    sanitizePrompt("SSN: 123-45-6789", true);
    expect(auditService.logInteraction).toHaveBeenCalled();
  });
});

describe("sanitizeChatContent", () => {
  it("is a wrapper around sanitizePrompt", () => {
    const result = sanitizeChatContent("Call 555-123-4567");
    expect(result).toContain("[PHONE_REMOVED]");
  });
});

describe("detectPHI", () => {
  it("detects SSN", () => {
    const result = detectPHI("SSN: 123-45-6789");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("SSN");
  });

  it("detects email", () => {
    const result = detectPHI("user@example.com");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("EMAIL");
  });

  it("detects phone", () => {
    const result = detectPHI("(555) 123-4567");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("PHONE");
  });

  it("returns false for clean text", () => {
    const result = detectPHI("Patient has left knee pain");
    expect(result.containsPHI).toBe(false);
    expect(result.detectedTypes).toHaveLength(0);
  });

  it("deduplicates detected types", () => {
    const result = detectPHI("12345 and 67890");
    const zipCount = result.detectedTypes.filter((t) => t === "ZIP").length;
    expect(zipCount).toBe(1);
  });

  it("detects IP address", () => {
    const result = detectPHI("IP: 10.0.0.1");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("IP_ADDRESS");
  });

  it("detects URL", () => {
    const result = detectPHI("https://example.com/records");
    expect(result.containsPHI).toBe(true);
    expect(result.detectedTypes).toContain("URL");
  });
});
