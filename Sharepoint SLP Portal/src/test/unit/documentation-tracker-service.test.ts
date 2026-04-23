import { describe, it, expect, beforeEach, vi } from 'vitest';
import { documentationTrackerService } from '../../services/documentation-tracker-service';
import { persistenceService, Patient, ClinicalNote } from '../../services/persistence-service';
import { aiService } from '../../services/ai-service';

// Mock persistence service
vi.mock('../../services/persistence-service', () => {
  let patients: Patient[] = [];
  let notes: ClinicalNote[] = [];

  return {
    persistenceService: {
      getPatientById: vi.fn((id: string) => patients.find(p => p.id === id)),
      getClinicalNotes: vi.fn((id: string) => notes.filter(n => n.patientId === id)),
      saveClinicalNote: vi.fn((note: ClinicalNote) => {
        notes = [note, ...notes.filter(n => n.id !== note.id)];
      }),
      savePatient: vi.fn((patient: Patient) => {
        patients = [patient, ...patients.filter(p => p.id !== patient.id)];
      }),
      // Helpers for test setup
      __setPatients: (p: Patient[]) => { patients = p; },
      __setNotes: (n: ClinicalNote[]) => { notes = n; }
    }
  };
});

// Mock AI service
vi.mock('../../services/ai-service', () => ({
  aiService: {
    generateContent: vi.fn()
  }
}));

describe('Documentation Tracker Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (persistenceService as any).__setPatients([]);
    (persistenceService as any).__setNotes([]);
  });

  const mockPatient: Patient = {
    id: 'p1',
    name: 'Test Patient',
    dob: '1990-01-01',
    startOfCare: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
    diagnosis: 'Aphasia',
    goals: ['Goal 1'],
    status: 'Active'
  };

  it('should calculate tracker status correctly', () => {
    (persistenceService as any).__setPatients([mockPatient]);
    
    // Create 8 daily notes
    const notes: ClinicalNote[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `n${i}`,
      patientId: 'p1',
      date: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString(),
      type: 'Daily',
      content: {}
    }));
    
    (persistenceService as any).__setNotes(notes);

    const status = documentationTrackerService.getTrackerStatus('p1');
    
    expect(status).toBeDefined();
    expect(status?.totalDailyNotes).toBe(8);
    expect(status?.dailyNotesSinceLastProgress).toBe(8);
    expect(status?.isProgressNoteDue).toBe(true); // >= 7
    expect(status?.isRecertificationDue).toBe(true); // > 30 days since start of care
  });

  it('should reset progress note count after a progress note', () => {
    (persistenceService as any).__setPatients([mockPatient]);
    
    const notes: ClinicalNote[] = [
      { id: 'n1', patientId: 'p1', date: new Date(Date.now() - 10 * 86400000).toISOString(), type: 'Daily', content: {} },
      { id: 'n2', patientId: 'p1', date: new Date(Date.now() - 9 * 86400000).toISOString(), type: 'Progress', content: {} },
      { id: 'n3', patientId: 'p1', date: new Date(Date.now() - 8 * 86400000).toISOString(), type: 'Daily', content: {} },
      { id: 'n4', patientId: 'p1', date: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'Daily', content: {} },
    ];
    
    (persistenceService as any).__setNotes(notes);

    const status = documentationTrackerService.getTrackerStatus('p1');
    
    expect(status?.totalDailyNotes).toBe(3);
    expect(status?.dailyNotesSinceLastProgress).toBe(2);
    expect(status?.isProgressNoteDue).toBe(false);
  });

  it('should generate a progress note', async () => {
    (persistenceService as any).__setPatients([mockPatient]);
    
    const notes: ClinicalNote[] = [
      { id: 'n1', patientId: 'p1', date: new Date().toISOString(), type: 'Daily', content: { summary: 'Day 1' } }
    ];
    (persistenceService as any).__setNotes(notes);

    const mockResponse = JSON.stringify({
      subjective: 'S', objective: 'O', assessment: 'A', plan: 'P', summary: 'Summary'
    });
    vi.mocked(aiService.generateContent).mockResolvedValue(mockResponse);

    const result = await documentationTrackerService.generateProgressNote('p1');
    
    expect(aiService.generateContent).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.type).toBe('Progress');
    expect(result?.content.summary).toBe('Summary');
    expect(persistenceService.saveClinicalNote).toHaveBeenCalledWith(expect.objectContaining({ type: 'Progress' }));
  });

  it('should throw error if no recent notes for progress note', async () => {
    (persistenceService as any).__setPatients([mockPatient]);
    (persistenceService as any).__setNotes([
      { id: 'n1', patientId: 'p1', date: new Date().toISOString(), type: 'Progress', content: {} }
    ]);

    await expect(documentationTrackerService.generateProgressNote('p1')).rejects.toThrow(/No recent daily notes/);
  });

  it('should generate a recertification note and update goals', async () => {
    (persistenceService as any).__setPatients([mockPatient]);
    (persistenceService as any).__setNotes([
      { id: 'n1', patientId: 'p1', date: new Date().toISOString(), type: 'Daily', content: {} }
    ]);

    const mockResponse = JSON.stringify({
      subjective: 'S', objective: 'O', assessment: 'A', plan: 'P', summary: 'Summary', updatedGoals: ['New Goal']
    });
    vi.mocked(aiService.generateContent).mockResolvedValue(mockResponse);

    const result = await documentationTrackerService.generateRecertificationNote('p1');
    
    expect(result?.type).toBe('Recertification');
    expect(result?.content.updatedGoals).toEqual(['New Goal']);
    expect(persistenceService.savePatient).toHaveBeenCalledWith(expect.objectContaining({ goals: ['New Goal'] }));
  });

  it('should generate a discharge note and update patient status', async () => {
    (persistenceService as any).__setPatients([mockPatient]);
    (persistenceService as any).__setNotes([
      { id: 'n1', patientId: 'p1', date: new Date().toISOString(), type: 'Daily', content: {} }
    ]);

    const mockResponse = JSON.stringify({
      subjective: 'S', objective: 'O', assessment: 'A', plan: 'P', summary: 'Summary', recommendations: 'Recs'
    });
    vi.mocked(aiService.generateContent).mockResolvedValue(mockResponse);

    const result = await documentationTrackerService.generateDischargeNote('p1');
    
    expect(result?.type).toBe('Discharge');
    expect(persistenceService.savePatient).toHaveBeenCalledWith(expect.objectContaining({ status: 'Discharged' }));
  });
});
