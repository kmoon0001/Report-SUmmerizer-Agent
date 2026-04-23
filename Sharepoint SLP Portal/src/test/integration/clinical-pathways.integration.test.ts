/**
 * Integration Test: PT Clinical Pathways
 * Requirements: 17.4, 2.1
 * Sources: APTA CPGs, CMS, JOSPT, Cochrane Reviews
 */
import { describe, it, expect } from "vitest";
import {
  ptClinicalPathways,
  getPathwayById,
  getPathwaysByCategory,
  getImmediateRedFlags,
} from "../../data/pt-clinical-pathways-data";

describe("TKA Rehabilitation Pathway Workflow", () => {
  // Skipped: Requires database infrastructure
  // To run: Set up database then npm test -- --run src/test/integration/clinical-pathways.integration.test.ts
  it("complete TKA pathway: Phase 1 → 2 → 3 progression", () => {
    const tka = getPathwayById("post-tka")!;

    // Phase 1 criteria met
    const phase1 = tka.phases[0];
    expect(
      phase1.progressionCriteria.some((c) => /flexion.*90°/i.test(c)),
    ).toBe(true);

    // Phase 2 criteria
    const phase2 = tka.phases[1];
    expect(
      phase2.progressionCriteria.some((c) =>
        /ambulation without device/i.test(c),
      ),
    ).toBe(true);

    // Phase 3 discharge criteria
    const phase3 = tka.phases[2];
    expect(phase3.progressionCriteria.some((c) => /LEFS|TUG/i.test(c))).toBe(
      true,
    );
  });

  it("TKA red flags include DVT and infection as immediate", () => {
    const tka = getPathwayById("post-tka")!;
    const immediate = getImmediateRedFlags(tka);
    expect(immediate.some((f) => /DVT/i.test(f.flag))).toBe(true);
    expect(immediate.some((f) => /infection/i.test(f.flag))).toBe(true);
  });

  it("TKA Phase 1 gait training CPT code is 97116", () => {
    const tka = getPathwayById("post-tka")!;
    const phase1 = tka.phases[0];
    const gait = phase1.interventions.find((i) =>
      /gait training/i.test(i.name),
    )!;
    expect(gait.cptCode).toBe("97116");
  });

  it("TKA Phase 1 outcome measures include LEFS", () => {
    const tka = getPathwayById("post-tka")!;
    expect(tka.phases[0].outcomeMeasures.some((o) => /LEFS/i.test(o))).toBe(
      true,
    );
  });
});

describe("Low Back Pain Pathway Workflow", () => {
  // Skipped: Requires database infrastructure
  it("LBP cauda equina red flag triggers emergency action", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const ce = lbp.redFlags.find((f) => /cauda equina/i.test(f.flag))!;
    expect(ce.urgency).toBe("immediate");
    expect(ce.action).toMatch(/emergency/i);
  });

  it("LBP Phase 1 includes manual therapy and exercise", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const phase1 = lbp.phases[0];
    expect(
      phase1.interventions.some((i) => /manual therapy/i.test(i.name)),
    ).toBe(true);
    expect(phase1.interventions.some((i) => /exercise/i.test(i.name))).toBe(
      true,
    );
  });

  it("LBP Phase 1 manual therapy CPT code is 97140", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const mt = lbp.phases[0].interventions.find((i) =>
      /manual therapy/i.test(i.name),
    )!;
    expect(mt.cptCode).toBe("97140");
  });

  it("LBP Phase 2 discharge criteria include ODI <20%", () => {
    const lbp = getPathwayById("low-back-pain")!;
    const phase2 = lbp.phases[1];
    expect(phase2.progressionCriteria.some((c) => /ODI.*20%/i.test(c))).toBe(
      true,
    );
  });
});

describe("Stroke Rehabilitation Pathway Workflow", () => {
  // Skipped: Requires database infrastructure
  it("stroke Phase 1 includes task-specific training", () => {
    const stroke = getPathwayById("stroke-rehab")!;
    const phase1 = stroke.phases[0];
    expect(
      phase1.interventions.some((i) => /task-specific/i.test(i.name)),
    ).toBe(true);
  });

  it("stroke Phase 2 CIMT has Level 5 evidence", () => {
    const stroke = getPathwayById("stroke-rehab")!;
    const phase2 = stroke.phases[1];
    const cimt = phase2.interventions.find((i) => /CIMT/i.test(i.name))!;
    expect(cimt.evidenceLevel).toBe(5);
  });

  it("stroke Phase 2 progression criteria include BBS ≥45", () => {
    const stroke = getPathwayById("stroke-rehab")!;
    const phase2 = stroke.phases[1];
    expect(phase2.progressionCriteria.some((c) => /BBS.*45/i.test(c))).toBe(
      true,
    );
  });

  it("stroke red flags include stroke recurrence as immediate", () => {
    const stroke = getPathwayById("stroke-rehab")!;
    const recurrence = stroke.redFlags.find((f) =>
      /stroke recurrence/i.test(f.flag),
    )!;
    expect(recurrence.urgency).toBe("immediate");
    expect(recurrence.action).toMatch(/911/i);
  });
});

describe("Fall Prevention SNF Pathway Workflow", () => {
  // Skipped: Requires database infrastructure
  it("fall prevention Phase 1 includes TUG and BBS assessment", () => {
    const fp = getPathwayById("fall-prevention-snf")!;
    const phase1 = fp.phases[0];
    expect(phase1.outcomeMeasures.some((o) => /TUG/i.test(o))).toBe(true);
    expect(phase1.outcomeMeasures.some((o) => /BBS/i.test(o))).toBe(true);
  });

  it("fall prevention Phase 2 includes Otago exercises", () => {
    const fp = getPathwayById("fall-prevention-snf")!;
    const phase2 = fp.phases[1];
    expect(
      phase2.interventions.some((i) => /balance training|Otago/i.test(i.name)),
    ).toBe(true);
  });

  it("fall prevention red flags include TUG >30s as urgent", () => {
    const fp = getPathwayById("fall-prevention-snf")!;
    const tug = fp.redFlags.find((f) => /TUG.*30s/i.test(f.flag))!;
    expect(tug.urgency).toBe("urgent");
  });
});

describe("Evidence quality across all pathways", () => {
  // Skipped: Requires database infrastructure
  it("all pathways cite authoritative sources", () => {
    ptClinicalPathways.forEach((p) => {
      expect(p.evidenceSource).toMatch(/APTA|CMS|Cochrane|AHA|CDC/i);
    });
  });

  it("all interventions have evidence level ≥3", () => {
    ptClinicalPathways.forEach((pathway) => {
      pathway.phases.forEach((phase) => {
        phase.interventions.forEach((int) => {
          expect(int.evidenceLevel).toBeGreaterThanOrEqual(3);
        });
      });
    });
  });

  it("all pathways have ICD codes", () => {
    ptClinicalPathways.forEach((p) => {
      expect(p.icdCode.length).toBeGreaterThan(0);
    });
  });
});
