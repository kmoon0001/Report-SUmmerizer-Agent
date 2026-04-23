import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  activeView: string;
  setActiveView: (view: string, params?: any) => void;
  viewParams: any;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarPinned: boolean;
  setIsSidebarPinned: (pinned: boolean) => void;
  autoSaveAssets: boolean;
  setAutoSaveAssets: (save: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAIPanelOpen: boolean;
  setIsAIPanelOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, _setActiveView] = useState('dashboard');
  const [viewParams, setViewParams] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [autoSaveAssets, setAutoSaveAssets] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  const setActiveView = (view: string, params?: any) => {
    _setActiveView(view);
    setViewParams(params || null);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const contextValue = React.useMemo(() => ({
      activeView, setActiveView, 
      viewParams,
      favorites, toggleFavorite, 
      isSidebarOpen, setIsSidebarOpen, 
      isSidebarPinned, setIsSidebarPinned,
      autoSaveAssets, setAutoSaveAssets,
      isCommandPaletteOpen, setIsCommandPaletteOpen,
      isAIPanelOpen, setIsAIPanelOpen
    }), [activeView, viewParams, favorites, isSidebarOpen, isSidebarPinned, autoSaveAssets, isCommandPaletteOpen, isAIPanelOpen]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
