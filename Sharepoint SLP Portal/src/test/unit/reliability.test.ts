import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  CircuitBreaker,
  withRetry,
  withTimeout,
} from "../../utils/reliability";

describe("reliability utilities", () => {
  describe("withTimeout", () => {
    it("resolves if promise completes before timeout", async () => {
      const result = await withTimeout(Promise.resolve("success"), 100);
      expect(result).toBe("success");
    });

    it("rejects if promise takes longer than timeout", async () => {
      const slowPromise = new Promise((resolve) =>
        setTimeout(() => resolve("slow"), 100),
      );
      await expect(
        withTimeout(slowPromise, 10, "Custom timeout error"),
      ).rejects.toThrow("Custom timeout error");
    });
  });

  describe("withRetry", () => {
    it("resolves immediately on success", async () => {
      const operation = vi.fn().mockResolvedValue("success");
      const result = await withRetry(operation);
      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("retries and succeeds on subsequent attempt", async () => {
      let attempts = 0;
      const operation = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 3) throw new Error("Failed");
        return "success";
      });
      const onRetry = vi.fn();

      const result = await withRetry(operation, 3, 10, onRetry);
      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it("throws the last error if all attempts fail", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new Error("Persistent failure"));
      await expect(withRetry(operation, 2, 10)).rejects.toThrow(
        "Persistent failure",
      );
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe("CircuitBreaker", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("allows successful operations in CLOSED state", async () => {
      const cb = new CircuitBreaker(3, 1000);
      const operation = vi.fn().mockResolvedValue("success");
      const result = await cb.execute(operation);
      expect(result).toBe("success");
    });

    it("transitions to OPEN state after threshold failures", async () => {
      const cb = new CircuitBreaker(2, 1000);
      const operation = vi.fn().mockRejectedValue(new Error("fail"));

      await expect(cb.execute(operation)).rejects.toThrow("fail");
      await expect(cb.execute(operation)).rejects.toThrow("fail");

      // Third attempt should fail immediately because circuit is OPEN
      const newOperation = vi.fn();
      await expect(cb.execute(newOperation)).rejects.toThrow(
        "Circuit is OPEN. Operation aborted to prevent cascading failure.",
      );
      expect(newOperation).not.toHaveBeenCalled();
    });

    it("transitions to HALF_OPEN after timeout and resets to CLOSED on success", async () => {
      const cb = new CircuitBreaker(1, 1000);
      const operation = vi.fn().mockRejectedValue(new Error("fail"));

      await expect(cb.execute(operation)).rejects.toThrow("fail"); // Circuit is now OPEN

      // Fast forward time
      vi.advanceTimersByTime(1500);

      // It should be HALF_OPEN now, allowing one attempt
      const successOperation = vi.fn().mockResolvedValue("recovered");
      const result = await cb.execute(successOperation);

      expect(result).toBe("recovered");
      expect(successOperation).toHaveBeenCalled();

      // State should be back to CLOSED
      const nextOperation = vi.fn().mockResolvedValue("normal");
      await expect(cb.execute(nextOperation)).resolves.toBe("normal");
    });
  });
});
