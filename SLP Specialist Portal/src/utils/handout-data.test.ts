import { describe, it, expect } from "vitest";
import {
  HANDOUT_TYPES,
  SUBSPECIALTIES,
  AUTHORITATIVE_SOURCES,
  LANGUAGES,
} from "./handout-data";

describe("Handout Data", () => {
  it("has valid handout types", () => {
    expect(HANDOUT_TYPES.length).toBeGreaterThan(0);
    HANDOUT_TYPES.forEach((type) => {
      expect(type).toHaveProperty("id");
      expect(type).toHaveProperty("title");
      expect(type).toHaveProperty("icon");
      expect(type).toHaveProperty("description");
    });
  });

  it("has valid subspecialties", () => {
    expect(SUBSPECIALTIES).toContain("Dysphagia - Oropharyngeal");
    expect(SUBSPECIALTIES).toContain("Aphasia - Expressive");
  });

  it("has valid sources", () => {
    AUTHORITATIVE_SOURCES.forEach((source) => {
      expect(source).toHaveProperty("name");
      expect(source).toHaveProperty("url");
      expect(source.url).toMatch(/^https?:\/\//);
    });
  });

  it("has valid languages", () => {
    expect(LANGUAGES).toContainEqual({ id: "en", title: "English" });
    LANGUAGES.forEach((lang) => {
      expect(lang).toHaveProperty("id");
      expect(lang).toHaveProperty("title");
    });
  });
});
