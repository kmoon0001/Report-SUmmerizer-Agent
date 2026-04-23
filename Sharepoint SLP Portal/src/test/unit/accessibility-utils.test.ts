import { describe, it, expect } from "vitest";
import {
  getRelativeLuminance,
  hexToRgb,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  validateContrast,
  checkAriaLabels,
  hasAssociatedLabel,
  isKeyboardAccessible,
  hasAltText,
  checkHeadingHierarchy,
  generateAccessibilityReport,
  ACCESSIBLE_COLORS,
} from "../../utils/accessibility";

describe("accessibility utils", () => {
  describe("hexToRgb", () => {
    it("parses white", () =>
      expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 }));
    it("parses black", () =>
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 }));
    it("parses without hash", () =>
      expect(hexToRgb("FF0000")).toEqual({ r: 255, g: 0, b: 0 }));
    it("returns null for invalid", () =>
      expect(hexToRgb("invalid")).toBeNull());
  });

  describe("getRelativeLuminance", () => {
    it("white has luminance 1", () =>
      expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 2));
    it("black has luminance 0", () =>
      expect(getRelativeLuminance(0, 0, 0)).toBe(0));
  });

  describe("getContrastRatio", () => {
    it("black on white is 21:1", () =>
      expect(getContrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0));
    it("same color is 1:1", () =>
      expect(getContrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 1));
    it("returns 0 for invalid colors", () =>
      expect(getContrastRatio("bad", "bad")).toBe(0));
  });

  describe("meetsWCAGAA", () => {
    it("4.5 meets AA for normal text", () =>
      expect(meetsWCAGAA(4.5)).toBe(true));
    it("4.4 fails AA for normal text", () =>
      expect(meetsWCAGAA(4.4)).toBe(false));
    it("3.0 meets AA for large text", () =>
      expect(meetsWCAGAA(3.0, true)).toBe(true));
    it("2.9 fails AA for large text", () =>
      expect(meetsWCAGAA(2.9, true)).toBe(false));
  });

  describe("meetsWCAGAAA", () => {
    it("7.0 meets AAA for normal text", () =>
      expect(meetsWCAGAAA(7.0)).toBe(true));
    it("6.9 fails AAA for normal text", () =>
      expect(meetsWCAGAAA(6.9)).toBe(false));
    it("4.5 meets AAA for large text", () =>
      expect(meetsWCAGAAA(4.5, true)).toBe(true));
  });

  describe("validateContrast", () => {
    it("returns ratio and compliance for black/white", () => {
      const result = validateContrast("#000000", "#FFFFFF");
      expect(result.ratio).toBeGreaterThan(20);
      expect(result.meetsAA).toBe(true);
      expect(result.meetsAAA).toBe(true);
    });
    it("low contrast fails both", () => {
      const result = validateContrast("#CCCCCC", "#FFFFFF");
      expect(result.meetsAA).toBe(false);
      expect(result.meetsAAA).toBe(false);
    });
  });

  describe("ACCESSIBLE_COLORS", () => {
    it("has blackOnWhite entry", () =>
      expect(ACCESSIBLE_COLORS.blackOnWhite.ratio).toBe(21));
    it("has blueOnWhite entry", () =>
      expect(ACCESSIBLE_COLORS.blueOnWhite).toBeDefined());
  });

  describe("checkAriaLabels", () => {
    it("detects aria-label", () => {
      const el = document.createElement("div");
      el.setAttribute("aria-label", "test");
      const result = checkAriaLabels(el);
      expect(result.hasAriaLabel).toBe(true);
      expect(result.hasLabel).toBe(false);
    });
    it("detects aria-labelledby", () => {
      const el = document.createElement("div");
      el.setAttribute("aria-labelledby", "some-id");
      expect(checkAriaLabels(el).hasAriaLabelledBy).toBe(true);
    });
    it("detects title", () => {
      const el = document.createElement("div");
      el.setAttribute("title", "tooltip");
      expect(checkAriaLabels(el).hasTitle).toBe(true);
    });
  });

  describe("hasAssociatedLabel", () => {
    it("returns false when input has no id", () => {
      const input = document.createElement("input");
      expect(hasAssociatedLabel(input)).toBe(false);
    });
    it("returns true when label[for] matches input id", () => {
      const input = document.createElement("input");
      input.id = "test-input";
      const label = document.createElement("label");
      label.setAttribute("for", "test-input");
      document.body.appendChild(input);
      document.body.appendChild(label);
      expect(hasAssociatedLabel(input)).toBe(true);
      document.body.removeChild(input);
      document.body.removeChild(label);
    });
  });

  describe("isKeyboardAccessible", () => {
    it("button is keyboard accessible", () => {
      const btn = document.createElement("button");
      expect(isKeyboardAccessible(btn)).toBe(true);
    });
    it("div with tabindex=0 is accessible", () => {
      const div = document.createElement("div");
      div.setAttribute("tabindex", "0");
      expect(isKeyboardAccessible(div)).toBe(true);
    });
    it("div with role is accessible", () => {
      const div = document.createElement("div");
      div.setAttribute("role", "button");
      expect(isKeyboardAccessible(div)).toBe(true);
    });
    it("plain div is not accessible", () => {
      const div = document.createElement("div");
      expect(isKeyboardAccessible(div)).toBe(false);
    });
  });

  describe("hasAltText", () => {
    it("returns true for img with alt", () => {
      const img = document.createElement("img");
      img.setAttribute("alt", "A photo");
      expect(hasAltText(img)).toBe(true);
    });
    it("returns false for img without alt", () => {
      const img = document.createElement("img");
      expect(hasAltText(img)).toBe(false);
    });
    it("returns false for empty alt", () => {
      const img = document.createElement("img");
      img.setAttribute("alt", "   ");
      expect(hasAltText(img)).toBe(false);
    });
  });

  describe("checkHeadingHierarchy", () => {
    it("detects missing H1", () => {
      const result = checkHeadingHierarchy();
      // jsdom starts clean — no headings
      expect(result.hasH1).toBe(false);
    });
    it("returns headings array", () => {
      const h1 = document.createElement("h1");
      h1.textContent = "Title";
      document.body.appendChild(h1);
      const result = checkHeadingHierarchy();
      expect(result.hasH1).toBe(true);
      expect(result.headings.some((h) => h.level === 1)).toBe(true);
      document.body.removeChild(h1);
    });
  });

  describe("generateAccessibilityReport", () => {
    it("returns a report object with all fields", () => {
      const report = generateAccessibilityReport();
      expect(report).toHaveProperty("contrastIssues");
      expect(report).toHaveProperty("keyboardIssues");
      expect(report).toHaveProperty("altTextIssues");
      expect(report).toHaveProperty("headingIssues");
      expect(report).toHaveProperty("flashingIssues");
      expect(report).toHaveProperty("summary");
      expect(typeof report.summary).toBe("string");
    });
  });
});
