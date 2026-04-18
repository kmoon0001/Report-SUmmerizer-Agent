import { describe, it, expect } from "vitest";
import { GOAL_BANK } from "./goal-bank";

describe("Goal Bank Data", () => {
  it("has required domains", () => {
    const domains = [
      "Swallowing",
      "Expressive Language",
      "Memory",
      "Motor Speech",
    ];
    domains.forEach((domain) => {
      expect(GOAL_BANK).toHaveProperty(domain);
      expect(
        GOAL_BANK[domain as keyof typeof GOAL_BANK]?.length,
      ).toBeGreaterThan(0);
    });
  });

  it("goals have text content", () => {
    Object.values(GOAL_BANK)
      .flat()
      .forEach((goal) => {
        expect(goal.text).toBeTruthy();
        expect(typeof goal.text).toBe("string");
        expect(goal.text.length).toBeGreaterThan(10);
      });
  });
});
