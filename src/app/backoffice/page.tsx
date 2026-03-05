'use client';

import { useState } from 'react';
import { CategoryChecklist } from './_components/CategoryChecklist';
import { StartSessionButton } from './_components/StartSessionButton';
import { ActiveSessionView } from './_components/ActiveSessionView';
import {
  useDryingSessions,
  DryingSessionDTO,
} from './_lib/use-drying-sessions';

export default function BackofficePage() {
  const { sessions, save, isHydrated } = useDryingSessions();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) {
      next.add(category);
    } else {
      next.delete(category);
    }
    setSelected(next);
    setError(null);
  };

  const handleStartSession = async () => {
    if (selected.size === 0) {
      setError('Selecione pelo menos uma categoria');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: Array.from(selected) }),
      });

      const data = (await response.json()) as {
        created: Array<{ id: number; category: string; startedAt: string }>;
        conflicting: string[];
      };

      if (!response.ok) {
        setError(
          data.conflicting?.length > 0
            ? `${data.conflicting.length} categoria(s) já em secagem`
            : 'Erro ao iniciar sessão',
        );
        setLoading(false);
        return;
      }

      // Add created sessions to localStorage
      const newSessions: DryingSessionDTO[] = [
        ...sessions,
        ...data.created.map((s) => ({
          id: s.id,
          category: s.category,
          startedAt: s.startedAt,
        })),
      ];
      save(newSessions);

      // Reset form
      setSelected(new Set());
      setError(null);
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return null; // Avoid SSR hydration mismatch
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Sessão de Secagem
        </h1>
        <p className="text-white/60 text-sm mb-6">
          Selecione as categorias de roupa que está secando
        </p>

        <CategoryChecklist
          selected={selected}
          onChange={handleCategoryChange}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6">
          <StartSessionButton
            selectedCount={selected.size}
            loading={loading}
            onSubmit={handleStartSession}
          />
        </div>

        <ActiveSessionView sessions={sessions} />
      </div>
    </main>
  );
}
