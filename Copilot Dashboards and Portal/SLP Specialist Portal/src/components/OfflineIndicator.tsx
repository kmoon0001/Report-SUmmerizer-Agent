import React from 'react';
import { useOnlineStatus } from '../context/OnlineStatusContext';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-pulse">
      <WifiOff size={16} />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
};
