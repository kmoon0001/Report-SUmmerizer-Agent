import React, { useState } from 'react';
import { aiService } from '../../services/ai-service';
import { useSearchContext } from '../../context/SearchContext';
import { MEDICARE_KNOWLEDGE_BASE } from '../../data/medicare-knowledge-base';
import { SearchWarningBanner } from '../SearchWarningBanner';
import { FileText, ShieldCheck, AlertCircle, CheckCircle, Activity, ChevronRight, Loader2, Target, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

import { parseAIResponse } from '../../utils/json-parser';

export const MedicarePartBTracker: React.FC = () => {
  const { isInternetSearchEnabled } = useSearchContext();
  const [formData, setFormData] = useState({
    diagnosis: '',
    cptCode: '',
    functionalStatus: '',
    progress: '',
    skilledIntervention: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!Object.values(formData).some(v => v.trim())) {
      setError('Please fill in at least one field to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
        const prompt = `
        You are an expert Medicare Part B auditor and SLP clinical reviewer. 
        Analyze the following clinical data for Medicare Part B SLP eligibility and documentation compliance.
        
        AUTHORITATIVE SOURCES:
        1. CMS Benefit Policy Manual Chapter 15: ${JSON.stringify(MEDICARE_KNOWLEDGE_BASE.chapter15)}
        2. Jimmo v. Sebelius Settlement: ${MEDICARE_KNOWLEDGE_BASE.jimmo.content}
        3. Noridian LCD Guidelines: ${MEDICARE_KNOWLEDGE_BASE.noridian.content}

        FEW-SHOT EXAMPLES:
        Example 1:
        Input: {"diagnosis": "Dysphagia", "cptCode": "92526", "functionalStatus": "Aspiration on thin liquids", "progress": "Minimal", "skilledIntervention": "Compensatory strategies"}
        Output: {
          "eligible": true, 
          "complianceScore": 85, 
          "candidacyPercentage": 90, 
          "chainOfThought": ["Diagnosis is covered", "CPT 92526 is appropriate for dysphagia"], 
          "missingRequirements": ["Need to document specific safety maneuvers"], 
          "recommendations": ["Add specific maneuvers"], 
          "skilledRationale": "Skilled SLP intervention required due to aspiration risk...",
          "citations": [
            {"source": "CMS MBPM Ch 15, Sec 220", "guidance": "Services must require the skills of a qualified therapist.", "url": "https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Downloads/bp102c15.pdf"}
          ]
        }

        CLINICAL DATA:
        ${JSON.stringify(formData, null, 2)}

        INSTRUCTIONS:
        Evaluate the patient's candidacy and documentation quality.
        Provide a structured JSON response with the following keys:
        - "eligible": boolean
        - "complianceScore": number (0-100)
        - "candidacyPercentage": number (0-100)
        - "chainOfThought": array of strings (step-by-step reasoning with citations)
        - "missingRequirements": array of strings
        - "recommendations": array of strings
        - "skilledRationale": string (A high-quality, Medicare-compliant skilled rationale statement)
        - "citations": array of objects with "source", "guidance", and "url" (Direct links to CMS/MAC guidance)

        Return ONLY valid JSON. Do not include markdown formatting.
      `;

      const response = await aiService.generateContent(prompt, {
        enableSearch: isInternetSearchEnabled,
        systemInstruction: "You are a strict Medicare compliance auditor. You only output valid JSON."
      });

      const parsedResult = parseAIResponse<any>(response, {
        eligible: false,
        complianceScore: 0,
        candidacyPercentage: 0,
        chainOfThought: [],
        missingRequirements: [],
        recommendations: [],
        skilledRationale: "Failed to parse analysis.",
        citations: []
      });
      setAnalysisResult(parsedResult);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Medicare Part B Compliance Engine
          </h1>
          <p className="text-slate-600 mt-1">
            Structured audit against CMS Chapter 15, Jimmo v. Sebelius, and MAC guidelines.
          </p>
        </div>
      </div>

      <SearchWarningBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              <h3 className="font-semibold text-slate-700">Clinical Documentation Input</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                <span>Documentation Completeness</span>
                <span className="font-bold text-blue-600">
                  {Math.round((Object.values(formData).filter(v => v.trim()).length / Object.keys(formData).length) * 100)}%
                </span>
              </div>
              {[
                { id: 'diagnosis', label: 'Diagnosis (ICD-10)', placeholder: 'e.g., Dysphagia, oropharyngeal phase' },
                { id: 'cptCode', label: 'CPT Code(s)', placeholder: 'e.g., 92526' },
                { id: 'functionalStatus', label: 'Current Functional Status', placeholder: 'Describe current swallow safety/communication' },
                { id: 'progress', label: 'Progress towards Goals', placeholder: 'Describe measurable progress' },
                { id: 'skilledIntervention', label: 'Skilled Intervention Provided', placeholder: 'Describe the skilled SLP technique' }
              ].map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <textarea
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    rows={2}
                  />
                </div>
              ))}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                Evaluate Compliance
              </button>
            </div>
          </div>
        </div>

        <div>
          {analysisResult ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border ${analysisResult.eligible ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="text-sm font-medium text-slate-500 mb-1">Compliance Score</div>
                  <div className={`text-3xl font-bold ${analysisResult.complianceScore > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {analysisResult.complianceScore}/100
                  </div>
                </div>
                <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-sm">
                  <div className="text-sm font-medium text-slate-500 mb-1">Candidacy Match</div>
                  <div className="text-3xl font-bold text-blue-600">{analysisResult.candidacyPercentage}%</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Recommended Skilled Rationale</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">{analysisResult.skilledRationale}</p>
              </div>

              {Array.isArray(analysisResult.citations) && analysisResult.citations.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Authoritative Guidance & Citations
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.citations.map((cite: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-bold text-blue-900">{cite.source}</div>
                        <p className="text-blue-800 mb-1">{cite.guidance}</p>
                        {cite.url && (
                          <a 
                            href={cite.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                          >
                            View Official Source <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(analysisResult.missingRequirements) && analysisResult.missingRequirements.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Missing Requirements
                  </h4>
                  <ul className="space-y-1">
                    {analysisResult.missingRequirements.map((req: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-700">• {req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 min-h-[400px]">
              <Target className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-center">Enter clinical data and click evaluate to see Medicare Part B compliance analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
