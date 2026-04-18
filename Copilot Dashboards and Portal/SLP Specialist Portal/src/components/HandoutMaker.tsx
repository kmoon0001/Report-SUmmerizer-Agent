import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { NotificationToast } from './layout/NotificationToast';
import { CounterCard } from './CounterCard';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Stethoscope,
  Volume2,
  Loader2,
  Activity,
  ClipboardCheck,
  ShieldAlert,
  BookOpen,
  ExternalLink,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../context/AIContext';
import { aiService } from '../services/ai-service';
import { persistenceService } from '../services/persistence-service';
import { useDashboard } from '../context/DashboardContext';
import { HANDOUT_TYPES, SUBSPECIALTIES, AUTHORITATIVE_SOURCES, LANGUAGES } from '../utils/handout-data';
import { generateHEP } from '../utils/pdf-generator';

// Removed NotificationToast definition

export function HandoutMaker() {
  const { features } = useAI();
  const { autoSaveAssets } = useDashboard();
  const [isPatientView, setIsPatientView] = useState(false);
  const [selectedType, setSelectedType] = useState(HANDOUT_TYPES[0].id);
  const [selectedSub, setSelectedSub] = useState(SUBSPECIALTIES[0]);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0].id);
  const [patientName] = useState('');
  const [clinicianName, setClinicianName] = useState('');
  const [facilityName] = useState('');
  const [details, setDetails] = useState('');
  
  // Exercise Specifics
  const [reps, setReps] = useState('10');
  const [sets, setSets] = useState('3');
  const [frequency, setFrequency] = useState('2x/day');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generatedHandout, setGeneratedHandout] = useState<{
    title: string;
    content: string;
    image?: string;
    date: string;
    docId: string;
  } | null>(null);
  const [savedHandouts, setSavedHandouts] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handoutRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reset transient status messages when context changes
  React.useEffect(() => {
    setError(null);
    setNotification(null);
  }, [selectedType, selectedSub, selectedLang, details, reps, sets, frequency]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // Load saved handouts on mount
  React.useEffect(() => {
    setSavedHandouts(persistenceService.getHandouts());
  }, []);

  const generateHandout = async () => {
    if (!features.advancedAI) {
      setError("Advanced AI features are disabled. Please enable them in Settings to generate handouts.");
      return;
    }

    setIsGenerating(true);
    setIsGeneratingImage(true);
    setError(null);
    
    try {
      const typeLabel = HANDOUT_TYPES.find(t => t.id === selectedType)?.title || selectedType;
      
      // Construct prompt based on type
      let specificInstructions = "";
      if (selectedType === 'exercise' || selectedType === 'hep') {
        specificInstructions = `
        Include specific dosage instructions:
        - Repetitions: ${reps}
        - Sets: ${sets}
        - Frequency: ${frequency}
        
        Structure the content with clear, numbered steps for each exercise.
        `;
      } else if (selectedType === 'strategies') {
        specificInstructions = `
        Focus on compensatory strategies. 
        - clearly explain the "what", "how", and "why" for each strategy.
        - Use simple, patient-friendly language.
        `;
      } else if (selectedType === 'precautions') {
        specificInstructions = `
        Focus on safety and aspiration precautions.
        - Use bold warnings where necessary.
        - Explain the signs of aspiration to watch for.
        `;
      } else if (selectedType === 'family-info') {
        specificInstructions = `
        Write from a caregiver's perspective.
        - Use "You can help by..." language.
        - Explain complex terms simply.
        - Focus on how to support the patient safely.
        `;
      }

      // 1. Generate Text Content
      const langTitle = LANGUAGES.find(l => l.id === selectedLang)?.title || 'English';
      
      const textData = await aiService.generateHandoutContent(
        typeLabel,
        selectedSub,
        langTitle,
        details,
        specificInstructions
      );

      const docId = `SLP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setGeneratedHandout({
        title: textData.title || "Clinical Handout",
        content: textData.content || "Content generation failed.",
        date: new Date().toLocaleDateString(),
        docId
      });

      // 2. Generate Image
      try {
        const imagePrompt = `A professional medical illustration for a clinical handout. Topic: ${selectedSub} - ${textData.title}. Style: Clean, anatomical, or clinical equipment focus. Minimalist, pure white background, professional medical color palette (indigo, slate, teal). No text, no labels, no people - just the anatomical or clinical focus. High resolution, 1K.`;
        const imageUrl = await aiService.generateProImage(imagePrompt, "1K");
        
        if (imageUrl) {
          setGeneratedHandout(prev => prev ? { ...prev, image: imageUrl } : null);
          
          // Auto-save to Asset Gallery if enabled
          if (autoSaveAssets && imageUrl.startsWith('data:')) {
            await persistenceService.saveGeneratedAsset({
              id: `handout-${Date.now()}`,
              type: 'image',
              data: imageUrl,
              date: new Date().toISOString(),
              prompt: `Handout: ${textData.title}`,
              metadata: {
                category: 'Handout Maker',
                topic: selectedSub
              }
            });
          }
        }
      } catch (imgErr) {
        console.error("Image generation failed", imgErr);
      } finally {
        setIsGeneratingImage(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate handout. Please try again.");
      setIsGeneratingImage(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateImage = async () => {
    if (!generatedHandout || !features.advancedAI) return;
    setIsGeneratingImage(true);
    try {
      const imagePrompt = `A professional medical illustration for ${selectedSub}. Focus: ${generatedHandout.title}. Clean, anatomical, clinical style. White background. No text.`;
      const imageUrl = await aiService.generateProImage(imagePrompt, "1K");
      
      if (imageUrl) {
        setGeneratedHandout(prev => prev ? { ...prev, image: imageUrl } : null);
        
        // Auto-save to Asset Gallery if enabled
        if (autoSaveAssets && imageUrl.startsWith('data:')) {
          await persistenceService.saveGeneratedAsset({
            id: `handout-regen-${Date.now()}`,
            type: 'image',
            data: imageUrl,
            date: new Date().toISOString(),
            prompt: `Regenerated: ${generatedHandout.title}`,
            metadata: {
              category: 'Handout Maker',
              topic: selectedSub,
              isRegeneration: true
            }
          });
        }
      }
    } catch (err) {
      console.error("Image regeneration failed", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const speakHandout = async () => {
    if (!generatedHandout || isSpeaking || !features.advancedAI) return;
    setIsSpeaking(true);
    try {
      const textToSpeak = `Handout Title: ${generatedHandout.title}. Content: ${generatedHandout.content.replace(/[#*]/g, '')}`;
      const audioData = await aiService.generateTTS(textToSpeak);
      
      if (audioData) {
        const audio = new Audio(audioData);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        // Fallback handled in aiService or here? 
        // aiService.generateTTS returns null if failed or disabled.
        // We can use window.speechSynthesis as a last resort if aiService returns null.
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("TTS failed", err);
      setIsSpeaking(false);
    }
  };

  const saveHandout = () => {
    if (!generatedHandout) return;
    
    const newHandout = {
      id: Math.random().toString(36).substring(2, 9),
      ...generatedHandout,
      type: selectedType,
      subspecialty: selectedSub
    };
    
    persistenceService.saveHandout(newHandout as any);
    setSavedHandouts(persistenceService.getHandouts());
    showNotification("Handout saved to your library!", 'success');
  };

  const deleteHandout = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      persistenceService.deleteHandout(id);
      setSavedHandouts(persistenceService.getHandouts());
      setDeleteConfirmId(null);
      showNotification("Handout deleted.", 'info');
    } else {
      setDeleteConfirmId(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handlePrint = () => {
    if (generatedHandout) {
      // Extract text content from markdown by stripping simple tags
      const plainText = generatedHandout.content
        .replace(/[#*]/g, '')
        .split('\n')
        .filter(line => line.trim().length > 0);
      
      generateHEP(generatedHandout.title, plainText);
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {isPatientView && generatedHandout && (
        <PatientViewWrapper title={generatedHandout.title} onExit={() => setIsPatientView(false)}>
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed handout-content">
            <ReactMarkdown>{generatedHandout.content}</ReactMarkdown>
          </div>
        </PatientViewWrapper>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 print:hidden">
        <div className="flex items-center gap-6">
          <CounterCard label="Handouts Created" value="24" icon={FileText} color="text-blue-600" bg="bg-blue-50" />
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded">Clinical Tool</div>
               <div className="w-1 h-1 bg-slate-300 rounded-full" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v3.0.0 Enhanced</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Handout <span className="text-indigo-600">Studio</span></h1>
            <p className="text-slate-500 text-lg mt-4 max-w-xl font-medium">Create professional, evidence-based clinical materials in seconds.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {generatedHandout && (
             <button 
               onClick={() => setIsPatientView(true)}
               className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-200 transition-all shadow-sm flex items-center gap-2"
             >
               <Eye className="w-4 h-4" />
               Patient View
             </button>
           )}
           <button 
             onClick={() => setShowSaved(!showSaved)}
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
           >
             {showSaved ? 'Create New' : `Saved Library (${savedHandouts.length})`}
           </button>
        </div>
      </div>

      {showSaved ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHandouts.map((h) => (
            <div key={h.id} className="relative group">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => { setGeneratedHandout(h); setShowSaved(false); }}>
                <div className="h-40 bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                  {h.image ? <img src={h.image} alt="" className="w-full h-full object-cover" /> : <FileText className="w-10 h-10 text-slate-300" />}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{h.title}</h3>
                <div className="text-xs text-slate-400 font-medium">{h.date} • {h.docId}</div>
              </div>
              <button 
                onClick={(e) => deleteHandout(e, h.id)}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-full transition-all shadow-sm backdrop-blur-sm flex items-center gap-2",
                  deleteConfirmId === h.id 
                    ? "bg-rose-500 text-white opacity-100 px-3" 
                    : "bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                )}
                title="Delete Handout"
              >
                <Trash2 className="w-4 h-4" />
                {deleteConfirmId === h.id && <span className="text-xs font-bold">Confirm?</span>}
              </button>
            </div>
          ))}
          {savedHandouts.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">No saved handouts yet.</div>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-8 print:hidden">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              Document Configuration
            </h3>

            {/* Authoritative Sources */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Sourced From
              </h4>
              <div className="flex flex-wrap gap-2">
                {AUTHORITATIVE_SOURCES.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    {source.name}
                    <ExternalLink className="w-2 h-2 opacity-50" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Clinical Context */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinician Name</label>
                  <div className="relative group">
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      value={clinicianName}
                      onChange={(e) => setClinicianName(e.target.value)}
                      placeholder="Optional"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Type Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Document Type</label>
                <div className="grid grid-cols-1 gap-3">
                  {HANDOUT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "flex items-center p-4 rounded-2xl border transition-all text-left gap-4 group",
                          isActive
                            ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20"
                            : "bg-slate-50 border-slate-50 hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "bg-white/20 text-white" : "bg-white text-slate-400 shadow-sm"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={cn(
                            "text-sm font-black tracking-tight",
                            isActive ? "text-white" : "text-slate-900"
                          )}>
                            {type.title}
                          </div>
                          <div className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            isActive ? "text-indigo-100" : "text-slate-400"
                          )}>{type.id}</div>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-white ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exercise Details (Conditional) */}
              {(selectedType === 'exercise' || selectedType === 'hep') && (
                <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dosage Parameters</h4>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Reps</label>
                        <input type="text" value={reps} onChange={e => setReps(e.target.value)} className="w-full p-2 rounded-xl border border-slate-200 text-center font-bold text-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Sets</label>
                        <input type="text" value={sets} onChange={e => setSets(e.target.value)} className="w-full p-2 rounded-xl border border-slate-200 text-center font-bold text-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Freq</label>
                        <input type="text" value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full p-2 rounded-xl border border-slate-200 text-center font-bold text-slate-700" />
                      </div>
                   </div>
                </div>
              )}

              {/* Subspecialty Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Domain</label>
                  <select
                    value={selectedSub}
                    onChange={(e) => setSelectedSub(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    {SUBSPECIALTIES.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Language</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>{lang.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ASHA Practice Portal Link */}
              <div className="pt-4 border-t border-slate-100">
                <a 
                  href="https://www.asha.org/practice-portal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                >
                  <Activity className="w-4 h-4" />
                  ASHA Practice Portal
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <p className="text-[10px] text-slate-400 mt-2 ml-1">Reference ASHA guidelines when creating clinical handouts.</p>
              </div>

              {/* Fine Details */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Specifics</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g., Focus on safe swallow strategies for thin liquids..."
                  className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateHandout}
                disabled={isGenerating || !features.advancedAI}
                className={cn(
                  "w-full py-5 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs",
                  features.advancedAI 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synthesizing Protocol...
                  </>
                ) : !features.advancedAI ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Enable AI in Settings
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Document
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 print:col-span-12 print:w-full">
          <div className="bg-slate-50 rounded-[3rem] p-6 md:p-12 min-h-[800px] flex flex-col items-center justify-start border border-slate-100 relative overflow-hidden print:bg-white print:border-none print:p-0 print:min-h-0 print:overflow-visible">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 print:hidden" />
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center h-[600px] text-center space-y-8 z-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto animate-pulse">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                       <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Crafting Clinical Content</h4>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">
                      Our AI is cross-referencing clinical protocols and generating anatomical illustrations...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              ) : generatedHandout ? (
                <motion.div
                  key="handout"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden print:shadow-none print:border print:border-slate-300 z-10"
                  id="printable-handout"
                  ref={handoutRef}
                >
                  {/* Medical Header */}
                  <div className="border-b border-slate-100 p-10 md:p-12 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Official Protocol</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {generatedHandout.docId}</div>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight tracking-tight">{generatedHandout.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 pt-4">
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-black uppercase text-slate-300 w-20 tracking-widest">Date</span>
                            <span className="font-bold text-slate-700">{generatedHandout.date}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-black uppercase text-slate-300 w-20 tracking-widest">Domain</span>
                            <span className="font-bold text-slate-700">{selectedSub}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-black uppercase text-slate-300 w-20 tracking-widest">Patient</span>
                            <span className="font-black text-indigo-600">{patientName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-black uppercase text-slate-300 w-20 tracking-widest">Clinician</span>
                            <span className="font-black text-slate-900">{clinicianName || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right self-stretch md:self-start flex flex-col justify-between h-full">
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">SLP<span className="text-indigo-600">NEXUS</span></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{facilityName || 'Clinical Services'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Handout Image */}
                  <div className="w-full px-10 md:px-12 pt-10">
                    <div className="w-full h-[450px] overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 relative group shadow-inner">
                      {isGeneratingImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-10">
                          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synthesizing Visualization...</span>
                        </div>
                      ) : generatedHandout.image ? (
                        <>
                          <img 
                            src={generatedHandout.image} 
                            alt="Clinical Illustration" 
                            className="w-full h-full object-contain p-8"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/handout-fallback/800/600';
                            }}
                          />
                          <button 
                            onClick={regenerateImage}
                            className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 hover:bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Regenerate
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
                          <button 
                            onClick={regenerateImage}
                            className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest shadow-sm"
                          >
                            Generate Illustration
                          </button>
                        </div>
                      )}
                    </div>
                    {generatedHandout.image && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 text-center">Fig 1. Clinical visualization for {selectedSub} module</div>}
                  </div>

                  {/* Handout Content */}
                  <div className="p-10 md:p-16">
                    <div className="prose prose-slate max-w-none font-serif text-slate-800 leading-relaxed handout-content">
                      <ReactMarkdown>{generatedHandout.content}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Handout Footer */}
                  <div className="bg-slate-50/50 p-10 md:p-12 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinician Notes</div>
                        <div className="h-16 border-b border-slate-200 border-dashed"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient/Caregiver Signature</div>
                        <div className="h-16 border-b border-slate-200 border-dashed"></div>
                      </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                           <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </div>
                        Verified Clinical Protocol • SLP Nexus AI v2.5
                      </div>
                      <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                        <ShieldAlert className="w-3 h-3" />
                        Educational purposes only.
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[600px] text-center space-y-8"
                >
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto border border-slate-100 shadow-xl">
                    <FileText className="w-10 h-10 text-slate-200" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Document Preview</h4>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">
                      Configure the clinical parameters on the left to generate a professional handout.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {generatedHandout && !isGenerating && (
              <div className="fixed bottom-12 right-12 flex flex-col gap-4 no-print z-50">
                <motion.button
                  whileHover={{ scale: 1.1, x: -4 }}
                  onClick={speakHandout}
                  disabled={isSpeaking}
                  className={cn(
                    "w-14 h-14 bg-white rounded-2xl shadow-2xl transition-all border border-slate-100 flex items-center justify-center",
                    isSpeaking ? "text-indigo-600 ring-4 ring-indigo-100" : "text-slate-600"
                  )}
                  title="Audio Playback"
                >
                  {isSpeaking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: -4 }}
                  onClick={handlePrint}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center"
                  title="Print Document"
                >
                  <Printer className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: -4 }}
                  onClick={saveHandout}
                  className="w-14 h-14 bg-white text-slate-600 rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-center"
                  title="Save to Library"
                >
                  <Download className="w-6 h-6" />
                </motion.button>
              </div>
            )}
          </div>
          
          {error && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-900 text-sm font-bold"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>
      </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .handout-content {
          font-family: 'Libre Baskerville', serif;
        }

        .handout-content h1, .handout-content h2, .handout-content h3 {
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          margin-top: 2em;
          margin-bottom: 0.8em;
          font-weight: 900;
          letter-spacing: -0.03em;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.4em;
          text-transform: capitalize;
        }

        .handout-content h1 { font-size: 2.25rem; }
        .handout-content h2 { font-size: 1.875rem; }
        .handout-content h3 { font-size: 1.5rem; }

        .handout-content p {
          margin-bottom: 1.5em;
          line-height: 2;
          font-size: 1.125rem;
          color: #334155;
        }

        .handout-content ul, .handout-content ol {
          margin-bottom: 2em;
          padding-left: 1.5em;
          list-style-type: none;
        }

        .handout-content li {
          margin-bottom: 1em;
          line-height: 1.8;
          position: relative;
          padding-left: 1.5em;
          font-size: 1.125rem;
        }

        .handout-content li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #4f46e5;
          font-weight: bold;
        }

        .handout-content strong {
          color: #0f172a;
          font-weight: 800;
        }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .lg\\:grid-cols-12 { display: block !important; }
          .lg\\:col-span-4 { display: none !important; }
          .lg\\:col-span-8 { width: 100% !important; }
          .bg-slate-50 { background: white !important; padding: 0 !important; border: 0 !important; }
          #printable-handout { 
            box-shadow: none !important; 
            border: 1px solid #e2e8f0 !important; 
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .fixed { display: none !important; }
        }
      `}</style>
      <AnimatePresence>
        {notification && (
          <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
