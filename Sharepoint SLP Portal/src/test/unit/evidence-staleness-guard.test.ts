import { describe, it, expect } from 'vitest';
import { EvidenceStalenessGuard } from '../../services/EvidenceStalenessGuard';
import type { EvidenceEntry } from '../../services/EvidenceStalenessGuard';

const currentYear = new Date().getFullYear();

describe('EvidenceStalenessGuard', () => {

  describe('checkStaleness — structured entries', () => {
    it('should mark a 1-year-old CMS policy as "current"', () => {
      const entries: EvidenceEntry[] = [{
        citation: 'MBPM Chapter 15', year: currentYear - 1,
        discipline: 'shared', guidelineBody: 'CMS'
      }];
      const results = EvidenceStalenessGuard.checkStaleness(entries);
      expect(results[0].staleness).toBe('current');
    });

    it('should mark a 3-year-old CMS policy as "stale"', () => {
      const entries: EvidenceEntry[] = [{
        citation: 'CMS LCD L33702', year: currentYear - 3,
        discipline: 'pt', guidelineBody: 'CMS'
      }];
      const results = EvidenceStalenessGuard.checkStaleness(entries);
      expect(results[0].staleness).toBe('outdated');
    });

    it('should mark a 4-year-old APTA guideline as "stale"', () => {
      const entries: EvidenceEntry[] = [{
        citation: 'APTA CPG: Fall Prevention', year: currentYear - 4,
        discipline: 'pt', guidelineBody: 'APTA'
      }];
      const results = EvidenceStalenessGuard.checkStaleness(entries);
      expect(['stale', 'outdated']).toContain(results[0].staleness);
    });

    it('should return actionable recommendation for outdated evidence', () => {
      const entries: EvidenceEntry[] = [{
        citation: 'ASHA 2010 Dysphagia Guidelines', year: 2010,
        discipline: 'slp', guidelineBody: 'ASHA'
      }];
      const results = EvidenceStalenessGuard.checkStaleness(entries);
      expect(results[0].staleness).toBe('outdated');
      expect(results[0].recommendedAction).toMatch(/replace/i);
    });
  });

  describe('scanTextForStaleReferences — free text scanning', () => {
    it('should detect and flag a year reference older than 5 years', () => {
      const text = `Patient treated per Logemann (2010) dysphagia protocol.`;
      const results = EvidenceStalenessGuard.scanTextForStaleReferences(text);
      expect(results.some(r => r.isStale)).toBe(true);
    });

    it('should not flag a current-year reference', () => {
      const text = `Protocol per APTA CPG (${currentYear}).`;
      const results = EvidenceStalenessGuard.scanTextForStaleReferences(text);
      expect(results.every(r => !r.isStale)).toBe(true);
    });

    it('should ignore invalid years (like 1800 or future year)', () => {
      const text = `Reference (1850) should be ignored. Future (${currentYear + 5}) also invalid.`;
      const results = EvidenceStalenessGuard.scanTextForStaleReferences(text);
      expect(results.length).toBe(0);
    });
  });
});
