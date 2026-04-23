import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Stethoscope,
  Activity,
  Brain,
  MessageSquare,
  Mic,
  Utensils,
  Upload,
  X,
  Bot,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Eye
} from 'lucide-react';
import { CLINICAL_PATHWAYS, ClinicalSymptom, PathwayOption } from '../data/pathways-data';
import { geminiConsultant } from '../services/gemini-consultant';
import { AIResponse } from '../services/ai-service';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { useAI } from '../context/AIContext';
import { useDashboard } from '../context/DashboardContext';

// Types for Custom Resources
interface CustomResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'note';
  content: string; // URL or text content
  symptomId: string; // Linked to a specific symptom
  dateAdded: number;
}

export function ClinicalPathways() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<ClinicalSymptom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientView, setIsPatientView] = useState(false);
  const [customResources, setCustomResources] = useState<CustomResource[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const { history } = useAI();
  const { activeView } = useDashboard();
  
  // Consultant State
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [consultantQuery, setConsultantQuery] = useState("");
  const [consultantResponse, setConsultantResponse] = useState<AIResponse | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultantError, setConsultantError] = useState<string | null>(null);
  
  // Load custom resources from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('slp-custom-resources');
    if (saved) {
      try {
        setCustomResources(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse custom resources", e);
      }
    }
  }, []);

  // Save custom resources when changed
  useEffect(() => {
    try {
      localStorage.setItem('slp-custom-resources', JSON.stringify(customResources));
    } catch (e) {
      console.error("Failed to save custom resources to local storage", e);
    }
  }, [customResources]);

  const categories = Array.from(new Set(CLINICAL_PATHWAYS.map(p => p.category)));

  const filteredSymptoms = CLINICAL_PATHWAYS.filter(s => {
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddResource = (resource: Omit<CustomResource, 'id' | 'dateAdded'>) => {
    const newResource: CustomResource = {
      ...resource,
      id: Date.now().toString(),
      dateAdded: Date.now()
    };
    setCustomResources(prev => [...prev, newResource]);
    setIsUploadModalOpen(false);
  };

  const handleDeleteResource = (id: string) => {
    setCustomResources(prev => prev.filter(r => r.id !== id));
  };

  const handleConsult = async () => {
    if (!consultantQuery.trim()) return;
    setIsConsulting(true);
    setConsultantResponse(null);
    setConsultantError(null);
    setIsConsultantOpen(true); // Open sidebar
    try {
      const context = selectedSymptom 
        ? `Symptom: ${selectedSymptom.label}\nDescription: ${selectedSymptom.description}\nCauses: ${selectedSymptom.causes.join(', ')}\nCommon Observations: ${selectedSymptom.commonObservations.join(', ')}\nRed Flags: ${selectedSymptom.redFlags.join(', ')}`
        : "General Clinical Pathways View";
      const response = await geminiConsultant.consult(consultantQuery, context, history, activeView);
      setConsultantResponse(response);
    } catch (error) {
      console.error("Consultation failed", error);
      setConsultantError("I'm having trouble connecting to the clinical knowledge base right now. Please check your internet connection or try again in a moment.");
    } finally {
      setIsConsulting(false);
    }
  };

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'Dysphagia': return Utensils;
      case 'Cognition': return Brain;
      case 'Aphasia': return MessageSquare;
      case 'Dysarthria/Voice': return Mic;
      default: return Activity;
    }
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0A0A0B] relative overflow-hidden">
      {/* Header / Filter Bar */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 z-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clinical Pathways</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Symptom-based decision support & resource library</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search symptoms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConsultantOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Consultant</span>
              </button>
              <button 
                onClick={() => setIsPatientView(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Patient View</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => { setSelectedCategory(null); setSelectedSymptom(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {Array.isArray(categories) && categories.map(cat => {
            const Icon = getIconForCategory(cat);
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedSymptom(null); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: Symptom List */}
        <div className={`w-full md:w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-y-auto ${selectedSymptom ? 'hidden md:block' : 'block'}`}>
          <div className="p-2">
            {Array.isArray(filteredSymptoms) && filteredSymptoms.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No symptoms found</p>
              </div>
            ) : (
              Array.isArray(filteredSymptoms) && filteredSymptoms.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => setSelectedSymptom(symptom)}
                  className={`w-full text-left p-4 rounded-xl mb-1 transition-all ${
                    selectedSymptom?.id === symptom.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{symptom.label}</span>
                    {selectedSymptom?.id === symptom.id && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{symptom.description}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Content: Pathway Detail */}
        <div className={`flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0A0A0B] p-4 md:p-8 ${!selectedSymptom ? 'hidden md:flex items-center justify-center' : 'block'}`}>
          {!selectedSymptom ? (
            <div className="text-center text-slate-400 max-w-md">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Select a Symptom</h3>
              <p>Choose a clinical presentation from the list to view evidence-based pathways, assessments, and strategies.</p>
            </div>
          ) : (
            <motion.div 
              key={selectedSymptom.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedSymptom(null)}
                className="md:hidden flex items-center text-slate-500 dark:text-slate-400 mb-4 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to List
              </button>

              {/* Symptom Header */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium mb-3">
                      {selectedSymptom.category}
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{selectedSymptom.label}</h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">{selectedSymptom.description}</p>
                    
                    {/* Clinical Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Labs</h5>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {Array.isArray(selectedSymptom.labs) && selectedSymptom.labs.map((l, i) => <li key={i}>• {l}</li>)}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Imaging</h5>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {Array.isArray(selectedSymptom.imaging) && selectedSymptom.imaging.map((img, i) => <li key={i}>• {img}</li>)}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Meds</h5>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {Array.isArray(selectedSymptom.meds) && selectedSymptom.meds.map((m, i) => <li key={i}>• {m}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* New Clinical Observation Input */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Clinical Observations</label>
                      <textarea
                        value={consultantQuery}
                        onChange={(e) => setConsultantQuery(e.target.value)}
                        placeholder="Type what you see (e.g., patient coughing on thin liquids, wet voice, pocketing)..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 transition-all dark:text-slate-200"
                      />
                      <button
                        onClick={handleConsult}
                        disabled={!consultantQuery.trim() || isConsulting}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                      >
                        {isConsulting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Analyze Observations
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedSymptom.redFlags.length > 0 && (
                  <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 mb-1">Clinical Red Flags</h4>
                      <ul className="list-disc list-inside text-sm text-rose-800 dark:text-rose-400 space-y-1">
                        {selectedSymptom.redFlags.map((flag, i) => (
                          <li key={i}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Pathways Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assessments Column */}
                <PathwayColumn 
                  title="Assessments" 
                  icon={Stethoscope} 
                  color="blue" 
                  items={selectedSymptom.pathways.assessments} 
                />
                
                {/* Treatments Column */}
                <PathwayColumn 
                  title="Treatments" 
                  icon={Activity} 
                  color="emerald" 
                  items={selectedSymptom.pathways.treatments} 
                />
                
                {/* Strategies Column */}
                <PathwayColumn 
                  title="Strategies" 
                  icon={Brain} 
                  color="violet" 
                  items={selectedSymptom.pathways.strategies} 
                />
              </div>

              {/* Custom Resources Section */}
              <div className="border-t border-slate-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">My Resources</h3>
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Add Resource
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customResources.filter(r => r.symptomId === selectedSymptom.id).length === 0 ? (
                    <div className="col-span-full p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Upload PDFs, add links, or write notes for this symptom.</p>
                    </div>
                  ) : (
                    customResources
                      .filter(r => r.symptomId === selectedSymptom.id)
                      .map(resource => (
                        <div key={resource.id} className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                          <button 
                            onClick={() => handleDeleteResource(resource.id)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              {resource.type === 'link' ? <LinkIcon className="w-5 h-5 text-blue-500" /> : 
                               resource.type === 'file' ? <FileText className="w-5 h-5 text-orange-500" /> : 
                               <FileText className="w-5 h-5 text-slate-500" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 mb-1">{resource.title}</h4>
                              {resource.type === 'link' ? (
                                <a href={resource.content} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                                  {resource.content}
                                </a>
                              ) : (
                                <p className="text-xs text-slate-500 line-clamp-2">{resource.content}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Consultant Sidebar */}
        <AnimatePresence>
          {isConsultantOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsConsultantOpen(false)}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
              >
                {/* Consultant Header */}
                <div className="p-6 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Clinical Consultant</h3>
                      <p className="text-xs text-slate-500 font-medium">AI-Powered Evidence-Based Guidance</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsConsultantOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Consultant Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                  {!consultantResponse && !isConsulting && (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">How can I help?</h4>
                      <p className="text-sm text-slate-500 mb-6">
                        Ask about treatment protocols, evidence-based strategies, or specific clinical scenarios related to {selectedSymptom ? selectedSymptom.label : 'SLP practice'}.
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                        <button 
                          onClick={() => setConsultantQuery("What are the contraindications for NMES in dysphagia?")}
                          className="text-xs bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-left"
                        >
                          "Contraindications for NMES?"
                        </button>
                        <button 
                          onClick={() => setConsultantQuery("Suggest functional goals for mild cognitive impairment.")}
                          className="text-xs bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-left"
                        >
                          "Goals for mild cognitive impairment?"
                        </button>
                      </div>
                    </div>
                  )}

                  {isConsulting && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                      <p className="text-sm font-medium text-slate-500 animate-pulse">Analyzing clinical evidence...</p>
                    </div>
                  )}

                  {consultantError && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-900 mb-1">Consultation Error</h4>
                        <p className="text-xs text-red-700 leading-relaxed">{consultantError}</p>
                        <button 
                          onClick={handleConsult}
                          className="mt-2 text-xs font-bold text-red-700 hover:text-red-900 underline"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {consultantResponse && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Main Response */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                          <Bot className="w-3 h-3" />
                          Consultant Response
                        </div>
                        <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">
                          {consultantResponse.text}
                        </p>
                      </div>

                      {/* Reasoning */}
                      {consultantResponse.reasoning && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                            <Brain className="w-3 h-3" />
                            Clinical Reasoning
                          </div>
                          <p className="text-blue-900 text-xs leading-relaxed italic">
                            {consultantResponse.reasoning}
                          </p>
                        </div>
                      )}

                      {/* Citations */}
                      {Array.isArray(consultantResponse.citations) && consultantResponse.citations.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            Evidence Sources
                          </h5>
                          {consultantResponse.citations.map((cite, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                              <div className="font-bold text-slate-900">{cite.source}</div>
                              <div className="text-slate-500 mt-1">{cite.relevance}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="relative">
                    <textarea
                      value={consultantQuery}
                      onChange={(e) => setConsultantQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleConsult();
                        }
                      }}
                      placeholder="Ask a clinical question..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 transition-all"
                    />
                    <button 
                      onClick={handleConsult}
                      disabled={!consultantQuery.trim() || isConsulting}
                      className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isConsulting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    AI-generated guidance. Always verify with facility protocols and clinical judgment.
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && selectedSymptom && (
          <UploadModal 
            symptomId={selectedSymptom.id} 
            onClose={() => setIsUploadModalOpen(false)} 
            onAdd={handleAddResource} 
          />
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Clinical Pathways" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}

function PathwayColumn({ title, icon: Icon, color, items }: { title: string, icon: any, color: string, items: PathwayOption[] }) {
  const colorStyles = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30',
    violet: 'bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/30'
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 p-3 rounded-t-xl border-b-0 border ${colorStyles[color as keyof typeof colorStyles]} font-semibold`}>
        <Icon className="w-4 h-4" />
        {title}
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-xl p-4 space-y-3 flex-1 shadow-sm">
        {Array.isArray(items) && items.map(item => (
          <div key={item.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-1">
              <h5 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                    {item.title}
                    <LinkIcon className="w-3 h-3" />
                  </a>
                ) : item.title}
              </h5>
              {item.evidenceLevel === 'High' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium border border-green-200 dark:border-green-800">
                  High Evid.
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{item.description}</p>
            {item.media && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                {item.media.type === 'image' ? (
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={item.media.url} 
                      alt={item.media.caption} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                      <p className="text-[10px] text-white text-center truncate">{item.media.caption}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer">
                    <Video className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                      <p className="text-[10px] text-white text-center truncate">{item.media.caption}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadModal({ symptomId, onClose, onAdd }: { symptomId: string, onClose: () => void, onAdd: (r: any) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<'link' | 'note'>('link');
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onAdd({ title, type, content, symptomId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Add Resource</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Dysphagia Handout"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setType('link')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${type === 'link' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                Link / URL
              </button>
              <button 
                type="button"
                onClick={() => setType('note')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${type === 'note' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                Note / Text
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {type === 'link' ? 'URL' : 'Content'}
            </label>
            {type === 'link' ? (
              <input 
                type="url" 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://..."
              />
            ) : (
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                placeholder="Enter your notes here..."
              />
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors mt-2"
          >
            Save Resource
          </button>
        </form>
      </motion.div>
    </div>
  );
}
