import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  FileText, 
  Activity, 
  Target, 
  Users, 
  Library, 
  Settings,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { SLP_DATA } from '../data/slp-data';
import { cn } from '../lib/utils';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveView } = useDashboard();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    { id: 'dashboard', title: 'Dashboard', icon: Command, category: 'Navigation' },
    { id: 'therapy-studio', title: 'Therapy Studio', icon: Activity, category: 'Tools' },
    { id: 'documentation-studio', title: 'Documentation Studio', icon: FileText, category: 'Tools' },
    { id: 'handout-maker', title: 'Handout Maker', icon: Sparkles, category: 'Tools' },
    { id: 'patient-profiles', title: 'Patient Profiles', icon: Users, category: 'Management' },
    { id: 'rag-library', title: 'Clinical Library', icon: Library, category: 'Resources' },
    { id: 'help', title: 'Help & Support', icon: HelpCircle, category: 'System' },
    ...SLP_DATA.filter(cat => cat.id !== 'studios').map(cat => ({
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      category: 'Clinical Domains'
    }))
  ];

  const filteredItems = query === '' 
    ? items.slice(0, 8) 
    : items.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 100);
    }
  }, [isCommandPaletteOpen]);

  const handleSelect = (id: string) => {
    setActiveView(id);
    setIsCommandPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].id);
      }
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="relative flex items-center border-b border-white/5 p-6">
              <Search className="w-6 h-6 text-slate-400 ml-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, clinical domains, or documentation..."
                className="w-full bg-transparent border-none outline-none px-4 py-2 text-xl text-white placeholder:text-slate-500 font-medium"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {filteredItems.length > 0 ? (
                <div className="space-y-2">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={`${item.id}-${idx}`}
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                        idx === selectedIndex 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        idx === selectedIndex ? "bg-white/20" : "bg-slate-800 text-slate-400"
                      )}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-base">{item.title}</div>
                        <div className={cn(
                          "text-[10px] font-black uppercase tracking-widest mt-0.5",
                          idx === selectedIndex ? "text-blue-100" : "text-slate-500"
                        )}>
                          {item.category}
                        </div>
                      </div>
                      <ArrowRight className={cn(
                        "w-5 h-5 transition-all",
                        idx === selectedIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      )} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-medium">No results found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="bg-slate-950/50 p-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-slate-800 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400">↑↓</div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-slate-800 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400">ENTER</div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Search Enabled</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
