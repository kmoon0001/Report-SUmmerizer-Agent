import React, { useState } from 'react';
import { 
  Scale, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle, 
  BookOpen, 
  Gavel,
  Brain,
  Stethoscope,
  XCircle,
  ClipboardCheck,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AIConfidenceIndicator } from './AIConfidenceIndicator';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { logger } from '../utils/logger';

type Tab = 'jimmo' | 'part-b' | 'section-k' | 'documentation';

export function ComplianceCenter({ defaultTab = 'jimmo' }: { defaultTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [isPatientView, setIsPatientView] = useState(false);

  const renderContent = () => (
    <div className="h-full flex flex-col">
      {/* Header with Patient View Toggle */}
      <div className="flex justify-end px-8 pt-4">
        <button 
          onClick={() => setIsPatientView(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
        >
          <Eye className="w-4 h-4" />
          Patient View
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1.5 bg-slate-200 rounded-2xl mx-8 mt-2 mb-6 overflow-x-auto scrollbar-hide shrink-0 border border-slate-300 shadow-sm">
        {[
          { id: 'jimmo', label: 'Jimmo v. Sebelius', icon: Scale },
          { id: 'part-b', label: 'Medicare Part B (LTC)', icon: BookOpen },
          { id: 'section-k', label: 'Section K (MDS)', icon: ClipboardCheck },
          { id: 'documentation', label: 'Documentation', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-black rounded-xl transition-all whitespace-nowrap uppercase tracking-tight ${
                isActive 
                  ? 'bg-white text-blue-800 shadow-md border border-slate-400' 
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'jimmo' && <JimmoTab key="jimmo" />}
          {activeTab === 'part-b' && <PartBTab key="part-b" />}
          {activeTab === 'section-k' && <SectionKTab key="section-k" />}
          {activeTab === 'documentation' && <DocumentationTab key="documentation" />}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Compliance Center" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}

// --- Sub-Components ---

function JimmoTab() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const myths = [
    {
      id: 1,
      myth: "The 'Improvement Standard'",
      statement: "Medicare only pays if the patient is improving.",
      fact: "FALSE. Coverage does not turn on the presence or absence of a beneficiary's potential for improvement, but rather on the beneficiary's need for skilled care.",
      source: "Jimmo v. Sebelius Settlement",
      url: "https://www.cms.gov/medicare/medicare-fee-for-service-payment/snfpps/jimmo_settlement"
    },
    {
      id: 2,
      myth: "The 'Plateau' Rule",
      statement: "Therapy must stop once a patient reaches a plateau.",
      fact: "FALSE. Skilled services may be necessary to prevent or slow deterioration, or to maintain current capabilities.",
      source: "MBPM Ch. 15, Sec. 220.2",
      url: "https://www.cms.gov/regulations-and-guidance/guidance/manuals/internet-only-manuals-ioms"
    },
    {
      id: 3,
      myth: "Restorative Only",
      statement: "Maintenance therapy is not a skilled service.",
      fact: "FALSE. Maintenance programs can be skilled if they require the expertise of a therapist to establish or perform safely/effectively.",
      source: "42 CFR 409.33",
      url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-409/subpart-D/section-409.33"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="w-8 h-8 text-indigo-300" />
            <h2 className="text-2xl font-bold">Jimmo v. Sebelius</h2>
          </div>
          <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed">
            The landmark settlement that clarified: <strong className="text-white">Improvement is NOT required</strong> for Medicare coverage. Skilled therapy is covered for maintenance to prevent or slow decline.
          </p>
        </div>
      </div>

      {/* Myth Busters Game */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          Compliance Knowledge Check: Myth vs. Fact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myths.map((item) => (
            <div 
              key={item.id}
              onClick={() => setFlippedCard(flippedCard === item.id ? null : item.id)}
              className="relative h-64 cursor-pointer group perspective-1000"
            >
              <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flippedCard === item.id ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-indigo-200 backface-hidden">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 font-bold">
                    ?
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{item.myth}</h4>
                  <p className="text-slate-600 text-sm">"{item.statement}"</p>
                  <div className="mt-auto text-xs font-bold text-indigo-600 uppercase tracking-wider">Tap to Reveal</div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 bg-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-white shadow-xl rotate-y-180 backface-hidden">
                  <CheckCircle2 className="w-10 h-10 mb-3 text-green-400" />
                  <p className="font-medium text-sm leading-relaxed mb-4">{item.fact}</p>
                  <div className="mt-auto text-xs opacity-90 border-t border-white/20 pt-2 w-full flex flex-col items-center gap-1">
                    <span>Source: {item.source}</span>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-200 hover:text-white underline decoration-indigo-400/50 hover:decoration-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read Official Guidance
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-4">Documentation Requirements for Skilled Maintenance</h3>
        <ul className="space-y-3">
          {[
            "Clearly identify the specific skills required (e.g., 'Requires SLP to safely modify diet textures due to aspiration risk').",
            "Document the complexity of the service which can only be performed by a therapist.",
            "State the goal: 'To prevent decline' or 'To maintain current functional status'.",
            "Regularly assess if the maintenance program can be transitioned to a restorative nursing program (RNP) or caregiver."
          ].map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-indigo-800">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-600" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function PartBTab() {
  const [assistantChecklist, setAssistantChecklist] = useState({
    pocSigned: false,
    frequencyValid: false,
    skilledTerminology: false,
    functionalGoals: false,
    progressReported: false,
    maintenanceJustified: false
  });

  const toggleAssistantItem = (key: keyof typeof assistantChecklist) => {
    setAssistantChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Interactive Assistant Checklist */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardCheck className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-black">Interactive Chart Review</h3>
          <AIConfidenceIndicator 
            score={4.8}
            evidence="Based on CMS Benefits Policy Manual, Chapter 15 and Jimmo v. Sebelius settlement guidelines."
            sourceUrl="https://www.cms.gov/medicare/medicare-fee-for-service-payment/snfpps/jimmo_settlement"
            limitations={[
              "Does not replace clinical judgment.",
              "Checklist is a guide, not a definitive legal determination.",
              "Requires verification of specific facility policies."
            ]}
            onFeedback={(f) => logger.info('Feedback:', f)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'pocSigned', label: 'Physician Signature on POC (within 30 days)' },
            { id: 'frequencyValid', label: 'Frequency/Duration matches Orders' },
            { id: 'skilledTerminology', label: 'Skilled Terminology Used (analyzed, assessed)' },
            { id: 'functionalGoals', label: 'Goals Linked to Functional Outcomes' },
            { id: 'progressReported', label: 'Progress Report every 10 visits' },
            { id: 'maintenanceJustified', label: 'Maintenance Rationale (if applicable)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => toggleAssistantItem(item.id as keyof typeof assistantChecklist)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                assistantChecklist[item.id as keyof typeof assistantChecklist]
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                assistantChecklist[item.id as keyof typeof assistantChecklist]
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-slate-500 group-hover:border-white"
              )}>
                {assistantChecklist[item.id as keyof typeof assistantChecklist] && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-slate-400">
            <span className="text-orange-400 font-bold">{Object.values(assistantChecklist).filter(Boolean).length}</span> of <span className="text-white font-bold">6</span> compliance checks completed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Medical Necessity</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Services must be reasonable and necessary for the treatment of the patient's illness or injury or to improve the functioning of a malformed body member.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 font-mono">
            Ref: MBPM Ch. 15, Sec. 220
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Skilled Services</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Services must be of such a level of complexity and sophistication that they can be safely and effectively performed only by a therapist.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 font-mono">
            Ref: 42 CFR § 409.32
          </div>
        </div>
      </div>

      {/* Frequency & Duration Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Frequency & Duration Guidelines</h3>
        </div>
        <div className="p-6 grid gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">1</div>
            <div>
              <h4 className="font-bold text-slate-900">Evaluation</h4>
              <p className="text-sm text-slate-600">Must establish the Plan of Care (POC). The POC must be signed by the physician/NPP within 30 days.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">2</div>
            <div>
              <h4 className="font-bold text-slate-900">Progress Reports</h4>
              <p className="text-sm text-slate-600">Required at least every <strong>10 treatment days</strong>. Must document progress towards goals or justification for maintenance.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">3</div>
            <div>
              <h4 className="font-bold text-slate-900">Recertification</h4>
              <p className="text-sm text-slate-600">Required every 90 days (or sooner if the POC expires). Physician signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionKTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-red-900">Medicare Part A Disclaimer</h3>
        </div>
        <p className="text-red-800 text-sm">
          <strong>Section K</strong> is a component of the Minimum Data Set (MDS) used for <strong>Medicare Part A (PPS/PDPM)</strong> reimbursement. It is NOT used for Medicare Part B billing. Ensure you are documenting for the correct payer source.
        </p>
      </div>

      <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-900">SLP Component in PDPM (Section K)</h3>
        </div>
        <p className="text-purple-800 text-sm mb-6">
          Under the Patient Driven Payment Model (PDPM), the SLP component is calculated based on five key factors.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Acute Neurologic Condition", desc: "Is the primary diagnosis an acute neuro condition?", icon: ActivityIcon },
            { title: "SLP-Related Comorbidity", desc: "e.g., ALS, Aphasia, Laryngeal Cancer, Apraxia.", icon: Stethoscope },
            { title: "Cognitive Impairment", desc: "Based on BIMS score or Staff Assessment (C0500).", icon: Brain },
            { title: "Mechanically Altered Diet", desc: "K0510C2 (Mechanically Altered) or K0510D2 (Therapeutic).", icon: UtensilsIcon },
            { title: "Swallowing Disorder", desc: "K0100 signs: Loss of liquids, holding food, coughing, pain.", icon: AlertTriangle },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <item.icon className="w-5 h-5 text-purple-500 mb-2" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Documentation Tip: Section K</h3>
        <p className="text-sm text-slate-600 mb-4">
          To capture a Swallowing Disorder for PDPM, you must document <strong>signs and symptoms</strong> (coughing, choking, pocketing), not just the presence of a diet order.
        </p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
              <XCircle className="w-4 h-4" /> Poor
            </div>
            "Pt on puree diet."
          </div>
          <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Better
            </div>
            "Pt observed coughing x3 with thin liquids; requires puree to prevent aspiration."
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentationTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Skilled Terminology
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avoid (Passive)</h4>
              <div className="flex flex-wrap gap-2">
                {['Observed', 'Monitored', 'Encouraged', 'Reminded', 'Supervised'].map(word => (
                  <span key={word} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-100">{word}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Use (Active/Skilled)</h4>
              <div className="flex flex-wrap gap-2">
                {['Analyzed', 'Assessed', 'Facilitated', 'Modified', 'Instructed', 'Redirected', 'Graded'].map(word => (
                  <span key={word} className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md border border-green-100">{word}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">The "So What?" Test</h3>
          <p className="text-sm text-slate-600 mb-4">
            After writing a note, ask yourself: <strong>"So what?"</strong> Why did <em>I</em> need to be there? Could a nurse or family member have done this?
          </p>
          <div className="bg-slate-50 p-4 rounded-xl text-sm italic text-slate-600 border-l-4 border-blue-500">
            "Pt completed oral motor exercises." <br/>
            <span className="text-slate-400 not-italic text-xs block mt-1">vs.</span>
            "SLP provided tactile cues to lips to increase closure and reduce anterior spillage during bolus hold."
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Common Documentation Focus Areas
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-orange-800">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />Cloning notes (copy/paste)</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />Missing total time or treatment minutes</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />No physician signature on POC</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />Goals not updated despite progress</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" />Frequency/Duration exceeded without order</li>
        </ul>
      </div>
    </motion.div>
  );
}

// Icons
function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function UtensilsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}
