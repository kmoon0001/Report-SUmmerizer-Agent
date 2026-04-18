import { describe, it, expect, vi } from "vitest";
import {
  generateHEP,
  generateProgressReport,
  generateClinicalReport,
} from "./pdf-generator";

// Mock jspdf-autotable
vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));

// Mock jsPDF
vi.mock("jspdf", () => {
  const mockJsPDF = function () {
    return {
      setFillColor: vi.fn(),
      rect: vi.fn(),
      roundedRect: vi.fn(),
      setTextColor: vi.fn(),
      setFontSize: vi.fn(),
      setFont: vi.fn(),
      text: vi.fn(),
      setDrawColor: vi.fn(),
      line: vi.fn(),
      splitTextToSize: vi.fn().mockReturnValue(["line 1", "line 2"]),
      addPage: vi.fn(),
      save: vi.fn(),
      autoTable: vi.fn(),
      addImage: vi.fn(),
      lastAutoTable: { finalY: 100 },
    };
  };
  return { default: mockJsPDF };
});

describe("PDF Generator", () => {
  it("generates HEP correctly", () => {
    expect(() => generateHEP("Test Title", ["Step 1", "Step 2"])).not.toThrow();
  });

  it("generates Clinical Report correctly", () => {
    expect(() =>
      generateClinicalReport("John Doe", "2023-10-27", "SOAP Note", {
        s: "s",
        o: "o",
        a: "a",
        p: "p",
      }),
    ).not.toThrow();
  });

  it("generates Progress Report correctly", () => {
    expect(() =>
      generateProgressReport("John Doe", "data:image/png;base64,test", [
        { label: "Test", value: "10", trend: "Up" },
      ]),
    ).not.toThrow();
  });
});
