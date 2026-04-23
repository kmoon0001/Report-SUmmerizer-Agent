import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, FileText, Brain, Activity, Stethoscope, HeartPulse } from 'lucide-react';

interface CheatSheetSection {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const cheatSheetData: CheatSheetSection[] = [
  {
    title: 'Dysphagia',
    icon: <Activity className="w-5 h-5" />,
    content: (
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Oral:</strong> Difficulty forming/transporting bolus. <em>Presents: Pocketing, spillage.</em></li>
        <li><strong>Pharyngeal:</strong> Delayed swallow. <em>Presents: Coughing, throat clearing, wet voice.</em></li>
        <li><strong>Esophageal:</strong> Motility/structural. <em>Presents: Food sticking in chest.</em></li>
      </ul>
    )
  },
  {
    title: 'Dysarthria',
    icon: <Brain className="w-5 h-5" />,
    content: (
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Flaccid:</strong> LMN damage. <em>Presents: Breathiness, hypernasality.</em></li>
        <li><strong>Spastic:</strong> UMN damage. <em>Presents: Strained/strangled voice, slow rate.</em></li>
        <li><strong>Ataxic:</strong> Cerebellar. <em>Presents: Irregular articulatory breakdowns.</em></li>
        <li><strong>Hypokinetic:</strong> Basal ganglia. <em>Presents: Mono-pitch, reduced loudness.</em></li>
      </ul>
    )
  },
  {
    title: 'Aphasia / Language',
    icon: <FileText className="w-5 h-5" />,
    content: (
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Broca's:</strong> Non-fluent. <em>Presents: Effortful, telegraphic speech.</em></li>
        <li><strong>Wernicke's:</strong> Fluent. <em>Presents: Jargon, impaired comprehension.</em></li>
      </ul>
    )
  },
  {
    title: 'Cognitive Communication',
    icon: <Brain className="w-5 h-5" />,
    content: (
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Attention/Memory:</strong> <em>Presents: Difficulty following complex directions.</em></li>
        <li><strong>Executive Function:</strong> <em>Presents: Impaired planning, disorganization.</em></li>
      </ul>
    )
  },
  {
    title: 'Bedside Assessments',
    icon: <Stethoscope className="w-5 h-5" />,
    content: (
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Yale Swallow Screen (Dysphagia)</li>
        <li>GUSS (Dysphagia)</li>
        <li>MOCA (Cognitive)</li>
        <li>WAB-R (Aphasia)</li>
      </ul>
    )
  }
];

export const SLPCheatSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
      >
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">SLP Clinical Reference</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Evidence-Based Quick Guides</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-colors group">
            <X className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
          {cheatSheetData.map((section, index) => (
            <div key={index} className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-4 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  {section.icon}
                </div>
                {section.title}
              </div>
              <div className="text-slate-300 leading-relaxed">{section.content}</div>
            </div>
          ))}
          
          {/* Anatomy Section - Special Large Card */}
          <div className="md:col-span-2 lg:col-span-3 bg-slate-800/50 p-8 rounded-[2rem] border border-white/5">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6 text-emerald-400 font-black uppercase tracking-widest text-[10px]">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  Anatomy & Physiology Focus
                </div>
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-white">Laryngeal Mechanism:</strong> The primary valve for airway protection. During swallow, the epiglottis retroverts, true and false vocal folds adduct, and the larynx elevates.
                  </p>
                  <p className="text-sm leading-relaxed">
                    <strong className="text-white">Neural Control:</strong> Swallowing is governed by the brainstem (medulla) and modulated by the cortex and basal ganglia. Cranial nerves V, VII, IX, X, and XII are critical.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">CN X (Vagus)</span>
                      <p className="text-xs">Motor for pharynx/larynx, sensory for larynx.</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">CN XII (Hypoglossal)</span>
                      <p className="text-xs">Motor for all intrinsic and most extrinsic tongue muscles.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video lg:aspect-square">
                  <img 
                    src="https://picsum.photos/seed/anatomy-slp/800/800" 
                    alt="Anatomy Diagram" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Reference: Upper Aerodigestive Tract</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
