import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  supportsServiceWorkers,
  isOnline,
  isPWAInstalled,
  setupOnlineStatusListener,
  OfflineStorage,
  SyncManager,
} from "../../utils/offline";

beforeEach(() => {
  localStorage.clear();
});

describe("offline utils — browser checks", () => {
  it("supportsServiceWorkers returns boolean", () => {
    expect(typeof supportsServiceWorkers()).toBe("boolean");
  });

  it("isOnline returns boolean", () => {
    expect(typeof isOnline()).toBe("boolean");
  });

  it("isPWAInstalled returns boolean", () => {
    expect(typeof isPWAInstalled()).toBe("boolean");
  });
});

describe("setupOnlineStatusListener", () => {
  it("returns a cleanup function", () => {
    const cleanup = setupOnlineStatusListener(vi.fn());
    expect(typeof cleanup).toBe("function");
    cleanup(); // should not throw
  });

  it("calls callback when online event fires", () => {
    const cb = vi.fn();
    const cleanup = setupOnlineStatusListener(cb);
    window.dispatchEvent(new Event("online"));
    expect(cb).toHaveBeenCalledWith(true);
    cleanup();
  });

  it("calls callback when offline event fires", () => {
    const cb = vi.fn();
    const cleanup = setupOnlineStatusListener(cb);
    window.dispatchEvent(new Event("offline"));
    expect(cb).toHaveBeenCalledWith(false);
    cleanup();
  });
});

describe("OfflineStorage", () => {
  it("saves and retrieves a draft", () => {
    OfflineStorage.saveDraft("note-1", { text: "hello" });
    expect(OfflineStorage.getDraft("note-1")).toEqual({ text: "hello" });
  });

  it("returns null for missing draft", () => {
    expect(OfflineStorage.getDraft("nonexistent")).toBeNull();
  });

  it("deletes a draft", () => {
    OfflineStorage.saveDraft("note-2", { text: "bye" });
    OfflineStorage.deleteDraft("note-2");
    expect(OfflineStorage.getDraft("note-2")).toBeNull();
  });

  it("getAllDrafts returns all saved drafts", () => {
    OfflineStorage.saveDraft("a", { x: 1 });
    OfflineStorage.saveDraft("b", { x: 2 });
    const all = OfflineStorage.getAllDrafts();
    expect(Object.keys(all)).toContain("a");
    expect(Object.keys(all)).toContain("b");
  });

  it("markSynced marks draft as synced", () => {
    OfflineStorage.saveDraft("sync-me", { data: "test" });
    OfflineStorage.markSynced("sync-me");
    const unsynced = OfflineStorage.getUnsyncedDrafts();
    expect(Object.keys(unsynced)).not.toContain("sync-me");
  });

  it("getUnsyncedDrafts returns only unsynced", () => {
    OfflineStorage.saveDraft("unsynced-1", { data: "a" });
    OfflineStorage.saveDraft("synced-1", { data: "b" });
    OfflineStorage.markSynced("synced-1");
    const unsynced = OfflineStorage.getUnsyncedDrafts();
    expect(Object.keys(unsynced)).toContain("unsynced-1");
    expect(Object.keys(unsynced)).not.toContain("synced-1");
  });

  it("clearAll removes all drafts", () => {
    OfflineStorage.saveDraft("x", { v: 1 });
    OfflineStorage.saveDraft("y", { v: 2 });
    OfflineStorage.clearAll();
    expect(Object.keys(OfflineStorage.getAllDrafts())).toHaveLength(0);
  });
});

describe("SyncManager", () => {
  it("addToQueue adds items", () => {
    const sm = new SyncManager();
    sm.addToQueue("key1", { data: "test" });
    expect(sm.getQueue()).toHaveLength(1);
    expect(sm.getQueue()[0].key).toBe("key1");
  });

  it("clearQueue empties the queue", () => {
    const sm = new SyncManager();
    sm.addToQueue("key1", {});
    sm.clearQueue();
    expect(sm.getQueue()).toHaveLength(0);
  });

  it("syncAll calls syncFn for unsynced drafts", async () => {
    const sm = new SyncManager();
    OfflineStorage.saveDraft("sync-key", { val: 1 });
    const syncFn = vi.fn().mockResolvedValue(true);
    // Mock isOnline to return true
    Object.defineProperty(navigator, "onLine", {
      value: true,
      configurable: true,
    });
    await sm.syncAll(syncFn);
    expect(syncFn).toHaveBeenCalled();
  });

  it("syncAll skips when offline", async () => {
    const sm = new SyncManager();
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
    });
    const syncFn = vi.fn().mockResolvedValue(true);
    await sm.syncAll(syncFn);
    expect(syncFn).not.toHaveBeenCalled();
    // Restore
    Object.defineProperty(navigator, "onLine", {
      value: true,
      configurable: true,
    });
  });
});
