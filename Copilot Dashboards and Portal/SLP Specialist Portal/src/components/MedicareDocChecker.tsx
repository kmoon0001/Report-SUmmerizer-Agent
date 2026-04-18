import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Loader2, 
  ShieldCheck, 
  FileSearch,
  History,
  Scale,
  BookOpen,
  ClipboardCheck,
  ChevronRight,
  Search,
  XCircle,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
  Check,
  X,
  Eye
} from 'lucide-react';
import { aiService } from '../services/ai-service';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Type } from '@google/genai';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { parseAIResponse } from '../utils/json-parser';

type CheckerMode = 'audit' | 'candidacy' | 'section-k';

interface ChecklistItem {
  label: string;
  status: 'fulfilled' | 'missing' | 'partial';
  details: string;
}

interface AnalysisData {
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  checklist: ChecklistItem[];
  chainOfThought: string;
  logicMapping: string[];
  suggestions: string[];
  candidacyStatus?: 'Strong' | 'Moderate' | 'Weak';
}

export function MedicareDocChecker() {
  const [mode, setMode] = useState<CheckerMode>('audit');
  const [file, setFile] = useState<File | null>(null);
  const [historyText, setHistoryText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a valid PDF file.');
        setFile(null);
      }
    }
  };

  const handleAnalyzeAudit = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result?.toString().split(',')[1];
        if (!base64Data) throw new Error("Failed to read file data");

        const prompt = `
          You are an expert Medicare Part B compliance auditor for Speech-Language Pathology.
          Analyze the provided clinical documentation (PDF) strictly against:
          - Medicare Benefit Policy Manual (MBPM) Chapter 15
          - General vs. Specific Rulings (e.g., General coverage rules vs. specific SLP requirements)
          - Skilled vs. Non-skilled maintenance criteria (Jimmo v. Sebelius)
          
          Your goal is to judge if this document is sufficient for Part B reimbursement.
          
          Provide a detailed XAI analysis including:
          1. Chain of Thought: Your step-by-step reasoning process.
          2. Logic Mapping: How specific findings map to MBPM Ch 15 sections.
          3. Checklist: Status of key compliance components.
        `;

        const schema = {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            summary: { type: Type.STRING },
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['fulfilled', 'missing', 'partial'] },
                  details: { type: Type.STRING }
                },
                required: ['label', 'status', 'details']
              }
            },
            chainOfThought: { type: Type.STRING },
            logicMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['riskLevel', 'summary', 'checklist', 'chainOfThought', 'logicMapping', 'suggestions']
        };

        try {
          const response = await aiService.analyzeDocument(base64Data, 'application/pdf', prompt, {
            responseMimeType: 'application/json',
            responseSchema: schema
          });
          setAnalysisData(parseAIResponse(response, null));
        } catch (err) {
          setError("Failed to analyze the document. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCandidacy = async () => {
    if (!historyText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);

    const prompt = `
      You are a Medicare Part B Utilization Review Expert.
      Analyze the following medical record history to determine if the patient is a good candidate for Medicare Part B SLP services.
      
      History:
      ${historyText}
      
      Analyze based on:
      - Medicare Benefit Policy Manual Chapter 15 guidelines for Part B.
      - Potential for functional improvement OR need for skilled maintenance to prevent decline.
      - Medical complexity and comorbidities.
      
      Provide a detailed XAI analysis including:
      1. Chain of Thought: Your step-by-step reasoning process.
      2. Logic Mapping: How specific patient factors map to Part B eligibility criteria.
      3. Checklist: Status of candidacy indicators.
    `;

    const schema = {
      type: Type.OBJECT,
      properties: {
        candidacyStatus: { type: Type.STRING, enum: ['Strong', 'Moderate', 'Weak'] },
        riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        summary: { type: Type.STRING },
        checklist: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              status: { type: Type.STRING, enum: ['fulfilled', 'missing', 'partial'] },
              details: { type: Type.STRING }
            },
            required: ['label', 'status', 'details']
          }
        },
        chainOfThought: { type: Type.STRING },
        logicMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['candidacyStatus', 'riskLevel', 'summary', 'checklist', 'chainOfThought', 'logicMapping', 'suggestions']
    };

    try {
      const response = await aiService.generateContent(prompt, {
        responseMimeType: 'application/json',
        responseSchema: schema
      });
      setAnalysisData(parseAIResponse(response, null));
    } catch (err) {
      setError("Failed to analyze candidacy. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden relative">
      {/* Patient View Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      {/* Header */}
      <div className="bg-white border-b border-slate-400 px-8 py-6 shrink-0 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">Part B Checker</h1>
              <p className="text-sm text-slate-700 font-bold uppercase tracking-wider">Medicare Compliance & Candidacy Expert</p>
            </div>
          </div>
          
          <div className="flex bg-slate-200 p-1.5 rounded-2xl border border-slate-400">
            {[
              { id: 'audit', label: 'Document Audit', icon: FileSearch },
              { id: 'candidacy', label: 'Candidacy Screening', icon: History },
              { id: 'section-k', label: 'Section K', icon: ClipboardCheck },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setMode(t.id as CheckerMode);
                  setAnalysisData(null);
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-tight",
                  mode === t.id 
                    ? "bg-white text-emerald-800 shadow-md border border-slate-300" 
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/50"
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <AnimatePresence mode="wait">
            {mode === 'audit' && (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-400 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  
                  <div className="flex items-start gap-6 mb-10 relative z-10">
                    <div className="p-4 bg-blue-700 rounded-2xl text-white shadow-lg shadow-blue-700/20">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">Document Audit Mode</h2>
                      <p className="text-slate-700 font-bold mt-1">
                        Upload a clinical note or evaluation to review against MBPM Chapter 15 and specific SLP rulings.
                      </p>
                    </div>
                  </div>

                  <div className="border-3 border-dashed border-slate-400 rounded-[2rem] p-16 text-center hover:bg-slate-50 hover:border-blue-500 transition-all relative group cursor-pointer bg-slate-50/50">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-white text-blue-700 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-slate-300">
                        <Upload className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-950">
                          {file ? file.name : "Drop PDF documentation here"}
                        </p>
                        <p className="text-sm font-black text-slate-600 mt-2 uppercase tracking-widest">Supports PDF format only</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-6 p-5 bg-red-50 text-red-900 rounded-2xl flex items-center gap-3 text-sm font-black border-2 border-red-200">
                      <AlertTriangle className="w-6 h-6 text-red-700" />
                      {error}
                    </div>
                  )}

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleAnalyzeAudit}
                      disabled={!file || isAnalyzing}
                      className="px-10 py-4 bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-800 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-emerald-700/30 hover:-translate-y-1 active:translate-y-0"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Auditing Document...
                        </>
                      ) : (
                        <>
                          <Search className="w-6 h-6" />
                          Run Compliance Audit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === 'candidacy' && (
              <motion.div 
                key="candidacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-400 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                  <div className="flex items-start gap-6 mb-10 relative z-10">
                    <div className="p-4 bg-amber-700 rounded-2xl text-white shadow-lg shadow-amber-700/20">
                      <History className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">Candidacy Screening Mode</h2>
                      <p className="text-slate-700 font-bold mt-1">
                        Paste medical history, recent changes, or prior therapy notes to determine Part B eligibility.
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={historyText}
                    onChange={(e) => setHistoryText(e.target.value)}
                    placeholder="Paste medical record history here (e.g., 'Pt is 82yo female s/p CVA 2 weeks ago, currently in SNF for rehab. Prior level of function was independent...')"
                    className="w-full h-80 p-8 bg-slate-50 border-2 border-slate-300 rounded-[2rem] text-base font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
                  />

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleAnalyzeCandidacy}
                      disabled={!historyText.trim() || isAnalyzing}
                      className="px-10 py-4 bg-amber-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-800 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-amber-700/30 hover:-translate-y-1 active:translate-y-0"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Screening Candidacy...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Check Part B Candidacy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === 'section-k' && (
              <motion.div 
                key="section-k"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-300 shadow-xl">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-600/20">
                        <ClipboardCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">Section K Guide (MDS)</h2>
                        <p className="text-slate-600 font-medium mt-1 uppercase tracking-wider text-xs">Swallowing and Nutritional Status Coding</p>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/20">
                      Medicare Part A Only
                    </div>
                  </div>

                  <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] mb-10 shadow-sm">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-red-950">Important Disclaimer</h4>
                        <p className="text-sm text-red-800 mt-2 leading-relaxed font-medium">
                          Section K of the MDS is specifically designed for <strong>Medicare Part A (PPS)</strong> reimbursement and quality reporting. While swallowing data is relevant to clinical care, Section K coding rules do not directly apply to Medicare Part B billing or documentation requirements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full" />
                        K0100: Swallowing Disorder
                      </h4>
                      <div className="space-y-3">
                        {[
                          { code: 'A', label: 'Loss of liquids/solids from mouth' },
                          { code: 'B', label: 'Holding food in cheek/mouth (pocketing)' },
                          { code: 'C', label: 'Coughing or choking during meals/meds' },
                          { code: 'D', label: 'Complaints of pain or difficulty swallowing' },
                          { code: 'Z', label: 'None of the above' },
                        ].map(item => (
                          <div key={item.code} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors group">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-950">{item.label}</span>
                            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-lg uppercase">Code {item.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full" />
                        K0510: Nutritional Approaches
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Parenteral/IV feeding', type: 'K0510A' },
                          { label: 'Feeding tube (nasogastric, gastrostomy)', type: 'K0510B' },
                          { label: 'Mechanically altered diet', type: 'K0510C' },
                          { label: 'Therapeutic diet', type: 'K0510D' },
                        ].map(item => (
                          <div key={item.type} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors group">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-950">{item.label}</span>
                            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-lg uppercase">{item.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          {analysisData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              {/* Summary & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-300 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
                      <FileText className="w-7 h-7 text-emerald-600" />
                      Executive Summary
                    </h2>
                    {analysisData.candidacyStatus && (
                      <div className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg",
                        analysisData.candidacyStatus === 'Strong' ? "bg-emerald-600 text-white shadow-emerald-600/20" :
                        analysisData.candidacyStatus === 'Moderate' ? "bg-amber-500 text-white shadow-amber-500/20" :
                        "bg-red-600 text-white shadow-red-600/20"
                      )}>
                        {analysisData.candidacyStatus} Candidacy
                      </div>
                    )}
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    {analysisData.summary}
                  </p>
                  
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Risk Assessment</h4>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-4 h-4 rounded-full",
                          analysisData.riskLevel === 'Low' ? "bg-emerald-500" :
                          analysisData.riskLevel === 'Medium' ? "bg-amber-500" :
                          "bg-red-500"
                        )} />
                        <span className="text-xl font-black text-slate-900">{analysisData.riskLevel} Risk</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Compliance Score</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-black text-emerald-600">
                          {Math.round(((Array.isArray(analysisData.checklist) ? analysisData.checklist.filter(i => i.status === 'fulfilled').length : 0) / (Array.isArray(analysisData.checklist) ? analysisData.checklist.length : 1)) * 100)}%
                        </div>
                        <span className="text-sm font-bold text-slate-500">Criteria Met</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist - The Xs and Os */}
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <ClipboardCheck className="w-6 h-6 text-emerald-400" />
                    Compliance Checklist
                  </h3>
                  <div className="space-y-5 relative z-10">
                    {Array.isArray(analysisData.checklist) && analysisData.checklist.map((item, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center gap-4 mb-2">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all",
                            item.status === 'fulfilled' ? "bg-emerald-500 border-emerald-500 text-white" :
                            item.status === 'partial' ? "bg-amber-500 border-amber-500 text-white" :
                            "bg-red-500/20 border-red-500 text-red-500"
                          )}>
                            {item.status === 'fulfilled' ? <Check className="w-5 h-5 stroke-[3]" /> :
                             item.status === 'partial' ? <Zap className="w-4 h-4 fill-current" /> :
                             <X className="w-5 h-5 stroke-[3]" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-black tracking-tight">{item.label}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.status}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 ml-12 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* XAI Transparency - Chain of Thought & Logic Mapping */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-300 shadow-xl">
                  <h3 className="text-xl font-black text-slate-950 mb-8 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    XAI: Chain of Thought
                  </h3>
                  <div className="prose prose-slate prose-sm max-w-none">
                    <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic">
                      {analysisData.chainOfThought}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-300 shadow-xl">
                  <h3 className="text-xl font-black text-slate-950 mb-8 flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    Regulatory Logic Mapping
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(analysisData.logicMapping) && analysisData.logicMapping.map((logic, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">
                          {logic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="bg-emerald-50 p-10 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl">
                <h3 className="text-xl font-black text-emerald-950 mb-8 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-emerald-600" />
                  Actionable Clinical Advice
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.isArray(analysisData.suggestions) && analysisData.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-emerald-900 font-bold leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Medicare Doc Checker" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
