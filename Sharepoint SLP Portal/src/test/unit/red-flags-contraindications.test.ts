import { describe, it, expect } from "vitest";
import {
  getRedFlagById,
  getRedFlagsByCategory,
  getRedFlagsBySeverity,
  getCriticalRedFlags,
  getRedFlagsForDiscipline,
  searchRedFlags,
  getRedFlagsByAction,
  getAllRedFlags,
  getCardiovascularRedFlags,
  getNeurologicalRedFlags,
  getSystemicRedFlags,
  getMusculoskeletalRedFlags,
  getOccupationalRedFlags,
  type Severity,
} from "../../shared/data/red-flags-contraindications";

describe("Red Flags & Contraindications Library", () => {
  describe("getRedFlagById", () => {
    it("should return red flag by valid ID", () => {
      const flag = getRedFlagById("cv-001");
      expect(flag).toBeDefined();
      expect(flag?.name).toBe("Acute Myocardial Infarction");
    });

    it("should return undefined for invalid ID", () => {
      const flag = getRedFlagById("invalid-id");
      expect(flag).toBeUndefined();
    });

    it("should return correct flag properties", () => {
      const flag = getRedFlagById("cv-001");
      expect(flag?.severity).toBe("critical");
      expect(flag?.category).toBe("cardiovascular");
      expect(flag?.discipline).toBe("shared");
    });
  });

  describe("getRedFlagsByCategory", () => {
    it("should return cardiovascular red flags", () => {
      const flags = getRedFlagsByCategory("cardiovascular");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "cardiovascular")).toBe(true);
    });

    it("should return neurological red flags", () => {
      const flags = getRedFlagsByCategory("neurological");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "neurological")).toBe(true);
    });

    it("should return systemic red flags", () => {
      const flags = getRedFlagsByCategory("systemic");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "systemic")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const flags = getRedFlagsByCategory("non-existent" as any);
      expect(flags.length).toBe(0);
    });
  });

  describe("getRedFlagsBySeverity", () => {
    it("should return critical red flags", () => {
      const flags = getRedFlagsBySeverity("critical");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "critical")).toBe(true);
    });

    it("should return high severity red flags", () => {
      const flags = getRedFlagsBySeverity("high");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "high")).toBe(true);
    });

    it("should return moderate severity red flags", () => {
      const flags = getRedFlagsBySeverity("moderate");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "moderate")).toBe(true);
    });

    it("should return moderate severity red flags", () => {
      const flags = getRedFlagsBySeverity("moderate");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "moderate")).toBe(true);
    });
  });

  describe("getCriticalRedFlags", () => {
    it("should return only critical severity flags", () => {
      const flags = getCriticalRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "critical")).toBe(true);
    });

    it("should include acute MI", () => {
      const flags = getCriticalRedFlags();
      expect(flags.some((f) => f.name === "Acute Myocardial Infarction")).toBe(
        true,
      );
    });

    it("should include stroke", () => {
      const flags = getCriticalRedFlags();
      expect(flags.some((f) => f.name === "Acute Stroke")).toBe(true);
    });
  });

  describe("getRedFlagsForDiscipline", () => {
    it("should return shared red flags for PT", () => {
      const flags = getRedFlagsForDiscipline("pt");
      const hasShared = flags.some((f) => f.discipline === "shared");
      expect(hasShared).toBe(true);
    });

    it("should return shared red flags for OT", () => {
      const flags = getRedFlagsForDiscipline("ot");
      const hasShared = flags.some((f) => f.discipline === "shared");
      expect(hasShared).toBe(true);
    });

    it("should return discipline-specific flags", () => {
      const ptFlags = getRedFlagsForDiscipline("pt");
      const otFlags = getRedFlagsForDiscipline("ot");
      expect(ptFlags.length).toBeGreaterThan(0);
      expect(otFlags.length).toBeGreaterThan(0);
    });
  });

  describe("searchRedFlags", () => {
    it("should find flag by name", () => {
      const results = searchRedFlags("Myocardial");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((f) => f.name.includes("Myocardial"))).toBe(true);
    });

    it("should find flag by description", () => {
      const results = searchRedFlags("blood clot");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchRedFlags("stroke");
      const results2 = searchRedFlags("STROKE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchRedFlags("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getRedFlagsByAction", () => {
    it("should return flags requiring immediate stop", () => {
      const flags = getRedFlagsByAction("stop-immediately");
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.severity === "critical")).toBe(true);
    });

    it("should return flags requiring physician referral", () => {
      const flags = getRedFlagsByAction("refer-physician");
      expect(flags.length).toBeGreaterThan(0);
    });
  });

  describe("Category-Specific Functions", () => {
    it("getCardiovascularRedFlags should return CV flags", () => {
      const flags = getCardiovascularRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "cardiovascular")).toBe(true);
    });

    it("getNeurologicalRedFlags should return neuro flags", () => {
      const flags = getNeurologicalRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "neurological")).toBe(true);
    });

    it("getSystemicRedFlags should return systemic flags", () => {
      const flags = getSystemicRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "systemic")).toBe(true);
    });

    it("getMusculoskeletalRedFlags should return MSK flags", () => {
      const flags = getMusculoskeletalRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.every((f) => f.category === "musculoskeletal")).toBe(true);
    });

    it("getOccupationalRedFlags should return occupational flags", () => {
      const flags = getOccupationalRedFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(
        flags.every(
          (f) => f.category === "occupational" || f.category === "psychiatric",
        ),
      ).toBe(true);
    });
  });

  describe("getAllRedFlags", () => {
    it("should return all red flags", () => {
      const all = getAllRedFlags();
      expect(all.length).toBeGreaterThan(0);
    });

    it("should have valid red flag structure", () => {
      const flags = getAllRedFlags();
      flags.forEach((flag) => {
        expect(flag.id).toBeDefined();
        expect(flag.name).toBeDefined();
        expect(flag.category).toBeDefined();
        expect(flag.severity).toMatch(/^(critical|high|moderate|low)$/);
        expect(flag.description).toBeDefined();
        expect(flag.signs.length).toBeGreaterThan(0);
        expect(flag.symptoms.length).toBeGreaterThan(0);
        expect(flag.immediateActions.length).toBeGreaterThan(0);
        expect(flag.referralCriteria).toBeDefined();
        expect(flag.contraindications.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Red Flag Signs and Symptoms", () => {
    it("should have signs for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.signs.length).toBeGreaterThan(0);
        expect(f.signs.every((s) => typeof s === "string")).toBe(true);
      });
    });

    it("should have symptoms for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.symptoms.length).toBeGreaterThan(0);
        expect(f.symptoms.every((s) => typeof s === "string")).toBe(true);
      });
    });
  });

  describe("Immediate Actions", () => {
    it("should have immediate actions for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.immediateActions.length).toBeGreaterThan(0);
        expect(f.immediateActions.every((a) => typeof a === "string")).toBe(
          true,
        );
      });
    });

    it("critical flags should include stop treatment action", () => {
      const criticalFlags = getCriticalRedFlags();
      criticalFlags.forEach((f) => {
        const hasStopAction = f.immediateActions.some(
          (a) =>
            a.toLowerCase().includes("stop") ||
            a.toLowerCase().includes("immediately"),
        );
        expect(hasStopAction).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.contraindications.length).toBeGreaterThan(0);
        expect(f.contraindications.every((c) => typeof c === "string")).toBe(
          true,
        );
      });
    });

    it("should list specific contraindicated treatments", () => {
      const dvt = getRedFlagById("cv-003");
      expect(dvt?.contraindications).toContain("Massage");
      expect(dvt?.contraindications).toContain("Heat therapy");
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.source).toBeDefined();
        expect(f.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each flag", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.citation).toBeDefined();
        expect(f.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Severity Hierarchy", () => {
    it("critical flags should be most severe", () => {
      const critical = getCriticalRedFlags();
      expect(critical.length).toBeGreaterThan(0);
      expect(critical.some((f) => f.name.includes("Infarction"))).toBe(true);
    });

    it("should have flags at multiple severity levels", () => {
      const severities: Severity[] = ["critical", "high", "moderate"];
      severities.forEach((severity) => {
        const flags = getRedFlagsBySeverity(severity);
        expect(flags.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Referral Criteria", () => {
    it("should have clear referral criteria", () => {
      const flags = getAllRedFlags();
      flags.forEach((f) => {
        expect(f.referralCriteria).toBeDefined();
        expect(f.referralCriteria.length).toBeGreaterThan(0);
      });
    });

    it("critical flags should require immediate referral", () => {
      const critical = getCriticalRedFlags();
      critical.forEach((f) => {
        const hasImmediateRef =
          f.referralCriteria.toLowerCase().includes("immediate") ||
          f.referralCriteria.toLowerCase().includes("emergency") ||
          f.referralCriteria.toLowerCase().includes("911");
        expect(hasImmediateRef).toBe(true);
      });
    });
  });
});
