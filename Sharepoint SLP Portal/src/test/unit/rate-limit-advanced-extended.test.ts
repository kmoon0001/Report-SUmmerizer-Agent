import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Request, Response } from "express";
import {
  createRateLimiter,
  createPerEndpointRateLimiter,
  resetRateLimit,
  getRateLimitStatus,
  destroyRateLimiter,
} from "../../middleware/rate-limit-advanced";

describe("Rate Limiting Middleware - Extended Coverage", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      ip: "192.168.1.100",
      socket: { remoteAddress: "192.168.1.100" } as any,
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

  describe("Sliding Window Behavior", () => {
    it("should track requests within time window", () => {
      const limiter = createRateLimiter({
        windowMs: 1000,
        maxRequests: 5,
      });

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        limiter(mockReq as Request, mockRes as Response, mockNext);
        mockNext.mockClear();
      }

      const status = getRateLimitStatus("192.168.1.100", 1000);
      expect(status).toBe(3);
    });

    it("should reset count after window expires", async () => {
      const limiter = createRateLimiter({
        windowMs: 100,
        maxRequests: 2,
      });

      // Make 2 requests
      limiter(mockReq as Request, mockRes as Response, mockNext);
      limiter(mockReq as Request, mockRes as Response, mockNext);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should allow more requests
      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle multiple clients independently", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
      });

      // Client 1
      const req1 = { ...mockReq, ip: "192.168.1.1" } as any;
      limiter(req1 as Request, mockRes as Response, mockNext);
      limiter(req1 as Request, mockRes as Response, mockNext);

      // Client 2
      const req2 = { ...mockReq, ip: "192.168.1.2" } as any;
      mockNext.mockClear();
      limiter(req2 as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle requests from same client at different times", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 3,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("Response Status Handling", () => {
    it("should skip counting successful requests when configured", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
        skipSuccessfulRequests: true,
      });

      mockRes.statusCode = 200;
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should skip counting failed requests when configured", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
        skipFailedRequests: true,
      });

      mockRes.statusCode = 500;
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should count requests with different status codes", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 3,
      });

      mockRes.statusCode = 200;
      limiter(mockReq as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      mockRes.statusCode = 404;
      limiter(mockReq as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      mockRes.statusCode = 500;
      limiter(mockReq as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });

  describe("Per-Endpoint Configuration", () => {
    it("should create per-endpoint limiter", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 1 },
        "/api/data": { windowMs: 60000, maxRequests: 5 },
      });
      expect(typeof limiter).toBe("function");
    });

    it("should skip non-matching endpoints", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 1 },
      });

      mockReq.path = "/api/other";
      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle multiple endpoint configurations", () => {
      const limiter = createPerEndpointRateLimiter({
        "/api/auth": { windowMs: 60000, maxRequests: 5 },
        "/api/data": { windowMs: 60000, maxRequests: 10 },
        "/api/search": { windowMs: 60000, maxRequests: 20 },
      });

      expect(typeof limiter).toBe("function");
    });
  });

  describe("Client IP Detection", () => {
    it("should use req.ip when available", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req = { ...mockReq, ip: "10.0.0.1" } as any;
      limiter(req as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      limiter(req as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });

    it("should fallback to socket.remoteAddress", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req = {
        ...mockReq,
        ip: undefined,
        socket: { remoteAddress: "10.0.0.2" },
      } as any;
      limiter(req as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      limiter(req as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });

    it("should use unknown when IP unavailable", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req = {
        ...mockReq,
        ip: undefined,
        socket: { remoteAddress: undefined },
      } as any;
      limiter(req as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      limiter(req as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });

  describe("Rate Limit Headers", () => {
    it("should set correct remaining count", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      const setCalls = (mockRes.set as any).mock.calls;
      const remainingCall = setCalls.find(
        (call: any) => call[0] === "X-RateLimit-Remaining",
      );
      expect(remainingCall).toBeDefined();
      expect(parseInt(remainingCall[1])).toBeLessThanOrEqual(10);

      mockNext.mockClear();
      mockRes.set = vi.fn();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      const setCalls2 = (mockRes.set as any).mock.calls;
      const remainingCall2 = setCalls2.find(
        (call: any) => call[0] === "X-RateLimit-Remaining",
      );
      expect(remainingCall2).toBeDefined();
    });

    it("should set reset time header", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      const beforeTime = Date.now();
      limiter(mockReq as Request, mockRes as Response, mockNext);
      const afterTime = Date.now();

      const setCalls = (mockRes.set as any).mock.calls;
      const resetCall = setCalls.find(
        (call: any) => call[0] === "X-RateLimit-Reset",
      );
      const resetTime = parseInt(resetCall[1]);

      expect(resetTime).toBeGreaterThanOrEqual(beforeTime + 60000);
      expect(resetTime).toBeLessThanOrEqual(afterTime + 60000);
    });

    it("should set remaining to 0 when limit exceeded", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      mockNext.mockClear();

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.set).toHaveBeenCalledWith("X-RateLimit-Remaining", "0");
    });
  });

  describe("Error Response Format", () => {
    it("should include retryAfter in response", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      mockNext.mockClear();

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          retryAfter: expect.any(Number),
        }),
      );
    });

    it("should calculate correct retryAfter value", () => {
      const windowMs = 30000;
      const limiter = createRateLimiter({
        windowMs,
        maxRequests: 1,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      mockNext.mockClear();

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          retryAfter: 30,
        }),
      );
    });
  });

  describe("Reset and Status Operations", () => {
    it("should reset rate limit for specific client", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req = { ...mockReq, ip: "192.168.1.50" };
      limiter(req as Request, mockRes as Response, mockNext);

      mockNext.mockClear();
      limiter(req as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);

      resetRateLimit("192.168.1.50");
      mockRes.status = vi.fn().mockReturnThis();
      mockNext.mockClear();

      limiter(req as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should get accurate rate limit status", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      const req = { ...mockReq, ip: "192.168.1.75" };
      for (let i = 0; i < 5; i++) {
        limiter(req as Request, mockRes as Response, mockNext);
        mockNext.mockClear();
      }

      const status = getRateLimitStatus("192.168.1.75", 60000);
      expect(status).toBe(5);
    });

    it("should return 0 status for unknown client", () => {
      const status = getRateLimitStatus("192.168.1.99", 60000);
      expect(status).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero maxRequests", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 0,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });

    it("should handle very large maxRequests", () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1000000,
      });

      for (let i = 0; i < 50; i++) {
        limiter(mockReq as Request, mockRes as Response, mockNext);
        mockNext.mockClear();
      }

      // Should still allow requests
      expect(mockRes.status).not.toHaveBeenCalledWith(429);
    });

    it("should handle very small time windows", () => {
      const limiter = createRateLimiter({
        windowMs: 1,
        maxRequests: 1,
      });

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle very large time windows", () => {
      const limiter = createRateLimiter({
        windowMs: 24 * 60 * 60 * 1000,
        maxRequests: 10,
      });

      for (let i = 0; i < 10; i++) {
        limiter(mockReq as Request, mockRes as Response, mockNext);
        mockNext.mockClear();
      }

      limiter(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });
});
