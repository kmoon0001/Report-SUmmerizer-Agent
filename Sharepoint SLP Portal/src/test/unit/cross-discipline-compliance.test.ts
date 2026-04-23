import { describe, it, expect } from "vitest";
import {
  validateMedicareCompliance,
  mapInterventionToCPT,
} from "../../utils/medicare-compliance-validator";

describe("Cross-Discipline Compliance Validation", () => {
  describe("CPT Mapping (SLP, OT, PT)", () => {
    it("should map SLP interventions correctly", () => {
      expect(mapInterventionToCPT("dysphagia treatment")).toBe("92526");
      expect(mapInterventionToCPT("aphasia treatment")).toBe("92507");
      expect(mapInterventionToCPT("cognitive rehabilitation")).toBe("92507");
    });

    it("should map OT interventions correctly", () => {
      expect(mapInterventionToCPT("ADL training")).toBe("97535");
      expect(mapInterventionToCPT("self-care management")).toBe("97535");
      expect(mapInterventionToCPT("dexterity and grasp training")).toBe(
        "97530",
      );
    });

    it("should map PT interventions correctly", () => {
      expect(mapInterventionToCPT("therapeutic exercise")).toBe("97110");
      expect(mapInterventionToCPT("manual therapy")).toBe("97140");
      expect(mapInterventionToCPT("gait training")).toBe("97116");
    });
  });

  describe("Skilled Need & Objective Data (Multi-Discipline)", () => {
    it("should validate SLP skilled documentation", () => {
      const slpNote =
        "Patient with dysphagia required skilled swallowing treatment for bolus management and cognitive rehabilitation.";
      const flags = validateMedicareCompliance(slpNote);

      const skilledFlag = flags.find((f) => f.category === "skilled-need");
      const objectiveFlag = flags.find((f) => f.category === "objective-data");

      // Should find skilled language
      expect(skilledFlag).toBeUndefined(); // Undefined means NO critical flag was raised

      // Should find objective data (bolus)
      expect(objectiveFlag).toBeUndefined();
    });

    it("should validate OT skilled documentation", () => {
      const otNote =
        "Skilled occupational engagement for self-care and ADL training using adaptive equipment. Patient required mod assist for hygiene.";
      const flags = validateMedicareCompliance(otNote);

      expect(flags.find((f) => f.category === "skilled-need")).toBeUndefined();
      expect(
        flags.find((f) => f.category === "objective-data"),
      ).toBeUndefined();
    });

    it("should raise flags for poor multidisciplinary documentation", () => {
      const poorNote = "Patient did well today. Continue same.";
      const flags = validateMedicareCompliance(poorNote);

      expect(flags.some((f) => f.category === "skilled-need")).toBe(true);
      expect(flags.some((f) => f.category === "objective-data")).toBe(true);
      expect(flags.some((f) => f.category === "vague-language")).toBe(true);
    });
  });
});
