import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logger } from '../utils/logger';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      logger.info('SW Registered: ' + r);
    },
    onRegisterError(error) {
      logger.error('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">
                {offlineReady ? 'App ready to work offline' : 'New content available'}
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                {offlineReady
                  ? 'You can now use this app without an internet connection.'
                  : 'Click reload to update to the latest version.'}
              </p>
              <div className="flex gap-2">
                {needRefresh && (
                  <button
                    onClick={() => updateServiceWorker(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Reload
                  </button>
                )}
                <button
                  onClick={close}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <button onClick={close} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
