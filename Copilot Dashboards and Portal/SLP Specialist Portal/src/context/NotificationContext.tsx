import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary';
}

interface PromptOptions {
  title: string;
  message: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);
  const [promptState, setPromptState] = useState<{
    options: PromptOptions;
    resolve: (value: string | null) => void;
    value: string;
  } | null>(null);

  const notify = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setPromptState({ options, resolve, value: options.initialValue || '' });
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, confirm, prompt }}>
      {children}
      
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border min-w-[300px] max-w-md",
                n.type === 'success' && "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300",
                n.type === 'error' && "bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300",
                n.type === 'warning' && "bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
                n.type === 'info' && "bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300"
              )}
            >
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {n.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
              {n.type === 'warning' && <HelpCircle className="w-5 h-5 shrink-0" />}
              {n.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-bold leading-tight">{n.message}</p>
              <button 
                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 opacity-50" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmState && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                confirmState.resolve(false);
                setConfirmState(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
                  confirmState.options.type === 'danger' ? "bg-red-100 dark:bg-red-900/20" : "bg-indigo-100 dark:bg-indigo-900/20"
                )}>
                  {confirmState.options.type === 'danger' ? (
                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">{confirmState.options.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  {confirmState.options.message}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      confirmState.resolve(false);
                      setConfirmState(null);
                    }}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    {confirmState.options.cancelText || 'Cancel'}
                  </button>
                  <button 
                    onClick={() => {
                      confirmState.resolve(true);
                      setConfirmState(null);
                    }}
                    className={cn(
                      "flex-1 py-4 text-white rounded-2xl font-bold transition-all shadow-lg",
                      confirmState.options.type === 'danger' 
                        ? "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-red-900/20" 
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/20"
                    )}
                  >
                    {confirmState.options.confirmText || 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prompt Modal */}
      <AnimatePresence>
        {promptState && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                promptState.resolve(null);
                setPromptState(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{promptState.options.title}</h3>
                <button 
                  onClick={() => {
                    promptState.resolve(null);
                    setPromptState(null);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {promptState.options.message}
              </p>

              <input 
                autoFocus
                type="text"
                value={promptState.value}
                onChange={(e) => setPromptState({ ...promptState, value: e.target.value })}
                placeholder={promptState.options.placeholder}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all mb-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    promptState.resolve(promptState.value);
                    setPromptState(null);
                  }
                }}
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    promptState.resolve(null);
                    setPromptState(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  {promptState.options.cancelText || 'Cancel'}
                </button>
                <button 
                  onClick={() => {
                    promptState.resolve(promptState.value);
                    setPromptState(null);
                  }}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
                >
                  {promptState.options.confirmText || 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
