import { describe, it, expect } from "vitest";
import {
  getBillingCodeById,
  getBillingCodeByCode,
  getCodesByType,
  getCodesByDiscipline,
  getCodesForCondition,
  searchCodes,
  getAllCPTCodes,
  getAllICD10Codes,
  getAllModifiers,
  getBillingRuleById,
  getBillingRulesByType,
  getAllBillingRules,
  getAllCodes,
  type BillingCode,
  type CodeType,
  type Discipline,
} from "../../shared/data/billing-coding-standards";

describe("Billing & Coding Standards Library", () => {
  describe("getBillingCodeById", () => {
    it("should return code by valid ID", () => {
      const code = getBillingCodeById("cpt-pt-001");
      expect(code).toBeDefined();
      expect(code?.code).toBe("97110");
    });

    it("should return undefined for invalid ID", () => {
      const code = getBillingCodeById("invalid-id");
      expect(code).toBeUndefined();
    });

    it("should return correct code properties", () => {
      const code = getBillingCodeById("cpt-pt-001");
      expect(code?.codeType).toBe("cpt");
      expect(code?.discipline).toBe("pt");
      expect(code?.unitValue).toBe(1);
      expect(code?.billingUnit).toBe(15);
    });
  });

  describe("getBillingCodeByCode", () => {
    it("should return code by code value", () => {
      const code = getBillingCodeByCode("97110");
      expect(code).toBeDefined();
      expect(code?.description).toBe("Therapeutic exercises");
    });

    it("should return undefined for invalid code", () => {
      const code = getBillingCodeByCode("99999");
      expect(code).toBeUndefined();
    });

    it("should find ICD-10 codes", () => {
      const code = getBillingCodeByCode("I63.9");
      expect(code).toBeDefined();
      expect(code?.codeType).toBe("icd10");
    });

    it("should find modifiers", () => {
      const code = getBillingCodeByCode("59");
      expect(code).toBeDefined();
      expect(code?.codeType).toBe("modifier");
    });
  });

  describe("getCodesByType", () => {
    it("should return CPT codes", () => {
      const codes = getCodesByType("cpt");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "cpt")).toBe(true);
    });

    it("should return ICD-10 codes", () => {
      const codes = getCodesByType("icd10");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "icd10")).toBe(true);
    });

    it("should return modifiers", () => {
      const codes = getCodesByType("modifier");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "modifier")).toBe(true);
    });
  });

  describe("getCodesByDiscipline", () => {
    it("should return PT codes including shared", () => {
      const codes = getCodesByDiscipline("pt");
      expect(codes.length).toBeGreaterThan(0);
      const hasPT = codes.some((c) => c.discipline === "pt");
      const hasShared = codes.some((c) => c.discipline === "shared");
      expect(hasPT).toBe(true);
      expect(hasShared).toBe(true);
    });

    it("should return OT codes including shared", () => {
      const codes = getCodesByDiscipline("ot");
      expect(codes.length).toBeGreaterThan(0);
      const hasOT = codes.some((c) => c.discipline === "ot");
      const hasShared = codes.some((c) => c.discipline === "shared");
      expect(hasOT).toBe(true);
      expect(hasShared).toBe(true);
    });

    it("should return shared codes for shared discipline", () => {
      const codes = getCodesByDiscipline("shared");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.discipline === "shared")).toBe(true);
    });
  });

  describe("getCodesForCondition", () => {
    it("should return codes for stroke condition", () => {
      const codes = getCodesForCondition("stroke");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.applicableTo.includes("stroke"))).toBe(true);
    });

    it("should return codes for low-back-pain condition", () => {
      const codes = getCodesForCondition("low-back-pain");
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.applicableTo.includes("low-back-pain"))).toBe(
        true,
      );
    });

    it("should return empty array for non-existent condition", () => {
      const codes = getCodesForCondition("non-existent-condition");
      expect(codes.length).toBe(0);
    });
  });

  describe("searchCodes", () => {
    it("should find code by code value", () => {
      const results = searchCodes("97110");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((c) => c.code === "97110")).toBe(true);
    });

    it("should find code by description", () => {
      const results = searchCodes("Therapeutic exercises");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchCodes("therapeutic");
      const results2 = searchCodes("THERAPEUTIC");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchCodes("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllCPTCodes", () => {
    it("should return only CPT codes", () => {
      const codes = getAllCPTCodes();
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "cpt")).toBe(true);
    });

    it("should include PT evaluation codes", () => {
      const codes = getAllCPTCodes();
      expect(codes.some((c) => c.code === "97161")).toBe(true);
    });

    it("should include OT evaluation codes", () => {
      const codes = getAllCPTCodes();
      expect(codes.some((c) => c.code === "97165")).toBe(true);
    });
  });

  describe("getAllICD10Codes", () => {
    it("should return only ICD-10 codes", () => {
      const codes = getAllICD10Codes();
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "icd10")).toBe(true);
    });

    it("should include stroke code", () => {
      const codes = getAllICD10Codes();
      expect(codes.some((c) => c.code === "I63.9")).toBe(true);
    });

    it("should include low back pain code", () => {
      const codes = getAllICD10Codes();
      expect(codes.some((c) => c.code === "M54.5")).toBe(true);
    });
  });

  describe("getAllModifiers", () => {
    it("should return only modifiers", () => {
      const codes = getAllModifiers();
      expect(codes.length).toBeGreaterThan(0);
      expect(codes.every((c) => c.codeType === "modifier")).toBe(true);
    });

    it("should include laterality modifiers", () => {
      const codes = getAllModifiers();
      expect(codes.some((c) => c.code === "LT")).toBe(true);
      expect(codes.some((c) => c.code === "RT")).toBe(true);
    });
  });

  describe("getAllCodes", () => {
    it("should return all codes", () => {
      const all = getAllCodes();
      expect(all.length).toBeGreaterThan(0);
    });

    it("should have valid code structure", () => {
      const codes = getAllCodes();
      codes.forEach((code) => {
        expect(code.id).toBeDefined();
        expect(code.code).toBeDefined();
        expect(code.codeType).toMatch(/^(cpt|icd10|modifier|hcpcs)$/);
        expect(code.discipline).toMatch(/^(pt|ot|shared)$/);
        expect(code.description).toBeDefined();
        expect(code.longDescription).toBeDefined();
        expect(code.unitValue).toBeGreaterThanOrEqual(0);
        expect(code.billingUnit).toBeGreaterThanOrEqual(0);
        expect(code.applicableTo.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("CPT Code Properties", () => {
    it("should have unit values for CPT codes", () => {
      const codes = getAllCPTCodes();
      codes.forEach((c) => {
        expect(c.unitValue).toBeGreaterThan(0);
        expect(c.billingUnit).toBeGreaterThan(0);
      });
    });

    it("should have 15-minute billing units for therapy codes", () => {
      const code = getBillingCodeByCode("97110");
      expect(code?.billingUnit).toBe(15);
    });

    it("should have applicable conditions", () => {
      const codes = getAllCPTCodes();
      codes.forEach((c) => {
        expect(c.applicableTo.length).toBeGreaterThan(0);
      });
    });
  });

  describe("ICD-10 Code Properties", () => {
    it("should have zero unit values for ICD-10 codes", () => {
      const codes = getAllICD10Codes();
      codes.forEach((c) => {
        expect(c.unitValue).toBe(0);
        expect(c.billingUnit).toBe(0);
      });
    });

    it("should have applicable conditions", () => {
      const codes = getAllICD10Codes();
      codes.forEach((c) => {
        expect(c.applicableTo.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Modifier Properties", () => {
    it("should have zero unit values for modifiers", () => {
      const codes = getAllModifiers();
      codes.forEach((c) => {
        expect(c.unitValue).toBe(0);
        expect(c.billingUnit).toBe(0);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each code", () => {
      const codes = getAllCodes();
      codes.forEach((c) => {
        expect(c.source).toBeDefined();
        expect(c.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each code", () => {
      const codes = getAllCodes();
      codes.forEach((c) => {
        expect(c.citation).toBeDefined();
        expect(c.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Billing Rules", () => {
    describe("getBillingRuleById", () => {
      it("should return rule by valid ID", () => {
        const rule = getBillingRuleById("rule-001");
        expect(rule).toBeDefined();
        expect(rule?.name).toBe("8-Minute Rule");
      });

      it("should return undefined for invalid ID", () => {
        const rule = getBillingRuleById("invalid-id");
        expect(rule).toBeUndefined();
      });
    });

    describe("getBillingRulesByType", () => {
      it("should return 8-minute rule", () => {
        const rules = getBillingRulesByType("8-minute-rule");
        expect(rules.length).toBeGreaterThan(0);
        expect(rules.every((r) => r.rule === "8-minute-rule")).toBe(true);
      });

      it("should return medical necessity rule", () => {
        const rules = getBillingRulesByType("medical-necessity");
        expect(rules.length).toBeGreaterThan(0);
        expect(rules.every((r) => r.rule === "medical-necessity")).toBe(true);
      });
    });

    describe("getAllBillingRules", () => {
      it("should return all billing rules", () => {
        const rules = getAllBillingRules();
        expect(rules.length).toBeGreaterThan(0);
      });

      it("should have valid rule structure", () => {
        const rules = getAllBillingRules();
        rules.forEach((rule) => {
          expect(rule.id).toBeDefined();
          expect(rule.name).toBeDefined();
          expect(rule.rule).toBeDefined();
          expect(rule.discipline).toMatch(/^(pt|ot|shared)$/);
          expect(rule.description).toBeDefined();
          expect(rule.requirements.length).toBeGreaterThan(0);
          expect(rule.examples.length).toBeGreaterThan(0);
          expect(rule.commonErrors.length).toBeGreaterThan(0);
        });
      });
    });

    describe("Rule Content Quality", () => {
      it("should have meaningful requirements", () => {
        const rules = getAllBillingRules();
        rules.forEach((r) => {
          expect(r.requirements.length).toBeGreaterThan(0);
          expect(r.requirements.every((req) => req.length > 0)).toBe(true);
        });
      });

      it("should have practical examples", () => {
        const rules = getAllBillingRules();
        rules.forEach((r) => {
          expect(r.examples.length).toBeGreaterThan(0);
          expect(r.examples.every((ex) => ex.length > 0)).toBe(true);
        });
      });

      it("should identify common errors", () => {
        const rules = getAllBillingRules();
        rules.forEach((r) => {
          expect(r.commonErrors.length).toBeGreaterThan(0);
          expect(r.commonErrors.every((err) => err.length > 0)).toBe(true);
        });
      });
    });

    describe("Rule Source Attribution", () => {
      it("should have source for each rule", () => {
        const rules = getAllBillingRules();
        rules.forEach((r) => {
          expect(r.source).toBeDefined();
          expect(r.source.length).toBeGreaterThan(0);
        });
      });

      it("should have citation for each rule", () => {
        const rules = getAllBillingRules();
        rules.forEach((r) => {
          expect(r.citation).toBeDefined();
          expect(r.citation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Discipline-Specific Codes", () => {
    it("should have PT-specific CPT codes", () => {
      const codes = getCodesByDiscipline("pt");
      const ptCodes = codes.filter(
        (c) => c.codeType === "cpt" && c.discipline === "pt",
      );
      expect(ptCodes.length).toBeGreaterThan(0);
    });

    it("should have OT-specific CPT codes", () => {
      const codes = getCodesByDiscipline("ot");
      const otCodes = codes.filter(
        (c) => c.codeType === "cpt" && c.discipline === "ot",
      );
      expect(otCodes.length).toBeGreaterThan(0);
    });

    it("should have shared ICD-10 codes", () => {
      const codes = getCodesByDiscipline("shared");
      const icd10Codes = codes.filter((c) => c.codeType === "icd10");
      expect(icd10Codes.length).toBeGreaterThan(0);
    });
  });

  describe("Code Restrictions", () => {
    it("should have restrictions where applicable", () => {
      const codes = getAllCodes();
      const withRestrictions = codes.filter(
        (c) => c.restrictions && c.restrictions.length > 0,
      );
      expect(withRestrictions.length).toBeGreaterThanOrEqual(0);
    });
  });
});
