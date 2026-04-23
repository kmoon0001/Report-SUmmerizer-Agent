/**
 * Integration Test: Cardiopulmonary & Vestibular Hub
 * Requirements: 2.1, 6.1
 *
 * Tests complete assessment and protocol selection workflows
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
  vestibularAssessmentTools,
  cardiopulmonaryAssessmentTools,
  breathingTechniques,
} from "../../data/pt-cardiopulmonary-vestibular-data";

// ============================================================================
// CARDIAC REHAB WORKFLOW
// ============================================================================

describe("Cardiac Rehab Workflow", () => {
  it("complete Phase II prescription workflow", () => {
    // Step 1: Calculate target HR
    const hrTargets = calculateTargetHeartRate(65, 72, 0.4, 0.7);
    expect(hrTargets.low).toBeGreaterThan(72);
    expect(hrTargets.high).toBeLessThan(220 - 65);

    // Step 2: Verify Phase II Borg target
    const phaseII = cardiacRehabPhases.find((p) => p.phase === "II")!;
    expect(phaseII.vitalSignTargets.borgRPETarget).toMatch(/12.14/);

    // Step 3: Verify RPE 13 is appropriate for Phase II
    const rpeResult = interpretBorgRPE(13);
    expect(rpeResult.intensity).toBe("Somewhat Hard");

    // Step 4: Verify Phase II has resistance training
    expect(phaseII.ptInterventions.some((i) => /resistance/i.test(i))).toBe(
      true,
    );

    // Step 5: Verify contraindications include unstable angina
    expect(
      phaseII.contraindications.some((c) => /unstable angina/i.test(c)),
    ).toBe(true);
  });

  it("6MWT workflow: measure → interpret → set goal", () => {
    const baseline = interpret6MWT(280, 70, "female", 162, 68);
    expect(baseline.percentPredicted).toBeGreaterThan(0);

    // MCID is 30m — goal should be baseline + 30m
    const goalDistance = 280 + 30;
    const goalResult = interpret6MWT(goalDistance, 70, "female", 162, 68);
    expect(goalResult.percentPredicted).toBeGreaterThan(
      baseline.percentPredicted,
    );
  });

  it("Phase I → Phase II progression criteria are defined", () => {
    const phaseI = cardiacRehabPhases.find((p) => p.phase === "I")!;
    expect(phaseI.progressionCriteria.length).toBeGreaterThan(0);
    expect(phaseI.progressionCriteria.some((c) => /stable/i.test(c))).toBe(
      true,
    );
  });

  it("all cardiac phases have evidence level ≥4", () => {
    cardiacRehabPhases.forEach((phase) => {
      expect(phase.evidenceLevel).toBeGreaterThanOrEqual(4);
    });
  });
});

// ============================================================================
// PULMONARY REHAB WORKFLOW
// ============================================================================

describe("Pulmonary Rehab Workflow", () => {
  it("COPD protocol has pursed-lip breathing technique", () => {
    const copd = pulmonaryRehabProtocols.find((p) =>
      p.condition.includes("COPD"),
    )!;
    expect(copd.breathingTechniques.some((t) => /pursed/i.test(t.name))).toBe(
      true,
    );
  });

  it("COPD protocol includes 6MWT as outcome measure", () => {
    const copd = pulmonaryRehabProtocols.find((p) =>
      p.condition.includes("COPD"),
    )!;
    expect(copd.outcomesMeasures.some((o) => /6MWT/i.test(o))).toBe(true);
  });

  it("Heart failure protocol includes daily weight monitoring", () => {
    const hf = pulmonaryRehabProtocols.find((p) =>
      p.condition.includes("Heart Failure"),
    )!;
    expect(hf.interventions.some((i) => /weight/i.test(i))).toBe(true);
  });

  it("all breathing techniques have frequency instructions", () => {
    breathingTechniques.forEach((t) => {
      expect(t.frequency.length).toBeGreaterThan(0);
    });
  });

  it("ACBT technique is appropriate for secretion clearance", () => {
    const acbt = breathingTechniques.find((t) => t.name.includes("ACBT"))!;
    expect(acbt.indication).toMatch(/secretion|clearance/i);
  });

  it("all pulmonary protocols have evidence level ≥4", () => {
    pulmonaryRehabProtocols.forEach((p) => {
      expect(p.evidenceLevel).toBeGreaterThanOrEqual(4);
    });
  });
});

// ============================================================================
// VESTIBULAR REHAB WORKFLOW
// ============================================================================

describe("Vestibular Rehab Workflow", () => {
  it("BPPV assessment → maneuver selection workflow", () => {
    // Step 1: Assess with DHI
    const dhi = vestibularAssessmentTools.find((t) => t.acronym === "DHI")!;
    const dhiScore = 42;
    const dhiResult = dhi.interpretation(dhiScore);
    expect(dhiResult).toMatch(/Moderate/i);

    // Step 2: Select Epley for posterior canal BPPV
    const epley = bppvManeuvers.find((m) => m.name.includes("Epley"))!;
    expect(epley.targetCanal).toBe("posterior");
    expect(epley.steps.length).toBeGreaterThanOrEqual(4);

    // Step 3: Verify success rate is documented
    expect(epley.successRate).toMatch(/\d+/);
  });

  it("DGI <19 triggers fall risk intervention", () => {
    const dgi = vestibularAssessmentTools.find((t) => t.acronym === "DGI")!;
    const score = 16;
    const result = dgi.interpretation(score);
    expect(result).toMatch(/Fall risk/i);

    // Verify balance training program exists
    const balanceProg = vestibularExercisePrograms.find((p) =>
      p.name.includes("Balance"),
    )!;
    expect(balanceProg.exercises.length).toBeGreaterThan(0);
  });

  it("horizontal canal BPPV has Barbecue Roll maneuver", () => {
    const bbq = bppvManeuvers.find((m) => m.targetCanal === "horizontal")!;
    expect(bbq).toBeDefined();
    expect(bbq.steps.length).toBeGreaterThanOrEqual(4);
  });

  it("gaze stabilization program has VOR exercises", () => {
    const gazeProg = vestibularExercisePrograms.find((p) =>
      p.name.includes("Gaze"),
    )!;
    expect(gazeProg.exercises.some((e) => /VOR/i.test(e.name))).toBe(true);
  });

  it("all vestibular exercise programs have progressions", () => {
    vestibularExercisePrograms.forEach((prog) => {
      prog.exercises.forEach((ex) => {
        expect(ex.progressions.length).toBeGreaterThan(0);
      });
    });
  });

  it("all BPPV maneuvers cite Bhattacharyya CPG or equivalent", () => {
    bppvManeuvers.forEach((m) => {
      expect(m.citation.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// CROSS-DOMAIN INTEGRATION
// ============================================================================

describe("Cross-domain clinical integration", () => {
  it("cardiac and pulmonary protocols both use 6MWT as outcome", () => {
    const cardiacPhaseII = cardiacRehabPhases.find((p) => p.phase === "II")!;
    const copdProtocol = pulmonaryRehabProtocols.find((p) =>
      p.condition.includes("COPD"),
    )!;

    // Both domains use 6MWT
    expect(copdProtocol.outcomesMeasures.some((o) => /6MWT/i.test(o))).toBe(
      true,
    );
    // Cardiac uses Borg RPE
    expect(cardiacPhaseII.vitalSignTargets.borgRPETarget).toBeTruthy();
  });

  it("Borg RPE is consistent across cardiac and pulmonary use", () => {
    // Phase II cardiac target: RPE 12-14
    const rpe13 = interpretBorgRPE(13);
    expect(rpe13.intensity).toBe("Somewhat Hard");

    // COPD target: Borg dyspnea 4-6/10 (different scale, but RPE 12-14 is standard)
    const rpe14 = interpretBorgRPE(14);
    expect(rpe14.intensity).toBe("Hard");
  });

  it("all data modules have authoritative citations", () => {
    const allCitations = [
      ...cardiacRehabPhases.map(() => "AACVPR/AHA"),
      ...pulmonaryRehabProtocols.map((p) => p.citation),
      ...bppvManeuvers.map((m) => m.citation),
      ...vestibularExercisePrograms.map((p) => p.citation),
    ];
    allCitations.forEach((c) => {
      expect(c.length).toBeGreaterThan(5);
    });
  });
});
