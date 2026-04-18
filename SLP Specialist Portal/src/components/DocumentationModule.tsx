import React, { useState } from 'react';
import { FileText, Save, Copy, Check } from 'lucide-react';

export function DocumentationModule() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const templates: Record<string, string> = {
    'medicare-assessment': 'SUBJECTIVE: Patient is a [Age]-year-old [Gender] referred for evaluation of [Condition] following [Event].\n\nOBJECTIVE: Clinical evaluation revealed [Objective Findings]. Patient demonstrates [Deficits].\n\nASSESSMENT: Patient presents with [Diagnosis] and is at risk for [Complications].\n\nMEDICAL NECESSITY: Skilled SLP intervention is required because [Medical Necessity Statement].\n\nRISKS WITHOUT INTERVENTION: Without skilled intervention, the patient is at risk for [Risks of No Intervention].\n\nPLAN: [Frequency] for [Duration]. Long-term goal: [Goal].',
    'medicare-progress': 'Patient has been receiving skilled SLP services [Frequency] to address [Goal]. Patient has made [Progress Level] progress. Currently, patient demonstrates [Objective Data] toward goals. Skilled intervention remains necessary to [Justification for Continued Skilled Need]. Continued skilled SLP services are recommended for [Duration].',
    'medicare-daily': 'Patient participated in [Minutes] minute skilled SLP session focusing on [Goal]. SLP provided skilled [Intervention] to facilitate [Outcome]. Patient responded [Response]. Progress toward long-term goal of [Goal] is noted. Plan: Continue current POC, focusing next session on [Focus Area].',
    'medicare-discharge': 'Patient is being discharged from skilled SLP services today. Over the course of treatment, the patient has [Summary of Progress]. Patient now [Final Status]. Patient has achieved [Level of Independence] and no longer requires skilled SLP intervention. Patient and caregiver have been educated on the home exercise program. No further skilled SLP services are required.',
    'informed-consent': 'I, [SLP Name], provided this information to [Patient Name]. The following family members were in attendance: [Names]. The [Test Name] has shown difficulties with your swallow, leading to [Aspiration/Residue] because of [Physiological Impairment] and [Medical Diagnosis]. I have explained the risks of [Current Diet] vs. [Recommended Diet], including pneumonia, malnutrition, and dehydration. The patient/family [Agreed/Declined] the recommendations.',
    'bedside-eval': 'SUBJECTIVE: Patient alert and oriented x[1-4]. Chief complaint: [Complaint].\n\nOBJECTIVE: Oral Mech Exam: [WNL/Deficits]. PO Trials: [Consistencies] presented. \n- Thin Liquids: [Safe/Cough/Wet Voice]\n- Nectar Thick: [Safe/Cough/Wet Voice]\n- Puree: [Safe/Residue]\n- Solids: [Safe/Mastication Issues]\n\nASSESSMENT: Patient presents with [Severity] [Type] dysphagia characterized by [Characteristics]. Prognosis is [Good/Fair/Poor] due to [Factors].\n\nPLAN: Recommend [Diet Level]. Skilled SLP services recommended [Frequency] for [Duration] to address [Goals].',
    'swallow-eval-comprehensive': 'SUBJECTIVE: [Patient History/Medical Status]\n\nOBJECTIVE: \n- Oral Mech Exam: [Findings]\n- Cranial Nerve Exam: [Findings]\n- PO Trials: [Consistencies] [Results]\n\nASSESSMENT: [Severity] [Type] Dysphagia. [Aspiration/Penetration] risk: [Low/Mod/High].\n\nPLAN: [Diet/Strategies/Therapy].',
    'language-eval': 'SUBJECTIVE: Patient presents with [Primary Complaint].\n\nOBJECTIVE: Standardized Testing: [Test Name] - [Score].\n- Auditory Comprehension: [Results]\n- Verbal Expression: [Results]\n- Reading/Writing: [Results]\n\nASSESSMENT: Patient presents with [Severity] [Type] Aphasia. Prognosis is [Good/Fair/Poor].\n\nPLAN: Recommend [Frequency] therapy to address [Goals].',
    'mbs-report': 'Patient seen for MBSS. \n\nLateral View:\n- Oral Phase: [Bolus formation, transit time, residue]\n- Pharyngeal Phase: [Initiation timing, hyolaryngeal excursion, epiglottic inversion]\n- Esophageal Phase: [Screening results]\n\nAP View: [Symmetry, residue]\n\nImpressions: [Severity] dysphagia with [Aspiration/Penetration] on [Consistencies]. \n\nRecommendations: [Diet], [Strategies], [Therapy Plan].',
    'daily-note': 'Patient participated in [Minutes] minute session for [Therapy Type]. \n\nInterventions:\n- [Intervention 1]: [Response]\n- [Intervention 2]: [Response]\n\nProgress:\n- Goal 1: [Data]\n- Goal 2: [Data]\n\nPlan: Continue current POC. Focus next session on [Focus Area].',
    'progress-note': 'Progress Note (Week [X]):\n\nCurrent Status: Patient has made [Level] progress toward goals.\n\nGoal Analysis:\n1. [Goal]: [Current Level] (Baseline: [Baseline])\n2. [Goal]: [Current Level] (Baseline: [Baseline])\n\nBarriers: [Barriers to progress]\n\nUpdated Plan: [Continue/Modify/Discharge] POC. New frequency: [Frequency].'
  };

  const templateNames: Record<string, string> = {
    'medicare-assessment': 'Medicare Assessment (Evaluation)',
    'medicare-progress': 'Medicare Progress/Recertification',
    'medicare-daily': 'Medicare Daily Note',
    'medicare-discharge': 'Medicare Discharge Note',
    'informed-consent': 'Informed Consent (Dysphagia)',
    'bedside-eval': 'Clinical Swallow Eval (SOAP)',
    'swallow-eval-comprehensive': 'Comprehensive Swallow Eval',
    'language-eval': 'Language Assessment',
    'mbs-report': 'MBSS Report Standard',
    'daily-note': 'Daily Treatment Note',
    'progress-note': 'Progress Report',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Documentation Assistant</h3>
          <p className="text-slate-500">Generate compliant notes using clinical templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-1 space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Template</label>
          <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[500px] pr-2">
            {Object.keys(templates).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedTemplate(key);
                  setNote(templates[key]);
                }}
                className={`p-3 text-left rounded-lg text-sm font-medium transition-all ${
                  selectedTemplate === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {templateNames[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 relative">
            <textarea
              className="w-full h-full min-h-[400px] p-6 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm whitespace-pre-wrap"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Select a template above or start typing..."
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setNote('')}
              className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Clear
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
              <Save className="w-5 h-5" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
