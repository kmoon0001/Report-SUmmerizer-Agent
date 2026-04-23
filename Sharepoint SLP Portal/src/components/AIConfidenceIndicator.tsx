import React, { useState } from 'react';
import { Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface AIConfidenceIndicatorProps {
  score: number; // 1-5
  evidence: string;
  limitations: string[];
  sourceUrl?: string;
  onFeedback?: (feedback: 'up' | 'down') => void;
}

export function AIConfidenceIndicator({ score, evidence, limitations, sourceUrl, onFeedback }: AIConfidenceIndicatorProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (f: 'up' | 'down') => {
    setFeedback(f);
    if (onFeedback) onFeedback(f);
  };

  // Map score to color
  const getColor = (s: number) => {
    if (s >= 4.5) return 'bg-emerald-500';
    if (s >= 3.5) return 'bg-sky-500';
    if (s >= 2.5) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="group relative inline-flex items-center gap-1.5 cursor-help">
      <div className={cn("w-2 h-2 rounded-full", getColor(score))} />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {score >= 4.5 ? 'High Confidence' : score >= 3.5 ? 'Moderate Confidence' : 'Low Confidence'}
      </span>
      <Info className="w-3 h-3 text-slate-400" />

      {/* Tooltip */}
      <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-slate-900 text-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs leading-relaxed border border-white/10">
        <div className="mb-2 font-bold text-slate-300 uppercase tracking-wider text-[10px]">Evidence Base</div>
        <p className="mb-4 text-slate-100">{evidence}</p>
        
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="block mb-4 text-blue-400 hover:text-blue-300 underline">
            View Source
          </a>
        )}

        <div className="mb-2 font-bold text-slate-300 uppercase tracking-wider text-[10px]">Limitations & Disclaimers</div>
        <ul className="list-disc pl-4 space-y-1 text-slate-400">
          {limitations.map((lim, i) => <li key={i}>{lim}</li>)}
        </ul>

        {onFeedback && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Was this helpful?</span>
            <div className="flex gap-2">
              <button onClick={() => handleFeedback('up')} className={cn("p-1 rounded hover:bg-white/10", feedback === 'up' && "text-emerald-400")}>
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button onClick={() => handleFeedback('down')} className={cn("p-1 rounded hover:bg-white/10", feedback === 'down' && "text-rose-400")}>
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        
        <p className="mt-4 pt-4 border-t border-white/10 text-[10px] text-slate-500 italic">
          AI-generated guidance. Always verify against clinical judgment and facility protocols.
        </p>
      </div>
    </div>
  );
}
