import React from 'react';
import { useSearchContext } from '../context/SearchContext';
import { Globe, AlertTriangle } from 'lucide-react';

export const SearchWarningBanner: React.FC = () => {
  const { isInternetSearchEnabled, setInternetSearchEnabled } = useSearchContext();

  return (
    <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
      isInternetSearchEnabled 
        ? 'bg-amber-50 border-amber-200 text-amber-800' 
        : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="flex items-center gap-3">
        {isInternetSearchEnabled ? (
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        ) : (
          <Globe className="w-5 h-5 text-slate-400" />
        )}
        <div>
          <h4 className={`font-semibold text-sm ${isInternetSearchEnabled ? 'text-amber-900' : 'text-slate-700'}`}>
            Internet Research Mode
          </h4>
          <p className="text-xs mt-0.5 opacity-80">
            {isInternetSearchEnabled 
              ? 'Warning: The AI may search the public internet for additional context. Ensure no PHI is included in your prompts.' 
              : 'The AI is currently restricted to its internal, authoritative knowledge base and will not search the internet.'}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => setInternetSearchEnabled(!isInternetSearchEnabled)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isInternetSearchEnabled
            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
        }`}
      >
        {isInternetSearchEnabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
};
