// src/hooks/useHeartbeat.ts
import { useState, useEffect } from 'react';

interface UseHeartbeatReturn {
  showHeartbeat: boolean;
  setShowHeartbeat: (show: boolean) => void;
}

export const useHeartbeat = (): UseHeartbeatReturn => {
  const [showHeartbeat, setShowHeartbeat] = useState<boolean>(true);

  useEffect(() => {
    // Toggle heartbeat animation every 3 seconds
    const interval = setInterval(() => {
      setShowHeartbeat(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    showHeartbeat,
    setShowHeartbeat
  };
};