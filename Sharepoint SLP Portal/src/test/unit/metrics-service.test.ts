import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  recordHttpRequest,
  recordDatabaseQuery,
  recordCacheOperation,
  recordWebSocketMessage,
  recordProtocolSearch,
  recordError,
  metricsEndpoint,
  startMetricsCollection,
  httpRequestDuration,
  httpRequestTotal,
  dbQueryDuration,
  dbQueryTotal,
  cacheHits,
  cacheMisses,
  wsMessagesTotal,
  protocolSearchTotal,
  errorTotal,
} from "../../services/metrics-service";

describe("Metrics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("HTTP Request Metrics", () => {
    it("should record HTTP request with all parameters", () => {
      const observeSpy = vi.spyOn(httpRequestDuration, "labels");
      recordHttpRequest("GET", "/api/patients", 200, 0.05, 256, 1024);
      expect(observeSpy).toHaveBeenCalledWith("GET", "/api/patients", 200);
    });

    it("should record different HTTP methods", () => {
      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
      methods.forEach((method) => {
        expect(() => {
          recordHttpRequest(method, "/api/data", 200, 0.1, 100, 500);
        }).not.toThrow();
      });
    });

    it("should record different status codes", () => {
      const statusCodes = [200, 201, 400, 401, 403, 404, 500, 502, 503];
      statusCodes.forEach((code) => {
        expect(() => {
          recordHttpRequest("GET", "/api/data", code, 0.1, 100, 500);
        }).not.toThrow();
      });
    });

    it("should record various request/response sizes", () => {
      expect(() => {
        recordHttpRequest("POST", "/api/data", 200, 0.15, 10000, 50000);
      }).not.toThrow();

      expect(() => {
        recordHttpRequest("GET", "/api/data", 200, 0.05, 50, 200);
      }).not.toThrow();
    });

    it("should record different durations", () => {
      expect(() => {
        recordHttpRequest("GET", "/api/data", 200, 0.001, 100, 500);
      }).not.toThrow();

      expect(() => {
        recordHttpRequest("GET", "/api/data", 200, 5.5, 100, 500);
      }).not.toThrow();
    });

    it("should increment request counter", () => {
      const incSpy = vi.spyOn(httpRequestTotal, "labels");
      recordHttpRequest("GET", "/api/patients", 200, 0.05, 256, 1024);
      expect(incSpy).toHaveBeenCalledWith("GET", "/api/patients", 200);
    });
  });

  describe("Database Query Metrics", () => {
    it("should record database query with success status", () => {
      const observeSpy = vi.spyOn(dbQueryDuration, "labels");
      recordDatabaseQuery("SELECT", "patients", 0.05, "success");
      expect(observeSpy).toHaveBeenCalledWith("SELECT", "patients");
    });

    it("should record database query with error status", () => {
      const observeSpy = vi.spyOn(dbQueryDuration, "labels");
      recordDatabaseQuery("INSERT", "patients", 0.1, "error");
      expect(observeSpy).toHaveBeenCalledWith("INSERT", "patients");
    });

    it("should record different query types", () => {
      const queryTypes = ["SELECT", "INSERT", "UPDATE", "DELETE"];
      queryTypes.forEach((type) => {
        expect(() => {
          recordDatabaseQuery(type, "patients", 0.05, "success");
        }).not.toThrow();
      });
    });

    it("should record different table names", () => {
      const tables = ["patients", "protocols", "assessments", "outcomes"];
      tables.forEach((table) => {
        expect(() => {
          recordDatabaseQuery("SELECT", table, 0.05, "success");
        }).not.toThrow();
      });
    });

    it("should record various query durations", () => {
      expect(() => {
        recordDatabaseQuery("SELECT", "patients", 0.001, "success");
      }).not.toThrow();

      expect(() => {
        recordDatabaseQuery("SELECT", "patients", 1.5, "success");
      }).not.toThrow();
    });

    it("should increment query counter", () => {
      const incSpy = vi.spyOn(dbQueryTotal, "labels");
      recordDatabaseQuery("SELECT", "patients", 0.05, "success");
      expect(incSpy).toHaveBeenCalledWith("SELECT", "patients", "success");
    });
  });

  describe("Cache Operation Metrics", () => {
    it("should record cache hit", () => {
      const incSpy = vi.spyOn(cacheHits, "labels");
      recordCacheOperation("redis", "hit", 0.01);
      expect(incSpy).toHaveBeenCalledWith("redis");
    });

    it("should record cache miss", () => {
      const incSpy = vi.spyOn(cacheMisses, "labels");
      recordCacheOperation("redis", "miss", 0.01);
      expect(incSpy).toHaveBeenCalledWith("redis");
    });

    it("should record cache set operation", () => {
      expect(() => {
        recordCacheOperation("redis", "set", 0.02);
      }).not.toThrow();
    });

    it("should record cache delete operation", () => {
      expect(() => {
        recordCacheOperation("redis", "delete", 0.015);
      }).not.toThrow();
    });

    it("should record operation without duration", () => {
      expect(() => {
        recordCacheOperation("redis", "hit");
      }).not.toThrow();
    });

    it("should record different cache names", () => {
      const cacheNames = ["redis", "memory", "distributed"];
      cacheNames.forEach((name) => {
        expect(() => {
          recordCacheOperation(name, "hit", 0.01);
        }).not.toThrow();
      });
    });

    it("should record various operation durations", () => {
      expect(() => {
        recordCacheOperation("redis", "hit", 0.001);
      }).not.toThrow();

      expect(() => {
        recordCacheOperation("redis", "hit", 0.5);
      }).not.toThrow();
    });
  });

  describe("WebSocket Metrics", () => {
    it("should record inbound WebSocket message", () => {
      const incSpy = vi.spyOn(wsMessagesTotal, "labels");
      recordWebSocketMessage("inbound", "collaboration", 512);
      expect(incSpy).toHaveBeenCalledWith("inbound", "collaboration");
    });

    it("should record outbound WebSocket message", () => {
      const incSpy = vi.spyOn(wsMessagesTotal, "labels");
      recordWebSocketMessage("outbound", "notification", 256);
      expect(incSpy).toHaveBeenCalledWith("outbound", "notification");
    });

    it("should record different message types", () => {
      const types = ["collaboration", "notification", "update", "sync"];
      types.forEach((type) => {
        expect(() => {
          recordWebSocketMessage("inbound", type, 512);
        }).not.toThrow();
      });
    });

    it("should record various message sizes", () => {
      expect(() => {
        recordWebSocketMessage("inbound", "collaboration", 100);
      }).not.toThrow();

      expect(() => {
        recordWebSocketMessage("inbound", "collaboration", 100000);
      }).not.toThrow();
    });

    it("should record both directions", () => {
      expect(() => {
        recordWebSocketMessage("inbound", "test", 512);
        recordWebSocketMessage("outbound", "test", 512);
      }).not.toThrow();
    });
  });

  describe("Protocol Search Metrics", () => {
    it("should record protocol search with duration", () => {
      const incSpy = vi.spyOn(protocolSearchTotal, "labels");
      recordProtocolSearch("PT", 0.15);
      expect(incSpy).toHaveBeenCalledWith("PT");
    });

    it("should record searches for different disciplines", () => {
      const disciplines = ["PT", "OT", "SLP"];
      disciplines.forEach((discipline) => {
        expect(() => {
          recordProtocolSearch(discipline, 0.1);
        }).not.toThrow();
      });
    });

    it("should record various search durations", () => {
      expect(() => {
        recordProtocolSearch("PT", 0.01);
      }).not.toThrow();

      expect(() => {
        recordProtocolSearch("PT", 1.5);
      }).not.toThrow();
    });

    it("should increment search counter", () => {
      const incSpy = vi.spyOn(protocolSearchTotal, "labels");
      recordProtocolSearch("OT", 0.2);
      expect(incSpy).toHaveBeenCalledWith("OT");
    });
  });

  describe("Error Metrics", () => {
    it("should record low severity error", () => {
      const incSpy = vi.spyOn(errorTotal, "labels");
      recordError("validation", "low");
      expect(incSpy).toHaveBeenCalledWith("validation", "low");
    });

    it("should record medium severity error", () => {
      const incSpy = vi.spyOn(errorTotal, "labels");
      recordError("network", "medium");
      expect(incSpy).toHaveBeenCalledWith("network", "medium");
    });

    it("should record high severity error", () => {
      const incSpy = vi.spyOn(errorTotal, "labels");
      recordError("database", "high");
      expect(incSpy).toHaveBeenCalledWith("database", "high");
    });

    it("should record critical severity error", () => {
      const incSpy = vi.spyOn(errorTotal, "labels");
      recordError("security", "critical");
      expect(incSpy).toHaveBeenCalledWith("security", "critical");
    });

    it("should record different error types", () => {
      const types = [
        "validation",
        "network",
        "database",
        "security",
        "timeout",
      ];
      types.forEach((type) => {
        expect(() => {
          recordError(type, "medium");
        }).not.toThrow();
      });
    });

    it("should record all severity levels", () => {
      const severities: Array<"low" | "medium" | "high" | "critical"> = [
        "low",
        "medium",
        "high",
        "critical",
      ];
      severities.forEach((severity) => {
        expect(() => {
          recordError("test", severity);
        }).not.toThrow();
      });
    });
  });

  describe("Metrics Endpoint", () => {
    it("should return metrics in Prometheus format", async () => {
      const metrics = await metricsEndpoint();
      expect(typeof metrics).toBe("string");
      expect((metrics as string).length).toBeGreaterThan(0);
    });

    it("should include HTTP metrics", async () => {
      recordHttpRequest("GET", "/api/test", 200, 0.05, 100, 500);
      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("http_request");
    });

    it("should include database metrics", async () => {
      recordDatabaseQuery("SELECT", "test", 0.05, "success");
      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("db_query");
    });

    it("should include cache metrics", async () => {
      recordCacheOperation("redis", "hit", 0.01);
      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("cache");
    });

    it("should include WebSocket metrics", async () => {
      recordWebSocketMessage("inbound", "test", 512);
      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("websocket");
    });

    it("should include error metrics", async () => {
      recordError("test", "medium");
      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("errors_total");
    });
  });

  describe("Metrics Collection", () => {
    it("should start metrics collection without errors", () => {
      expect(() => {
        startMetricsCollection();
      }).not.toThrow();
    });

    it("should handle multiple collection starts", () => {
      expect(() => {
        startMetricsCollection();
        startMetricsCollection();
      }).not.toThrow();
    });
  });

  describe("Integration Scenarios", () => {
    it("should record complete request lifecycle", async () => {
      recordHttpRequest("POST", "/api/patients", 201, 0.15, 1024, 2048);
      recordDatabaseQuery("INSERT", "patients", 0.08, "success");
      recordCacheOperation("redis", "set", 0.02);

      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("http_request");
      expect(metrics as string).toContain("db_query");
      expect(metrics as string).toContain("cache");
    });

    it("should record error scenario", async () => {
      recordHttpRequest("GET", "/api/patients", 500, 0.5, 100, 256);
      recordDatabaseQuery("SELECT", "patients", 0.4, "error");
      recordError("database", "high");

      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("http_request");
      expect(metrics as string).toContain("db_query");
      expect(metrics as string).toContain("errors_total");
    });

    it("should record search with cache", async () => {
      recordProtocolSearch("PT", 0.2);
      recordCacheOperation("redis", "miss", 0.01);
      recordDatabaseQuery("SELECT", "protocols", 0.15, "success");
      recordCacheOperation("redis", "set", 0.02);

      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("protocol_search");
      expect(metrics as string).toContain("cache");
    });

    it("should record WebSocket communication", async () => {
      recordWebSocketMessage("inbound", "collaboration", 512);
      recordWebSocketMessage("outbound", "collaboration", 256);
      recordDatabaseQuery("UPDATE", "documents", 0.1, "success");

      const metrics = await metricsEndpoint();
      expect(metrics as string).toContain("websocket");
      expect(metrics as string).toContain("db_query");
    });
  });
});
