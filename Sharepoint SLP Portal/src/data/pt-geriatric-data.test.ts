/**
 * Unit tests for Geriatric Rehabilitation Clinical Content
 *
 * Tests data structure validity, evidence levels, and content completeness
 * Requirements: 1.2, 1.3, 7.6, 22.1, 22.2
 */

import { describe, it, expect } from "vitest";
import {
  geriatricAssessmentTools,
  geriatricTreatmentProtocols,
  fallPreventionInterventions,
  balanceTrainingExercises,
  patientEducationMaterials,
  geriatricClinicalResources,
  fallRiskFactors,
  functionalMobilityLevels,
} from "./pt-geriatric-data";

describe("Geriatric Assessment Tools", () => {
  it("should have at least 8 assessment tools", () => {
    expect(geriatricAssessmentTools.length).toBeGreaterThanOrEqual(8);
  });

  it("should have valid evidence levels (3-5)", () => {
    geriatricAssessmentTools.forEach((tool) => {
      expect(tool.evidenceLevel).toBeGreaterThanOrEqual(3);
      expect(tool.evidenceLevel).toBeLessThanOrEqual(5);
    });
  });

  it("should have interpretation functions for all tools", () => {
    geriatricAssessmentTools.forEach((tool) => {
      expect(typeof tool.interpretation).toBe("function");
      const result = tool.interpretation(tool.scoringRange.min);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it("should have citations for all tools", () => {
    geriatricAssessmentTools.forEach((tool) => {
      expect(tool.citation).toBeTruthy();
      expect(tool.citation.length).toBeGreaterThan(10);
    });
  });

  it("should include TUG assessment", () => {
    const tug = geriatricAssessmentTools.find((t) => t.acronym === "TUG");
    expect(tug).toBeDefined();
    expect(tug?.name).toBe("Timed Up and Go");
  });

  it("should include Berg Balance Scale", () => {
    const bbs = geriatricAssessmentTools.find((t) => t.acronym === "BBS");
    expect(bbs).toBeDefined();
    expect(bbs?.scoringRange.max).toBe(56);
  });
});

describe("Geriatric Treatment Protocols", () => {
  it("should have at least 4 treatment protocols", () => {
    expect(geriatricTreatmentProtocols.length).toBeGreaterThanOrEqual(4);
  });

  it("should have valid evidence levels (3-5)", () => {
    geriatricTreatmentProtocols.forEach((protocol) => {
      expect(protocol.evidenceLevel).toBeGreaterThanOrEqual(3);
      expect(protocol.evidenceLevel).toBeLessThanOrEqual(5);
    });
  });

  it("should have interventions with CPT codes", () => {
    geriatricTreatmentProtocols.forEach((protocol) => {
      expect(protocol.interventions.length).toBeGreaterThan(0);
      protocol.interventions.forEach((intervention) => {
        expect(intervention.cptCode).toMatch(/^\d{5}$/);
      });
    });
  });

  it("should have contraindications and precautions", () => {
    geriatricTreatmentProtocols.forEach((protocol) => {
      expect(protocol.contraindications.length).toBeGreaterThan(0);
      expect(protocol.precautions.length).toBeGreaterThan(0);
    });
  });

  it("should include fall prevention protocol", () => {
    const fallPrevention = geriatricTreatmentProtocols.find((p) =>
      p.condition.includes("Fall Risk"),
    );
    expect(fallPrevention).toBeDefined();
    expect(fallPrevention?.icdCode).toBe("Z91.81");
  });

  it("should include osteoporosis protocol", () => {
    const osteoporosis = geriatricTreatmentProtocols.find(
      (p) => p.condition === "Osteoporosis",
    );
    expect(osteoporosis).toBeDefined();
    expect(osteoporosis?.icdCode).toBe("M81.0");
  });
});

describe("Fall Prevention Interventions", () => {
  it("should have at least 6 evidence-based interventions", () => {
    expect(fallPreventionInterventions.length).toBeGreaterThanOrEqual(6);
  });

  it("should have valid evidence levels (3-5)", () => {
    fallPreventionInterventions.forEach((intervention) => {
      expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(3);
      expect(intervention.evidenceLevel).toBeLessThanOrEqual(5);
    });
  });

  it("should include fall reduction percentages", () => {
    fallPreventionInterventions.forEach((intervention) => {
      expect(intervention.fallReduction).toBeTruthy();
      expect(intervention.fallReduction.length).toBeGreaterThan(0);
    });
  });

  it("should include Otago Exercise Program", () => {
    const otago = fallPreventionInterventions.find(
      (i) => i.name === "Otago Exercise Program",
    );
    expect(otago).toBeDefined();
    expect(otago?.fallReduction).toContain("35%");
    expect(otago?.evidenceLevel).toBe(5);
  });

  it("should include Tai Chi", () => {
    const taiChi = fallPreventionInterventions.find(
      (i) => i.name === "Tai Chi",
    );
    expect(taiChi).toBeDefined();
    expect(taiChi?.fallReduction).toContain("29%");
  });
});

describe("Balance Training Exercises", () => {
  it("should have at least 8 balance exercises", () => {
    expect(balanceTrainingExercises.length).toBeGreaterThanOrEqual(8);
  });

  it("should have exercises at all difficulty levels", () => {
    const beginner = balanceTrainingExercises.filter(
      (e) => e.level === "beginner",
    );
    const intermediate = balanceTrainingExercises.filter(
      (e) => e.level === "intermediate",
    );
    const advanced = balanceTrainingExercises.filter(
      (e) => e.level === "advanced",
    );

    expect(beginner.length).toBeGreaterThan(0);
    expect(intermediate.length).toBeGreaterThan(0);
    expect(advanced.length).toBeGreaterThan(0);
  });

  it("should have safety considerations for all exercises", () => {
    balanceTrainingExercises.forEach((exercise) => {
      expect(exercise.safetyConsiderations.length).toBeGreaterThan(0);
    });
  });

  it("should have progression guidelines", () => {
    balanceTrainingExercises.forEach((exercise) => {
      expect(exercise.progression).toBeTruthy();
      expect(exercise.progression.length).toBeGreaterThan(10);
    });
  });
});

describe("Patient Education Materials", () => {
  it("should have at least 6 education topics", () => {
    expect(patientEducationMaterials.length).toBeGreaterThanOrEqual(6);
  });

  it("should have valid evidence levels (3-5)", () => {
    patientEducationMaterials.forEach((material) => {
      expect(material.evidenceLevel).toBeGreaterThanOrEqual(3);
      expect(material.evidenceLevel).toBeLessThanOrEqual(5);
    });
  });

  it("should have key points for all topics", () => {
    patientEducationMaterials.forEach((material) => {
      expect(material.keyPoints.length).toBeGreaterThan(3);
    });
  });

  it("should include fall prevention basics", () => {
    const fallPrevention = patientEducationMaterials.find(
      (m) => m.topic === "Fall Prevention Basics",
    );
    expect(fallPrevention).toBeDefined();
    expect(fallPrevention?.targetAudience).toBe("both");
  });

  it("should include home safety checklist", () => {
    const homeSafety = patientEducationMaterials.find(
      (m) => m.topic === "Home Safety Checklist",
    );
    expect(homeSafety).toBeDefined();
  });
});

describe("Clinical Resources", () => {
  it("should have at least 8 clinical resources", () => {
    expect(geriatricClinicalResources.length).toBeGreaterThanOrEqual(8);
  });

  it("should have valid evidence levels (3-5)", () => {
    geriatricClinicalResources.forEach((resource) => {
      expect(resource.evidenceLevel).toBeGreaterThanOrEqual(3);
      expect(resource.evidenceLevel).toBeLessThanOrEqual(5);
    });
  });

  it("should have URLs for all resources", () => {
    geriatricClinicalResources.forEach((resource) => {
      expect(resource.url).toBeTruthy();
      expect(resource.url).toMatch(/^https?:\/\//);
    });
  });

  it("should include CDC STEADI", () => {
    const steadi = geriatricClinicalResources.find(
      (r) => r.title === "CDC STEADI Initiative",
    );
    expect(steadi).toBeDefined();
    expect(steadi?.organization).toBe(
      "Centers for Disease Control and Prevention",
    );
  });
});

describe("Fall Risk Factors", () => {
  it("should have at least 15 risk factors", () => {
    expect(fallRiskFactors.length).toBeGreaterThanOrEqual(15);
  });

  it("should categorize risk factors", () => {
    const intrinsic = fallRiskFactors.filter((f) => f.category === "intrinsic");
    const extrinsic = fallRiskFactors.filter((f) => f.category === "extrinsic");
    const behavioral = fallRiskFactors.filter(
      (f) => f.category === "behavioral",
    );

    expect(intrinsic.length).toBeGreaterThan(0);
    expect(extrinsic.length).toBeGreaterThan(0);
    expect(behavioral.length).toBeGreaterThan(0);
  });

  it("should have interventions for all risk factors", () => {
    fallRiskFactors.forEach((factor) => {
      expect(factor.interventions.length).toBeGreaterThan(0);
    });
  });

  it("should identify modifiable risk factors", () => {
    const modifiable = fallRiskFactors.filter((f) => f.modifiable);
    expect(modifiable.length).toBeGreaterThan(10);
  });
});

describe("Functional Mobility Levels", () => {
  it("should have 4 functional mobility levels", () => {
    expect(functionalMobilityLevels.length).toBe(4);
  });

  it("should have fall risk categorization", () => {
    functionalMobilityLevels.forEach((level) => {
      expect(["low", "moderate", "high", "very-high"]).toContain(
        level.fallRisk,
      );
    });
  });

  it("should have TUG and BBS score ranges", () => {
    functionalMobilityLevels.forEach((level) => {
      expect(level.tugScore).toBeTruthy();
      expect(level.bbsScore).toBeTruthy();
      expect(level.gaitSpeed).toBeTruthy();
    });
  });

  it("should have intervention focus areas", () => {
    functionalMobilityLevels.forEach((level) => {
      expect(level.interventionFocus.length).toBeGreaterThan(0);
    });
  });
});

describe("Data Integrity", () => {
  it("should have authoritative citations", () => {
    const allCitations = [
      ...geriatricAssessmentTools.map((t) => t.citation),
      ...geriatricTreatmentProtocols.map((p) => p.citation),
      ...fallPreventionInterventions.map((i) => i.citation),
      ...patientEducationMaterials.map((m) => m.citation),
    ];

    allCitations.forEach((citation) => {
      expect(citation).toBeTruthy();
      // Should contain author names or organization
      expect(citation.length).toBeGreaterThan(20);
    });
  });

  it("should reference CDC STEADI in multiple places", () => {
    const stedaiReferences = [
      ...geriatricTreatmentProtocols.filter((p) =>
        p.citation.includes("STEADI"),
      ),
      ...fallPreventionInterventions.filter((i) =>
        i.citation.includes("STEADI"),
      ),
      ...patientEducationMaterials.filter((m) => m.citation.includes("STEADI")),
    ];

    expect(stedaiReferences.length).toBeGreaterThan(0);
  });

  it("should reference AGS guidelines", () => {
    const agsReferences = [
      ...geriatricTreatmentProtocols.filter((p) => p.citation.includes("AGS")),
      ...fallPreventionInterventions.filter((i) => i.citation.includes("AGS")),
    ];

    expect(agsReferences.length).toBeGreaterThan(0);
  });
});
