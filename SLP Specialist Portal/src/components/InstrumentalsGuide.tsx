import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Truck, 
  Calendar, 
  ClipboardCheck,
  Video,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function InstrumentalsGuide() {
  const [activeTab, setActiveTab] = useState<'compare' | 'decision' | 'process'>('compare');
  const [isPatientView, setIsPatientView] = useState(false);

  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-50 relative">
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Instrumental Assessments</h2>
          <p className="text-slate-500">MBSS vs. FEES Decision Guide & Process</p>
          
          <div className="flex gap-4 mt-6">
            <TabButton 
              active={activeTab === 'compare'} 
              onClick={() => setActiveTab('compare')}
              label="Comparison"
            />
            <TabButton 
              active={activeTab === 'decision'} 
              onClick={() => setActiveTab('decision')}
              label="Decision Guide"
            />
            <TabButton 
              active={activeTab === 'process'} 
              onClick={() => setActiveTab('process')}
              label="Referral Process"
            />
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
        {activeTab === 'compare' && <ComparisonView />}
        {activeTab === 'decision' && <DecisionView />}
        {activeTab === 'process' && <ProcessView />}
      </div>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Instrumental Assessments" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        active 
          ? "bg-blue-100 text-blue-700 shadow-sm" 
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {label}
    </button>
  );
}

function ComparisonView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* MBSS Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-48">
          <img 
            src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800" 
            alt="MBSS X-Ray" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">MBSS / VFSS</h3>
            </div>
            <p className="text-slate-300 text-sm">Modified Barium Swallow Study</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Pros
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Views all 3 phases (Oral, Pharyngeal, Esophageal)</li>
              <li>• Gold standard for aspiration detection</li>
              <li>• Can screen esophagus</li>
              <li>• Lateral and A-P views available</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              Cons
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Radiation exposure (time limited)</li>
              <li>• Barium taste/texture unnatural</li>
              <li>• Requires transport to radiology</li>
              <li>• Expensive</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FEES Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-48">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
            alt="FEES Endoscopy" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">FEES</h3>
            </div>
            <p className="text-slate-300 text-sm">Fiberoptic Endoscopic Evaluation of Swallowing</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Pros
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Portable (bedside) - No transport needed</li>
              <li>• No radiation (unlimited time)</li>
              <li>• Direct view of larynx/vocal folds</li>
              <li>• Uses real food (no barium)</li>
              <li>• Assessing secretion management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              Cons
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• "Whiteout" during actual swallow</li>
              <li>• Cannot view oral or esophageal phases</li>
              <li>• Invasive (camera in nose)</li>
              <li>• Patient tolerance issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionView() {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Choose MBSS if...</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Suspect esophageal dysphagia (globus, sticking low)",
            "Need to assess oral phase deficits clearly",
            "Patient cannot tolerate nasal scope",
            "Suspect anatomical structural issues (diverticulum)",
            "Need to verify aspiration with absolute certainty"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm text-blue-800 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">Choose FEES if...</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Patient is in ICU / Isolation / Cannot transport",
            "Need to assess secretion management",
            "Suspect vocal fold paralysis/paresis",
            "Need extended meal observation (fatigue)",
            "Patient is bariatric or cannot fit in fluoro chair",
            "Biofeedback therapy is planned"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm text-emerald-800 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProcessView() {
  const steps = [
    {
      icon: FileText,
      title: "1. Obtain Order",
      desc: "Request MD order for 'MBSS' or 'FEES'. Include diagnosis (e.g., Dysphagia R13.10) and reason (e.g., weight loss, coughing w/ liquids)."
    },
    {
      icon: Calendar,
      title: "2. Schedule",
      desc: "Call Radiology (MBSS) or Mobile FEES provider. Coordinate with nursing for transport if going out."
    },
    {
      icon: Truck,
      title: "3. Transport / Prep",
      desc: "For MBSS: Arrange ambulance/van. Ensure NPO status if required. For FEES: Ensure patient is upright and suction is available."
    },
    {
      icon: ClipboardCheck,
      title: "4. Analyze & Document",
      desc: "Review report immediately. Update diet orders. Document 'Skilled Note' referencing the instrumental results and new plan of care."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
        
        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-8"
            >
              <div className="relative z-10 w-16 h-16 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
