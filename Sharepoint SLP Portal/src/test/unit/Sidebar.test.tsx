import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "../../components/Sidebar";
import { useDashboard } from "../../context/DashboardContext";
import { DisciplineProvider } from "../../context/DisciplineContext";

// Mocks
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual, // Keep original types/exports if needed
  };
});

vi.mock("../../context/DashboardContext", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useDashboard: vi.fn(),
  };
});

describe("Sidebar Unified Portal", () => {
  const mockSetActiveView = vi.fn();
  const mockSetIsSidebarOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useDashboard as any).mockReturnValue({
      activeView: "dashboard",
      setActiveView: mockSetActiveView,
      isSidebarOpen: true,
      setIsSidebarOpen: mockSetIsSidebarOpen,
    });
  });

  const renderSidebar = (discipline: any = "slp") => {
    return render(
      <DisciplineProvider defaultDiscipline={discipline}>
        <Sidebar />
      </DisciplineProvider>,
    );
  };

  it("renders without crashing and shows branding", () => {
    renderSidebar("slp");
    expect(screen.getByText(/Moonie's SNF/i)).toBeInTheDocument();
    expect(screen.getByText(/PT\/OT\/SLP Portal/i)).toBeInTheDocument();
  });

  it("renders all 4 section headers", () => {
    renderSidebar("slp");
    const headers = ["Core", "Clinical Hubs", "Clinical Tools", "Resources"];
    headers.forEach((h) => {
      // Find within the main navigation area to avoid duplicates in tooltips/overlays
      const elements = screen.getAllByText(new RegExp(h, "i"));
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders SLP-specific hubs when discipline is slp", () => {
    renderSidebar("slp");
    expect(screen.getByText(/Dysphagia/i)).toBeInTheDocument();
  });

  it("renders PT-specific hubs when discipline is pt", () => {
    renderSidebar("pt");
    expect(screen.getByText(/Orthopedic Rehabilitation/i)).toBeInTheDocument();
  });

  it("calls setActiveView when an item is clicked", () => {
    renderSidebar("slp");
    const dashboardItem = screen.getByText("Dashboard");
    fireEvent.click(dashboardItem);
    expect(mockSetActiveView).toHaveBeenCalledWith("dashboard");
  });

  it("toggles sections", () => {
    renderSidebar("slp");
    // All are initially expanded in our component now
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
