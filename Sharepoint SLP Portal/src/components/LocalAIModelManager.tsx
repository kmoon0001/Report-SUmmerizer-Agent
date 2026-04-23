import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Loader2, Trash2, Cpu, AlertTriangle } from 'lucide-react';
import { localAIService, LocalModelType } from '../services/local-ai-service';
import { InitProgressReport } from '@mlc-ai/web-llm';

export function LocalAIModelManager() {
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [loadingModel, setLoadingModel] = useState<LocalModelType | null>(null);
  const [progress, setProgress] = useState<InitProgressReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<LocalModelType | null>(localAIService.getLoadedModel());

  useEffect(() => {
    localAIService.checkWebGPUSupport().then(setIsWebGPUSupported);
    // Poll for active model changes
    const interval = setInterval(() => {
      setActiveModel(localAIService.getLoadedModel());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadModel = async (model: LocalModelType) => {
    setLoadingModel(model);
    setProgress(null);
    setError(null);
    try {
      await localAIService.loadModel(model, (report) => {
        setProgress(report);
      });
      setActiveModel(model);
    } catch (err: any) {
      console.error("Failed to load model", err);
      setError(err.message || "Failed to load model. Ensure you have enough disk space and RAM.");
    } finally {
      setLoadingModel(null);
      setProgress(null);
    }
  };

  const handleUnloadModel = async () => {
    await localAIService.unloadModel();
    setActiveModel(null);
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCache = async () => {
    try {
      await localAIService.clearCache();
      setActiveModel(null);
      setShowClearConfirm(false);
    } catch (e) {
      console.error("Failed to clear cache", e);
    }
  };

  if (isWebGPUSupported === false) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-200 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">WebGPU Not Supported</p>
          <p className="opacity-90 mt-1">Your browser or hardware does not support WebGPU, which is required to run local AI models. Please use Chrome or Edge on a device with a dedicated or modern integrated GPU.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 text-red-800 dark:text-red-200 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Llama 3.2 1B (Lightweight)
          </h4>
          {activeModel === "Llama-3.2-1B-Instruct-q4f16_1-MLC" ? (
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Loaded
            </span>
          ) : (
            <button
              onClick={() => handleLoadModel("Llama-3.2-1B-Instruct-q4f16_1-MLC")}
              disabled={loadingModel !== null}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              {loadingModel === "Llama-3.2-1B-Instruct-q4f16_1-MLC" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              {loadingModel === "Llama-3.2-1B-Instruct-q4f16_1-MLC" ? "Loading..." : "Load Model"}
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Best for fast UI interactions, chat, and summarization. Requires ~800MB of storage and VRAM.
        </p>
        {loadingModel === "Llama-3.2-1B-Instruct-q4f16_1-MLC" && progress && (
          <div className="mt-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1 overflow-hidden">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.progress * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{progress.text}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Phi-3 Mini 4K (Heavy Duty)
          </h4>
          {activeModel === "Phi-3-mini-4k-instruct-q4f16_1-MLC" ? (
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Loaded
            </span>
          ) : (
            <button
              onClick={() => handleLoadModel("Phi-3-mini-4k-instruct-q4f16_1-MLC")}
              disabled={loadingModel !== null}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              {loadingModel === "Phi-3-mini-4k-instruct-q4f16_1-MLC" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              {loadingModel === "Phi-3-mini-4k-instruct-q4f16_1-MLC" ? "Loading..." : "Load Model"}
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Best for complex clinical reasoning and documentation generation. Requires ~2.2GB of storage and VRAM.
        </p>
        {loadingModel === "Phi-3-mini-4k-instruct-q4f16_1-MLC" && progress && (
          <div className="mt-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1 overflow-hidden">
              <div className="bg-violet-600 dark:bg-violet-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.progress * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{progress.text}</p>
          </div>
        )}
      </div>

      {activeModel && (
        <button
          onClick={handleUnloadModel}
          className="w-full py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-2 mb-2"
        >
          <Trash2 className="w-4 h-4" />
          Unload Active Model (Free RAM)
        </button>
      )}

      {showClearConfirm ? (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-xs text-red-800 dark:text-red-200 font-medium mb-2">
            Are you sure? This will delete the downloaded AI model files (~2GB) from your device. You will need to re-download them next time.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearCache}
              className="flex-1 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Delete Files
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 py-1.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Model Files (Free Disk Space)
        </button>
      )}
    </div>
  );
}
