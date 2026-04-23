import React, { useState, useMemo } from 'react';
import { 
  Mic, 
  CheckCircle2, 
  Info, 
  Activity, 
  ClipboardList, 
  AlertCircle, 
  BarChart3,
  Zap,
  ChevronRight,
  FileText,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { VOICE_DATA } from '../utils/voice-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const VOICE_PROTOCOLS = [
  {
    id: 'hygiene',
    title: 'Vocal Hygiene Program',
    description: 'Guidelines for maintaining vocal health and reducing irritants.',
    tips: [
      'Hydration: 64oz water/day (systemic hydration)',
      'Avoid throat clearing: Use "silent cough" or swallow instead',
      'Reduce vocal load: Implement "vocal naps" (10-15 mins of silence)',
      'Avoid irritants: Limit smoke, caffeine, and alcohol'
    ]
  },
  {
    id: 'resonant',
    title: 'Resonant Voice Therapy (RVT)',
    description: 'Focuses on forward focus and minimal impact stress.',
    tips: [
      'Humming exercises: Focus on nasal vibration',
      'Forward focus: /m/ /n/ sounds with easy onset',
      'Easy onset phonation: /h/ + vowel combinations',
      'Stretching: Gentle pitch glides'
    ]
  },
  {
    id: 'vfe',
    title: 'Vocal Function Exercises (VFE)',
    description: 'Systematic exercises to improve laryngeal muscle strength.',
    tips: [
      'Warm-up: Sustained /i/ at comfortable pitch',
      'Stretching: Pitch glides (low to high)',
      'Contracting: Pitch glides (high to low)',
      'Power: Sustained /o/ at different pitches'
    ]
  },
  {
    id: 'lsvt',
    title: 'LSVT Loud (Principles)',
    description: 'Focuses on increasing vocal loudness and effort.',
    tips: [
      'Maximum duration sustained phonation: /a/',
      'Maximum fundamental frequency range: Pitch glides',
      'Maximum functional speech loudness: Functional phrases',
      'Hierarchical speech loudness: Words to conversation'
    ]
  }
];

export function VoiceModule() {
  const [activeTab, setActiveTab] = useState<'protocols' | 'assessment' | 'pathology' | 'acoustics' | 'compliance'>('protocols');
  const [activeProtocol, setActiveProtocol] = useState(VOICE_PROTOCOLS[0]);
  const [capeVRatings, setCapeVRatings] = useState<Record<string, number>>({});
  const [vhiScores, setVhiScores] = useState<Record<number, number>>({});
  const [isPatientView, setIsPatientView] = useState(false);

  const vhiTotal = useMemo(() => {
    return Object.values(vhiScores).reduce((acc, val) => acc + val, 0);
  }, [vhiScores]);

  const vhiInterpretation = useMemo(() => {
    if (vhiTotal <= 10) return "Low (Minimal handicap)";
    if (vhiTotal <= 20) return "Moderate (Significant handicap)";
    return "High (Severe handicap)";
  }, [vhiTotal]);

  const renderContent = () => (
    <div className="space-y-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Voice Lab</h2>
            <p className="text-slate-500 font-medium">Advanced diagnostics & rehabilitation</p>
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
            {(['protocols', 'assessment', 'pathology', 'acoustics', 'compliance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap",
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
                <p className="text-amber-700">Documentation standards for Voice therapy.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">Skilled Need Justification</h4>
                <p className="text-sm text-slate-600">Clearly document how voice impairment impacts functional communication and safety. Justify why professional SLP intervention is required to improve vocal function, focusing on functional outcomes.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">CPT Code Selection</h4>
                <p className="text-sm text-slate-600">Ensure CPT codes (e.g., 92507, 92520) are supported by documented vocal therapy techniques. Medicare audits frequently review the consistency between the documented intervention and the billed code.</p>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'protocols' && (
          <motion.div
            key="protocols"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {VOICE_PROTOCOLS.map(protocol => (
                <button
                  key={protocol.id}
                  onClick={() => setActiveProtocol(protocol)}
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all",
                    activeProtocol.id === protocol.id 
                      ? "bg-rose-50 border-rose-200 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-rose-100"
                  )}
                >
                  <h4 className="font-bold text-slate-900 mb-2">{protocol.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{protocol.description}</p>
                </button>
              ))}
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mic className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6">{activeProtocol.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  {Array.isArray(activeProtocol.tips) && activeProtocol.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-6 bg-rose-900 text-white rounded-[2rem] shadow-lg">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-rose-300" />
                    Clinical Implementation
                  </h4>
                  <p className="text-rose-100 text-sm leading-relaxed mb-6">
                    This protocol should be implemented following a thorough ENT visualization and perceptual voice assessment. Focus on patient self-perception and effort levels.
                  </p>
                  <button className="w-full py-3 bg-white text-rose-900 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors">
                    Generate Patient Handout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-rose-500" />
                CAPE-V Perceptual Analysis
              </h3>
              <div className="space-y-6">
                {VOICE_DATA.capeV.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">{item.label}</label>
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        {capeVRatings[item.id] || 0}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={capeVRatings[item.id] || 0}
                      onChange={(e) => setCapeVRatings(prev => ({ ...prev, [item.id]: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <p className="text-[10px] text-slate-400 italic">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-slate-900 text-white rounded-[2.5rem]">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400" />
                  VHI-10 Calculator
                </h3>
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {VOICE_DATA.vhi10.map((q) => (
                    <div key={q.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-300 mb-3">{q.text}</p>
                      <div className="flex justify-between gap-2">
                        {[0, 1, 2, 3, 4].map(val => (
                          <button
                            key={val}
                            onClick={() => setVhiScores(prev => ({ ...prev, [q.id]: val }))}
                            className={cn(
                              "flex-1 py-1 rounded text-[10px] font-bold transition-all",
                              vhiScores[q.id] === val 
                                ? "bg-rose-500 text-white" 
                                : "bg-white/10 text-slate-400 hover:bg-white/20"
                            )}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total VHI-10 Score</div>
                    <div className="text-3xl font-black text-rose-400">{vhiTotal} / 40</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interpretation</div>
                    <div className="text-sm font-bold text-white">{vhiInterpretation}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pathology' && (
          <motion.div
            key="pathology"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {VOICE_DATA.pathologies.map((path) => (
              <div key={path.name} className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:border-rose-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{path.name}</h4>
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {path.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Etiology</span>
                    <p className="text-xs font-bold text-slate-700">{path.etiology}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">Treatment</span>
                    <p className="text-xs font-bold text-slate-700">{path.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'acoustics' && (
          <motion.div
            key="acoustics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-rose-500" />
                  Acoustic Normative Data
                </h3>
                <div className="grid gap-4">
                  {VOICE_DATA.acousticNorms.map((norm) => (
                    <div key={norm.measure} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900">{norm.measure}</h4>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-rose-600">
                          {norm.norm || `${norm.male} (M) / ${norm.female} (F)`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{norm.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-indigo-900 text-white rounded-[2.5rem] flex flex-col justify-center text-center space-y-6">
                <div className="p-4 bg-white/10 rounded-2xl w-fit mx-auto">
                  <Activity className="w-12 h-12 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-black">Instrumental Assessment</h3>
                <p className="text-indigo-200 text-sm leading-relaxed max-w-sm mx-auto">
                  Acoustic and aerodynamic measures provide objective data to supplement perceptual assessment. Use Praat or similar software for analysis.
                </p>
                <div className="pt-6 flex gap-4 justify-center">
                  <button className="px-6 py-2 bg-white text-indigo-900 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
                    View Praat Guide
                  </button>
                  <button className="px-6 py-2 bg-indigo-800 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                    Acoustic Lab
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Info className="w-4 h-4" />
          Authoritative Source: ASHA Practice Portal (Voice Disorders)
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            Generate Report
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'documentation-studio' }))}
            className="px-6 py-2 bg-rose-100 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-200 transition-all"
          >
            Documentation Studio
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'rag-library' }))}
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
        <PatientViewWrapper title="Voice Lab" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
