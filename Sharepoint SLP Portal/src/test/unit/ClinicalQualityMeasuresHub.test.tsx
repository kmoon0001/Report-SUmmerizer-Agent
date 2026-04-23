/**
 * Unit Tests: Clinical Quality Measures Hub
 * Requirements: 22.1, 22.2
 * Sources: CMS SNF QRP, NQF, APTA MIPS Resources
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicalQualityMeasuresHub } from "../../components/ClinicalQualityMeasuresHub";
import {
  qualityDomains,
  mipsMeasures,
  calculateMIPSPerformanceRate,
  estimatePaymentAdjustment,
  getMIPSBenchmark,
  generateMIPSDocumentationChecklist,
} from "../../data/quality-measures-data";

vi.mock("framer-motion", () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ── MIPS Calculations ─────────────────────────────────────────────────────────
describe("calculateMIPSPerformanceRate", () => {
  it("100/100 = 100%", () => {
    expect(calculateMIPSPerformanceRate(100, 100)).toBe(100);
  });

  it("75/100 = 75%", () => {
    expect(calculateMIPSPerformanceRate(75, 100)).toBe(75);
  });

  it("0 denominator = 0", () => {
    expect(calculateMIPSPerformanceRate(50, 0)).toBe(0);
  });

  it("rounds to 1 decimal", () => {
    expect(calculateMIPSPerformanceRate(1, 3)).toBe(33.3);
  });
});

describe("estimatePaymentAdjustment", () => {
  it("score ≥75 = +9% exceptional", () => {
    expect(estimatePaymentAdjustment(80)).toMatch(/\+9%/);
  });

  it("score 45–74 = positive adjustment", () => {
    expect(estimatePaymentAdjustment(60)).toMatch(/\+/);
  });

  it("score 30–44 = neutral", () => {
    expect(estimatePaymentAdjustment(35)).toMatch(/0%/);
  });

  it("score <15 = -9%", () => {
    expect(estimatePaymentAdjustment(10)).toMatch(/-9%/);
  });
});

describe("getMIPSBenchmark", () => {
  it("measure 155 has benchmark defined", () => {
    expect(getMIPSBenchmark("155")).toBeGreaterThan(0);
  });

  it("unknown measure returns 0", () => {
    expect(getMIPSBenchmark("999")).toBe(0);
  });
});

describe("generateMIPSDocumentationChecklist", () => {
  it("measure 155 checklist includes fall risk screening", () => {
    const checklist = generateMIPSDocumentationChecklist("155");
    expect(checklist.some((c) => /fall risk|screening/i.test(c))).toBe(true);
  });

  it("measure 182 checklist includes validated functional tool", () => {
    const checklist = generateMIPSDocumentationChecklist("182");
    expect(checklist.some((c) => /validated|functional/i.test(c))).toBe(true);
  });

  it("unknown measure returns fallback message", () => {
    const checklist = generateMIPSDocumentationChecklist("999");
    expect(checklist[0]).toMatch(/CMS MIPS/i);
  });

  it("all defined measures have checklists with ≥3 items", () => {
    ["155", "318", "128", "130", "226", "50", "182", "131"].forEach((num) => {
      expect(
        generateMIPSDocumentationChecklist(num).length,
      ).toBeGreaterThanOrEqual(3);
    });
  });
});

// ── Quality Domains Data ──────────────────────────────────────────────────────
describe("qualityDomains data", () => {
  it("has 6 domains", () => {
    expect(qualityDomains).toHaveLength(6);
  });

  it("falls domain has Otago Exercise Programme", () => {
    const falls = qualityDomains.find((d) => d.id === "falls")!;
    expect(falls.programs.some((p) => /Otago/i.test(p.name))).toBe(true);
  });

  it("falls domain Otago has Level 5 evidence", () => {
    const falls = qualityDomains.find((d) => d.id === "falls")!;
    const otago = falls.programs.find((p) => /Otago/i.test(p.name))!;
    expect(otago.evidenceLevel).toBe(5);
  });

  it("pelvic domain has PFMT with Level 5 evidence", () => {
    const pelvic = qualityDomains.find((d) => d.id === "pelvic")!;
    const pfmt = pelvic.programs.find((p) => /PFMT/i.test(p.name))!;
    expect(pfmt.evidenceLevel).toBe(5);
  });

  it("pressure domain includes repositioning q2h", () => {
    const pressure = qualityDomains.find((d) => d.id === "pressure")!;
    const repo = pressure.programs.find((p) => /Repositioning/i.test(p.name))!;
    expect(repo.protocol).toMatch(/q2h/i);
  });

  it("all domains have outcome measures", () => {
    qualityDomains.forEach((d) => {
      expect(d.outcomeMeasures.length).toBeGreaterThan(0);
    });
  });

  it("all domains have documentation requirements", () => {
    qualityDomains.forEach((d) => {
      expect(d.documentationRequirements.length).toBeGreaterThan(0);
    });
  });

  it("mobility domain references Section GG", () => {
    const mobility = qualityDomains.find((d) => d.id === "mobility")!;
    expect(mobility.programs.some((p) => /Section GG/i.test(p.name))).toBe(
      true,
    );
  });
});

// ── MIPS Measures Data ────────────────────────────────────────────────────────
describe("mipsMeasures data", () => {
  it("has 8 measures", () => {
    expect(mipsMeasures).toHaveLength(8);
  });

  it("measure 155 is Falls Screening", () => {
    const m = mipsMeasures.find((m) => m.number === "155")!;
    expect(m.title).toMatch(/Falls.*Screening/i);
  });

  it("measure 182 is Functional Outcome Assessment", () => {
    const m = mipsMeasures.find((m) => m.number === "182")!;
    expect(m.title).toMatch(/Functional Outcome/i);
  });

  it("all measures have 2026 benchmarks >0", () => {
    mipsMeasures.forEach((m) => {
      expect(m.benchmark2026).toBeGreaterThan(0);
    });
  });

  it("performance targets are above benchmarks", () => {
    mipsMeasures.forEach((m) => {
      expect(m.performanceTarget).toBeGreaterThanOrEqual(m.benchmark2026);
    });
  });
});

// ── Component Rendering ───────────────────────────────────────────────────────
describe("ClinicalQualityMeasuresHub component", () => {
  it("renders hub title", () => {
    render(<ClinicalQualityMeasuresHub />);
    expect(
      screen.getByText(/Clinical Quality Measures Hub/i),
    ).toBeInTheDocument();
  });

  it("renders all 6 domain cards", () => {
    render(<ClinicalQualityMeasuresHub />);
    expect(screen.getByText("Falls Prevention")).toBeInTheDocument();
    expect(screen.getByText("Pelvic Floor & Bladder")).toBeInTheDocument();
    expect(screen.getByText("Bowel Programs")).toBeInTheDocument();
    expect(screen.getByText("Pressure Injury Prevention")).toBeInTheDocument();
    expect(
      screen.getByText("Functional Mobility & Readmission"),
    ).toBeInTheDocument();
    expect(screen.getByText("MIPS Quality Measures")).toBeInTheDocument();
  });

  it("renders MIPS tracker table", () => {
    render(<ClinicalQualityMeasuresHub />);
    expect(
      screen.getByText(/MIPS Quality Measure Tracker/i),
    ).toBeInTheDocument();
  });

  it("opens domain panel on card click", () => {
    render(<ClinicalQualityMeasuresHub />);
    fireEvent.click(screen.getByText("Falls Prevention"));
    expect(screen.getByText(/PT Role/i)).toBeInTheDocument();
  });

  it("Quick Ref toggle works", () => {
    render(<ClinicalQualityMeasuresHub />);
    const btn = screen.getByText("Quick Ref");
    fireEvent.click(btn);
    expect(screen.getByText("Full View")).toBeInTheDocument();
  });

  it("renders patient view without clinical tools", () => {
    render(<ClinicalQualityMeasuresHub patientView />);
    expect(screen.getByText(/Quality Care Programs/i)).toBeInTheDocument();
    expect(screen.queryByText("MIPS Quality Measure Tracker")).toBeNull();
  });

  it("MIPS numerator input accepts values", () => {
    render(<ClinicalQualityMeasuresHub />);
    const inputs = screen.getAllByLabelText(/Numerator for MIPS/i);
    expect(inputs.length).toBeGreaterThan(0);
    fireEvent.change(inputs[0]!, { target: { value: "80" } });
    expect((inputs[0] as HTMLInputElement).value).toBe("80");
  });
});
