import { describe, it, expect, vi, beforeEach } from "vitest";
import { persistenceService } from "../../services/persistence-service";

vi.mock("../../utils/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

vi.mock("../../utils/sanitizer", () => ({
  sanitizeChatContent: (c: string) => c,
}));

const mockStore = {
  put: vi.fn(),
  getAll: vi.fn(),
  delete: vi.fn(),
};

let txOncomplete: (() => void) | null = null;
let txOnerror: (() => void) | null = null;

const mockTransaction = {
  objectStore: vi.fn(() => mockStore),
  get oncomplete() {
    return txOncomplete;
  },
  set oncomplete(fn: any) {
    txOncomplete = fn;
  },
  get onerror() {
    return txOnerror;
  },
  set onerror(fn: any) {
    txOnerror = fn;
  },
  error: null,
};

const mockDb = {
  objectStoreNames: { contains: vi.fn(() => true) },
  transaction: vi.fn(() => mockTransaction),
  createObjectStore: vi.fn(),
};

let reqOnsuccess: ((e: any) => void) | null = null;
let reqOnerror: (() => void) | null = null;

const mockRequest = {
  get onsuccess() {
    return reqOnsuccess;
  },
  set onsuccess(fn: any) {
    reqOnsuccess = fn;
  },
  get onerror() {
    return reqOnerror;
  },
  set onerror(fn: any) {
    reqOnerror = fn;
  },
  onupgradeneeded: null as any,
  result: mockDb,
  error: null,
};

vi.stubGlobal("indexedDB", { open: vi.fn(() => mockRequest) });

describe("persistenceService — IndexedDB methods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reqOnsuccess = null;
    reqOnerror = null;
    txOncomplete = null;
    txOnerror = null;
    mockDb.objectStoreNames.contains.mockReturnValue(true);
  });

  describe("saveGeneratedAsset", () => {
    it("saves asset via IndexedDB", async () => {
      const asset = {
        id: "asset-1",
        type: "image" as const,
        data: "base64data",
        date: "2024-01-01",
      };
      const promise = persistenceService.saveGeneratedAsset(asset);
      reqOnsuccess?.({ target: { result: mockDb } });
      txOncomplete?.();
      await promise;
      expect(mockStore.put).toHaveBeenCalledWith(asset);
    });

    it("rejects on IDB open error", async () => {
      const asset = {
        id: "asset-1",
        type: "image" as const,
        data: "data",
        date: "2024-01-01",
      };
      const promise = persistenceService.saveGeneratedAsset(asset);
      reqOnerror?.();
      await expect(promise).rejects.toBeDefined();
    });

    it("rejects on transaction error", async () => {
      const asset = {
        id: "asset-1",
        type: "image" as const,
        data: "data",
        date: "2024-01-01",
      };
      const promise = persistenceService.saveGeneratedAsset(asset);
      reqOnsuccess?.({ target: { result: mockDb } });
      txOnerror?.();
      await expect(promise).rejects.toBeDefined();
    });
  });

  describe("getGeneratedAssets", () => {
    it("returns assets from IndexedDB", async () => {
      const assets = [
        { id: "a1", type: "image", data: "data", date: "2024-01-01" },
      ];
      let getAllSuccess: (() => void) | null = null;
      const getAllReq = {
        get onsuccess() {
          return getAllSuccess;
        },
        set onsuccess(fn: any) {
          getAllSuccess = fn;
        },
        onerror: null,
        result: assets,
      };
      mockStore.getAll.mockReturnValue(getAllReq);

      const promise = persistenceService.getGeneratedAssets();
      reqOnsuccess?.({ target: { result: mockDb } });
      getAllSuccess?.();

      const result = await promise;
      expect(result).toEqual(assets);
    });

    it("returns empty array when store does not exist", async () => {
      mockDb.objectStoreNames.contains.mockReturnValue(false);
      const promise = persistenceService.getGeneratedAssets();
      reqOnsuccess?.({ target: { result: mockDb } });
      const result = await promise;
      expect(result).toEqual([]);
    });

    it("rejects on IDB open error", async () => {
      const promise = persistenceService.getGeneratedAssets();
      reqOnerror?.();
      await expect(promise).rejects.toBeDefined();
    });
  });

  describe("deleteGeneratedAsset", () => {
    it("deletes asset from IndexedDB", async () => {
      let delSuccess: (() => void) | null = null;
      const deleteReq = {
        get onsuccess() {
          return delSuccess;
        },
        set onsuccess(fn: any) {
          delSuccess = fn;
        },
        onerror: null,
      };
      mockStore.delete.mockReturnValue(deleteReq);

      const promise = persistenceService.deleteGeneratedAsset("asset-1");
      reqOnsuccess?.({ target: { result: mockDb } });
      delSuccess?.();

      await promise;
      expect(mockStore.delete).toHaveBeenCalledWith("asset-1");
    });

    it("resolves when store does not exist", async () => {
      mockDb.objectStoreNames.contains.mockReturnValue(false);
      const promise = persistenceService.deleteGeneratedAsset("asset-1");
      reqOnsuccess?.({ target: { result: mockDb } });
      await expect(promise).resolves.toBeUndefined();
    });

    it("rejects on delete error", async () => {
      let delOnerror: (() => void) | null = null;
      const deleteReq = {
        onsuccess: null,
        get onerror() {
          return delOnerror;
        },
        set onerror(fn: any) {
          delOnerror = fn;
        },
        error: new Error("delete failed"),
      };
      mockStore.delete.mockReturnValue(deleteReq);

      const promise = persistenceService.deleteGeneratedAsset("asset-1");
      reqOnsuccess?.({ target: { result: mockDb } });
      delOnerror?.();

      // The promise rejects with deleteRequest.error
      await expect(promise).rejects.toEqual(deleteReq.error);
    });
  });
});
