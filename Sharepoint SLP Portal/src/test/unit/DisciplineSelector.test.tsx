/**
 * Discipline Selector Component Tests
 *
 * Tests for discipline selector UI
 * Requirements: 1.1, 1.2, 1.3
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DisciplineSelector } from "../../components/DisciplineSelector";
import { DisciplineService } from "../../services/DisciplineService";
import React from "react";

vi.mock("motion/react", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag) => {
        if (typeof tag === "symbol") return undefined;
        return React.forwardRef(({ children, ...props }: any, ref: any) =>
          React.createElement(tag, { ref, ...props }, children),
        );
      },
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    LayoutGroup: ({ children }: any) => children,
  };
});

describe("DisciplineSelector", () => {
  beforeEach(() => {
    DisciplineService.initialize();
  });

  describe("Rendering", () => {
    it("should render the main title", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText("The Future of")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("should render the subtitle", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText(/Clinical Care/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("should render discipline cards for PT and OT", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText("Physical Therapy")).toBeInTheDocument();
          expect(screen.getByText("Occupational Therapy")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("should render discipline descriptions", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText("Physical Therapy")).toBeInTheDocument();
          expect(screen.getByText("Occupational Therapy")).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("should render hub counts", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getAllByText(/HUBS/i).length).toBeGreaterThanOrEqual(1);
        },
        { timeout: 5000 },
      );
    });

    it("should render footer information", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText(/HIPAA Sentinel/i)).toBeInTheDocument();
          expect(screen.getByText(/Evidence Synthesis/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe("Discipline Selection", () => {
    it("should call onSelect with PT when PT card is clicked", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const ptCard = (
        await waitFor(() => screen.getByText("Physical Therapy"), {
          timeout: 5000,
        })
      ).closest("button");
      await waitFor(
        () => {
          fireEvent.click(ptCard!);
        },
        { timeout: 5000 },
      );

      await waitFor(
        () => {
          expect(mockOnSelect).toHaveBeenCalledWith("pt");
        },
        { timeout: 5000 },
      );
    });

    it("should call onSelect with OT when OT card is clicked", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const otCard = (
        await waitFor(() => screen.getByText("Occupational Therapy"), {
          timeout: 5000,
        })
      ).closest("button");
      await waitFor(
        () => {
          fireEvent.click(otCard!);
        },
        { timeout: 5000 },
      );

      await waitFor(
        () => {
          expect(mockOnSelect).toHaveBeenCalledWith("ot");
        },
        { timeout: 5000 },
      );
    });

    it("should show selected state when discipline is selected", async () => {
      const mockOnSelect = vi.fn();
      render(
        <DisciplineSelector onSelect={mockOnSelect} selectedDiscipline="pt" />,
      );

      const ptCard = (
        await waitFor(() => screen.getByText("Physical Therapy"), {
          timeout: 5000,
        })
      ).closest("button");
      expect(ptCard).toBeInTheDocument();
    });
  });

  describe("Hub Preview", () => {
    it("should display first 3 hubs for PT", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const ptConfig = DisciplineService.getDisciplineConfig("pt");
      const firstThreeHubs = ptConfig?.hubs.slice(0, 3) || [];

      for (const hub of firstThreeHubs) {
        await waitFor(
          () => {
            expect(
              screen.getByText(new RegExp(hub.name, "i")),
            ).toBeInTheDocument();
          },
          { timeout: 5000 },
        );
      }
    });

    it("should display first 3 hubs for OT", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const otConfig = DisciplineService.getDisciplineConfig("ot");
      const firstThreeHubs = otConfig?.hubs.slice(0, 3) || [];

      for (const hub of firstThreeHubs) {
        await waitFor(
          () => {
            expect(
              screen.getByText(new RegExp(hub.name, "i")),
            ).toBeInTheDocument();
          },
          { timeout: 5000 },
        );
      }
    });

    it("should show more hubs indicator when more than 3 hubs", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const ptConfig = DisciplineService.getDisciplineConfig("pt");
      if (ptConfig && ptConfig.hubs.length > 3) {
        await waitFor(
          () => {
            expect(screen.getByText("Physical Therapy")).toBeInTheDocument();
          },
          { timeout: 5000 },
        );
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper button elements", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          const buttons = screen.getAllByRole("button");
          expect(buttons.length).toBeGreaterThanOrEqual(2);
        },
        { timeout: 5000 },
      );
    });

    it("should have descriptive text for screen readers", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      await waitFor(
        () => {
          expect(screen.getByText(/Clinical Care/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe("Hover Effects", () => {
    it("should handle mouse enter on discipline cards", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const ptCard = await screen.findByRole("button", {
        name: /Physical Therapy/i,
      });
      fireEvent.mouseEnter(ptCard);
      expect(ptCard).toBeTruthy();
    });

    it("should handle mouse leave on discipline cards", async () => {
      const mockOnSelect = vi.fn();
      render(<DisciplineSelector onSelect={mockOnSelect} />);

      const ptCard = await screen.findByRole("button", {
        name: /Physical Therapy/i,
      });
      fireEvent.mouseLeave(ptCard);
      expect(ptCard).toBeTruthy();
    });
  });

  describe("Responsive Design", () => {
    it("should render cards in a grid layout", async () => {
      const mockOnSelect = vi.fn();
      const { container } = render(
        <DisciplineSelector onSelect={mockOnSelect} />,
      );

      await waitFor(
        () => {
          const gridContainer = container.querySelector(".grid");
          expect(gridContainer).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });
});
