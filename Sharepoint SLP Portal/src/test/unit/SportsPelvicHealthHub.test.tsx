/**
 * Unit Tests: Sports & Pelvic Health Hub
 * Requirements: 22.1, 22.2
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SportsPelvicHealthHub } from "../../components/SportsPelvicHealthHub";
import {
  fmsTests,
  calculateFMSScore,
  returnToSportCriteria,
  aclRehabProtocol,
  pfmtProtocols,
  bladderBowelProtocols,
  prePostPartumProtocols,
  interpretModifiedOxford,
  interpretICIQSF,
} from "../../data/pt-sports-pelvic-data";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ============================================================================
// FMS SCORING
// ============================================================================

describe("calculateFMSScore", () => {
  it("perfect score of 21 returns low injury risk", () => {
    const result = calculateFMSScore([3, 3, 3, 3, 3, 3, 3]);
    expect(result.total).toBe(21);
    expect(result.riskLevel).toMatch(/Low/i);
  });

  it("score ≤14 returns elevated injury risk", () => {
    const result = calculateFMSScore([2, 2, 2, 2, 2, 1, 1]);
    expect(result.total).toBeLessThanOrEqual(14);
    expect(result.riskLevel).toMatch(/Elevated/i);
  });

  it("score of 0 on any test is counted in total", () => {
    const result = calculateFMSScore([0, 3, 3, 3, 3, 3, 3]);
    expect(result.total).toBe(18); // 0 + 3*6 = 18
    expect(result.asymmetries).toBe(0); // score 0 is not an asymmetry (asymmetry = score of 1)
  });

  it("counts asymmetries (score of 1)", () => {
    const result = calculateFMSScore([1, 1, 3, 3, 3, 3, 3]);
    expect(result.asymmetries).toBe(2);
  });

  it("score 15-17 returns moderate risk", () => {
    const result = calculateFMSScore([2, 2, 2, 3, 2, 2, 2]);
    expect(result.total).toBe(15);
    expect(result.riskLevel).toMatch(/Moderate/i);
  });

  it("returns recommendation string for all risk levels", () => {
    const low = calculateFMSScore([3, 3, 3, 3, 3, 3, 3]);
    const mod = calculateFMSScore([2, 2, 2, 3, 2, 2, 2]);
    const high = calculateFMSScore([2, 2, 2, 2, 2, 1, 1]);
    expect(low.recommendation.length).toBeGreaterThan(0);
    expect(mod.recommendation.length).toBeGreaterThan(0);
    expect(high.recommendation.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// FMS TEST DATA
// ============================================================================

describe("fmsTests data", () => {
  it("has 7 tests", () => {
    expect(fmsTests).toHaveLength(7);
  });

  it("each test has 4 scoring criteria (0-3)", () => {
    fmsTests.forEach((test) => {
      expect(test.scoringCriteria).toHaveLength(4);
      expect(test.scoringCriteria.map((c) => c.score)).toEqual([3, 2, 1, 0]);
    });
  });

  it("each test has corrective exercises", () => {
    fmsTests.forEach((test) => {
      expect(test.correctives.length).toBeGreaterThan(0);
    });
  });

  it("Deep Squat is first test", () => {
    expect(fmsTests[0]!.name).toBe("Deep Squat");
  });

  it("Rotary Stability is last test", () => {
    expect(fmsTests[6]!.name).toBe("Rotary Stability");
  });
});

// ============================================================================
// RETURN TO SPORT CRITERIA
// ============================================================================

describe("returnToSportCriteria", () => {
  it("ACL criteria require ≥90% LSI", () => {
    const acl = returnToSportCriteria.find((r) => r.sport.includes("ACL"))!;
    const strengthCat = acl.criteria.find((c) => c.category === "Strength")!;
    expect(strengthCat.passingThreshold).toMatch(/90%/);
  });

  it("ACL minimum timeline is 9 months", () => {
    const acl = returnToSportCriteria.find((r) => r.sport.includes("ACL"))!;
    expect(acl.timelineMinimum).toMatch(/9 months/i);
  });

  it("ACL criteria include psychological readiness", () => {
    const acl = returnToSportCriteria.find((r) => r.sport.includes("ACL"))!;
    expect(
      acl.criteria.some((c) => c.category === "Psychological Readiness"),
    ).toBe(true);
  });

  it("all criteria have evidence level ≥4", () => {
    returnToSportCriteria.forEach((r) => {
      expect(r.evidenceLevel).toBeGreaterThanOrEqual(4);
    });
  });

  it("all criteria have citations", () => {
    returnToSportCriteria.forEach((r) => {
      expect(r.citation.length).toBeGreaterThan(10);
    });
  });
});

// ============================================================================
// ACL REHAB PROTOCOL
// ============================================================================

describe("aclRehabProtocol", () => {
  it("has 4 phases", () => {
    expect(aclRehabProtocol).toHaveLength(4);
  });

  it("Phase 1 starts at week 0", () => {
    expect(aclRehabProtocol[0]!.weeks).toMatch(/^0/);
  });

  it("Phase 4 includes return to sport criteria in progression", () => {
    const phase4 = aclRehabProtocol[3]!;
    expect(
      phase4.progressionCriteria.some((c) => /RTS|LSI.*90%/i.test(c)),
    ).toBe(true);
  });

  it("each phase has progression criteria", () => {
    aclRehabProtocol.forEach((phase) => {
      expect(phase.progressionCriteria.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// PELVIC FLOOR ASSESSMENT
// ============================================================================

describe("interpretModifiedOxford", () => {
  it("grade 0 returns no contraction", () => {
    const result = interpretModifiedOxford(0);
    expect(result.description).toMatch(/No contraction/i);
  });

  it("grade 5 returns strong contraction", () => {
    const result = interpretModifiedOxford(5);
    expect(result.description).toMatch(/Strong/i);
  });

  it("grade 0-1 recommends biofeedback/e-stim", () => {
    const g0 = interpretModifiedOxford(0);
    const g1 = interpretModifiedOxford(1);
    expect(g0.clinicalImplication).toMatch(/biofeedback|e-stim/i);
    expect(g1.clinicalImplication).toMatch(/biofeedback|e-stim/i);
  });

  it("all grades 0-5 return valid results", () => {
    for (let g = 0; g <= 5; g++) {
      const result = interpretModifiedOxford(g);
      expect(result.description.length).toBeGreaterThan(0);
    }
  });
});

describe("interpretICIQSF", () => {
  it("score 0 returns no incontinence", () => {
    expect(interpretICIQSF(0)).toMatch(/No incontinence/i);
  });

  it("score ≤5 returns slight", () => {
    expect(interpretICIQSF(3)).toMatch(/Slight/i);
  });

  it("score 13-18 returns severe", () => {
    expect(interpretICIQSF(15)).toMatch(/Severe/i);
  });

  it("score 19-21 returns very severe", () => {
    expect(interpretICIQSF(20)).toMatch(/Very severe/i);
  });
});

// ============================================================================
// PFMT PROTOCOLS
// ============================================================================

describe("pfmtProtocols", () => {
  it("has stress incontinence protocol", () => {
    const stress = pfmtProtocols.find((p) => p.indication.includes("stress"));
    expect(stress).toBeDefined();
  });

  it("stress protocol includes Knack maneuver", () => {
    const stress = pfmtProtocols.find((p) => p.indication.includes("stress"))!;
    expect(stress.exercises.some((e) => /Knack/i.test(e.name))).toBe(true);
  });

  it("urge protocol includes bladder training", () => {
    const urge = pfmtProtocols.find((p) => p.indication.includes("urge"))!;
    expect(
      urge.exercises.some((e) =>
        /Urge Suppression|Timed Voiding/i.test(e.name),
      ),
    ).toBe(true);
  });

  it("hypertonic protocol targets downtraining", () => {
    const hyper = pfmtProtocols.find((p) =>
      p.toneTarget.includes("hypertonic"),
    )!;
    expect(hyper).toBeDefined();
    expect(hyper.name).toMatch(/Downtraining|Hypertonic/i);
  });

  it("all protocols have evidence level ≥4", () => {
    pfmtProtocols.forEach((p) => {
      expect(p.evidenceLevel).toBeGreaterThanOrEqual(4);
    });
  });

  it("all protocols have citations", () => {
    pfmtProtocols.forEach((p) => {
      expect(p.citation.length).toBeGreaterThan(10);
    });
  });
});

// ============================================================================
// BLADDER & BOWEL PROTOCOLS
// ============================================================================

describe("bladderBowelProtocols", () => {
  it("has bowel retraining protocol", () => {
    const bowel = bladderBowelProtocols.find((p) => p.name.includes("Bowel"));
    expect(bowel).toBeDefined();
  });

  it("bowel protocol includes defecation posture", () => {
    const bowel = bladderBowelProtocols.find((p) => p.name.includes("Bowel"))!;
    expect(bowel.interventions.some((i) => /posture|squat/i.test(i))).toBe(
      true,
    );
  });

  it("catheter protocol includes PVR monitoring", () => {
    const cath = bladderBowelProtocols.find((p) =>
      p.name.includes("Catheter"),
    )!;
    expect(
      cath.interventions.some((i) => /PVR|post-void residual/i.test(i)),
    ).toBe(true);
  });

  it("all protocols have patient education items", () => {
    bladderBowelProtocols.forEach((p) => {
      expect(p.patientEducation.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// PRE/POSTPARTUM PROTOCOLS
// ============================================================================

describe("prePostPartumProtocols", () => {
  it("has prenatal, early postpartum, and late postpartum phases", () => {
    const phases = prePostPartumProtocols.map((p) => p.phase);
    expect(phases).toContain("prenatal");
    expect(phases).toContain("postpartum-early");
    expect(phases).toContain("postpartum-late");
  });

  it("prenatal protocol includes PFMT", () => {
    const prenatal = prePostPartumProtocols.find(
      (p) => p.phase === "prenatal",
    )!;
    expect(
      prenatal.interventions.some((i) => /PFMT|pelvic floor/i.test(i)),
    ).toBe(true);
  });

  it("early postpartum has no high-impact exercise precaution", () => {
    const early = prePostPartumProtocols.find(
      (p) => p.phase === "postpartum-early",
    )!;
    expect(early.precautions.some((p) => /high-impact/i.test(p))).toBe(true);
  });

  it("late postpartum running minimum is 12 weeks", () => {
    const late = prePostPartumProtocols.find(
      (p) => p.phase === "postpartum-late",
    )!;
    expect(
      late.returnToActivityGuidelines.some((g) =>
        /12 weeks.*running|running.*12 weeks/i.test(g),
      ),
    ).toBe(true);
  });
});

// ============================================================================
// COMPONENT RENDERING
// ============================================================================

describe("SportsPelvicHealthHub component", () => {
  it("renders hub title", () => {
    render(<SportsPelvicHealthHub />);
    expect(
      screen.getAllByText(/Sports.*Pelvic Health Hub/i).length,
    ).toBeGreaterThan(0);
  });

  it("renders both tabs", () => {
    render(<SportsPelvicHealthHub />);
    expect(screen.getAllByText(/Sports Rehab/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pelvic Health/i).length).toBeGreaterThan(0);
  });

  it("shows FMS content by default", () => {
    render(<SportsPelvicHealthHub />);
    expect(
      screen.getAllByText(/Functional Movement Screen/i).length,
    ).toBeGreaterThan(0);
  });

  it("switches to pelvic health tab", { timeout: 10000 }, () => {
    render(<SportsPelvicHealthHub />);
    const buttons = screen.getAllByRole("button");
    const pelvicTab = buttons.find(
      (b) =>
        b.getAttribute("aria-selected") !== null &&
        b.textContent?.includes("Pelvic Health"),
    );
    if (pelvicTab) fireEvent.click(pelvicTab);
    expect(
      screen.getAllByText(/Pelvic Floor Assessment/i).length,
    ).toBeGreaterThan(0);
  });

  it("FMS score buttons are interactive", () => {
    render(<SportsPelvicHealthHub />);
    const scoreBtn = screen.getByLabelText("Deep Squat score 2");
    fireEvent.click(scoreBtn);
    expect((scoreBtn as HTMLButtonElement).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("renders patient view without clinical tools", () => {
    render(<SportsPelvicHealthHub patientView />);
    expect(
      screen.getByText(/Sports.*Pelvic Health Rehab/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Functional Movement Screen/i)).toBeNull();
  });

  it("Oxford grade buttons are interactive", () => {
    render(<SportsPelvicHealthHub />);
    // Switch to pelvic tab first
    const pelvicTabBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.includes("Pelvic Health"));
    if (pelvicTabBtn) fireEvent.click(pelvicTabBtn);
    const grade3Btn = screen.getByLabelText("Oxford grade 3");
    fireEvent.click(grade3Btn);
    expect((grade3Btn as HTMLButtonElement).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("ICIQ-SF input accepts score", async () => {
    render(<SportsPelvicHealthHub />);
    const pelvicTabBtn = screen.getByText("Pelvic Health");
    fireEvent.click(pelvicTabBtn);
    const iciqInput = await screen.findByLabelText(/ICIQ-SF score/i);
    fireEvent.change(iciqInput, { target: { value: "8" } });
    expect((iciqInput as HTMLInputElement).value).toBe("8");
  });
});
