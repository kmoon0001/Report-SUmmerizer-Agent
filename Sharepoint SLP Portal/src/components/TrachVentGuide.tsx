import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Wind, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Settings,
  Mic,
  BookOpen,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function TrachVentGuide() {
  const [activeSection, setActiveSection] = useState<'basics' | 'assessment' | 'speaking-valves' | 'troubleshooting' | 'evidence'>('basics');
  const [isPatientView, setIsPatientView] = useState(false);

  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-50 relative">
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Trach & Vent Management</h2>
              <p className="text-slate-500">Subacute & SNF Clinical Resource</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <NavButton active={activeSection === 'basics'} onClick={() => setActiveSection('basics')} label="Anatomy & Basics" icon={BookOpen} />
            <NavButton active={activeSection === 'assessment'} onClick={() => setActiveSection('assessment')} label="Assessment" icon={Stethoscope} />
            <NavButton active={activeSection === 'speaking-valves'} onClick={() => setActiveSection('speaking-valves')} label="Speaking Valves" icon={Mic} />
            <NavButton active={activeSection === 'troubleshooting'} onClick={() => setActiveSection('troubleshooting')} label="Troubleshooting" icon={AlertTriangle} />
            <NavButton active={activeSection === 'evidence'} onClick={() => setActiveSection('evidence')} label="Evidence & Templates" icon={FileText} />
          </div>
        </div>
        {!isPatientView && (
          <button
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-bold text-sm"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeSection === 'basics' && <BasicsSection key="basics" />}
          {activeSection === 'assessment' && <AssessmentSection key="assessment" />}
          {activeSection === 'speaking-valves' && <ValvesSection key="valves" />}
          {activeSection === 'troubleshooting' && <TroubleshootingSection key="troubleshooting" />}
          {activeSection === 'evidence' && <EvidenceSection key="evidence" />}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Trach & Vent Management" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}

function NavButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
        active 
          ? "bg-cyan-100 text-cyan-800 shadow-sm ring-1 ring-cyan-200" 
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function BasicsSection() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Tracheostomy Tube Components
          </h3>
          <ul className="space-y-4">
            <ComponentItem title="Outer Cannula" desc="Main tube maintaining stoma patency." />
            <ComponentItem title="Inner Cannula" desc="Removable liner for cleaning/secretion management." />
            <ComponentItem title="Cuff" desc="Inflatable balloon to seal airway for mechanical ventilation." />
            <ComponentItem title="Pilot Balloon" desc="External indicator of cuff inflation status." />
            <ComponentItem title="Obturator" desc="Guide for insertion; must be at bedside." />
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Ventilation Basics
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Mechanical ventilation provides oxygen when patients cannot breathe independently. 
            Key terms: PEEP (positive end-expiratory pressure), PIP (peak inspiratory pressure), Tidal Volume (Vt).
          </p>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900">Breath Types</h4>
            <p className="text-sm text-slate-600 mt-1">
              Controlled (Ventilator-driven), Assisted (Patient-triggered, vent-supported), Spontaneous (Patient-driven).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex flex-col">
      <span className="font-bold text-slate-800 text-sm">{title}</span>
      <span className="text-slate-500 text-sm">{desc}</span>
    </li>
  );
}

function AssessmentSection() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Bedside Clinical Assessment</h3>
        <div className="space-y-6">
          <StepItem number="1" title="Chart Review & Vitals" desc="Check FiO2 requirements, PEEP settings, secretion status, and weaning plan. Ensure patient is medically stable (O2 sats > 92%, HR stable)." />
          <StepItem number="2" title="Oral Mechanism Exam" desc="Assess secretions, oral hygiene, and strength/coordination of oral structures." />
          <StepItem number="3" title="Cuff Deflation (The Critical Step)" desc="MUST suction orally and tracheally FIRST. Deflate cuff slowly. Monitor vitals. If sats drop, re-inflate and stop." />
          <StepItem number="4" title="Finger Occlusion Trial" desc="Occlude trach hub on exhalation. Ask patient to voice 'Ah'. Assess voice quality and ability to breathe through upper airway." />
          <StepItem number="5" title="Blue Dye Test (Modified Evans)" desc="Screening tool. Use small amount of blue dye in ice chips/applesauce. Suction immediately after and monitor secretions for 24 hours. High false negative rate (50%)." />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900">Safety Warning: Blue Dye Test</h4>
          <p className="text-amber-800 text-sm mt-1">
            The Modified Evans Blue Dye Test is a screening tool ONLY. It has a high false-negative rate (up to 50%). 
            A negative blue dye test does NOT rule out aspiration. Instrumental assessment (FEES/MBSS) is recommended for definitive diagnosis.
            <br/><br/>
            <strong>Do NOT use standard food coloring</strong> (contains FD&C Blue No. 1 which can be absorbed). Use sterile methylene blue or similar approved medical markers if available per facility policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValvesSection() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6 rounded-2xl overflow-hidden h-64 relative shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1583912267670-6575ad43263d?auto=format&fit=crop&q=80&w=800" 
              alt="Speaking Valve"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-6">
               <h3 className="text-xl font-bold text-white mb-1">Passy-Muir Valve (PMV)</h3>
               <p className="text-slate-200 text-sm">One-way bias-closed valve</p>
            </div>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            A one-way bias-closed valve. Opens on inhalation, closes on exhalation, forcing air up through the vocal folds and out the mouth/nose.
          </p>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Benefits
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Restores voice</li>
              <li>• Restores subglottic pressure (improves swallow & cough)</li>
              <li>• Improves secretion management</li>
              <li>• Restores smell/taste</li>
              <li>• Improves oxygenation (PEEP effect)</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
            <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              CRITICAL CONTRAINDICATIONS
            </h4>
            <ul className="space-y-2 text-sm text-rose-800 list-disc list-inside">
              <li><strong>Inflated Cuff:</strong> CUFF MUST BE DEFLATED. Placing a valve on an inflated cuff causes suffocation.</li>
              <li>Severe upper airway obstruction (stenosis, tumor).</li>
              <li>Thick, copious secretions patient cannot clear.</li>
              <li>Unstable respiratory status.</li>
              <li>Foam-filled cuffs (cannot be deflated).</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Placement Protocol</h4>
            <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
              <li>Suction oral cavity & trach.</li>
              <li>Deflate cuff FULLY.</li>
              <li>Patient coughs/clears.</li>
              <li>Place valve on hub (15mm standard).</li>
              <li>Monitor O2 sats, HR, RR, and work of breathing.</li>
              <li>Encourage voicing "Ah".</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <TroubleCard 
        problem="Patient cannot breathe when valve is on"
        cause="Upper airway obstruction, cuff not fully deflated, or granulation tissue."
        solution="REMOVE VALVE IMMEDIATELY. Check cuff. Suction. If persists, consult ENT."
      />
      <TroubleCard 
        problem="Whistling sound (Honking)"
        cause="Valve is not seated correctly or air leaking around tube."
        solution="Clean valve (warm soapy water), check fit. If air leak around stoma, may need different tube size."
      />
      <TroubleCard 
        problem="Weak Voice"
        cause="Muscle weakness, vocal fold pathology, or air leak."
        solution="ENT consult for VF visualization. Respiratory muscle training (EMST)."
      />
      <TroubleCard 
        problem="Excessive Coughing"
        cause="Sensation change, secretions, or dryness."
        solution="Humidification, suctioning prior to placement. Build tolerance slowly."
      />
    </div>
  );
}

function TroubleCard({ problem, cause, solution }: { problem: string, cause: string, solution: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="font-bold text-slate-900 mb-2">{problem}</h4>
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold text-slate-700">Possible Cause:</span> <span className="text-slate-500">{cause}</span></p>
        <p><span className="font-semibold text-slate-700">Action:</span> <span className="text-slate-500">{solution}</span></p>
      </div>
    </div>
  );
}

function EvidenceSection() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Clinical Research Summaries</h3>
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900">Swallowing Function in Stroke Patients with Tracheostomies (Seo et al., 2017)</h4>
            <p className="text-sm text-slate-600 mt-1">
              Stroke patients with tracheostomies showed inferior swallowing function and kinematics compared to those without. 
              Tracheostomy tube presence may anchor the larynx, reducing elevation and velocity, potentially increasing aspiration risk.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900">Speaking Valves and Swallowing Benefits (Fisher, 2020)</h4>
            <p className="text-sm text-slate-600 mt-1">
              Speaking valves can increase oropharyngeal sensation, restore subglottic pressure, and improve cough reflex, enhancing airway protection.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Speaking Valve Evaluation Template (Ventilator-Dependent)</h3>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 mb-4">
            Use this template for documenting speaking valve trials in ventilator-dependent patients.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs text-blue-900">
            <div><strong>Reason for Vent:</strong> ________</div>
            <div><strong>Airway Protection:</strong> Y/N</div>
            <div><strong>Secretion Management:</strong> Y/N</div>
            <div><strong>Stable O2 on Vent:</strong> Y/N</div>
            <div><strong>Cuff Deflation Tolerated:</strong> Y/N</div>
            <div><strong>Voicing Achieved:</strong> Y/N</div>
          </div>
        </div>
      </div>
    </div>
  );
}
