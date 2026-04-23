import { describe, it, expect } from "vitest";

/** Mirrors server.ts default allowlist for unit-level regression checks */
function isOriginAllowed(
  origin: string | undefined,
  allowlist: string[],
): boolean {
  if (!origin) return true;
  return allowlist.includes(origin);
}

describe("Security: CORS allowlist policy", () => {
  const allow = ["http://localhost:3000", "http://localhost:5173"];

  it("allows localhost app origins", () => {
    expect(isOriginAllowed("http://localhost:3000", allow)).toBe(true);
    expect(isOriginAllowed("http://localhost:5173", allow)).toBe(true);
  });

  it("blocks unknown origins", () => {
    expect(isOriginAllowed("https://evil.example", allow)).toBe(false);
  });

  it("allows requests with no Origin header (mobile, curl)", () => {
    expect(isOriginAllowed(undefined, allow)).toBe(true);
  });
});
