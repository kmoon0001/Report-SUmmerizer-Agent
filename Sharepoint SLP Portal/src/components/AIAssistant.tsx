import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, MessageSquare, ChevronRight, AlertTriangle, ExternalLink, Bot, ShieldCheck, BookOpen, Info } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { aiService, AICitation } from '../services/ai-service';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';

interface Message {
  role: 'ai' | 'user';
  text: string;
  reasoning?: string;
  citations?: AICitation[];
  suggestedActions?: string[];
}

export function AIAssistant({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { isAIActive, toggleAI, context } = useAI();
  const { setIsAIPanelOpen } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm your Clinical Support Assistant. I can help you find resources, check compliance, or draft documentation. I do not make clinical diagnoses." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReasoning, setShowReasoning] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const prompt = `You are an expert SLP Clinical Consultant. Use the following context to answer the user's prompt.
      
      Context: ${context}
      
      Prompt: ${input}
      
      Guidelines:
      - Prioritize evidence-based practice (ASHA, CMS, peer-reviewed literature).
      - Provide structured clinical reasoning.
      - If uncertain, state that clearly and suggest further assessment.
      - Ensure all advice is compliant with Medicare/CMS documentation standards, specifically citing the Medicare Benefit Policy Manual Chapter 15, Jimmo vs. Sebelius settlement, CMS/Noridian guidelines, and CFRs related to SNF/LTC.`;

      // Add a placeholder message for the AI
      setMessages(prev => [...prev, { role: 'ai', text: "" }]);

      const stream = aiService.generateContentStream(prompt);
      
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error: any) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = `I encountered an error: ${error.message || 'Connection failed'}. Please try again, check your internet connection, or enable Local AI Fallback in Settings.`;
        return newMessages;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const content = (
    <div className={cn(
      "h-full flex flex-col bg-slate-950",
      !isEmbedded && "fixed right-0 top-0 h-screen w-full sm:w-[450px] shadow-2xl z-[120] border-l border-white/10"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-indigo-900 to-violet-900 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Clinical Copilot</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-indigo-200 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Active • Context: {context}
                </p>
                <div className="px-1.5 py-0.5 bg-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
                  NIST/FDA Hardened
                </div>
              </div>
            </div>
          </div>
          {!isEmbedded ? (
            <button 
              onClick={toggleAI}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => setIsAIPanelOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Minimize to side"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="bg-indigo-950/40 rounded-lg p-3 text-[10px] text-indigo-200 flex gap-2 items-start border border-indigo-500/20">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p>
            <strong>Compliance Notice:</strong> This AI provides information support only. It is not a medical device and does not make clinical decisions. Always verify outputs.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
                msg.role === 'ai' 
                  ? 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none' 
                  : 'bg-indigo-600 text-white rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            </div>

            {msg.role === 'ai' && (msg.reasoning || msg.citations || msg.suggestedActions) && (
              <div className="ml-11 space-y-3 w-full max-w-[85%]">
                {/* Reasoning Toggle */}
                {msg.reasoning && (
                  <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setShowReasoning(showReasoning === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        Clinical Reasoning (XAI)
                      </span>
                      <ChevronRight className={cn("w-3 h-3 transition-transform", showReasoning === idx && "rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {showReasoning === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 italic"
                        >
                          {msg.reasoning}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cite, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 text-indigo-300 rounded-lg text-[10px] font-bold border border-indigo-500/20 group cursor-help relative"
                      >
                        <BookOpen className="w-3 h-3" />
                        {cite.source}
                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-950 text-white text-[10px] rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {cite.relevance}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="space-y-2">
                    {msg.suggestedActions.map((action, i) => (
                      <button 
                        key={i}
                        onClick={() => setInput(action)}
                        className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all group border border-white/5"
                      >
                        {action}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-indigo-900/40 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for resources, codes, or drafts..."
            className="w-full pl-4 pr-12 py-4 bg-slate-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm text-white placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
            title="Send Clinical Query"
            aria-label="Send Message"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex justify-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Secure
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Evidence-Based
          </span>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) return content;

  return (
    <AnimatePresence>
      {isAIActive && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-slate-950 shadow-2xl z-[120] border-l border-white/10 flex flex-col"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
