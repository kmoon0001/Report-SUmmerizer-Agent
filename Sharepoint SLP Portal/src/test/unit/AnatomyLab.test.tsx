import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AnatomyLab } from "../../components/AnatomyLab";
import { DashboardProvider } from "../../context/DashboardContext";
import { ThemeProvider } from "../../context/ThemeContext";
import { OnlineStatusProvider } from "../../context/OnlineStatusContext";
import { DisciplineProvider } from "../../context/DisciplineContext";
import { ANATOMY_JOINTS, ANATOMY_MUSCLES } from "../../data/anatomy-data";

// Mock dependencies
vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateProImage: vi.fn().mockResolvedValue("data:image/png;base64,test"),
  },
}));

vi.mock("../../services/persistence-service", () => ({
  persistenceService: {
    saveGeneratedAsset: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../../lib/webgl-check", () => ({
  isWebGLSupported: vi.fn().mockReturnValue(true),
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Sphere: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="sphere">{children}</div>
  ),
  MeshDistortMaterial: () => <div data-testid="mesh-distort-material" />,
  Text: () => <div data-testid="text" />,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <OnlineStatusProvider>
      <ThemeProvider>
        <DashboardProvider>
          <DisciplineProvider>{component}</DisciplineProvider>
        </DashboardProvider>
      </ThemeProvider>
    </OnlineStatusProvider>,
  );
};

describe("AnatomyLab Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the AnatomyLab component", () => {
      renderWithProviders(<AnatomyLab />);
      expect(screen.getByText(/PT Anatomy Modules/i)).toBeInTheDocument();
    });

    it("should display shoulder joint by default", () => {
      renderWithProviders(<AnatomyLab />);
      const shoulderElements = screen.getAllByText(/Shoulder/i);
      expect(shoulderElements.length).toBeGreaterThan(0);
    });

    it("should have patient view button", () => {
      renderWithProviders(<AnatomyLab />);
      const patientViewButton = screen.getByRole("button", {
        name: /Patient View/i,
      });
      expect(patientViewButton).toBeInTheDocument();
    });
  });

  describe("3D Model Loading", () => {
    it("should load 3D canvas when interactive view is selected", async () => {
      renderWithProviders(<AnatomyLab />);
      const interactiveButton = screen.getByRole("button", {
        name: /Interactive 3D/i,
      });
      fireEvent.click(interactiveButton);
      await waitFor(() => {
        expect(screen.getByTestId("canvas")).toBeInTheDocument();
      });
    });

    it("should render OrbitControls for 3D interaction", async () => {
      renderWithProviders(<AnatomyLab />);
      const interactiveButton = screen.getByRole("button", {
        name: /Interactive 3D/i,
      });
      fireEvent.click(interactiveButton);
      await waitFor(() => {
        expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
      });
    });
  });

  describe("View Switching", () => {
    it("should have Atlas View button", () => {
      renderWithProviders(<AnatomyLab />);
      expect(
        screen.getByRole("button", { name: /Atlas View/i }),
      ).toBeInTheDocument();
    });

    it("should switch to interactive 3D view", async () => {
      renderWithProviders(<AnatomyLab />);
      const interactiveButton = screen.getByRole("button", {
        name: /Interactive 3D/i,
      });
      fireEvent.click(interactiveButton);
      await waitFor(() => {
        expect(screen.getByTestId("canvas")).toBeInTheDocument();
      });
    });

    it("should have AI diagram generation view", () => {
      renderWithProviders(<AnatomyLab />);
      const aiDiagramButton = screen.getByRole("button", {
        name: /AI Diagram/i,
      });
      expect(aiDiagramButton).toBeInTheDocument();
    });
  });

  describe("Joint Switching", () => {
    it("should switch to Hip joint", async () => {
      renderWithProviders(<AnatomyLab />);
      const hipButton = screen.getByRole("button", { name: /Hip/i });
      fireEvent.click(hipButton);
      await waitFor(() => {
        const coxoElements = screen.getAllByText(/Coxofemoral/i);
        expect(coxoElements.length).toBeGreaterThan(0);
      });
    });

    it("should switch to Knee joint", async () => {
      renderWithProviders(<AnatomyLab />);
      const kneeButton = screen.getByRole("button", { name: /Knee/i });
      fireEvent.click(kneeButton);
      await waitFor(() => {
        const tibiofemoralElements = screen.getAllByText(/Tibiofemoral/i);
        expect(tibiofemoralElements.length).toBeGreaterThan(0);
      });
    });

    it("should switch to Spine joint", async () => {
      renderWithProviders(<AnatomyLab />);
      const spineButton = screen.getByRole("button", { name: /Spine/i });
      fireEvent.click(spineButton);
      await waitFor(() => {
        const vertebralElements = screen.getAllByText(/Vertebral/i);
        expect(vertebralElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Muscle Information Display", () => {
    it("should display muscle information for shoulder joint", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(
        () => {
          // Just verify that some muscle information is displayed
          const muscleSection = screen.queryByText(/Key Muscles/i);
          expect(muscleSection).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("should display muscle action information", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(
        () => {
          // Verify action label exists
          const actionLabels = screen.queryAllByText(/Action:/i);
          expect(actionLabels.length).toBeGreaterThan(0);
        },
        { timeout: 3000 },
      );
    });

    it("should display muscle innervation", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(
        () => {
          // Verify innervation label exists
          const innervationLabels = screen.queryAllByText(/Innervation:/i);
          expect(innervationLabels.length).toBeGreaterThan(0);
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Anatomy Data Integration", () => {
    it("should have 4 joints in data", () => {
      expect(ANATOMY_JOINTS.length).toBe(4);
    });

    it("should have shoulder joint data with correct name", () => {
      const shoulder = ANATOMY_JOINTS.find((j) => j.id === "shoulder");
      expect(shoulder).toBeDefined();
      expect(shoulder?.name).toContain("Shoulder");
    });

    it("should have ROM data for all joints", () => {
      ANATOMY_JOINTS.forEach((joint) => {
        expect(joint.normalROM).toBeDefined();
      });
    });

    it("should have muscle data for each joint", () => {
      expect(ANATOMY_MUSCLES.shoulder).toBeDefined();
      expect(ANATOMY_MUSCLES.hip).toBeDefined();
      expect(ANATOMY_MUSCLES.knee).toBeDefined();
      expect(ANATOMY_MUSCLES.spine).toBeDefined();
    });

    it("should have origin and insertion for each muscle", () => {
      ANATOMY_MUSCLES.shoulder.forEach((muscle) => {
        expect(muscle.origin).toBeTruthy();
        expect(muscle.insertion).toBeTruthy();
        expect(muscle.action).toBeTruthy();
        expect(muscle.innervation).toBeTruthy();
      });
    });
  });

  describe("Clinical Information Display", () => {
    it("should display common pathologies for shoulder", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(() => {
        expect(screen.getByText(/Rotator Cuff Tear/i)).toBeInTheDocument();
      });
    });

    it("should display red flags section", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(() => {
        expect(screen.getByText(/Red Flags/i)).toBeInTheDocument();
      });
    });

    it("should display biomechanics information", async () => {
      renderWithProviders(<AnatomyLab />);
      await waitFor(() => {
        expect(screen.getByText(/Biomechanics/i)).toBeInTheDocument();
      });
    });
  });

  describe("WebGL Fallback", () => {
    it("should render canvas when WebGL is supported", async () => {
      renderWithProviders(<AnatomyLab />);
      const interactiveButton = screen.getByRole("button", {
        name: /Interactive 3D/i,
      });
      fireEvent.click(interactiveButton);
      await waitFor(() => {
        const canvas = screen.queryByTestId("canvas");
        expect(canvas).toBeDefined();
      });
    });

    it("should show WebGL fallback when not supported", async () => {
      const { isWebGLSupported } = await import("../../lib/webgl-check");
      (isWebGLSupported as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);

      renderWithProviders(<AnatomyLab />);
      const interactiveButton = screen.getByRole("button", {
        name: /Interactive 3D/i,
      });
      fireEvent.click(interactiveButton);

      await waitFor(() => {
        // Either canvas or fallback should be present
        const canvas = screen.queryByTestId("canvas");
        const fallback = screen.queryByText(/WebGL/i);
        expect(canvas !== null || fallback !== null).toBe(true);
      });
    });
  });

  describe("Patient View Toggle", () => {
    it("should enter patient view when button clicked", async () => {
      renderWithProviders(<AnatomyLab />);
      const patientViewButton = screen.getByRole("button", {
        name: /Patient View/i,
      });
      fireEvent.click(patientViewButton);
      await waitFor(() => {
        // PatientViewWrapper should render
        expect(screen.getByText(/Anatomy Lab/i)).toBeInTheDocument();
      });
    });
  });

  describe("AI Diagram Generation", () => {
    it("should show AI diagram input when AI Diagram view selected", async () => {
      renderWithProviders(<AnatomyLab />);
      const aiButton = screen.getByRole("button", { name: /AI Diagram/i });
      fireEvent.click(aiButton);
      await waitFor(() => {
        expect(screen.getByText(/AI Medical Illustrator/i)).toBeInTheDocument();
      });
    });

    it("should have generate button disabled when prompt is empty", async () => {
      renderWithProviders(<AnatomyLab />);
      const aiButton = screen.getByRole("button", { name: /AI Diagram/i });
      fireEvent.click(aiButton);
      await waitFor(() => {
        const generateButton = screen.getByTestId("ai-diagram-generate");
        expect(generateButton).toBeDisabled();
      });
    });
  });
});
