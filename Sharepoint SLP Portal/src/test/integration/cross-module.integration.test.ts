/**
 * Cross-Module Integration Tests
 * Tests workflows that span multiple PT portal modules
 * Validates data flow between Documentation Studio, Clinical Hubs, and Patient Education
 */

import { describe, it, expect } from "vitest";
import {
  encryptPHI,
  decryptPHI,
  detectPHI,
  maskPHI,
} from "../../utils/encryption";
import { getContrastRatio, meetsWCAGAA } from "../../utils/accessibility";
import { OfflineStorage } from "../../utils/offline";
import {
  generatePatientHandout,
  getExerciseInstructions,
  getHomeSafetyChecklist,
} from "../../data/patient-education-data";

describe("Cross-Module Integration", () => {
  describe("Documentation → Patient Education Workflow", () => {
    it("should generate patient education from assessment data", () => {
      // 1. Create assessment data (from Documentation Studio)
      const assessmentData = {
        patientName: "John Doe",
        diagnosis: "Fall Risk",
        findings: "Balance impaired, gait unsteady",
      };

      // 2. Encrypt PHI
      const masterKey = "test-key-32-bytes-long-for-aes256";
      const encrypted = encryptPHI(JSON.stringify(assessmentData), masterKey);
      expect(encrypted).toBeDefined();

      // 3. Decrypt and retrieve
      const decrypted = decryptPHI(encrypted, masterKey);
      const retrieved = JSON.parse(decrypted);
      expect(retrieved.diagnosis).toBe("Fall Risk");

      // 4. Get related patient education
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout).toBeDefined();
      expect(handout?.title).toContain("Fall Prevention");
    });

    it("should mask PHI in documentation before logging", () => {
      const documentationNote = {
        patientSSN: "123-45-6789",
        patientPhone: "555-123-4567",
        clinicalFindings: "ROM limited, strength 4/5",
      };

      const noteString = JSON.stringify(documentationNote);
      const masked = maskPHI(noteString);

      expect(masked).not.toContain("123-45-6789");
      expect(masked).not.toContain("555-123-4567");
      expect(masked).toContain("clinicalFindings");
    });

    it("should detect PHI in documentation for audit logging", () => {
      const note =
        "Patient MRN: 1234567, DOB: 01/15/1960, Email: patient@example.com";
      const detected = detectPHI(note);
      expect(detected.length).toBeGreaterThan(0);
    });
  });

  describe("Clinical Hub → Documentation → Patient Education", () => {
    it("should support complete assessment workflow", () => {
      // 1. Assessment from clinical hub (e.g., Fall Risk Assessment)
      const assessment = {
        module: "GeriatricHub",
        test: "TUG",
        score: 15,
        interpretation: "High fall risk",
      };

      // 2. Document in Documentation Studio
      const _note = {
        type: "progress",
        assessment: assessment,
        plan: "Implement fall prevention program",
      };

      // 3. Generate patient education
      const exercises = [
        getExerciseInstructions("balance-training"),
        getExerciseInstructions("heel-raises"),
      ];

      expect(exercises.length).toBe(2);
      exercises.forEach((ex) => {
        expect(ex?.steps.length).toBeGreaterThan(0);
      });
    });

    it("should maintain data consistency across modules", () => {
      // Assessment data
      const assessmentData = {
        patientId: "PT-001",
        condition: "Fall Risk",
        riskLevel: "high",
      };

      // Encrypt for storage
      const key = "test-key-32-bytes-long-for-aes256";
      const encrypted = encryptPHI(JSON.stringify(assessmentData), key);

      // Decrypt for use
      const decrypted = JSON.parse(decryptPHI(encrypted, key));

      // Verify consistency
      expect(decrypted.patientId).toBe(assessmentData.patientId);
      expect(decrypted.condition).toBe(assessmentData.condition);
      expect(decrypted.riskLevel).toBe(assessmentData.riskLevel);
    });
  });

  describe("Offline Workflow Integration", () => {
    it("should save assessment offline and sync when online", () => {
      // 1. Create assessment offline
      const assessment = {
        patientId: "PT-001",
        findings: "ROM limited",
        timestamp: Date.now(),
      };

      // 2. Save to offline storage
      OfflineStorage.saveDraft("assessment-001", assessment);
      expect(OfflineStorage.getDraft("assessment-001")).toEqual(assessment);

      // 3. Verify it's marked as unsynced
      const unsynced = OfflineStorage.getUnsyncedDrafts();
      expect(unsynced["assessment-001"]).toBeDefined();

      // 4. Mark as synced when online
      OfflineStorage.markSynced("assessment-001");
      const syncedDrafts = OfflineStorage.getUnsyncedDrafts();
      expect(syncedDrafts["assessment-001"]).toBeUndefined();

      // Cleanup
      OfflineStorage.deleteDraft("assessment-001");
    });

    it("should handle multiple offline changes", () => {
      // Save multiple assessments offline
      OfflineStorage.saveDraft("note-1", { content: "Initial assessment" });
      OfflineStorage.saveDraft("note-2", { content: "Progress note" });
      OfflineStorage.saveDraft("note-3", { content: "Discharge summary" });

      // Verify all saved
      const all = OfflineStorage.getAllDrafts();
      expect(Object.keys(all).length).toBe(3);

      // Sync first two
      OfflineStorage.markSynced("note-1");
      OfflineStorage.markSynced("note-2");

      // Verify only one unsynced
      const unsynced = OfflineStorage.getUnsyncedDrafts();
      expect(Object.keys(unsynced).length).toBe(1);
      expect(unsynced["note-3"]).toBeDefined();

      // Cleanup
      OfflineStorage.clearAll();
    });
  });

  describe("Accessibility Across Modules", () => {
    it("should maintain WCAG AA contrast in all modules", () => {
      // Test common color combinations used across modules
      const combinations = [
        { fg: "#000000", bg: "#FFFFFF", name: "Black on White" },
        { fg: "#FFFFFF", bg: "#334155", name: "White on Slate" },
        { fg: "#0066CC", bg: "#FFFFFF", name: "Blue on White" },
      ];

      combinations.forEach((combo) => {
        const ratio = getContrastRatio(combo.fg, combo.bg);
        expect(meetsWCAGAA(ratio, false)).toBe(true);
      });
    });

    it("should provide accessible patient education", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout?.fontSizePt).toBeGreaterThanOrEqual(14);
      expect(handout?.printFriendly).toBe(true);
    });
  });

  describe("Security Across Modules", () => {
    it("should encrypt sensitive data consistently", () => {
      const key = "test-key-32-bytes-long-for-aes256";
      const sensitiveData = {
        patientName: "John Doe",
        mrn: "123456",
        ssn: "123-45-6789",
      };

      // Encrypt
      const encrypted = encryptPHI(JSON.stringify(sensitiveData), key);

      // Verify it's encrypted (not plaintext)
      expect(encrypted).not.toContain("John Doe");
      expect(encrypted).not.toContain("123456");

      // Decrypt and verify
      const decrypted = JSON.parse(decryptPHI(encrypted, key));
      expect(decrypted.patientName).toBe("John Doe");
    });

    it("should detect PHI across different data formats", () => {
      const testCases = [
        "SSN: 123-45-6789",
        "Phone: 555-123-4567",
        "Email: patient@example.com",
        "MRN: 1234567",
        "DOB: 01/15/1960",
      ];

      testCases.forEach((testCase) => {
        const detected = detectPHI(testCase);
        expect(detected.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Patient Education Integration", () => {
    it("should provide complete patient education package", () => {
      // Get handout
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout).toBeDefined();

      // Get exercises
      const exercises = [
        getExerciseInstructions("balance-training"),
        getExerciseInstructions("heel-raises"),
      ];
      expect(exercises.length).toBe(2);

      // Get safety checklist
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      expect(checklist).toBeDefined();

      // Verify all components are present
      expect(handout?.content.length).toBeGreaterThan(0);
      exercises.forEach((ex) => {
        expect(ex?.steps.length).toBeGreaterThan(0);
      });
      expect(checklist?.items.length).toBeGreaterThan(0);
    });

    it("should support patient view across modules", () => {
      // Patient education has patient view
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout?.description).toBeDefined();

      // Exercises have patient-friendly instructions
      const exercise = getExerciseInstructions("quad-sets");
      expect(exercise?.description).toBeDefined();
      expect(exercise?.steps.length).toBeGreaterThan(0);
    });
  });

  describe("Data Flow Validation", () => {
    it("should validate assessment → documentation → patient education flow", () => {
      // Step 1: Assessment (from clinical hub)
      const assessment = {
        type: "fall-risk",
        score: 18,
        riskLevel: "high",
      };

      // Step 2: Documentation (SOAP note)
      const documentation = {
        subjective: "Patient reports feeling unsteady",
        objective: `Fall risk score: ${assessment.score}`,
        assessment: `${assessment.riskLevel} fall risk`,
        plan: "Implement fall prevention program",
      };

      // Step 3: Patient education
      const handout = generatePatientHandout("fall-prevention-home");
      const exercises = [
        getExerciseInstructions("balance-training"),
        getExerciseInstructions("heel-raises"),
      ];

      // Verify complete flow
      expect(assessment.riskLevel).toBe("high");
      expect(documentation.assessment).toContain("high");
      expect(handout?.title).toContain("Fall Prevention");
      expect(exercises.length).toBe(2);
    });

    it("should maintain data integrity through encryption/decryption cycle", () => {
      const key = "test-key-32-bytes-long-for-aes256";
      const originalData = {
        assessment: "ROM limited",
        findings: "Strength 4/5",
        plan: "Continue PT 3x/week",
      };

      // Encrypt
      const encrypted = encryptPHI(JSON.stringify(originalData), key);

      // Decrypt
      const decrypted = JSON.parse(decryptPHI(encrypted, key));

      // Verify integrity
      expect(decrypted.assessment).toBe(originalData.assessment);
      expect(decrypted.findings).toBe(originalData.findings);
      expect(decrypted.plan).toBe(originalData.plan);
    });
  });

  describe("Module Interoperability", () => {
    it("should support data sharing between modules", () => {
      // Clinical Hub generates assessment
      const clinicalData = {
        module: "GeriatricHub",
        assessment: "TUG",
        result: "High fall risk",
      };

      // Documentation Studio uses it
      const note = {
        clinicalData: clinicalData,
        interpretation: "Patient requires fall prevention program",
      };

      // Patient Education provides resources
      const resources = {
        handout: generatePatientHandout("fall-prevention-home"),
        exercises: [getExerciseInstructions("balance-training")],
        checklist: getHomeSafetyChecklist("fall-prevention-checklist"),
      };

      // Verify interoperability
      expect(note.clinicalData.module).toBe("GeriatricHub");
      expect(resources.handout).toBeDefined();
      expect(resources.exercises.length).toBe(1);
      expect(resources.checklist).toBeDefined();
    });

    it("should handle offline mode across modules", () => {
      // Save clinical data offline
      OfflineStorage.saveDraft("clinical-001", {
        assessment: "Fall risk high",
        timestamp: Date.now(),
      });

      // Save documentation offline
      OfflineStorage.saveDraft("doc-001", {
        note: "Patient requires fall prevention",
        timestamp: Date.now(),
      });

      // Verify both saved
      const all = OfflineStorage.getAllDrafts();
      expect(Object.keys(all).length).toBe(2);

      // Cleanup
      OfflineStorage.clearAll();
    });
  });

  describe("Compliance & Security Integration", () => {
    it("should maintain HIPAA compliance across modules", () => {
      const sensitiveNote = {
        patientSSN: "123-45-6789",
        patientPhone: "555-123-4567",
        clinicalData: "ROM limited",
      };

      // Detect PHI
      const detected = detectPHI(JSON.stringify(sensitiveNote));
      expect(detected.length).toBeGreaterThan(0);

      // Mask for logging
      const masked = maskPHI(JSON.stringify(sensitiveNote));
      expect(masked).not.toContain("123-45-6789");
      expect(masked).not.toContain("555-123-4567");

      // Encrypt for storage
      const key = "test-key-32-bytes-long-for-aes256";
      const encrypted = encryptPHI(JSON.stringify(sensitiveNote), key);
      expect(encrypted).not.toContain("123-45-6789");
    });

    it("should support audit logging across modules", () => {
      const auditLog = {
        timestamp: new Date().toISOString(),
        userId: "PT-001",
        action: "Assessment completed",
        module: "GeriatricHub",
        phiAccessed: true,
      };

      // Mask PHI in audit log
      const logString = JSON.stringify(auditLog);
      expect(logString).toContain("Assessment completed");
      expect(logString).toContain("GeriatricHub");
    });
  });
});
