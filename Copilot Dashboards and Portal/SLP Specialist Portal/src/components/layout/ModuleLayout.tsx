import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PatientViewWrapper } from '../layout/PatientViewWrapper';

interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  isPatientView?: boolean;
  setIsPatientView?: (view: boolean) => void;
}

export function ModuleLayout({
  title,
  subtitle,
  onBack,
  children,
  headerContent,
  isPatientView,
  setIsPatientView
}: ModuleLayoutProps) {
  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-inner relative">
      {/* Header */}
      <div className="p-8 pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 text-sm font-medium mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {headerContent}
          {setIsPatientView && (
            <button
              onClick={() => setIsPatientView(true)}
              className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
              title="Patient View"
            >
              <Eye className="w-6 h-6 text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title={title} onExit={() => setIsPatientView?.(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
