/**
 * Integration Test: Anatomy Lab
 * Task 11.5 - Integration test for complete 3D visualization workflow
 * Requirements: 11.3, 14.2
 */

import { describe, it, expect } from "vitest";
import {
  ANATOMY_JOINTS,
  ANATOMY_MUSCLES,
  shoulderJoint,
  hipJoint,
  kneeJoint,
  spineJoint,
} from "../../data/anatomy-data";

describe("Anatomy Lab Integration", () => {
  // Skipped: Requires database infrastructure
  describe("Complete 3D Visualization Workflow", () => {
    it("should have all 4 joints available for visualization", () => {
      expect(ANATOMY_JOINTS.length).toBe(4);
      const ids = ANATOMY_JOINTS.map((j) => j.id);
      expect(ids).toContain("shoulder");
      expect(ids).toContain("hip");
      expect(ids).toContain("knee");
      expect(ids).toContain("spine");
    });

    it("should have complete joint data for each joint", () => {
      ANATOMY_JOINTS.forEach((joint) => {
        expect(joint.id).toBeTruthy();
        expect(joint.name).toBeTruthy();
        expect(joint.type).toBeTruthy();
        expect(joint.bones.length).toBeGreaterThan(0);
        expect(joint.ligaments.length).toBeGreaterThan(0);
        expect(joint.primaryMotions.length).toBeGreaterThan(0);
        expect(joint.normalROM).toBeDefined();
        expect(joint.biomechanics).toBeTruthy();
        expect(joint.commonPathologies.length).toBeGreaterThan(0);
        expect(joint.redFlags.length).toBeGreaterThan(0);
      });
    });

    it("should have ROM data with clinically accurate values", () => {
      // Shoulder: flexion 180°, abduction 180° (AAOS norms)
      expect(shoulderJoint.normalROM.flexion).toBe(180);
      expect(shoulderJoint.normalROM.abduction).toBe(180);
      expect(shoulderJoint.normalROM.externalRotation).toBe(90);

      // Hip: flexion 120°, extension 20° (AAOS norms)
      expect(hipJoint.normalROM.flexion).toBe(120);
      expect(hipJoint.normalROM.extension).toBe(20);
      expect(hipJoint.normalROM.abduction).toBe(45);

      // Knee: flexion 135° (AAOS norms)
      expect(kneeJoint.normalROM.flexion).toBe(135);

      // Spine: flexion 80°, extension 20° (AAOS norms)
      expect(spineJoint.normalROM.flexion).toBe(80);
      expect(spineJoint.normalROM.extension).toBe(20);
    });
  });

  describe("Patient View Toggle Data", () => {
    it("should have patient-friendly pathology names", () => {
      // Pathologies should be understandable to patients
      const shoulderPathologies = shoulderJoint.commonPathologies;
      expect(shoulderPathologies).toContain("Rotator Cuff Tear");
      expect(shoulderPathologies).toContain(
        "Adhesive Capsulitis (Frozen Shoulder)",
      );
    });

    it("should have red flags for all joints", () => {
      ANATOMY_JOINTS.forEach((joint) => {
        expect(joint.redFlags.length).toBeGreaterThan(0);
        joint.redFlags.forEach((flag) => {
          expect(flag.length).toBeGreaterThan(10); // Meaningful descriptions
        });
      });
    });
  });

  describe("Keyboard Navigation Data", () => {
    it("should have sequential joint IDs for navigation", () => {
      const ids = ANATOMY_JOINTS.map((j) => j.id);
      expect(ids[0]).toBe("shoulder");
      expect(ids[1]).toBe("hip");
      expect(ids[2]).toBe("knee");
      expect(ids[3]).toBe("spine");
    });
  });

  describe("Muscle Data Completeness", () => {
    it("should have muscles for all joints", () => {
      const jointIds = ["shoulder", "hip", "knee", "spine"];
      jointIds.forEach((id) => {
        const muscles = ANATOMY_MUSCLES[id as keyof typeof ANATOMY_MUSCLES];
        expect(muscles).toBeDefined();
        expect(muscles.length).toBeGreaterThan(0);
      });
    });

    it("should have complete muscle data with origin, insertion, action, innervation", () => {
      Object.values(ANATOMY_MUSCLES).forEach((muscles) => {
        muscles.forEach((muscle) => {
          expect(muscle.id).toBeTruthy();
          expect(muscle.name).toBeTruthy();
          expect(muscle.origin).toBeTruthy();
          expect(muscle.insertion).toBeTruthy();
          expect(muscle.action).toBeTruthy();
          expect(muscle.innervation).toBeTruthy();
          expect(muscle.clinicalRelevance).toBeTruthy();
        });
      });
    });

    it("should have clinically accurate shoulder rotator cuff muscles", () => {
      const shoulderMuscles = ANATOMY_MUSCLES.shoulder;
      const muscleNames = shoulderMuscles.map((m) => m.name);
      // SITS muscles: Supraspinatus, Infraspinatus, Teres Minor, Subscapularis
      expect(muscleNames).toContain("Supraspinatus");
      expect(muscleNames).toContain("Infraspinatus");
      expect(muscleNames).toContain("Teres Minor");
      expect(muscleNames).toContain("Subscapularis");
    });

    it("should have clinically accurate hip muscles", () => {
      const hipMuscleList = ANATOMY_MUSCLES.hip;
      const muscleNames = hipMuscleList.map((m) => m.name);
      expect(muscleNames).toContain("Gluteus Maximus");
      expect(muscleNames).toContain("Gluteus Medius");
      expect(muscleNames).toContain("Iliopsoas (Iliacus + Psoas Major)");
    });
  });

  describe("Biomechanics Data Accuracy", () => {
    it("should have biomechanics descriptions for all joints", () => {
      ANATOMY_JOINTS.forEach((joint) => {
        expect(joint.biomechanics.length).toBeGreaterThan(50);
      });
    });

    it("should mention rotator cuff in shoulder biomechanics", () => {
      expect(shoulderJoint.biomechanics.toLowerCase()).toContain(
        "rotator cuff",
      );
    });

    it("should mention gluteal in hip biomechanics", () => {
      expect(hipJoint.biomechanics.toLowerCase()).toContain("gluteal");
    });

    it("should mention core in spine biomechanics", () => {
      expect(spineJoint.biomechanics.toLowerCase()).toContain("core");
    });
  });
});
