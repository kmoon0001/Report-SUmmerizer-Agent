/**
 * Unit Tests: Cardiopulmonary & Vestibular Hub Logic
 * Requirements: 21.1, 21.2
 * Sources: AHA/ACC 2024, ATS 2002, APTA 2023 Vestibular CPG
 */
import { describe, it, expect } from "vitest";
import {
  calculateTargetHeartRate,
  interpret6MWT,
  interpretBorgRPE,
  cardiacRehabPhases,
  pulmonaryRehabProtocols,
  bppvManeuvers,
  vestibularExercisePrograms,
  cardiopulmonaryAssessmentTools,
  vestibularAssessmentTools,
} from "../../data/pt-cardiopulmonary-vestibular-data";

// ── Karvonen Calculator ───────────────────────────────────────────────────────
describe("calculateTargetHeartRate", () => {
  it("calculates max HR correctly", () => {
    expect(calculateTargetHeartRate(20, 60).maxHR).toBe(200);
    expect(calculateTargetHeartRate(70, 70).maxHR).toBe(150);
  });

  it("calculates HRR correctly", () => {
    expect(calculateTargetHeartRate(20, 60).hrr).toBe(140);
  });

  it("calculates target range at 40-70% intensity", () => {
    const target = calculateTargetHeartRate(20, 60, 0.4, 0.7);
    expect(target.low).toBe(116);
    expect(target.high).toBe(158);
  });
});

// ── 6MWT Interpretation ───────────────────────────────────────────────────────
describe("interpret6MWT", () => {
  it("percent predicted matches expected calc", () => {
    // Distance 450, age 60, male, height 175, weight 80
    // predicted = 7.57 * 175 - 5.02 * 60 - 1.76 * 80 - 309 = 573
    const result = interpret6MWT(450, 60, "male", 175, 80);
    expect(result.percentPredicted).toBeGreaterThan(70);
    expect(result.interpretation).toMatch(/Mildly reduced/i);
  });

  it("interprets various levels for coverage", () => {
    expect(interpret6MWT(100, 20, "male", 180, 75).interpretation).toMatch(
      /Severely reduced/i,
    );
    expect(interpret6MWT(350, 60, "male", 175, 80).interpretation).toMatch(
      /Moderately reduced/i,
    );
    expect(interpret6MWT(600, 60, "male", 175, 80).interpretation).toMatch(
      /Normal/i,
    );
  });
});

// ── Borg RPE & Dyspnea Interpretation ─────────────────────────────────────────
describe("interpretBorgRPE", () => {
  it("interprets various levels correctly", () => {
    expect(interpretBorgRPE(6).intensity).toBe("Very Light");
    expect(interpretBorgRPE(11).intensity).toBe("Light");
    expect(interpretBorgRPE(13).intensity).toBe("Somewhat Hard");
    expect(interpretBorgRPE(15).intensity).toBe("Hard");
    expect(interpretBorgRPE(17).intensity).toBe("Very Hard");
    expect(interpretBorgRPE(20).intensity).toBe("Maximal");
  });
});

// ── Assessment Tool Interpretations ───────────────────────────────────────────
describe("cardiopulmonaryAssessmentTools", () => {
  it("6MWT interpretation logic matches data for all levels", () => {
    const mwt = cardiopulmonaryAssessmentTools.find(
      (t) => t.acronym === "6MWT",
    )!;
    expect(mwt.interpretation(500, 65, "male")).toMatch(/Normal/i);
    expect(mwt.interpretation(400, 65, "male")).toMatch(/Mildly/i);
    expect(mwt.interpretation(300, 65, "male")).toMatch(/Moderately/i);
    expect(mwt.interpretation(100, 65, "male")).toMatch(/Severely/i);
  });

  it("Borg RPE interpretation logic matches data", () => {
    const borg = cardiopulmonaryAssessmentTools.find(
      (t) => t.acronym === "Borg RPE",
    )!;
    expect(borg.interpretation(6)).toMatch(/light/i);
    expect(borg.interpretation(13)).toMatch(/cardiac rehab/i);
    expect(borg.interpretation(15)).toMatch(/vigorous/i);
    expect(borg.interpretation(20)).toMatch(/Maximal/i);
  });

  it("Modified Borg Dyspnea interpretation logic matches data", () => {
    const mborg = cardiopulmonaryAssessmentTools.find(
      (t) => t.acronym === "mBorg",
    )!;
    expect(mborg.interpretation(0)).toMatch(/No breathlessness/i);
    expect(mborg.interpretation(2)).toMatch(/Slight/i);
    expect(mborg.interpretation(4)).toMatch(/Moderate/i);
    expect(mborg.interpretation(6)).toMatch(/Severe/i);
    expect(mborg.interpretation(9)).toMatch(/Very severe/i);
  });

  it("NYHA interpretation logic matches data", () => {
    const nyha = cardiopulmonaryAssessmentTools.find(
      (t) => t.acronym === "NYHA",
    )!;
    expect(nyha.interpretation(1)).toMatch(/Class I/i);
    expect(nyha.interpretation(2)).toMatch(/Class II/i);
    expect(nyha.interpretation(3)).toMatch(/Class III/i);
    expect(nyha.interpretation(4)).toMatch(/Class IV/i);
  });

  it("MRC Dyspnea interpretation logic matches data", () => {
    const mrc = cardiopulmonaryAssessmentTools.find(
      (t) => t.acronym === "MRC",
    )!;
    expect(mrc.interpretation(1)).toMatch(/Grade 1/i);
    expect(mrc.interpretation(2)).toMatch(/Grade 2/i);
    expect(mrc.interpretation(3)).toMatch(/Grade 3/i);
    expect(mrc.interpretation(4)).toMatch(/Grade 4/i);
    expect(mrc.interpretation(5)).toMatch(/Grade 5/i);
  });
});

describe("vestibularAssessmentTools", () => {
  it("DHI interpretation logic matches data", () => {
    const dhi = vestibularAssessmentTools.find((t) => t.acronym === "DHI")!;
    expect(dhi.interpretation(10)).toMatch(/No\/mild/i);
    expect(dhi.interpretation(25)).toMatch(/Mild handicap/i);
    expect(dhi.interpretation(45)).toMatch(/Moderate/i);
    expect(dhi.interpretation(80)).toMatch(/Severe/i);
  });

  it("DGI interpretation logic matches data", () => {
    const dgi = vestibularAssessmentTools.find((t) => t.acronym === "DGI")!;
    expect(dgi.interpretation(23)).toMatch(/Safe/i);
    expect(dgi.interpretation(20)).toMatch(/Mostly safe/i);
    expect(dgi.interpretation(15)).toMatch(/Fall risk/i);
  });

  it("ABC interpretation logic matches data", () => {
    const abc = vestibularAssessmentTools.find((t) => t.acronym === "ABC")!;
    expect(abc.interpretation(90)).toMatch(/High confidence/i);
    expect(abc.interpretation(65)).toMatch(/Moderate confidence/i);
    expect(abc.interpretation(40)).toMatch(/Low confidence/i);
  });
});

// ── Data Integrity ────────────────────────────────────────────────────────────
describe("cardiacRehabPhases", () => {
  it("has 4 phases with details", () => {
    expect(cardiacRehabPhases).toHaveLength(4);
    cardiacRehabPhases.forEach((p) => {
      expect(p.goals.length).toBeGreaterThan(0);
      expect(p.ptInterventions.length).toBeGreaterThan(0);
    });
  });
});

describe("pulmonaryRehabProtocols", () => {
  it("includes COPD and HF", () => {
    expect(
      pulmonaryRehabProtocols.some((p) => p.condition.includes("COPD")),
    ).toBe(true);
    expect(
      pulmonaryRehabProtocols.some((p) =>
        p.condition.includes("Heart Failure"),
      ),
    ).toBe(true);
  });
});

describe("bppvManeuvers", () => {
  it("includes posterior and horizontal canal maneuvers", () => {
    expect(bppvManeuvers.some((m) => m.targetCanal === "posterior")).toBe(true);
    expect(bppvManeuvers.some((m) => m.targetCanal === "horizontal")).toBe(
      true,
    );
  });
});

describe("vestibularExercisePrograms", () => {
  it("includes Gaze, Habituation, and Gait programs", () => {
    expect(
      vestibularExercisePrograms.some((p) => p.name.includes("Gaze")),
    ).toBe(true);
    expect(
      vestibularExercisePrograms.some((p) => p.name.includes("Habit")),
    ).toBe(true);
    expect(
      vestibularExercisePrograms.some((p) => p.name.includes("Balance")),
    ).toBe(true);
  });
});
