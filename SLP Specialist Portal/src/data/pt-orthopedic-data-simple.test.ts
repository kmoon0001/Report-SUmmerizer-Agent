/**
 * Simple unit test for Orthopedic Clinical Content Data
 */

import { describe, it, expect } from "vitest";
import * as orthoData from "./pt-orthopedic-data";

describe("Orthopedic Data Import", () => {
  it("should import the orthopedic data module", async () => {
    const module = await import("./pt-orthopedic-data");
    expect(module).toBeDefined();
    expect(module.getAssessmentToolByAcronym).toBeDefined();
  });

  it("should have all required data categories", async () => {
    expect(orthoData.getAssessmentToolByAcronym).toBeDefined();
    expect(orthoData.getProtocolsByJoint).toBeDefined();
    expect(orthoData.getSpecialTestsByJoint).toBeDefined();
  });

  it("should include DASH assessment tool", async () => {
    const dashTool = orthoData.getAssessmentToolByAcronym("DASH");
    expect(dashTool).toBeDefined();
    expect(dashTool?.acronym).toBe("DASH");
  });
});
