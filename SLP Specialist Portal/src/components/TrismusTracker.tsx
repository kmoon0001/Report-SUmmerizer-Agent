import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, Save, AlertTriangle, Info, Eye } from 'lucide-react';
import { persistenceService, TrismusLog } from '../services/persistence-service';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function TrismusTracker() {
  const [logs, setLogs] = useState<TrismusLog[]>(() => 
    persistenceService.getTrismusLogs().reverse()
  );
  const [measurement, setMeasurement] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isPatientView, setIsPatientView] = useState(false);

  const handleSave = () => {
    if (!measurement) return;
    
    const newLog: TrismusLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      measurement: parseFloat(measurement),
      notes: notes
    };

    persistenceService.saveTrismusLog(newLog);
    setLogs([newLog, ...logs]);
    setMeasurement('');
    setNotes('');
  };

  const chartData = [...logs].reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    mm: log.measurement
  }));

  const getSeverity = (mm: number) => {
    if (mm < 20) return { label: 'Severe', color: 'text-red-600 bg-red-50 border-red-200' };
    if (mm < 35) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Functional', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const renderContent = () => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
        {!isPatientView && (
          <button
            onClick={() => setIsPatientView(true)}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-bold text-sm"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
        )}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Ruler className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Trismus Tracker</h2>
            <p className="text-sm text-slate-500">Monitor interincisal opening (MIO) over time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Measurement (mm)</label>
              <div className="relative">
                <input
                  type="number"
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-lg"
                  placeholder="e.g., 35"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">MM</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm h-24 resize-none"
                placeholder="Pain level, exercises done..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!measurement}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Log Measurement
            </button>
          </div>

          <div className="md:col-span-2 h-64 bg-slate-50 rounded-xl p-4 border border-slate-100">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mm" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {/* Reference Lines for Severity */}
                  {/* Can't easily add labeled reference lines without clutter, so omitting for clean UI */}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No data logged yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">History</h3>
          {logs.length === 0 && <p className="text-sm text-slate-500 italic">No history available.</p>}
          {logs.map((log) => {
            const severity = getSeverity(log.measurement);
            return (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-mono font-bold text-lg text-slate-700 shadow-sm">
                    {log.measurement}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{new Date(log.date).toLocaleDateString()}</span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border", severity.color)}>
                        {severity.label}
                      </span>
                    </div>
                    {log.notes && <p className="text-xs text-slate-500">{log.notes}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Clinical Reference</h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Normal range is typically &gt;35mm (3 fingers). &lt;20mm indicates severe trismus requiring immediate intervention. 
            Always consult with the MD regarding contraindications for stretching (e.g., recent flap surgery, osteoradionecrosis).
          </p>
        </div>
      </div>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Trismus Tracker" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}
