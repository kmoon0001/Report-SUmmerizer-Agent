import { describe, it, expect } from 'vitest';
import { SectionGGMapper, SECTION_GG_SELF_CARE_ITEMS, SECTION_GG_MOBILITY_ITEMS } from '../../services/SectionGGMapper';
import type { SOAPNote } from '../../types/documentation-compliance';

describe('SectionGGMapper', () => {

  describe('mapToSectionGG', () => {
    it('should calculate functional gain correctly', () => {
      const admission: Record<string, any> = { 'GG0130A': 2, 'GG0130F': 2, 'GG0170D': 2 };
      const discharge: Record<string, any> = { 'GG0130A': 4, 'GG0130F': 5, 'GG0170D': 4 };

      const report = SectionGGMapper.mapToSectionGG(admission, discharge);
      expect(report.overallFunctionalGain).toBeGreaterThan(0);
      expect(report.qualityMeasureFlag).toBe(false);
    });

    it('should flag functional DECLINE as a Quality Measure concern', () => {
      const admission: Record<string, any> = { 'GG0130A': 5, 'GG0130F': 5, 'GG0170D': 5 };
      const discharge: Record<string, any> = { 'GG0130A': 3, 'GG0130F': 3, 'GG0170D': 3 };

      const report = SectionGGMapper.mapToSectionGG(admission, discharge);
      expect(report.qualityMeasureFlag).toBe(true);
      expect(report.qualityMeasureFlagReason).toMatch(/decline/i);
    });

    it('should flag SNF QRP non-compliance when < 5 items scored', () => {
      const admission: Record<string, any> = { 'GG0130A': 3 };
      const discharge: Record<string, any> = { 'GG0130A': 5 };

      const report = SectionGGMapper.mapToSectionGG(admission, discharge);
      expect(report.snfQrpCompliant).toBe(false);
    });

    it('should return SHAP values for each scored item', () => {
      const admission: Record<string, any> = { 'GG0130A': 2, 'GG0170D': 2 };
      const discharge: Record<string, any> = { 'GG0130A': 5, 'GG0170D': 5 };

      const report = SectionGGMapper.mapToSectionGG(admission, discharge);
      expect(Object.keys(report.shapValues).length).toBeGreaterThan(0);
      const values = Object.values(report.shapValues);
      values.forEach(v => expect(typeof v).toBe('number'));
    });
  });

  describe('detectDocumentationCodeConflict', () => {
    it('should detect conflict when note says "independent" but GG code says Dependent', () => {
      const note: any = {
        objective: { observation: 'Patient is independent with ambulation.' }
      };
      const ggCodes: Record<string, any> = { 'GG0170I': 1 }; // 1 = Dependent — conflicts with "independent" note

      const conflicts = SectionGGMapper.detectDocumentationCodeConflict(note, ggCodes);
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0]).toMatch(/GG0170I/);
    });

    it('should NOT flag conflict when documentation and code are consistent', () => {
      const note: any = {
        objective: { observation: 'Patient requires minimal assist for transfers.' }
      };
      const ggCodes: Record<string, any> = { 'GG0170E': 4 }; // 4 = Setup/supervision — consistent with "min a"

      const conflicts = SectionGGMapper.detectDocumentationCodeConflict(note, ggCodes);
      expect(conflicts.length).toBe(0);
    });
  });
});
