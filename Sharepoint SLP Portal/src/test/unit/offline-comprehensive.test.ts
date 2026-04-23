import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  supportsServiceWorkers,
  isOnline,
  registerServiceWorker,
  unregisterServiceWorker,
  getServiceWorkerRegistrations,
  isPWAInstalled,
  OfflineStorage,
  SyncManager,
} from "../../utils/offline";

// Mock navigator
const mockServiceWorker = {
  register: vi.fn(),
  getRegistrations: vi.fn(),
};

Object.defineProperty(navigator, "serviceWorker", {
  value: mockServiceWorker,
  writable: true,
});

Object.defineProperty(navigator, "onLine", {
  writable: true,
  value: true,
});

describe("offline utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (navigator as any).onLine = true;
  });

  describe("supportsServiceWorkers", () => {
    it("returns true when service workers are supported", () => {
      expect(supportsServiceWorkers()).toBe(true);
    });
  });

  describe("isOnline", () => {
    it("returns true when online", () => {
      (navigator as any).onLine = true;
      expect(isOnline()).toBe(true);
    });

    it("returns false when offline", () => {
      (navigator as any).onLine = false;
      expect(isOnline()).toBe(false);
    });
  });

  describe("registerServiceWorker", () => {
    it("registers service worker successfully", async () => {
      const mockReg = { scope: "/" };
      mockServiceWorker.register.mockResolvedValue(mockReg);

      const result = await registerServiceWorker("/sw.js");
      expect(mockServiceWorker.register).toHaveBeenCalledWith("/sw.js");
      expect(result).toEqual(mockReg);
    });

    it("returns null on registration error", async () => {
      mockServiceWorker.register.mockRejectedValue(
        new Error("Registration failed"),
      );
      const result = await registerServiceWorker("/sw.js");
      expect(result).toBeNull();
    });

    it("returns null when service workers not supported", async () => {
      const originalSW = navigator.serviceWorker;
      Object.defineProperty(navigator, "serviceWorker", { value: undefined });
      const result = await registerServiceWorker("/sw.js");
      expect(result).toBeNull();
      Object.defineProperty(navigator, "serviceWorker", { value: originalSW });
    });
  });

  describe("unregisterServiceWorker", () => {
    it("unregisters all service workers", async () => {
      const mockReg1 = { unregister: vi.fn().mockResolvedValue(true) };
      const mockReg2 = { unregister: vi.fn().mockResolvedValue(true) };
      mockServiceWorker.getRegistrations.mockResolvedValue([
        mockReg1,
        mockReg2,
      ]);

      const result = await unregisterServiceWorker();
      expect(mockReg1.unregister).toHaveBeenCalled();
      expect(mockReg2.unregister).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("returns false on error", async () => {
      mockServiceWorker.getRegistrations.mockRejectedValue(new Error("Failed"));
      const result = await unregisterServiceWorker();
      expect(result).toBe(false);
    });
  });

  describe("getServiceWorkerRegistrations", () => {
    it("returns array of registrations", async () => {
      const mockRegs = [{ scope: "/" }, { scope: "/app" }];
      mockServiceWorker.getRegistrations.mockResolvedValue(mockRegs);

      const result = await getServiceWorkerRegistrations();
      expect(result).toEqual(mockRegs);
    });

    it("returns empty array on error", async () => {
      mockServiceWorker.getRegistrations.mockRejectedValue(new Error("Failed"));
      const result = await getServiceWorkerRegistrations();
      expect(result).toEqual([]);
    });
  });

  describe("isPWAInstalled", () => {
    it("returns true when PWA is installed", () => {
      const mockMatchMedia = vi.fn(() => ({ matches: true }));
      window.matchMedia = mockMatchMedia;
      expect(isPWAInstalled()).toBe(true);
    });

    it("returns false when PWA is not installed", () => {
      const mockMatchMedia = vi.fn(() => ({ matches: false }));
      window.matchMedia = mockMatchMedia;
      expect(isPWAInstalled()).toBe(false);
    });

    it("checks standalone mode", () => {
      (navigator as any).standalone = true;
      expect(isPWAInstalled()).toBe(true);
    });
  });

  describe("OfflineStorage", () => {
    it("saveDraft stores data with metadata", () => {
      OfflineStorage.saveDraft("test-key", { content: "test" });
      const stored = localStorage.getItem("draft_test-key");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.data).toEqual({ content: "test" });
      expect(parsed.synced).toBe(false);
      expect(parsed.timestamp).toBeTruthy();
    });

    it("getDraft retrieves stored data", () => {
      OfflineStorage.saveDraft("test-key", { content: "test" });
      const result = OfflineStorage.getDraft("test-key");
      expect(result).toEqual({ content: "test" });
    });

    it("getDraft returns null for missing key", () => {
      const result = OfflineStorage.getDraft("nonexistent");
      expect(result).toBeNull();
    });

    it("getAllDrafts returns all drafts", () => {
      OfflineStorage.saveDraft("key1", { data: 1 });
      OfflineStorage.saveDraft("key2", { data: 2 });
      const all = OfflineStorage.getAllDrafts();
      expect(all["key1"]).toEqual({ data: 1 });
      expect(all["key2"]).toEqual({ data: 2 });
    });

    it("deleteDraft removes draft", () => {
      OfflineStorage.saveDraft("test-key", { content: "test" });
      OfflineStorage.deleteDraft("test-key");
      expect(OfflineStorage.getDraft("test-key")).toBeNull();
    });

    it("markSynced updates synced flag", () => {
      OfflineStorage.saveDraft("test-key", { content: "test" });
      OfflineStorage.markSynced("test-key");
      const stored = JSON.parse(localStorage.getItem("draft_test-key")!);
      expect(stored.synced).toBe(true);
    });

    it("getUnsyncedDrafts returns only unsynced", () => {
      OfflineStorage.saveDraft("key1", { data: 1 });
      OfflineStorage.saveDraft("key2", { data: 2 });
      OfflineStorage.markSynced("key1");
      const unsynced = OfflineStorage.getUnsyncedDrafts();
      expect(unsynced["key1"]).toBeUndefined();
      expect(unsynced["key2"]).toEqual({ data: 2 });
    });

    it("clearAll removes all drafts", () => {
      OfflineStorage.saveDraft("key1", { data: 1 });
      OfflineStorage.saveDraft("key2", { data: 2 });
      OfflineStorage.clearAll();
      expect(OfflineStorage.getAllDrafts()).toEqual({});
    });

    it("handles localStorage errors gracefully", () => {
      const spy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });
      expect(() =>
        OfflineStorage.saveDraft("key", { data: "test" }),
      ).not.toThrow();
      spy.mockRestore();
    });
  });

  describe("SyncManager", () => {
    it("addToQueue adds item to queue", () => {
      const manager = new SyncManager();
      manager.addToQueue("key1", { data: "test" });
      const queue = manager.getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].key).toBe("key1");
    });

    it("syncAll calls sync function for each item", async () => {
      const manager = new SyncManager();
      const syncFn = vi.fn().mockResolvedValue(true);
      (navigator as any).onLine = true;

      OfflineStorage.saveDraft("key1", { data: 1 });
      OfflineStorage.saveDraft("key2", { data: 2 });

      await manager.syncAll(syncFn);
      expect(syncFn).toHaveBeenCalledTimes(2);
    });

    it("syncAll marks successful syncs", async () => {
      const manager = new SyncManager();
      const syncFn = vi.fn().mockResolvedValue(true);
      (navigator as any).onLine = true;

      OfflineStorage.saveDraft("key1", { data: 1 });
      await manager.syncAll(syncFn);

      const stored = JSON.parse(localStorage.getItem("draft_key1")!);
      expect(stored.synced).toBe(true);
    });

    it("syncAll skips when offline", async () => {
      const manager = new SyncManager();
      const syncFn = vi.fn();
      (navigator as any).onLine = false;

      OfflineStorage.saveDraft("key1", { data: 1 });
      await manager.syncAll(syncFn);

      expect(syncFn).not.toHaveBeenCalled();
    });

    it("syncAll skips when already syncing", async () => {
      const manager = new SyncManager();
      const syncFn = vi.fn(async () => {
        await new Promise((r) => setTimeout(r, 100));
        return true;
      });
      (navigator as any).onLine = true;

      OfflineStorage.saveDraft("key1", { data: 1 });

      const p1 = manager.syncAll(syncFn);
      const p2 = manager.syncAll(syncFn);

      await Promise.all([p1, p2]);
      expect(syncFn).toHaveBeenCalledTimes(1);
    });

    it("getQueue returns copy of queue", () => {
      const manager = new SyncManager();
      manager.addToQueue("key1", { data: "test" });
      const queue1 = manager.getQueue();
      const queue2 = manager.getQueue();
      expect(queue1).not.toBe(queue2);
      expect(queue1).toEqual(queue2);
    });

    it("clearQueue empties the queue", () => {
      const manager = new SyncManager();
      manager.addToQueue("key1", { data: "test" });
      manager.clearQueue();
      expect(manager.getQueue()).toHaveLength(0);
    });
  });
});
