import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PatientViewWrapperProps {
  children: React.ReactNode;
  title: string;
  onExit: () => void;
}

export const PatientViewWrapper: React.FC<PatientViewWrapperProps> = ({ children, title, onExit }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 mt-2 text-lg">Select a resource to view or download.</p>
          </div>
          <button
            onClick={onExit}
            className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl text-lg font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            Exit Patient View
          </button>
        </header>
        <div className="text-lg md:text-xl text-slate-700 leading-relaxed bg-slate-50 p-6 md:p-8 rounded-3xl">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
