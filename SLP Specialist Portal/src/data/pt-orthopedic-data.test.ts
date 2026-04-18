/**
 * Unit tests for Orthopedic Clinical Content Data
 *
 * Validates data structure, evidence levels, and content completeness
 * Requirements: 1.2, 1.3, 1.5, 6.1
 */

import { describe, it, expect } from "vitest";
import * as orthoData from "./pt-orthopedic-data";

// Create a consolidated data object for testing
const _ORTHOPEDIC_DATA = {
  assessmentTools: [],
  shoulderProtocols: [],
  kneeProtocols: [],
  spineProtocols: [],
  hipProtocols: [],
  ankleFootProtocols: [],
  elbowWristProtocols: [],
  jointOverviews: [],
  specialTests: [],
  cptCodes: [],
  resources: [],
};

describe("Orthopedic Data Module", () => {
  it("should export required functions", () => {
    expect(orthoData.getAssessmentToolByAcronym).toBeDefined();
    expect(orthoData.getProtocolsByJoint).toBeDefined();
    expect(orthoData.getSpecialTestsByJoint).toBeDefined();
    expect(orthoData.interpretOutcomeMeasure).toBeDefined();
  });

  it("should retrieve DASH assessment tool", () => {
    const dashTool = orthoData.getAssessmentToolByAcronym("DASH");
    expect(dashTool).toBeDefined();
    expect(dashTool?.acronym).toBe("DASH");
    expect(dashTool?.evidenceLevel).toBeGreaterThanOrEqual(3);
  });

  it("should retrieve assessment tools with evidence level 3+", () => {
    const tools = ["DASH", "LEFS", "ODI", "NDI", "PSFS"];
    tools.forEach((acronym) => {
      const tool = orthoData.getAssessmentToolByAcronym(acronym);
      expect(tool).toBeDefined();
      expect(tool?.evidenceLevel).toBeGreaterThanOrEqual(3);
    });
  });

  it("should retrieve protocols by joint", () => {
    const shoulderProtocols = orthoData.getProtocolsByJoint("shoulder");
    expect(shoulderProtocols.length).toBeGreaterThan(0);

    const kneeProtocols = orthoData.getProtocolsByJoint("knee");
    expect(kneeProtocols.length).toBeGreaterThan(0);
  });

  it("should retrieve special tests by joint", () => {
    const shoulderTests = orthoData.getSpecialTestsByJoint("shoulder");
    expect(shoulderTests.length).toBeGreaterThan(0);

    const kneeTests = orthoData.getSpecialTestsByJoint("knee");
    expect(kneeTests.length).toBeGreaterThan(0);
  });

  it("should interpret outcome measures", () => {
    const interpretation = orthoData.interpretOutcomeMeasure("DASH", 25);
    expect(interpretation).toBeDefined();
    expect(interpretation.length).toBeGreaterThan(0);
  });
});
