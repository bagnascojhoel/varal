'use client';

import { useState } from 'react';

export function useStorage<T>(key: string): [T | null, (value: T) => void] {
  const [value, setValue] = useState<T | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  });

  function set(newValue: T): void {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }

  return [value, set];
}
