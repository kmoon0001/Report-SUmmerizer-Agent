/**
 * Evidence Staleness Guard
 * Flags when clinical evidence cited in documentation or knowledge base
 * is older than the recommended CPG (Clinical Practice Guideline) update cycle.
 * References: APTA, AOTA, ASHA, CMS update schedules.
 */

export interface EvidenceEntry {
  citation: string;
  year: number;
  discipline: 'slp' | 'pt' | 'ot' | 'shared';
  guidelineBody: string; // e.g., APTA, ASHA, CMS
}

export interface StalenessResult {
  citation: string;
  yearPublished: number;
  ageInYears: number;
  isStale: boolean;
  staleness: 'current' | 'aging' | 'stale' | 'outdated';
  recommendedAction: string;
}

// CPG bodies recommendations on how often guidelines should be reviewed/updated
const STALENESS_THRESHOLDS: Record<string, { aging: number; stale: number; outdated: number }> = {
  CMS:  { aging: 1, stale: 2, outdated: 3 },   // CMS updates frequently
  APTA: { aging: 3, stale: 5, outdated: 7 },
  ASHA: { aging: 3, stale: 5, outdated: 7 },
  AOTA: { aging: 3, stale: 5, outdated: 7 },
  OIG:  { aging: 1, stale: 2, outdated: 3 },
  DEFAULT: { aging: 3, stale: 5, outdated: 10 }
};

export class EvidenceStalenessGuard {
  private static currentYear = new Date().getFullYear();

  static checkStaleness(entries: EvidenceEntry[]): StalenessResult[] {
    return entries.map(entry => {
      const thresholds = STALENESS_THRESHOLDS[entry.guidelineBody] ?? STALENESS_THRESHOLDS['DEFAULT'];
      const age = this.currentYear - entry.year;
      let staleness: StalenessResult['staleness'] = 'current';
      let recommendedAction = 'Evidence is current. No action required.';

      if (age >= thresholds.outdated) {
        staleness = 'outdated';
        recommendedAction = `CRITICAL: This citation is ${age} years old. Replace with the most current ${entry.guidelineBody} Clinical Practice Guideline immediately.`;
      } else if (age >= thresholds.stale) {
        staleness = 'stale';
        recommendedAction = `Citation is ${age} years old and may not reflect current ${entry.guidelineBody} standards. Verify against latest CPG version.`;
      } else if (age >= thresholds.aging) {
        staleness = 'aging';
        recommendedAction = `Citation is ${age} years old. Schedule review at next update cycle.`;
      }

      return {
        citation: entry.citation,
        yearPublished: entry.year,
        ageInYears: age,
        isStale: staleness !== 'current',
        staleness,
        recommendedAction
      };
    });
  }

  /**
   * Scans free text in a note for year-stamped references and flags old ones.
   */
  static scanTextForStaleReferences(text: string): StalenessResult[] {
    const yearPattern = /\((\d{4})\)/g;
    const results: StalenessResult[] = [];
    let match: RegExpExecArray | null;

    while ((match = yearPattern.exec(text)) !== null) {
      const year = parseInt(match[1]);
      if (year < 2000 || year > this.currentYear) continue;

      const age = this.currentYear - year;
      let staleness: StalenessResult['staleness'] = 'current';
      let recommendedAction = 'Citation appears current.';

      if (age >= 10) { staleness = 'outdated'; recommendedAction = `Reference from ${year} is critically outdated (${age} years). Replace.`; }
      else if (age >= 5) { staleness = 'stale'; recommendedAction = `Reference from ${year} may no longer represent best practice.`; }
      else if (age >= 3) { staleness = 'aging'; recommendedAction = `Reference from ${year} — verify against current CPG.`; }

      results.push({
        citation: `Year reference: (${year})`,
        yearPublished: year,
        ageInYears: age,
        isStale: staleness !== 'current',
        staleness,
        recommendedAction
      });
    }

    return results;
  }
}
