import React, { useState } from 'react';
import { 
  MessageSquare, 
  Info, 
  ChevronRight, 
  CheckCircle2, 
  Target, 
  Zap, 
  Brain, 
  Users,
  Search,
  Plus,
  Trash2,
  FileText,
  Activity,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { VNEST_DATA, SFA_FEATURES, PACE_SCORING, APHASIA_TYPES } from '../utils/aphasia-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function AphasiaTools() {
  const [activeTool, setActiveTool] = useState<'vnest' | 'sfa' | 'pace' | 'classification'>('vnest');
  const [isPatientView, setIsPatientView] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState<keyof typeof VNEST_DATA | null>(null);
  const [sfaTarget, setSfaTarget] = useState('');
  const [sfaResponses, setSfaResponses] = useState<Record<string, string>>({});
  const [paceHistory, setPaceHistory] = useState<{ score: number; timestamp: number }[]>([]);

  const handlePaceScore = (score: number) => {
    setPaceHistory(prev => [{ score, timestamp: Date.now() }, ...prev].slice(0, 10));
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case 'vnest': return 'VNeST Protocol';
      case 'sfa': return 'SFA Lab';
      case 'pace': return 'PACE Tracker';
      case 'classification': return 'Aphasia Classification';
      default: return 'Aphasia Toolkit';
    }
  };

  const renderActiveTool = () => {
    return (
      <AnimatePresence mode="wait">
        {activeTool === 'vnest' && (
          <motion.div
            key="vnest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ... VNeST content ... */}
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <Info className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-900 mb-1">Verb Network Strengthening Treatment (VNeST)</h4>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  Targets verb retrieval and sentence production by strengthening semantic networks. Focus on agent-verb-patient triads to improve lexical retrieval in context.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Target Verb</h5>
                <div className="space-y-2">
                  {Object.keys(VNEST_DATA).map(verb => (
                    <button 
                      key={verb} 
                      onClick={() => setSelectedVerb(verb as keyof typeof VNEST_DATA)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left font-bold transition-all flex justify-between items-center group",
                        selectedVerb === verb 
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" 
                          : "border-slate-100 bg-white text-slate-600 hover:border-indigo-200"
                      )}
                    >
                      {verb}
                      <ChevronRight className={cn("w-4 h-4 transition-transform", selectedVerb === verb ? "translate-x-1" : "opacity-0")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8">
                {selectedVerb ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-black text-slate-900">Triads for "{selectedVerb}"</h4>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><Plus className="w-5 h-5 text-indigo-600" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {VNEST_DATA[selectedVerb].agents.map((agent, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Agent</span>
                              <span className="font-bold text-indigo-600">{agent}</span>
                            </div>
                            <div className="w-8 h-px bg-slate-100" />
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verb</span>
                              <span className="font-bold text-slate-900">{selectedVerb}</span>
                            </div>
                            <div className="w-8 h-px bg-slate-100" />
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Patient</span>
                              <span className="font-bold text-indigo-600">{VNEST_DATA[selectedVerb].patients[i]}</span>
                            </div>
                          </div>
                          <div className="text-[10px] font-bold text-slate-300 italic group-hover:text-slate-500 transition-colors">
                            {VNEST_DATA[selectedVerb].locations[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <Zap className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-400 font-bold">Select a verb to generate evidence-based semantic triads.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTool === 'sfa' && (
          <motion.div
            key="sfa"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* ... SFA content ... */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Object</label>
                  <input 
                    type="text"
                    value={sfaTarget}
                    onChange={(e) => setSfaTarget(e.target.value)}
                    placeholder="e.g., Apple, Hammer, Car..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SFA_FEATURES.map(feature => (
                    <div key={feature.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-indigo-600 uppercase tracking-widest">{feature.label}</h5>
                        <Target className="w-4 h-4 text-slate-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold italic">{feature.prompt}</p>
                      <input 
                        type="text"
                        value={sfaResponses[feature.id] || ''}
                        onChange={(e) => setSfaResponses(prev => ({ ...prev, [feature.id]: e.target.value }))}
                        className="w-full p-2 border-b-2 border-slate-50 focus:border-indigo-500 outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80 space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
                  <h4 className="font-bold text-xl">SFA Summary</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Completion</span>
                      <span className="font-bold">{Math.round((Object.keys(sfaResponses).length / SFA_FEATURES.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${(Object.keys(sfaResponses).length / SFA_FEATURES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSfaTarget('');
                      setSfaResponses({});
                    }}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Reset Lab
                  </button>
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Export Handout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTool === 'pace' && (
          <motion.div
            key="pace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* ... PACE content ... */}
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <Users className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-900 mb-1">Promoting Aphasics' Communicative Effectiveness (PACE)</h4>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  A multi-modal communication treatment focusing on natural conversation. Use any means (gestures, drawing, writing, speech) to convey a new message.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h4 className="text-xl font-bold text-slate-900">Scoring Console</h4>
                <div className="grid grid-cols-3 gap-4">
                  {PACE_SCORING.map(item => (
                    <button
                      key={item.score}
                      onClick={() => handlePaceScore(item.score)}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                      title={item.description}
                    >
                      <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-600">{item.score}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-slate-900">Session History</h4>
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-3">
                  {Array.isArray(paceHistory) && paceHistory.length > 0 ? paceHistory.map((entry, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-indigo-600">
                          {entry.score}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{PACE_SCORING.find(s => s.score === entry.score)?.label}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-400 font-bold italic">No scores recorded yet this session.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTool === 'classification' && (
          <motion.div
            key="classification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ... Classification content ... */}
            <h3 className="text-xl font-bold text-slate-900">Aphasia Classification Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {APHASIA_TYPES.map((type, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-indigo-900">{type.type}</h4>
                    <Brain className="w-6 h-6 text-indigo-200" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Fluency</span>
                      <span className={cn("font-bold", type.fluency.includes('Non') ? "text-rose-600" : "text-emerald-600")}>{type.fluency}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Comprehension</span>
                      <span className={cn("font-bold", type.comprehension.includes('Impaired') ? "text-rose-600" : "text-emerald-600")}>{type.comprehension}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Repetition</span>
                      <span className={cn("font-bold", type.repetition.includes('Impaired') ? "text-rose-600" : "text-emerald-600")}>{type.repetition}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lesion Location</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{type.lesion}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };


  const renderContent = () => (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Aphasia Toolkit</h2>
            <p className="text-slate-500 font-medium">Evidence-based linguistic & communicative interventions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPatientView(true)}
            className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: 'vnest', title: 'VNeST', icon: Zap },
              { id: 'sfa', title: 'SFA Lab', icon: Search },
              { id: 'pace', title: 'PACE Tracker', icon: Users },
              { id: 'classification', title: 'Classification', icon: Brain },
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap flex items-center gap-2",
                  activeTool === tool.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <tool.icon className="w-4 h-4" />
                {tool.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderActiveTool()}

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Info className="w-4 h-4" />
          Authoritative Source: ASHA Practice Portal & WAB-R / BDAE-3 Protocols
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            Generate Goals
          </button>
          <button className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-200 transition-all">
            Documentation Studio
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title={getToolTitle()} onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
