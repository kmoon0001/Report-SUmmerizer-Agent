import { describe, it, expect, beforeEach, vi } from "vitest";
import { logger } from "./logger";

describe("Logger Utility", () => {
  beforeEach(() => {
    logger.clearLogs();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("logs info messages", () => {
    logger.info("Test info message", { key: "value" });
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("info");
    expect(logs[0]!.message).toBe("Test info message");
    expect(logs[0]!.data).toEqual({ key: "value" });
  });

  it("logs warn messages", () => {
    logger.warn("Test warn message");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("warn");
  });

  it("logs error messages", () => {
    logger.error("Test error message");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("error");
  });

  it("logs debug messages", () => {
    logger.debug("Test debug message");
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]!.level).toBe("debug");
  });

  it("limits the number of logs to 1000", () => {
    for (let i = 0; i < 1005; i++) {
      logger.info(`Message ${i}`);
    }
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1000);
    expect(logs[0]!.message).toBe("Message 5");
    expect(logs[999]!.message).toBe("Message 1004");
  });

  it("clears logs", () => {
    logger.info("Test message");
    expect(logger.getLogs()).toHaveLength(1);
    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });
});
