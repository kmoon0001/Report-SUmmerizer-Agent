/**
 * Regression Tests — PT Dashboard
 * Ensures PT content is preserved and SLP content never reappears
 */
import { describe, it, expect } from "vitest";
import {
  PT_DATA,
  PT_CORNER_CONTENT,
  PT_QUIZ_QUESTIONS,
} from "../../data/pt-data";

describe("Regression: PT Data Integrity", () => {
  it("PT_DATA contains no SLP-specific entries", () => {
    const slpIds = ["dysphagia", "aphasia", "aac", "voice-therapy", "fluency"];
    PT_DATA.forEach((cat) => {
      slpIds.forEach((slpId) => {
        expect(cat.id).not.toContain(slpId);
        expect(cat.title.toLowerCase()).not.toContain("dysphagia");
        expect(cat.title.toLowerCase()).not.toContain("aphasia");
      });
    });
  });

  it("PT_DATA has at least 25 entries", () => {
    expect(PT_DATA.length).toBeGreaterThanOrEqual(25);
  });

  it("all required PT hub IDs are present", () => {
    const required = [
      "orthopedic-hub",
      "neurological-hub",
      "geriatric-hub",
      "cardiopulmonary-vestibular",
      "sports-pelvic-health",
      "wound-care-hub",
      "pediatric-pt",
      "clinical-calculators",
      "goal-generator",
      "exercise-library",
      "documentation-studio",
      "compliance-center",
      "clinical-pathways",
      "pt-corner",
      "quality-measures",
    ];
    required.forEach((id) => {
      expect(PT_DATA.some((c) => c.id === id)).toBe(true);
    });
  });

  it("PT_QUIZ_QUESTIONS are PT-specific", () => {
    PT_QUIZ_QUESTIONS.forEach((q) => {
      expect(q.q.toLowerCase()).not.toContain("dysphagia");
      expect(q.q.toLowerCase()).not.toContain("aphasia");
      expect(q.q.toLowerCase()).not.toContain("asha");
    });
  });

  it("PT_CORNER_CONTENT has no ASHA references", () => {
    const allContent = JSON.stringify(PT_CORNER_CONTENT);
    expect(allContent).not.toContain("ASHA");
    expect(allContent).not.toContain("dysphagia");
  });

  it("PT_CORNER_CONTENT CEUs reference APTA or PT-specific providers", () => {
    const ptProviders = [
      "APTA",
      "MedBridge",
      "Herman",
      "Evidence in Motion",
      "Emory",
    ];
    PT_CORNER_CONTENT.ceus.forEach((ceu) => {
      const isFromPTProvider = ptProviders.some((p) =>
        ceu.provider.includes(p),
      );
      expect(isFromPTProvider).toBe(true);
    });
  });

  it("all PT_DATA entries have valid color classes", () => {
    PT_DATA.forEach((cat) => {
      expect(cat.color).toMatch(/^bg-\w+-\d+ text-\w+-\d+$/);
    });
  });
});

describe("Regression: PT Routes Completeness", () => {
  it("all PT_DATA IDs are valid route strings", () => {
    PT_DATA.forEach((cat) => {
      expect(cat.id).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("no duplicate IDs in PT_DATA", () => {
    const ids = PT_DATA.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
