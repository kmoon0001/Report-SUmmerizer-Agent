import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Wifi, WifiOff, HardDrive, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import { useClinicalSafety } from '../context/ClinicalSafetyContext';
import { useSystemStatus } from '../hooks/useSystemStatus';

interface ClinicalSafetyStatusBarProps {
  isSafeMode?: boolean;
}

export function ClinicalSafetyStatusBar({ isSafeMode }: ClinicalSafetyStatusBarProps) {
  const { issues } = useClinicalSafety();
  const { isOnline, localModelLoaded, storageUsage } = useSystemStatus();
  
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');

  return (
    <div className={cn(
      "h-8 w-full text-slate-400 border-t flex items-center justify-between px-6 shrink-0 z-50 transition-colors duration-500",
      criticalIssues.length > 0 ? "bg-rose-950 border-rose-900" : 
      isSafeMode ? "bg-indigo-950 border-indigo-900" : "bg-slate-900 border-slate-800"
    )}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className={cn("w-3 h-3", criticalIssues.length > 0 ? "text-rose-400" : isSafeMode ? "text-indigo-400" : "text-emerald-500")} />
          <span className={cn("text-[9px] font-black uppercase tracking-widest", criticalIssues.length > 0 ? "text-rose-200" : isSafeMode ? "text-indigo-200" : "text-white")}>
            {criticalIssues.length > 0 ? 'Clinical Safety Alert' : isSafeMode ? 'HIPAA Safe Mode Active' : 'Clinical Safety'}
          </span>
        </div>
        <div className={cn("h-3 w-px", criticalIssues.length > 0 ? "bg-rose-800" : isSafeMode ? "bg-indigo-800" : "bg-slate-700")} />
        
        {criticalIssues.length > 0 ? (
          <div className="flex items-center gap-2 text-rose-200 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">{criticalIssues[0].message}</span>
          </div>
        ) : warnings.length > 0 ? (
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">{warnings[0].message}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-widest">NIST</span>
              <div className={cn("w-1 h-1 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]", isSafeMode ? "bg-indigo-400" : "bg-emerald-500")} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-widest">FDA</span>
              <div className={cn("w-1 h-1 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]", isSafeMode ? "bg-indigo-400" : "bg-emerald-500")} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-widest">ONC</span>
              <div className={cn("w-1 h-1 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]", isSafeMode ? "bg-indigo-400" : "bg-emerald-500")} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        {/* System Status Indicators */}
        <div className="hidden md:flex items-center gap-4 text-[9px] font-medium text-slate-500 border-r border-slate-800 pr-6 mr-2">
          <div className="flex items-center gap-1.5" title={isOnline ? "Cloud AI Online" : "Cloud AI Offline"}>
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-rose-500" />}
            <span className={isOnline ? "text-slate-400" : "text-rose-400"}>Cloud AI</span>
          </div>
          
          <div className="flex items-center gap-1.5" title={localModelLoaded ? "Local AI Ready" : "Local AI Inactive"}>
            <Cpu className={cn("w-3 h-3", localModelLoaded ? "text-emerald-500" : "text-slate-600")} />
            <span className={localModelLoaded ? "text-slate-400" : "text-slate-600"}>Local AI</span>
          </div>

          {storageUsage !== null && (
            <div className="flex items-center gap-1.5" title="Local Storage Usage">
              <HardDrive className="w-3 h-3 text-slate-600" />
              <span className="text-slate-500">{storageUsage}MB</span>
            </div>
          )}
        </div>

        {isSafeMode && (
          <div className="flex items-center gap-2 text-indigo-300 animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">Zero-PHI Environment</span>
          </div>
        )}
        <div className="text-[9px] font-medium text-slate-500 hidden md:block">
          Pacific Coast Therapy Portal v3.1 • {isSafeMode ? 'De-identified Session' : 'HIPAA Compliant Environment'}
        </div>
      </div>
    </div>
  );
}
