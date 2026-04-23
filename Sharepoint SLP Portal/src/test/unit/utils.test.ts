import { describe, it, expect, beforeEach } from "vitest";
import { logger } from "../../utils/logger";
import { sanitizePrompt, sanitizeChatContent } from "../../utils/sanitizer";

describe("Logger Utility", () => {
  beforeEach(() => {
    logger.clearLogs();
  });

  it("should log info messages", () => {
    logger.info("test info");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("info");
    expect(logs[0]!.message).toBe("test info");
  });

  it("should log warn messages", () => {
    logger.warn("test warn");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("warn");
  });

  it("should log error messages", () => {
    logger.error("test error");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("error");
  });

  it("should log debug messages", () => {
    logger.debug("test debug");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("debug");
  });

  it("should handle data in logs", () => {
    logger.info("test data", { key: "value" });
    const logs = logger.getLogs();
    expect(logs[0]!.data).toEqual({ key: "value" });
  });

  it("should respect maxLogs limit", () => {
    // Default maxLogs is 1000
    for (let i = 0; i < 1001; i++) {
      logger.info(`log ${i}`);
    }
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1000);
    expect(logs[0]!.message).toBe("log 1");
    expect(logs[999]!.message).toBe("log 1000");

    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });
});

describe("Sanitizer Utility", () => {
  it("should sanitize emails in prompt", () => {
    const prompt = "Contact me at test@example.com";
    expect(sanitizePrompt(prompt)).toBe("Contact me at [EMAIL_REMOVED]");
  });

  it("should sanitize phone numbers in prompt", () => {
    const prompt = "Call me at 123-456-7890";
    expect(sanitizePrompt(prompt)).toBe("Call me at [PHONE_REMOVED]");
  });

  it("should sanitize emails in chat content", () => {
    const content = "Email: user@domain.org";
    expect(sanitizeChatContent(content)).toBe("Email: [EMAIL_REMOVED]");
  });

  it("should sanitize phone numbers in chat content", () => {
    const content = "Phone: 987.654.3210";
    expect(sanitizeChatContent(content)).toBe("Phone: [PHONE_REMOVED]");
  });
});
