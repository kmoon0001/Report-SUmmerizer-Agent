/**
 * Unit Tests: Performance Optimizer
 * Requirements: Task 28 - Performance optimization
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  memoize,
  debounce,
  throttle,
  cacheResult,
  measurePerformance,
  measurePerformanceSync,
  recordMetric,
  getPerformanceMetrics,
  getPerformanceStats,
  clearPerformanceMetrics,
  batch,
  clearGlobalCache,
  getCacheStats,
} from "../../utils/performance-optimizer";

describe("Performance Optimizer", () => {
  beforeEach(() => {
    clearPerformanceMetrics();
    clearGlobalCache();
  });

  afterEach(() => {
    clearPerformanceMetrics();
    clearGlobalCache();
  });

  // ── Memoization ────────────────────────────────────────────────────────
  describe("memoize", () => {
    it("caches function results", () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("handles different arguments", () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(10)).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("respects TTL", async () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn, { ttl: 50 });

      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("respects max size", () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn, { maxSize: 2 });

      memoized(1);
      memoized(2);
      memoized(3); // Should evict first entry
      memoized(1); // Should recalculate

      expect(fn).toHaveBeenCalledTimes(4);
    });
  });

  // ── Debounce ───────────────────────────────────────────────────────────
  describe("debounce", () => {
    it("delays function execution", async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("cancels previous calls", async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      debounced();
      debounced();

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("passes arguments to function", async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced("test", 123);

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledWith("test", 123);
    });
  });

  // ── Throttle ───────────────────────────────────────────────────────────
  describe("throttle", () => {
    it("limits function execution frequency", async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 50);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve, 60));
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("executes immediately on first call", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 50);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  // ── Cache Result ───────────────────────────────────────────────────────
  describe("cacheResult", () => {
    it("caches function results globally", () => {
      const fn = vi.fn((x: number) => x * 2);
      Object.defineProperty(fn, "name", { value: "testFn", writable: true });
      const cached = cacheResult(fn);

      expect(cached(5)).toBe(10);
      expect(cached(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("respects TTL", async () => {
      const fn = vi.fn((x: number) => x * 2);
      Object.defineProperty(fn, "name", { value: "testFn", writable: true });
      const cached = cacheResult(fn, 50);

      expect(cached(5)).toBe(10);
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(cached(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  // ── Performance Measurement ────────────────────────────────────────────
  describe("measurePerformance", () => {
    it("measures async function execution time", async () => {
      const result = await measurePerformance("test", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "done";
      });

      expect(result).toBe("done");
      const metrics = getPerformanceMetrics({ name: "test" });
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]!.duration).toBeGreaterThanOrEqual(50);
    });

    it("records metadata", async () => {
      await measurePerformance("test", async () => "done", { userId: "123" });
      const metrics = getPerformanceMetrics({ name: "test" });
      expect(metrics[0]!.metadata?.["userId"]).toBe("123");
    });

    it("records errors", async () => {
      try {
        await measurePerformance("test", async () => {
          throw new Error("Test error");
        });
      } catch (_e) {
        // Expected
      }

      const metrics = getPerformanceMetrics({ name: "test" });
      expect(metrics[0]!.metadata?.["error"]).toBe(true);
    });
  });

  // ── Synchronous Performance Measurement ────────────────────────────────
  describe("measurePerformanceSync", () => {
    it("measures sync function execution time", () => {
      const result = measurePerformanceSync("test", () => {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(result).toBeGreaterThan(0);
      const metrics = getPerformanceMetrics({ name: "test" });
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]!.duration).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Performance Metrics ────────────────────────────────────────────────
  describe("Performance Metrics", () => {
    it("records metrics", () => {
      recordMetric("test", 100);
      recordMetric("test", 200);
      const metrics = getPerformanceMetrics({ name: "test" });
      expect(metrics).toHaveLength(2);
    });

    it("calculates statistics", () => {
      recordMetric("test", 100);
      recordMetric("test", 200);
      recordMetric("test", 300);

      const stats = getPerformanceStats("test");
      expect(stats.count).toBe(3);
      expect(stats.avgDuration).toBe(200);
      expect(stats.minDuration).toBe(100);
      expect(stats.maxDuration).toBe(300);
      expect(stats.totalDuration).toBe(600);
    });

    it("clears metrics", () => {
      recordMetric("test", 100);
      expect(getPerformanceMetrics()).toHaveLength(1);
      clearPerformanceMetrics();
      expect(getPerformanceMetrics()).toHaveLength(0);
    });
  });

  // ── Batch Processing ───────────────────────────────────────────────────
  describe("batch", () => {
    it("processes items in batches", async () => {
      const items = [1, 2, 3, 4, 5];
      const processor = vi.fn(async (batch: number[]) =>
        batch.map((x) => x * 2),
      );

      const results = await batch(items, 2, processor);

      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(processor).toHaveBeenCalledTimes(3);
    });

    it("handles empty items", async () => {
      const processor = vi.fn(async (batch: number[]) =>
        batch.map((x) => x * 2),
      );
      const results = await batch([], 2, processor);

      expect(results).toEqual([]);
      expect(processor).not.toHaveBeenCalled();
    });

    it("respects batch size", async () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      const processor = vi.fn(async (batch: number[]) => {
        expect(batch.length).toBeLessThanOrEqual(3);
        return batch;
      });

      await batch(items, 3, processor);
      expect(processor).toHaveBeenCalledTimes(3);
    });
  });

  // ── Cache Statistics ───────────────────────────────────────────────────
  describe("Cache Statistics", () => {
    it("returns cache stats", () => {
      const stats = getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.maxSize).toBe(100);
    });

    it("updates cache size", () => {
      const fn = vi.fn((x: number) => x * 2);
      Object.defineProperty(fn, "name", { value: "testFn", writable: true });
      const cached = cacheResult(fn);

      cached(1);
      cached(2);
      cached(3);

      const stats = getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
    });

    it("clears cache", () => {
      const fn = vi.fn((x: number) => x * 2);
      Object.defineProperty(fn, "name", { value: "testFn", writable: true });
      const cached = cacheResult(fn);

      cached(1);
      expect(getCacheStats().size).toBeGreaterThan(0);

      clearGlobalCache();
      expect(getCacheStats().size).toBe(0);
    });
  });

  // ── Integration Tests ──────────────────────────────────────────────────
  describe("Integration", () => {
    it("combines memoization and performance measurement", async () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      await measurePerformance("memoized", async () => {
        memoized(5);
        memoized(5);
      });

      expect(fn).toHaveBeenCalledTimes(1);
      const metrics = getPerformanceMetrics({ name: "memoized" });
      expect(metrics.length).toBeGreaterThan(0);
    });

    it("combines debounce and performance measurement", async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      debounced();
      debounced();

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});

// ── Additional coverage for uncovered functions ────────────────────────────
import {
  withCache,
  getCached,
  setCached,
  deduplicateRequest,
  lazy,
  lazy_init,
  ResourcePool,
  setPerformanceConfig,
  getPerformanceMetrics as getMetrics,
} from "../../utils/performance-optimizer";

describe("Performance Optimizer — additional coverage", () => {
  beforeEach(() => {
    clearGlobalCache();
  });

  describe("withCache", () => {
    it("caches async result", async () => {
      const fn = vi.fn().mockResolvedValue("result");
      const r1 = await withCache("wc-key", fn, 5000);
      const r2 = await withCache("wc-key", fn, 5000);
      expect(r1).toBe("result");
      expect(r2).toBe("result");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("re-fetches after TTL expires", async () => {
      const fn = vi.fn().mockResolvedValue("fresh");
      await withCache("wc-ttl", fn, 10);
      await new Promise((r) => setTimeout(r, 20));
      await withCache("wc-ttl", fn, 10);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("getCached / setCached", () => {
    it("setCached stores and getCached retrieves", () => {
      setCached("my-key", { data: 42 });
      expect(getCached("my-key")).toEqual({ data: 42 });
    });

    it("getCached returns null for missing key", () => {
      expect(getCached("nonexistent")).toBeNull();
    });

    it("getCached returns null after TTL expires", async () => {
      setCached("ttl-key", "value", 10);
      await new Promise((r) => setTimeout(r, 20));
      expect(getCached("ttl-key")).toBeNull();
    });
  });

  describe("deduplicateRequest", () => {
    it("calls fn and returns result", async () => {
      const fn = vi.fn().mockResolvedValue("dedup");
      const result = await deduplicateRequest("key", fn);
      expect(result).toBe("dedup");
    });
  });

  describe("lazy", () => {
    it("only calls fn once", async () => {
      const fn = vi.fn().mockResolvedValue("lazy-val");
      const lazyFn = lazy(fn);
      await lazyFn();
      await lazyFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("lazy_init", () => {
    it("only initializes once", () => {
      const fn = vi.fn().mockReturnValue(99);
      const init = lazy_init(fn);
      expect(init()).toBe(99);
      expect(init()).toBe(99);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("ResourcePool", () => {
    it("acquires and releases resources", () => {
      const pool = new ResourcePool(() => ({ id: Math.random() }), 3);
      const r1 = pool.acquire();
      const r2 = pool.acquire();
      expect(pool.getStats().inUse).toBe(2);
      pool.release(r1);
      expect(pool.getStats().inUse).toBe(1);
      pool.release(r2);
    });

    it("creates new resource when pool is empty", () => {
      const factory = vi.fn(() => ({}));
      const pool = new ResourcePool(factory, 1);
      pool.acquire(); // uses pre-created
      pool.acquire(); // creates new
      expect(factory.mock.calls.length).toBeGreaterThan(1);
    });

    it("getStats returns correct counts", () => {
      const pool = new ResourcePool(() => ({}), 2);
      const stats = pool.getStats();
      expect(stats.available).toBe(2);
      expect(stats.inUse).toBe(0);
    });
  });

  describe("setPerformanceConfig", () => {
    it("does not throw", () => {
      expect(() =>
        setPerformanceConfig({ enableMetrics: true, cacheTTL: 1000 }),
      ).not.toThrow();
    });
  });

  describe("getPerformanceMetrics string filter", () => {
    it("filters by string name", () => {
      clearPerformanceMetrics();
      recordMetric("alpha", 10);
      recordMetric("beta", 20);
      const filtered = getMetrics("alpha");
      expect(filtered.every((m) => m.name === "alpha")).toBe(true);
    });

    it("returns all when no filter", () => {
      clearPerformanceMetrics();
      recordMetric("x", 1);
      recordMetric("y", 2);
      expect(getMetrics()).toHaveLength(2);
    });
  });
});
