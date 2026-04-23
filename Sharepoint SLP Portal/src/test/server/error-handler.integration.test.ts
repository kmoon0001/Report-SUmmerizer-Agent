import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../server/middleware/errorMiddleware";

describe("Express errorHandler", () => {
  let res: Partial<Response>;
  let jsonBody: unknown;

  beforeEach(() => {
    jsonBody = undefined;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn((body: unknown) => {
        jsonBody = body;
        return res as Response;
      }),
    };
  });

  it("maps ZodError to HTTP 400 with validation details", () => {
    const schema = z.object({ name: z.string().min(1) });
    let err: unknown;
    try {
      schema.parse({});
    } catch (e) {
      err = e;
    }
    const prev = process.env["NODE_ENV"];
    process.env["NODE_ENV"] = "production";
    errorHandler(
      err as Error,
      {} as Request,
      res as Response,
      (() => {}) as NextFunction,
    );
    process.env["NODE_ENV"] = prev;

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonBody).toMatchObject({
      error: "Validation error",
    });
    expect((jsonBody as { details?: unknown }).details).toBeDefined();
  });

  it("uses err.status in 4xx range without ZodError", () => {
    const err = Object.assign(new Error("Forbidden resource"), { status: 403 });
    errorHandler(
      err,
      {} as Request,
      res as Response,
      (() => {}) as NextFunction,
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonBody).toMatchObject({ error: "Forbidden resource" });
  });

  it("returns generic 500 in production without leaking stack", () => {
    const prev = process.env["NODE_ENV"];
    process.env["NODE_ENV"] = "production";
    errorHandler(
      new Error("secret"),
      {} as Request,
      res as Response,
      (() => {}) as NextFunction,
    );
    process.env["NODE_ENV"] = prev;

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonBody).toMatchObject({ error: "Internal Server Error" });
    expect(JSON.stringify(jsonBody)).not.toContain("secret");
  });

  it("may include message on 500 in development", () => {
    const prev = process.env["NODE_ENV"];
    process.env["NODE_ENV"] = "development";
    errorHandler(
      new Error("dev-only"),
      {} as Request,
      res as Response,
      (() => {}) as NextFunction,
    );
    process.env["NODE_ENV"] = prev;

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonBody).toMatchObject({
      error: "Internal Server Error",
      message: "dev-only",
    });
  });
});
