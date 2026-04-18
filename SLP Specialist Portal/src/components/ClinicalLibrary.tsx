import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  BookOpen, 
  AlertCircle, 
  Loader2,
  Trash2,
  MessageSquare,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { aiService } from '../services/ai-service';
import { ModuleLayout } from './layout/ModuleLayout';
import { parseFetchResponse } from '../utils/json-parser';
import { useNotifications } from '../context/NotificationContext';

export function ClinicalLibrary({ onBack }: { onBack?: () => void }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);
  const { notify } = useNotifications();
  
  // Chat State
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [docTextCache, setDocTextCache] = useState<Record<string, string>>({});

  // Reset transient status messages when context changes
  useEffect(() => {
    setError(null);
  }, [activeDoc]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/library/documents');
      const data = await parseFetchResponse(response, []);
      setDocuments(data);
    } catch (err: any) {
      console.error("Failed to load documents", err);
      setError("Failed to load library documents.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await fetch('/api/library/upload', {
        method: 'POST',
        body: formData
      });
      
      await parseFetchResponse(response);
      await loadDocuments();
    } catch (err: any) {
      console.error("PDF upload failed", err);
      setError(err.message || "Failed to upload PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    // Note: Backend doesn't have delete yet, but we can add it or just ignore for now
    notify('info', "Delete functionality not yet implemented on backend.");
  };

  const handleOpenChat = async (doc: any) => {
    setActiveDoc(doc);
    setChatHistory([]);
    setError(null);
    
    // Pre-load text if not cached
    if (!docTextCache[doc.id]) {
      try {
        const response = await fetch(`/api/library/documents/${doc.id}`);
        const data = await parseFetchResponse(response);
        setDocTextCache(prev => ({ ...prev, [doc.id]: data.content }));
      } catch {
        setError("Failed to load document content.");
      }
    }
  };

  const handleSummarize = async () => {
    if (!activeDoc || !docTextCache[activeDoc.id]) return;
    
    setIsSummarizing(true);
    try {
      const summary = await aiService.summarizeDocument(docTextCache[activeDoc.id]);
      setChatHistory(prev => [...prev, { role: 'ai', content: `**Summary of ${activeDoc.name}:**\n\n${summary}` }]);
    } catch {
      setError("Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeDoc || !docTextCache[activeDoc.id]) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatting(true);

    try {
      const response = await aiService.chatWithDocument(docTextCache[activeDoc.id], userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      console.error("Chat failed", err);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error analyzing the document." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <ModuleLayout
      title="Clinical Library"
      subtitle="Upload protocols and research to chat with them offline."
      onBack={onBack}
      isPatientView={isPatientView}
      setIsPatientView={setIsPatientView}
    >
      <div className="h-full flex flex-col gap-8">
        <div className="flex justify-end">
          <label className="cursor-pointer group">
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={isUploading} />
            <div className={cn(
              "px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg",
              isUploading ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
            )}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? "Processing..." : "Upload PDF"}
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Document List */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 shrink-0">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                My Documents
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {Array.isArray(documents) && documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => handleOpenChat(doc)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group relative",
                      activeDoc?.id === doc.id 
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30 shadow-sm" 
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                          activeDoc?.id === doc.id ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-bold line-clamp-1",
                            activeDoc?.id === doc.id ? "text-emerald-900 dark:text-emerald-100" : "text-slate-900 dark:text-slate-100"
                          )}>{doc.name}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                        className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                    <FileText className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">No PDFs yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-8 h-full min-h-0">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden relative">
              {activeDoc ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">Chat with Document</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[300px]">{activeDoc.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing || !docTextCache[activeDoc.id]}
                        className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Summarize
                      </button>
                      <button onClick={() => setActiveDoc(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30">
                    {chatHistory.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                        <BookOpen className="w-12 h-12 text-emerald-200 dark:text-emerald-800 mb-4" />
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Ask a question about this document</p>
                        <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">"Summarize the exclusion criteria..."</p>
                      </div>
                    )}
                    {Array.isArray(chatHistory) && chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          msg.role === 'user' ? "bg-slate-900 dark:bg-slate-700 text-white" : "bg-emerald-600 text-white"
                        )}>
                          {msg.role === 'user' ? <div className="text-[10px] font-bold">YOU</div> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap",
                          msg.role === 'user' 
                            ? "bg-slate-900 dark:bg-slate-700 text-white rounded-tr-none" 
                            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 animate-pulse">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-2xl rounded-tl-none text-slate-400 dark:text-slate-500 text-sm italic">
                          Analyzing document...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question..."
                        disabled={isChatting}
                        className="w-full pl-4 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isChatting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-500">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Select a Document</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Choose a PDF from your library to start chatting with it using the Local AI.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-8 right-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-900 shadow-xl z-50 max-w-md animate-in slide-in-from-bottom-5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
