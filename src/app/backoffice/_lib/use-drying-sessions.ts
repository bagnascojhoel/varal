'use client';

import { useEffect, useState } from 'react';

export interface DryingSessionDTO {
  id: number;
  category: string;
  startedAt: string; // ISO 8601
}

const STORAGE_KEY = 'varal:drying-sessions';

export function useDryingSessions() {
  const [sessions, setSessions] = useState<DryingSessionDTO[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount (client-only)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch {
        setSessions([]);
      }
    }
    setIsHydrated(true);
  }, []);

  const save = (newSessions: DryingSessionDTO[]) => {
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
  };

  const load = (): DryingSessionDTO[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  const clear = () => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { sessions, save, load, clear, isHydrated };
}
