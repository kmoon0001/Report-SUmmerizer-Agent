import { useState, useEffect } from 'react';
import { localAIService } from '../services/local-ai-service';

export interface SystemStatus {
  isOnline: boolean;
  localModelLoaded: boolean;
  storageUsage: number | null; // in MB
  storageQuota: number | null; // in MB
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    isOnline: navigator.onLine,
    localModelLoaded: !!localAIService.getLoadedModel(),
    storageUsage: null,
    storageQuota: null,
  });

  useEffect(() => {
    const updateStatus = async () => {
      // Check online status
      const isOnline = navigator.onLine;

      // Check local model
      const localModelLoaded = !!localAIService.getLoadedModel();

      // Check storage
      let storageUsage = null;
      let storageQuota = null;
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          if (estimate.usage) {
            storageUsage = Math.round(estimate.usage / (1024 * 1024)); // Convert to MB
          }
          if (estimate.quota) {
            storageQuota = Math.round(estimate.quota / (1024 * 1024)); // Convert to MB
          }
        } catch (e) {
          console.error("Failed to estimate storage", e);
        }
      }

      setStatus({
        isOnline,
        localModelLoaded,
        storageUsage,
        storageQuota,
      });
    };

    // Initial check
    updateStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Poll for local model changes (since we don't have an event emitter for it yet)
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return status;
}
