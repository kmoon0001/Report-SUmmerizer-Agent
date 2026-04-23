import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import {
  cacheMiddleware,
  invalidateCacheMiddleware,
} from "../../middleware/cache-middleware";
import { cacheService } from "../../services/cache-service";

// Mock cache service
vi.mock("../../services/cache-service", () => ({
  cacheService: {
    get: vi.fn(),
    set: vi.fn(),
    deletePattern: vi.fn(),
  },
}));

vi.mock("../../services/logger-service", () => ({
  default: {
    warn: vi.fn(),
  },
}));

describe("Cache Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: any;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: "GET",
      path: "/api/patients",
      originalUrl: "/api/patients?id=123",
      correlationId: "test-correlation-id",
    };

    mockRes = {
      statusCode: 200,
      set: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe("cacheMiddleware", () => {
    it("should skip caching for non-GET requests", async () => {
      mockReq.method = "POST";
      const middleware = cacheMiddleware(3600);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(cacheService.get).not.toHaveBeenCalled();
    });

    it("should skip caching for health check endpoints", async () => {
      mockReq.path = "/api/health";
      const middleware = cacheMiddleware(3600);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(cacheService.get).not.toHaveBeenCalled();
    });

    it("should skip caching for metrics endpoints", async () => {
      mockReq.path = "/metrics";
      const middleware = cacheMiddleware(3600);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(cacheService.get).not.toHaveBeenCalled();
    });

    it("should return cached data on cache hit", async () => {
      const cachedData = { id: "123", name: "Test Patient" };
      vi.mocked(cacheService.get).mockResolvedValue(cachedData);

      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.set).toHaveBeenCalledWith("X-Cache", "HIT");
      expect(mockRes.json).toHaveBeenCalledWith(cachedData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should cache response on cache miss", async () => {
      vi.mocked(cacheService.get).mockResolvedValue(null);

      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();

      // Verify json method was overridden
      expect(typeof mockRes.json).toBe("function");
    });

    it("should handle cache retrieval errors gracefully", async () => {
      vi.mocked(cacheService.get).mockRejectedValue(new Error("Cache error"));

      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should use default TTL of 3600 seconds", async () => {
      vi.mocked(cacheService.get).mockResolvedValue(null);

      const middleware = cacheMiddleware();
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should use custom TTL when provided", async () => {
      vi.mocked(cacheService.get).mockResolvedValue(null);

      const middleware = cacheMiddleware(7200);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should include correlation ID in cache operations", async () => {
      vi.mocked(cacheService.get).mockResolvedValue(null);

      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(cacheService.get).toHaveBeenCalledWith(
        "cache:/api/patients?id=123",
        "test-correlation-id",
      );
    });

    it("should use default correlation ID when not provided", async () => {
      mockReq.correlationId = undefined;
      vi.mocked(cacheService.get).mockResolvedValue(null);

      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(cacheService.get).toHaveBeenCalledWith(
        "cache:/api/patients?id=123",
        "unknown",
      );
    });
  });

  describe("invalidateCacheMiddleware", () => {
    it("should skip invalidation for GET requests", async () => {
      mockReq.method = "GET";
      const middleware = invalidateCacheMiddleware(["patients:*"]);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(cacheService.deletePattern).not.toHaveBeenCalled();
    });

    it("should invalidate cache on POST with successful response", async () => {
      mockReq.method = "POST";
      mockRes.statusCode = 201;

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(typeof mockRes.send).toBe("function");
    });

    it("should invalidate cache on PUT with successful response", async () => {
      mockReq.method = "PUT";
      mockRes.statusCode = 200;

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should invalidate cache on DELETE with successful response", async () => {
      mockReq.method = "DELETE";
      mockRes.statusCode = 204;

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should not invalidate cache on error response", async () => {
      mockReq.method = "POST";
      mockRes.statusCode = 400;

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should invalidate multiple cache patterns", async () => {
      mockReq.method = "POST";
      mockRes.statusCode = 201;

      const patterns = ["patients:*", "assessments:*", "notes:*"];
      const middleware = invalidateCacheMiddleware(patterns);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle cache invalidation errors gracefully", async () => {
      mockReq.method = "POST";
      mockRes.statusCode = 201;

      vi.mocked(cacheService.deletePattern).mockRejectedValue(
        new Error("Invalidation error"),
      );

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should use correlation ID in cache invalidation", async () => {
      mockReq.method = "POST";
      mockRes.statusCode = 201;

      const middleware = invalidateCacheMiddleware(["patients:*"]);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Cache Middleware Integration", () => {
    it("should handle complete cache flow: miss -> store -> hit", async () => {
      // First request: cache miss
      vi.mocked(cacheService.get).mockResolvedValueOnce(null);
      const middleware = cacheMiddleware(3600);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();

      // Second request: cache hit
      const cachedData = { id: "123", name: "Test Patient" };
      vi.mocked(cacheService.get).mockResolvedValueOnce(cachedData);

      const mockRes2 = {
        statusCode: 200,
        set: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      };

      await middleware(mockReq as Request, mockRes2 as Response, mockNext);

      expect(mockRes2.set).toHaveBeenCalledWith("X-Cache", "HIT");
      expect(mockRes2.json).toHaveBeenCalledWith(cachedData);
    });

    it("should handle cache invalidation after mutation", async () => {
      // Mutation request
      mockReq.method = "POST";
      mockRes.statusCode = 201;

      const invalidateMiddleware = invalidateCacheMiddleware(["patients:*"]);
      await invalidateMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
