/**
 * Accessibility — keyboard semantics, labels, roles (jsdom + Testing Library)
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function ClinicalNoteForm() {
  return (
    <form aria-label="Clinical documentation note">
      <label htmlFor="clinical-note">Clinical note</label>
      <textarea
        id="clinical-note"
        required
        aria-required="true"
        placeholder="Enter assessment findings"
      />
      <button type="button">Save draft</button>
      <button type="submit">Submit for review</button>
    </form>
  );
}

describe("Accessibility: forms & controls", () => {
  it("associates label with textarea via id/for", () => {
    render(<ClinicalNoteForm />);
    const field = screen.getByRole("textbox", { name: /clinical note/i });
    expect(field).toHaveAttribute("id", "clinical-note");
    expect(field).toHaveAttribute("aria-required", "true");
  });

  it("exposes two distinct buttons with accessible names", () => {
    render(<ClinicalNoteForm />);
    expect(
      screen.getByRole("button", { name: /save draft/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit for review/i }),
    ).toBeInTheDocument();
  });

  it("moves focus from first button to second with Tab", async () => {
    const user = userEvent.setup();
    render(<ClinicalNoteForm />);
    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /save draft/i })).toHaveFocus();
    await user.tab();
    expect(
      screen.getByRole("button", { name: /submit for review/i }),
    ).toHaveFocus();
  });

  it("form has an accessible name", () => {
    render(<ClinicalNoteForm />);
    expect(
      screen.getByRole("form", { name: /clinical documentation note/i }),
    ).toBeInTheDocument();
  });
});

describe("Accessibility: contrast helper (relative luminance)", () => {
  it("computes higher luminance for white than for black", () => {
    const relL = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      const r = ((n >> 16) & 0xff) / 255;
      const g = ((n >> 8) & 0xff) / 255;
      const b = (n & 0xff) / 255;
      const f = (c: number) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    expect(relL("#ffffff")).toBeGreaterThan(relL("#000000"));
  });
});
