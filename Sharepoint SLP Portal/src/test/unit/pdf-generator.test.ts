import { describe, it, expect, vi } from "vitest";
import {
  generateHEP,
  generateClinicalReport,
  generateProgressReport,
} from "../../utils/pdf-generator";

vi.mock("jspdf", () => {
  const mockInstance = {
    setFillColor: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    setTextColor: vi.fn().mockReturnThis(),
    setFontSize: vi.fn().mockReturnThis(),
    setFont: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    setDrawColor: vi.fn().mockReturnThis(),
    line: vi.fn().mockReturnThis(),
    roundedRect: vi.fn().mockReturnThis(),
    splitTextToSize: vi.fn().mockImplementation((text) => [text]),
    addPage: vi.fn().mockReturnThis(),
    save: vi.fn().mockReturnValue(new Uint8Array()),
    addImage: vi.fn().mockReturnThis(),
  };

  class MockjsPDF {
    setFillColor = mockInstance.setFillColor;
    rect = mockInstance.rect;
    setTextColor = mockInstance.setTextColor;
    setFontSize = mockInstance.setFontSize;
    setFont = mockInstance.setFont;
    text = mockInstance.text;
    setDrawColor = mockInstance.setDrawColor;
    line = mockInstance.line;
    roundedRect = mockInstance.roundedRect;
    splitTextToSize = mockInstance.splitTextToSize;
    addPage = mockInstance.addPage;
    save = mockInstance.save;
    addImage = mockInstance.addImage;
  }

  return {
    default: MockjsPDF,
  };
});

vi.mock("jspdf-autotable", () => ({}));

describe("pdf-generator", () => {
  it("generateHEP does not throw", () => {
    expect(() =>
      generateHEP("Test HEP", ["Exercise 1", "Exercise 2"]),
    ).not.toThrow();
  });

  it("generateClinicalReport does not throw", () => {
    expect(() =>
      generateClinicalReport("John Doe", "01/01/2024", "Eval Template", {
        subjective: "Patient reports pain.",
        objective: "Decreased ROM.",
        assessment: "Impaired mobility.",
        plan: "Continue PT.",
      }),
    ).not.toThrow();
  });

  it("generateProgressReport does not throw", () => {
    expect(() =>
      generateProgressReport(
        "John Doe",
        "data:image/png;base64,iVBORw0KGgo...",
        [
          { label: "Visits", value: "12" },
          { label: "Progress", value: "80%" },
        ],
      ),
    ).not.toThrow();
  });
});
