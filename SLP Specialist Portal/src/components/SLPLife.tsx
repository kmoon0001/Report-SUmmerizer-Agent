import React, { useState } from 'react';
import { 
  Heart, 
  Coffee, 
  BookOpen, 
  Zap, 
  ExternalLink,
  ArrowRight,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const WELLNESS_RESOURCES = [
  {
    title: "ASHA Self-Care Resources",
    description: "ASHA's collection of self-care and burnout prevention tools for SLPs.",
    url: "https://www.asha.org/practice/self-care/",
    category: "Professional"
  },
  {
    title: "SLP Stress Management",
    description: "Mindfulness and meditation specifically tailored for the clinical environment.",
    url: "https://www.slpstressmanagement.com/",
    category: "Mindfulness"
  },
  {
    title: "Burnout Prevention Guide",
    description: "Practical strategies for identifying and preventing burnout in SLP.",
    url: "https://www.medbridgeeducation.com/blog/2019/04/burnout-prevention-for-slps/",
    category: "Education"
  },
  {
    title: "Ergonomics for Clinicians",
    description: "Tips for maintaining physical health while working in clinical settings.",
    url: "https://www.asha.org/practice/ergonomics/",
    category: "Physical Health"
  },
  {
    title: "SLP Support Network",
    description: "Connect with other SLPs for mutual support and shared experiences.",
    url: "https://www.facebook.com/groups/slpburnout/",
    category: "Community"
  }
];

export function SLPLife() {
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [isPatientView, setIsPatientView] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const renderContent = () => (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Patient View Toggle */}
      <div className="absolute top-0 right-0 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">SLP Life & Wellness</h2>
          <p className="text-slate-500 font-medium">Resources for career longevity, burnout prevention, and work-life balance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Burnout Prevention */}
        <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
          <div className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-rose-900 mb-2 relative z-10">Burnout Prevention</h3>
          <p className="text-sm text-rose-700 mb-6 relative z-10">Strategies to manage stress and emotional fatigue in high-demand clinical settings.</p>
          <ul className="space-y-3 relative z-10">
            <li className="flex items-center gap-2 text-sm text-rose-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Setting Boundaries
            </li>
            <li className="flex items-center gap-2 text-sm text-rose-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Mindfulness Micro-Breaks
            </li>
            <li className="flex items-center gap-2 text-sm text-rose-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Peer Support Networks
            </li>
          </ul>
        </div>

        {/* Productivity */}
        <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
          <div className="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-indigo-900 mb-2 relative z-10">Productivity Hacks</h3>
          <p className="text-sm text-indigo-700 mb-6 relative z-10">Efficient documentation and time management tips for the busy clinician.</p>
          <ul className="space-y-3 relative z-10">
            <li className="flex items-center gap-2 text-sm text-indigo-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Point-of-Service Documentation
            </li>
            <li className="flex items-center gap-2 text-sm text-indigo-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Smart Phrases & Templates
            </li>
            <li className="flex items-center gap-2 text-sm text-indigo-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Batching Admin Tasks
            </li>
          </ul>
        </div>

        {/* Career Growth */}
        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
          <div className="w-12 h-12 bg-white text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 mb-2 relative z-10">Career Growth</h3>
          <p className="text-sm text-emerald-700 mb-6 relative z-10">Continuing education, specialization, and leadership opportunities.</p>
          <ul className="space-y-3 relative z-10">
            <li className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Specialty Certifications (BCS)
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Mentorship Programs
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Clinical Research
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-amber-600" />
          Daily Wellness Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Hydrate', icon: '💧' },
            { label: 'Stretch', icon: '🧘‍♀️' },
            { label: 'Step Outside', icon: '☀️' },
            { label: 'Connect with a Colleague', icon: '🤝' }
          ].map((item, i) => {
            const isChecked = checkedItems.includes(i);
            return (
              <button
                key={i}
                onClick={() => setCheckedItems(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i])}
                className={cn(
                  "p-4 rounded-2xl border flex items-center gap-3 transition-colors group w-full text-left",
                  isChecked ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                )}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className={cn("font-bold text-sm", isChecked ? "text-indigo-900" : "text-slate-700")}>{item.label}</span>
                <div className={cn(
                  "ml-auto w-6 h-6 rounded-full border-2 transition-colors",
                  isChecked ? "border-indigo-500 bg-indigo-500" : "border-slate-200 group-hover:border-indigo-500 group-hover:bg-indigo-50"
                )} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black mb-4">You can't pour from an empty cup.</h3>
          <p className="text-slate-400 font-medium leading-relaxed mb-8">
            Taking care of yourself is not a luxury—it's an ethical imperative. Your patients need you to be present, rested, and regulated.
          </p>
          <button 
            onClick={() => setShowWellnessModal(true)}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            Explore Wellness Resources <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Wellness Resources Modal */}
      <AnimatePresence>
        {showWellnessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWellnessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Wellness Resources</h3>
                  <p className="text-slate-500 text-sm font-medium">Curated tools for SLP self-care and longevity.</p>
                </div>
                <button 
                  onClick={() => setShowWellnessModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                  {WELLNESS_RESOURCES.map((resource, i) => (
                    <a 
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                            {resource.category}
                          </span>
                          <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{resource.title}</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{resource.description}</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center font-medium">
                  Remember: You are your most important clinical tool. Take care of yourself.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="SLP Life" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}

