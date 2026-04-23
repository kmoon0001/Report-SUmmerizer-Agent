/**
 * Circuit Breaker Tests — State Management, Failure Handling, Recovery
 * Purpose: Validate error recovery and prevent cascading failures
 * Framework: Vitest
 *
 * These tests validate:
 * - Closed state (normal operation)
 * - Open state (fast fail)
 * - Half-open state (recovery attempt)
 * - State transitions
 * - Threshold configuration
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

enum CircuitBreakerState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitBreakerState.CLOSED;
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
    }
  }
}

describe("Circuit Breaker: Error Recovery & Failure Prevention", () => {
  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 1000,
    });
  });

  describe("Closed State (Normal Operation)", () => {
    it("starts in closed state", () => {
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it("allows requests to pass through", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");

      const result = await circuitBreaker.execute(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("resets failure count on success", async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      try {
        await circuitBreaker.execute(mockFn);
      } catch {
        // Expected
      }

      const result = await circuitBreaker.execute(mockFn);

      expect(result).toBe("success");
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });
  });

  describe("Open State (Fast Fail)", () => {
    it("transitions to open after failure threshold", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);
    });

    it("rejects requests immediately when open", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open state
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      // Try to execute when open
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow(
        "Circuit breaker is OPEN",
      );

      // Function should not be called
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("prevents cascading failures", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open state
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      // Multiple requests should fail fast
      const promises = Array(10)
        .fill(null)
        .map(() => circuitBreaker.execute(mockFn).catch(() => "rejected"));

      const results = await Promise.all(promises);

      // All should be rejected
      expect(results.every((r) => r === "rejected")).toBe(true);

      // Function should only be called 3 times (to open the circuit)
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe("Half-Open State (Recovery Attempt)", () => {
    it("transitions to half-open after timeout", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open state
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Next request should transition to half-open
      const successFn = vi.fn().mockResolvedValue("success");

      try {
        await circuitBreaker.execute(successFn);
      } catch {
        // May fail if still in open state
      }

      // Should be in half-open or closed state
      const state = circuitBreaker.getState();
      expect([
        CircuitBreakerState.HALF_OPEN,
        CircuitBreakerState.CLOSED,
      ]).toContain(state);
    });

    it("closes circuit after success threshold in half-open", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open state
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Successful requests in half-open state
      const successFn = vi.fn().mockResolvedValue("success");

      for (let i = 0; i < 2; i++) {
        try {
          await circuitBreaker.execute(successFn);
        } catch {
          // Expected
        }
      }

      // Should be closed
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it("reopens circuit if failure occurs in half-open", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open state
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Failure in half-open state
      try {
        await circuitBreaker.execute(mockFn);
      } catch {
        // Expected
      }

      // Should be open again
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);
    });
  });

  describe("State Transitions", () => {
    it("transitions CLOSED → OPEN → HALF_OPEN → CLOSED", async () => {
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);

      // Trigger open
      const failFn = vi.fn().mockRejectedValue(new Error("fail"));
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failFn);
        } catch {
          // Expected
        }
      }
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Trigger half-open
      const successFn = vi.fn().mockResolvedValue("success");
      try {
        await circuitBreaker.execute(successFn);
      } catch {
        // Expected
      }

      // Should be half-open or closed
      const state = circuitBreaker.getState();
      expect([
        CircuitBreakerState.HALF_OPEN,
        CircuitBreakerState.CLOSED,
      ]).toContain(state);
    });
  });

  describe("Threshold Configuration", () => {
    it("respects custom failure threshold", async () => {
      const customBreaker = new CircuitBreaker({
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 1000,
      });

      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Should not open until 5 failures
      for (let i = 0; i < 4; i++) {
        try {
          await customBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      expect(customBreaker.getState()).toBe(CircuitBreakerState.CLOSED);

      // 5th failure should open
      try {
        await customBreaker.execute(mockFn);
      } catch {
        // Expected
      }

      expect(customBreaker.getState()).toBe(CircuitBreakerState.OPEN);
    });

    it("respects custom success threshold", async () => {
      const customBreaker = new CircuitBreaker({
        failureThreshold: 2,
        successThreshold: 3,
        timeout: 1000,
      });

      const failFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open
      for (let i = 0; i < 2; i++) {
        try {
          await customBreaker.execute(failFn);
        } catch {
          // Expected
        }
      }

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Need 3 successes to close
      const successFn = vi.fn().mockResolvedValue("success");

      for (let i = 0; i < 2; i++) {
        try {
          await customBreaker.execute(successFn);
        } catch {
          // Expected
        }
      }

      // Should still be half-open
      expect(customBreaker.getState()).toBe(CircuitBreakerState.HALF_OPEN);

      // 3rd success should close
      try {
        await customBreaker.execute(successFn);
      } catch {
        // Expected
      }

      expect(customBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it("respects custom timeout", async () => {
      const customBreaker = new CircuitBreaker({
        failureThreshold: 1,
        successThreshold: 1,
        timeout: 500, // 500ms timeout
      });

      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      // Trigger open
      try {
        await customBreaker.execute(mockFn);
      } catch {
        // Expected
      }

      expect(customBreaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Should transition to half-open
      const successFn = vi.fn().mockResolvedValue("success");
      try {
        await customBreaker.execute(successFn);
      } catch {
        // Expected
      }

      // Should be half-open or closed
      const state = customBreaker.getState();
      expect([
        CircuitBreakerState.HALF_OPEN,
        CircuitBreakerState.CLOSED,
      ]).toContain(state);
    });
  });

  describe("Metrics & Monitoring", () => {
    it("tracks failure count", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      for (let i = 0; i < 2; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      // Failure count should be tracked (verified by state)
      expect(circuitBreaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it("tracks state transitions", async () => {
      const states: CircuitBreakerState[] = [];

      states.push(circuitBreaker.getState());

      const mockFn = vi.fn().mockRejectedValue(new Error("fail"));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockFn);
        } catch {
          // Expected
        }
      }

      states.push(circuitBreaker.getState());

      expect(states).toEqual([
        CircuitBreakerState.CLOSED,
        CircuitBreakerState.OPEN,
      ]);
    });
  });
});
