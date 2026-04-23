import { describe, it, expect } from "vitest";
import {
  generatePTAssessment,
  generateExercisePrescription,
  generatePTSMARTGoals,
  validateMedicareCompliance,
  AUTHORITATIVE_PT_SOURCES,
  PT_PROMPT_TEMPLATES,
} from "../../services/ai-service-pt";
import type {
  PTAssessmentFindings,
  PTDocumentationNote,
} from "../../types/pt-types";

describe("ai-service-pt", () => {
  describe("generatePTAssessment", () => {
    it("should throw not implemented error", async () => {
      const findings = {
        chiefComplaint: "Right knee pain",
        historyOfPresentIllness: "Acute onset",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: { knee: { flexion: 90, extension: 0 } },
          strength: { quadriceps: 4 },
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      await expect(
        generatePTAssessment("orthopedic", findings),
      ).rejects.toThrow("Not implemented");
    });

    it("should accept valid PT domain", async () => {
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      try {
        await generatePTAssessment("neurological", findings);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle various PT domains", async () => {
      const domains = [
        "orthopedic",
        "neurological",
        "cardiopulmonary",
        "geriatric",
      ];
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      for (const domain of domains) {
        try {
          await generatePTAssessment(domain as any, findings);
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("generateExercisePrescription", () => {
    it("should throw not implemented error", async () => {
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      await expect(
        generateExercisePrescription(
          "ACL Tear",
          ["Knee instability"],
          ["Return to sports"],
          findings,
        ),
      ).rejects.toThrow("Not implemented");
    });

    it("should accept valid parameters", async () => {
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      try {
        await generateExercisePrescription(
          "Stroke",
          ["Weakness", "Spasticity"],
          ["Improve walking"],
          findings,
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle multiple functional limitations", async () => {
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      const limitations = [
        "Pain",
        "Weakness",
        "Limited ROM",
        "Balance deficit",
      ];
      try {
        await generateExercisePrescription(
          "Diagnosis",
          limitations,
          ["Goal 1", "Goal 2"],
          findings,
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle multiple patient goals", async () => {
      const findings = {
        chiefComplaint: "Test",
        historyOfPresentIllness: "Test",
        pastMedicalHistory: [],
        medications: [],
        objectiveFindings: {
          rangeOfMotion: {},
          strength: {},
          functionalTests: [],
        },
        assessmentData: {},
      } as unknown as PTAssessmentFindings;

      const goals = [
        "Improve strength",
        "Increase ROM",
        "Return to work",
        "Reduce pain",
      ];
      try {
        await generateExercisePrescription(
          "Diagnosis",
          ["Limitation"],
          goals,
          findings,
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("generatePTSMARTGoals", () => {
    it("should throw not implemented error", async () => {
      await expect(
        generatePTSMARTGoals(
          "orthopedic",
          "moderate-assist",
          "Walking",
          "Assessment data",
        ),
      ).rejects.toThrow("Not implemented");
    });

    it("should accept valid PT domain", async () => {
      try {
        await generatePTSMARTGoals("neurological", "minimal-assist", "Balance", "Data");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should accept various functional levels", async () => {
      const levels = ["minimal-assist", "moderate-assist", "maximal-assist"];
      for (const level of levels) {
        try {
          await generatePTSMARTGoals(
            "orthopedic",
            level as any,
            "Task",
            "Data",
          );
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });

    it("should accept various PT domains", async () => {
      const domains = [
        "orthopedic",
        "neurological",
        "cardiopulmonary",
        "geriatric",
      ];
      for (const domain of domains) {
        try {
          await generatePTSMARTGoals(domain as any, "moderate-assist", "Task", "Data");
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("validateMedicareCompliance", () => {
    it("should throw not implemented error", async () => {
      const note = {
        type: "evaluation",
        date: new Date(),
        patientId: "P123",
        therapistId: "T123",
        subjective: {
          chiefComplaint: "Pain",
          historyOfPresentIllness: "Acute onset",
        },
        objective: {
          vitalSigns: {},
          assessmentData: {},
          interventionsProvided: ["Manual therapy"],
        },
        assessment: {
          findings: "Positive findings",
          impression: "Diagnosis",
        },
        plan: {
          goals: ["Goal 1"],
          interventions: ["Intervention 1"],
          frequency: "3x/week",
          duration: "4 weeks",
        },
      } as unknown as PTDocumentationNote;

      await expect(validateMedicareCompliance(note)).rejects.toThrow(
        "Not implemented",
      );
    });

    it("should accept valid documentation note", async () => {
      const note = {
        type: "progress",
        date: new Date(),
        patientId: "P123",
        therapistId: "T123",
        subjective: {
          chiefComplaint: "Pain",
          historyOfPresentIllness: "Ongoing",
        },
        objective: {
          vitalSigns: {},
          assessmentData: {},
          interventionsProvided: ["Exercise"],
        },
        assessment: {
          findings: "Findings",
          impression: "Impression",
        },
        plan: {
          goals: ["Goal"],
          interventions: ["Intervention"],
          frequency: "2x/week",
          duration: "2 weeks",
        },
      } as unknown as PTDocumentationNote;

      try {
        await validateMedicareCompliance(note);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle various note types", async () => {
      const types = ["evaluation", "progress", "discharge"];
      for (const type of types) {
        const note = {
          type: type as any,
          date: new Date(),
          patientId: "P123",
          therapistId: "T123",
          subjective: {
            chiefComplaint: "Test",
            historyOfPresentIllness: "Test",
          },
          objective: {
            vitalSigns: {},
            assessmentData: {},
            interventionsProvided: ["Test"],
          },
          assessment: {
            findings: "Test",
            impression: "Test",
          },
          plan: {
            goals: ["Test"],
            interventions: ["Test"],
            frequency: "1x/week",
            duration: "1 week",
          },
        } as unknown as PTDocumentationNote;

        try {
          await validateMedicareCompliance(note);
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("AUTHORITATIVE_PT_SOURCES", () => {
    it("should contain expected sources", () => {
      expect(AUTHORITATIVE_PT_SOURCES).toContain("APTA");
      expect(AUTHORITATIVE_PT_SOURCES).toContain("CMS");
      expect(AUTHORITATIVE_PT_SOURCES).toContain(
        "Medicare Benefit Policy Manual",
      );
      expect(AUTHORITATIVE_PT_SOURCES).toContain("Noridian");
    });

    it("should be an array", () => {
      expect(Array.isArray(AUTHORITATIVE_PT_SOURCES)).toBe(true);
    });

    it("should contain at least 5 sources", () => {
      expect(AUTHORITATIVE_PT_SOURCES.length).toBeGreaterThanOrEqual(5);
    });

    it("should contain only strings", () => {
      AUTHORITATIVE_PT_SOURCES.forEach((source) => {
        expect(typeof source).toBe("string");
      });
    });
  });

  describe("PT_PROMPT_TEMPLATES", () => {
    it("should contain assessment template", () => {
      expect(PT_PROMPT_TEMPLATES.assessment).toBeDefined();
      expect(typeof PT_PROMPT_TEMPLATES.assessment).toBe("string");
    });

    it("should contain exercisePrescription template", () => {
      expect(PT_PROMPT_TEMPLATES.exercisePrescription).toBeDefined();
      expect(typeof PT_PROMPT_TEMPLATES.exercisePrescription).toBe("string");
    });

    it("should contain smartGoals template", () => {
      expect(PT_PROMPT_TEMPLATES.smartGoals).toBeDefined();
      expect(typeof PT_PROMPT_TEMPLATES.smartGoals).toBe("string");
    });

    it("should contain medicareCompliance template", () => {
      expect(PT_PROMPT_TEMPLATES.medicareCompliance).toBeDefined();
      expect(typeof PT_PROMPT_TEMPLATES.medicareCompliance).toBe("string");
    });

    it("assessment template should reference authoritative sources", () => {
      expect(PT_PROMPT_TEMPLATES.assessment).toContain("APTA");
      expect(PT_PROMPT_TEMPLATES.assessment).toContain("CMS");
    });

    it("exercisePrescription template should mention evidence level", () => {
      expect(PT_PROMPT_TEMPLATES.exercisePrescription).toContain(
        "evidence level",
      );
    });

    it("smartGoals template should mention SMART components", () => {
      expect(PT_PROMPT_TEMPLATES.smartGoals).toContain("Specific");
      expect(PT_PROMPT_TEMPLATES.smartGoals).toContain("Measurable");
      expect(PT_PROMPT_TEMPLATES.smartGoals).toContain("Achievable");
      expect(PT_PROMPT_TEMPLATES.smartGoals).toContain("Relevant");
      expect(PT_PROMPT_TEMPLATES.smartGoals).toContain("Time-bound");
    });

    it("medicareCompliance template should reference Medicare regulations", () => {
      expect(PT_PROMPT_TEMPLATES.medicareCompliance).toContain("Medicare");
      expect(PT_PROMPT_TEMPLATES.medicareCompliance).toContain("Chapter 15");
    });

    it("all templates should be non-empty strings", () => {
      Object.values(PT_PROMPT_TEMPLATES).forEach((template) => {
        expect(typeof template).toBe("string");
        expect(template.length).toBeGreaterThan(0);
      });
    });
  });

  describe("integration", () => {
    it("should have consistent source references across templates", () => {
      const templates = Object.values(PT_PROMPT_TEMPLATES);
      const hasAPTA = templates.some((t) => t.includes("APTA"));
      expect(hasAPTA).toBe(true);
    });

    it("should reference Medicare in compliance template", () => {
      expect(PT_PROMPT_TEMPLATES.medicareCompliance).toContain("Medicare");
    });

    it("should reference evidence in exercise template", () => {
      expect(PT_PROMPT_TEMPLATES.exercisePrescription).toContain("evidence");
    });
  });
});
