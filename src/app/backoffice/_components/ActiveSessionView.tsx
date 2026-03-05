'use client';

import { useState, useMemo } from 'react';

interface DryingSessionDTO {
  id: number;
  category: string;
  startedAt: string; // ISO 8601
}

interface Props {
  sessions: DryingSessionDTO[];
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function ActiveSessionView({ sessions }: Props) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const groups = useMemo(() => {
    if (sessions.length === 0) return [];

    // Sort by startedAt descending
    const sorted = [...sessions].sort((a, b) => {
      const timeA = new Date(a.startedAt).getTime();
      const timeB = new Date(b.startedAt).getTime();
      return timeB - timeA;
    });

    const groupMap: Map<number, DryingSessionDTO[]> = new Map();
    let groupIndex = 0;

    for (const session of sorted) {
      const sessionTime = new Date(session.startedAt).getTime();
      let found = false;

      // Find an existing group within 5 minutes
      for (const [idx, group] of groupMap.entries()) {
        const groupTime = new Date(group[0].startedAt).getTime();
        if (Math.abs(sessionTime - groupTime) <= FIVE_MINUTES_MS) {
          group.push(session);
          found = true;
          break;
        }
      }

      if (!found) {
        groupMap.set(groupIndex, [session]);
        groupIndex++;
      }
    }

    return Array.from(groupMap.values()).map((group, idx) => ({
      startTime: new Date(group[0].startedAt),
      sessions: group,
      _idx: idx,
    }));
  }, [sessions]);

  const toggleGroup = (idx: number) => {
    const next = new Set(expandedGroups);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setExpandedGroups(next);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-6">
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
        Sessões Ativas
      </h2>
      {groups.map((group, idx) => {
        const isExpanded = expandedGroups.has(idx);
        const categoryCount = group.sessions.length;

        return (
          <div key={idx} className="bg-white/5 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleGroup(idx)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-medium text-white">
                Iniciadas às {formatTime(group.startTime)}
              </span>
              <div className="flex items-center gap-2">
                {!isExpanded && (
                  <span className="text-xs text-white/60">
                    ({categoryCount})
                  </span>
                )}
                <span className="text-white/60">{isExpanded ? '▼' : '▶'}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 space-y-2 border-t border-white/10">
                {group.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="text-white/40">•</span>
                    <span>{session.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
