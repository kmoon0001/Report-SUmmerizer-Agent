import { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, AlertTriangle, Target, Lightbulb, Cpu, Eye, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { aiService, SMARTGoalResponse } from '../services/ai-service';
import { cn } from '../lib/utils';
import { GOAL_BANK } from '../data/goal-bank';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { CounterCard } from './CounterCard';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { useSearchContext } from '../context/SearchContext';
import { MEDICARE_KNOWLEDGE_BASE } from '../data/medicare-knowledge-base';
import { useAI } from '../context/AIContext';

import { parseAIResponse } from '../utils/json-parser';

import { SearchWarningBanner } from './SearchWarningBanner';

export function GoalGenerator({ initialTask, initialDomain }: { initialTask?: string; initialDomain?: string }) {
  const [activeTab, setActiveTab] = useState<'generator' | 'bank'>('generator');
  const [domain, setDomain] = useState(initialDomain || 'Swallowing');
  const [level, setLevel] = useState('Moderate');
  const [task, setTask] = useState(initialTask || 'thin liquids');
  const [assessmentFindings, setAssessmentFindings] = useState('');
  const [ensureCompliance, setEnsureCompliance] = useState(false);
  
  const [generatedGoals, setGeneratedGoals] = useState<SMARTGoalResponse['goals']>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);

  const { localModelLoaded } = useSystemStatus();
  const { isInternetSearchEnabled, setInternetSearchEnabled } = useSearchContext();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedGoals([]);
    try {
      if (ensureCompliance) {
        const prompt = `
          You are an expert SLP clinical assistant. Generate 3 SMART goals for:
          Domain: ${domain}
          Level of Assistance: ${level}
          Task: ${task}
          Assessment Findings: ${assessmentFindings}
          
          CRITICAL MEDICARE PART B COMPLIANCE:
          These goals MUST comply with Medicare Part B regulations (CMS Chapter 15, Jimmo v. Sebelius, Noridian LCDs).
          - They must be functional, measurable, and have a specific timeframe.
          - They must clearly require the *skills of a therapist* (not routine exercises).
          - If maintenance therapy (per Jimmo), the goal must reflect preventing/slowing decline.
          
          Strictly output ONLY valid JSON matching this structure:
          {
            "goals": [
              {
                "text": "Full goal text",
                "components": {
                  "specific": "...",
                  "measurable": "...",
                  "achievable": "...",
                  "relevant": "...",
                  "timeBound": "..."
                },
                "rationale": "Explain why this goal is Medicare compliant and requires skilled SLP intervention."
              }
            ]
          }
        `;
        
        const response = await aiService.generateContent(prompt, {
          useInternet: isInternetSearchEnabled,
          systemInstruction: "You are a clinical SLP assistant. You only output valid JSON."
        });
        
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = parseAIResponse(cleanedResponse, { goals: [] });
        setGeneratedGoals(parsed.goals);
      } else {
        const result = await aiService.generateSMARTGoals(domain, level, task, assessmentFindings);
        setGeneratedGoals(result.goals);
      }
    } catch (error) {
      console.error("Failed to generate goals", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <CounterCard label="Goals Generated" value="156" icon={Target} color="text-indigo-600" bg="bg-indigo-50" />
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-indigo-900 tracking-tight">SMART Goal Builder</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-indigo-600 font-medium">AI-drafted goals aligned with Medicare standards.</p>
              {localModelLoaded && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                  <Cpu className="w-3 h-3" /> Local AI Active
                </span>
              )}
            </div>
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

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('generator')}
          className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeTab === 'generator' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
        >
          SMART Generator
        </button>
        <button 
          onClick={() => setActiveTab('bank')}
          className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeTab === 'bank' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
        >
          Goal Bank
        </button>
      </div>

      <SearchWarningBanner />

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div>
                <label htmlFor="domain-select" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Domain</label>
                <select 
                  id="domain-select"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-700"
                >
                  <option>Swallowing</option>
                  <option>Memory</option>
                  <option>Expressive Language</option>
                  <option>Receptive Language</option>
                  <option>Attention</option>
                  <option>Voice</option>
                  <option>Motor Speech</option>
                </select>
              </div>

              <div>
                <label htmlFor="level-select" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Level of Assistance</label>
                <select 
                  id="level-select"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-700"
                >
                  <option>Independent</option>
                  <option>Setup Assistance</option>
                  <option>Supervision</option>
                  <option>Min Cues</option>
                  <option>Moderate Cues</option>
                  <option>Max Cues</option>
                  <option>Total Assist</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-input" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Specific Task / Target</label>
                <input 
                  id="task-input"
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g., thin liquids, medication management"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-700"
                />
              </div>

              <div>
                <label htmlFor="findings-input" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assessment Findings</label>
                <textarea 
                  id="findings-input"
                  value={assessmentFindings}
                  onChange={(e) => setAssessmentFindings(e.target.value)}
                  placeholder="e.g., patient presents with reduced pharyngeal swallow efficiency, delayed trigger..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-700 h-24 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${ensureCompliance ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Medicare Part B Compliance</h4>
                    <p className="text-[10px] text-slate-500">Align goals with CMS Chapter 15 & Jimmo v. Sebelius</p>
                  </div>
                </div>
                <button
                  onClick={() => setEnsureCompliance(!ensureCompliance)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ensureCompliance ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ensureCompliance ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !task}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-900/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Drafting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generate Options
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {Array.isArray(generatedGoals) && generatedGoals.length > 0 ? (
              generatedGoals.map((goal, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Option {idx + 1}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(goal.text, idx)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-slate-800 text-lg leading-relaxed font-medium mb-6 pr-8">
                    "{goal.text}"
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Specific</div>
                      <div className="text-xs text-slate-700 font-medium">{goal.components.specific}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Measurable</div>
                      <div className="text-xs text-slate-700 font-medium">{goal.components.measurable}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <p>{goal.rationale}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-[2rem]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-slate-900 font-bold mb-2">Ready to Build</h4>
                <p className="text-slate-500 text-sm max-w-xs">
                  Select your parameters and click generate to see AI-drafted SMART goals.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Clinical Goal Bank</h3>
          {Object.entries(GOAL_BANK).map(([domain, goals]) => (
            <div key={domain} className="space-y-3">
              <h4 className="font-bold text-indigo-700">{domain}</h4>
              {goals.map((goal, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <p className="text-sm text-slate-700">{goal.text}</p>
                  <button 
                    onClick={() => copyToClipboard(goal.text, idx)}
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-xs">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Clinical Safeguard:</strong> These goals are drafts generated by AI. As the treating clinician, you are responsible for ensuring they are individualized, medically necessary, and compliant with your facility's policies.
        </p>
      </div>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Goal Generator" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}
