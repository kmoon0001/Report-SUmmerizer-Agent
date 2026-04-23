import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientProfiles } from '../../components/PatientProfiles';
import { persistenceService } from '../../services/persistence-service';
import { documentationTrackerService } from '../../services/documentation-tracker-service';

// Mock dependencies
vi.mock('../../services/persistence-service', () => ({
  persistenceService: {
    getPatients: vi.fn(),
    savePatient: vi.fn(),
  }
}));

vi.mock('../../services/documentation-tracker-service', () => ({
  documentationTrackerService: {
    getTrackerStatus: vi.fn(),
    generateProgressNote: vi.fn(),
    generateRecertificationNote: vi.fn(),
    generateDischargeNote: vi.fn(),
  }
}));

// Mock window.alert
window.alert = vi.fn();

describe('PatientProfiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (persistenceService.getPatients as any).mockReturnValue([
      { id: '1', name: 'John Doe', diagnosis: 'Aphasia', status: 'Active', startOfCare: '2023-01-01', goals: [] },
      { id: '2', name: 'Jane Smith', diagnosis: 'Dysphagia', status: 'Discharged', startOfCare: '2023-01-01', goals: [] }
    ]);
    (documentationTrackerService.getTrackerStatus as any).mockImplementation((id: string) => {
      if (id === '1') {
        return {
          totalDailyNotes: 10,
          dailyNotesSinceLastProgress: 10,
          daysSinceStartOfCare: 30,
          isProgressNoteDue: true,
          isRecertificationDue: true
        };
      }
      return {
        totalDailyNotes: 5,
        dailyNotesSinceLastProgress: 5,
        daysSinceStartOfCare: 15,
        isProgressNoteDue: false,
        isRecertificationDue: false
      };
    });
  });

  it('renders correctly and fetches profiles', () => {
    render(<PatientProfiles />);
    
    expect(screen.getByText('Patient Profiles')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(persistenceService.getPatients).toHaveBeenCalled();
  });

  it('displays alerts for due notes', async () => {
    render(<PatientProfiles />);
    
    await waitFor(() => {
      expect(screen.getByText('Progress Note Due (10 notes)')).toBeInTheDocument();
      expect(screen.getByText('Recertification Due (30+ days)')).toBeInTheDocument();
    });
  });

  it('handles generating progress note', async () => {
    render(<PatientProfiles />);
    
    await waitFor(() => {
      const generateBtns = screen.getAllByText('Auto-Generate');
      expect(generateBtns.length).toBeGreaterThan(0);
      
      // Click the first auto-generate button (Progress Note)
      fireEvent.click(generateBtns[0]);
    });
    
    expect(documentationTrackerService.generateProgressNote).toHaveBeenCalledWith('1');
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Progress Note generated successfully!');
    });
  });

  it('handles generating discharge note', async () => {
    render(<PatientProfiles />);
    
    await waitFor(() => {
      const dcBtn = screen.getByTitle('Generate Discharge Note');
      fireEvent.click(dcBtn);
    });
    
    expect(documentationTrackerService.generateDischargeNote).toHaveBeenCalledWith('1');
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Discharge Note generated successfully!');
    });
  });
});
