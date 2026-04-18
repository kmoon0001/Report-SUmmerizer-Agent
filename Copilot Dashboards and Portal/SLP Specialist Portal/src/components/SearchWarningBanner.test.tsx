import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchWarningBanner } from "./SearchWarningBanner";
import { SearchProvider } from "../context/SearchContext";

describe("SearchWarningBanner Component", () => {
  it("renders correctly", () => {
    render(
      <SearchProvider>
        <SearchWarningBanner />
      </SearchProvider>,
    );
    expect(screen.getByText("Internet Research Mode")).toBeInTheDocument();
    expect(
      screen.getByText(/AI is restricted to internal/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enable/i })).toBeInTheDocument();
  });

  it("toggles search mode when button is clicked", async () => {
    render(
      <SearchProvider>
        <SearchWarningBanner />
      </SearchProvider>,
    );

    const button = screen.getByRole("button", { name: /Enable/i });
    fireEvent.click(button);

    // After clicking, the button should change to "Disable" and text should update
    expect(screen.getByText(/AI may search the public/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Disable/i }),
    ).toBeInTheDocument();
  });
});
