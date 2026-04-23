import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "../Sidebar";
import { AIAssistant } from "../AIAssistant";
import { CommandPalette } from "../CommandPalette";
import { useDashboard } from "../../context/DashboardContext";
import { MessageSquare, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const { isAIPanelOpen, setIsAIPanelOpen } = useDashboard();

  return (
    <div className="h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 flex flex-col overflow-hidden">
      <CommandPalette />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-950/50">
          {children}
        </main>
        
        {/* Collapsible AI Assistant Sidebar */}
        <AnimatePresence mode="popLayout">
          {isAIPanelOpen ? (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="hidden xl:flex w-[400px] flex-col border-l border-white/5 bg-slate-950/50 relative"
            >
              <button 
                onClick={() => setIsAIPanelOpen(false)}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#0A0A0B] border border-white/5 border-r-0 rounded-l-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors z-50 group"
                title="Collapse AI Assistant"
              >
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <AIAssistant isEmbedded={true} />
            </motion.div>
          ) : (
            <motion.button
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              onClick={() => setIsAIPanelOpen(true)}
              className="hidden xl:flex absolute right-6 bottom-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10 text-white hover:scale-110 active:scale-95 transition-all z-50"
              title="Expand AI Assistant"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
