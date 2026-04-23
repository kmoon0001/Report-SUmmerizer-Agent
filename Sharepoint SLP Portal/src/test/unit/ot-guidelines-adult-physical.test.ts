/**
 * OT Evidence-Based Guidelines - Adult Physical Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTAdultPhysicalGuidelines,
  getOTAdultPhysicalGuidelineById,
  searchOTAdultPhysicalGuidelines,
} from "../../data/ot-guidelines-adult-physical";

describe("OT Evidence-Based Guidelines - Adult Physical", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllOTAdultPhysicalGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllOTAdultPhysicalGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.recommendations).toBeDefined();
        expect(Array.isArray(guideline.recommendations)).toBe(true);
        expect(guideline.assessments).toBeDefined();
        expect(Array.isArray(guideline.assessments)).toBe(true);
      });
    });

    it("should have unique IDs (gl-ot-041 to 050)", () => {
      const ids = getAllOTAdultPhysicalGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-ot-041");
      expect(ids).toContain("gl-ot-050");
    });

    it("should include new adult physical conditions", () => {
      const names = getAllOTAdultPhysicalGuidelines().map((g) => g.name);
      expect(names).toContain(
        "Hand and Upper Extremity (Distal Radius Fracture)",
      );
      expect(names).toContain("Hip and Knee Arthroplasty Recovery");
      expect(names).toContain("Cardiovascular Rehab (Adult OT)");
      expect(names).toContain("Chronic Pain Management (OT)");
    });
  });

  describe("getOTAdultPhysicalGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getOTAdultPhysicalGuidelineById("gl-ot-044");
      expect(guideline?.name).toBe(
        "Hand and Upper Extremity (Distal Radius Fracture)",
      );
    });
  });

  describe("searchOTAdultPhysicalGuidelines", () => {
    it("should find pain", () => {
      const results = searchOTAdultPhysicalGuidelines("pain");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-049");
    });

    it("should find joints", () => {
      const results = searchOTAdultPhysicalGuidelines("joint");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-047");
    });
  });
});
