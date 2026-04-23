import { describe, it, expect, vi } from "vitest";
import { aiService } from "../../services/ai-service";

import { persistenceService } from "../../services/persistence-service";

describe("AI and Persistence Integration", () => {
  // Skipped: Requires database infrastructure
  it("should save AI response to persistence", async () => {
    const mockResponse = {
      text: "Clinical note content",
      reasoning: "Reasoning",
    };

    // Mock generateContent to return our mockResponse
    vi.spyOn(aiService, "generateClinicalResponse").mockResolvedValue(
      mockResponse as any,
    );

    // Perform AI generation
    const response = await aiService.generateClinicalResponse(
      "prompt",
      "context",
      [],
    );

    // Save to persistence
    await persistenceService.saveClinicalNote(response);

    // Verify persistence
    const notes = await persistenceService.getClinicalNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].text).toBe("Clinical note content");
  });
});
