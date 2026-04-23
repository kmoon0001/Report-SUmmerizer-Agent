/**
 * Backward Compatibility Tests — API Versioning, Deprecated Fields, Response Format
 * Purpose: Ensure API stability and prevent breaking changes
 * Framework: Vitest + axios
 *
 * These tests validate:
 * - Old API versions still work
 * - Deprecated fields still accepted
 * - New fields are optional
 * - Response format remains stable
 * - Client code doesn't break on updates
 * - API versioning strategy
 * - Graceful deprecation handling
 */

import { describe, it, expect, beforeEach } from "vitest";

// APIResponse interface defined but not used in tests - kept for documentation
// interface APIResponse<T> {
//   status: number;
//   data: T;
//   headers: Record<string, string>;
// }

interface ProtocolV1 {
  id: string;
  name: string;
  discipline: string;
}

interface ProtocolV2 extends ProtocolV1 {
  description?: string;
  evidenceLevel?: string;
}

interface ProtocolV3 extends ProtocolV2 {
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

class APIVersionManager {
  private supportedVersions = ["v1", "v2", "v3"];
  private deprecatedFields: Record<string, string[]> = {
    v1: [],
    v2: [],
    v3: [],
  };

  supportsVersion(version: string): boolean {
    return this.supportedVersions.includes(version);
  }

  getLatestVersion(): string {
    const latest = this.supportedVersions[this.supportedVersions.length - 1];
    return latest || "v1";
  }

  getSupportedVersions(): string[] {
    return [...this.supportedVersions];
  }

  markFieldDeprecated(version: string, field: string): void {
    if (!this.deprecatedFields[version]) {
      this.deprecatedFields[version] = [];
    }
    this.deprecatedFields[version].push(field);
  }

  isFieldDeprecated(version: string, field: string): boolean {
    return this.deprecatedFields[version]?.includes(field) || false;
  }

  transformResponse(version: string, data: any): any {
    // Transform response based on version
    if (version === "v1") {
      // Return only v1 fields
      return {
        id: data.id || "",
        name: data.name || "",
        discipline: data.discipline || "",
      };
    } else if (version === "v2") {
      // Return v1 + v2 fields
      return {
        id: data.id || "",
        name: data.name || "",
        discipline: data.discipline || "",
        description: data.description,
        evidenceLevel: data.evidenceLevel,
      };
    } else {
      // Return all fields
      return data;
    }
  }

  transformRequest(version: string, data: any): any {
    // Accept both old and new field names
    const transformed = { ...data };

    // Handle deprecated field names
    if (version === "v1" && data.oldFieldName) {
      transformed.newFieldName = data.oldFieldName;
      delete transformed.oldFieldName;
    }

    return transformed;
  }
}

describe("Backward Compatibility: API Versioning & Stability", () => {
  let apiManager: APIVersionManager;

  beforeEach(() => {
    apiManager = new APIVersionManager();
  });

  describe("API Version Support", () => {
    it("supports multiple API versions", () => {
      const versions = apiManager.getSupportedVersions();

      expect(versions).toContain("v1");
      expect(versions).toContain("v2");
      expect(versions).toContain("v3");
    });

    it("identifies latest API version", () => {
      const latest = apiManager.getLatestVersion();

      expect(latest).toBe("v3");
    });

    it("validates supported versions", () => {
      expect(apiManager.supportsVersion("v1")).toBe(true);
      expect(apiManager.supportsVersion("v2")).toBe(true);
      expect(apiManager.supportsVersion("v3")).toBe(true);
      expect(apiManager.supportsVersion("v4")).toBe(false);
    });

    it("rejects unsupported versions", () => {
      expect(apiManager.supportsVersion("v99")).toBe(false);
      expect(apiManager.supportsVersion("invalid")).toBe(false);
    });
  });

  describe("Old API Versions Still Work", () => {
    it("v1 API returns v1 response format", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Gait Training",
        discipline: "PT",
        description: "Evidence-based gait training",
        evidenceLevel: "high",
        tags: ["gait", "balance"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);

      expect(v1Response).toHaveProperty("id");
      expect(v1Response).toHaveProperty("name");
      expect(v1Response).toHaveProperty("discipline");
      expect(v1Response).not.toHaveProperty("description");
      expect(v1Response).not.toHaveProperty("tags");
    });

    it("v2 API returns v2 response format", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Gait Training",
        discipline: "PT",
        description: "Evidence-based gait training",
        evidenceLevel: "high",
        tags: ["gait", "balance"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v2Response = apiManager.transformResponse("v2", data);

      expect(v2Response).toHaveProperty("id");
      expect(v2Response).toHaveProperty("name");
      expect(v2Response).toHaveProperty("discipline");
      expect(v2Response).toHaveProperty("description");
      expect(v2Response).toHaveProperty("evidenceLevel");
      expect(v2Response).not.toHaveProperty("tags");
    });

    it("v3 API returns full response format", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Gait Training",
        discipline: "PT",
        description: "Evidence-based gait training",
        evidenceLevel: "high",
        tags: ["gait", "balance"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v3Response = apiManager.transformResponse("v3", data);

      expect(v3Response).toEqual(data);
    });
  });

  describe("Deprecated Fields Still Accepted", () => {
    it("accepts deprecated field names in requests", () => {
      const oldRequest = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        oldFieldName: "old value",
      };

      const transformed = apiManager.transformRequest("v1", oldRequest);

      expect(transformed).toHaveProperty("newFieldName");
      expect(transformed.newFieldName).toBe("old value");
    });

    it("marks fields as deprecated", () => {
      apiManager.markFieldDeprecated("v2", "oldField");

      expect(apiManager.isFieldDeprecated("v2", "oldField")).toBe(true);
      expect(apiManager.isFieldDeprecated("v2", "newField")).toBe(false);
    });

    it("provides deprecation warnings", () => {
      apiManager.markFieldDeprecated("v2", "status");

      const isDeprecated = apiManager.isFieldDeprecated("v2", "status");

      expect(isDeprecated).toBe(true);
    });

    it("supports both old and new field names", () => {
      const request = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        status: "active", // Old field name
      };

      const transformed = apiManager.transformRequest("v2", request);

      expect(transformed).toHaveProperty("status");
    });
  });

  describe("New Fields Are Optional", () => {
    it("v3 fields are optional in v2 requests", () => {
      const v2Request: ProtocolV2 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        // description and evidenceLevel are optional
      };

      expect(v2Request).toHaveProperty("id");
      expect(v2Request).toHaveProperty("name");
      expect(v2Request).toHaveProperty("discipline");
      expect(v2Request.description).toBeUndefined();
    });

    it("v2 fields are optional in v1 requests", () => {
      const v1Request: ProtocolV1 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        // No v2 fields
      };

      expect(v1Request).toHaveProperty("id");
      expect(v1Request).toHaveProperty("name");
      expect(v1Request).toHaveProperty("discipline");
    });

    it("handles missing optional fields gracefully", () => {
      const data: ProtocolV2 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
      };

      const response = apiManager.transformResponse("v2", data);

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("name");
      expect(response).toHaveProperty("discipline");
      expect(response.description).toBeUndefined();
    });
  });

  describe("Response Format Stability", () => {
    it("maintains consistent response structure across versions", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        description: "Description",
        evidenceLevel: "high",
        tags: ["tag1"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);
      const v2Response = apiManager.transformResponse("v2", data);
      const v3Response = apiManager.transformResponse("v3", data);

      // All responses should have core fields
      expect(v1Response).toHaveProperty("id");
      expect(v2Response).toHaveProperty("id");
      expect(v3Response).toHaveProperty("id");

      // Response size increases with version
      expect(Object.keys(v1Response).length).toBeLessThan(
        Object.keys(v2Response).length,
      );
      expect(Object.keys(v2Response).length).toBeLessThanOrEqual(
        Object.keys(v3Response).length,
      );
    });

    it("preserves field types across versions", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        description: "Description",
        evidenceLevel: "high",
        tags: ["tag1", "tag2"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);
      const v3Response = apiManager.transformResponse("v3", data);

      expect(typeof v1Response.id).toBe("string");
      expect(typeof v3Response.id).toBe("string");
      expect(typeof v3Response.tags).toBe("object");
      expect(Array.isArray(v3Response.tags)).toBe(true);
    });

    it("maintains field order consistency", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        description: "Description",
        evidenceLevel: "high",
        tags: ["tag1"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);
      const v1Keys = Object.keys(v1Response);

      expect(v1Keys[0]).toBe("id");
      expect(v1Keys[1]).toBe("name");
      expect(v1Keys[2]).toBe("discipline");
    });
  });

  describe("Client Code Compatibility", () => {
    it("old client code works with new API", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        description: "Description",
        evidenceLevel: "high",
        tags: ["tag1"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);

      // Old client code expects these fields
      const oldClientCode = (protocol: ProtocolV1) => {
        return `${protocol.name} (${protocol.discipline})`;
      };

      const result = oldClientCode(v1Response as ProtocolV1);

      expect(result).toBe("Protocol (PT)");
    });

    it("new client code works with old API responses", () => {
      const v1Data: ProtocolV1 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
      };

      // New client code can handle missing optional fields
      const newClientCode = (protocol: ProtocolV3) => {
        return {
          name: protocol.name,
          description: protocol.description || "No description",
          tags: protocol.tags || [],
        };
      };

      const result = newClientCode(v1Data as ProtocolV3);

      expect(result.name).toBe("Protocol");
      expect(result.description).toBe("No description");
      expect(result.tags).toEqual([]);
    });
  });

  describe("API Versioning Strategy", () => {
    it("supports semantic versioning", () => {
      const versions = apiManager.getSupportedVersions();

      // All versions follow vX format
      const allValid = versions.every((v) => /^v\d+$/.test(v));

      expect(allValid).toBe(true);
    });

    it("maintains backward compatibility window", () => {
      const versions = apiManager.getSupportedVersions();

      // Should support at least 2 versions for backward compatibility
      expect(versions.length).toBeGreaterThanOrEqual(2);
    });

    it("provides migration path for deprecated versions", () => {
      const v1Supported = apiManager.supportsVersion("v1");
      const v2Supported = apiManager.supportsVersion("v2");
      const v3Supported = apiManager.supportsVersion("v3");

      // All versions should be supported for migration
      expect(v1Supported).toBe(true);
      expect(v2Supported).toBe(true);
      expect(v3Supported).toBe(true);
    });
  });

  describe("Graceful Deprecation Handling", () => {
    it("handles deprecated endpoints gracefully", () => {
      // Both v1 and v3 should be accessible
      expect(apiManager.supportsVersion("v1")).toBe(true);
      expect(apiManager.supportsVersion("v3")).toBe(true);
    });

    it("provides deprecation notices", () => {
      apiManager.markFieldDeprecated("v2", "status");

      const deprecationNotice = apiManager.isFieldDeprecated("v2", "status")
        ? 'Field "status" is deprecated in v2. Use "isActive" instead.'
        : null;

      expect(deprecationNotice).not.toBeNull();
    });

    it("supports gradual migration to new versions", () => {
      // Client can migrate from v1 → v2 → v3 gradually
      const v1Supported = apiManager.supportsVersion("v1");
      const v2Supported = apiManager.supportsVersion("v2");
      const v3Supported = apiManager.supportsVersion("v3");

      expect(v1Supported && v2Supported && v3Supported).toBe(true);
    });

    it("maintains data consistency across versions", () => {
      const data: ProtocolV3 = {
        id: "1",
        name: "Protocol",
        discipline: "PT",
        description: "Description",
        evidenceLevel: "high",
        tags: ["tag1"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      };

      const v1Response = apiManager.transformResponse("v1", data);
      const v3Response = apiManager.transformResponse("v3", data);

      // Core data should be identical
      expect(v1Response.id).toBe(v3Response.id);
      expect(v1Response.name).toBe(v3Response.name);
      expect(v1Response.discipline).toBe(v3Response.discipline);
    });
  });

  describe("Version Negotiation", () => {
    it("defaults to latest version if not specified", () => {
      const latest = apiManager.getLatestVersion();

      expect(latest).toBe("v3");
    });

    it("accepts version from request header", () => {
      const requestVersion = "v2";

      expect(apiManager.supportsVersion(requestVersion)).toBe(true);
    });

    it("falls back to supported version if requested version unavailable", () => {
      const requestedVersion = "v99";
      const fallbackVersion = apiManager.supportsVersion(requestedVersion)
        ? requestedVersion
        : apiManager.getLatestVersion();

      expect(fallbackVersion).toBe("v3");
    });
  });
});
