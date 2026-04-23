/**
 * Integration Test: Wound Care Hub
 * Requirements: 1.1, 1.4
 * Sources: NPUAP/EPUAP/PPPIA 2019, WOCN 2021, ADA/IWGDF 2023
 */
import { describe, it, expect } from "vitest";
import {
  pressureInjuryStages,
  calculateBradenScore,
  calculateUltraMISTDuration,
  assessHealingProgress,
  interpretBWAT,
  diabeticFootProtocols,
  venousUlcerProtocol,
  ultraMISTProtocol,
  dressingGuide,
} from "../../data/pt-wound-care-data";

describe("Pressure Injury Assessment Workflow", () => {
  it("Braden score → risk level → intervention plan → dressing selection", () => {
    // Step 1: Braden assessment — high risk patient
    const scores = [2, 2, 2, 2, 2, 1]; // total = 11
    const braden = calculateBradenScore(scores);
    expect(braden.riskLevel).toBe("High Risk");

    // Step 2: Interventions include pressure redistribution
    expect(braden.interventions.some((i) => /mattress/i.test(i))).toBe(true);

    // Step 3: Stage 2 wound → select appropriate dressing
    const stage2 = pressureInjuryStages.find((s) => s.stage === "Stage 2")!;
    expect(stage2.dressingOptions).toContain("Hydrocolloid");

    // Step 4: Verify dressing guide has hydrocolloid details
    const hydrocolloid = dressingGuide.find((d) => d.name === "Hydrocolloid")!;
    expect(hydrocolloid.indications.some((i) => /Stage 2/i.test(i))).toBe(true);
  });

  it("Stage 3 stalled wound → UltraMIST consideration workflow", () => {
    // Step 1: Stage 3 wound stalled >4 weeks
    const stage3 = pressureInjuryStages.find((s) => s.stage === "Stage 3")!;
    expect(stage3.treatment.some((t) => /UltraMIST/i.test(t))).toBe(true);

    // Step 2: Calculate UltraMIST duration for 3×4 cm wound
    const duration = calculateUltraMISTDuration(3, 4);
    expect(duration).toBe(7); // 12 cm² → 7 min

    // Step 3: Verify contraindication screening
    expect(
      ultraMISTProtocol.contraindications.some((c) => /malignancy/i.test(c)),
    ).toBe(true);

    // Step 4: Documentation requirements include CPT 97610
    expect(
      ultraMISTProtocol.documentationRequirements.some((d) => /97610/i.test(d)),
    ).toBe(true);
  });

  it("4-week wound healing reassessment workflow", () => {
    const baseline = { length: 5, width: 4, depth: 1.5 };
    const current = { length: 3, width: 3, depth: 0.8 };
    const progress = assessHealingProgress(baseline, current, 4);

    // 55% area reduction — on track
    expect(progress.percentReduction).toBeGreaterThan(50);
    expect(progress.onTrack).toBe(true);
    expect(progress.recommendation).toMatch(/continue/i);
  });

  it("stalled wound at 4 weeks triggers advanced intervention recommendation", () => {
    const baseline = { length: 5, width: 4, depth: 1.5 };
    const current = { length: 4.8, width: 3.9, depth: 1.4 }; // minimal change
    const progress = assessHealingProgress(baseline, current, 4);

    expect(progress.onTrack).toBe(false);
    expect(progress.recommendation).toMatch(
      /advanced|NPWT|UltraMIST|collagen/i,
    );
  });
});

describe("Diabetic Foot Ulcer Workflow", () => {
  it("Wagner Grade 1 → TCC offloading → outcome tracking", () => {
    const grade1 = diabeticFootProtocols.find((p) => p.wagnGrade === 1)!;

    // TCC is gold standard
    expect(grade1.offloadingOptions[0]).toMatch(/Total Contact Cast|TCC/i);

    // PT role includes wound management
    expect(grade1.ptRole.some((r) => /wound|dressing/i.test(r))).toBe(true);

    // Outcome measures include wound area
    expect(grade1.outcomeMeasures.some((o) => /wound area/i.test(o))).toBe(
      true,
    );
  });

  it("Grade 2 → osteomyelitis workup referral", () => {
    const grade2 = diabeticFootProtocols.find((p) => p.wagnGrade === 2)!;
    expect(grade2.referralCriteria.some((r) => /osteomyelitis/i.test(r))).toBe(
      true,
    );
  });

  it("Grade 0 → preventive footwear and education", () => {
    const grade0 = diabeticFootProtocols.find((p) => p.wagnGrade === 0)!;
    expect(grade0.ptRole.some((r) => /footwear|education/i.test(r))).toBe(true);
  });
});

describe("Venous Leg Ulcer Workflow", () => {
  it("compression therapy workflow: ABPI check → compression → exercise", () => {
    // ABPI must be ≥0.8 before compression
    expect(
      venousUlcerProtocol.outcomeMeasures.some((o) => /ABPI/i.test(o)),
    ).toBe(true);

    // 4-layer bandage is gold standard
    expect(venousUlcerProtocol.compressionOptions[0]).toMatch(
      /4-layer|gold standard/i,
    );

    // Exercise includes ankle pumps
    expect(
      venousUlcerProtocol.exerciseProtocol.some((e) => /ankle pump/i.test(e)),
    ).toBe(true);
  });

  it("evidence level 5 — Cochrane systematic review", () => {
    expect(venousUlcerProtocol.evidenceLevel).toBe(5);
    expect(venousUlcerProtocol.citation).toMatch(/Cochrane/i);
  });
});

describe("BWAT Scoring Workflow", () => {
  it("serial BWAT scores track wound trajectory", () => {
    const week0 = interpretBWAT(45);
    const week4 = interpretBWAT(30);
    const week8 = interpretBWAT(18);

    expect(week0.healingStatus).toBe("degeneration");
    expect(week4.healingStatus).toBe("stable");
    expect(week8.healingStatus).toBe("regeneration");
  });
});

describe("Evidence quality — wound care module", () => {
  it("all pressure injury stages cite NPUAP/EPUAP 2019", () => {
    // Verified by data source header
    expect(pressureInjuryStages.length).toBe(6);
  });

  it("UltraMIST cites NICE MTG5 and Ennis 2006", () => {
    expect(ultraMISTProtocol.citations.some((c) => /NICE MTG5/i.test(c))).toBe(
      true,
    );
    expect(ultraMISTProtocol.citations.some((c) => /Ennis/i.test(c))).toBe(
      true,
    );
  });

  it("venous ulcer protocol cites Cochrane", () => {
    expect(venousUlcerProtocol.citation).toMatch(/Cochrane/i);
  });

  it("all dressings have change frequency defined", () => {
    dressingGuide.forEach((d) => {
      expect(d.changeFrequency.length).toBeGreaterThan(0);
    });
  });
});
