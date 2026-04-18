import { describe, it, expect } from "vitest";
import { sanitizePrompt, sanitizeChatContent } from "./sanitizer";

describe("Sanitizer Utils", () => {
  describe("sanitizePrompt", () => {
    it("removes email addresses", () => {
      expect(sanitizePrompt("Contact me at test@example.com for info.")).toBe(
        "Contact me at [EMAIL_REMOVED] for info.",
      );
    });

    it("removes phone numbers", () => {
      expect(sanitizePrompt("Call me at 555-123-4567 today.")).toBe(
        "Call me at [PHONE_REMOVED] today.",
      );
      expect(sanitizePrompt("My number is 555.123.4567")).toBe(
        "My number is [PHONE_REMOVED]",
      );
      expect(sanitizePrompt("Or 5551234567")).toBe("Or [PHONE_REMOVED]");
    });

    it("leaves normal text alone", () => {
      expect(sanitizePrompt("Hello world, this is a test.")).toBe(
        "Hello world, this is a test.",
      );
    });
  });

  describe("sanitizeChatContent", () => {
    it("removes email addresses", () => {
      expect(sanitizeChatContent("User email is user@domain.com")).toBe(
        "User email is [EMAIL_REMOVED]",
      );
    });

    it("removes phone numbers", () => {
      expect(sanitizeChatContent("Phone: 123-456-7890")).toBe(
        "Phone: [PHONE_REMOVED]",
      );
    });

    it("leaves normal text alone", () => {
      expect(sanitizeChatContent("Just a normal chat message")).toBe(
        "Just a normal chat message",
      );
    });
  });
});
