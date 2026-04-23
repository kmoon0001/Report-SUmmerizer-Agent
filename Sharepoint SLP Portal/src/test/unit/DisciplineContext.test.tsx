/**
 * Discipline Context Tests
 *
 * Tests for discipline context provider and hook
 * Requirements: 1.1, 1.2, 1.3
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  DisciplineProvider,
  useDiscipline,
} from "../../context/DisciplineContext";
import { DisciplineService } from "../../services/DisciplineService";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component that uses the discipline context
const TestComponent: React.FC = () => {
  const { currentDiscipline, config, switchDiscipline } = useDiscipline();

  return (
    <div>
      <div data-testid="current-discipline">{currentDiscipline}</div>
      <div data-testid="discipline-name">{config?.name}</div>
      <button onClick={() => switchDiscipline("ot")} data-testid="switch-to-ot">
        Switch to OT
      </button>
      <button onClick={() => switchDiscipline("pt")} data-testid="switch-to-pt">
        Switch to PT
      </button>
    </div>
  );
};

describe("DisciplineContext", () => {
  beforeEach(() => {
    localStorage.clear();
    DisciplineService.initialize();
  });

  describe("DisciplineProvider", () => {
    it("should render children", () => {
      render(
        <DisciplineProvider>
          <div data-testid="child">Test Child</div>
        </DisciplineProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should load default discipline (PT)", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });
    });

    it("should load discipline from localStorage if available", async () => {
      localStorage.setItem("currentDiscipline", "ot");

      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "ot",
        );
      });
    });

    it("should load discipline configuration", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Physical Therapy",
        );
      });
    });

    it("should handle invalid localStorage value and use default", async () => {
      localStorage.setItem("currentDiscipline", "invalid");

      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });
    });
  });

  describe("useDiscipline Hook", () => {
    it("should throw error when used outside provider", () => {
      const TestComponentWithoutProvider = () => {
        useDiscipline();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useDiscipline must be used within a DisciplineProvider");

      consoleSpy.mockRestore();
    });

    it("should provide current discipline", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });
    });

    it("should provide discipline config", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Physical Therapy",
        );
      });
    });
  });

  describe("Discipline Switching", () => {
    it("should switch from PT to OT", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });

      const switchButton = screen.getByTestId("switch-to-ot");
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "ot",
        );
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Occupational Therapy",
        );
      });
    });

    it("should switch from OT to PT", async () => {
      render(
        <DisciplineProvider defaultDiscipline="ot">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "ot",
        );
      });

      const switchButton = screen.getByTestId("switch-to-pt");
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Physical Therapy",
        );
      });
    });

    it("should persist discipline to localStorage on switch", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });

      const switchButton = screen.getByTestId("switch-to-ot");
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(localStorage.getItem("currentDiscipline")).toBe("ot");
      });
    });

    it("should not switch if already on same discipline", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toHaveTextContent(
          "pt",
        );
      });

      const switchButton = screen.getByTestId("switch-to-pt");
      fireEvent.click(switchButton);

      // Should still be PT
      expect(screen.getByTestId("current-discipline")).toHaveTextContent("pt");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing discipline configuration gracefully", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // This should not crash
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-discipline")).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Discipline Configuration Loading", () => {
    it("should load PT configuration correctly", async () => {
      render(
        <DisciplineProvider defaultDiscipline="pt">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Physical Therapy",
        );
      });
    });

    it("should load OT configuration correctly", async () => {
      render(
        <DisciplineProvider defaultDiscipline="ot">
          <TestComponent />
        </DisciplineProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("discipline-name")).toHaveTextContent(
          "Occupational Therapy",
        );
      });
    });
  });
});
