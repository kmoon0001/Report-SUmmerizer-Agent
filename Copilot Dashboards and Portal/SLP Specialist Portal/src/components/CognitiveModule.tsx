import React, { useState } from 'react';
import { 
  Brain, 
  ClipboardList, 
  ShieldAlert, 
  FlaskConical, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Zap,
  RefreshCw,
  FileText,
  Target,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { COGNITIVE_MODULE_DATA } from '../utils/cognitive-module-data';
import { COGNITIVE_TASKS_DATA, getRandomTask } from '../utils/cognitive-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function CognitiveModule({ setActiveView }: { setActiveView: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState<'lab' | 'screeners' | 'safety' | 'generator' | 'compliance'>('lab');
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof COGNITIVE_TASKS_DATA>('Memory');
  const [currentTask, setCurrentTask] = useState(COGNITIVE_TASKS_DATA['Memory'][0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPatientView, setIsPatientView] = useState(false);

  const generateTask = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomTask = getRandomTask(selectedDomain);
      setCurrentTask(randomTask);
      setIsAnimating(false);
    }, 400);
  };

  const renderContent = () => (
    <div className="space-y-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-violet-50 text-violet-600 rounded-2xl">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cognitive-Communication Lab</h2>
            <p className="text-slate-500 font-medium">Executive function, memory, and safety awareness</p>
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
            {(['lab', 'screeners', 'safety', 'generator', 'compliance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-white text-violet-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab === 'lab' ? 'Executive Lab' : tab === 'generator' ? 'Task Spinner' : tab}
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
                <p className="text-amber-700">Documentation standards for Cognitive-Communication therapy.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">Skilled Need Justification</h4>
                <p className="text-sm text-slate-600">Medicare requires documentation of why professional SLP expertise is necessary. Focus on how cognitive deficits impact functional communication and safety, rather than just listing deficits.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">CPT Code Selection</h4>
                <p className="text-sm text-slate-600">Ensure CPT codes (e.g., 92523, 92507) are supported by the interventions documented. Medicare audits frequently flag mismatches between interventions and billed codes.</p>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'lab' && (
          <motion.div
            key="lab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COGNITIVE_MODULE_DATA.executiveLab.map((item) => (
                <div key={item.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 hover:border-violet-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white rounded-xl text-violet-600 shadow-sm">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      item.complexity === 'High' ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {item.complexity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.task}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-violet-900 text-white rounded-[2rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Target className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <h4 className="font-bold">Metacognitive Strategy Training</h4>
                  <p className="text-violet-200 text-sm">Focus on self-monitoring and goal-setting for functional tasks.</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-white text-violet-900 rounded-xl font-bold text-sm hover:bg-violet-50 transition-colors">
                View Protocol
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'screeners' && (
          <motion.div
            key="screeners"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {COGNITIVE_MODULE_DATA.screeners.map((screener) => (
              <div key={screener.name} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{screener.name}</h3>
                    <p className="text-sm text-slate-500">{screener.description}</p>
                  </div>
                  <ClipboardList className="w-6 h-6 text-violet-500" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Scoring Interpretation</h4>
                  <div className="grid gap-2">
                    {screener.cutoffs.map((cutoff) => (
                      <div key={cutoff.score} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-700">{cutoff.score}</span>
                        <span className="text-sm font-medium text-slate-500">{cutoff.interpretation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assessed Domains</h4>
                  <div className="flex flex-wrap gap-2">
                    {screener.domains.map(domain => (
                      <span key={domain} className="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'safety' && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COGNITIVE_MODULE_DATA.safetyScenarios.map((scenario) => (
                <div key={scenario.title} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <h4 className="font-bold text-slate-900">{scenario.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                    "{scenario.scenario}"
                  </p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Correct Response</span>
                      <p className="text-xs font-bold text-slate-900">{scenario.correctResponse}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Clinical Rationale</span>
                      <p className="text-xs text-slate-500">{scenario.rationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(COGNITIVE_TASKS_DATA) as Array<keyof typeof COGNITIVE_TASKS_DATA>).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all",
                    selectedDomain === d 
                      ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-100" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                  )}
                >
                  <span className="font-bold block">{d}</span>
                  <span className={cn("text-[10px] font-medium", selectedDomain === d ? "text-violet-200" : "text-slate-400")}>
                    {COGNITIVE_TASKS_DATA[d].length} tasks
                  </span>
                </button>
              ))}
            </div>

            <div className="relative">
              <motion.div
                key={currentTask.task}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8">
                  <Target className="w-3 h-3" />
                  {currentTask.level} Complexity
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight max-w-2xl mx-auto">
                  {currentTask.task}
                </h3>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button
                    onClick={generateTask}
                    disabled={isAnimating}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                  >
                    <RefreshCw className={cn("w-5 h-5", isAnimating && "animate-spin")} />
                    Spin New Task
                  </button>
                  <button
                    onClick={() => alert(`Handout for "${currentTask.task}":\n\n${currentTask.handout}`)}
                    className="px-10 py-5 bg-violet-100 text-violet-900 rounded-[1.5rem] font-bold hover:bg-violet-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    Generate Handout
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Info className="w-4 h-4" />
          Authoritative Source: ASHA Practice Portal (Cognitive-Communication)
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            Generate Goals
          </button>
          <button 
            onClick={() => setActiveView('documentation-studio')}
            className="px-6 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-200 transition-all"
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
        <PatientViewWrapper title="Cognitive-Communication Lab" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
