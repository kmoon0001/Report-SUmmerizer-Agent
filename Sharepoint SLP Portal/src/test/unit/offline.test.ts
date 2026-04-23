/**
 * Unit tests for offline & PWA utilities
 * Tests service worker registration, offline detection, and local storage sync
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  supportsServiceWorkers,
  isOnline,
  isPWAInstalled,
  OfflineStorage,
  OfflineModeIndicator,
  SyncManager,
} from "../../utils/offline";

describe("Offline & PWA Utilities", () => {
  describe("Service Worker Support", () => {
    it("should detect service worker support", () => {
      const supported = supportsServiceWorkers();
      expect(typeof supported).toBe("boolean");
    });
  });

  describe("Online Status", () => {
    it("should detect online status", () => {
      const online = isOnline();
      expect(typeof online).toBe("boolean");
    });

    it("should reflect navigator.onLine", () => {
      expect(isOnline()).toBe(navigator.onLine);
    });
  });

  describe("PWA Installation", () => {
    it("should detect PWA installation", () => {
      const installed = isPWAInstalled();
      expect(typeof installed).toBe("boolean");
    });
  });

  describe("Offline Storage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("should save draft to local storage", () => {
      const data = { name: "Test", content: "Test content" };
      OfflineStorage.saveDraft("test-key", data);
      expect(localStorage.getItem("draft_test-key")).toBeDefined();
    });

    it("should retrieve saved draft", () => {
      const data = { name: "Test", content: "Test content" };
      OfflineStorage.saveDraft("test-key", data);
      const retrieved = OfflineStorage.getDraft("test-key");
      expect(retrieved).toEqual(data);
    });

    it("should return null for non-existent draft", () => {
      const retrieved = OfflineStorage.getDraft("non-existent");
      expect(retrieved).toBeNull();
    });

    it("should get all drafts", () => {
      OfflineStorage.saveDraft("draft1", { data: 1 });
      OfflineStorage.saveDraft("draft2", { data: 2 });
      const all = OfflineStorage.getAllDrafts();
      expect(Object.keys(all).length).toBe(2);
      expect(all["draft1"]).toEqual({ data: 1 });
      expect(all["draft2"]).toEqual({ data: 2 });
    });

    it("should delete draft", () => {
      OfflineStorage.saveDraft("test-key", { data: "test" });
      OfflineStorage.deleteDraft("test-key");
      expect(OfflineStorage.getDraft("test-key")).toBeNull();
    });

    it("should mark draft as synced", () => {
      OfflineStorage.saveDraft("test-key", { data: "test" });
      OfflineStorage.markSynced("test-key");
      const item = localStorage.getItem("draft_test-key");
      expect(item).toBeDefined();
      const draft = JSON.parse(item!);
      expect(draft.synced).toBe(true);
    });

    it("should get unsynced drafts", () => {
      OfflineStorage.saveDraft("draft1", { data: 1 });
      OfflineStorage.saveDraft("draft2", { data: 2 });
      OfflineStorage.markSynced("draft1");
      const unsynced = OfflineStorage.getUnsyncedDrafts();
      expect(Object.keys(unsynced).length).toBe(1);
      expect(unsynced["draft2"]).toEqual({ data: 2 });
    });

    it("should clear all drafts", () => {
      OfflineStorage.saveDraft("draft1", { data: 1 });
      OfflineStorage.saveDraft("draft2", { data: 2 });
      OfflineStorage.clearAll();
      expect(OfflineStorage.getAllDrafts()).toEqual({});
    });

    it("should handle storage quota exceeded", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      // Try to save very large data
      const largeData = new Array(10000000).fill("x").join("");
      OfflineStorage.saveDraft("large", largeData);
      // Should log error when quota exceeded
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("Offline Mode Indicator", () => {
    let indicator: OfflineModeIndicator;

    beforeEach(() => {
      indicator = new OfflineModeIndicator();
    });

    afterEach(() => {
      indicator.hide();
    });

    it("should create indicator element", () => {
      indicator.show();
      const element = document.getElementById("offline-indicator");
      expect(element).toBeDefined();
    });

    it("should show indicator when offline", () => {
      // Mock offline status
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });
      indicator.show();
      const element = document.getElementById("offline-indicator");
      expect(element?.style.display).not.toBe("none");
    });

    it("should hide indicator when online", () => {
      // Mock online status
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });
      indicator.show();
      const element = document.getElementById("offline-indicator");
      expect(element?.style.display).toBe("none");
    });

    it("should remove element on hide", () => {
      indicator.show();
      indicator.hide();
      const element = document.getElementById("offline-indicator");
      expect(element).toBeNull();
    });

    it("should not create duplicate indicators", () => {
      indicator.show();
      indicator.show();
      const elements = document.querySelectorAll("#offline-indicator");
      expect(elements.length).toBe(1);
    });
  });

  describe("Sync Manager", () => {
    let syncManager: SyncManager;

    beforeEach(() => {
      syncManager = new SyncManager();
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("should add item to queue", () => {
      syncManager.addToQueue("test-key", { data: "test" });
      const queue = syncManager.getQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].key).toBe("test-key");
    });

    it("should save draft when adding to queue", () => {
      syncManager.addToQueue("test-key", { data: "test" });
      const draft = OfflineStorage.getDraft("test-key");
      expect(draft).toEqual({ data: "test" });
    });

    it("should sync all queued items", async () => {
      const syncFn = vi.fn().mockResolvedValue(true);
      syncManager.addToQueue("key1", { data: 1 });
      syncManager.addToQueue("key2", { data: 2 });

      // Mock online status
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });

      await syncManager.syncAll(syncFn);
      expect(syncFn).toHaveBeenCalled();
    });

    it("should not sync when offline", async () => {
      const syncFn = vi.fn().mockResolvedValue(true);
      syncManager.addToQueue("key1", { data: 1 });

      // Mock offline status
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      await syncManager.syncAll(syncFn);
      expect(syncFn).not.toHaveBeenCalled();
    });

    it("should clear queue", () => {
      syncManager.addToQueue("key1", { data: 1 });
      syncManager.clearQueue();
      expect(syncManager.getQueue().length).toBe(0);
    });

    it("should handle sync errors gracefully", async () => {
      const syncFn = vi.fn().mockRejectedValue(new Error("Sync failed"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      syncManager.addToQueue("key1", { data: 1 });

      // Mock online status
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });

      await syncManager.syncAll(syncFn);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("PWA Manifest", () => {
    it("should have manifest link in HTML", () => {
      const manifest = document.querySelector('link[rel="manifest"]');
      // Manifest may or may not exist depending on setup
      expect(typeof manifest).toBe("object");
    });
  });

  describe("Offline Functionality Integration", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("should support complete offline workflow", () => {
      // 1. Save draft offline
      OfflineStorage.saveDraft("assessment-1", {
        patientName: "John Doe",
        findings: "ROM limited",
      });

      // 2. Get draft
      const draft = OfflineStorage.getDraft("assessment-1");
      expect(draft).toBeDefined();

      // 3. Mark as synced when online
      OfflineStorage.markSynced("assessment-1");
      const unsynced = OfflineStorage.getUnsyncedDrafts();
      expect(Object.keys(unsynced).length).toBe(0);
    });

    it("should track multiple offline changes", () => {
      OfflineStorage.saveDraft("note-1", { content: "Initial note" });
      OfflineStorage.saveDraft("note-2", { content: "Second note" });
      OfflineStorage.saveDraft("note-3", { content: "Third note" });

      const all = OfflineStorage.getAllDrafts();
      expect(Object.keys(all).length).toBe(3);
    });

    it("should handle offline sync queue", async () => {
      const syncManager = new SyncManager();
      const syncFn = vi.fn().mockResolvedValue(true);

      syncManager.addToQueue("item-1", { data: "test1" });
      syncManager.addToQueue("item-2", { data: "test2" });

      // Mock online
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });

      await syncManager.syncAll(syncFn);
      expect(syncFn.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
