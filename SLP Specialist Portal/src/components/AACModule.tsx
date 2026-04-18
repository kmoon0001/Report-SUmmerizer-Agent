import React, { useState } from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink, 
  ClipboardCheck, 
  Zap, 
  Globe,
  DollarSign,
  Building2,
  Mic,
  LayoutGrid,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AACBoardCreator } from './AACBoardCreator';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const AUTHORITATIVE_SOURCES = [
  { name: "ASHA Practice Portal: AAC", url: "https://www.asha.org/practice-portal/clinical-topics/augmentative-and-alternative-communication/" },
  { name: "RESNA", url: "https://www.resna.org/" },
  { name: "ISAAC", url: "https://isaac-online.org/english/home/" }
];

const AAC_COMPANIES = [
  {
    name: "Tobii Dynavox",
    url: "https://www.tobiidynavox.com",
    models: [
      { name: "I-Series", type: "Eye Tracking", image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=400" },
      { name: "TD Pilot", type: "iPad-based Eye Tracking", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400" }
    ],
    funding: "Extensive insurance support, Medicare/Medicaid approved."
  },
  {
    name: "Control Bionics",
    url: "https://www.controlbionics.com",
    models: [
      { name: "NeuroNode", type: "EMG/Neuro Control", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400" }
    ],
    funding: "Specializes in complex access (ALS, SCI)."
  },
  {
    name: "Forbes AAC",
    url: "https://www.forbesaac.com",
    models: [
      { name: "ProSlate", type: "Ruggedized iPad", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=400" },
      { name: "WinSlate", type: "Windows-based Eye Tracking", image: "https://images.unsplash.com/photo-1531297461136-82129f2205e6?auto=format&fit=crop&q=80&w=400" }
    ],
    funding: "Strong clinical support team for SNF evaluations."
  },
  {
    name: "PRC-Saltillo",
    url: "https://www.prc-saltillo.com",
    models: [
      { name: "Accent Series", type: "Dedicated Device", image: "https://images.unsplash.com/photo-1593642632823-8f785e67ac73?auto=format&fit=crop&q=80&w=400" },
      { name: "NovaChat", type: "Android-based", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400" }
    ],
    funding: "Unity and WordPower language systems."
  }
];

export function AACModule() {
  const [isPatientView, setIsPatientView] = useState(false);
  const [activeTab, setActiveTab] = useState<'process' | 'models' | 'clinical' | 'creator'>('process');

  const renderContent = () => (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            AAC Hub
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Augmentative & Alternative Communication resources.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {AUTHORITATIVE_SOURCES.map((source, i) => (
            <a 
              key={i} 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            >
              {source.name}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          ))}
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit flex-wrap">
        <button 
          onClick={() => setActiveTab('process')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'process' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <DollarSign className="w-4 h-4" />
          Funding Process
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'models' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Smartphone className="w-4 h-4" />
          Models & Companies
        </button>
        <button 
          onClick={() => setActiveTab('clinical')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'clinical' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ClipboardCheck className="w-4 h-4" />
          Clinical Resources
        </button>
        <button 
          onClick={() => setActiveTab('creator')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'creator' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          Board Creator
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'creator' ? (
            <motion.div 
              key="creator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[800px]" // Fixed height for the creator
            >
              <AACBoardCreator />
            </motion.div>
          ) : activeTab === 'process' ? (
            <motion.div 
              key="process"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 relative z-10">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  The Funding Journey (SNF Level)
                </h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900 mb-1">Identify Need & Access</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Determine if the patient has a chronic communication deficit that cannot be met with natural speech or low-tech options.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">2</div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900 mb-1">Trial Period</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Most insurance requires a 4-week trial with at least 2 different systems. Document progress and patient preference.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">3</div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900 mb-1">The Speech Evaluation Report (SER)</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">A comprehensive report justifying the "Medical Necessity" of the specific SGD. Must include physician signature.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">4</div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900 mb-1">Submission & Approval</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">The AAC company handles the submission to Medicare/Medicaid/Private Insurance. Approval can take 4-12 weeks.</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
                  <h4 className="font-black text-blue-900 mb-4 flex items-center gap-2 relative z-10 text-lg">
                    <ShieldCheck className="w-5 h-5" />
                    Medicare Rules
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed font-medium relative z-10">
                    Medicare covers SGDs as Durable Medical Equipment (DME). The patient must be in a "Medicare Part B" status or at home. If in a Part A SNF stay, the facility is responsible for providing communication access, but the long-term device purchase usually waits until Part B or discharge.
                  </p>
                </div>
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
                  <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2 relative z-10 text-lg">
                    <Building2 className="w-5 h-5" />
                    AAC Company Support
                  </h4>
                  <p className="text-sm text-emerald-800 leading-relaxed font-medium relative z-10">
                    Most major companies have local "Clinical Consultants" who will come to your SNF, provide trial equipment, and help you write the evaluation report.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'models' ? (
            <motion.div 
              key="models"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {AAC_COMPANIES.map((company, idx) => (
                <motion.div 
                  key={company.name} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-indigo-200 transition-all group"
                >
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h3>
                      <a href={company.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-3 py-1 rounded-full">{company.funding}</p>
                  </div>
                  <div className="p-8 grid grid-cols-2 gap-6 flex-1">
                    {company.models.map((model) => (
                      <div key={model.name} className="space-y-3 group/item">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                          <img 
                            src={model.image} 
                            alt={model.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{model.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">{model.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="clinical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-left hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <ClipboardCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">Assessment</h4>
                  <ul className="text-xs text-slate-500 space-y-3 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />TASP (Test of AAC Symbols)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />Social Networks Profile</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />Communication Matrix</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />Feature Matching Checklist</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-left hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">Treatment</h4>
                  <ul className="text-xs text-slate-500 space-y-3 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Aided Language Stimulation</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Core Vocabulary Training</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Partner-Assisted Scanning</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Visual Scene Displays</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-left hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Globe className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">Resources</h4>
                  <ul className="text-xs text-slate-500 space-y-3 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />ASHA Practice Portal: AAC</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />ISAAC International</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />AAC Language Lab</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" />PrAACtical AAC Blog</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Voice Banking Quick-Start</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-8 max-w-xl font-medium leading-relaxed">For patients with degenerative conditions (ALS, PD), early voice banking is critical. Capture their unique voice before significant decline.</p>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://www.modeltalker.org" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-colors">
                      ModelTalker <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    <a href="https://thevoicekeeper.com" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
                      The Voice Keeper <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    <a href="https://www.acapela-group.com/voices/voice-banking/" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700">
                      Acapela MyOwnVoice <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/3" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <PatientViewWrapper title="AAC Hub" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
