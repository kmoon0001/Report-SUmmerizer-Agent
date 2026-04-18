import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Cloud, Shield, Zap, Server, Wifi } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { cn } from '../lib/utils';
import { LocalAIModelManager } from './LocalAIModelManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
  onToggleAdmin: (val: boolean) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsModal({ isOpen, onClose, isAdminMode, onToggleAdmin, isDarkMode, onToggleDarkMode }: SettingsModalProps) {
  const { features, toggleFeature } = useAI();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">App Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure AI and performance preferences</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  AI Engine Configuration
                </h3>
                
                <div className="space-y-3">
                  <ToggleItem 
                    title="Advanced AI Features" 
                    description="Enable generative text, images, and deep clinical analysis."
                    active={features.advancedAI}
                    onClick={() => toggleFeature('advancedAI')}
                    icon={Zap}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                  />
                  
                  <ToggleItem 
                    title="Google Cloud Integration" 
                    description="Use Gemini Pro/Flash models for highest accuracy."
                    active={features.googleCloud}
                    onClick={() => toggleFeature('googleCloud')}
                    icon={Cloud}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                  />
                  
                  <ToggleItem 
                    title="Local LLM Fallback" 
                    description="Use on-device models when offline (limited capabilities)."
                    active={features.localLLM}
                    onClick={() => toggleFeature('localLLM')}
                    icon={Server}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                  />
                </div>

                {features.localLLM && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Offline Model Management
                    </h4>
                    <LocalAIModelManager />
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Access & Security
                </h3>
                <div className="space-y-3">
                  <ToggleItem 
                    title="Clinician Admin Mode" 
                    description="Enable administrative tools for resource management and announcements."
                    active={isAdminMode}
                    onClick={() => onToggleAdmin(!isAdminMode)}
                    icon={Shield}
                    color="text-rose-600"
                    bgColor="bg-rose-50"
                  />
                  <ToggleItem 
                    title="Dark Mode" 
                    description="Toggle between light and dark themes."
                    active={isDarkMode}
                    onClick={onToggleDarkMode}
                    icon={Zap}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Privacy & Data
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">PHI Protection Active</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        All AI processing is de-identified. No patient data is stored permanently on external servers.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ToggleItem({ title, description, active, onClick, icon: Icon, color, bgColor }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left group",
        active ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-sm" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70 hover:opacity-100"
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", active ? bgColor : "bg-slate-200 dark:bg-slate-700")}>
        <Icon className={cn("w-5 h-5", active ? color : "text-slate-400 dark:text-slate-500")} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn("font-bold text-sm", active ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400")}>{title}</h4>
          <div className={cn(
            "w-10 h-6 rounded-full relative transition-colors",
            active ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
          )}>
            <div className={cn(
              "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
              active ? "translate-x-4" : "translate-x-0"
            )} />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{description}</p>
      </div>
    </button>
  );
}
