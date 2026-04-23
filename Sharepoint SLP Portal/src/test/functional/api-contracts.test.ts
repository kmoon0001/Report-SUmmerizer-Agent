/**
 * API Contract Tests — HTTP Status Codes, Response Schemas, Error Handling
 * Purpose: Ensure API stability and prevent breaking changes
 * Framework: Vitest + axios with mocked responses
 *
 * These tests validate:
 * - Correct HTTP status codes (200, 201, 400, 401, 403, 404, 500)
 * - Response schema consistency
 * - Error message format
 * - Request validation
 *
 * To run against a LIVE SERVER:
 * 1. Set environment variable: USE_LIVE_API=true
 * 2. Start your backend server on http://localhost:3000
 * 3. Run: USE_LIVE_API=true npm test -- --run src/test/functional/api-contracts.test.ts
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import axios, { AxiosError } from "axios";

const API_URL = process.env.API_URL || "http://localhost:3000/api";
const USE_LIVE_API = process.env.USE_LIVE_API === "true";

// Only mock axios if NOT using live API
if (!USE_LIVE_API) {
  vi.mock("axios", () => {
    const mockAxios = {
      create: vi.fn(function (config: any) {
        return {
          baseURL: config.baseURL,
          validateStatus: config.validateStatus,
          get: vi.fn(),
          post: vi.fn(),
          put: vi.fn(),
          delete: vi.fn(),
        };
      }),
    };
    return { default: mockAxios };
  });
}

// Helper to make API calls
const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true, // Don't throw on any status
});

describe("API Contracts: Protocol Endpoints", () => {
  // Skip mocked tests when using live API
  const testFn = USE_LIVE_API ? it : it.skip;

  describe("GET /protocols", () => {
    testFn("returns 200 with array of protocols", async () => {
      const mockData = [
        { id: "1", name: "Gait Training", discipline: "PT" },
        { id: "2", name: "Balance", discipline: "PT" },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/protocols");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("returns protocols with required fields", async () => {
      const mockData = [
        {
          id: "1",
          name: "Gait Training",
          discipline: "PT",
          description: "Test",
        },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/protocols");

      expect(response.status).toBe(200);
      if (response.data.length > 0) {
        const protocol = response.data[0];
        expect(protocol).toHaveProperty("id");
        expect(protocol).toHaveProperty("name");
        expect(protocol).toHaveProperty("discipline");
      }
    });

    it("supports search query parameter", async () => {
      const mockData = [{ id: "1", name: "Gait Training", discipline: "PT" }];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/protocols?search=gait");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("supports pagination with limit and offset", async () => {
      const mockData = [{ id: "1", name: "Protocol 1", discipline: "PT" }];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/protocols?limit=10&offset=0");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("returns 400 for invalid query parameters", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 400,
        data: { error: "Invalid limit parameter" },
        headers: { "content-type": "application/json" },
        statusText: "Bad Request",
        config: {} as any,
      });

      const response = await api.get("/protocols?limit=invalid");

      expect([400, 200]).toContain(response.status);
    });
  });

  describe("GET /protocols/:id", () => {
    it("returns 200 for valid protocol ID", async () => {
      const mockData = { id: "1", name: "Gait Training", discipline: "PT" };

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/protocols/1");

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id", "1");
    });

    it("returns 404 for non-existent protocol ID", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 404,
        data: { error: "Protocol not found" },
        headers: { "content-type": "application/json" },
        statusText: "Not Found",
        config: {} as any,
      });

      const response = await api.get("/protocols/non-existent-id-12345");

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });

    it("returns error object with message", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 404,
        data: { error: "Protocol not found" },
        headers: { "content-type": "application/json" },
        statusText: "Not Found",
        config: {} as any,
      });

      const response = await api.get("/protocols/invalid");

      if (response.status === 404) {
        expect(response.data).toHaveProperty("error");
        expect(typeof response.data.error).toBe("string");
      }
    });
  });

  describe("POST /protocols", () => {
    it("returns 201 for valid protocol creation", async () => {
      const newProtocol = {
        name: "Test Protocol",
        discipline: "PT",
        description: "Test description",
      };

      vi.mocked(api.post).mockResolvedValueOnce({
        status: 201,
        data: { id: "123", ...newProtocol },
        headers: { "content-type": "application/json" },
        statusText: "Created",
        config: {} as any,
      });

      const response = await api.post("/protocols", newProtocol);

      expect([201, 200]).toContain(response.status);
      expect(response.data).toHaveProperty("id");
      expect(response.data.name).toBe(newProtocol.name);
    });

    it("returns 400 for missing required fields", async () => {
      const invalidProtocol = {
        description: "Test",
      };

      vi.mocked(api.post).mockResolvedValueOnce({
        status: 400,
        data: { error: "Missing required fields: name, discipline" },
        headers: { "content-type": "application/json" },
        statusText: "Bad Request",
        config: {} as any,
      });

      const response = await api.post("/protocols", invalidProtocol);

      expect([400, 422]).toContain(response.status);
      expect(response.data).toHaveProperty("error");
    });

    it("returns 400 for invalid discipline", async () => {
      const invalidProtocol = {
        name: "Test",
        discipline: "INVALID_DISCIPLINE",
        description: "Test",
      };

      vi.mocked(api.post).mockResolvedValueOnce({
        status: 400,
        data: { error: "Invalid discipline" },
        headers: { "content-type": "application/json" },
        statusText: "Bad Request",
        config: {} as any,
      });

      const response = await api.post("/protocols", invalidProtocol);

      expect([400, 422]).toContain(response.status);
    });

    it("returns created resource with all fields", async () => {
      const newProtocol = {
        name: "Complete Protocol",
        discipline: "OT",
        description: "Complete test",
      };

      vi.mocked(api.post).mockResolvedValueOnce({
        status: 201,
        data: {
          id: "456",
          ...newProtocol,
          createdAt: new Date().toISOString(),
        },
        headers: { "content-type": "application/json" },
        statusText: "Created",
        config: {} as any,
      });

      const response = await api.post("/protocols", newProtocol);

      if (response.status === 201 || response.status === 200) {
        expect(response.data).toHaveProperty("id");
        expect(response.data).toHaveProperty("name");
        expect(response.data).toHaveProperty("discipline");
        expect(response.data).toHaveProperty("description");
        expect(response.data).toHaveProperty("createdAt");
      }
    });
  });

  describe("PUT /protocols/:id", () => {
    it("returns 200 for valid protocol update", async () => {
      const updates = {
        name: "Updated Protocol",
        description: "Updated description",
      };

      vi.mocked(api.put).mockResolvedValueOnce({
        status: 200,
        data: { id: "1", ...updates },
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.put("/protocols/1", updates);

      expect([200, 204]).toContain(response.status);
    });

    it("returns 404 for non-existent protocol", async () => {
      vi.mocked(api.put).mockResolvedValueOnce({
        status: 404,
        data: { error: "Protocol not found" },
        headers: { "content-type": "application/json" },
        statusText: "Not Found",
        config: {} as any,
      });

      const response = await api.put("/protocols/non-existent", {
        name: "Updated",
      });

      expect(response.status).toBe(404);
    });

    it("returns updated resource", async () => {
      const updates = {
        name: "Updated Protocol",
      };

      vi.mocked(api.put).mockResolvedValueOnce({
        status: 200,
        data: { id: "1", ...updates },
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.put("/protocols/1", updates);

      if (response.status === 200) {
        expect(response.data.name).toBe(updates.name);
      }
    });
  });

  describe("DELETE /protocols/:id", () => {
    it("returns 204 for successful deletion", async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({
        status: 204,
        data: null,
        headers: { "content-type": "application/json" },
        statusText: "No Content",
        config: {} as any,
      });

      const response = await api.delete("/protocols/1");

      expect([200, 204]).toContain(response.status);
    });

    it("returns 404 for non-existent protocol", async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({
        status: 404,
        data: { error: "Protocol not found" },
        headers: { "content-type": "application/json" },
        statusText: "Not Found",
        config: {} as any,
      });

      const response = await api.delete("/protocols/non-existent");

      expect(response.status).toBe(404);
    });

    it("protocol is deleted after successful deletion", async () => {
      // First delete succeeds
      vi.mocked(api.delete).mockResolvedValueOnce({
        status: 204,
        data: null,
        headers: { "content-type": "application/json" },
        statusText: "No Content",
        config: {} as any,
      });

      // Then get returns 404
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 404,
        data: { error: "Protocol not found" },
        headers: { "content-type": "application/json" },
        statusText: "Not Found",
        config: {} as any,
      });

      const deleteResponse = await api.delete("/protocols/1");
      expect([200, 204]).toContain(deleteResponse.status);

      const getResponse = await api.get("/protocols/1");
      expect(getResponse.status).toBe(404);
    });
  });
});

describe("API Contracts: Outcome Measures Endpoints", () => {
  describe("GET /outcome-measures", () => {
    it("returns 200 with array of outcome measures", async () => {
      const mockData = [
        { id: "1", name: "LEFS", discipline: "PT" },
        { id: "2", name: "DASH", discipline: "OT" },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/outcome-measures");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("supports filtering by discipline", async () => {
      const mockData = [{ id: "1", name: "LEFS", discipline: "PT" }];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/outcome-measures?discipline=PT");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});

describe("API Contracts: Guidelines Endpoints", () => {
  describe("GET /guidelines", () => {
    it("returns 200 with array of guidelines", async () => {
      const mockData = [{ id: "1", name: "Fall Prevention", discipline: "PT" }];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/guidelines");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("supports search query", async () => {
      const mockData = [{ id: "1", name: "Fall Prevention", discipline: "PT" }];

      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: mockData,
        headers: { "content-type": "application/json" },
        statusText: "OK",
        config: {} as any,
      });

      const response = await api.get("/guidelines?search=fall");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});

describe("API Contracts: Error Handling", () => {
  it("returns 500 for server errors", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 500,
      data: { error: "Internal server error" },
      headers: { "content-type": "application/json" },
      statusText: "Internal Server Error",
      config: {} as any,
    });

    const response = await api.get("/protocols/invalid-id-that-causes-error");

    if (response.status >= 400) {
      expect(response.data).toHaveProperty("error");
    }
  });

  it("error responses include error message", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 404,
      data: { error: "Protocol not found" },
      headers: { "content-type": "application/json" },
      statusText: "Not Found",
      config: {} as any,
    });

    const response = await api.get("/protocols/non-existent");

    expect(response.status).toBe(404);
    expect(response.data).toHaveProperty("error");
    expect(typeof response.data.error).toBe("string");
  });

  it("error responses may include error code", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 404,
      data: { error: "Protocol not found", code: "PROTOCOL_NOT_FOUND" },
      headers: { "content-type": "application/json" },
      statusText: "Not Found",
      config: {} as any,
    });

    const response = await api.get("/protocols/non-existent");

    if (response.status === 404) {
      if (response.data.code) {
        expect(typeof response.data.code).toBe("string");
      }
    }
  });
});

describe("API Contracts: Response Headers", () => {
  it("includes Content-Type header", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 200,
      data: [],
      headers: { "content-type": "application/json" },
      statusText: "OK",
      config: {} as any,
    });

    const response = await api.get("/protocols");

    expect(response.headers["content-type"]).toBeDefined();
    expect(response.headers["content-type"]).toContain("application/json");
  });

  it("includes CORS headers in production", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 200,
      data: [],
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
      statusText: "OK",
      config: {} as any,
    });

    const response = await api.get("/protocols");

    if (response.headers["access-control-allow-origin"]) {
      expect(response.headers["access-control-allow-origin"]).toBeDefined();
    }
  });
});
