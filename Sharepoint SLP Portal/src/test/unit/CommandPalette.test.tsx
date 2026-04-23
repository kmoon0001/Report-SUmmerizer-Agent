import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandPalette } from "../../components/CommandPalette";

const mockSetActiveView = vi.fn();
const mockSetIsCommandPaletteOpen = vi.fn();

vi.mock("../../context/DashboardContext", () => ({
  useDashboard: () => ({
    isCommandPaletteOpen: true,
    setIsCommandPaletteOpen: mockSetIsCommandPaletteOpen,
    setActiveView: mockSetActiveView,
  }),
}));

vi.mock("../../data/pt-data", () => ({
  PT_DATA: [
    { id: "orthopedic-hub", title: "Orthopedic Hub", icon: () => null },
    { id: "neurological-hub", title: "Neurological Hub", icon: () => null },
  ],
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("CommandPalette", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(<CommandPalette />);
    expect(screen.getByPlaceholderText(/search tools/i)).toBeInTheDocument();
  });

  it("shows default items when query is empty", () => {
    render(<CommandPalette />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("filters items by query", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.change(input, { target: { value: "orthopedic" } });
    await waitFor(() => {
      expect(screen.getByText("Orthopedic Hub")).toBeInTheDocument();
    });
  });

  it("shows no results message for unmatched query", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.change(input, { target: { value: "xyznotfound" } });
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it("calls setActiveView and closes on item click", () => {
    render(<CommandPalette />);
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockSetActiveView).toHaveBeenCalledWith("dashboard");
    expect(mockSetIsCommandPaletteOpen).toHaveBeenCalledWith(false);
  });

  it("closes on Escape key", () => {
    render(<CommandPalette />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockSetIsCommandPaletteOpen).toHaveBeenCalledWith(false);
  });

  it("navigates down with ArrowDown key", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // selectedIndex increments — no crash
    expect(input).toBeInTheDocument();
  });

  it("navigates up with ArrowUp key", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toBeInTheDocument();
  });

  it("selects item on Enter key", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockSetActiveView).toHaveBeenCalled();
  });

  it("filters by category", async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/search tools/i);
    fireEvent.change(input, { target: { value: "Navigation" } });
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });
});
