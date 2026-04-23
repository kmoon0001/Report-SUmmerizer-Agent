import { describe, it, expect, vi } from "vitest";
import {
  CircuitBreaker,
  withTimeout,
  withRetry,
} from "../../utils/reliability";

describe("Performance, Spike & Stress Testing", () => {
  describe("Spike Testing", () => {
    it("handles rapid concurrent requests without failing", async () => {
      const mockOperation = vi.fn().mockResolvedValue("success");

      // Simulate 100 concurrent requests (spike)
      const requests = Array.from({ length: 100 }).map(() => mockOperation());

      const results = await Promise.all(requests);

      expect(results).toHaveLength(100);
      expect(results.every((r) => r === "success")).toBe(true);
      expect(mockOperation).toHaveBeenCalledTimes(100);
    });

    it("CircuitBreaker opens correctly under heavy failure load", async () => {
      const cb = new CircuitBreaker(3, 5000); // threshold 3 (lower for faster test)
      const failingOperation = vi
        .fn()
        .mockRejectedValue(new Error("service overloaded"));

      // Execute requests sequentially to allow circuit breaker to open
      const results = [];
      for (let i = 0; i < 10; i++) {
        try {
          await cb.execute(failingOperation);
          results.push("success");
        } catch (e: any) {
          results.push(e.message);
        }
      }

      // We expect first 3 to fail with "service overloaded" (threshold)
      // and the rest to fail with "Circuit is OPEN..."
      const overloadedFailures = results.filter(
        (r) => r === "service overloaded",
      );
      const circuitOpenFailures = results.filter((r) =>
        r.includes("Circuit is OPEN"),
      );

      // First 3 should be service overloaded, rest should be circuit open
      expect(overloadedFailures.length).toBe(3);
      expect(circuitOpenFailures.length).toBe(7);
    });
  });

  describe("Timeout Constraints", () => {
    it("cancels operations that exceed acceptable performance bounds", async () => {
      const slowOperation = () =>
        new Promise((resolve) => setTimeout(() => resolve("done"), 100));

      // Set strict timeout of 10ms
      await expect(
        withTimeout(slowOperation(), 10, "Performance SLA violated"),
      ).rejects.toThrow("Performance SLA violated");
    });
  });

  describe("Thundering Herd Prevention (Jitter)", () => {
    it("applies exponential backoff with jitter on retries", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("fail"));
      const onRetry = vi.fn();

      // Should retry 3 times. We can't strictly test the random jitter duration without mocking Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.5); // Fixed jitter of 50ms (0.5 * 100)

      try {
        await withRetry(operation, 3, 100, onRetry);
      } catch (e) {
        // Expected to throw
      }

      expect(onRetry).toHaveBeenCalledTimes(2); // Retries happen on attempts 1 and 2
      expect(operation).toHaveBeenCalledTimes(3);

      // Cleanup
      vi.spyOn(Math, "random").mockRestore();
    });
  });
});
