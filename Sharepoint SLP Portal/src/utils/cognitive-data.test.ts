import { describe, it, expect } from "vitest";
import {
  COGNITIVE_TASKS_DATA,
  getRandomTask,
  getAllTasks,
} from "./cognitive-data";

describe("Cognitive Data", () => {
  it("has valid structure for all domains", () => {
    const domains = Object.keys(COGNITIVE_TASKS_DATA);
    expect(domains).toContain("Memory");
    expect(domains).toContain("Attention");
    expect(domains).toContain("Problem Solving");

    domains.forEach((domain) => {
      const tasks = COGNITIVE_TASKS_DATA[domain];
      expect(tasks?.length).toBeGreaterThan(0);
      tasks?.forEach((task) => {
        expect(task).toHaveProperty("level");
        expect(task).toHaveProperty("task");
        expect(task).toHaveProperty("handout");
      });
    });
  });

  it("getRandomTask returns a task from the specified domain", () => {
    const task = getRandomTask("Memory");
    expect(task).toBeDefined();
    expect(COGNITIVE_TASKS_DATA["Memory"]).toContain(task);
  });

  it("getAllTasks returns all tasks flattened with domain", () => {
    const allTasks = getAllTasks();
    const totalTasks = Object.values(COGNITIVE_TASKS_DATA).reduce(
      (acc, tasks) => acc + tasks.length,
      0,
    );
    expect(allTasks).toHaveLength(totalTasks);
    allTasks.forEach((task) => {
      expect(task).toHaveProperty("domain");
      expect(Object.keys(COGNITIVE_TASKS_DATA)).toContain(task.domain);
    });
  });
});
