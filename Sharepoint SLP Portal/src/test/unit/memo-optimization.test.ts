import { describe, it, expect, vi } from "vitest";
import React from "react";
import {
  deepPropsEqual,
  shallowPropsEqual,
  memoizeComponent,
  useMemoized,
  useMemoizedCallback,
  useComponentMetrics,
  EXPENSIVE_COMPONENTS,
  shouldMemoize,
} from "../../utils/memo-optimization";

describe("Memo Optimization", () => {
  describe("deepPropsEqual", () => {
    it("should return true for identical primitive props", () => {
      const props1 = { a: 1, b: "test", c: true };
      const props2 = { a: 1, b: "test", c: true };
      expect(deepPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false for different primitive props", () => {
      const props1 = { a: 1, b: "test" };
      const props2 = { a: 2, b: "test" };
      expect(deepPropsEqual(props1, props2)).toBe(false);
    });

    it("should return true for identical object props", () => {
      const props1 = { data: { x: 1, y: 2 } };
      const props2 = { data: { x: 1, y: 2 } };
      expect(deepPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false for different object props", () => {
      const props1 = { data: { x: 1 } };
      const props2 = { data: { x: 2 } };
      expect(deepPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false for different key counts", () => {
      const props1 = { a: 1, b: 2 };
      const props2 = { a: 1 };
      expect(deepPropsEqual(props1, props2)).toBe(false);
    });

    it("should handle function props by reference", () => {
      const fn = () => {};
      const props1 = { callback: fn };
      const props2 = { callback: fn };
      expect(deepPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false for different function references", () => {
      const props1 = { callback: () => {} };
      const props2 = { callback: () => {} };
      expect(deepPropsEqual(props1, props2)).toBe(false);
    });
  });

  describe("shallowPropsEqual", () => {
    it("should return true for identical shallow props", () => {
      const props1 = { a: 1, b: "test" };
      const props2 = { a: 1, b: "test" };
      expect(shallowPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false for different shallow props", () => {
      const props1 = { a: 1, b: "test" };
      const props2 = { a: 2, b: "test" };
      expect(shallowPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false for different object references", () => {
      const props1 = { data: { x: 1 } };
      const props2 = { data: { x: 1 } };
      expect(shallowPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false for different key counts", () => {
      const props1 = { a: 1, b: 2 };
      const props2 = { a: 1 };
      expect(shallowPropsEqual(props1, props2)).toBe(false);
    });
  });

  describe("memoizeComponent", () => {
    it("should return a memoized component", () => {
      const TestComponent = ({ value }: { value: string }) =>
        React.createElement("div", null, value);
      const MemoizedComponent = memoizeComponent(TestComponent);
      expect(MemoizedComponent).toBeDefined();
      expect(MemoizedComponent.$$typeof).toBeDefined();
    });

    it("should accept custom comparison function", () => {
      const TestComponent = ({ value }: { value: string }) =>
        React.createElement("div", null, value);
      const customCompare = (prev: any, next: any) => prev.value === next.value;
      const MemoizedComponent = memoizeComponent(TestComponent, customCompare);
      expect(MemoizedComponent).toBeDefined();
    });
  });

  describe("EXPENSIVE_COMPONENTS", () => {
    it("should contain expected component names", () => {
      expect(EXPENSIVE_COMPONENTS).toContain("ClinicalLibrary");
      expect(EXPENSIVE_COMPONENTS).toContain("Dashboard");
      expect(EXPENSIVE_COMPONENTS).toContain("HealthMonitor");
    });

    it("should be an array", () => {
      expect(Array.isArray(EXPENSIVE_COMPONENTS)).toBe(true);
    });
  });

  describe("shouldMemoize", () => {
    it("should return true for expensive components", () => {
      expect(shouldMemoize("ClinicalLibrary")).toBe(true);
      expect(shouldMemoize("Dashboard")).toBe(true);
    });

    it("should return false for non-expensive components", () => {
      expect(shouldMemoize("Button")).toBe(false);
      expect(shouldMemoize("Input")).toBe(false);
    });
  });

  describe("useMemoized", () => {
    it("should be a function", () => {
      expect(typeof useMemoized).toBe("function");
    });
  });

  describe("useMemoizedCallback", () => {
    it("should be a function", () => {
      expect(typeof useMemoizedCallback).toBe("function");
    });
  });

  describe("useComponentMetrics", () => {
    it("should be a function", () => {
      expect(typeof useComponentMetrics).toBe("function");
    });
  });
});
