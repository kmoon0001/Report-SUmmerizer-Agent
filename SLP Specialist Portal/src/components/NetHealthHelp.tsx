import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Star,
  ClipboardList,
  Compass,
  Library,
  ExternalLink,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { DocumentViewer } from './DocumentViewer';
import { DOCUMENTS, DocumentContent } from '../data/documents';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export const NetHealthHelp: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'performance' | 'workflows' | 'troubleshooting' | 'navigation' | 'library'>('performance');
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentContent | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);

  const PERFORMANCE_KEY = [
    {
      category: "Cognitive Processes (Problem Solving, Memory)",
      levels: [
        { name: "Independent (I)", desc: "Patient independently completes task without any assistance, delay, compensations or adaptations." },
        { name: "Modified Independent (MI)", desc: "Patient independently completes the task; may need extra time to facilitate safe, cognitive performance during daily activities and/or recognizes the need to use strategies, compensations and/or adaptations, when needed." },
        { name: "Set-Up (S/U)", desc: "Patient performs the task independently; however, after set up assistance from a caregiver." },
        { name: "Supervision (SUP)", desc: "Requires distant supervision and/or verbal, visual cueing from a caregiver to initiate or complete the task." },
        { name: "Stand By Assist (SBA)", desc: "Requires close supervision and/or verbal, visual, and/or tactile cueing from a caregiver to initiate or complete the task." },
        { name: "Mild", desc: "Able to perform at least 75% of the task; requires 25% assistance." },
        { name: "Moderate (Mod)", desc: "Able to perform at least 50% of the task; requires 50% assistance." },
        { name: "Severe", desc: "Able to perform at least 25% of the task; requires 75% assistance." },
        { name: "Marked", desc: "Totally dependent upon the caregiver for cognitive functioning; attempts to participate." },
        { name: "Profound", desc: "Totally dependent; rarely attempts to participate." }
      ]
    },
    {
      category: "Communication (Voice, Auditory Comp, Expression, Motor Speech)",
      levels: [
        { name: "Independent (I)", desc: "Independently completes communication exchange without assistance or delay. Socialization/vocational activities not limited by language." },
        { name: "Modified Independent (MI)", desc: "Independent but may need extra time or strategies/devices to facilitate performance or repair breakdowns." },
        { name: "Set-Up (S/U)", desc: "Independent after set-up assistance or distant supervision/cueing due to level of structure or unfamiliarity." },
        { name: "Supervision (SUP)", desc: "Requires distant supervision/cueing to initiate or complete task when experiencing difficulty." },
        { name: "Stand By Assistance (SBA)", desc: "Requires close supervision/cueing to initiate or complete task when experiencing difficulty." },
        { name: "Mild", desc: "Able to complete at least 75% of the task; requires 25% assistance." },
        { name: "Moderate (Mod)", desc: "Able to complete at least 50% of the task; requires 50% assistance." },
        { name: "Severe (Sev)", desc: "Able to complete at least 25% of the task; requires 75% assistance." },
        { name: "Marked (Mrkd)", desc: "Totally dependent on caregiver to recognize need for strategies; burden of communication is on listener." },
        { name: "Profound (Prof)", desc: "Totally dependent; little or no communication attempts. Burden on listener." }
      ]
    },
    {
      category: "Reading Comprehension & Pragmatic Skills",
      levels: [
        { name: "Independent (I)", desc: "Demonstrates independence in the task." },
        { name: "Modified Independent (MI)", desc: "Independent but requires additional time or adaptive equipment/devices." },
        { name: "Set-Up (S/U)", desc: "Independent after set-up from a caregiver." },
        { name: "Supervision (SUP)", desc: "Independent but requires distant supervision/cueing to initiate or complete task." },
        { name: "Stand By Assistance (SBA)", desc: "Independent but requires close supervision/cueing to initiate or complete task." }
      ]
    },
    {
      category: "Oral-Peripheral Examination (Labial/Lingual Function)",
      levels: [
        { name: "WFL", desc: "Within Functional Limits." },
        { name: "Mild", desc: "Performs at least 75% of the task." },
        { name: "Moderate", desc: "Performs at least 50% of the task." },
        { name: "Severe", desc: "Performs at least 25% of the task." },
        { name: "Profound", desc: "Performs <25% of the task." }
      ]
    },
    {
      category: "Swallowing",
      levels: [
        { name: "Independent (I)", desc: "Safely consumes oral intake independently without any assistance or diet restrictions. All needs met by mouth." },
        { name: "Modified Independent (MI)", desc: "Independent with swallowing; may need extra time or strategies/compensations/diet modifications. All needs met by mouth." },
        { name: "Supervision (SUP)", desc: "Swallowing is safe; needs distant supervision/cueing to initiate/complete task or use strategies. All needs met by mouth." },
        { name: "Stand By Assist (SBA)", desc: "Safe with close supervision/cueing. All needs met by mouth." },
        { name: "Mild", desc: "Performs at least 75% of task; requires 25% assist (cues or diet restrictions). Takes up to 75% of nutrition by mouth." },
        { name: "Moderate (Mod)", desc: "Performs at least 50% of task; requires 50% assist. Takes up to 75% of nutrition by mouth." },
        { name: "Severe (Sev)", desc: "Performs at least 25% of task; requires 75% assist. Takes up to 50% of nutrition by mouth (single consistency)." },
        { name: "Marked (Mrkd)", desc: "Dependent for primary nutrition/hydration; unable to safely consume >25% by mouth. Requires max cues." },
        { name: "Profound (Prof)", desc: "Dependent on alternate feeding methods; may safely consume therapeutic trials only. Requires max cues." }
      ]
    }
  ];

  const TROUBLESHOOTING = [
    {
      error: "This record (Caseload) cannot be saved because it was modified by someone else...",
      cause: "Often caused by moving the computer through Wi-Fi access points before saving, causing a momentary loss of internet.",
      fix: "Save work BEFORE moving the computer. If it occurs, you may need to refresh or re-enter unsaved data."
    },
    {
      error: "Object reference not set to an instance of an object",
      cause: "Dates are not in sync (Beginning/End dates of case vs. site stay).",
      fix: "Check that Beginning/End dates of case match site stay and PCC admit/dc dates. Correct dates in Projections."
    },
    {
      error: "Error accepting changes for table: TxDocumentItemReview",
      cause: "Case is under the incorrect site stay or a closed site stay.",
      fix: "Validate case references the correct site stay. Move or request case move to correct site stay."
    }
  ];

  const renderContent = () => (
    <div className="space-y-12 text-left relative">
      {/* Patient View Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/10 backdrop-blur-sm shadow-lg rounded-full hover:bg-white/20 transition-colors border border-white/20"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-white" />
        </button>
      </div>
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">NetHealth Mastery</h2>
              <p className="text-slate-400 font-medium italic">Authoritative Guide for Rehab Optima Documentation</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
            {[
              { id: 'performance', label: 'Performance Key', icon: Star },
              { id: 'workflows', label: 'Workflows', icon: ClipboardList },
              { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
              { id: 'navigation', label: 'System Navigation', icon: Compass },
              { id: 'library', label: 'Resource Library', icon: Library }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'performance' && (
            <div className="space-y-10">
              {PERFORMANCE_KEY.map((section, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{section.category}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.levels.map((level, lIdx) => (
                      <div key={lIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">{level.name}</div>
                        <p className="text-sm text-slate-600 leading-relaxed">{level.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Evaluation Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <h4 className="text-xl font-black text-slate-900">Completing an Evaluation</h4>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <p className="text-sm text-slate-600">Select <b>Start New Track</b> in the discipline therapy card within Case Manager.</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <p className="text-sm text-slate-600">Select <b>Type(s) of Therapy</b> needed (at least one required).</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <p className="text-sm text-slate-600">Enter <b>Start of Care</b> date. Thru date will auto-populate.</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
                        <p className="text-sm text-slate-600">Complete <b>General Tab</b>: Clinician, Supervised By, Physician, and ICD-10 codes.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest mb-2">
                        <AlertCircle className="w-4 h-4" />
                        Pro Tip: Auto-Save
                      </div>
                      <p className="text-xs text-amber-700">NetHealth auto-saves every 5 minutes when transitioning between sections. If you leave a section without moving to the next, data may be lost.</p>
                    </div>
                  </div>
                </div>

                {/* Second Eval Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <h4 className="text-xl font-black text-slate-900">Adding a Second Evaluation</h4>
                  </div>
                  <div className="p-8 space-y-6">
                    <p className="text-sm text-slate-500 italic">Example: Adding cognitive goals to an existing dysphagia track.</p>
                    <ul className="space-y-4">
                      {[
                        "Obtain orders for new evaluation and treatment.",
                        "Write new orders in PCC with new type of eval and ICD-10 codes.",
                        "In NetHealth, click 'Create' on the existing track.",
                        "Choose the evaluation document type.",
                        "Check only the evaluation type you are performing that day.",
                        "On the first TEN note, both tracks will merge into one."
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recertification Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <h4 className="text-xl font-black text-slate-900">Recertification Process</h4>
                  </div>
                  <div className="p-8 space-y-6">
                    <ul className="space-y-4">
                      {[
                        "Click 'Create' next to the Document Due in Case Manager.",
                        "Update both ST and LT goals in the 'Plan of Treatment - Goals' tab.",
                        "Required updates are highlighted in pink/red.",
                        "Select 'Update' on each goal to enter current status.",
                        "Move to 'Assessment' tab and update all required sections.",
                        "Optionally include Functional Outcome data collection."
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                          <p className="text-sm text-slate-600">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Discharge Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <h4 className="text-xl font-black text-slate-900">Discharge Summary</h4>
                  </div>
                  <div className="p-8 space-y-6">
                    <ul className="space-y-4">
                      {[
                        "Select 'End Track' button in the therapy track.",
                        "Confirm end date (auto-filled from last billed date).",
                        "Select reason and destination for discharge.",
                        "Update all ST and LT goals to 'Goal Met' or 'Discontinued'.",
                        "Complete 'Assessment' tab and Functional Outcome data.",
                        "Finalizing the summary ends the therapy track."
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                          <p className="text-sm text-slate-600">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Template Specs */}
                <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-sm text-white lg:col-span-2">
                  <div className="bg-white/5 p-6 border-b border-white/10">
                    <h4 className="text-xl font-black">SLP Documentation Template Specs</h4>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-blue-400 font-bold text-xs uppercase tracking-widest">Evaluation Template</h5>
                      <ul className="space-y-2 text-xs text-slate-400">
                        <li>• Reason for Referral / Medical Necessity</li>
                        <li>• Pertinent Medical History</li>
                        <li>• Objective Assessment Tools (MBSImP, FOIS, MoCA, etc.)</li>
                        <li>• Oral Mech / Speech / Swallow / Cognition Findings</li>
                        <li>• Functional Impact & Skilled Need Rationale</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-blue-400 font-bold text-xs uppercase tracking-widest">Daily Treatment Note</h5>
                      <ul className="space-y-2 text-xs text-slate-400">
                        <li>• Skilled Intervention (Swallow training, Cog retraining)</li>
                        <li>• Patient Response (Min cues, Tolerated well, etc.)</li>
                        <li>• Progress Toward Goals (Mandatory)</li>
                        <li>• Plan for Next Session</li>
                        <li>• Minutes / CPT Codes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'troubleshooting' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TROUBLESHOOTING.map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
                      <AlertCircle className="w-4 h-4" />
                      Error Message
                    </div>
                    <p className="text-sm font-bold text-slate-900 bg-red-50 p-3 rounded-xl border border-red-100">"{item.error}"</p>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Root Cause</div>
                      <p className="text-sm text-slate-600">{item.cause}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Resolution</div>
                      <p className="text-sm text-slate-600">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-xl font-black text-slate-900">Daily Activity Log</h4>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">The primary interface for logging patient sessions and non-patient care activities.</p>
                  <ul className="space-y-3">
                    {[
                      "Select Date of Service (Today, Yesterday, Custom).",
                      "Filter patient list by 'all patients' or 'user's list'.",
                      "Add Encounter to log treatment minutes.",
                      "Log Missed Visit if patient was not treated.",
                      "Log Non-Patient Care (Billing, Meetings, Screens)."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-xl font-black text-slate-900">E-Signatures Console</h4>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Required for finalizing billing and clinical documentation.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-sm mb-1">Section 1</div>
                      <p className="text-xs text-slate-500">Patients and dates requiring signature; view linked TENs.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-sm mb-1">Section 2</div>
                      <p className="text-xs text-slate-500">Codes and minutes charged for the selected date.</p>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 font-bold italic">Note: Red items indicate incomplete TEN notes that must be finished before signing.</p>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-sm space-y-6 text-white md:col-span-2">
                <h4 className="text-xl font-black">Projection Screen 2.0 Reference</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="text-orange-400 font-bold text-[10px] uppercase tracking-widest">Orange</div>
                    <p className="text-xs text-slate-400">Planned Discharge Date</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-green-400 font-bold text-[10px] uppercase tracking-widest">Green</div>
                    <p className="text-xs text-slate-400">ARD Range</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-red-400 font-bold text-[10px] uppercase tracking-widest">Red Text</div>
                    <p className="text-xs text-slate-400">Out of Compliance with POC</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Light Blue</div>
                    <p className="text-xs text-slate-400">Start of Therapy Week</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <b>PDPM Tx Suggestions:</b> Displayed in the lower right corner once Case Mix Group is known. Compares estimated minutes to actual minutes (Suggested Tx Difference).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col justify-between min-h-[200px]"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{doc.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-full">
                            {doc.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {doc.pages.length} Pages
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Open Document</span>
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Document Viewer Overlay */}
      <AnimatePresence>
        {selectedDoc && (
          <DocumentViewer 
            document={selectedDoc} 
            onClose={() => setSelectedDoc(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="NetHealth Help" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
};
