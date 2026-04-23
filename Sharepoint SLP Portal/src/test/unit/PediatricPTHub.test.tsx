/**
 * Unit Tests — Pediatric PT Hub
 * Requirements: 22.1, 22.2
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PediatricPTHub } from "../../components/PediatricPTHub";
import {
  developmentalMilestones,
  interpretPDMS2Score,
  scoreGMFM,
  gmfcsLevels,
  cerebralPalsyProtocols,
  pediatricExerciseProgressions,
} from "../../data/pt-pediatric-data";

// ── Data Tests ────────────────────────────────────────────────────────────────
describe("PediatricPTHub: Developmental Milestones Data", () => {
  it("has milestones for key ages", () => {
    const ages = developmentalMilestones.map((m) => m.ageMonths);
    expect(ages).toContain(2);
    expect(ages).toContain(12);
    expect(ages).toContain(24);
    expect(ages).toContain(60);
  });

  it("each milestone has gross motor, fine motor, and red flags", () => {
    developmentalMilestones.forEach((m) => {
      expect(m.grossMotor.length).toBeGreaterThan(0);
      expect(m.fineMotor.length).toBeGreaterThan(0);
      expect(m.redFlags.length).toBeGreaterThan(0);
    });
  });

  it("12-month milestone includes walking", () => {
    const m12 = developmentalMilestones.find((m) => m.ageMonths === 12);
    expect(m12?.grossMotor.some((g) => /walk|step|stand/i.test(g))).toBe(true);
  });
});

describe("PediatricPTHub: PDMS-2 Score Interpretation", () => {
  it("high raw score returns above average interpretation", () => {
    const result = interpretPDMS2Score(100, 24);
    expect(result.interpretation).toMatch(/above average|average/i);
  });

  it("low raw score returns below average interpretation", () => {
    const result = interpretPDMS2Score(5, 48);
    expect(result.interpretation).toMatch(/below average|significantly/i);
  });

  it("returns percentile rank and standard score", () => {
    const result = interpretPDMS2Score(50, 36);
    expect(result.percentileRank).toBeDefined();
    expect(result.standardScore).toBeDefined();
  });
});

describe("PediatricPTHub: GMFM Scoring", () => {
  it("all zeros returns 0% total score", () => {
    const scores = {
      A: Array(17).fill(0),
      B: Array(20).fill(0),
      C: Array(14).fill(0),
      D: Array(13).fill(0),
      E: Array(24).fill(0),
    };
    const result = scoreGMFM(scores);
    expect(result.totalScore).toBe(0);
  });

  it("all max scores returns 100% total score", () => {
    const scores = {
      A: Array(17).fill(3),
      B: Array(20).fill(3),
      C: Array(14).fill(3),
      D: Array(13).fill(3),
      E: Array(24).fill(3),
    };
    const result = scoreGMFM(scores);
    expect(result.totalScore).toBe(100);
  });

  it("returns interpretation string", () => {
    const scores = {
      A: Array(17).fill(2),
      B: Array(20).fill(2),
      C: Array(14).fill(2),
      D: Array(13).fill(2),
      E: Array(24).fill(2),
    };
    const result = scoreGMFM(scores);
    expect(result.interpretation).toBeTruthy();
  });

  it("calculates dimension percentages independently", () => {
    const scores = {
      A: Array(17).fill(3), // 100%
      B: Array(20).fill(0), // 0%
      C: Array(14).fill(0),
      D: Array(13).fill(0),
      E: Array(24).fill(0),
    };
    const result = scoreGMFM(scores);
    expect(result.dimensionPercents["A"]).toBe(100);
    expect(result.dimensionPercents["B"]).toBe(0);
  });
});

describe("PediatricPTHub: GMFCS Levels", () => {
  it("has 5 GMFCS levels", () => {
    expect(gmfcsLevels).toHaveLength(5);
  });

  it("each level has PT goals and equipment", () => {
    gmfcsLevels.forEach((l) => {
      expect(l.ptGoals.length).toBeGreaterThan(0);
      expect(l.equipment.length).toBeGreaterThan(0);
    });
  });

  it("Level I describes walking without limitations", () => {
    const l1 = gmfcsLevels.find((l) => l.level === 1);
    expect(l1?.description).toMatch(/walk/i);
  });

  it("Level V describes severe impairment", () => {
    const l5 = gmfcsLevels.find((l) => l.level === 5);
    expect(l5?.description).toMatch(/impairment|limited|restricted/i);
  });
});

describe("PediatricPTHub: CP Protocols", () => {
  it("has at least 4 evidence-based protocols", () => {
    expect(cerebralPalsyProtocols.length).toBeGreaterThanOrEqual(4);
  });

  it("each protocol has evidence level and citation", () => {
    cerebralPalsyProtocols.forEach((p) => {
      expect(p.evidenceLevel).toBeTruthy();
      expect(p.citation).toBeTruthy();
      expect(p.protocol.length).toBeGreaterThan(0);
    });
  });

  it("CIMT protocol is included", () => {
    expect(
      cerebralPalsyProtocols.some((p) => /CIMT|constraint/i.test(p.name)),
    ).toBe(true);
  });
});

describe("PediatricPTHub: Exercise Progressions", () => {
  it("has progressions for all age groups", () => {
    expect(pediatricExerciseProgressions.length).toBeGreaterThanOrEqual(4);
  });

  it("each group has exercises and precautions", () => {
    pediatricExerciseProgressions.forEach((g) => {
      expect(g.exercises.length).toBeGreaterThan(0);
      expect(g.precautions.length).toBeGreaterThan(0);
    });
  });
});

// ── Component Tests ───────────────────────────────────────────────────────────
describe("PediatricPTHub: Component Rendering", () => {
  it("renders main heading", () => {
    render(<PediatricPTHub />);
    expect(screen.getByText(/Pediatric PT Hub/i)).toBeInTheDocument();
  });

  it("renders all tab buttons", () => {
    render(<PediatricPTHub />);
    expect(
      screen.getByRole("tab", { name: /milestones/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /PDMS-2/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /GMFM/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /GMFCS/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /CP Protocols/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Exercises/i })).toBeInTheDocument();
  });

  it("milestones tab is active by default", () => {
    render(<PediatricPTHub />);
    const tab = screen.getByRole("tab", { name: /milestones/i });
    expect(tab).toHaveAttribute("aria-selected", "true");
  });

  it("switches to PDMS-2 tab on click", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /PDMS-2/i }));
    expect(
      screen.getByText(/Peabody Developmental Motor Scales/i),
    ).toBeInTheDocument();
  });

  it("switches to GMFM tab on click", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /GMFM/i }));
    expect(
      screen.getByText(/Gross Motor Function Measure/i),
    ).toBeInTheDocument();
  });

  it("switches to GMFCS tab on click", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /GMFCS/i }));
    expect(
      screen.getByText(/Gross Motor Function Classification/i),
    ).toBeInTheDocument();
  });

  it("switches to CP Protocols tab on click", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /CP Protocols/i }));
    expect(
      screen.getByText(/Evidence-based PT interventions/i),
    ).toBeInTheDocument();
  });

  it("switches to Exercises tab on click", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /Exercises/i }));
    expect(screen.getByText(/Infant/i)).toBeInTheDocument();
  });

  it("patient view shows simplified content", () => {
    render(<PediatricPTHub patientView />);
    expect(screen.getByText(/Pediatric Physical Therapy/i)).toBeInTheDocument();
    expect(screen.queryByRole("tab")).toBeNull();
  });

  it("milestone age buttons render", () => {
    render(<PediatricPTHub />);
    const buttons12 = screen.getAllByRole("button", { name: /12 months/i });
    expect(buttons12.length).toBeGreaterThan(0);
  });

  it("clicking milestone age shows gross motor content", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("button", { name: /12 months/i }));
    expect(screen.getByText(/Gross Motor/i)).toBeInTheDocument();
  });

  it("GMFCS level buttons render", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /GMFCS/i }));
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("selecting GMFCS level shows description", () => {
    render(<PediatricPTHub />);
    fireEvent.click(screen.getByRole("tab", { name: /GMFCS/i }));
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByText(/Level I/i)).toBeInTheDocument();
  });
});
