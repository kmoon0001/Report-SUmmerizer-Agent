import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Mic, 
  Wand2, 
  AlertTriangle, 
  Save, 
  Copy, 
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  Cpu,
  Sparkles,
  Eye,
  User
} from 'lucide-react';
import { aiService, ClinicalNoteResponse } from '../services/ai-service';
import { SLP_TEMPLATES } from '../constants/templates';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { TemplateSelector } from './TemplateSelector';
import { cn } from '../lib/utils';
import { persistenceService, SavedPhrase, Patient, ClinicalNote } from '../services/persistence-service';
import { generateClinicalReport } from '../utils/pdf-generator';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { useNotifications } from '../context/NotificationContext';

// --- Types ---

interface NoteState {
  [key: string]: string;
}

export function DocumentationStudio() {
  // State
  const [setting, setSetting] = useState<'SNF' | 'OP Rehab'>('SNF');
  const [template, setTemplate] = useState<string>(SLP_TEMPLATES[0].name);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [noteNarrative, setNoteNarrative] = useState<NoteState>({});
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [nextGroups, setNextGroups] = useState<any[]>([]); // Progressive button groups
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<ClinicalNoteResponse | null>(null);
  const [magicDraftInput, setMagicDraftInput] = useState("");
  const [showMagicDraft, setShowMagicDraft] = useState(false);
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [isPatientView, setIsPatientView] = useState(false);
  const { notify, confirm, prompt } = useNotifications();
  
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isSmartSetOpen, setIsSmartSetOpen] = useState(false);

  // Patient Selection
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isPatientOpen, setIsPatientOpen] = useState(false);

  // Helper for menu buttons
  const MenuButton = ({ label, value, isOpen, setIsOpen, options, onSelect, renderOption }: any) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-emerald-500 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <span className="truncate">{value || 'Select...'}</span>
        </div>
        <span className="text-xs opacity-50">▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 max-h-60 overflow-y-auto">
          {Array.isArray(options) && options.map((opt: any, idx: number) => (
            <button
              key={idx}
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
  
  const { localModelLoaded } = useSystemStatus();

  // Reset transient status messages when context changes
  useEffect(() => {
    setError(null);
  }, [setting, template, selections, magicDraftInput, selectedPatientId]);

  useEffect(() => {
    setPhrases(persistenceService.getPhrases());
    setPatients(persistenceService.getPatients().filter(p => p.status === 'Active'));
  }, []);

  const handleInsertPhrase = (text: string) => {
    setMagicDraftInput(prev => prev ? `${prev} ${text}` : text);
  };

  const handleSavePhrase = async () => {
    const label = await prompt({
      title: 'Save Phrase',
      message: 'Enter a label for this phrase to save it to your bank:',
      placeholder: 'e.g. S/P CVA Aphasia Assessment'
    });
    if (!label) return;
    
    const newPhrase: SavedPhrase = {
      id: crypto.randomUUID(),
      label,
      text: magicDraftInput,
      category: 'Custom'
    };
    
    persistenceService.savePhrase(newPhrase);
    setPhrases(prev => [newPhrase, ...prev]);
    notify('success', 'Phrase saved to bank.');
  };

  const handleDeletePhrase = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Phrase?',
      message: 'Are you sure you want to delete this phrase from your bank?',
      type: 'danger'
    });
    if (confirmed) {
      persistenceService.deletePhrase(id);
      setPhrases(prev => prev.filter(p => p.id !== id));
      notify('success', 'Phrase deleted.');
    }
  };

  const { 
    isListening, 
    isSupported: isSpeechSupported, 
    toggleListening 
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setMagicDraftInput(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  });

  // --- Handlers ---

  const handleOptionToggle = (groupId: string, optionId: string, multiSelect: boolean) => {
    setSelections(prev => {
      const current = prev[groupId] || [];
      if (multiSelect) {
        return {
          ...prev,
          [groupId]: current.includes(optionId) 
            ? current.filter(id => id !== optionId)
            : [...current, optionId]
        };
      } else {
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const generateNote = async (action: 'NEXT_AND_GENERATE' | 'RETUMBLE' | 'NEXT_ONLY' = 'NEXT_AND_GENERATE') => {
    setIsLoading(true);
    setError(null);
    try {
      // Construct prompt from selections and magic draft
      const context = {
        setting,
        discipline: 'SLP',
        template,
        selections,
        magicDraft: magicDraftInput,
        currentNarrative: noteNarrative,
        action
      };
      
      // Call AI Service
      const response = await aiService.generateClinicalDocumentation(context);
      
      setAiResponse(response);
      if (action !== 'NEXT_ONLY') {
        setNoteNarrative(response.noteNarrative);
      }
      if (response.nextButtonGroups && response.nextButtonGroups.length > 0) {
        setNextGroups(response.nextButtonGroups);
      }
      if (action === 'NEXT_AND_GENERATE') {
        setShowMagicDraft(false);
      }

    } catch (err: any) {
      console.error("Generation failed", err);
      setError(err.message || "Failed to generate documentation. Please try again or enable Local AI Fallback in Settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = () => {
    if (!selectedPatientId) {
      notify('error', "Please select a patient first.");
      return;
    }
    if (!noteNarrative.summary) {
      notify('error', "No note content to save.");
      return;
    }

    const noteType = template.toLowerCase().includes('eval') ? 'Evaluation' : 'Daily';

    const newNote: ClinicalNote = {
      id: crypto.randomUUID(),
      patientId: selectedPatientId,
      date: new Date().toISOString(),
      type: noteType as any,
      content: JSON.stringify(noteNarrative),
      providerId: 'current-user', // Mock user
      metrics: {
        performanceScore: 80 // Mock performance score for now
      }
    };

    try {
      persistenceService.saveClinicalNote(newNote);
      notify('success', "Note saved successfully!");
      // Reset state
      setNoteNarrative({});
      setSelections({});
      setMagicDraftInput("");
      setNextGroups([]);
      setAiResponse(null);
    } catch (err) {
      console.error("Failed to save note:", err);
      notify('error', "Failed to save note.");
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const renderContent = () => (
    <div className="flex flex-col md:flex-row h-[800px] bg-slate-50 dark:bg-[#0A0A0B] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 relative">
      {/* Patient View Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
      {/* LEFT: Clinical Inputs (Progressive Disclosure) */}
      <div className="w-full md:w-[400px] h-1/2 md:h-full bg-white dark:bg-slate-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 dark:bg-emerald-500/10 text-white dark:text-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-emerald-500/20 border border-transparent dark:border-emerald-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">DocuArchitect</h2>
                {localModelLoaded && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-500/30">
                    <Cpu className="w-3 h-3" /> Local
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI-Powered Clinical Documentation</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Context Selectors */}
          <div className="grid grid-cols-1 gap-3">
            <MenuButton 
              label="Patient" 
              value={selectedPatient?.name || 'Select Patient'} 
              isOpen={isPatientOpen} 
              setIsOpen={setIsPatientOpen} 
              options={patients} 
              onSelect={(p: Patient) => setSelectedPatientId(p.id)} 
              renderOption={(p: Patient) => `${p.name} (${p.diagnosis})`}
            />
            <MenuButton 
              label="Setting" 
              value={setting} 
              isOpen={isSettingOpen} 
              setIsOpen={setIsSettingOpen} 
              options={['SNF', 'OP Rehab']} 
              onSelect={setSetting} 
            />
            <MenuButton 
              label="Template" 
              value={template} 
              isOpen={isTemplateOpen} 
              setIsOpen={setIsTemplateOpen} 
              options={SLP_TEMPLATES.map(t => t.name)} 
              onSelect={setTemplate} 
            />
            <MenuButton 
              label="Smart Sets" 
              value={selections.smartSetLabel?.[0] || 'None'} 
              isOpen={isSmartSetOpen} 
              setIsOpen={setIsSmartSetOpen} 
              options={aiResponse?.smartSets?.map(s => s.label) || []} 
              onSelect={(label: string) => {
                const selectedSet = aiResponse?.smartSets?.find(s => s.label === label);
                if (selectedSet) {
                  setSelections({ ...selectedSet.selections, smartSetLabel: [label] });
                }
              }} 
            />
          </div>

          {/* Magic Draft Input */}
          <div className="bg-indigo-50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-indigo-100 dark:border-emerald-900/30">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-indigo-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Magic Draft
              </label>
              <div className="flex items-center gap-2">
                {isSpeechSupported && (
                  <button
                    onClick={() => {
                      if (!showMagicDraft) setShowMagicDraft(true);
                      toggleListening();
                    }}
                    className={cn(
                      "p-1.5 rounded-lg transition-all flex items-center gap-1.5",
                      isListening 
                        ? "bg-red-100 text-red-600 animate-pulse" 
                        : "bg-white/50 text-indigo-600 hover:bg-white"
                    )}
                    title="Dictate Note"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {isListening && <span className="text-[10px] font-bold">Listening...</span>}
                  </button>
                )}
                <button 
                  onClick={() => setShowMagicDraft(!showMagicDraft)}
                  className="text-xs text-indigo-600 dark:text-emerald-500 hover:text-indigo-800 dark:hover:text-emerald-300 font-bold"
                >
                  {showMagicDraft ? 'Hide' : 'Expand'}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {showMagicDraft && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={magicDraftInput}
                    onChange={(e) => setMagicDraftInput(e.target.value)}
                    placeholder="Type shorthand (e.g., 'coughing on thin, rec nectar, 3x/wk')..."
                    className="w-full h-24 p-3 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-emerald-900/50 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-emerald-500 outline-none resize-none mb-3"
                  />
                  
                  <div className="flex justify-between items-center mb-3">
                    <button
                      onClick={handleSavePhrase}
                      disabled={!magicDraftInput.trim()}
                      className="text-xs font-bold text-indigo-600 dark:text-emerald-500 hover:text-indigo-800 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save as Phrase
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {magicDraftInput.length} chars
                    </span>
                  </div>

                  {phrases.length > 0 && (
                    <div className="border-t border-indigo-100 dark:border-emerald-900/30 pt-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Phrase Bank
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {phrases.map(phrase => (
                          <div 
                            key={phrase.id}
                            className="group flex items-center gap-1 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-emerald-900/30 rounded-lg pl-2 pr-1 py-1 hover:border-indigo-300 dark:hover:border-emerald-500/50 transition-all shadow-sm"
                          >
                            <button
                              onClick={() => handleInsertPhrase(phrase.text)}
                              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-emerald-400 text-left max-w-[150px] truncate"
                              title={phrase.text}
                            >
                              {phrase.label}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePhrase(phrase.id);
                              }}
                              className="p-1 text-slate-300 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Phrase"
                            >
                              <div className="w-3 h-3 flex items-center justify-center font-bold">×</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!showMagicDraft && magicDraftInput && (
               <p className="text-xs text-indigo-700 dark:text-emerald-400 truncate italic">"{magicDraftInput}"</p>
            )}
          </div>

          {/* Progressive Button Flow */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Clinical Observations</h3>
            {Array.isArray(nextGroups) && nextGroups.map(group => (
              <div key={group.id} className="animate-in fade-in slide-in-from-bottom-4 duration-150">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">{group.title}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Array.isArray(group.options) && group.options.map((option: any) => {
                    const isSelected = (selections[group.id] || []).includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          handleOptionToggle(group.id, option.id, group.multiSelect);
                          generateNote('NEXT_AND_GENERATE'); // Auto-generate on selection
                        }}
                        className={cn(
                          "p-3 rounded-xl text-sm font-bold transition-all border-2",
                          isSelected 
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-lg" 
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
          {error && (
            <div className="mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
          <button
            onClick={() => generateNote('NEXT_AND_GENERATE')}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Note
              </>
            )}
          </button>
          <button
            onClick={async () => {
              const analysis = await aiService.analyzeQualityCheck(JSON.stringify(noteNarrative));
              notify('info', `Quality Score: ${analysis.qualityScore}\n\nAssessment: ${analysis.overallAssessment}`);
            }}
            className="w-full py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            <ShieldCheck className="w-5 h-5" />
            Compliance Check
          </button>
          <button
            onClick={() => generateNote('NEXT_ONLY')}
            disabled={isLoading}
            className="w-full py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            Get Suggestions Only
          </button>
        </div>
      </div>

      {/* RIGHT: Note Preview & Compliance */}
      <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden bg-slate-50 dark:bg-[#0A0A0B]">
        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">{template}</h2>
          </div>
          
          <div className="flex gap-2 items-center">
             {aiResponse?.retumble?.allowed && (
               <button 
                 onClick={() => generateNote('RETUMBLE')}
                 disabled={isLoading}
                 className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors mr-2"
                 title={aiResponse.retumble.instruction}
               >
                 <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                 Retumble
               </button>
             )}
             <button 
               className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
               title="Copy to Clipboard"
               onClick={() => {
                 if (noteNarrative.summary) {
                   navigator.clipboard.writeText(noteNarrative.summary);
                 }
               }}
               disabled={!noteNarrative.summary}
             >
               <Copy className="w-5 h-5" />
             </button>
             <button 
               className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
               title="Export to PDF"
               onClick={() => {
                 if (noteNarrative.summary) {
                   generateClinicalReport(
                     selectedPatient?.name || 'Patient_A', 
                     new Date().toLocaleDateString(), 
                     template,
                     noteNarrative
                   );
                 }
               }}
               disabled={!noteNarrative.summary || !selectedPatientId}
             >
               <FileText className="w-5 h-5" />
             </button>
             <button 
               className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
               title="Save Note"
               onClick={handleSaveNote}
               disabled={!noteNarrative.summary || !selectedPatientId}
             >
               <Save className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 min-h-[600px] p-8 md:p-12 relative">
            {/* Watermark/Placeholder */}
            {!noteNarrative.summary && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 pointer-events-none">
                <FileText className="w-24 h-24 mb-4 opacity-20" />
                <p className="font-bold text-lg text-slate-500">Ready to Document</p>
              </div>
            )}

            {/* Compliance Alerts */}
            {aiResponse && (
              <div className="mb-6 space-y-3">
                {Array.isArray(aiResponse.validation?.missing) && aiResponse.validation.missing.map((msg, i) => (
                  <div key={`missing-${i}`} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-3 text-sm text-red-800 dark:text-red-300 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-500" />
                    <div>
                      <span className="font-bold block">Missing Information</span>
                      {msg}
                    </div>
                  </div>
                ))}
                {Array.isArray(aiResponse.validation?.warnings) && aiResponse.validation.warnings.map((msg, i) => (
                  <div key={`warning-${i}`} className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-start gap-3 text-sm text-amber-800 dark:text-amber-300 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <div>
                      <span className="font-bold block">Compliance Warning</span>
                      {msg}
                    </div>
                  </div>
                ))}
                {Array.isArray(aiResponse.clinicalCheck?.flags) && aiResponse.clinicalCheck.flags.map((flag, i) => (
                  <div key={`flag-${i}`} className={`p-3 border rounded-lg flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${
                    flag.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300' : 
                    flag.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300' : 
                    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300'
                  }`}>
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold block uppercase text-xs tracking-wider mb-1">{flag.severity} Flag</span>
                      <p className="font-bold">{flag.message}</p>
                      <p className="opacity-80 mt-1">{flag.suggestedAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6 capitalize border-b border-slate-200 dark:border-slate-800 pb-4">
                {template}
              </h3>
              
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {SLP_TEMPLATES.find(t => t.name === template)?.elements?.map(element => (
                    <div key={element}>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{element}</h4>
                      <div className="text-slate-800 dark:text-slate-300 text-lg leading-relaxed">
                        {noteNarrative[element] || <span className="text-slate-400 italic">No content yet...</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Compliance/Learning Tips (Floating) */}
            {Array.isArray(aiResponse?.learningTips) && aiResponse.learningTips.length > 0 && (
              <div className="absolute -right-4 top-20 translate-x-full hidden xl:block w-64">
                {Array.isArray(aiResponse.learningTips) && aiResponse.learningTips.map((tip, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl shadow-sm mb-4 relative group"
                  >
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-amber-50 dark:bg-amber-950/20 border-l border-b border-amber-200 dark:border-amber-900/30 rotate-45" />
                    <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-500 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="w-3 h-3" />
                      {tip.title}
                    </div>
                    <p className="text-xs text-amber-800 dark:text-amber-200 mb-2 font-medium">{tip.tip}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-500/70 italic">{tip.whyItMatters}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Visual Aids (Floating below learning tips) */}
            {Array.isArray(aiResponse?.visualAids) && aiResponse.visualAids.length > 0 && (
              <div className="absolute -right-4 top-96 translate-x-full hidden xl:block w-64">
                {Array.isArray(aiResponse.visualAids) && aiResponse.visualAids.map((aid, i) => (
                  <motion.div 
                    key={`aid-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                    className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 p-4 rounded-xl shadow-sm mb-4 relative"
                  >
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-indigo-50 dark:bg-indigo-950/20 border-l border-b border-indigo-200 dark:border-indigo-900/30 rotate-45" />
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      <BookOpen className="w-3 h-3" />
                      Visual Aid
                    </div>
                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-1">{aid.title}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-300/80 mb-3">{aid.description}</p>
                    {aid.contentUrl && (
                      <a 
                        href={aid.contentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View Resource <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Documentation Studio" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
