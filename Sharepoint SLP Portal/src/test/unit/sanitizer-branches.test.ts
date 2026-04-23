import { describe, it, expect, vi } from "vitest";
import { sanitizePrompt, detectPHI } from "../../utils/sanitizer";

vi.mock("../../services/audit-service", () => ({
  auditService: { logInteraction: vi.fn() },
}));

describe("sanitizer — branch coverage", () => {
  describe("sanitizePrompt — all PHI types", () => {
    it("removes Medicare ID", () => {
      const result = sanitizePrompt("Medicare: 123-45-6789-A");
      expect(result).toContain("[MEDICARE_ID_REMOVED]");
    });

    it("removes MRN with context", () => {
      const result = sanitizePrompt("MRN: ABC123456");
      expect(result).toContain("[MRN_REMOVED]");
    });

    it("removes account number with context", () => {
      const result = sanitizePrompt("Account: AB123456789");
      expect(result).toContain("[ACCOUNT_REMOVED]");
    });

    it("removes driver license with context", () => {
      const result = sanitizePrompt("DL: CA123456789");
      expect(result).toContain("[DL_REMOVED]");
    });

    it("removes device serial with context", () => {
      const result = sanitizePrompt("Serial: SN123456789ABC");
      expect(result).toContain("[SERIAL_REMOVED]");
    });

    it("removes multiple PHI types in one text", () => {
      const result = sanitizePrompt(
        "Patient 123-45-6789 at 555-123-4567 email@test.com",
      );
      expect(result).toContain("[SSN_REMOVED]");
      expect(result).toContain("[PHONE_REMOVED]");
      expect(result).toContain("[EMAIL_REMOVED]");
    });

    it("removes ZIP code (5 digits)", () => {
      const result = sanitizePrompt("ZIP: 12345");
      expect(result).toContain("[ZIP_REMOVED]");
    });

    it("removes street address with various formats", () => {
      const result = sanitizePrompt("123 Main Street");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Avenue", () => {
      const result = sanitizePrompt("456 Oak Avenue");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Boulevard", () => {
      const result = sanitizePrompt("789 Park Boulevard");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Road", () => {
      const result = sanitizePrompt("321 Forest Road");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Lane", () => {
      const result = sanitizePrompt("654 Quiet Lane");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Drive", () => {
      const result = sanitizePrompt("987 Scenic Drive");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Court", () => {
      const result = sanitizePrompt("111 Tennis Court");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Circle", () => {
      const result = sanitizePrompt("222 Round Circle");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes address with Way", () => {
      const result = sanitizePrompt("333 Hidden Way");
      expect(result).toContain("[ADDRESS_REMOVED]");
    });

    it("removes VIN (17 chars)", () => {
      const result = sanitizePrompt("VIN: 1HGBH41JXMN109186");
      expect(result).toContain("[VIN_REMOVED]");
    });

    it("removes date with dashes", () => {
      const result = sanitizePrompt("Date: 01-15-2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes date with slashes", () => {
      const result = sanitizePrompt("Date: 01/15/2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes date with single digit month", () => {
      const result = sanitizePrompt("Date: 1/15/2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes date with single digit day", () => {
      const result = sanitizePrompt("Date: 01/5/2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes written date with comma", () => {
      const result = sanitizePrompt("Date: January 15, 2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes written date without comma", () => {
      const result = sanitizePrompt("Date: February 20 2024");
      expect(result).toContain("[DATE_REMOVED]");
    });

    it("removes all month names", () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      months.forEach((month) => {
        const result = sanitizePrompt(`${month} 15, 2024`);
        expect(result).toContain("[DATE_REMOVED]");
      });
    });

    it("removes phone with parentheses", () => {
      const result = sanitizePrompt("(555) 123-4567");
      expect(result).toContain("[PHONE_REMOVED]");
    });

    it("removes phone with dashes", () => {
      const result = sanitizePrompt("555-123-4567");
      expect(result).toContain("[PHONE_REMOVED]");
    });

    it("removes phone with dots", () => {
      const result = sanitizePrompt("555.123.4567");
      expect(result).toContain("[PHONE_REMOVED]");
    });

    it("removes phone with spaces", () => {
      const result = sanitizePrompt("555 123 4567");
      expect(result).toContain("[PHONE_REMOVED]");
    });

    it("removes 10-digit phone", () => {
      const result = sanitizePrompt("(555) 123-4567");
      expect(result).toContain("[PHONE_REMOVED]");
    });

    it("removes IP address", () => {
      const result = sanitizePrompt("192.168.1.1");
      expect(result).toContain("[IP_REMOVED]");
    });

    it("removes IP with 0s", () => {
      const result = sanitizePrompt("10.0.0.1");
      expect(result).toContain("[IP_REMOVED]");
    });

    it("removes IP with 255s", () => {
      const result = sanitizePrompt("255.255.255.255");
      expect(result).toContain("[IP_REMOVED]");
    });

    it("removes http URL", () => {
      const result = sanitizePrompt("http://example.com/path");
      expect(result).toContain("[URL_REMOVED]");
    });

    it("removes https URL", () => {
      const result = sanitizePrompt("https://example.com/path");
      expect(result).toContain("[URL_REMOVED]");
    });

    it("removes URL with www", () => {
      const result = sanitizePrompt("https://www.example.com");
      expect(result).toContain("[URL_REMOVED]");
    });

    it("removes name with Mr title", () => {
      const result = sanitizePrompt("Mr. Smith");
      expect(result).toContain("[NAME_REMOVED]");
    });

    it("removes name with Mrs title", () => {
      const result = sanitizePrompt("Mrs. Johnson");
      expect(result).toContain("[NAME_REMOVED]");
    });

    it("removes name with Ms title", () => {
      const result = sanitizePrompt("Ms. Williams");
      expect(result).toContain("[NAME_REMOVED]");
    });

    it("removes name with Dr title", () => {
      const result = sanitizePrompt("Dr. Brown");
      expect(result).toContain("[NAME_REMOVED]");
    });

    it("removes name with Miss title", () => {
      const result = sanitizePrompt("Miss. Davis");
      expect(result).toContain("[NAME_REMOVED]");
    });

    it("removes patient name context", () => {
      const result = sanitizePrompt("Patient named John Smith");
      expect(result).toContain("[PATIENT_NAME_REMOVED]");
    });

    it("removes patient name with pt abbreviation", () => {
      const result = sanitizePrompt("pt name: Jane Doe");
      expect(result).toContain("[PATIENT_NAME_REMOVED]");
    });

    it("removes patient name with client", () => {
      const result = sanitizePrompt("client named Bob Jones");
      expect(result).toContain("[PATIENT_NAME_REMOVED]");
    });
  });

  describe("detectPHI — all types", () => {
    it("detects multiple PHI types", () => {
      const result = detectPHI("SSN 123-45-6789 and email@test.com");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("SSN");
      expect(result.detectedTypes).toContain("EMAIL");
    });

    it("detects all date formats", () => {
      const result = detectPHI("01/15/2024 and January 15, 2024");
      expect(result.detectedTypes).toContain("DATE");
    });

    it("detects all phone formats", () => {
      const result = detectPHI("(555) 123-4567 and 555-123-4567");
      expect(result.detectedTypes).toContain("PHONE");
    });

    it("detects address variations", () => {
      const result = detectPHI("123 Main Street");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("ADDRESS");
    });

    it("detects VIN", () => {
      const result = detectPHI("1HGBH41JXMN109186");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("VIN");
    });

    it("detects all name titles", () => {
      const result = detectPHI("Dr. Smith and Mrs. Johnson");
      expect(result.containsPHI).toBe(true);
      expect(result.detectedTypes).toContain("NAME");
    });

    it("deduplicates NAME type", () => {
      const result = detectPHI("Mr. Smith and Mrs. Johnson");
      const nameCount = result.detectedTypes.filter((t) => t === "NAME").length;
      expect(nameCount).toBe(1);
    });

    it("deduplicates DATE type", () => {
      const result = detectPHI("01/15/2024 and 02/20/2024");
      const dateCount = result.detectedTypes.filter((t) => t === "DATE").length;
      expect(dateCount).toBe(1);
    });

    it("deduplicates ZIP type", () => {
      const result = detectPHI("12345 and 67890");
      const zipCount = result.detectedTypes.filter((t) => t === "ZIP").length;
      expect(zipCount).toBe(1);
    });
  });
});
