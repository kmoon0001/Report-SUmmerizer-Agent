/**
 * Unit Tests for Medicare Compliance Validator
 *
 * Tests validation of PT documentation against Medicare requirements
 * Requirements: 3.3, 3.4, 8.1, 8.2, 8.3, 8.7
 */

import { describe, it, expect } from "vitest";
import {
  validateMedicareCompliance,
  mapInterventionToCPT,
} from "./medicare-compliance-validator";
import type { SOAPNote } from "../types/documentation-compliance";

describe("Medicare Compliance Validator", () => {
  describe("mapInterventionToCPT", () => {
    describe("Therapeutic Exercise (97110)", () => {
      it('should map "therapeutic exercise" to CPT code 97110', () => {
        expect(mapInterventionToCPT("therapeutic exercise")).toBe("97110");
      });

      it('should map "Therapeutic Exercise" (case insensitive) to 97110', () => {
        expect(mapInterventionToCPT("Therapeutic Exercise")).toBe("97110");
      });

      it('should map "strengthening" to 97110', () => {
        expect(mapInterventionToCPT("strengthening exercises")).toBe("97110");
      });

      it('should map "stretching" to 97110', () => {
        expect(mapInterventionToCPT("stretching program")).toBe("97110");
      });

      it('should map "ROM exercise" to 97110', () => {
        expect(mapInterventionToCPT("ROM exercise for shoulder")).toBe("97110");
      });

      it('should map "range of motion exercise" to 97110', () => {
        expect(mapInterventionToCPT("range of motion exercise")).toBe("97110");
      });

      it("should map complex therapeutic exercise description to 97110", () => {
        expect(
          mapInterventionToCPT(
            "Rotator cuff strengthening with resistance band, 3 sets x 10 reps",
          ),
        ).toBe("97110");
      });
    });

    describe("Manual Therapy (97140)", () => {
      it('should map "manual therapy" to CPT code 97140', () => {
        expect(mapInterventionToCPT("manual therapy")).toBe("97140");
      });

      it('should map "Manual Therapy" (case insensitive) to 97140', () => {
        expect(mapInterventionToCPT("Manual Therapy")).toBe("97140");
      });

      it('should map "joint mobilization" to 97140', () => {
        expect(mapInterventionToCPT("joint mobilization grade III")).toBe(
          "97140",
        );
      });

      it('should map "soft tissue mobilization" to 97140', () => {
        expect(mapInterventionToCPT("soft tissue mobilization")).toBe("97140");
      });

      it('should map "massage" to 97140', () => {
        expect(mapInterventionToCPT("therapeutic massage")).toBe("97140");
      });

      it('should map "myofascial release" to 97140', () => {
        expect(mapInterventionToCPT("myofascial release technique")).toBe(
          "97140",
        );
      });

      it("should map complex manual therapy description to 97140", () => {
        expect(
          mapInterventionToCPT(
            "Glenohumeral joint mobilization, grade III, 5 minutes",
          ),
        ).toBe("97140");
      });
    });

    describe("Gait Training (97116)", () => {
      it('should map "gait training" to CPT code 97116', () => {
        expect(mapInterventionToCPT("gait training")).toBe("97116");
      });

      it('should map "Gait Training" (case insensitive) to 97116', () => {
        expect(mapInterventionToCPT("Gait Training")).toBe("97116");
      });

      it('should map "gait" to 97116', () => {
        expect(mapInterventionToCPT("gait with walker")).toBe("97116");
      });

      it('should map "ambulation training" to 97116', () => {
        expect(mapInterventionToCPT("ambulation training")).toBe("97116");
      });

      it('should map "walking training" to 97116', () => {
        expect(mapInterventionToCPT("walking training on level surfaces")).toBe(
          "97116",
        );
      });

      it("should map complex gait training description to 97116", () => {
        expect(
          mapInterventionToCPT(
            "Gait training with rolling walker, 150 feet, minimal assist",
          ),
        ).toBe("97116");
      });
    });

    describe("Neuromuscular Re-education (97112)", () => {
      it('should map "neuromuscular" to CPT code 97112', () => {
        expect(mapInterventionToCPT("neuromuscular re-education")).toBe(
          "97112",
        );
      });

      it('should map "Neuromuscular" (case insensitive) to 97112', () => {
        expect(mapInterventionToCPT("Neuromuscular Re-education")).toBe(
          "97112",
        );
      });

      it('should map "balance training" to 97112', () => {
        expect(mapInterventionToCPT("balance training exercises")).toBe(
          "97112",
        );
      });

      it('should map "proprioception" to 97112', () => {
        expect(mapInterventionToCPT("proprioception training")).toBe("97112");
      });

      it('should map "coordination training" to 97112', () => {
        expect(mapInterventionToCPT("coordination training")).toBe("97112");
      });

      it('should map "postural training" to 97112', () => {
        expect(mapInterventionToCPT("postural training and education")).toBe(
          "97112",
        );
      });

      it("should map complex neuromuscular description to 97112", () => {
        expect(
          mapInterventionToCPT(
            "Balance and proprioception training on foam surface, 10 minutes",
          ),
        ).toBe("97112");
      });
    });

    describe("Edge Cases", () => {
      it("should return empty string for unrecognized intervention", () => {
        expect(mapInterventionToCPT("patient education")).toBe("");
      });

      it("should return empty string for empty input", () => {
        expect(mapInterventionToCPT("")).toBe("");
      });

      it("should handle mixed case input correctly", () => {
        expect(mapInterventionToCPT("ThErApEuTiC ExErCiSe")).toBe("97110");
      });

      it("should prioritize first match when multiple keywords present", () => {
        // "therapeutic exercise" appears first in the function, so it should match first
        expect(
          mapInterventionToCPT("therapeutic exercise and manual therapy"),
        ).toBe("97110");
      });
    });

    describe("Real-world Intervention Descriptions", () => {
      it("should correctly map shoulder strengthening intervention", () => {
        expect(
          mapInterventionToCPT(
            "Rotator cuff strengthening with resistance band",
          ),
        ).toBe("97110");
      });

      it("should correctly map joint mobilization intervention", () => {
        expect(
          mapInterventionToCPT("Glenohumeral joint mobilization, grade III"),
        ).toBe("97140");
      });

      it("should correctly map gait training with assistive device", () => {
        expect(
          mapInterventionToCPT("Gait training with rolling walker, 150 feet"),
        ).toBe("97116");
      });

      it("should correctly map balance training intervention", () => {
        expect(mapInterventionToCPT("Balance training on foam surface")).toBe(
          "97112",
        );
      });
    });
  });

  describe("Skilled Need Justification", () => {
    it("should flag missing skilled need language as critical", () => {
      const note: SOAPNote = {
        subjective: {
          chiefComplaint: "Shoulder pain",
          painLevel: 6,
          painLocation: ["shoulder"],
          functionalLimitations: ["Unable to reach overhead"],
          patientGoals: ["Return to work"],
          priorLevelOfFunction: "Independent",
        },
        objective: {
          observation: "Patient ambulates independently",
          rom: "Shoulder flexion 120 degrees",
          strength: "Deltoid 4/5",
          gait: "Normal",
          balance: "Good",
        },
        assessment: {
          clinicalImpression: "Patient improving",
          diagnosis: "Shoulder impingement",
          icdCode: "M75.4",
          prognosis: "Good",
          rehabilitationPotential: "good",
          progressTowardGoals: "Making progress",
          clinicalReasoning: "Continue treatment",
        },
        plan: {
          interventions: ["Exercise", "Stretching"],
          frequency: "3x/week",
          duration: "4 weeks",
          shortTermGoals: ["Increase ROM"],
          longTermGoals: ["Return to work"],
          patientEducation: "Home exercise program",
        },
      };

      const flags = validateMedicareCompliance(note);
      const skilledNeedFlag = flags.find((f) => f.category === "skilled-need");

      expect(skilledNeedFlag).toBeDefined();
      expect(skilledNeedFlag?.severity).toBe("critical");
      expect(skilledNeedFlag?.regulation).toContain(
        "Medicare Benefit Policy Manual",
      );
    });

    it("should pass when skilled need language is present", () => {
      const note: SOAPNote = {
        subjective: {
          chiefComplaint: "Shoulder pain",
          painLevel: 6,
          painLocation: ["shoulder"],
          functionalLimitations: ["Unable to reach overhead"],
          patientGoals: ["Return to work"],
          priorLevelOfFunction: "Independent",
        },
        objective: {
          observation: "Patient ambulates independently",
          rom: "Shoulder flexion 120 degrees",
          strength: "Deltoid 4/5",
          gait: "Normal",
          balance: "Good",
        },
        assessment: {
          clinicalImpression:
            "Patient requires skilled therapeutic exercise and neuromuscular re-education",
          diagnosis: "Shoulder impingement",
          icdCode: "M75.4",
          prognosis: "Good",
          rehabilitationPotential: "good",
          progressTowardGoals: "Making progress",
          clinicalReasoning: "Clinical judgment required for progression",
        },
        plan: {
          interventions: ["Therapeutic exercise", "Manual therapy"],
          frequency: "3x/week",
          duration: "4 weeks",
          shortTermGoals: ["Increase ROM"],
          longTermGoals: ["Return to work"],
          patientEducation: "Home exercise program",
        },
      };

      const flags = validateMedicareCompliance(note);
      const skilledNeedFlag = flags.find((f) => f.category === "skilled-need");

      expect(skilledNeedFlag).toBeUndefined();
    });
  });

  describe("Vague Language Detection", () => {
    it('should detect "continue" as vague language', () => {
      const note: SOAPNote = {
        subjective: {
          chiefComplaint: "Shoulder pain",
          painLevel: 6,
          painLocation: ["shoulder"],
          functionalLimitations: ["Unable to reach overhead"],
          patientGoals: ["Return to work"],
          priorLevelOfFunction: "Independent",
        },
        objective: {
          observation: "Patient ambulates independently",
          rom: "Shoulder flexion 120 degrees",
          strength: "Deltoid 4/5",
          gait: "Normal",
          balance: "Good",
        },
        assessment: {
          clinicalImpression: "Continue current treatment plan",
          diagnosis: "Shoulder impingement",
          icdCode: "M75.4",
          prognosis: "Good",
          rehabilitationPotential: "good",
          progressTowardGoals: "Making progress",
          clinicalReasoning: "Patient improving",
        },
        plan: {
          interventions: ["Therapeutic exercise", "Manual therapy"],
          frequency: "3x/week",
          duration: "4 weeks",
          shortTermGoals: ["Increase ROM"],
          longTermGoals: ["Return to work"],
          patientEducation: "Home exercise program",
        },
      };

      const flags = validateMedicareCompliance(note);
      const vagueLanguageFlag = flags.find(
        (f) =>
          f.category === "vague-language" && f.message.includes("continue"),
      );

      expect(vagueLanguageFlag).toBeDefined();
      expect(vagueLanguageFlag?.severity).toBe("warning");
    });

    it('should detect "tolerated well" as vague language', () => {
      const noteText = "Patient tolerated well during session";
      const flags = validateMedicareCompliance(noteText);
      const vagueLanguageFlag = flags.find(
        (f) =>
          f.category === "vague-language" &&
          f.message.includes("tolerated well"),
      );

      expect(vagueLanguageFlag).toBeDefined();
    });
  });
});
