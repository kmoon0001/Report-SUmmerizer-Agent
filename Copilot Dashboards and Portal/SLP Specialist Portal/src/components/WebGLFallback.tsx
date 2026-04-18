import React from 'react';
import { AlertTriangle, MonitorOff } from 'lucide-react';

interface WebGLFallbackProps {
  message?: string;
  className?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ 
  message = "WebGL is not supported or is disabled in your browser. 3D interactive features are unavailable.",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 h-full w-full ${className}`}>
      <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
        <MonitorOff className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-black text-white mb-2 tracking-tight">3D Rendering Unavailable</h3>
      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
        {message}
      </p>
      <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-bold">
        <AlertTriangle className="w-4 h-4" />
        Check your browser settings or hardware acceleration.
      </div>
    </div>
  );
};
