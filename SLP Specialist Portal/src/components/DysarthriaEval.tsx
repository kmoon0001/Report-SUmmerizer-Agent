import React, { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle2, FileText } from 'lucide-react';

const SYSTEMS = ['Respiration', 'Phonation', 'Resonance', 'Articulation', 'Prosody'];
const SEVERITY = ['WNL', 'Mild', 'Moderate', 'Severe', 'Profound'];

const PERCEPTUAL_MARKERS: Record<string, string[]> = {
  'Respiration': ['Reduced vital capacity', 'Short phrases', 'Audible inspiration', 'Forced expiration'],
  'Phonation': ['Breathiness', 'Harshness', 'Monopitch', 'Reduced loudness', 'Vocal tremor'],
  'Resonance': ['Hypernasality', 'Hyponasality', 'Nasal emission', 'Weak pressure consonants'],
  'Articulation': ['Imprecise consonants', 'Prolonged phonemes', 'Irregular articulatory breakdowns', 'Slow rate'],
  'Prosody': ['Monopitch', 'Monoloudness', 'Reduced stress', 'Variable rate', 'Inappropriate silences']
};

export function DysarthriaEval() {
  const [patientName, setPatientName] = useState('');
  const [ratings, setRatings] = useState<Record<string, string>>({});

  const summary = useMemo(() => {
    const impaired = Object.entries(ratings).filter(([, val]) => val !== 'WNL' && val !== '');
    if (impaired.length === 0) return "No significant dysarthria identified.";
    
    const details = impaired.map(([sys, sev]) => {
      const markers = PERCEPTUAL_MARKERS[sys as keyof typeof PERCEPTUAL_MARKERS];
      return `${sys} (${sev}): ${markers.slice(0, 2).join(', ')}`;
    }).join('; ');
    
    return `Perceptual analysis indicates dysarthria with impairments in: ${details}.`;
  }, [ratings]);

  return (
    <div className="space-y-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Perceptual Dysarthria Evaluation (PDE)</h2>
          <p className="text-slate-500">Form A: Diagnostic Impressions</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Patient Name (Use Initials)"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SYSTEMS.map(system => (
          <div key={system} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block font-bold text-slate-900 mb-2">{system}</label>
            <select
              value={ratings[system] || ''}
              onChange={(e) => setRatings(prev => ({ ...prev, [system]: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            >
              <option value="">Select Severity</option>
              {SEVERITY.map(sev => <option key={sev} value={sev}>{sev}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Diagnostic Summary
        </h4>
        <p className="text-sm text-indigo-800">{summary}</p>
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
        <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Clinical Guidance
        </h4>
        <p className="text-sm text-emerald-800">
          Ensure all physiologic systems are assessed. Per ASHA standards, dysarthria evaluation should include perceptual analysis of speech subsystems.
        </p>
      </div>
    </div>
  );
}
