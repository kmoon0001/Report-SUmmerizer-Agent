import React from 'react';

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  return (
    <div className="hidden print:block border-b-2 border-slate-900 pb-6 mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{title}</h1>
          {subtitle && <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-slate-900 tracking-tighter">SLP<span className="text-slate-400">NEXUS</span></div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Clinical Resources</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-16">Patient</span>
          <div className="flex-1 h-4"></div>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-16">Date</span>
          <div className="flex-1 text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-16">Clinician</span>
          <div className="flex-1 h-4"></div>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-16">Facility</span>
          <div className="flex-1 h-4"></div>
        </div>
      </div>
    </div>
  );
}
