import { describe, it, expect } from "vitest";
import {
  getQualityMeasureById,
  getQualityMeasuresByType,
  getQualityMeasuresByDiscipline,
  getAllQualityMeasures,
  getOutcomeBenchmarkById,
  getOutcomeBenchmarksByCondition,
  getOutcomeBenchmarksByDiscipline,
  getAllOutcomeBenchmarks,
  getFunctionalImprovementMeasures,
  getPatientSatisfactionMeasures,
  getDischargeDispositionMeasures,
  getReadmissionMeasures,
  getSafetyMeasures,
  getEfficiencyMeasures,
  type QualityMeasure,
  type MeasureType,
  type Discipline,
} from "../../shared/data/quality-measures-framework";

describe("Quality Measures Framework", () => {
  describe("getQualityMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getQualityMeasureById("qm-func-001");
      expect(measure).toBeDefined();
      expect(measure?.name).toBe("Functional Improvement Rate");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getQualityMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getQualityMeasureById("qm-func-001");
      expect(measure?.measureType).toBe("functional-improvement");
      expect(measure?.discipline).toBe("shared");
      expect(measure?.unit).toBe("%");
    });
  });

  describe("getQualityMeasuresByType", () => {
    it("should return functional improvement measures", () => {
      const measures = getQualityMeasuresByType("functional-improvement");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "functional-improvement"),
      ).toBe(true);
    });

    it("should return patient satisfaction measures", () => {
      const measures = getQualityMeasuresByType("patient-satisfaction");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "patient-satisfaction"),
      ).toBe(true);
    });

    it("should return discharge disposition measures", () => {
      const measures = getQualityMeasuresByType("discharge-disposition");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "discharge-disposition"),
      ).toBe(true);
    });

    it("should return readmission measures", () => {
      const measures = getQualityMeasuresByType("readmission");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "readmission")).toBe(true);
    });

    it("should return safety measures", () => {
      const measures = getQualityMeasuresByType("safety");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "safety")).toBe(true);
    });

    it("should return efficiency measures", () => {
      const measures = getQualityMeasuresByType("efficiency");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "efficiency")).toBe(true);
    });
  });

  describe("getQualityMeasuresByDiscipline", () => {
    it("should return shared measures for shared discipline", () => {
      const measures = getQualityMeasuresByDiscipline("shared");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.discipline === "shared")).toBe(true);
    });

    it("should return PT measures including shared", () => {
      const measures = getQualityMeasuresByDiscipline("pt");
      expect(measures.length).toBeGreaterThan(0);
      const hasPT = measures.some((m) => m.discipline === "pt");
      const hasShared = measures.some((m) => m.discipline === "shared");
      expect(hasPT || hasShared).toBe(true);
    });

    it("should return OT measures including shared", () => {
      const measures = getQualityMeasuresByDiscipline("ot");
      expect(measures.length).toBeGreaterThan(0);
      const hasOT = measures.some((m) => m.discipline === "ot");
      const hasShared = measures.some((m) => m.discipline === "shared");
      expect(hasOT || hasShared).toBe(true);
    });
  });

  describe("getAllQualityMeasures", () => {
    it("should return all quality measures", () => {
      const measures = getAllQualityMeasures();
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should have valid measure structure", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.id).toBeDefined();
        expect(m.name).toBeDefined();
        expect(m.measureType).toBeDefined();
        expect(m.discipline).toMatch(/^(pt|ot|shared)$/);
        expect(m.description).toBeDefined();
        expect(m.numerator).toBeDefined();
        expect(m.denominator).toBeDefined();
        expect(m.dataSource).toBeDefined();
        expect(m.reportingFrequency).toBeDefined();
        expect(m.benchmarks).toBeDefined();
        expect(m.unit).toBeDefined();
      });
    });
  });

  describe("Benchmark Levels", () => {
    it("should have all benchmark levels", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.benchmarks.excellent).toBeDefined();
        expect(m.benchmarks.good).toBeDefined();
        expect(m.benchmarks.fair).toBeDefined();
        expect(m.benchmarks.poor).toBeDefined();
      });
    });

    it("should have reasonable benchmark values", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        if (m.unit === "%") {
          expect(m.benchmarks.excellent).toBeGreaterThanOrEqual(0);
          expect(m.benchmarks.excellent).toBeLessThanOrEqual(100);
          expect(m.benchmarks.good).toBeGreaterThanOrEqual(0);
          expect(m.benchmarks.good).toBeLessThanOrEqual(100);
        }
      });
    });

    it("should have hierarchical benchmarks for percentage measures", () => {
      const measures = getAllQualityMeasures();
      measures
        .filter((m) => m.unit === "%")
        .forEach((m) => {
          // For percentage-based measures, excellent should be highest
          // Exception: readmission and facility discharge (lower is better)
          if (m.measureType !== "readmission" && !m.name.includes("Facility")) {
            expect(m.benchmarks.excellent).toBeGreaterThanOrEqual(
              m.benchmarks.good,
            );
            expect(m.benchmarks.good).toBeGreaterThanOrEqual(m.benchmarks.fair);
            expect(m.benchmarks.fair).toBeGreaterThanOrEqual(m.benchmarks.poor);
          }
        });
    });
  });

  describe("Outcome Benchmarks", () => {
    describe("getOutcomeBenchmarkById", () => {
      it("should return benchmark by valid ID", () => {
        const benchmark = getOutcomeBenchmarkById("bench-stroke-001");
        expect(benchmark).toBeDefined();
        expect(benchmark?.condition).toBe("stroke");
      });

      it("should return undefined for invalid ID", () => {
        const benchmark = getOutcomeBenchmarkById("invalid-id");
        expect(benchmark).toBeUndefined();
      });
    });

    describe("getOutcomeBenchmarksByCondition", () => {
      it("should return benchmarks for stroke", () => {
        const benchmarks = getOutcomeBenchmarksByCondition("stroke");
        expect(benchmarks.length).toBeGreaterThan(0);
        expect(benchmarks.every((b) => b.condition === "stroke")).toBe(true);
      });

      it("should return benchmarks for low-back-pain", () => {
        const benchmarks = getOutcomeBenchmarksByCondition("low-back-pain");
        expect(benchmarks.length).toBeGreaterThan(0);
        expect(benchmarks.every((b) => b.condition === "low-back-pain")).toBe(
          true,
        );
      });

      it("should return empty array for non-existent condition", () => {
        const benchmarks = getOutcomeBenchmarksByCondition(
          "non-existent-condition",
        );
        expect(benchmarks.length).toBe(0);
      });
    });

    describe("getOutcomeBenchmarksByDiscipline", () => {
      it("should return benchmarks for PT", () => {
        const benchmarks = getOutcomeBenchmarksByDiscipline("pt");
        expect(benchmarks.length).toBeGreaterThan(0);
      });

      it("should return benchmarks for OT", () => {
        const benchmarks = getOutcomeBenchmarksByDiscipline("ot");
        expect(benchmarks.length).toBeGreaterThan(0);
      });

      it("should return benchmarks for shared", () => {
        const benchmarks = getOutcomeBenchmarksByDiscipline("shared");
        expect(benchmarks.length).toBeGreaterThan(0);
      });
    });

    describe("getAllOutcomeBenchmarks", () => {
      it("should return all outcome benchmarks", () => {
        const benchmarks = getAllOutcomeBenchmarks();
        expect(benchmarks.length).toBeGreaterThan(0);
      });

      it("should have valid benchmark structure", () => {
        const benchmarks = getAllOutcomeBenchmarks();
        benchmarks.forEach((b) => {
          expect(b.id).toBeDefined();
          expect(b.condition).toBeDefined();
          expect(b.discipline).toMatch(/^(pt|ot|shared)$/);
          expect(b.functionalImprovementTarget).toBeGreaterThan(0);
          expect(b.functionalImprovementTarget).toBeLessThanOrEqual(100);
          expect(b.averageLengthOfStay).toBeGreaterThan(0);
          expect(b.averageVisits).toBeGreaterThan(0);
          expect(b.dischargeToHomeTarget).toBeGreaterThan(0);
          expect(b.dischargeToHomeTarget).toBeLessThanOrEqual(100);
          expect(b.readmissionRateTarget).toBeGreaterThanOrEqual(0);
          expect(b.readmissionRateTarget).toBeLessThanOrEqual(100);
          expect(b.patientSatisfactionTarget).toBeGreaterThan(0);
          expect(b.patientSatisfactionTarget).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe("Category-Specific Functions", () => {
    it("getFunctionalImprovementMeasures should return functional measures", () => {
      const measures = getFunctionalImprovementMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "functional-improvement"),
      ).toBe(true);
    });

    it("getPatientSatisfactionMeasures should return satisfaction measures", () => {
      const measures = getPatientSatisfactionMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "patient-satisfaction"),
      ).toBe(true);
    });

    it("getDischargeDispositionMeasures should return discharge measures", () => {
      const measures = getDischargeDispositionMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.measureType === "discharge-disposition"),
      ).toBe(true);
    });

    it("getReadmissionMeasures should return readmission measures", () => {
      const measures = getReadmissionMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "readmission")).toBe(true);
    });

    it("getSafetyMeasures should return safety measures", () => {
      const measures = getSafetyMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "safety")).toBe(true);
    });

    it("getEfficiencyMeasures should return efficiency measures", () => {
      const measures = getEfficiencyMeasures();
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.measureType === "efficiency")).toBe(true);
    });
  });

  describe("Measure Definitions", () => {
    it("should have clear numerator definitions", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.numerator).toBeDefined();
        expect(m.numerator.length).toBeGreaterThan(0);
      });
    });

    it("should have clear denominator definitions", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.denominator).toBeDefined();
        expect(m.denominator.length).toBeGreaterThan(0);
      });
    });

    it("should have data sources", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.dataSource).toBeDefined();
        expect(m.dataSource.length).toBeGreaterThan(0);
      });
    });

    it("should have reporting frequency", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.reportingFrequency).toBeDefined();
        expect(m.reportingFrequency.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each measure", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each measure", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });

    it("should have source for each benchmark", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.source).toBeDefined();
        expect(b.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each benchmark", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.citation).toBeDefined();
        expect(b.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Last Updated", () => {
    it("should have valid last updated date for measures", () => {
      const measures = getAllQualityMeasures();
      measures.forEach((m) => {
        expect(m.lastUpdated).toBeInstanceOf(Date);
        expect(m.lastUpdated.getTime()).toBeLessThanOrEqual(
          new Date().getTime(),
        );
      });
    });

    it("should have valid last updated date for benchmarks", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.lastUpdated).toBeInstanceOf(Date);
        expect(b.lastUpdated.getTime()).toBeLessThanOrEqual(
          new Date().getTime(),
        );
      });
    });
  });

  describe("Measure Units", () => {
    it("should have valid units", () => {
      const measures = getAllQualityMeasures();
      const validUnits = [
        "%",
        "FIM points",
        "days",
        "visits",
        "per 1000 visits",
      ];
      measures.forEach((m) => {
        expect(validUnits).toContain(m.unit);
      });
    });

    it("should have percentage units for satisfaction and disposition measures", () => {
      const measures = getAllQualityMeasures();
      const rateTypes: MeasureType[] = [
        "patient-satisfaction",
        "discharge-disposition",
      ];
      measures
        .filter((m) => rateTypes.includes(m.measureType))
        .forEach((m) => {
          expect(m.unit).toBe("%");
        });
    });
  });

  describe("Benchmark Targets", () => {
    it("should have realistic functional improvement targets", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.functionalImprovementTarget).toBeGreaterThan(50);
        expect(b.functionalImprovementTarget).toBeLessThanOrEqual(100);
      });
    });

    it("should have realistic discharge to home targets", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.dischargeToHomeTarget).toBeGreaterThan(50);
        expect(b.dischargeToHomeTarget).toBeLessThanOrEqual(100);
      });
    });

    it("should have realistic readmission rate targets", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.readmissionRateTarget).toBeGreaterThanOrEqual(0);
        expect(b.readmissionRateTarget).toBeLessThan(30);
      });
    });

    it("should have realistic patient satisfaction targets", () => {
      const benchmarks = getAllOutcomeBenchmarks();
      benchmarks.forEach((b) => {
        expect(b.patientSatisfactionTarget).toBeGreaterThan(70);
        expect(b.patientSatisfactionTarget).toBeLessThanOrEqual(100);
      });
    });
  });
});
