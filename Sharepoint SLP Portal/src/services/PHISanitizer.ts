export class PHISanitizer {
  /**
   * Deep-scrubs text for potential PHI identifiers before sending to external LLMs.
   */
  static scrub(text: string): string {
    let cleaned = text;

    // 1. Remove Names (Common patterns)
    cleaned = cleaned.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[REDACTED NAME]');

    // 2. Remove Dates (DOB, DOS)
    cleaned = cleaned.replace(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, '[REDACTED DATE]');

    // 3. Remove SSN-like patterns
    cleaned = cleaned.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED IDENTIFIER]');

    // 4. Remove Phone Numbers
    cleaned = cleaned.replace(/\b(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g, '[REDACTED PHONE]');

    // 5. Remove Addresses (Limited patterns)
    cleaned = cleaned.replace(/\d+ [A-Z][a-z]+ (St|Ave|Rd|Blvd|Ln|Dr)\b/gi, '[REDACTED ADDRESS]');

    return cleaned;
  }

  /**
   * Validates if a string contains unmasked PHI.
   */
  static containsPotentialPHI(text: string): boolean {
    const rawText = text.toLowerCase();
    const markers = ['born on', 'social security', 'lives at', 'dob:', 'ssn:'];
    
    return markers.some(m => rawText.includes(m)) || 
           (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) || // SSN
           (/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/.test(text)); // Dates
  }
}
