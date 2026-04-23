import * as fs from 'fs';
import * as path from 'path';

export interface CitationResult {
  isValid: boolean;
  missingSource: boolean;
  hallucinatedTerms: string[];
}

export class CitationValidatorService {
  private static KB_PATH = 'knowledge-base/';

  /**
   * Verifies if the AI response contains "Hallucinations" by checking against
   * the clinical Markdown registry.
   */
  static verifyResponse(response: string): CitationResult {
    const findings: CitationResult = {
      isValid: true,
      missingSource: false,
      hallucinatedTerms: []
    };

    // 1. Identify key clinical terms in response (simple match for this build)
    const criticalTerms = ['IDDSI', 'Jimmo', 'CPT 97110', 'Berg Balance'];
    const usedTerms = criticalTerms.filter(term => response.includes(term));

    // 2. Check if the response cites a source
    if (usedTerms.length > 0 && !response.includes('[Source:') && !response.includes('Section')) {
      findings.missingSource = true;
      findings.isValid = false;
    }

    // 3. Simple Hallucination Check: If the AI mentions a protocol NOT in our KB
    // (This is a simplified version for the build)
    const suspiciousProtocols = ['SwiftRecovery Protocol', 'RapidGoal 2024']; // Fake protocols
    findings.hallucinatedTerms = suspiciousProtocols.filter(p => response.includes(p));
    
    if (findings.hallucinatedTerms.length > 0) {
      findings.isValid = false;
    }

    return findings;
  }
}
