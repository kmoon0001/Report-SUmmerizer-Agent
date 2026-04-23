import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  Activity, 
  Brain, 
  MessageCircle, 
  Sparkles, 
  Save, 
  Printer, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../context/AIContext';

interface EvalData {
  patientName: string;
  dob: string;
  evalDate: string;
  
  // Dysphagia
  poStatus: string;
  clinicalSigns: string[];
  oralMotor: string;
  swallowSafety: 'Safe' | 'Guarded' | 'Unsafe';
  
  // Cognition
  orientation: string[];
  memoryDeficits: string[];
  safetyAwareness: string;
  executiveFunction: string;
  
  // Communication
  receptiveLanguage: string;
  expressiveLanguage: string;
  speechIntelligibility: string;
  vocalQuality: string;
  
  clinicalImpression: string;
}

const initialData: EvalData = {
  patientName: '',
  dob: '',
  evalDate: new Date().toISOString().split('T')[0],
  poStatus: 'Regular',
  clinicalSigns: [],
  oralMotor: '',
  swallowSafety: 'Safe',
  orientation: [],
  memoryDeficits: [],
  safetyAwareness: '',
  executiveFunction: '',
  receptiveLanguage: '',
  expressiveLanguage: '',
  speechIntelligibility: '100%',
  vocalQuality: 'Within Normal Limits',
  clinicalImpression: ''
};

export const ThreeWayEval: React.FC = () => {
  const [data, setData] = useState<EvalData>(initialData);
  const [activeStep, setActiveStep] = useState(0);
  const { toggleAI } = useAI();

  const steps = [
    { id: 'patient', title: 'Patient Info', icon: ClipboardList },
    { id: 'dysphagia', title: 'Dysphagia', icon: Activity },
    { id: 'cognition', title: 'Cognition', icon: Brain },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
    { id: 'summary', title: 'Summary', icon: Sparkles }
  ];

  const handleInputChange = (field: keyof EvalData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof EvalData, item: string) => {
    const currentArray = data[field] as string[];
    if (currentArray.includes(item)) {
      handleInputChange(field, currentArray.filter(i => i !== item));
    } else {
      handleInputChange(field, [...currentArray, item]);
    }
  };

  const generateImpression = () => {
    // In a real app, this would call the AI service
    const impression = `Patient ${data.patientName} was evaluated for dysphagia, cognition, and communication. 
    Dysphagia: Currently on ${data.poStatus} diet. Swallow safety is ${data.swallowSafety}. 
    Cognition: Deficits noted in ${data.memoryDeficits.join(', ') || 'none'}. 
    Communication: Receptive language is ${data.receptiveLanguage}. 
    Clinical recommendation: Skilled SLP services indicated for...`;
    
    handleInputChange('clinicalImpression', impression);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Three-Way Evaluation</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Integrated Clinical Assessment Tool</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-white/5">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20">
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center px-4">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(idx)}
            className={cn(
              "flex flex-col items-center gap-2 transition-all group",
              activeStep === idx ? "opacity-100" : "opacity-40 hover:opacity-70"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              activeStep === idx ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110" : "bg-slate-800 text-slate-400"
            )}>
              <step.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-10 shadow-xl">
        {activeStep === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-400" />
              Patient Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Patient Name</label>
                <input 
                  type="text" 
                  value={data.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={data.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Evaluation Date</label>
                <input 
                  type="date" 
                  value={data.evalDate}
                  onChange={(e) => handleInputChange('evalDate', e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Dysphagia Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current PO Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['NPO', 'Puree', 'Mechanical Soft', 'Regular', 'Thin Liquids', 'Thickened'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleInputChange('poStatus', status)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                        data.poStatus === status 
                          ? "bg-emerald-600 border-emerald-500 text-white" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clinical Signs of Aspiration</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Coughing', 'Throat Clearing', 'Wet Voice', 'Eye Tearing', 'Shortness of Breath'].map(sign => (
                    <button
                      key={sign}
                      onClick={() => toggleArrayItem('clinicalSigns', sign)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between",
                        data.clinicalSigns.includes(sign)
                          ? "bg-rose-900/40 border-rose-500 text-rose-400" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {sign}
                      {data.clinicalSigns.includes(sign) && <AlertCircle className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Oral Motor / Dentition Notes</label>
                <textarea 
                  value={data.oralMotor}
                  onChange={(e) => handleInputChange('oralMotor', e.target.value)}
                  placeholder="Describe lip closure, tongue range of motion, strength, and dental status..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-32"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-violet-400" />
              Cognitive Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Orientation (Alert & Oriented x?)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Person', 'Place', 'Time', 'Situation'].map(item => (
                    <button
                      key={item}
                      onClick={() => toggleArrayItem('orientation', item)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between",
                        data.orientation.includes(item)
                          ? "bg-violet-600 border-violet-500 text-white" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {item}
                      {data.orientation.includes(item) && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Memory Deficits</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Short-term', 'Long-term', 'Procedural', 'Working Memory'].map(item => (
                    <button
                      key={item}
                      onClick={() => toggleArrayItem('memoryDeficits', item)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between",
                        data.memoryDeficits.includes(item)
                          ? "bg-amber-900/40 border-amber-500 text-amber-400" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {item}
                      {data.memoryDeficits.includes(item) && <AlertCircle className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Safety Awareness / Judgment</label>
                <textarea 
                  value={data.safetyAwareness}
                  onChange={(e) => handleInputChange('safetyAwareness', e.target.value)}
                  placeholder="Notes on impulsivity, ability to follow safety precautions..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Executive Function</label>
                <textarea 
                  value={data.executiveFunction}
                  onChange={(e) => handleInputChange('executiveFunction', e.target.value)}
                  placeholder="Notes on problem solving, sequencing, initiation..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-24"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
              Communication Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Receptive Language</label>
                <textarea 
                  value={data.receptiveLanguage}
                  onChange={(e) => handleInputChange('receptiveLanguage', e.target.value)}
                  placeholder="Ability to follow commands, answer yes/no questions..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expressive Language</label>
                <textarea 
                  value={data.expressiveLanguage}
                  onChange={(e) => handleInputChange('expressiveLanguage', e.target.value)}
                  placeholder="Word finding, sentence structure, fluency..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Speech Intelligibility</label>
                <select 
                  value={data.speechIntelligibility}
                  onChange={(e) => handleInputChange('speechIntelligibility', e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option>100%</option>
                  <option>75-90%</option>
                  <option>50-75%</option>
                  <option>25-50%</option>
                  <option>Less than 25%</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vocal Quality</label>
                <input 
                  type="text" 
                  value={data.vocalQuality}
                  onChange={(e) => handleInputChange('vocalQuality', e.target.value)}
                  placeholder="WNL, Hoarse, Breathy, Strained..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Clinical Impression & Summary
              </h3>
              <button 
                onClick={generateImpression}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate Summary
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Integrated Clinical Impression</label>
              <textarea 
                value={data.clinicalImpression}
                onChange={(e) => handleInputChange('clinicalImpression', e.target.value)}
                placeholder="The clinical impression should integrate all three domains..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/20 transition-all h-64 leading-relaxed"
              />
            </div>

            <div className="p-6 bg-blue-900/20 border border-blue-500/20 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Clinical Tip</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                A thorough three-way evaluation highlights the intersection of deficits. For example, note if cognitive impulsivity increases aspiration risk during meals, or if expressive language deficits mask the patient's true cognitive potential.
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between">
          <button
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              Next Step
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                alert('Report finalized and saved to patient record.');
              }}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Finalize Report
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
