import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { useAI } from '../context/AIContext';

export function FirstRunModal() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('slp_has_seen_onboarding');
  });
  const { toggleFeature } = useAI();

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('slp_has_seen_onboarding', 'true');
  };

  const handleEnableLocalAI = () => {
    toggleFeature('localLLM');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side: Visual */}
              <div className="bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px] -ml-10 -mb-10" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to Pacific Coast SLP Portal</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The next generation of clinical intelligence for Speech-Language Pathologists.
                  </p>
                </div>

                <div className="relative z-10 mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>HIPAA-Compliant & Private</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-blue-200">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <span>AI-Powered Documentation</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="p-8 flex flex-col justify-between bg-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy First</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      This application operates in a <strong>Zero-Retention</strong> environment. No patient data is stored on our servers. All processing happens locally or via secure, stateless AI calls.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">New: Local AI</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      You can now run AI models directly on your device for offline privacy. Enable this feature now? (Requires ~2GB model download in Settings)
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleEnableLocalAI}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    Enable Feature <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
