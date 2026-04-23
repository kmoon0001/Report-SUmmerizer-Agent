/**
 * Unit Tests: PT Clinical Pathways
 * Requirements: 22.1, 22.2
 * Sources: APTA CPGs, CMS, JOSPT, Cochrane Reviews
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PTClinicalPathways } from "../../components/PTClinicalPathways";
import {
  ptClinicalPathways,
  getPathwayById,
  getPathwaysByCategory,
  getImmediateRedFlags,
} from "../../data/pt-clinical-pathways-data";

vi.mock("framer-motion", () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ── Data Tests ────────────────────────────────────────────────────────────────
describe("ptClinicalPathways data", () => {
  it("has 5 pathways", () => {
    expect(ptClinicalPathways).toHaveLength(5);
  });

  it("TKA pathway has 3 phases", () => {
    const tka = getPathwayById("post-tka")!;
    expect(tka.phases).toHaveLength(3);
  });

  it("TKA Phase 1 includes DVT red flag", () => {
    const tka = getPathwayById("post-tka")!;
    expect(tka.redFlags.some((f) => /DVT/i.test(f.flag))).toBe(true);
  });

  it("TKA DVT red flag is immediate urgency", () => {
    const tka = getPathwayById("post-tka")!;
    const dvt = tka.redFlags.find((f) => /DVT/i.test(f.flag))!;
    expect(dvt.urgency).toBe("immediate");
  });

  it("LBP pathway has cauda equina as immediate red flag", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const ce = lbp.redFlags.find((f) => /cauda equina/i.test(f.flag))!;
    expect(ce.urgency).toBe("immediate");
  });

  it("stroke pathway has CIMT in Phase 2", () => {
    const stroke = getPathwayById("stroke-rehab")!;
    const phase2 = stroke.phases.find((p) => p.phase === 2)!;
    expect(phase2.interventions.some((i) => /CIMT/i.test(i.name))).toBe(true);
  });

  it("all pathways have evidence sources", () => {
    ptClinicalPathways.forEach((p) => {
      expect(p.evidenceSource.length).toBeGreaterThan(0);
    });
  });

  it("all interventions have CPT codes", () => {
    ptClinicalPathways.forEach((pathway) => {
      pathway.phases.forEach((phase) => {
        phase.interventions.forEach((int) => {
          expect(int.cptCode).toBeDefined();
          // CPT codes can be 97xxx or 98xxx
          expect(int.cptCode).toMatch(/9[78]\d{3}/);
        });
      });
    });
  });

  it("all phases have progression criteria", () => {
    ptClinicalPathways.forEach((pathway) => {
      pathway.phases.forEach((phase) => {
        expect(phase.progressionCriteria.length).toBeGreaterThan(0);
      });
    });
  });

  it("all phases have outcome measures", () => {
    ptClinicalPathways.forEach((pathway) => {
      pathway.phases.forEach((phase) => {
        expect(phase.outcomeMeasures.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("getPathwayById", () => {
  it("returns correct pathway", () => {
    expect(getPathwayById("post-tka")?.name).toContain("Knee");
  });

  it("returns undefined for unknown id", () => {
    expect(getPathwayById("unknown")).toBeUndefined();
  });
});

describe("getPathwaysByCategory", () => {
  it("returns post-surgical pathways", () => {
    const surgical = getPathwaysByCategory("post-surgical");
    expect(surgical.length).toBeGreaterThan(0);
    surgical.forEach((p) => expect(p.category).toBe("post-surgical"));
  });

  it("returns neurological pathways", () => {
    const neuro = getPathwaysByCategory("neurological");
    expect(neuro.some((p) => /stroke/i.test(p.name))).toBe(true);
  });
});

describe("getImmediateRedFlags", () => {
  it("TKA has immediate red flags", () => {
    const tka = getPathwayById("post-tka")!;
    expect(getImmediateRedFlags(tka).length).toBeGreaterThan(0);
  });

  it("LBP has cauda equina as immediate", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const flags = getImmediateRedFlags(lbp);
    expect(flags.some((f) => /cauda equina/i.test(f.flag))).toBe(true);
  });
});

// ── Component Tests ───────────────────────────────────────────────────────────
describe("PTClinicalPathways component", () => {
  it("renders hub title", () => {
    render(<PTClinicalPathways />);
    expect(screen.getByText(/PT Clinical Pathways/i)).toBeInTheDocument();
  });

  it("renders pathway cards", () => {
    render(<PTClinicalPathways />);
    expect(screen.getByText(/Total Knee Arthroplasty/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Low Back Pain/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Stroke Rehabilitation/i).length,
    ).toBeGreaterThan(0);
  });

  it("shows red flag count on TKA card", () => {
    render(<PTClinicalPathways />);
    expect(screen.getAllByText(/red flag/i).length).toBeGreaterThan(0);
  });

  it("opens pathway detail on card click", () => {
    render(<PTClinicalPathways />);
    fireEvent.click(screen.getByText(/Total Knee Arthroplasty/i));
    expect(screen.getByText(/Back to pathways/i)).toBeInTheDocument();
  });

  it("shows red flags in detail view", () => {
    render(<PTClinicalPathways />);
    fireEvent.click(screen.getByText(/Total Knee Arthroplasty/i));
    expect(screen.getByText(/DVT/i)).toBeInTheDocument();
  });

  it("category filter works", async () => {
    render(<PTClinicalPathways />);
    const neurologicalBtn = screen.getByText("Neurological");
    fireEvent.click(neurologicalBtn);

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Stroke Rehabilitation/i).length,
        ).toBeGreaterThan(0);
      },
      { timeout: 5000 },
    );
    expect(screen.queryByText(/Total Knee Arthroplasty/i)).toBeNull();
  });

  it("back button returns to list", () => {
    render(<PTClinicalPathways />);
    fireEvent.click(screen.getByText(/Total Knee Arthroplasty/i));
    fireEvent.click(screen.getByText(/Back to pathways/i));
    expect(screen.getByText(/Total Knee Arthroplasty/i)).toBeInTheDocument();
  });

  it("renders patient view without clinical tools", () => {
    render(<PTClinicalPathways patientView />);
    expect(screen.getByText(/Your Treatment Plan/i)).toBeInTheDocument();
    expect(screen.queryByText("All")).toBeNull();
  });
});
