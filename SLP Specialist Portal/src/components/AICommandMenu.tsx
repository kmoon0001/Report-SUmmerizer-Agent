import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Sparkles, ClipboardList, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SLP_DATA } from "../data/slp-data";

export function AICommandMenu({ 
  open, 
  setOpen,
  onSelectCategory 
}: { 
  open: boolean; 
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onSelectCategory: (id: string) => void;
}) {
  const [value, setValue] = useState("");

  // Toggle with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-slate-100 px-4">
                <Sparkles className="w-5 h-5 text-violet-500 mr-3" />
                <Command.Input 
                  value={value}
                  onValueChange={setValue}
                  placeholder="Ask AI or search resources (e.g., 'dysphagia exercises', 'billing codes')..."
                  className="w-full py-5 text-lg outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-slate-500">
                  <p>No results found.</p>
                  {value.length > 5 && (
                    <button className="mt-4 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors">
                      Ask AI Assistant about "{value}"
                    </button>
                  )}
                </Command.Empty>

                {value === "" && (
                  <div className="px-4 py-3 mb-2 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                      <ShieldAlert className="w-3 h-3" />
                      AI Compliance Notice
                    </h4>
                    <p className="text-xs text-blue-700/80 leading-relaxed">
                      This AI assistant provides information retrieval and administrative support. 
                      It does <strong>not</strong> provide clinical diagnoses or treatment plans. 
                      Always verify with clinical judgment and official CMS/ASHA guidelines.
                    </p>
                  </div>
                )}

                <Command.Group heading="Smart Suggestions" className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-2">
                  <Command.Item onSelect={() => {}} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Draft Daily Note</p>
                      <p className="text-xs text-slate-500">Based on recent activity</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Resources" className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-2 mt-2">
                  {SLP_DATA.map((category) => (
                    <Command.Item 
                      key={category.id} 
                      onSelect={() => {
                        onSelectCategory(category.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-700"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                        <category.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{category.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
