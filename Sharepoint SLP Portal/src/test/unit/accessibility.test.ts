/**
 * Unit tests for accessibility utilities
 * Tests WCAG 2.1 AA compliance including contrast ratios, keyboard navigation, and semantic HTML
 */

import { describe, it, expect } from "vitest";
import {
  getRelativeLuminance,
  hexToRgb,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  validateContrast,
  ACCESSIBLE_COLORS,
  checkAriaLabels,
  hasAssociatedLabel,
  hasAltText,
  checkHeadingHierarchy,
  isKeyboardAccessible,
} from "../../utils/accessibility";

describe("Accessibility Utilities", () => {
  describe("Color Contrast - Luminance Calculation", () => {
    it("should calculate relative luminance for white", () => {
      const luminance = getRelativeLuminance(255, 255, 255);
      expect(luminance).toBe(1);
    });

    it("should calculate relative luminance for black", () => {
      const luminance = getRelativeLuminance(0, 0, 0);
      expect(luminance).toBe(0);
    });

    it("should calculate relative luminance for gray", () => {
      const luminance = getRelativeLuminance(128, 128, 128);
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });

    it("should calculate relative luminance for red", () => {
      const luminance = getRelativeLuminance(255, 0, 0);
      expect(luminance).toBeGreaterThan(0);
    });
  });

  describe("Color Parsing", () => {
    it("should parse valid hex color", () => {
      const rgb = hexToRgb("#FFFFFF");
      expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should parse hex color without hash", () => {
      const rgb = hexToRgb("000000");
      expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should handle lowercase hex", () => {
      const rgb = hexToRgb("#ffffff");
      expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should return null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#GGG")).toBeNull();
    });
  });

  describe("Contrast Ratio Calculation", () => {
    it("should calculate contrast ratio for black on white", () => {
      const ratio = getContrastRatio("#000000", "#FFFFFF");
      expect(ratio).toBe(21);
    });

    it("should calculate contrast ratio for white on black", () => {
      const ratio = getContrastRatio("#FFFFFF", "#000000");
      expect(ratio).toBe(21);
    });

    it("should calculate contrast ratio for blue on white", () => {
      const ratio = getContrastRatio("#0066CC", "#FFFFFF");
      expect(ratio).toBeGreaterThan(5);
      expect(ratio).toBeLessThan(6);
    });

    it("should be symmetric", () => {
      const ratio1 = getContrastRatio("#000000", "#FFFFFF");
      const ratio2 = getContrastRatio("#FFFFFF", "#000000");
      expect(ratio1).toBe(ratio2);
    });

    it("should return 0 for invalid colors", () => {
      const ratio = getContrastRatio("invalid", "#FFFFFF");
      expect(ratio).toBe(0);
    });
  });

  describe("WCAG AA Compliance", () => {
    it("should pass for black on white (normal text)", () => {
      expect(meetsWCAGAA(21, false)).toBe(true);
    });

    it("should pass for 4.5:1 ratio (normal text)", () => {
      expect(meetsWCAGAA(4.5, false)).toBe(true);
    });

    it("should fail for 4.4:1 ratio (normal text)", () => {
      expect(meetsWCAGAA(4.4, false)).toBe(false);
    });

    it("should pass for 3:1 ratio (large text)", () => {
      expect(meetsWCAGAA(3, true)).toBe(true);
    });

    it("should fail for 2.9:1 ratio (large text)", () => {
      expect(meetsWCAGAA(2.9, true)).toBe(false);
    });
  });

  describe("WCAG AAA Compliance", () => {
    it("should pass for black on white (normal text)", () => {
      expect(meetsWCAGAAA(21, false)).toBe(true);
    });

    it("should pass for 7:1 ratio (normal text)", () => {
      expect(meetsWCAGAAA(7, false)).toBe(true);
    });

    it("should fail for 6.9:1 ratio (normal text)", () => {
      expect(meetsWCAGAAA(6.9, false)).toBe(false);
    });

    it("should pass for 4.5:1 ratio (large text)", () => {
      expect(meetsWCAGAAA(4.5, true)).toBe(true);
    });

    it("should fail for 4.4:1 ratio (large text)", () => {
      expect(meetsWCAGAAA(4.4, true)).toBe(false);
    });
  });

  describe("Contrast Validation", () => {
    it("should validate black on white", () => {
      const result = validateContrast("#000000", "#FFFFFF");
      expect(result.ratio).toBe(21);
      expect(result.meetsAA).toBe(true);
      expect(result.meetsAAA).toBe(true);
    });

    it("should validate blue on white", () => {
      const result = validateContrast("#0066CC", "#FFFFFF");
      expect(result.meetsAA).toBe(true);
      expect(result.meetsAAA).toBe(false);
    });

    it("should validate large text separately", () => {
      const result = validateContrast("#666666", "#FFFFFF", true);
      expect(result.meetsAA).toBe(true);
    });

    it("should round ratio to 2 decimal places", () => {
      const result = validateContrast("#000000", "#FFFFFF");
      expect(
        result.ratio.toString().split(".")[1]?.length || 0,
      ).toBeLessThanOrEqual(2);
    });
  });

  describe("Accessible Color Combinations", () => {
    it("should have black on white", () => {
      expect(ACCESSIBLE_COLORS.blackOnWhite.ratio).toBe(21);
    });

    it("should have white on black", () => {
      expect(ACCESSIBLE_COLORS.whiteOnBlack.ratio).toBe(21);
    });

    it("should have slate on white", () => {
      expect(ACCESSIBLE_COLORS.slateOnWhite.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it("should have blue on white", () => {
      expect(ACCESSIBLE_COLORS.blueOnWhite.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it("all combinations should meet WCAG AA", () => {
      Object.values(ACCESSIBLE_COLORS).forEach((combo) => {
        expect(combo.ratio).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe("ARIA Labels", () => {
    it("should detect aria-label attribute", () => {
      const div = document.createElement("div");
      div.setAttribute("aria-label", "Test");
      const result = checkAriaLabels(div);
      expect(result.hasAriaLabel).toBe(true);
    });

    it("should detect aria-labelledby attribute", () => {
      const div = document.createElement("div");
      div.setAttribute("aria-labelledby", "label-id");
      const result = checkAriaLabels(div);
      expect(result.hasAriaLabelledBy).toBe(true);
    });

    it("should detect title attribute", () => {
      const div = document.createElement("div");
      div.setAttribute("title", "Test Title");
      const result = checkAriaLabels(div);
      expect(result.hasTitle).toBe(true);
    });

    it("should detect associated label", () => {
      const div = document.createElement("div");
      const label = document.createElement("label");
      label.textContent = "Test Label";
      div.appendChild(label);
      const result = checkAriaLabels(div);
      expect(result.hasLabel).toBe(true);
    });
  });

  describe("Form Label Association", () => {
    it("should find associated label", () => {
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

    it("should not find label for input without id", () => {
      const input = document.createElement("input");
      expect(hasAssociatedLabel(input)).toBe(false);
    });

    it("should not find label if not associated", () => {
      const input = document.createElement("input");
      input.id = "test-input";
      document.body.appendChild(input);

      expect(hasAssociatedLabel(input)).toBe(false);

      document.body.removeChild(input);
    });
  });

  describe("Alt Text", () => {
    it("should detect alt text", () => {
      const img = document.createElement("img");
      img.setAttribute("alt", "Test image");
      expect(hasAltText(img)).toBe(true);
    });

    it("should reject empty alt text", () => {
      const img = document.createElement("img");
      img.setAttribute("alt", "");
      expect(hasAltText(img)).toBe(false);
    });

    it("should reject missing alt attribute", () => {
      const img = document.createElement("img");
      expect(hasAltText(img)).toBe(false);
    });

    it("should reject whitespace-only alt text", () => {
      const img = document.createElement("img");
      img.setAttribute("alt", "   ");
      expect(hasAltText(img)).toBe(false);
    });
  });

  describe("Heading Hierarchy", () => {
    it("should detect proper heading hierarchy", () => {
      const div = document.createElement("div");
      div.innerHTML = "<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>";
      document.body.appendChild(div);

      const result = checkHeadingHierarchy();
      expect(result.hasH1).toBe(true);
      expect(result.headings.length).toBeGreaterThan(0);

      document.body.removeChild(div);
    });

    it("should detect missing h1", () => {
      const div = document.createElement("div");
      div.innerHTML = "<h2>Subtitle</h2><h3>Section</h3>";
      document.body.appendChild(div);

      const result = checkHeadingHierarchy();
      expect(result.hasH1).toBe(false);

      document.body.removeChild(div);
    });

    it("should detect skipped heading levels", () => {
      const div = document.createElement("div");
      div.innerHTML = "<h1>Title</h1><h3>Section</h3>";
      document.body.appendChild(div);

      const result = checkHeadingHierarchy();
      expect(result.isProper).toBe(false);

      document.body.removeChild(div);
    });
  });

  describe("Keyboard Accessibility", () => {
    it("should recognize button as keyboard accessible", () => {
      const button = document.createElement("button");
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    it("should recognize link as keyboard accessible", () => {
      const link = document.createElement("a");
      link.href = "#";
      expect(isKeyboardAccessible(link)).toBe(true);
    });

    it("should recognize input as keyboard accessible", () => {
      const input = document.createElement("input");
      expect(isKeyboardAccessible(input)).toBe(true);
    });

    it("should recognize element with role as keyboard accessible", () => {
      const div = document.createElement("div");
      div.setAttribute("role", "button");
      expect(isKeyboardAccessible(div)).toBe(true);
    });

    it("should recognize element with positive tabindex", () => {
      const div = document.createElement("div");
      div.setAttribute("tabindex", "0");
      expect(isKeyboardAccessible(div)).toBe(true);
    });

    it("should reject element with negative tabindex", () => {
      const div = document.createElement("div");
      div.setAttribute("tabindex", "-1");
      expect(isKeyboardAccessible(div)).toBe(false);
    });

    it("should reject non-interactive div", () => {
      const div = document.createElement("div");
      expect(isKeyboardAccessible(div)).toBe(false);
    });
  });

  describe("WCAG 2.1 AA Compliance Summary", () => {
    it("should have contrast utilities", () => {
      expect(getContrastRatio).toBeDefined();
      expect(meetsWCAGAA).toBeDefined();
      expect(validateContrast).toBeDefined();
    });

    it("should have keyboard accessibility utilities", () => {
      expect(isKeyboardAccessible).toBeDefined();
    });

    it("should have semantic HTML utilities", () => {
      expect(hasAltText).toBeDefined();
      expect(checkHeadingHierarchy).toBeDefined();
      expect(hasAssociatedLabel).toBeDefined();
    });

    it("should have ARIA utilities", () => {
      expect(checkAriaLabels).toBeDefined();
    });
  });
});
