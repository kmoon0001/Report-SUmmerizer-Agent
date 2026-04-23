import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { aiService } from '../services/ai-service';

interface AIContextType {
  isAIActive: boolean;
  toggleAI: () => void;
  context: string;
  setContext: (ctx: string) => void;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  addToHistory: (role: 'user' | 'assistant', content: string) => void;
  suggestions: string[];
  setSuggestions: (s: string[]) => void;
  
  // Feature Flags
  features: {
    advancedAI: boolean;
    googleCloud: boolean;
    microsoftCopilot: boolean;
    localLLM: boolean;
  };
  toggleFeature: (feature: keyof AIContextType['features']) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [isAIActive, setIsAIActive] = useState(false);
  const [context, setContext] = useState('dashboard');
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [features, setFeatures] = useState({
    advancedAI: true,
    googleCloud: true,
    microsoftCopilot: false,
    localLLM: false
  });

  const toggleAI = () => setIsAIActive(!isAIActive);
  const addToHistory = (role: 'user' | 'assistant', content: string) => setHistory(prev => [...prev, { role, content }]);
  
  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  useEffect(() => {
    aiService.updateConfig(features);
  }, [features]);

  return (
    <AIContext.Provider value={{ 
      isAIActive, toggleAI, 
      context, setContext, 
      history, addToHistory,
      suggestions, setSuggestions,
      features, toggleFeature 
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
