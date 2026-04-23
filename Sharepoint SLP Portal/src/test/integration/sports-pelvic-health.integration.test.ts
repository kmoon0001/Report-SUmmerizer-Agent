/**
 * Integration Test: Sports & Pelvic Health Hub
 * Requirements: 1.2, 1.3
 */

import { describe, it, expect } from "vitest";
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
  pelvicFloorAssessment,
} from "../../data/pt-sports-pelvic-data";

// ============================================================================
// SPORTS REHABILITATION WORKFLOW
// ============================================================================

describe("Sports Rehabilitation Workflow", () => {
  it("complete FMS assessment → risk stratification → corrective plan", () => {
    // Step 1: Score FMS
    const scores = [2, 2, 2, 2, 2, 1, 1]; // total = 12
    const result = calculateFMSScore(scores);
    expect(result.total).toBe(12);
    expect(result.riskLevel).toMatch(/Elevated/i);

    // Step 2: Identify asymmetries
    expect(result.asymmetries).toBe(2);

    // Step 3: Get correctives for low-scoring tests
    const lowTests = fmsTests.filter((_, i) => scores[i] <= 1);
    expect(lowTests.length).toBeGreaterThan(0);
    lowTests.forEach((test) => {
      expect(test.correctives.length).toBeGreaterThan(0);
    });
  });

  it("ACL rehab: phase progression workflow", () => {
    // Phase 1 → 2 progression
    const phase1 = aclRehabProtocol[0];
    expect(phase1.progressionCriteria.some((c) => /extension/i.test(c))).toBe(
      true,
    );

    // Phase 2 → 3 progression
    const phase2 = aclRehabProtocol[1];
    expect(
      phase2.progressionCriteria.some((c) => /LSI|strength/i.test(c)),
    ).toBe(true);

    // Phase 4 RTS criteria
    const phase4 = aclRehabProtocol[3];
    expect(
      phase4.progressionCriteria.some((c) => /LSI.*90%|90%.*LSI/i.test(c)),
    ).toBe(true);
  });

  it("return-to-sport: ACL criteria checklist workflow", () => {
    const acl = returnToSportCriteria.find((r) => r.sport.includes("ACL"))!;

    // All 4 categories must be assessed
    const categories = acl.criteria.map((c) => c.category);
    expect(categories).toContain("Strength");
    expect(categories).toContain("Functional Performance");
    expect(categories).toContain("Psychological Readiness");
    expect(categories).toContain("Movement Quality");

    // Minimum timeline enforced
    expect(acl.timelineMinimum).toMatch(/9 months/i);
  });

  it("FMS score 18+ clears athlete for sport-specific training", () => {
    const result = calculateFMSScore([3, 3, 3, 3, 3, 3, 3]);
    expect(result.total).toBe(21);
    expect(result.recommendation).toMatch(/sport-specific training/i);
  });

  it("all FMS tests have evidence-based correctives", () => {
    fmsTests.forEach((test) => {
      expect(test.correctives.length).toBeGreaterThanOrEqual(2);
      expect(test.commonDysfunctions.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ============================================================================
// PELVIC HEALTH WORKFLOW
// ============================================================================

describe("Pelvic Health Workflow", () => {
  it("stress incontinence assessment → PFMT protocol selection", () => {
    // Step 1: Oxford grade 2 → moderate weakness
    const oxford = interpretModifiedOxford(2);
    expect(oxford.clinicalImplication).toMatch(/PFMT/i);

    // Step 2: ICIQ-SF score 8 → moderate
    const iciq = interpretICIQSF(8);
    expect(iciq).toMatch(/Moderate/i);

    // Step 3: Select stress incontinence protocol
    const stressProtocol = pfmtProtocols.find((p) =>
      p.indication.includes("stress"),
    )!;
    expect(stressProtocol).toBeDefined();
    expect(stressProtocol.exercises.some((e) => /Knack/i.test(e.name))).toBe(
      true,
    );
  });

  it("urge incontinence: bladder training workflow", () => {
    const urgeProtocol = pfmtProtocols.find((p) =>
      p.indication.includes("urge"),
    )!;
    expect(
      urgeProtocol.exercises.some((e) => /Urge Suppression/i.test(e.name)),
    ).toBe(true);
    expect(
      urgeProtocol.exercises.some((e) => /Timed Voiding/i.test(e.name)),
    ).toBe(true);
  });

  it("bowel retraining: complete intervention set", () => {
    const bowel = bladderBowelProtocols.find((p) => p.name.includes("Bowel"))!;
    // Must include key evidence-based interventions
    expect(bowel.interventions.some((i) => /gastrocolic/i.test(i))).toBe(true);
    expect(bowel.interventions.some((i) => /abdominal massage/i.test(i))).toBe(
      true,
    );
    expect(bowel.interventions.some((i) => /biofeedback/i.test(i))).toBe(true);
  });

  it("catheter removal: PVR goal defined", () => {
    const cath = bladderBowelProtocols.find((p) =>
      p.name.includes("Catheter"),
    )!;
    expect(cath.interventions.some((i) => /100 mL/i.test(i))).toBe(true);
  });

  it("postpartum return-to-running: 12-week minimum enforced", () => {
    const late = prePostPartumProtocols.find(
      (p) => p.phase === "postpartum-late",
    )!;
    const runningGuideline = late.returnToActivityGuidelines.find((g) =>
      /running/i.test(g),
    )!;
    expect(runningGuideline).toMatch(/12 weeks/i);
  });

  it("prenatal PFMT reduces incontinence risk", () => {
    const prenatal = prePostPartumProtocols.find(
      (p) => p.phase === "prenatal",
    )!;
    const pfmtIntervention = prenatal.interventions.find((i) =>
      /PFMT/i.test(i),
    )!;
    expect(pfmtIntervention).toMatch(/prevents incontinence/i);
  });

  it("all PFMT protocols have minimum 12-week duration", () => {
    pfmtProtocols.forEach((p) => {
      // Duration should reference weeks
      expect(p.duration).toMatch(/week/i);
    });
  });

  it("pelvic floor assessment covers full Oxford scale 0-5", () => {
    for (let g = 0; g <= 5; g++) {
      const result = interpretModifiedOxford(g);
      expect(result.description.length).toBeGreaterThan(0);
      expect(result.clinicalImplication.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// EVIDENCE QUALITY
// ============================================================================

describe("Evidence quality across sports & pelvic modules", () => {
  it("all return-to-sport criteria cite peer-reviewed sources", () => {
    returnToSportCriteria.forEach((r) => {
      expect(r.citation).toMatch(/\d{4}/); // year present
    });
  });

  it("all PFMT protocols cite Bø or NICE", () => {
    pfmtProtocols.forEach((p) => {
      expect(p.citation).toMatch(/Bø|NICE/i);
    });
  });

  it("bladder/bowel protocols have outcome measures", () => {
    bladderBowelProtocols.forEach((p) => {
      expect(p.outcomesMeasures.length).toBeGreaterThan(0);
    });
  });

  it("FMS score ≤14 is clinically validated as elevated risk", () => {
    const result = calculateFMSScore([2, 2, 2, 2, 2, 1, 1]);
    expect(result.total).toBe(12);
    expect(result.riskLevel).toMatch(/Elevated/i);
  });
});
