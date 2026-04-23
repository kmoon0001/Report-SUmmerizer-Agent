import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Check, 
  Copy, 
  Edit3, 
  Sparkles, 
  ClipboardList,
  Activity,
  Wind,
  ArrowRight,
  AlertCircle,
  Sticker,
  RotateCcw,
  AlertTriangle,
  Info,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { aiService, ClinicalNoteResponse } from '../services/ai-service';
import { useAI } from '../context/AIContext';
import { DOMAIN_DATA, DomainType } from '../utils/documentation-data';
import { SearchWarningBanner } from './SearchWarningBanner';

// --- Components ---

export function DocumentationAssistant() {
  const { features } = useAI();
  const [activeTab, setActiveTab] = useState<'eval' | 'progress' | 'discharge' | 'daily'>('eval');
  const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);
  
  // Progressive Disclosure State
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [buttonGroups, setButtonGroups] = useState<ClinicalNoteResponse['nextButtonGroups']>([]);
  const [smartSets, setSmartSets] = useState<ClinicalNoteResponse['smartSets']>([]);
  const [visualAids, setVisualAids] = useState<ClinicalNoteResponse['visualAids']>([]);
  const [noteData, setNoteData] = useState<ClinicalNoteResponse | null>(null);
  const [freeText, setFreeText] = useState('');
  const [magicDraft, setMagicDraft] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [qualityAnalysis, setQualityAnalysis] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleQualityCheck = async () => {
    if (!editedContent) return;
    setIsChecking(true);
    try {
      const result = await aiService.analyzeQualityCheck(editedContent);
      setQualityAnalysis(result);
    } catch (error) {
      console.error("Quality Analysis Failed", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAIInteraction = React.useCallback(async (action: 'NEXT_ONLY' | 'NEXT_AND_GENERATE' | 'RETUMBLE', overrideFreeText?: string) => {
    setIsGenerating(true);
    try {
      const input = {
        action,
        setting: "SNF", // Default, could be made selectable
        discipline: "SLP",
        template: activeTab,
        selections: {
          ...selections,
          assessmentType: selectedDomain // Ensure domain is passed
        },
        freeText: overrideFreeText !== undefined ? overrideFreeText : freeText
      };

      const response = await aiService.generateClinicalDocumentation(input);
      
      if (action === 'RETUMBLE' && noteData) {
        // Only update narrative
        setNoteData({
          ...noteData,
          noteNarrative: response.noteNarrative,
          retumble: response.retumble
        });
      } else {
        // Update full state
        setNoteData(response);
        setButtonGroups(response.nextButtonGroups);
        setSmartSets(response.smartSets || []);
        setVisualAids(response.visualAids || []);
      }
      
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsGenerating(false);
    }
  }, [activeTab, selections, selectedDomain, freeText, noteData]);

  const handleSelection = (groupId: string, optionId: string, multi: boolean) => {
    setSelections(prev => {
      const currentGroup = prev[groupId] || [];
      let newGroup;
      
      if (multi) {
        if (currentGroup.includes(optionId)) {
          newGroup = currentGroup.filter((id: string) => id !== optionId);
        } else {
          newGroup = [...currentGroup, optionId];
        }
      } else {
        newGroup = [optionId];
      }
      
      return { ...prev, [groupId]: newGroup };
    });
  };

  const renderNarrative = React.useCallback(() => {
    if (!noteData) return '';
    const { summary, objective, assessment, plan } = noteData.noteNarrative;
    return `SUMMARY:\n${summary}\n\nOBJECTIVE:\n${objective}\n\nASSESSMENT:\n${assessment}\n\nPLAN:\n${plan}`;
  }, [noteData]);

  // Sync edited content when noteData changes
  useEffect(() => {
    if (noteData) {
      setEditedContent(renderNarrative());
    }
  }, [noteData, renderNarrative]);

  // Initial Load
  useEffect(() => {
    if (selectedDomain) {
      // Reset state on domain change
      setSelections({});
      setNoteData(null);
      setCurrentStep(0);
      setFreeText('');
      setButtonGroups([]);
      
      // Trigger initial AI call to get first set of options
      handleAIInteraction('NEXT_ONLY');
    }
  }, [selectedDomain, activeTab, handleAIInteraction]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Documentation Assistant</h2>
          <p className="text-slate-500 font-medium">AI-powered clinical documentation support aligned with CMS guidelines.</p>
        </div>
      </div>

      <SearchWarningBanner />

      {/* Domain Selection */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select Clinical Domain</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(DOMAIN_DATA) as DomainType[]).map((domainId) => {
            const domain = DOMAIN_DATA[domainId];
            const Icon = domain.icon;
            const isSelected = selectedDomain === domainId;
            
            return (
              <button
                key={domainId}
                onClick={() => setSelectedDomain(domainId)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 transition-all duration-200 group text-left h-48 flex flex-col justify-end p-4",
                  isSelected 
                    ? `border-transparent ring-2 ring-offset-2 ring-indigo-500 shadow-xl scale-105` 
                    : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                )}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={domain.image} 
                    alt={domain.label}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-500",
                      isSelected ? "scale-110" : "group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute inset-0 transition-colors",
                    isSelected ? "bg-gradient-to-t from-black/80 via-black/40 to-transparent" : "bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"
                  )} />
                </div>

                <div className="relative z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors",
                    isSelected ? "bg-white text-indigo-600" : "bg-white/20 text-white backdrop-blur-sm"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "font-bold text-sm block leading-tight",
                    isSelected ? "text-white" : "text-white"
                  )}>
                    {domain.label}
                  </span>
                  {isSelected && (
                    <motion.div 
                      layoutId="active-check"
                      className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDomain && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200 w-fit">
            {[
              { id: 'eval', label: 'Evaluation', icon: ClipboardList },
              { id: 'progress', label: 'Progress/Recert', icon: Activity },
              { id: 'discharge', label: 'Discharge', icon: FileText },
              { id: 'daily', label: 'Daily Note', icon: Edit3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['Assessment', 'Diagnosis', 'Observations', 'Interventions', 'Plan'].map((step, index) => (
                <div key={step} className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                    index <= currentStep ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-colors",
                    index <= currentStep ? "text-slate-900" : "text-slate-400"
                  )}>
                    {step}
                  </span>
                  {index < 4 && <div className="w-4 h-px bg-slate-200" />}
                </div>
              ))}
            </div>
            
            {/* Authoritative Sources Link */}
            {selectedDomain && Array.isArray(DOMAIN_DATA[selectedDomain].authoritativeSources) && DOMAIN_DATA[selectedDomain].authoritativeSources.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grounded In:</span>
                <div className="flex gap-2">
                  {DOMAIN_DATA[selectedDomain].authoritativeSources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      title={source.name}
                    >
                      <BookOpen className="w-3 h-3" />
                      {source.name.split(':')[0]}
                      <ExternalLink className="w-2 h-2 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Area (Progressive) */}
            <div className="space-y-6">
              
              {/* Magic Draft Input */}
              {features.advancedAI ? (
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg tracking-tight">Magic Draft</h4>
                        <p className="text-indigo-100 text-xs font-medium">Turn short phrases into full clinical notes.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={magicDraft}
                        onChange={(e) => setMagicDraft(e.target.value)}
                        placeholder="e.g., puree and thin with 2x coughing given mod cues..."
                        className="w-full p-4 pr-12 rounded-xl bg-white/10 border border-white/20 placeholder-indigo-200 text-sm focus:outline-none focus:bg-white/20 transition-all min-h-[100px] text-white"
                      />
                      <button
                        onClick={() => {
                          setFreeText(magicDraft); // Use freeText state to pass to AI
                          handleAIInteraction('NEXT_AND_GENERATE', magicDraft);
                        }}
                        disabled={!magicDraft || isGenerating}
                        className="absolute bottom-3 right-3 p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Generate Note"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Magic Draft Disabled</h4>
                  <p className="text-sm text-slate-500">Enable "Advanced AI Features" in Settings to use this tool.</p>
                </div>
              )}

              {/* Smart Sets */}
              {Array.isArray(smartSets) && smartSets.length > 0 && (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {smartSets.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => setSelections(prev => ({ ...prev, ...set.selections }))}
                        className="text-left p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                      >
                        <div className="font-bold text-indigo-900 text-sm group-hover:text-indigo-700">{set.label}</div>
                        <div className="text-xs text-indigo-600/70 mt-1">{set.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {Array.isArray(buttonGroups) && buttonGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                  >
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{group.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(group.options) && group.options.map((option) => {
                        const isSelected = (selections[group.id] || []).includes(option.id);
                        return (
                          <div key={option.id} className="relative group/btn">
                            <button
                              onClick={() => handleSelection(group.id, option.id, group.multiSelect)}
                              className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm text-left flex items-center gap-2",
                                isSelected 
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 transform scale-105" 
                                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                              )}
                            >
                              {option.label}
                              {option.tooltip && (
                                <Info className={cn("w-3 h-3 opacity-50", isSelected ? "text-white" : "text-slate-400")} />
                              )}
                            </button>
                            
                            {/* Tooltip */}
                            {option.tooltip && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                {option.tooltip}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Visual Aids Panel */}
              {Array.isArray(visualAids) && visualAids.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Sticker className="w-3 h-3" />
                    Visual Concepts
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {visualAids.map((aid, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-3 hover:bg-white transition-colors cursor-help group">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 group-hover:scale-110 transition-transform">
                          {aid.type === 'video' ? <Activity className="w-5 h-5" /> : 
                           aid.type === 'animation' ? <Wind className="w-5 h-5" /> :
                           <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-700">{aid.title}</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-1">{aid.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Text / Custom Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pl-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Additional Details / Custom Notes (Optional)
                  </h4>
                </div>
                
                {/* PHI Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800">PHI Protection Warning</p>
                    <p className="text-[10px] text-amber-700 mt-0.5 leading-tight">
                      Never generate actual PHI. Do not enter real names, DOBs, MRNs, or addresses. Use placeholders like [Pt], [DOB], [MRN], [SNF], [Room], [MD]. De-identify all examples.
                    </p>
                  </div>
                </div>

                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Enter specific patient responses, custom measures, or unique observations here..."
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none text-sm transition-all min-h-[100px]"
                />
                <p className="text-xs text-slate-400">
                  Tip: Details entered here will be incorporated into the generated note.
                </p>
              </div>

              <button
                onClick={() => handleAIInteraction('NEXT_AND_GENERATE')}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Documentation
                  </>
                )}
              </button>
            </div>

            {/* Output Area */}
            <div className="space-y-4">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-full flex flex-col min-h-[700px]">
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between z-20">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Generated Documentation
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleQualityCheck}
                      disabled={isChecking || !noteData}
                      className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                      title="Analyze for Quality"
                    >
                      <ShieldCheck className={cn("w-4 h-4", isChecking && "animate-pulse")} />
                      {isChecking ? 'Analyzing...' : 'Quality Check'}
                    </button>
                    {noteData && (
                      <button 
                        onClick={() => handleAIInteraction('RETUMBLE')}
                        disabled={isGenerating || !noteData.retumble.allowed}
                        className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        title={noteData.retumble.instruction || "Rewrite narrative only; keep facts identical."}
                      >
                        <RotateCcw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
                        Rewrite Note (Keep Facts)
                      </button>
                    )}
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={!noteData}
                      className={cn(
                        "p-2 rounded-xl transition-colors text-xs font-bold flex items-center gap-1",
                        isEditing ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-200 text-slate-500"
                      )}
                    >
                      <Edit3 className="w-4 h-4" />
                      {isEditing ? 'Editing' : 'Edit'}
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      disabled={!noteData}
                      className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 shadow-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 relative bg-white">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
                      <p className="text-slate-900 font-bold text-lg animate-pulse">Generating Note...</p>
                      <p className="text-slate-500 text-sm mt-2">Applying CMS Guidelines</p>
                    </div>
                  ) : null}
                  
                  {isEditing ? (
                    <textarea 
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-full p-8 focus:outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm"
                    />
                  ) : (
                    <div className="p-8 h-full overflow-y-auto">
                      {noteData ? (
                        <div className="space-y-6">
                          {/* Quality Analysis */}
                          {qualityAnalysis && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                  Documentation Quality Check
                                </div>
                                <div className={cn(
                                  "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                                  qualityAnalysis.qualityLevel === 'Needs Improvement' ? "bg-rose-100 text-rose-700" :
                                  qualityAnalysis.qualityLevel === 'Good' ? "bg-amber-100 text-amber-700" :
                                  "bg-emerald-100 text-emerald-700"
                                )}>
                                  {qualityAnalysis.qualityLevel} Quality ({qualityAnalysis.qualityScore}/100)
                                </div>
                              </div>
                              
                              <p className="text-xs text-slate-600 font-medium">{qualityAnalysis.overallAssessment}</p>

                              {Array.isArray(qualityAnalysis.flaggedPhrases) && qualityAnalysis.flaggedPhrases.length > 0 && (
                                <div className="space-y-2">
                                  {qualityAnalysis.flaggedPhrases.map((flag: any, i: number) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 text-xs">
                                      <div className="font-mono text-rose-600 mb-1 bg-rose-50 inline-block px-1 rounded">"{flag.phrase}"</div>
                                      <div className="text-slate-500 mb-1">{flag.reason}</div>
                                      <div className="text-emerald-600 font-bold flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3" />
                                        Try: "{flag.suggestion}"
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Validation Missing */}
                          {Array.isArray(noteData.validation.missing) && noteData.validation.missing.length > 0 && (
                            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                              <div className="flex items-center gap-2 font-bold mb-2">
                                <AlertCircle className="w-4 h-4" />
                                Missing Required Information
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {noteData.validation.missing.map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Validation Warnings */}
                          {Array.isArray(noteData.validation.warnings) && noteData.validation.warnings.length > 0 && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                              <div className="flex items-center gap-2 font-bold mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                Documentation Alerts
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {noteData.validation.warnings.map((w, i) => (
                                  <li key={i}>{w}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Clinical Check Flags (Pre-Sign Review) */}
                          {noteData.clinicalCheck && !noteData.clinicalCheck.passed && Array.isArray(noteData.clinicalCheck.flags) && noteData.clinicalCheck.flags.length > 0 && (
                            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-2 font-black text-slate-800 text-sm mb-4 uppercase tracking-widest">
                                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                Pre-Sign Clinical Review
                              </div>
                              <div className="space-y-3">
                                {noteData.clinicalCheck.flags.map((flag) => (
                                  <div 
                                    key={flag.id} 
                                    className={cn(
                                      "p-4 rounded-xl border flex items-start gap-3",
                                      flag.severity === 'critical' ? "bg-rose-50 border-rose-200 text-rose-900" : 
                                      flag.severity === 'warning' ? "bg-amber-50 border-amber-200 text-amber-900" : 
                                      "bg-blue-50 border-blue-200 text-blue-900"
                                    )}
                                  >
                                    <div className="shrink-0 mt-0.5">
                                      {flag.severity === 'critical' ? <AlertCircle className="w-5 h-5 text-rose-600" /> :
                                       flag.severity === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                                       <Info className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-bold text-sm mb-1">{flag.message}</div>
                                      
                                      {flag.evidence && flag.evidence.length > 0 && (
                                        <div className="text-[10px] font-mono opacity-70 mb-2 bg-black/5 inline-block px-1.5 py-0.5 rounded">
                                          Ref: {flag.evidence.join(', ')}
                                        </div>
                                      )}
                                      
                                      <div className="text-xs font-medium opacity-90 flex items-center gap-1.5">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                        Action: {flag.suggestedAction}
                                      </div>
                                      
                                      {flag.askClinician && (
                                        <div className="mt-2 text-xs italic opacity-80 border-t border-black/10 pt-2">
                                          <span className="font-semibold not-italic">Question:</span> {flag.askClinician}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Narrative Content */}
                          <div className="prose prose-sm max-w-none font-mono text-slate-700 whitespace-pre-wrap">
                            {renderNarrative()}
                          </div>

                          {/* Learning Tips */}
                          {Array.isArray(noteData.learningTips) && noteData.learningTips.length > 0 && (
                            <div className="mt-8 border-t border-slate-100 pt-6">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                Clinical Pearls
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                {noteData.learningTips.map((tip, i) => (
                                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="font-bold text-slate-900 text-sm mb-1">{tip.title}</div>
                                    <p className="text-slate-600 text-xs mb-2">{tip.tip}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Why it matters: {tip.whyItMatters}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                          <FileText className="w-16 h-16 mb-6 opacity-20" />
                          <p className="font-medium">Select a domain and options to begin</p>
                          <p className="text-xs mt-2 opacity-60">AI will generate a compliant note</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-900 text-slate-400 px-6 py-4 text-[11px] flex items-center gap-3 border-t border-slate-800 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-20">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="leading-tight">
                    <strong className="text-slate-200 font-bold tracking-wide uppercase mr-1">FDA CDS Safeguard:</strong> 
                    AI-generated clinical guidance. Independent clinician review required for accuracy, final documentation, and billing coding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// --- Sub-Forms Removed ---
