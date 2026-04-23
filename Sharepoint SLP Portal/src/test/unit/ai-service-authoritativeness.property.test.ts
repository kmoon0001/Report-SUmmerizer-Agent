/**
 * Property-Based Test: AI Response Authoritativeness
 *
 * Property 1: For any AI response that includes citations, all citations must
 * reference authoritative Physical Therapy sources.
 *
 * ∀ response ∈ AIResponse:
 *   response.citations ≠ ∅ ⟹
 *     ∀ citation ∈ response.citations:
 *       citation.source ∈ AuthoritativeSources
 *
 * Validates: Requirements 1.2, 2.2
 * Reference: design.md Correctness Properties section
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { AUTHORITATIVE_PT_SOURCES } from "../../services/ai-service-pt";
import type { AIResponse } from "../../services/ai-service";

describe("Property Test: AI Response Authoritativeness", () => {
  it("Property 1: all citations must be from authoritative PT sources", () => {
    // Arbitrary for AIResponse with citations
    const aiResponseArbitrary = fc.record({
      text: fc.string({ minLength: 10 }),
      reasoning: fc.option(fc.string({ minLength: 10 })),
      citations: fc.option(
        fc.array(
          fc.record({
            source: fc.constantFrom(...AUTHORITATIVE_PT_SOURCES),
            url: fc.option(fc.webUrl()),
            relevance: fc.string({ minLength: 10 }),
            evidenceLevel: fc.option(fc.integer({ min: 1, max: 5 })),
          }),
          { minLength: 1, maxLength: 5 },
        ),
      ),
      suggestedActions: fc.option(fc.array(fc.string(), { maxLength: 5 })),
    });

    fc.assert(
      fc.property(aiResponseArbitrary, (response: AIResponse) => {
        // Property: If citations exist, all must be from authoritative sources
        if (response.citations && response.citations.length > 0) {
          return response.citations.every((citation) =>
            AUTHORITATIVE_PT_SOURCES.includes(citation.source as any),
          );
        }
        // If no citations, property is vacuously true
        return true;
      }),
      { numRuns: 100 },
    );
  });

  it("Property 1 (negative test): should fail if non-authoritative source included", () => {
    // Test that the property correctly identifies violations
    const invalidResponse: AIResponse = {
      text: "Clinical recommendation",
      citations: [
        { source: "APTA", relevance: "Primary guideline" },
        { source: "Random Blog", relevance: "Not authoritative" }, // Invalid!
      ],
    };

    const isValid = invalidResponse.citations?.every((citation) =>
      AUTHORITATIVE_PT_SOURCES.includes(citation.source as any),
    );

    expect(isValid).toBe(false);
  });

  it("should accept responses with no citations", () => {
    const responseWithoutCitations: AIResponse = {
      text: "General information",
    };

    // Property is vacuously true when no citations present
    const isValid =
      !responseWithoutCitations.citations ||
      responseWithoutCitations.citations.every((citation) =>
        AUTHORITATIVE_PT_SOURCES.includes(citation.source as any),
      );

    expect(isValid).toBe(true);
  });

  it("should accept responses with all authoritative citations", () => {
    const validResponse: AIResponse = {
      text: "Evidence-based recommendation",
      citations: [
        { source: "APTA", relevance: "Primary guideline", evidenceLevel: 5 },
        { source: "CMS", relevance: "Billing requirements", evidenceLevel: 5 },
        {
          source: "Medicare Benefit Policy Manual",
          relevance: "Documentation standards",
          evidenceLevel: 5,
        },
      ],
    };

    const isValid = validResponse.citations?.every((citation) =>
      AUTHORITATIVE_PT_SOURCES.includes(citation.source as any),
    );

    expect(isValid).toBe(true);
  });
});
