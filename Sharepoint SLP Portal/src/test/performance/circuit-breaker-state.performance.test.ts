import { describe, it, expect, vi } from "vitest";
import { CircuitBreaker } from "../../utils/reliability";

describe("CircuitBreaker state machine", () => {
  it("recovers from OPEN to CLOSED after successful call in HALF_OPEN", async () => {
    vi.useFakeTimers();
    const cb = new CircuitBreaker(2, 50);
    const fail = vi.fn().mockRejectedValue(new Error("down"));
    const ok = vi.fn().mockResolvedValue("ok");

    await expect(cb.execute(fail)).rejects.toThrow("down");
    await expect(cb.execute(fail)).rejects.toThrow();

    await expect(cb.execute(ok)).rejects.toThrow(/Circuit is OPEN/i);

    vi.advanceTimersByTime(60);

    const result = await cb.execute(ok);
    expect(result).toBe("ok");
    vi.useRealTimers();
  });

  it("exposes expected states after failures", async () => {
    const cb = new CircuitBreaker(1, 10000);
    const boom = () => Promise.reject(new Error("x"));
    await expect(cb.execute(boom)).rejects.toThrow("x");
    await expect(cb.execute(boom)).rejects.toThrow(/Circuit is OPEN/i);
  });
});
