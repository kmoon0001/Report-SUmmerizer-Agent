import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import {
  createRateLimiter,
  createPerEndpointRateLimiter,
  resetRateLimit,
  getRateLimitStatus,
  destroyRateLimiter,
} from "../../middleware/rate-limit-advanced";

describe("Rate Limiting Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" } as any,
      path: "/api/test",
    };

    mockRes = {
      statusCode: 200,
      set: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  afterEach(() => {
    destroyRateLimiter();
  });

  describe("createRateLimiter", () => {
    it("should create a rate limiter middleware", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });
      expect(typeof limiter).toBe("function");
    });

    it("should set rate limit headers", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.set).toHaveBeenCalledWith("X-RateLimit-Limit", "10");
      expect(mockRes.set).toHaveBeenCalledWith(
        "X-RateLimit-Remaining",
        expect.any(String),
      );
      expect(mockRes.set).toHaveBeenCalledWith(
        "X-RateLimit-Reset",
        expect.any(String),
      );
    });

    it("should call next() when under limit", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should reject request when limit exceeded", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      // First request should pass
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      // Reset mock
      (mockNext as any).mockClear();

      // Second request should be rejected
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should use custom status code", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
        statusCode: 503,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      limiter(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(503);
    });

    it("should use custom error message", () => {
      const customMessage = "Custom rate limit message";
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
        message: customMessage,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      limiter(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: customMessage,
        }),
      );
    });
  });

  describe("createPerEndpointRateLimiter", () => {
    it("should create per-endpoint rate limiter", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 5 },
        "/api/data": { windowMs: 60000, maxRequests: 100 },
      });
      expect(typeof limiter).toBe("function");
    });

    it("should apply correct limit for matching endpoint", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 1 },
      });

      (mockReq as any).path = "/api/auth/login";
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();

      (mockNext as any).mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });

    it("should skip non-matching endpoints", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 1 },
      });

      (mockReq as any).path = "/api/other";
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("resetRateLimit", () => {
    it("should reset rate limit for client", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      (mockNext as any).mockClear();

      // Should be rate limited
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);

      // Reset
      resetRateLimit("127.0.0.1");
      mockRes.status = vi.fn().mockReturnThis();
      (mockNext as any).mockClear();

      // Should now pass
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getRateLimitStatus", () => {
    it("should return request count", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      const status = getRateLimitStatus("127.0.0.1", 60000);
      expect(status).toBeGreaterThan(0);
    });
  });

  describe("destroyRateLimiter", () => {
    it("should destroy rate limiter store", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      destroyRateLimiter();

      // After destroy, should work normally
      (mockNext as any).mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
