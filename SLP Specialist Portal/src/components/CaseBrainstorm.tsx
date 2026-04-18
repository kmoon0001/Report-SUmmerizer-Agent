import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Lightbulb, 
  ArrowRight,
  MoreHorizontal,
  Brain,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { aiService, CaseStudyScenario, CaseStudyFeedback } from '../services/ai-service';
import { CASE_STUDIES } from '../utils/case-study-data';
import { CLINICAL_QUESTIONS } from '../utils/clinical-questions';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function CaseBrainstorm() {
  const [mode, setMode] = useState<'discussion' | 'simulation'>('discussion');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);
  
  // Simulation State
  const [simTopic, setSimTopic] = useState('Dysphagia');
  const [scenario, setScenario] = useState<CaseStudyScenario | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<CaseStudyFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState(CLINICAL_QUESTIONS[0]);

  const activeCase = CASE_STUDIES.find(c => c.id === activeCaseId);

  useEffect(() => {
    // Randomize question on mount, active case change, or mode change
    const randomIndex = Math.floor(Math.random() * CLINICAL_QUESTIONS.length);
    setRandomQuestion(CLINICAL_QUESTIONS[randomIndex]);
  }, [activeCaseId, mode]);

  const startSimulation = async () => {
    setIsLoading(true);
    setScenario(null);
    setFeedback(null);
    setUserResponse('');
    try {
      const result = await aiService.generateCaseStudy(simTopic);
      setScenario(result);
    } catch (error) {
      console.error("Failed to generate case study", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!scenario || !userResponse) return;
    setIsLoading(true);
    try {
      const result = await aiService.evaluateCaseStudyResponse(scenario.scenario, userResponse);
      setFeedback(result);
    } catch (error) {
      console.error("Failed to evaluate response", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => (
    <div className="h-full flex flex-col space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
            {mode === 'discussion' ? <Users className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'discussion' ? 'Case Brainstorm' : 'Clinical Reasoning Sandbox'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {mode === 'discussion' 
                ? 'Anonymous, PHI-free clinical reasoning space.' 
                : 'Interactive patient simulations with AI feedback.'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
          >
            <Eye className="w-4 h-4" />
            Patient View
          </button>
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setMode('discussion')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'discussion' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Discussion
            </button>
            <button 
              onClick={() => setMode('simulation')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'simulation' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Simulation
            </button>
          </div>
        </div>
      </div>

      {mode === 'discussion' ? (
        // ... Existing Discussion Mode Code ...
        <>
          {/* PHI Warning Banner */}
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-rose-500 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-rose-900 text-sm mb-1">STRICT NO-PHI POLICY</div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Do NOT include names, dates of birth, facility names, or any other identifying information. Use age (e.g., 80yo), gender, and medical history only. All posts are anonymous to protect patient and clinician privacy.
              </p>
            </div>
          </div>

          <div className="flex-1 flex gap-8 overflow-hidden">
            {/* Case List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {CASE_STUDIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCaseId(item.id)}
                  className={`w-full p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-4 group ${
                    activeCaseId === item.id 
                    ? 'bg-orange-50 border-orange-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-orange-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.topic === 'Dysphagia' ? 'bg-emerald-100 text-emerald-700' : 
                        item.topic === 'Cognition' ? 'bg-violet-100 text-violet-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {item.topic}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulation</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.scenario}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-200">
                      #ClinicalReasoning
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Case Detail / Discussion */}
            <div className="w-full lg:w-[450px] bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              {activeCase ? (
                <>
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">
                          AI
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Clinical Simulation</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Active Case</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setMode('simulation');
                            setSimTopic(activeCase.topic);
                            setScenario({
                              id: activeCase.id,
                              title: activeCase.title,
                              scenario: activeCase.scenario,
                              clinicalQuestion: activeCase.clinicalQuestion,
                              correctAnswer: "Refer to case discussion.",
                              explanation: "This is a pre-built case. See discussion for details."
                            });
                            setFeedback(null);
                            setUserResponse('');
                          }}
                          className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors"
                          title="Simulate this case with AI"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{activeCase.title}</h3>
                    
                    {/* Random Clinical Question / Tidbit */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
                      <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" />
                        Did You Know?
                      </div>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed italic mb-2">
                        "{randomQuestion.question}"
                      </p>
                      <p className="text-xs text-slate-500">
                        {randomQuestion.answer} <span className="font-semibold text-slate-400">- {randomQuestion.source}</span>
                      </p>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm mb-6">
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Brain className="w-3 h-3" />
                        Clinical Task
                      </div>
                      <p className="text-sm font-bold text-blue-900 leading-relaxed">
                        {activeCase.clinicalQuestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold shrink-0">S</div>
                      <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-900 text-sm mb-1">SLP_Expert_88</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          This is a great case for discussion. I would recommend looking into the evidence for...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100">
                    <div className="relative">
                      <textarea 
                        placeholder="Add your clinical insight..." 
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none h-24"
                      />
                      <button className="absolute right-3 bottom-3 p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Case</h3>
                  <p className="text-sm text-slate-500 max-w-xs">Choose a case from the list to view the clinical discussion or start your own.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // --- SIMULATION MODE ---
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {!scenario ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20" />
                <Brain className="w-16 h-16 text-orange-600" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Clinical Simulation</h3>
                
                {/* Random Tidbit Card */}
                <div className="max-w-md mx-auto mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
                   <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lightbulb className="w-3 h-3" />
                    Did You Know?
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed italic mb-2">
                    "{randomQuestion.question}"
                  </p>
                  <p className="text-xs text-slate-500">
                    {randomQuestion.answer} <span className="font-semibold text-slate-400">- {randomQuestion.source}</span>
                  </p>
                </div>

                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Test your clinical reasoning with AI-generated patient scenarios. Select a topic to begin.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {['Dysphagia', 'Aphasia', 'Cognition', 'Voice', 'Trach/Vent'].map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSimTopic(topic)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        simTopic === topic 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-orange-200 hover:text-orange-600'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <button
                  onClick={startSimulation}
                  disabled={isLoading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  Generate Scenario
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* Scenario Card */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {simTopic} Case
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{scenario.title}</h3>
                  </div>
                  
                  <div className="prose prose-slate max-w-none mb-8">
                    <p className="text-lg text-slate-700 leading-relaxed">{scenario.scenario}</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest mb-2">
                      <Lightbulb className="w-4 h-4" />
                      Your Task
                    </div>
                    <p className="text-blue-900 font-bold text-lg">{scenario.clinicalQuestion}</p>
                  </div>
                </div>

                {/* Feedback Section */}
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-8 rounded-[2rem] border ${
                      feedback.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        feedback.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {feedback.isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className={`text-lg font-black ${
                          feedback.isCorrect ? 'text-emerald-900' : 'text-amber-900'
                        }`}>
                          {feedback.isCorrect ? 'Excellent Reasoning' : 'Consider Alternatives'}
                        </h4>
                        <p className={`text-sm font-medium ${
                          feedback.isCorrect ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          AI Clinical Evaluation
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-6 leading-relaxed">{feedback.feedback}</p>

                    <div className="space-y-3">
                      <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Key Learning Points</h5>
                      {Array.isArray(feedback.learningPoints) && feedback.learningPoints.map((point, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white/50 p-3 rounded-xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          <p className="text-sm text-slate-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              {!feedback && (
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-lg mt-auto">
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Type your clinical rationale and intervention plan here..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none mb-4 text-slate-700"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setScenario(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitResponse}
                      disabled={!userResponse || isLoading}
                      className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Submit Response'}
                    </button>
                  </div>
                </div>
              )}
              
              {feedback && (
                 <button
                  onClick={startSimulation}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Try Another Case
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Case Brainstorm" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
