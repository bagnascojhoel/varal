'use client';

import { useEffect, useState } from 'react';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LiveClock() {
  const [time, setTime] = useState<string>(() => formatTime(new Date()));
  const [isoTime, setIsoTime] = useState<string>(() =>
    new Date().toISOString(),
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(formatTime(now));
      setIsoTime(now.toISOString());
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="header-time" dateTime={isoTime} suppressHydrationWarning>
      {time}
    </time>
  );
}
