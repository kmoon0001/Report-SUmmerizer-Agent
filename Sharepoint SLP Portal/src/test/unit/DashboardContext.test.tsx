import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  DashboardProvider,
  useDashboard,
} from "../../context/DashboardContext";

const TestConsumer: React.FC = () => {
  const d = useDashboard();
  return (
    <div>
      <span data-testid="view">{d.activeView}</span>
      <span data-testid="sidebar">{String(d.isSidebarOpen)}</span>
      <span data-testid="pinned">{String(d.isSidebarPinned)}</span>
      <span data-testid="favs">{d.favorites.join(",")}</span>
      <span data-testid="cmd">{String(d.isCommandPaletteOpen)}</span>
      <button onClick={() => d.setActiveView("orthopedic-hub")}>nav</button>
      <button
        onClick={() => d.setActiveView("goal-generator", { preset: "ortho" })}
      >
        navParams
      </button>
      <button onClick={() => d.setIsSidebarOpen(false)}>closeSidebar</button>
      <button onClick={() => d.setIsSidebarPinned(false)}>unpin</button>
      <button onClick={() => d.toggleFavorite("ortho")}>fav</button>
      <button onClick={() => d.setIsCommandPaletteOpen(true)}>openCmd</button>
    </div>
  );
};

describe("DashboardContext", () => {
  it("provides default values", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    expect(screen.getByTestId("view").textContent).toBe("dashboard");
    expect(screen.getByTestId("sidebar").textContent).toBe("true");
    expect(screen.getByTestId("pinned").textContent).toBe("true");
    expect(screen.getByTestId("favs").textContent).toBe("");
  });

  it("setActiveView updates view", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("nav"));
    expect(screen.getByTestId("view").textContent).toBe("orthopedic-hub");
  });

  it("setActiveView with params works", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("navParams"));
    expect(screen.getByTestId("view").textContent).toBe("goal-generator");
  });

  it("setIsSidebarOpen updates sidebar state", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("closeSidebar"));
    expect(screen.getByTestId("sidebar").textContent).toBe("false");
  });

  it("setIsSidebarPinned updates pinned state", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("unpin"));
    expect(screen.getByTestId("pinned").textContent).toBe("false");
  });

  it("toggleFavorite adds a favorite", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("fav"));
    expect(screen.getByTestId("favs").textContent).toBe("ortho");
  });

  it("toggleFavorite removes an existing favorite", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("fav"));
    fireEvent.click(screen.getByText("fav"));
    expect(screen.getByTestId("favs").textContent).toBe("");
  });

  it("setIsCommandPaletteOpen opens command palette", () => {
    render(
      <DashboardProvider>
        <TestConsumer />
      </DashboardProvider>,
    );
    fireEvent.click(screen.getByText("openCmd"));
    expect(screen.getByTestId("cmd").textContent).toBe("true");
  });

  it("useDashboard throws outside provider", () => {
    const Bad = () => {
      useDashboard();
      return null;
    };
    expect(() => render(<Bad />)).toThrow(
      "useDashboard must be used within a DashboardProvider",
    );
  });
});
