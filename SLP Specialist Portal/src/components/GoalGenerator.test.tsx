import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GoalGenerator } from './GoalGenerator';
import { aiService } from '../services/ai-service';
import { SearchProvider } from '../context/SearchContext';

// Mock the AI service
vi.mock('../services/ai-service', () => ({
  aiService: {
    generateSMARTGoals: vi.fn()
  }
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SearchProvider>{ui}</SearchProvider>);
};

describe('GoalGenerator Component', () => {
  it('renders the SMART Goal Builder header', () => {
    renderWithProvider(<GoalGenerator />);
    expect(screen.getByText('SMART Goal Builder')).toBeDefined();
  });

  it('disables the generate button when task is empty', () => {
    renderWithProvider(<GoalGenerator />);
    const input = screen.getByPlaceholderText(/e.g., thin liquids/i);
    const button = screen.getByRole('button', { name: /generate options/i });

    // Clear the default value if any
    fireEvent.change(input, { target: { value: '' } });
    expect(button).toBeDisabled();
  });

  it('enables the generate button when task is provided', () => {
    renderWithProvider(<GoalGenerator />);
    const input = screen.getByPlaceholderText(/e.g., thin liquids/i);
    const button = screen.getByRole('button', { name: /generate options/i });

    fireEvent.change(input, { target: { value: 'swallowing safety' } });
    expect(button).not.toBeDisabled();
  });

  it('calls aiService.generateSMARTGoals when button is clicked', async () => {
    const mockGoals = {
      goals: [
        {
          text: 'Test Goal',
          components: { specific: 'S', measurable: 'M', attainable: 'A', relevant: 'R', timeBound: 'T' },
          rationale: 'Reason'
        }
      ]
    };
    (aiService.generateSMARTGoals as any).mockResolvedValue(mockGoals);

    renderWithProvider(<GoalGenerator />);
    const input = screen.getByPlaceholderText(/e.g., thin liquids/i);
    const button = screen.getByRole('button', { name: /generate options/i });

    fireEvent.change(input, { target: { value: 'swallowing safety' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(aiService.generateSMARTGoals).toHaveBeenCalled();
      expect(screen.getByText('"Test Goal"')).toBeDefined();
    });
  });

  it('switches to Goal Bank tab when clicked', () => {
    renderWithProvider(<GoalGenerator />);
    const bankButton = screen.getByRole('button', { name: /goal bank/i });
    
    fireEvent.click(bankButton);
    expect(screen.getByText('Clinical Goal Bank')).toBeDefined();
  });
});
