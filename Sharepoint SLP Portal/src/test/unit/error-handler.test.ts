/**
 * Unit Tests: Error Handler
 * Requirements: Task 27 - Comprehensive error handling
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  AppError,
  generateRequestId,
  getErrorContext,
  categorizeError,
  determineSeverity,
  getErrorCode,
  getUserMessage,
  handleError,
  createSuccessResponse,
  retryWithBackoff,
  validateInput,
  getErrorLogs,
  clearErrorLogs,
  resolveError,
} from "../../utils/error-handler";

describe("Error Handler Utility", () => {
  beforeEach(() => {
    clearErrorLogs();
  });

  afterEach(() => {
    clearErrorLogs();
  });

  // ── Request ID Generation ──────────────────────────────────────────────
  describe("generateRequestId", () => {
    it("generates unique request IDs", () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      expect(id1).not.toBe(id2);
    });

    it("request ID starts with req_", () => {
      const id = generateRequestId();
      expect(id).toMatch(/^req_/);
    });

    it("request ID contains timestamp", () => {
      const id = generateRequestId();
      expect(id).toMatch(/req_\d+_/);
    });
  });

  // ── Error Context ──────────────────────────────────────────────────────
  describe("getErrorContext", () => {
    it("returns error context with timestamp", () => {
      const context = getErrorContext();
      expect(context.timestamp).toBeDefined();
      expect(new Date(context.timestamp)).toBeInstanceOf(Date);
    });

    it("includes userAgent in context", () => {
      const context = getErrorContext();
      expect(context.userAgent).toBeDefined();
    });

    it("includes URL in context", () => {
      const context = getErrorContext();
      expect(context.url).toBeDefined();
    });
  });

  // ── Error Categorization ───────────────────────────────────────────────
  describe("categorizeError", () => {
    it("categorizes AppError by its category", () => {
      const error = new AppError("Test error", "validation");
      expect(categorizeError(error)).toBe("validation");
    });

    it("categorizes 400 status as validation", () => {
      const error = { status: 400, message: "Bad request" };
      expect(categorizeError(error)).toBe("validation");
    });

    it("categorizes 401 status as auth", () => {
      const error = { status: 401, message: "Unauthorized" };
      expect(categorizeError(error)).toBe("auth");
    });

    it("categorizes 403 status as permission", () => {
      const error = { status: 403, message: "Forbidden" };
      expect(categorizeError(error)).toBe("permission");
    });

    it("categorizes 404 status as notfound", () => {
      const error = { status: 404, message: "Not found" };
      expect(categorizeError(error)).toBe("notfound");
    });

    it("categorizes 500+ status as server", () => {
      const error = { status: 500, message: "Internal error" };
      expect(categorizeError(error)).toBe("server");
    });

    it("categorizes network errors", () => {
      const error = { message: "Network error" };
      expect(categorizeError(error)).toBe("network");
    });

    it("categorizes timeout errors as network", () => {
      const error = { message: "Request timeout" };
      expect(categorizeError(error)).toBe("network");
    });

    it("defaults to unknown for unrecognized errors", () => {
      const error = { message: "Some random error" };
      expect(categorizeError(error)).toBe("unknown");
    });
  });

  // ── Error Severity ────────────────────────────────────────────────────
  describe("determineSeverity", () => {
    it("validation errors are warnings", () => {
      expect(determineSeverity("validation")).toBe("warning");
    });

    it("network errors are warnings", () => {
      expect(determineSeverity("network")).toBe("warning");
    });

    it("auth errors are errors", () => {
      expect(determineSeverity("auth")).toBe("error");
    });

    it("permission errors are errors", () => {
      expect(determineSeverity("permission")).toBe("error");
    });

    it("server errors are critical", () => {
      expect(determineSeverity("server")).toBe("critical");
    });

    it("unknown errors are errors", () => {
      expect(determineSeverity("unknown")).toBe("error");
    });
  });

  // ── Error Codes ────────────────────────────────────────────────────────
  describe("getErrorCode", () => {
    it("returns validation error code", () => {
      const code = getErrorCode("validation", "INVALID_INPUT");
      expect(code).toBe("ERR_VALIDATION_001");
    });

    it("returns network error code", () => {
      const code = getErrorCode("network", "TIMEOUT");
      expect(code).toBe("ERR_NETWORK_001");
    });

    it("returns auth error code", () => {
      const code = getErrorCode("auth", "UNAUTHORIZED");
      expect(code).toBe("ERR_AUTH_001");
    });

    it("returns unknown error code for unrecognized type", () => {
      const code = getErrorCode("validation", "UNKNOWN_TYPE");
      expect(code).toBe("ERR_UNKNOWN_001");
    });
  });

  // ── User Messages ──────────────────────────────────────────────────────
  describe("getUserMessage", () => {
    it("returns user-friendly message for validation error", () => {
      const msg = getUserMessage("ERR_VALIDATION_001");
      expect(msg).toContain("check your input");
    });

    it("returns user-friendly message for network error", () => {
      const msg = getUserMessage("ERR_NETWORK_002");
      expect(msg).toContain("internet connection");
    });

    it("returns user-friendly message for auth error", () => {
      const msg = getUserMessage("ERR_AUTH_002");
      expect(msg).toContain("session has expired");
    });

    it("returns default message for unknown error code", () => {
      const msg = getUserMessage("UNKNOWN_CODE");
      expect(msg).toBeDefined();
      expect(msg.length).toBeGreaterThan(0);
    });
  });

  // ── Error Handling ────────────────────────────────────────────────────
  describe("handleError", () => {
    it("returns error response with success false", () => {
      const error = new AppError("Test error", "validation");
      const response = handleError(error);
      expect(response.success).toBe(false);
    });

    it("includes error code in response", () => {
      const error = new AppError("Test error", "validation");
      const response = handleError(error);
      expect(response.error.code).toBeDefined();
    });

    it("includes user message in response", () => {
      const error = new AppError("Test error", "validation");
      const response = handleError(error);
      expect(response.error.userMessage).toBeDefined();
    });

    it("includes request ID in response", () => {
      const error = new AppError("Test error", "validation");
      const response = handleError(error);
      expect(response.error.requestId).toMatch(/^req_/);
    });

    it("logs error to error logs", () => {
      const error = new AppError("Test error", "validation");
      handleError(error);
      const logs = getErrorLogs();
      expect(logs.length).toBeGreaterThan(0);
    });

    it("includes timestamp in response", () => {
      const error = new AppError("Test error", "validation");
      const response = handleError(error);
      expect(response.error.timestamp).toBeDefined();
      expect(new Date(response.error.timestamp)).toBeInstanceOf(Date);
    });
  });

  // ── Success Response ───────────────────────────────────────────────────
  describe("createSuccessResponse", () => {
    it("returns success response with success true", () => {
      const response = createSuccessResponse({ test: "data" });
      expect(response.success).toBe(true);
    });

    it("includes data in response", () => {
      const data = { test: "data" };
      const response = createSuccessResponse(data);
      expect(response.data).toEqual(data);
    });

    it("includes request ID in response", () => {
      const response = createSuccessResponse({ test: "data" });
      expect(response.requestId).toMatch(/^req_/);
    });

    it("includes timestamp in response", () => {
      const response = createSuccessResponse({ test: "data" });
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });
  });

  // ── Retry Logic ────────────────────────────────────────────────────────
  describe("retryWithBackoff", () => {
    it("succeeds on first attempt", async () => {
      const fn = vi.fn().mockResolvedValue("success");
      const result = await retryWithBackoff(fn);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("retries on failure", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Fail 1"))
        .mockResolvedValueOnce("success");
      const result = await retryWithBackoff(fn, 3, 10);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("throws after max retries", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("Always fails"));
      await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow("Always fails");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("uses exponential backoff", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Fail 1"))
        .mockRejectedValueOnce(new Error("Fail 2"))
        .mockResolvedValueOnce("success");

      const start = Date.now();
      await retryWithBackoff(fn, 3, 10);
      const duration = Date.now() - start;

      // Should have delays of ~10ms and ~20ms = ~30ms minimum
      expect(duration).toBeGreaterThanOrEqual(25);
    });
  });

  // ── Input Validation ───────────────────────────────────────────────────
  describe("validateInput", () => {
    it("validates required fields", () => {
      const schema = { name: { required: true } };
      const result = validateInput({}, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("name is required");
    });

    it("validates field types", () => {
      const schema = { age: { type: "number" } };
      const result = validateInput({ age: "not a number" }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("age"))).toBe(true);
    });

    it("passes valid input", () => {
      const schema = { name: { required: true, type: "string" } };
      const result = validateInput({ name: "John" }, schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("handles multiple validation errors", () => {
      const schema = {
        name: { required: true },
        age: { required: true, type: "number" },
      };
      const result = validateInput({ age: "invalid" }, schema);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── Error Logging ──────────────────────────────────────────────────────
  describe("Error Logging", () => {
    it("stores error logs", () => {
      const error = new AppError("Test error", "validation");
      handleError(error);
      const logs = getErrorLogs();
      expect(logs.length).toBeGreaterThan(0);
    });

    it("filters logs by severity", () => {
      handleError(new AppError("Error 1", "validation"));
      handleError(new AppError("Error 2", "server"));
      const logs = getErrorLogs({ severity: "critical" });
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.every((l) => l.severity === "critical")).toBe(true);
    });

    it("filters logs by category", () => {
      handleError(new AppError("Error 1", "validation"));
      handleError(new AppError("Error 2", "auth"));
      const logs = getErrorLogs({ category: "validation" });
      expect(logs.every((l) => l.category === "validation")).toBe(true);
    });

    it("clears error logs", () => {
      handleError(new AppError("Test error", "validation"));
      expect(getErrorLogs().length).toBeGreaterThan(0);
      clearErrorLogs();
      expect(getErrorLogs()).toHaveLength(0);
    });

    it("marks error as resolved", () => {
      const error = new AppError("Test error", "validation");
      const _response = handleError(error);
      const logs = getErrorLogs();
      const errorId = logs[0].id;

      expect(logs[0].resolved).toBe(false);
      resolveError(errorId);
      const updatedLogs = getErrorLogs();
      expect(updatedLogs[0].resolved).toBe(true);
      expect(updatedLogs[0].resolvedAt).toBeDefined();
    });
  });

  // ── AppError Class ────────────────────────────────────────────────────
  describe("AppError", () => {
    it("creates error with message and category", () => {
      const error = new AppError("Test message", "validation");
      expect(error.message).toBe("Test message");
      expect(error.category).toBe("validation");
    });

    it("defaults to error severity", () => {
      const error = new AppError("Test message", "validation");
      expect(error.severity).toBe("error");
    });

    it("accepts custom severity", () => {
      const error = new AppError("Test message", "validation", "warning");
      expect(error.severity).toBe("warning");
    });

    it("accepts metadata", () => {
      const metadata = { userId: "123" };
      const error = new AppError(
        "Test message",
        "validation",
        "error",
        metadata,
      );
      expect(error.metadata).toEqual(metadata);
    });

    it("is instanceof Error", () => {
      const error = new AppError("Test message", "validation");
      expect(error instanceof Error).toBe(true);
    });
  });
});
