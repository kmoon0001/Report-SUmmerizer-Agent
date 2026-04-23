import { describe, it, expect } from "vitest";
import {
  PatientSchema,
  ClinicalNoteSchema,
  AssessmentResultSchema,
  APIRequestSchema,
  APIResponseSchema,
  validateData,
  validateDataSafe,
  createValidator,
  mergeSchemas,
  getValidationErrorMessages,
} from "../../utils/schema-validation";

describe("Schema Validation", () => {
  describe("PatientSchema", () => {
    it("should validate a valid patient", () => {
      const patient = {
        name: "John Doe",
        age: 45,
      };
      const result = validateData(patient, PatientSchema);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should reject patient with missing name", () => {
      const patient = {
        age: 45,
      };
      const result = validateData(patient, PatientSchema);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it("should reject patient with negative age", () => {
      const patient = {
        name: "John Doe",
        age: -5,
      };
      const result = validateData(patient, PatientSchema);
      expect(result.success).toBe(false);
    });
  });

  describe("ClinicalNoteSchema", () => {
    it("should validate a valid clinical note", () => {
      const note = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        date: "2026-03-26T10:00:00Z",
        templateId: "template-1",
        content: "Patient shows improvement",
        system: "SLP" as const,
      };
      const result = validateData(note, ClinicalNoteSchema);
      expect(result.success).toBe(true);
    });

    it("should reject note with empty content", () => {
      const note = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        date: "2026-03-26T10:00:00Z",
        templateId: "template-1",
        content: "",
        system: "PT" as const,
      };
      const result = validateData(note, ClinicalNoteSchema);
      expect(result.success).toBe(false);
    });
  });

  describe("AssessmentResultSchema", () => {
    it("should validate a valid assessment result", () => {
      const assessment = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "FMA",
        score: 50,
        maxScore: 100,
        date: "2026-03-26T10:00:00Z",
      };
      const result = validateData(assessment, AssessmentResultSchema);
      expect(result.success).toBe(true);
    });

    it("should reject assessment with negative score", () => {
      const assessment = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "FMA",
        score: -10,
        maxScore: 100,
        date: "2026-03-26T10:00:00Z",
      };
      const result = validateData(assessment, AssessmentResultSchema);
      expect(result.success).toBe(false);
    });
  });

  describe("APIRequestSchema", () => {
    it("should validate a valid API request", () => {
      const request = {
        method: "GET" as const,
        endpoint: "/api/patients",
      };
      const result = validateData(request, APIRequestSchema);
      expect(result.success).toBe(true);
    });

    it("should reject request with invalid method", () => {
      const request = {
        method: "INVALID",
        endpoint: "/api/patients",
      };
      const result = validateData(request, APIRequestSchema);
      expect(result.success).toBe(false);
    });
  });

  describe("APIResponseSchema", () => {
    it("should validate a valid API response", () => {
      const response = {
        success: true,
        data: { id: "123" },
        timestamp: "2026-03-26T10:00:00Z",
      };
      const result = validateData(response, APIResponseSchema);
      expect(result.success).toBe(true);
    });

    it("should validate error response", () => {
      const response = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Patient not found",
        },
        timestamp: "2026-03-26T10:00:00Z",
      };
      const result = validateData(response, APIResponseSchema);
      expect(result.success).toBe(true);
    });
  });

  describe("validateDataSafe", () => {
    it("should return success for valid data", () => {
      const patient = { name: "John", age: 30 };
      const result = validateDataSafe(patient, PatientSchema);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return error string for invalid data", () => {
      const patient = { age: -5 };
      const result = validateDataSafe(patient, PatientSchema);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe("string");
    });
  });

  describe("createValidator", () => {
    it("should create a validator function", () => {
      const validatePatient = createValidator(PatientSchema);
      const result = validatePatient({ name: "John", age: 30 });
      expect(result.success).toBe(true);
    });

    it("validator should reject invalid data", () => {
      const validatePatient = createValidator(PatientSchema);
      const result = validatePatient({ age: -5 });
      expect(result.success).toBe(false);
    });
  });

  describe("mergeSchemas", () => {
    it("should merge multiple schemas", () => {
      const schema1 = PatientSchema;
      const schema2 = PatientSchema;
      const merged = mergeSchemas(schema1, schema2);
      expect(merged).toBeDefined();
    });

    it("should return empty object schema for no schemas", () => {
      const merged = mergeSchemas();
      expect(merged).toBeDefined();
    });
  });

  describe("getValidationErrorMessages", () => {
    it("should format error messages", () => {
      const errors = [
        { code: "invalid_type", message: "Expected string", path: ["name"] },
        { code: "too_small", message: "Must be positive", path: ["age"] },
      ];
      const messages = getValidationErrorMessages(errors);
      expect(messages).toHaveLength(2);
      expect(messages[0]).toContain("name");
      expect(messages[1]).toContain("age");
    });

    it("should handle root path errors", () => {
      const errors = [
        { code: "invalid_type", message: "Invalid data", path: [] },
      ];
      const messages = getValidationErrorMessages(errors);
      expect(messages[0]).toContain("root");
    });
  });
});
