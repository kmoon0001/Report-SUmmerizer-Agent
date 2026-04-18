import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Info, 
  Stethoscope,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../context/AIContext';
import { aiService } from '../services/ai-service';
import ReactMarkdown from 'react-markdown';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

interface ExamStep {
  nerve?: string;
  name: string;
  procedure: string;
  normal: string;
  abnormal: string;
  clinicalSignificance: string;
  image?: string;
}

const CRANIAL_NERVE_EXAM: ExamStep[] = [
  {
    nerve: 'CN V (Trigeminal)',
    name: 'Mastication & Sensation',
    procedure: 'Palpate masseter and temporalis while patient clenches teeth. Test light touch on face.',
    normal: 'Strong, symmetrical contraction. Sensation intact.',
    abnormal: 'Weakness, asymmetry, or sensory loss.',
    clinicalSignificance: 'Affects bolus mastication and oral sensitivity for residue.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Trigeminal_nerve.svg/800px-Trigeminal_nerve.svg.png'
  },
  {
    nerve: 'CN VII (Facial)',
    name: 'Facial Expression',
    procedure: 'Ask patient to smile, pucker, puff cheeks, and close eyes tightly.',
    normal: 'Symmetrical movement, good lip seal, no air escape.',
    abnormal: 'Drooping, asymmetry, poor lip seal (bolus escape).',
    clinicalSignificance: 'Crucial for oral containment and labial pressure during swallow.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Facial_nerve.svg/800px-Facial_nerve.svg.png'
  },
  {
    nerve: 'CN IX & X (Glossopharyngeal & Vagus)',
    name: 'Palatal Elevation & Phonation',
    procedure: 'Observe palate at rest and during "ah". Assess voice quality and cough.',
    normal: 'Symmetrical elevation. Clear voice. Strong cough.',
    abnormal: 'Uvula deviation, weak elevation, breathy/hoarse voice, weak cough.',
    clinicalSignificance: 'Risk for nasal regurgitation, poor airway protection, and pharyngeal residue.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800'
  },
  {
    nerve: 'CN XI (Accessory)',
    name: 'Neck & Shoulder',
    procedure: 'Ask patient to shrug shoulders and turn head against resistance.',
    normal: 'Symmetrical strength.',
    abnormal: 'Weakness or asymmetry.',
    clinicalSignificance: 'Impacts posture and head positioning for safe swallowing.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Accessory_nerve.svg/800px-Accessory_nerve.svg.png'
  },
  {
    nerve: 'CN XII (Hypoglossal)',
    name: 'Tongue Movement',
    procedure: 'Observe tongue at rest, protrusion, and lateralization.',
    normal: 'Symmetrical, no fasciculations, good range of motion.',
    abnormal: 'Deviation to weak side, fasciculations, limited ROM.',
    clinicalSignificance: 'Essential for bolus formation, transport, and pharyngeal clearance.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hypoglossal_nerve.svg/800px-Hypoglossal_nerve.svg.png'
  }
];

const ORAL_MECH_EXAM = [
  {
    name: 'Lips',
    procedure: 'Observe at rest, retraction, protrusion, and seal.',
    findings: 'Symmetry, strength, range of motion.',
    impact: 'Oral containment and suction.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Facial_nerve.svg/800px-Facial_nerve.svg.png'
  },
  {
    name: 'Tongue',
    procedure: 'Observe size, surface, rest position, and strength.',
    findings: 'Atrophy, fasciculations, strength against resistance.',
    impact: 'Bolus manipulation and propulsion.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hypoglossal_nerve.svg/800px-Hypoglossal_nerve.svg.png'
  },
  {
    name: 'Hard & Soft Palate',
    procedure: 'Visual inspection of arch, color, and elevation.',
    findings: 'Clefts, torus palatinus, symmetrical elevation.',
    impact: 'Velopharyngeal closure and oral pressure.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vagus_nerve.svg/800px-Vagus_nerve.svg.png'
  },
  {
    name: 'Dentition',
    procedure: 'Count teeth, check for dentures/partials, and hygiene.',
    findings: 'Missing teeth, ill-fitting dentures, decay.',
    impact: 'Mastication efficiency and infection risk.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'
  }
];

export function ClinicalExams() {
  const { features } = useAI();
  const [activeTab, setActiveTab] = useState<'cn' | 'oral'>('cn');
  const [findings, setFindings] = useState<Record<string, { status: 'normal' | 'abnormal', notes: string }>>({});
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPatientView, setIsPatientView] = useState(false);

  const handleFindingChange = (stepIndex: number, field: 'status' | 'notes', value: string) => {
    const key = `${activeTab}-${stepIndex}`;
    setFindings(prev => ({
      ...prev,
      [key]: {
        status: (prev[key]?.status || 'normal') as 'normal' | 'abnormal',
        notes: prev[key]?.notes || '',
        [field]: value
      }
    }));
  };

  const generateReport = async () => {
    if (!features.advancedAI && !features.localLLM) return;
    setIsAnalyzing(true);
    try {
      const examName = activeTab === 'cn' ? "Cranial Nerve Exam" : "Oral Peripheral Exam";
      const currentExamData = activeTab === 'cn' ? CRANIAL_NERVE_EXAM : ORAL_MECH_EXAM;
      
      const relevantFindings = currentExamData.map((step, idx) => {
        const key = `${activeTab}-${idx}`;
        const finding = findings[key];
        return {
          step: step.name,
          status: finding?.status || 'normal',
          notes: finding?.notes || ''
        };
      });

      const result = await aiService.analyzeClinicalExam(examName, relevantFindings);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => { setActiveTab('cn'); setAnalysis(null); }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'cn' ? "bg-white shadow-lg text-indigo-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Cranial Nerve
          </button>
          <button 
            onClick={() => { setActiveTab('oral'); setAnalysis(null); }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'oral' ? "bg-white shadow-lg text-indigo-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Oral Mechanical
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
          <div className="hidden md:flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <Activity className="w-4 h-4 text-indigo-600" />
             Clinical Assessment Protocol
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'cn' ? (
            <motion.div 
              key="cn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6"
            >
              {CRANIAL_NERVE_EXAM.map((step, idx) => {
                const key = `cn-${idx}`;
                const finding = findings[key] || { status: 'normal', notes: '' };
                
                return (
                  <div key={idx} className={cn(
                    "bg-white p-8 rounded-[2rem] border shadow-sm transition-all group",
                    finding.status === 'abnormal' ? "border-rose-200 shadow-rose-100" : "border-slate-100 hover:shadow-xl"
                  )}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-full">
                            {step.nerve}
                          </span>
                          <div className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {idx + 1}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-3xl tracking-tight group-hover:text-indigo-600 transition-colors">{step.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFindingChange(idx, 'status', 'normal')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                            finding.status === 'normal' ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          Normal
                        </button>
                        <button
                          onClick={() => handleFindingChange(idx, 'status', 'abnormal')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                            finding.status === 'abnormal' ? "bg-rose-100 text-rose-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          Abnormal
                        </button>
                      </div>
                    </div>

                    {step.image && (
                      <div className="mb-8 rounded-2xl overflow-hidden h-48 w-full relative group-hover:shadow-md transition-all">
                        <img 
                          src={step.image} 
                          alt={step.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3 h-3" />
                          Procedure
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed font-medium">{step.procedure}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          Clinical Significance
                        </p>
                        <p className="text-base text-slate-600 leading-relaxed italic font-medium">{step.clinicalSignificance}</p>
                      </div>
                    </div>

                    {finding.status === 'abnormal' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6"
                      >
                        <textarea
                          value={finding.notes}
                          onChange={(e) => handleFindingChange(idx, 'notes', e.target.value)}
                          placeholder="Describe abnormal findings (e.g., asymmetry, weakness, sensory loss)..."
                          className="w-full p-4 bg-rose-50/50 border border-rose-100 rounded-xl text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none h-24"
                        />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : activeTab === 'oral' ? (
            <motion.div 
              key="oral"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Stethoscope className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="font-black text-2xl tracking-tight mb-2">Oral Mechanical Examination</h5>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                      A systematic evaluation of the structure and function of the speech and swallowing mechanism. 
                      Focus on symmetry, strength, range of motion, and coordination.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ORAL_MECH_EXAM.map((item, idx) => {
                  const key = `oral-${idx}`;
                  const finding = findings[key] || { status: 'normal', notes: '' };
                  
                  return (
                    <div key={idx} className={cn(
                      "bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all group",
                      finding.status === 'abnormal' ? "border-rose-200 shadow-rose-100" : "border-slate-100 hover:shadow-xl"
                    )}>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {idx + 1}
                          </div>
                          <h4 className="font-black text-2xl text-slate-900 tracking-tight">{item.name}</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button
                              onClick={() => handleFindingChange(idx, 'status', 'normal')}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                finding.status === 'normal' ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                              )}
                            >
                              Normal
                            </button>
                            <button
                              onClick={() => handleFindingChange(idx, 'status', 'abnormal')}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                finding.status === 'abnormal' ? "bg-rose-100 text-rose-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                              )}
                            >
                              Abnormal
                            </button>
                        </div>
                      </div>
                      
                      {item.image && (
                        <div className="mb-6 rounded-2xl overflow-hidden h-40 w-full relative group-hover:shadow-md transition-all">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Procedure</p>
                          <p className="text-base text-slate-700 font-medium leading-relaxed">{item.procedure}</p>
                        </div>
                        
                        {finding.status === 'abnormal' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                          >
                            <textarea
                              value={finding.notes}
                              onChange={(e) => handleFindingChange(idx, 'notes', e.target.value)}
                              placeholder="Describe abnormal findings..."
                              className="w-full p-4 bg-rose-50/50 border border-rose-100 rounded-xl text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none h-24"
                            />
                          </motion.div>
                        )}

                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Functional Impact</p>
                          <p className="text-sm text-indigo-900 italic font-bold leading-relaxed">{item.impact}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Analysis Panel (Only for Clinical Exams) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 md:pl-80">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 w-full">
               {analysis ? (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-40 overflow-y-auto prose prose-sm prose-slate">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="text-slate-400 text-sm font-medium italic">
                    Record findings above and click "Analyze Clinical Findings" for AI interpretation.
                 </div>
               )}
            </div>
            <button
              onClick={generateReport}
              disabled={isAnalyzing}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 shrink-0"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Clinical Findings"}
            </button>
         </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Clinical Exams" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
