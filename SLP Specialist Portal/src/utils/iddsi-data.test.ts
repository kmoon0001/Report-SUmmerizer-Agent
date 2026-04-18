import { describe, it, expect } from "vitest";
import {
  IDDSI_LEVELS,
  filterIDDSILevels,
} from "./iddsi-data";

describe("IDDSI Data", () => {
  it("contains 8 levels (0-7)", () => {
    expect(IDDSI_LEVELS).toHaveLength(8);
    const levels = IDDSI_LEVELS.map((l: any) => l.level).sort((a: any, b: any) => a - b);
    expect(levels).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("has correct data structure for each level", () => {
    IDDSI_LEVELS.forEach((level: any) => {
      expect(level).toHaveProperty("name");
      expect(level).toHaveProperty("color");
      expect(level).toHaveProperty("desc");
      expect(level).toHaveProperty("testing");
      expect(level).toHaveProperty("examples");
      expect(level).toHaveProperty("handout");
      expect(level).toHaveProperty("image");
    });
  });
});

describe("filterIDDSILevels", () => {
  it("returns all levels when query is empty", () => {
    const allLevels = filterIDDSILevels("");
    expect(allLevels.length).toBe(8);
    expect(Array.isArray(allLevels)).toBe(true);
  });

  it("filters by name (case insensitive)", () => {
    const results = filterIDDSILevels("pureed");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r: any) => r.level === 4)).toBe(true);
  });

  it("filters by level number", () => {
    const results = filterIDDSILevels("7");
    expect(results.length).toBe(1);
    expect(results[0]?.level).toBe(7);
  });

  it("filters by description", () => {
    const results = filterIDDSILevels("syringe");
    // Levels 0, 1, 2, 3 mention syringe in testing/desc
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for no matches", () => {
    expect(filterIDDSILevels("xyz123")).toHaveLength(0);
  });
});
