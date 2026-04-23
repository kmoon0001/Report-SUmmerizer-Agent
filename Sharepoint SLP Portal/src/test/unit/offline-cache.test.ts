import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  OfflineCache,
  OfflineModeIndicator,
  setupOnlineStatusListener,
} from "../../utils/offline";

// Mock the Cache API
const mockCache = {
  put: vi.fn().mockResolvedValue(undefined),
  match: vi.fn().mockResolvedValue(new Response("cached")),
};

const mockCaches = {
  open: vi.fn().mockResolvedValue(mockCache),
  delete: vi.fn().mockResolvedValue(true),
  keys: vi.fn().mockResolvedValue(["cache1", "cache2"]),
};

Object.defineProperty(global, "caches", {
  value: mockCaches,
  writable: true,
});

describe("OfflineCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCaches.open.mockResolvedValue(mockCache);
    mockCaches.delete.mockResolvedValue(true);
    mockCaches.keys.mockResolvedValue(["cache1", "cache2"]);
    mockCache.match.mockResolvedValue(new Response("cached"));
  });

  it("openCache returns a cache", async () => {
    const cache = await OfflineCache.openCache("test-cache");
    expect(mockCaches.open).toHaveBeenCalledWith("test-cache");
    expect(cache).toBe(mockCache);
  });

  it("openCache returns null on error", async () => {
    mockCaches.open.mockRejectedValueOnce(new Error("fail"));
    const cache = await OfflineCache.openCache("test-cache");
    expect(cache).toBeNull();
  });

  it("cacheResponse puts response in cache", async () => {
    const req = new Request("https://example.com/api");
    const res = new Response("data");
    await OfflineCache.cacheResponse("test-cache", req, res);
    expect(mockCache.put).toHaveBeenCalled();
  });

  it("cacheResponse handles error gracefully", async () => {
    mockCaches.open.mockRejectedValueOnce(new Error("fail"));
    const req = new Request("https://example.com/api");
    const res = new Response("data");
    await expect(
      OfflineCache.cacheResponse("test-cache", req, res),
    ).resolves.toBeUndefined();
  });

  it("getCachedResponse returns cached response", async () => {
    const req = new Request("https://example.com/api");
    const result = await OfflineCache.getCachedResponse("test-cache", req);
    expect(result).toBeDefined();
  });

  it("getCachedResponse returns undefined on error", async () => {
    mockCaches.open.mockRejectedValueOnce(new Error("fail"));
    const req = new Request("https://example.com/api");
    const result = await OfflineCache.getCachedResponse("test-cache", req);
    expect(result).toBeUndefined();
  });

  it("deleteCache deletes the cache", async () => {
    const result = await OfflineCache.deleteCache("test-cache");
    expect(mockCaches.delete).toHaveBeenCalledWith("test-cache");
    expect(result).toBe(true);
  });

  it("deleteCache returns false on error", async () => {
    mockCaches.delete.mockRejectedValueOnce(new Error("fail"));
    const result = await OfflineCache.deleteCache("test-cache");
    expect(result).toBe(false);
  });

  it("getCacheNames returns array of names", async () => {
    const names = await OfflineCache.getCacheNames();
    expect(names).toEqual(["cache1", "cache2"]);
  });

  it("getCacheNames returns empty array on error", async () => {
    mockCaches.keys.mockRejectedValueOnce(new Error("fail"));
    const names = await OfflineCache.getCacheNames();
    expect(names).toEqual([]);
  });

  it("clearAllCaches deletes all caches", async () => {
    await OfflineCache.clearAllCaches();
    expect(mockCaches.delete).toHaveBeenCalledTimes(2);
  });
});

describe("OfflineModeIndicator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
  });

  it("show() creates indicator element", () => {
    const indicator = new OfflineModeIndicator();
    indicator.show();
    expect(document.getElementById("offline-indicator")).toBeTruthy();
    indicator.hide();
  });

  it("show() does not create duplicate elements", () => {
    const indicator = new OfflineModeIndicator();
    indicator.show();
    indicator.show(); // second call should be no-op
    const elements = document.querySelectorAll("#offline-indicator");
    expect(elements.length).toBe(1);
    indicator.hide();
  });

  it("hide() removes indicator element", () => {
    const indicator = new OfflineModeIndicator();
    indicator.show();
    indicator.hide();
    expect(document.getElementById("offline-indicator")).toBeNull();
  });

  it("hide() is safe to call when not shown", () => {
    const indicator = new OfflineModeIndicator();
    expect(() => indicator.hide()).not.toThrow();
  });

  it("indicator is hidden when online", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    const indicator = new OfflineModeIndicator();
    indicator.show();
    const el = document.getElementById("offline-indicator");
    expect(el?.style.display).toBe("none");
    indicator.hide();
  });

  it("indicator is visible when offline", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const indicator = new OfflineModeIndicator();
    indicator.show();
    const el = document.getElementById("offline-indicator");
    expect(el?.style.display).toBe("block");
    indicator.hide();
  });
});

describe("setupOnlineStatusListener", () => {
  it("calls callback with true on online event", () => {
    const cb = vi.fn();
    const cleanup = setupOnlineStatusListener(cb);
    window.dispatchEvent(new Event("online"));
    expect(cb).toHaveBeenCalledWith(true);
    cleanup();
  });

  it("calls callback with false on offline event", () => {
    const cb = vi.fn();
    const cleanup = setupOnlineStatusListener(cb);
    window.dispatchEvent(new Event("offline"));
    expect(cb).toHaveBeenCalledWith(false);
    cleanup();
  });

  it("cleanup removes event listeners", () => {
    const cb = vi.fn();
    const cleanup = setupOnlineStatusListener(cb);
    cleanup();
    window.dispatchEvent(new Event("online"));
    expect(cb).not.toHaveBeenCalled();
  });
});
