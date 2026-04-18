import { describe, it, expect } from "vitest";
import { DOMAIN_DATA, DomainType } from "./documentation-data";

describe("Documentation Data", () => {
  it("has all required domains", () => {
    const domains: DomainType[] = [
      "dysphagia",
      "cog_comm",
      "aphasia",
      "motor_speech",
      "voice",
    ];
    domains.forEach((domain) => {
      expect(DOMAIN_DATA).toHaveProperty(domain);
    });
  });

  it("each domain has valid structure", () => {
    Object.values(DOMAIN_DATA).forEach((data) => {
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("label");
      expect(data).toHaveProperty("icon");
      expect(data).toHaveProperty("color");
      expect(data).toHaveProperty("image");
      expect(data).toHaveProperty("authoritativeSources");
      expect(Array.isArray(data.authoritativeSources)).toBe(true);
    });
  });

  it("sources have valid URLs", () => {
    Object.values(DOMAIN_DATA).forEach((data) => {
      data.authoritativeSources.forEach((source) => {
        expect(source.url).toMatch(/^https?:\/\//);
      });
    });
  });
});
