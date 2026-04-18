import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SafetyIssue {
  id: string;
  severity: 'warning' | 'critical';
  message: string;
}

interface ClinicalSafetyContextType {
  issues: SafetyIssue[];
  addIssue: (issue: SafetyIssue) => void;
  removeIssue: (id: string) => void;
  clearIssues: () => void;
}

const ClinicalSafetyContext = createContext<ClinicalSafetyContextType | undefined>(undefined);

export function ClinicalSafetyProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<SafetyIssue[]>([]);

  const addIssue = (issue: SafetyIssue) => {
    setIssues(prev => {
      if (prev.find(i => i.id === issue.id)) return prev;
      return [...prev, issue];
    });
  };

  const removeIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  const clearIssues = () => setIssues([]);

  return (
    <ClinicalSafetyContext.Provider value={{ issues, addIssue, removeIssue, clearIssues }}>
      {children}
    </ClinicalSafetyContext.Provider>
  );
}

export function useClinicalSafety() {
  const context = useContext(ClinicalSafetyContext);
  if (!context) {
    throw new Error('useClinicalSafety must be used within a ClinicalSafetyProvider');
  }
  return context;
}
