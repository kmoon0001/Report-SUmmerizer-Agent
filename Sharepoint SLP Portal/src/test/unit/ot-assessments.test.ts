/**
 * OT Assessment Service Tests
 *
 * Tests for OT assessment tools and outcome measures
 * Requirements: 3.1, 3.2, 3.3
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { OTAssessmentService } from "../../disciplines/ot/services/OTAssessmentService";
import type { OTAssessmentFindings } from "../../disciplines/ot/types/ot-assessment";

describe("OT Assessment Service", () => {
  describe("Assessment Tool Access", () => {
    it("should retrieve assessment tools", () => {
      const tool = OTAssessmentService.getAssessmentTool("copm");
      expect(tool).toBeDefined();
      expect(tool?.name).toBe("Canadian Occupational Performance Measure");
    });

    it("should retrieve outcome measures", () => {
      const measure = OTAssessmentService.getOutcomeMeasure("fim-outcome");
      expect(measure).toBeDefined();
      expect(measure?.name).toBe("Functional Independence Measure");
    });

    it("should get assessment tools by domain", () => {
      const tools =
        OTAssessmentService.getAssessmentToolsByDomain("hand-therapy");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools[0]).toHaveProperty("name");
      expect(tools[0]).toHaveProperty("domain");
    });

    it("should get outcome measures by domain", () => {
      const measures =
        OTAssessmentService.getOutcomeMeasuresByDomain("adl-training");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures[0]).toHaveProperty("name");
    });
  });

  describe("MCID Calculations", () => {
    it("should calculate MCID correctly", () => {
      const baseline = 40;
      const current = 50;
      const mcid = 5;

      const result = OTAssessmentService.calculateMCID(baseline, current, mcid);
      expect(result).toBe(2); // (50-40)/5 = 2
    });

    it("should determine clinical significance", () => {
      const baseline = 40;
      const current = 50;
      const mcid = 5;

      const isSignificant = OTAssessmentService.isClinicallySIgnificant(
        baseline,
        current,
        mcid,
      );
      expect(isSignificant).toBe(true);
    });

    it("should detect non-significant change", () => {
      const baseline = 40;
      const current = 42;
      const mcid = 5;

      const isSignificant = OTAssessmentService.isClinicallySIgnificant(
        baseline,
        current,
        mcid,
      );
      expect(isSignificant).toBe(false);
    });
  });

  describe("Percentage Improvement Calculation", () => {
    it("should calculate percentage improvement", () => {
      const baseline = 40;
      const current = 60;
      const maxScore = 80;

      const improvement = OTAssessmentService.calculatePercentageImprovement(
        baseline,
        current,
        maxScore,
      );
      expect(improvement).toBe(50); // (60-40)/(80-40) * 100 = 50%
    });

    it("should handle zero possible improvement", () => {
      const baseline = 100;
      const current = 100;
      const maxScore = 100;

      const improvement = OTAssessmentService.calculatePercentageImprovement(
        baseline,
        current,
        maxScore,
      );
      expect(improvement).toBe(0);
    });

    it("should handle zero max score", () => {
      const baseline = 40;
      const current = 60;
      const maxScore = 0;

      const improvement = OTAssessmentService.calculatePercentageImprovement(
        baseline,
        current,
        maxScore,
      );
      expect(improvement).toBe(0);
    });
  });

  describe("Assessment Findings Validation", () => {
    it("should validate complete assessment findings", () => {
      const findings: OTAssessmentFindings = {
        id: "assessment-001",
        clientId: "client-001",
        discipline: "ot",
        assessmentDate: new Date(),
        occupationalProfile: {
          occupationalHistory: "Works as accountant",
          occupationalPatterns: ["Work", "Leisure"],
          occupationalRoles: ["Worker", "Spouse"],
          occupationalRoutines: ["Morning routine", "Work routine"],
          clientGoals: ["Return to work"],
          priorities: ["Hand function"],
          barriers: ["Limited ROM"],
          facilitators: ["Motivated"],
          contextualFactors: ["Home support"],
        },
        primaryConcerns: ["Limited hand function"],
        strengths: ["Good motivation"],
        functionalLimitations: ["Unable to grip"],
        occupationalPerformanceIssues: ["Unable to work"],
        interventionRecommendations: ["Hand therapy"],
        adaptiveEquipmentNeeds: [],
        environmentalModifications: [],
        trainingNeeds: [],
        clinicalImpression: "Good prognosis",
        prognosis: "Expected to improve",
        estimatedDurationOfServices: "4 weeks",
        assessedBy: "OT001",
        nextReviewDate: new Date(),
        evidenceLevel: 1,
      };

      const result = OTAssessmentService.validateAssessmentFindings(findings);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should detect missing required fields", () => {
      const findings: OTAssessmentFindings = {
        id: "assessment-001",
        clientId: "",
        discipline: "ot",
        assessmentDate: new Date(),
        occupationalProfile: {
          occupationalHistory: "",
          occupationalPatterns: [],
          occupationalRoles: [],
          occupationalRoutines: [],
          clientGoals: [],
          priorities: [],
          barriers: [],
          facilitators: [],
          contextualFactors: [],
        },
        primaryConcerns: [],
        strengths: [],
        functionalLimitations: [],
        occupationalPerformanceIssues: [],
        interventionRecommendations: [],
        adaptiveEquipmentNeeds: [],
        environmentalModifications: [],
        trainingNeeds: [],
        clinicalImpression: "",
        prognosis: "",
        estimatedDurationOfServices: "",
        assessedBy: "",
        nextReviewDate: new Date(),
        evidenceLevel: 1,
      };

      const result = OTAssessmentService.validateAssessmentFindings(findings);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Assessment Summary Generation", () => {
    it("should generate assessment summary", () => {
      const findings: OTAssessmentFindings = {
        id: "assessment-001",
        clientId: "client-001",
        discipline: "ot",
        assessmentDate: new Date("2024-03-18"),
        occupationalProfile: {
          occupationalHistory: "Works as accountant",
          occupationalPatterns: ["Work", "Leisure"],
          occupationalRoles: ["Worker"],
          occupationalRoutines: ["Morning routine"],
          clientGoals: ["Return to work"],
          priorities: ["Hand function"],
          barriers: ["Limited ROM"],
          facilitators: ["Motivated"],
          contextualFactors: ["Home support"],
        },
        primaryConcerns: ["Limited hand function"],
        strengths: ["Good motivation"],
        functionalLimitations: ["Unable to grip"],
        occupationalPerformanceIssues: ["Unable to work"],
        interventionRecommendations: ["Hand therapy"],
        adaptiveEquipmentNeeds: [],
        environmentalModifications: [],
        trainingNeeds: [],
        clinicalImpression: "Good prognosis",
        prognosis: "Expected to improve",
        estimatedDurationOfServices: "4 weeks",
        assessedBy: "OT001",
        nextReviewDate: new Date("2024-04-18"),
        evidenceLevel: 1,
      };

      const summary = OTAssessmentService.generateAssessmentSummary(findings);
      expect(summary).toContain("OT ASSESSMENT SUMMARY");
      expect(summary).toContain("client-001");
      expect(summary).toContain("PRIMARY CONCERNS");
      expect(summary).toContain("Limited hand function");
    });
  });

  describe("Assessment Comparison", () => {
    it("should compare assessments and detect improvement", () => {
      const baseline: OTAssessmentFindings = {
        id: "assessment-001",
        clientId: "client-001",
        discipline: "ot",
        assessmentDate: new Date("2024-03-01"),
        occupationalProfile: {
          occupationalHistory: "",
          occupationalPatterns: [],
          occupationalRoles: [],
          occupationalRoutines: [],
          clientGoals: [],
          priorities: [],
          barriers: [],
          facilitators: [],
          contextualFactors: [],
        },
        copm: {
          id: "copm-001",
          clientId: "client-001",
          assessmentDate: new Date("2024-03-01"),
          issues: [
            {
              id: "1",
              description: "Dressing",
              performanceArea: "self-care",
              performanceScore: 4,
              satisfactionScore: 3,
              priority: 1,
            },
          ],
          totalPerformanceScore: 4,
          totalSatisfactionScore: 3,
          notes: "",
          evidenceLevel: 1,
          citation: "",
        },
        primaryConcerns: [],
        strengths: [],
        functionalLimitations: [],
        occupationalPerformanceIssues: [],
        interventionRecommendations: [],
        adaptiveEquipmentNeeds: [],
        environmentalModifications: [],
        trainingNeeds: [],
        clinicalImpression: "",
        prognosis: "",
        estimatedDurationOfServices: "",
        assessedBy: "",
        nextReviewDate: new Date(),
        evidenceLevel: 1,
      };

      const current: OTAssessmentFindings = {
        ...baseline,
        assessmentDate: new Date("2024-04-01"),
        copm: {
          ...baseline.copm!,
          assessmentDate: new Date("2024-04-01"),
          totalPerformanceScore: 7,
          totalSatisfactionScore: 7,
        },
      };

      const comparison = OTAssessmentService.compareAssessments(
        baseline,
        current,
      );
      expect(comparison.improved.length).toBeGreaterThan(0);
      expect(comparison.summary).toContain("Improved");
    });
  });

  describe("Property-Based Tests", () => {
    it("should handle any valid assessment findings", () => {
      fc.assert(
        fc.property(
          fc.record({
            clientId: fc.string({ minLength: 1 }),
            primaryConcerns: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
            }),
            functionalLimitations: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
            }),
            interventionRecommendations: fc.array(fc.string({ minLength: 1 }), {
              minLength: 1,
            }),
          }),
          (data) => {
            const findings: OTAssessmentFindings = {
              id: "assessment-001",
              clientId: data.clientId,
              discipline: "ot",
              assessmentDate: new Date(),
              occupationalProfile: {
                occupationalHistory: "",
                occupationalPatterns: [],
                occupationalRoles: [],
                occupationalRoutines: [],
                clientGoals: [],
                priorities: [],
                barriers: [],
                facilitators: [],
                contextualFactors: [],
              },
              primaryConcerns: data.primaryConcerns,
              strengths: [],
              functionalLimitations: data.functionalLimitations,
              occupationalPerformanceIssues: [],
              interventionRecommendations: data.interventionRecommendations,
              adaptiveEquipmentNeeds: [],
              environmentalModifications: [],
              trainingNeeds: [],
              clinicalImpression: "",
              prognosis: "",
              estimatedDurationOfServices: "",
              assessedBy: "",
              nextReviewDate: new Date(),
              evidenceLevel: 1,
            };

            const result =
              OTAssessmentService.validateAssessmentFindings(findings);
            expect(result.valid).toBe(true);
          },
        ),
      );
    });

    it("should always generate valid summaries", () => {
      fc.assert(
        fc.property(
          fc.record({
            clientId: fc.string({ minLength: 1 }),
            primaryConcerns: fc.array(fc.string({ minLength: 1 })),
          }),
          (data) => {
            const findings: OTAssessmentFindings = {
              id: "assessment-001",
              clientId: data.clientId,
              discipline: "ot",
              assessmentDate: new Date(),
              occupationalProfile: {
                occupationalHistory: "",
                occupationalPatterns: [],
                occupationalRoles: [],
                occupationalRoutines: [],
                clientGoals: [],
                priorities: [],
                barriers: [],
                facilitators: [],
                contextualFactors: [],
              },
              primaryConcerns: data.primaryConcerns,
              strengths: [],
              functionalLimitations: [],
              occupationalPerformanceIssues: [],
              interventionRecommendations: [],
              adaptiveEquipmentNeeds: [],
              environmentalModifications: [],
              trainingNeeds: [],
              clinicalImpression: "",
              prognosis: "",
              estimatedDurationOfServices: "",
              assessedBy: "",
              nextReviewDate: new Date(),
              evidenceLevel: 1,
            };

            const summary =
              OTAssessmentService.generateAssessmentSummary(findings);
            expect(summary).toBeDefined();
            expect(summary.length).toBeGreaterThan(0);
            expect(summary).toContain("OT ASSESSMENT SUMMARY");
          },
        ),
      );
    });
  });
});
