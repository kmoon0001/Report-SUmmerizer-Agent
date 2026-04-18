import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { parseFetchResponse } from '../utils/json-parser';

export function HealthMonitor() {
  const [status, setStatus] = useState<'ok' | 'degraded' | 'error'>('ok');
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await parseFetchResponse(response);
      setDetails(data);
      
      // Basic health logic
      const allServicesOk = Object.values(data.services).every(s => s === 'configured' || s === 'ready' || s === 'active');
      setStatus(allServicesOk ? 'ok' : 'degraded');
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (status === 'ok') return null; // Hide if everything is fine, or show a subtle indicator

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border z-[100] ${
      status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <div className="flex items-center gap-3">
        {status === 'error' ? <AlertTriangle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5 animate-spin" />}
        <div>
          <h4 className="font-bold text-sm">System {status === 'error' ? 'Error' : 'Degraded'}</h4>
          <p className="text-xs opacity-80">Check system status in settings.</p>
        </div>
      </div>
    </div>
  );
}
