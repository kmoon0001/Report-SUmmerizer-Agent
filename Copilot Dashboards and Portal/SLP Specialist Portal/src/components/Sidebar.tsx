import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { 
  Star, 
  Monitor, 
  Waves, 
  LayoutDashboard, 
  Activity, 
  FileText, 
  Users, 
  Library, 
  HelpCircle,
  TrendingUp,
  Utensils,
  Brain,
  Search,
  ChevronDown
} from 'lucide-react';
import { SLP_DATA } from '../data/slp-data';
import { useTheme } from '../context/ThemeContext';

const CollapsibleSection = ({ title, icon: Icon, children, isOpen, onToggle, isSidebarOpen }: { title: string, icon: any, children: React.ReactNode, isOpen: boolean, onToggle: () => void, isSidebarOpen: boolean }) => (
  <div className="space-y-1">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">{title}</span>}
      </div>
      {isSidebarOpen && <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />}
    </button>
    <AnimatePresence>
      {isOpen && isSidebarOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden pl-4 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const Sidebar = () => {
  const { 
    isSidebarOpen, setIsSidebarOpen, 
    isSidebarPinned, setIsSidebarPinned,
    activeView, setActiveView,
    setIsCommandPaletteOpen
  } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [isClinicalOpen, setIsClinicalOpen] = React.useState(false);
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const [isStudiosOpen, setIsStudiosOpen] = React.useState(false);

  const navItems: { id: string; label: string; icon: any; isExperimental?: boolean; section?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
    { id: 'patient-profiles', label: 'Patients', icon: Users, section: 'Core' },
    { id: 'progress-tracker', label: 'Progress', icon: TrendingUp, section: 'Core' },
    { id: 'rag-library', label: 'Library', icon: Library, section: 'Resources' },
    { id: 'clinical-reference', label: 'Clinical Ref', icon: FileText, section: 'Resources' },
    { id: 'help', label: 'Support', icon: HelpCircle, section: 'Resources' },
  ];

  const clinicalTopics = SLP_DATA.filter(cat => ['dysphagia', 'aphasia', 'motor-speech', 'voice', 'fluency', 'cog-comm', 'trach-vent', 'stroke-anatomy', 'anatomy-lab', 'aac-hub'].includes(cat.id));
  const slpTools = SLP_DATA.filter(cat => ['three-way-eval'].includes(cat.id));
  const studios = SLP_DATA.filter(cat => ['studios', 'asset-gallery'].includes(cat.id));

  // Group items by section
  const sections = ['Core', 'Resources'];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 72 }}
      onMouseEnter={() => !isSidebarPinned && setIsSidebarOpen(true)}
      onMouseLeave={() => !isSidebarPinned && setIsSidebarOpen(false)}
      className={cn(
        "flex-col bg-[#0A0A0B] border-r border-white/5 z-40 relative transition-all duration-300 ease-in-out",
        isSidebarOpen ? "absolute inset-y-0 left-0 flex lg:relative" : "hidden lg:flex"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.button 
              key="logo-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg border border-white/10">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs tracking-tight leading-none text-slate-100">PACIFIC COAST</span>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">SLP Portal</span>
              </div>
            </motion.button>
          ) : (
            <motion.button 
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveView('dashboard')}
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center mx-auto shadow-lg border border-white/10 hover:opacity-80 transition-opacity"
            >
              <Waves className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarPinned(!isSidebarPinned)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isSidebarPinned ? "text-blue-400 bg-blue-500/10 border border-blue-500/20" : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <Star className={cn("w-3.5 h-3.5", isSidebarPinned && "fill-current")} />
          </button>
        )}
      </div>

      <div className="p-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white group",
            !isSidebarOpen && "justify-center"
          )}
        >
          <Search className="w-5 h-5" />
          {isSidebarOpen && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-widest">Search...</span>
              <span className="text-[8px] font-black px-1.5 py-0.5 bg-white/10 rounded-md border border-white/10">⌘K</span>
            </div>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {sections.map(section => (
          <div key={section} className="space-y-1">
            {isSidebarOpen && (
              <div className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                {section}
              </div>
            )}
            {navItems.filter(item => item.section === section).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                  activeView === item.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 hover:translate-x-1"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  activeView === item.id ? "text-white" : "text-slate-500"
                )} />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}

        <CollapsibleSection 
          title="Clinical Topics" 
          icon={Brain} 
          isOpen={isClinicalOpen} 
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsClinicalOpen(!isClinicalOpen)}
        >
          {clinicalTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveView(topic.id)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest",
                activeView === topic.id 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <topic.icon className="w-4 h-4" />
              {topic.title}
            </button>
          ))}
        </CollapsibleSection>

        <CollapsibleSection 
          title="SLP Tools" 
          icon={Activity} 
          isOpen={isToolsOpen} 
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsToolsOpen(!isToolsOpen)}
        >
          {slpTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveView(tool.id)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest",
                activeView === tool.id 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <tool.icon className="w-4 h-4" />
              {tool.title}
            </button>
          ))}
        </CollapsibleSection>

        <CollapsibleSection 
          title="Studios" 
          icon={Monitor} 
          isOpen={isStudiosOpen} 
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsStudiosOpen(!isStudiosOpen)}
        >
          {studios.map(studio => (
            <button
              key={studio.id}
              onClick={() => setActiveView(studio.id)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest",
                activeView === studio.id 
                  ? "bg-violet-600/20 text-violet-400" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <studio.icon className="w-4 h-4" />
              {studio.title}
            </button>
          ))}
        </CollapsibleSection>
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
        >
          <Monitor className="w-4 h-4" />
          {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </motion.aside>
  );
};
