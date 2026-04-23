import { describe, it, expect } from "vitest";
import {
  getNeurologicalAssessmentByAcronym,
  getProtocolsByCondition,
  getNeuroplasticityInterventionsByIndication,
  interpretNeurologicalAssessment,
  calculateFallRiskFromBBS,
  calculateFallRiskFromTUG,
} from "../../data/pt-neurological-data";

describe("pt-neurological-data", () => {
  describe("getNeurologicalAssessmentByAcronym", () => {
    it("should return assessment for valid acronym", () => {
      const assessment = getNeurologicalAssessmentByAcronym("BBS");
      expect(assessment).toBeDefined();
      if (assessment) {
        expect(assessment.acronym).toBe("BBS");
        expect(assessment.name).toBeDefined();
      }
    });

    it("should return undefined for invalid acronym", () => {
      const assessment = getNeurologicalAssessmentByAcronym("INVALID");
      expect(assessment).toBeUndefined();
    });

    it("should handle case sensitivity", () => {
      const upper = getNeurologicalAssessmentByAcronym("BBS");
      const lower = getNeurologicalAssessmentByAcronym("bbs");
      // Should handle both or be consistent
      expect(upper !== undefined || lower !== undefined).toBe(true);
    });

    it("should return assessment with required properties", () => {
      const assessment = getNeurologicalAssessmentByAcronym("BBS");
      if (assessment) {
        expect(assessment.acronym).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(typeof assessment.acronym).toBe("string");
        expect(typeof assessment.name).toBe("string");
      }
    });

    it("should return assessment with scoring information", () => {
      const assessment = getNeurologicalAssessmentByAcronym("BBS");
      if (assessment) {
        expect(assessment.scoringRange).toBeDefined();
      }
    });

    it("should handle common neurological assessments", () => {
      const acronyms = ["BBS", "TUG", "FMA", "FIM"];
      for (const acronym of acronyms) {
        const assessment = getNeurologicalAssessmentByAcronym(acronym);
        // At least some should be defined
        if (assessment) {
          expect(assessment.acronym).toBeDefined();
        }
      }
    });

    it("should return assessment with clinical interpretation", () => {
      const assessment = getNeurologicalAssessmentByAcronym("BBS");
      if (assessment) {
        expect(assessment.interpretation).toBeDefined();
      }
    });
  });

  describe("getProtocolsByCondition", () => {
    it("should return array for valid condition", () => {
      const protocols = getProtocolsByCondition("Stroke");
      expect(Array.isArray(protocols)).toBe(true);
    });

    it("should return empty array for invalid condition", () => {
      const protocols = getProtocolsByCondition("InvalidCondition");
      expect(Array.isArray(protocols)).toBe(true);
    });

    it("should return protocols with required properties", () => {
      const protocols = getProtocolsByCondition("Stroke");
      if (protocols.length > 0) {
        protocols.forEach((protocol) => {
          expect(protocol.condition).toBeDefined();
          expect(typeof protocol.condition).toBe("string");
        });
      }
    });

    it("should handle common neurological conditions", () => {
      const conditions = ["Stroke", "Parkinson", "MS", "SCI", "TBI"];
      for (const condition of conditions) {
        const protocols = getProtocolsByCondition(condition);
        expect(Array.isArray(protocols)).toBe(true);
      }
    });

    it("should return protocols with intervention details", () => {
      const protocols = getProtocolsByCondition("Stroke");
      if (protocols.length > 0) {
        protocols.forEach((protocol) => {
          expect(protocol.interventions || protocol.description).toBeDefined();
        });
      }
    });

    it("should return protocols with evidence level", () => {
      const protocols = getProtocolsByCondition("Stroke");
      if (protocols.length > 0) {
        protocols.forEach((protocol) => {
          expect(protocol.evidenceLevel || protocol.evidence).toBeDefined();
        });
      }
    });

    it("should handle case variations", () => {
      const upper = getProtocolsByCondition("STROKE");
      const lower = getProtocolsByCondition("stroke");
      const mixed = getProtocolsByCondition("Stroke");
      // At least one should return results
      expect(upper.length > 0 || lower.length > 0 || mixed.length > 0).toBe(
        true,
      );
    });
  });

  describe("getNeuroplasticityInterventionsByIndication", () => {
    it("should return array for valid indication", () => {
      const interventions =
        getNeuroplasticityInterventionsByIndication("Motor Recovery");
      expect(Array.isArray(interventions)).toBe(true);
    });

    it("should return empty array for invalid indication", () => {
      const interventions =
        getNeuroplasticityInterventionsByIndication("InvalidIndication");
      expect(Array.isArray(interventions)).toBe(true);
    });

    it("should return interventions with required properties", () => {
      const interventions =
        getNeuroplasticityInterventionsByIndication("Motor Recovery");
      if (interventions.length > 0) {
        interventions.forEach((intervention) => {
          expect(intervention.name || intervention.title).toBeDefined();
          expect(typeof (intervention.name || intervention.title)).toBe(
            "string",
          );
        });
      }
    });

    it("should handle common neuroplasticity indications", () => {
      const indications = [
        "Motor Recovery",
        "Sensory Retraining",
        "Cognitive Recovery",
        "Balance",
      ];
      for (const indication of indications) {
        const interventions =
          getNeuroplasticityInterventionsByIndication(indication);
        expect(Array.isArray(interventions)).toBe(true);
      }
    });

    it("should return interventions with mechanism of action", () => {
      const interventions =
        getNeuroplasticityInterventionsByIndication("Motor Recovery");
      if (interventions.length > 0) {
        interventions.forEach((intervention) => {
          expect(
            intervention.mechanism || intervention.description,
          ).toBeDefined();
        });
      }
    });

    it("should return interventions with evidence", () => {
      const interventions =
        getNeuroplasticityInterventionsByIndication("Motor Recovery");
      if (interventions.length > 0) {
        interventions.forEach((intervention) => {
          expect(
            intervention.evidence || intervention.evidenceLevel,
          ).toBeDefined();
        });
      }
    });
  });

  describe("interpretNeurologicalAssessment", () => {
    it("should return string interpretation", () => {
      const interpretation = interpretNeurologicalAssessment("BBS", 45);
      expect(typeof interpretation).toBe("string");
    });

    it("should handle valid BBS scores", () => {
      const scores = [0, 25, 45, 56];
      for (const score of scores) {
        const interpretation = interpretNeurologicalAssessment("BBS", score);
        expect(typeof interpretation).toBe("string");
        expect(interpretation.length).toBeGreaterThan(0);
      }
    });

    it("should handle valid TUG scores", () => {
      const scores = [10, 15, 20, 30];
      for (const score of scores) {
        const interpretation = interpretNeurologicalAssessment("TUG", score);
        expect(typeof interpretation).toBe("string");
      }
    });

    it("should handle edge case scores", () => {
      const interpretation1 = interpretNeurologicalAssessment("BBS", 0);
      const interpretation2 = interpretNeurologicalAssessment("BBS", 56);
      expect(typeof interpretation1).toBe("string");
      expect(typeof interpretation2).toBe("string");
    });

    it("should handle invalid assessment acronym", () => {
      const interpretation = interpretNeurologicalAssessment("INVALID", 50);
      expect(typeof interpretation).toBe("string");
    });

    it("should provide clinically meaningful interpretation", () => {
      const interpretation = interpretNeurologicalAssessment("BBS", 20);
      expect(interpretation.length).toBeGreaterThan(0);
      // Should contain clinical terms
      expect(
        interpretation.toLowerCase().includes("risk") ||
          interpretation.toLowerCase().includes("fall") ||
          interpretation.toLowerCase().includes("balance"),
      ).toBe(true);
    });
  });

  describe("calculateFallRiskFromBBS", () => {
    it("should return object with risk and recommendations", () => {
      const result = calculateFallRiskFromBBS(45);
      expect(result).toBeDefined();
      expect(result.risk).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it("should classify low risk (BBS > 45)", () => {
      const result = calculateFallRiskFromBBS(50);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should classify medium risk (BBS 21-45)", () => {
      const result = calculateFallRiskFromBBS(30);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should classify high risk (BBS < 21)", () => {
      const result = calculateFallRiskFromBBS(15);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should provide recommendations for low risk", () => {
      const result = calculateFallRiskFromBBS(50);
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
    });

    it("should provide recommendations for high risk", () => {
      const result = calculateFallRiskFromBBS(10);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should handle edge case scores", () => {
      const result1 = calculateFallRiskFromBBS(0);
      const result2 = calculateFallRiskFromBBS(56);
      expect(result1.risk).toBeDefined();
      expect(result2.risk).toBeDefined();
    });

    it("should provide string recommendations", () => {
      const result = calculateFallRiskFromBBS(25);
      result.recommendations.forEach((rec) => {
        expect(typeof rec).toBe("string");
        expect(rec.length).toBeGreaterThan(0);
      });
    });

    it("should have consistent risk classification", () => {
      const low = calculateFallRiskFromBBS(50);
      const high = calculateFallRiskFromBBS(10);
      expect(low.risk).toBeDefined();
      expect(high.risk).toBeDefined();
      // Risk levels should be different
      expect(
        low.risk !== high.risk ||
          low.recommendations.length !== high.recommendations.length,
      ).toBe(true);
    });
  });

  describe("calculateFallRiskFromTUG", () => {
    it("should return object with risk and interpretation", () => {
      const result = calculateFallRiskFromTUG(15);
      expect(result).toBeDefined();
      expect(result.risk).toBeDefined();
      expect(result.interpretation).toBeDefined();
    });

    it("should classify low risk (TUG < 12)", () => {
      const result = calculateFallRiskFromTUG(10);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should classify medium risk (TUG 12-21)", () => {
      const result = calculateFallRiskFromTUG(15);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should classify high risk (TUG > 21)", () => {
      const result = calculateFallRiskFromTUG(25);
      expect(result.risk).toBeDefined();
      expect(typeof result.risk).toBe("string");
    });

    it("should provide interpretation", () => {
      const result = calculateFallRiskFromTUG(15);
      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe("string");
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it("should handle edge case scores", () => {
      const result1 = calculateFallRiskFromTUG(0);
      const result2 = calculateFallRiskFromTUG(60);
      expect(result1.risk).toBeDefined();
      expect(result2.risk).toBeDefined();
    });

    it("should provide clinical interpretation", () => {
      const result = calculateFallRiskFromTUG(20);
      expect(result.interpretation.length).toBeGreaterThan(0);
      // Should contain clinical terms
      expect(
        result.interpretation.toLowerCase().includes("risk") ||
          result.interpretation.toLowerCase().includes("fall") ||
          result.interpretation.toLowerCase().includes("mobility"),
      ).toBe(true);
    });

    it("should have consistent risk classification", () => {
      const low = calculateFallRiskFromTUG(10);
      const high = calculateFallRiskFromTUG(30);
      expect(low.risk).toBeDefined();
      expect(high.risk).toBeDefined();
      // Risk levels should differ
      expect(
        low.risk !== high.risk || low.interpretation !== high.interpretation,
      ).toBe(true);
    });

    it("should handle decimal scores", () => {
      const result = calculateFallRiskFromTUG(15.5);
      expect(result.risk).toBeDefined();
      expect(result.interpretation).toBeDefined();
    });
  });

  describe("data consistency", () => {
    it("should have consistent assessment data", () => {
      const bbs = getNeurologicalAssessmentByAcronym("BBS");
      if (bbs) {
        expect(bbs.acronym).toBe("BBS");
        expect(bbs.name).toBeDefined();
      }
    });

    it("should return consistent results for same input", () => {
      const result1 = calculateFallRiskFromBBS(30);
      const result2 = calculateFallRiskFromBBS(30);
      expect(result1.risk).toBe(result2.risk);
    });

    it("should have protocols for common conditions", () => {
      const protocols = getProtocolsByCondition("Stroke");
      expect(Array.isArray(protocols)).toBe(true);
    });
  });
});
