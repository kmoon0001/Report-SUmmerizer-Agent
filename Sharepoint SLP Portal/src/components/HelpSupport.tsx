import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  MessageSquare, 
  Settings, 
  Upload, 
  ChevronRight, 
  Mail, 
  FileText, 
  Lock, 
  Server, 
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Layout,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

interface HelpSupportProps {
  onBack?: () => void;
}

import { LocalAIModelManager } from './LocalAIModelManager';
import { useAI } from '../context/AIContext';

export function HelpSupport({ 
  onBack
}: HelpSupportProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'tech' | 'compliance' | 'feedback' | 'customize' | 'upload' | 'features'>('guide');

  const renderContent = () => {
    switch (activeTab) {
      case 'guide':
        return <UserGuide />;
      case 'tech':
        return <TechSupport />;
      case 'compliance':
        return <ComplianceInfo />;
      case 'feedback':
        return <FeedbackForm />;
      case 'customize':
        return null; // Removed non-functional customization panel
      case 'upload':
        return <ResourceUpload />;
      case 'features':
        return <FeatureToggles />;
      default:
        return <UserGuide />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Help & Support Center</h2>
          <p className="text-slate-500 text-lg">Comprehensive resources, customization, and clinical safeguards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <NavButton active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} icon={BookOpen} label="User Guide" />
          <NavButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} icon={Activity} label="Tech Support" />
          <NavButton active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} icon={ShieldCheck} label="Privacy & AI Safety" />
          <NavButton active={activeTab === 'features'} onClick={() => setActiveTab('features')} icon={Settings} label="Feature Flags" />
          <NavButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={Upload} label="Upload Resource" />
          <NavButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={MessageSquare} label="Feedback" />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      aria-label={`Navigate to ${label}`}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm text-left",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
          : "bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400")} />
      {label}
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );
}

function UserGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Platform User Guide</h3>
        <p className="text-slate-500">Master the Pacific Coast SLP ecosystem.</p>
      </div>

      <div className="grid gap-6">
        <GuideCard 
          title="Clinical Navigation" 
          icon={Activity}
          steps={[
            "Use the sidebar for quick access to major clinical domains.",
            "Use the 'Quick Access' cards on the dashboard for your most frequent tools.",
            "Search bar (Cmd+K) instantly filters all resources and PDFs."
          ]}
        />
        <GuideCard 
          title="AI Documentation Assistant" 
          icon={FileText}
          steps={[
            "Select 'Documentation Assistant' from the dashboard.",
            "Choose your document type (Eval, Note, Goal).",
            "Select clinical parameters (Domain, Assist Level).",
            "Review, Edit, and Remix the AI-generated draft."
          ]}
        />
        <GuideCard 
          title="Resource Library" 
          icon={BookOpen}
          steps={[
            "Access the PDF Vault for standardized assessments.",
            "Use the 'Handout Studio' to generate patient education materials.",
            "Upload your own resources via the 'Upload Resource' tab in Settings."
          ]}
        />
      </div>
    </div>
  );
}

function GuideCard({ title, icon: Icon, steps }: any) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-900">{title}</h4>
      </div>
      <ul className="space-y-3">
        {steps.map((step: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechSupport() {
  const faqs = [
    { q: "Why isn't the PDF loading?", a: "Ensure you have a stable internet connection. Some firewalls may block external PDF sources. Try opening the link in a new tab." },
    { q: "Is my data saved?", a: "This is a stateless application for security. No patient data is permanently stored on our servers. Local preferences are saved to your browser." },
    { q: "How do I print a handout?", a: "Click the 'Print' icon in the top right of any module, or use the browser's print function (Cmd+P)." },
    { q: "The AI response seems incorrect.", a: "AI is a support tool. Always verify with clinical judgment. Use the 'Remix' button to regenerate or edit the text manually." }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Technical Support</h3>
        <p className="text-slate-500">Common solutions and troubleshooting.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 transition-colors">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {faq.q}
            </h4>
            <p className="text-slate-500 text-sm ml-6">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-8 mt-8">
        <h4 className="font-bold text-lg mb-2">Still need help?</h4>
        <p className="text-slate-400 text-sm mb-6">Contact our engineering team directly.</p>
        <a 
          href="mailto:KevinMoon7@gmail.com"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email Support
        </a>
      </div>
    </div>
  );
}

function ComplianceInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Privacy & AI Safety</h3>
        <p className="text-slate-500">HIPAA compliance and gold-standard guardrails.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-emerald-900">HIPAA Compliance</h4>
          </div>
          <p className="text-emerald-800 text-sm leading-relaxed mb-4">
            This application is designed as a <strong>Zero-Retention</strong> environment. 
            We do not store, transmit, or process Protected Health Information (PHI).
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> No Patient Names Stored
            </li>
            <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> No Medical Record Numbers
            </li>
            <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Local-Only Session State
            </li>
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-indigo-900">AI Safety Guardrails</h4>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed mb-4">
            Our AI models operate under strict clinical system instructions ("Gold Standard").
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <ShieldCheck className="w-4 h-4" /> Authoritative Sources Only (ASHA, CMS)
            </li>
            <li className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <ShieldCheck className="w-4 h-4" /> No Diagnostic Claims
            </li>
            <li className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <ShieldCheck className="w-4 h-4" /> Human-in-the-Loop Verification Required
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `mailto:KevinMoon7@gmail.com?subject=App Feedback&body=${encodeURIComponent(message)}%0A%0AFrom: ${email}`;
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Feedback Received!</h3>
        <p className="text-slate-500">Thank you for helping us improve. Opening your email client...</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Community Feedback</h3>
        <p className="text-slate-500">Help shape the future of this platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Feedback / Suggestion</label>
          <textarea 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all h-32 resize-none"
            placeholder="I think it would be great if..."
          />
        </div>
        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

function FeatureToggles() {
  const { features, toggleFeature } = useAI();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Feature Flags</h3>
        <p className="text-slate-500">Toggle experimental and advanced features.</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Advanced AI Features</h4>
            <p className="text-sm text-slate-500">Enable generative AI capabilities (Gemini, Veo, etc.)</p>
          </div>
          <button 
            onClick={() => toggleFeature('advancedAI')}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              features.advancedAI ? "bg-blue-600" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
              features.advancedAI ? "left-7" : "left-1"
            )} />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Google Cloud Integration</h4>
            <p className="text-sm text-slate-500">Use Google Cloud API keys for paid models</p>
          </div>
          <button 
            onClick={() => toggleFeature('googleCloud')}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              features.googleCloud ? "bg-blue-600" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
              features.googleCloud ? "left-7" : "left-1"
            )} />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
          <div>
            <h4 className="font-bold text-slate-900">Microsoft Copilot</h4>
            <p className="text-sm text-slate-500">Direct integration with Microsoft 365 ecosystem (Planned Q3)</p>
          </div>
          <div className="w-12 h-6 rounded-full bg-slate-200 relative">
            <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <div>
              <h4 className="font-bold text-slate-900">Local LLM (WebGPU)</h4>
              <p className="text-sm text-slate-500">Privacy-first, browser-based inference for offline use.</p>
            </div>
            <button 
              onClick={() => toggleFeature('localLLM')}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                features.localLLM ? "bg-blue-600" : "bg-slate-200"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                features.localLLM ? "left-7" : "left-1"
              )} />
            </button>
          </div>
          
          {features.localLLM && (
            <div className="w-full pt-4 border-t border-slate-100">
              <LocalAIModelManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResourceUpload() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Upload Resource</h3>
        <p className="text-slate-500">Add PDFs or links to your local library.</p>
      </div>

      <div 
        className={cn(
          "border-2 border-dashed rounded-3xl p-12 text-center transition-all",
          dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
        )}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Upload className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">Drag & Drop files here</h4>
        <p className="text-slate-500 text-sm mb-6">Supported formats: PDF, DOCX, JPG (Max 10MB)</p>
        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
          Browse Files
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Note:</strong> Uploaded resources are stored locally in your browser cache. Clearing your cache will remove these files. Do not upload files containing PHI.
        </p>
      </div>
    </div>
  );
}
