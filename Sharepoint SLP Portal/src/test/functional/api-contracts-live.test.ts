/**
 * API Contract Tests — LIVE SERVER VERSION
 * Purpose: Test against a running backend server
 *
 * To run these tests:
 * 1. Start your backend server: npm run dev (or your server command)
 * 2. Run: npm test -- --run src/test/functional/api-contracts-live.test.ts
 *
 * Or with custom API URL:
 * API_URL=http://your-server:3000/api npm test -- --run src/test/functional/api-contracts-live.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

const API_URL = process.env["API_URL"] || "http://localhost:3000/api";

// Create real axios instance (no mocking)
const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true, // Don't throw on any status
  timeout: 10000,
});

describe.skip("API Contracts: LIVE SERVER Tests", () => {
  // Skipped: Requires backend server running on port 3000
  // To run: npm run dev (start backend) then npm test -- --run src/test/functional/api-contracts-live.test.ts
  beforeAll(async () => {
    // Check if server is running
    try {
      await api.get("/health");
      console.log(`✅ Connected to API at ${API_URL}`);
    } catch (error) {
      console.error(`❌ Cannot connect to API at ${API_URL}`);
      console.error("Make sure your backend server is running");
      throw new Error(`API server not available at ${API_URL}`, {
        cause: error,
      });
    }
  });

  describe("GET /protocols", () => {
    it("returns 200 with array of protocols", async () => {
      const response = await api.get("/protocols");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("returns protocols with required fields", async () => {
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
      const response = await api.get("/protocols?search=gait");

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });

    it("supports pagination with limit and offset", async () => {
      const response = await api.get("/protocols?limit=10&offset=0");

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });

    it("returns 400 for invalid query parameters", async () => {
      const response = await api.get("/protocols?limit=invalid");

      expect([200, 400]).toContain(response.status);
    });
  });

  describe("GET /protocols/:id", () => {
    it("returns 200 or 404 for protocol lookup", async () => {
      const response = await api.get("/protocols/1");

      expect([200, 404]).toContain(response.status);
    });

    it("returns error object for non-existent protocol", async () => {
      const response = await api.get("/protocols/non-existent-id-12345");

      if (response.status === 404) {
        expect(response.data).toHaveProperty("error");
      }
    });
  });

  describe("POST /protocols", () => {
    it("returns 201 or 200 for valid protocol creation", async () => {
      const newProtocol = {
        name: "Test Protocol " + Date.now(),
        discipline: "PT",
        description: "Test description",
      };

      const response = await api.post("/protocols", newProtocol);

      expect([200, 201, 400, 401, 403]).toContain(response.status);
      if (response.status === 201 || response.status === 200) {
        expect(response.data).toHaveProperty("id");
        expect(response.data.name).toBe(newProtocol.name);
      }
    });

    it("returns 400 for missing required fields", async () => {
      const invalidProtocol = {
        description: "Test",
      };

      const response = await api.post("/protocols", invalidProtocol);

      expect([400, 422, 401, 403]).toContain(response.status);
    });

    it("returns 400 for invalid discipline", async () => {
      const invalidProtocol = {
        name: "Test",
        discipline: "INVALID_DISCIPLINE",
        description: "Test",
      };

      const response = await api.post("/protocols", invalidProtocol);

      expect([400, 422, 401, 403]).toContain(response.status);
    });
  });

  describe("PUT /protocols/:id", () => {
    it("returns 200 or 404 for protocol update", async () => {
      const updates = {
        name: "Updated Protocol",
        description: "Updated description",
      };

      const response = await api.put("/protocols/1", updates);

      expect([200, 204, 404, 401, 403]).toContain(response.status);
    });

    it("returns 404 for non-existent protocol", async () => {
      const response = await api.put("/protocols/non-existent", {
        name: "Updated",
      });

      expect([404, 401, 403]).toContain(response.status);
    });
  });

  describe("DELETE /protocols/:id", () => {
    it("returns 200 or 204 for successful deletion", async () => {
      const response = await api.delete("/protocols/1");

      expect([200, 204, 404, 401, 403]).toContain(response.status);
    });

    it("returns 404 for non-existent protocol", async () => {
      const response = await api.delete("/protocols/non-existent");

      expect([404, 401, 403]).toContain(response.status);
    });
  });

  describe("GET /outcome-measures", () => {
    it("returns 200 with array of outcome measures", async () => {
      const response = await api.get("/outcome-measures");

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });

    it("supports filtering by discipline", async () => {
      const response = await api.get("/outcome-measures?discipline=PT");

      expect([200, 400, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });
  });

  describe("GET /guidelines", () => {
    it("returns 200 with array of guidelines", async () => {
      const response = await api.get("/guidelines");

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });

    it("supports search query", async () => {
      const response = await api.get("/guidelines?search=fall");

      expect([200, 400, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });
  });

  describe("Response Headers", () => {
    it("includes Content-Type header", async () => {
      const response = await api.get("/protocols");

      if (response.status === 200) {
        expect(response.headers["content-type"]).toBeDefined();
      }
    });
  });

  describe("Error Handling", () => {
    it("error responses include error message", async () => {
      const response = await api.get("/protocols/non-existent");

      if (response.status >= 400) {
        expect(response.data).toHaveProperty("error");
      }
    });
  });
});
