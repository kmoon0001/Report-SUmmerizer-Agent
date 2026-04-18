import React, { useState, useMemo } from 'react';
import { 
  Mic, 
  ClipboardList, 
  CheckCircle2, 
  FileText, 
  Activity, 
  Zap, 
  Info,
  ChevronRight,
  History,
  Target,
  AlertCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOTOR_SPEECH_DATA } from '../utils/motor-speech-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const SYSTEMS = ['Respiration', 'Phonation', 'Resonance', 'Articulation', 'Prosody'];
const SEVERITY = ['WNL', 'Mild', 'Moderate', 'Severe', 'Profound'];

const PERCEPTUAL_MARKERS: Record<string, string[]> = {
  'Respiration': ['Reduced vital capacity', 'Short phrases', 'Audible inspiration', 'Forced expiration'],
  'Phonation': ['Breathiness', 'Harshness', 'Monopitch', 'Reduced loudness', 'Vocal tremor'],
  'Resonance': ['Hypernasality', 'Hyponasality', 'Nasal emission', 'Weak pressure consonants'],
  'Articulation': ['Imprecise consonants', 'Prolonged phonemes', 'Irregular articulatory breakdowns', 'Slow rate'],
  'Prosody': ['Monopitch', 'Monoloudness', 'Reduced stress', 'Variable rate', 'Inappropriate silences']
};

export function MotorSpeechModule({ setActiveView }: { setActiveView: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState<'dysarthria' | 'apraxia' | 'tracker' | 'compliance'>('dysarthria');
  const [isPatientView, setIsPatientView] = useState(false);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [apraxiaChecks, setApraxiaChecks] = useState<string[]>([]);
  const [intelligibility, setIntelligibility] = useState({ correct: 0, total: 0 });

  const dysarthriaSummary = useMemo(() => {
    const impaired = Object.entries(ratings).filter(([, val]) => val !== 'WNL' && val !== '');
    if (impaired.length === 0) return "No significant dysarthria identified via perceptual analysis.";
    
    const details = impaired.map(([sys, sev]) => {
      const markers = PERCEPTUAL_MARKERS[sys as keyof typeof PERCEPTUAL_MARKERS];
      return `${sys} (${sev}): ${markers.slice(0, 2).join(', ')}`;
    }).join('; ');
    
    return `Perceptual analysis indicates dysarthria with impairments in: ${details}.`;
  }, [ratings]);

  const apraxiaScore = (apraxiaChecks.length / MOTOR_SPEECH_DATA.apraxiaMarkers.length) * 100;

  const handleIntelligibility = (isCorrect: boolean) => {
    setIntelligibility(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const renderContent = () => (
    <div className="space-y-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Motor Speech Lab</h2>
            <p className="text-slate-500 font-medium">Advanced diagnostics for Dysarthria & Apraxia</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-3 px-6 py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-200 transition-all shadow-lg shadow-emerald-100 min-h-[44px]"
          >
            <Eye className="w-5 h-5" />
            Patient View
          </button>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {(['dysarthria', 'apraxia', 'tracker', 'compliance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize",
                  activeTab === tab 
                    ? "bg-white text-rose-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 bg-amber-50 rounded-[2rem] border border-amber-200 space-y-6"
          >
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-10 h-10 text-amber-600" />
              <div>
                <h3 className="text-xl font-black text-amber-900">Medicare Compliance Guide</h3>
                <p className="text-amber-700">Documentation standards for Motor Speech therapy.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">Skilled Need Justification</h4>
                <p className="text-sm text-slate-600">Document the necessity of skilled SLP intervention to improve speech intelligibility, reduce safety risks, or facilitate functional communication. Avoid "maintenance" language.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">CPT Code Selection</h4>
                <p className="text-sm text-slate-600">Ensure CPT codes (e.g., 92507, 92520) accurately reflect the skilled interventions provided. Document specific motor speech techniques used (e.g., rate control, contrastive stress).</p>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'dysarthria' && (
          <motion.div
            key="dysarthria"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-rose-500" />
                  Perceptual Subsystem Analysis
                </h3>
                <div className="grid gap-4">
                  {SYSTEMS.map(system => (
                    <div key={system} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rose-200 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-bold text-slate-900">{system}</label>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {PERCEPTUAL_MARKERS[system][0]}...
                        </span>
                      </div>
                      <select
                        value={ratings[system] || ''}
                        onChange={(e) => setRatings(prev => ({ ...prev, [system]: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Severity</option>
                        {SEVERITY.map(sev => <option key={sev} value={sev}>{sev}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-rose-900 text-white rounded-[2rem] shadow-lg shadow-rose-200">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-300" />
                    Diagnostic Summary
                  </h4>
                  <p className="text-rose-50 text-sm leading-relaxed italic">
                    "{dysarthriaSummary}"
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-widest">Clinical Impression</span>
                    <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                      Copy to Note
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Differential Diagnosis Reference
                  </h4>
                  <div className="space-y-3">
                    {MOTOR_SPEECH_DATA.dysarthriaTypes.slice(0, 3).map(type => (
                      <div key={type.type} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-900">{type.type}</span>
                          <span className="text-[10px] font-bold text-slate-500">{type.lesion}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{type.characteristics.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'apraxia' && (
          <motion.div
            key="apraxia"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Apraxia of Speech (AOS) Diagnostic Markers
                </h3>
                <div className="grid gap-4">
                  {MOTOR_SPEECH_DATA.apraxiaMarkers.map(marker => (
                    <button
                      key={marker.id}
                      onClick={() => {
                        setApraxiaChecks(prev => 
                          prev.includes(marker.id) 
                            ? prev.filter(id => id !== marker.id)
                            : [...prev, marker.id]
                        );
                      }}
                      className={cn(
                        "p-5 rounded-2xl border text-left transition-all group",
                        apraxiaChecks.includes(marker.id)
                          ? "bg-rose-50 border-rose-200 ring-1 ring-rose-200"
                          : "bg-white border-slate-200 hover:border-rose-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{marker.label}</h4>
                        {apraxiaChecks.includes(marker.id) && <CheckCircle2 className="w-5 h-5 text-rose-500" />}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{marker.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">AOS Confidence</div>
                  <div className="text-6xl font-black mb-2">{apraxiaScore.toFixed(0)}%</div>
                  <div className="text-sm text-slate-400 mb-6">Based on observed markers</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 transition-all duration-1000" 
                      style={{ width: `${apraxiaScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    DTTC Principles
                  </h4>
                  <div className="space-y-4">
                    {MOTOR_SPEECH_DATA.dttcPrinciples.map(step => (
                      <div key={step.step} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-900">{step.title}</p>
                          <p className="text-[10px] text-amber-800 opacity-80">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tracker' && (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-12 space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-slate-900">Intelligibility Tracker</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Tap 'Correct' or 'Incorrect' as the patient speaks to calculate real-time intelligibility percentage.
              </p>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-center">
                <div className="text-7xl font-black text-slate-900 mb-2">
                  {intelligibility.total > 0 
                    ? ((intelligibility.correct / intelligibility.total) * 100).toFixed(0) 
                    : '0'}%
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intelligibility</div>
              </div>
              
              <div className="h-24 w-px bg-slate-200" />

              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">{intelligibility.total}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Trials</div>
              </div>
            </div>

            <div className="flex gap-6">
              <button
                onClick={() => handleIntelligibility(false)}
                className="w-32 h-32 rounded-3xl bg-rose-50 text-rose-600 border-2 border-rose-100 flex flex-col items-center justify-center gap-2 hover:bg-rose-100 transition-all active:scale-95"
              >
                <div className="text-2xl font-black">×</div>
                <span className="text-xs font-bold uppercase">Incorrect</span>
              </button>
              
              <button
                onClick={() => handleIntelligibility(true)}
                className="w-48 h-48 rounded-[3rem] bg-emerald-600 text-white shadow-xl shadow-emerald-200 flex flex-col items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-8 h-8" />
                <span className="text-lg font-black uppercase">Correct</span>
              </button>

              <button
                onClick={() => setIntelligibility({ correct: 0, total: 0 })}
                className="w-32 h-32 rounded-3xl bg-slate-50 text-slate-400 border-2 border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
              >
                <History className="w-6 h-6" />
                <span className="text-xs font-bold uppercase">Reset</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Target className="w-4 h-4" />
          Evidence-Based Practice: ASHA Practice Portal (Motor Speech)
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            Generate Report
          </button>
          <button 
            onClick={() => setActiveView('documentation-studio')}
            className="px-6 py-2 bg-rose-100 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-200 transition-all"
          >
            Documentation Studio
          </button>
          <button 
            onClick={() => setActiveView('rag-library')}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
          >
            Clinical Library
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Motor Speech Lab" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
