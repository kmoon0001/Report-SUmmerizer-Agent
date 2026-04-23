import React, { useState } from 'react';
import { 
  Activity, 
  ClipboardList, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Utensils, 
  Waves,
  Stethoscope,
  Info,
  History,
  AlertCircle,
  FileText,
  Target,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { IDDSI_LEVELS } from '../utils/iddsi-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function DysphagiaHub() {
  const [isPatientView, setIsPatientView] = useState(false);
  const [activeTool, setActiveTool] = useState<'wizard' | 'iddsi' | 'decision' | 'exercises' | 'compliance'>('wizard');
  const [cseStep, setCseStep] = useState(0);
  const [cseData, setCseData] = useState<Record<string, any>>({});
  const [selectedIDDSI, setSelectedIDDSI] = useState<number | null>(null);

  const CSE_STEPS = [
    {
      title: 'Clinical History & Presentation',
      fields: [
        { id: 'diagnosis', label: 'Primary Diagnosis', options: ['Stroke', 'TBI', 'Parkinson\'s', 'Dementia', 'HNC', 'Other'] },
        { id: 'respiratory', label: 'Respiratory Status', options: ['Room Air', 'O2 Support', 'Trach', 'Vent'] },
        { id: 'baseline', label: 'Baseline Diet', options: ['Regular', 'Soft', 'Minced', 'Puree'] },
        { id: 'complaint', label: 'Patient Complaint', options: ['Coughing', 'Choking', 'Globus', 'Pain', 'None'] }
      ]
    },
    {
      title: 'Cranial Nerve & Oral Mech',
      fields: [
        { id: 'cn_v', label: 'CN V (Trigeminal) - Jaw', options: ['WNL', 'Weakness', 'Deviation'] },
        { id: 'cn_vii', label: 'CN VII (Facial) - Labial', options: ['WNL', 'Droop', 'Weak Seal'] },
        { id: 'cn_ix_x', label: 'CN IX/X (Vagus) - Palate/Voice', options: ['WNL', 'Asymmetry', 'Wet Voice', 'Weak Cough'] },
        { id: 'cn_xii', label: 'CN XII (Hypoglossal) - Tongue', options: ['WNL', 'Deviation', 'Atrophy', 'Weakness'] }
      ]
    },
    {
      title: 'PO Trials (Yale Protocol)',
      fields: [
        { id: 'yale_3oz', label: '3oz Water Swallow Challenge', options: ['Pass', 'Fail (Cough)', 'Fail (Interrupted)'] },
        { id: 'thin_volitional', label: 'Thin Liquid (Volitional)', options: ['Safe', 'Cough', 'Throat Clear', 'Wet Voice'] },
        { id: 'nectar_volitional', label: 'Mildly Thick (Nectar)', options: ['Safe', 'Cough', 'Throat Clear', 'Wet Voice'] },
        { id: 'puree_trial', label: 'Puree Consistency', options: ['Safe', 'Residue', 'Pocketing'] }
      ]
    },
    {
      title: 'Clinical Impressions',
      fields: [
        { id: 'phase', label: 'Primary Phase Deficit', options: ['Oral Prep', 'Oral', 'Pharyngeal', 'Esophageal'] },
        { id: 'aspiration_risk', label: 'Aspiration Risk', options: ['Low', 'Moderate', 'High', 'Silent Suspected'] },
        { id: 'instrumental', label: 'Instrumental Needed?', options: ['No', 'Yes - VFSS', 'Yes - FEES'] }
      ]
    }
  ];

  const EXERCISES = [
    {
      title: 'Shaker Exercise',
      target: 'UES Opening',
      description: 'Head lift exercise to strengthen suprahyoid muscles and improve UES opening.',
      contraindications: 'Cervical spine issues, neck pain.',
      evidence: 'Shaker et al., 1997'
    },
    {
      title: 'Masako Maneuver',
      target: 'Pharyngeal Constriction',
      description: 'Swallow with tongue held between teeth to increase pharyngeal wall movement.',
      contraindications: 'Do not use with food/liquid.',
      evidence: 'Fujiu & Logemann, 1996'
    },
    {
      title: 'Mendelsohn Maneuver',
      target: 'Laryngeal Elevation',
      description: 'Voluntarily prolonging the peak of the swallow for 2-3 seconds.',
      contraindications: 'Cognitive deficits preventing understanding.',
      evidence: 'Mendelsohn, 1986'
    },
    {
      title: 'Effortful Swallow',
      target: 'Tongue Base Retraction',
      description: 'Swallow "hard" to increase posterior tongue base movement.',
      contraindications: 'None generally.',
      evidence: 'Huckabee & Steele, 2006'
    },
    {
      title: 'EMST (Expiratory Muscle Strength Training)',
      target: 'Airway Protection',
      description: 'Blowing into a calibrated device to improve cough strength.',
      contraindications: 'Untreated hypertension, recent abdominal surgery.',
      evidence: 'Troche et al., 2010'
    }
  ];

  const renderContent = () => (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dysphagia Hub</h2>
            <p className="text-slate-500 font-medium">Evidence-based swallowing diagnostics & management</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
          {[
            { id: 'wizard', title: 'CSE Wizard', icon: ClipboardList },
            { id: 'iddsi', title: 'IDDSI Guide', icon: Utensils },
            { id: 'decision', title: 'Instrumental', icon: Activity },
            { id: 'exercises', title: 'Exercises', icon: BookOpen },
            { id: 'compliance', title: 'Compliance', icon: ShieldAlert },
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap flex items-center gap-2",
                activeTool === tool.id ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tool.icon className="w-4 h-4" />
              {tool.title}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTool === 'compliance' && (
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
                <p className="text-amber-700">Documentation standards for Dysphagia therapy.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">Skilled Need Justification</h4>
                <p className="text-sm text-slate-600">Document the necessity of skilled SLP intervention for dysphagia management. Focus on safety, aspiration risk, and functional nutritional intake. Avoid generic "swallow safety" statements.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2">CPT Code Selection</h4>
                <p className="text-sm text-slate-600">Ensure CPT codes (e.g., 92526) are supported by documented dysphagia interventions (e.g., compensatory strategies, therapeutic maneuvers). Medicare audits scrutinize the consistency between interventions and billed codes.</p>
              </div>
            </div>
          </motion.div>
        )}
        {activeTool === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Clinical Swallow Exam (CSE)</h3>
              <div className="text-sm font-bold text-emerald-600">Step {cseStep + 1} of {CSE_STEPS.length}</div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((cseStep + 1) / CSE_STEPS.length) * 100}%` }}
              />
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
              <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                {CSE_STEPS[cseStep].title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {CSE_STEPS[cseStep].fields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                    <select
                      value={cseData[field.id] || ''}
                      onChange={(e) => setCseData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCseStep(Math.max(0, cseStep - 1))}
                disabled={cseStep === 0}
                className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                Back
              </button>
              {cseStep < CSE_STEPS.length - 1 ? (
                <button
                  onClick={() => setCseStep(Math.min(CSE_STEPS.length - 1, cseStep + 1))}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => alert('CSE Completed! Generating clinical impressions...')}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                  Finalize & Draft Note <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {activeTool === 'iddsi' && (
          <motion.div
            key="iddsi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Interactive IDDSI Framework</h3>
              <a href="https://iddsi.org" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline">Official IDDSI Resources</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                {IDDSI_LEVELS.map((lvl) => (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedIDDSI(lvl.level)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group",
                      selectedIDDSI === lvl.level 
                        ? "border-emerald-500 bg-emerald-50 shadow-md" 
                        : "border-slate-100 bg-white hover:border-emerald-200"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black text-white", lvl.color.split(' ')[0])}>
                        {lvl.level}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{lvl.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lvl.type}</div>
                      </div>
                    </div>
                    <ChevronRight className={cn("w-5 h-5 transition-transform", selectedIDDSI === lvl.level ? "text-emerald-500 translate-x-1" : "text-slate-300")} />
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8 min-h-[400px]">
                {selectedIDDSI !== null ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white", IDDSI_LEVELS[selectedIDDSI].color.split(' ')[0])}>
                        {IDDSI_LEVELS[selectedIDDSI].level}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900">{IDDSI_LEVELS[selectedIDDSI].name}</h4>
                        <p className="text-slate-500 font-medium">IDDSI Framework v2.0</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{IDDSI_LEVELS[selectedIDDSI].desc}</p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Testing Method</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{IDDSI_LEVELS[selectedIDDSI].testing}</p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Examples</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{IDDSI_LEVELS[selectedIDDSI].examples}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <Utensils className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-400 font-bold">Select an IDDSI level to view clinical details and testing methods.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTool === 'decision' && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <h3 className="text-xl font-bold text-slate-900">Instrumental Selection Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h4 className="font-bold text-xl text-indigo-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Activity className="w-5 h-5 text-indigo-600" /></div>
                  VFSS (MBSS)
                </h4>
                <ul className="space-y-4">
                  {[
                    'Esophageal phase concerns or globus sensation',
                    'Global view of all phases (oral, pharyngeal, esophageal)',
                    'Need to visualize UES opening and coordination',
                    'Lateral & AP views required for structural assessment',
                    'Suspected Zenker\'s diverticulum or esophageal stricture'
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h4 className="font-bold text-xl text-rose-900 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-lg"><Activity className="w-5 h-5 text-rose-600" /></div>
                  FEES
                </h4>
                <ul className="space-y-4">
                  {[
                    'Visualize secretions and management of saliva',
                    'Assess fatigue over a full meal (no radiation limit)',
                    'Direct visualization of laryngeal anatomy/pathology',
                    'Biofeedback therapy for specific maneuvers',
                    'Bedbound, obese, or medically fragile patients'
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-900 mb-1">Clinical Decision Making</h5>
                <p className="text-sm text-amber-800 leading-relaxed">
                  The choice of instrumental should be based on the clinical question. If the question is "Why is the patient aspirating?", both are excellent. If the question is "Is there an esophageal contribution?", VFSS is mandatory.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTool === 'exercises' && (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-slate-900">Evidence-Based Exercise Library</h3>
            <div className="grid grid-cols-1 gap-6">
              {EXERCISES.map((ex, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">{ex.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">{ex.target}</span>
                        <span className="text-[10px] font-bold text-slate-400 italic">Evidence: {ex.evidence}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-rose-600 font-black uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl">
                      <AlertTriangle className="w-3 h-3" />
                      Contraindications: {ex.contraindications}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{ex.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Info className="w-4 h-4" />
          Authoritative Source: ASHA Practice Portal & IDDSI Framework v2.0
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            Generate Goals
          </button>
          <button className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-all">
            Documentation Studio
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      {isPatientView ? (
        <PatientViewWrapper title="Dysphagia Hub" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
