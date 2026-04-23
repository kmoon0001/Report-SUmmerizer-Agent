/**
 * Unit Tests: Wound Care Hub
 * Requirements: 22.1, 22.2
 * Sources: NPUAP/EPUAP/PPPIA 2019, WOCN 2021, ADA/IWGDF 2023
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WoundCareHub } from "../../components/WoundCareHub";
import {
  pressureInjuryStages,
  calculateBradenScore,
  calculateUltraMISTDuration,
  assessHealingProgress,
  interpretBWAT,
  diabeticFootProtocols,
  venousUlcerProtocol,
  ultraMISTProtocol,
} from "../../data/pt-wound-care-data";

vi.mock("framer-motion", () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ── Pressure Injury Staging ───────────────────────────────────────────────────
describe("pressureInjuryStages data", () => {
  it("has 6 stages including DTI and Unstageable", () => {
    expect(pressureInjuryStages).toHaveLength(6);
    const stages = pressureInjuryStages.map((s) => s.stage);
    expect(stages).toContain("DTI");
    expect(stages).toContain("Unstageable");
  });

  it("Stage 1 has non-blanchable erythema description", () => {
    const s1 = pressureInjuryStages.find((s) => s.stage === "Stage 1")!;
    expect(s1.description).toMatch(/non-blanchable/i);
  });

  it("Stage 4 includes osteomyelitis risk", () => {
    const s4 = pressureInjuryStages.find((s) => s.stage === "Stage 4")!;
    expect(s4.clinicalFeatures.some((f) => /osteomyelitis/i.test(f))).toBe(
      true,
    );
  });

  it("all stages have treatment and dressing options", () => {
    pressureInjuryStages.forEach((s) => {
      expect(s.treatment.length).toBeGreaterThan(0);
      expect(s.dressingOptions.length).toBeGreaterThan(0);
    });
  });

  it("Stage 3 mentions UltraMIST for stalled wounds", () => {
    const s3 = pressureInjuryStages.find((s) => s.stage === "Stage 3")!;
    expect(s3.treatment.some((t) => /UltraMIST/i.test(t))).toBe(true);
  });
});

// ── Braden Scale ──────────────────────────────────────────────────────────────
describe("calculateBradenScore", () => {
  it("maximum score 23 = No Risk", () => {
    const result = calculateBradenScore([4, 4, 4, 4, 4, 3]);
    expect(result.total).toBe(23);
    expect(result.riskLevel).toBe("No Risk");
  });

  it("score ≤9 = Very High Risk", () => {
    const result = calculateBradenScore([1, 1, 1, 1, 1, 1]);
    expect(result.total).toBe(6);
    expect(result.riskLevel).toBe("Very High Risk");
  });

  it("score 10–12 = High Risk", () => {
    const result = calculateBradenScore([2, 2, 2, 2, 2, 2]);
    expect(result.total).toBe(12);
    expect(result.riskLevel).toBe("High Risk");
  });

  it("score 13–14 = Moderate Risk", () => {
    const result = calculateBradenScore([3, 2, 2, 2, 2, 3]);
    expect(result.total).toBe(14);
    expect(result.riskLevel).toBe("Moderate Risk");
  });

  it("Very High Risk includes specialty mattress intervention", () => {
    const result = calculateBradenScore([1, 1, 1, 1, 1, 1]);
    expect(
      result.interventions.some((i) =>
        /specialty mattress|low air loss/i.test(i),
      ),
    ).toBe(true);
  });

  it("all risk levels return at least one intervention", () => {
    [6, 10, 13, 16, 20].forEach((total) => {
      const scores = [
        Math.floor(total / 6),
        Math.floor(total / 6),
        Math.floor(total / 6),
        Math.floor(total / 6),
        Math.floor(total / 6),
        Math.floor(total / 6),
      ];
      const result = calculateBradenScore(scores);
      expect(result.interventions.length).toBeGreaterThan(0);
    });
  });
});

// ── UltraMIST ─────────────────────────────────────────────────────────────────
describe("calculateUltraMISTDuration", () => {
  it("wound <10 cm² = 3 min", () => {
    expect(calculateUltraMISTDuration(2, 3)).toBe(3); // 6 cm²
  });

  it("wound 10–24 cm² = 7 min", () => {
    expect(calculateUltraMISTDuration(4, 4)).toBe(7); // 16 cm²
  });

  it("wound 25–49 cm² = 12 min", () => {
    expect(calculateUltraMISTDuration(6, 6)).toBe(12); // 36 cm²
  });

  it("wound ≥50 cm² = 20 min", () => {
    expect(calculateUltraMISTDuration(10, 8)).toBe(20); // 80 cm²
  });

  it("duration increases with wound size", () => {
    const small = calculateUltraMISTDuration(1, 1);
    const large = calculateUltraMISTDuration(10, 10);
    expect(large).toBeGreaterThan(small);
  });
});

describe("ultraMISTProtocol data", () => {
  it("has 6 absolute contraindications", () => {
    expect(ultraMISTProtocol.contraindications).toHaveLength(6);
  });

  it("includes pacemaker as contraindication", () => {
    expect(
      ultraMISTProtocol.contraindications.some((c) => /pacemaker/i.test(c)),
    ).toBe(true);
  });

  it("includes malignancy as contraindication", () => {
    expect(
      ultraMISTProtocol.contraindications.some((c) => /malignancy/i.test(c)),
    ).toBe(true);
  });

  it("documentation requires CPT 97610", () => {
    expect(
      ultraMISTProtocol.documentationRequirements.some((d) => /97610/i.test(d)),
    ).toBe(true);
  });

  it("setup has 9 steps", () => {
    expect(ultraMISTProtocol.setupSteps).toHaveLength(9);
  });

  it("outcome measures include wound area reduction target", () => {
    expect(ultraMISTProtocol.outcomeMeasures.some((o) => /50%/i.test(o))).toBe(
      true,
    );
  });
});

// ── Wound Healing Progress ────────────────────────────────────────────────────
describe("assessHealingProgress", () => {
  it("50% area reduction at 4 weeks = on track", () => {
    const baseline = { length: 4, width: 4, depth: 1 };
    const current = { length: 2, width: 4, depth: 0.5 };
    const result = assessHealingProgress(baseline, current, 4);
    expect(result.percentReduction).toBe(50);
    expect(result.onTrack).toBe(true);
  });

  it("<50% reduction at 4 weeks = reassess", () => {
    const baseline = { length: 4, width: 4, depth: 1 };
    const current = { length: 3.5, width: 4, depth: 0.8 };
    const result = assessHealingProgress(baseline, current, 4);
    expect(result.onTrack).toBe(false);
    expect(result.recommendation).toMatch(/Reassess|advanced/i);
  });

  it("100% reduction = fully healed", () => {
    const baseline = { length: 4, width: 4, depth: 1 };
    const current = { length: 0, width: 0, depth: 0 };
    const result = assessHealingProgress(baseline, current, 6);
    expect(result.percentReduction).toBe(100);
  });

  it("returns weekly rate", () => {
    const baseline = { length: 4, width: 4, depth: 1 };
    const current = { length: 2, width: 4, depth: 0.5 };
    const result = assessHealingProgress(baseline, current, 4);
    expect(result.weeklyRate).toBe(12.5);
  });
});

// ── BWAT ──────────────────────────────────────────────────────────────────────
describe("interpretBWAT", () => {
  it("score ≤20 = healing well", () => {
    expect(interpretBWAT(15).healingStatus).toBe("regeneration");
  });

  it("score 21–35 = stable", () => {
    expect(interpretBWAT(28).healingStatus).toBe("stable");
  });

  it("score >35 = degeneration", () => {
    expect(interpretBWAT(50).healingStatus).toBe("degeneration");
  });

  it("all scores return interpretation string", () => {
    [13, 20, 35, 65].forEach((score) => {
      expect(interpretBWAT(score).interpretation.length).toBeGreaterThan(0);
    });
  });
});

// ── Diabetic Foot ─────────────────────────────────────────────────────────────
describe("diabeticFootProtocols data", () => {
  it("has Wagner grades 0, 1, 2", () => {
    const grades = diabeticFootProtocols.map((p) => p.wagnGrade);
    expect(grades).toContain(0);
    expect(grades).toContain(1);
    expect(grades).toContain(2);
  });

  it("Grade 1 includes Total Contact Cast as gold standard", () => {
    const g1 = diabeticFootProtocols.find((p) => p.wagnGrade === 1)!;
    expect(
      g1.offloadingOptions.some((o) => /Total Contact Cast|TCC/i.test(o)),
    ).toBe(true);
  });

  it("Grade 2 includes osteomyelitis workup in referral criteria", () => {
    const g2 = diabeticFootProtocols.find((p) => p.wagnGrade === 2)!;
    expect(g2.referralCriteria.some((r) => /osteomyelitis/i.test(r))).toBe(
      true,
    );
  });
});

// ── Venous Ulcer ──────────────────────────────────────────────────────────────
describe("venousUlcerProtocol data", () => {
  it("evidence level 5 (Cochrane)", () => {
    expect(venousUlcerProtocol.evidenceLevel).toBe(5);
  });

  it("includes ABPI requirement before compression", () => {
    expect(
      venousUlcerProtocol.outcomeMeasures.some((o) => /ABPI/i.test(o)),
    ).toBe(true);
  });

  it("includes ankle pump exercises", () => {
    expect(
      venousUlcerProtocol.exerciseProtocol.some((e) => /ankle pump/i.test(e)),
    ).toBe(true);
  });
});

// ── Component Rendering ───────────────────────────────────────────────────────
describe("WoundCareHub component", () => {
  it("renders hub title", () => {
    render(<WoundCareHub />);
    expect(
      screen.getByText(/Wound Care.*Integumentary Hub/i),
    ).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    render(<WoundCareHub />);
    expect(screen.getByText("PI Staging")).toBeInTheDocument();
    expect(screen.getByText("Braden Scale")).toBeInTheDocument();
    expect(screen.getByText("Dressings")).toBeInTheDocument();
    expect(screen.getByText("UltraMIST")).toBeInTheDocument();
    expect(screen.getByText("Diabetic Foot")).toBeInTheDocument();
    expect(screen.getByText("Venous Ulcer")).toBeInTheDocument();
    expect(screen.getByText("Wound Tracking")).toBeInTheDocument();
  });

  it("shows staging content by default", () => {
    render(<WoundCareHub />);
    expect(screen.getByText(/NPUAP/i)).toBeInTheDocument();
  });

  it("switches to Braden tab", () => {
    render(<WoundCareHub />);
    fireEvent.click(screen.getByText("Braden Scale"));
    expect(
      screen.getByText(/Braden Scale/i, { selector: "h3" }),
    ).toBeInTheDocument();
  });

  it("switches to UltraMIST tab", () => {
    render(<WoundCareHub />);
    fireEvent.click(screen.getByText("UltraMIST"));
    expect(screen.getByText(/CPT 97610/i)).toBeInTheDocument();
  });

  it("renders patient view correctly", () => {
    render(<WoundCareHub patientView />);
    expect(screen.getByText(/Wound Care/i)).toBeInTheDocument();
  });

  it("Braden score buttons update total score", () => {
    render(<WoundCareHub />);
    fireEvent.click(screen.getByText("Braden Scale"));
    expect(screen.getByText(/Total Score: 23/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button", { name: /sensory.*1/i });
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]!);
      expect(screen.getByText(/Total Score: 20/i)).toBeInTheDocument();
    }
  });

  it("adds and displays wound measurement in tracking tab", () => {
    render(<WoundCareHub />);
    fireEvent.click(screen.getByText("Wound Tracking"));

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/Length/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Width/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Depth/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Measurement/i }));

    expect(screen.getByText(/2024-03-20/i)).toBeInTheDocument();
    expect(screen.getAllByText(/5/i).length).toBeGreaterThan(0);
  });

  it("filters dressings by search term", () => {
    render(<WoundCareHub />);
    fireEvent.click(screen.getByText(/Dressings/i));
    const search = screen.getByPlaceholderText(/search dressings/i);
    fireEvent.change(search, { target: { value: "Foam" } });
    expect(screen.getByText(/Foam/i)).toBeInTheDocument();
  });
});
