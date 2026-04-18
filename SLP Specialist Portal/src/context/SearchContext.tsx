import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isInternetSearchEnabled: boolean;
  setInternetSearchEnabled: (enabled: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInternetSearchEnabled, setInternetSearchEnabled] = useState(false);

  return (
    <SearchContext.Provider value={{ isInternetSearchEnabled, setInternetSearchEnabled }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
