import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrintHeader } from "./PrintHeader";

describe("PrintHeader Component", () => {
  it("renders correctly with title", () => {
    render(<PrintHeader title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText(/SLP/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Resources/i)).toBeInTheDocument();
  });

  it("renders correctly with subtitle", () => {
    render(<PrintHeader title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });
});
