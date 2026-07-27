'use client';

import React from 'react';
import type { GeriatricAlert, AlertSeverity } from '../../types/vgi';

interface AlertBadgesProps {
  alerts: GeriatricAlert[];
}

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  { bg: string; text: string; ring: string; dot: string }
> = {
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-200',
    dot: 'bg-red-500',
  },
  high: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
  },
  medium: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    ring: 'ring-yellow-200',
    dot: 'bg-yellow-500',
  },
  low: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200',
    dot: 'bg-sky-500',
  },
};

const SEVERITY_ORDER: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];

export function AlertBadges({ alerts }: AlertBadgesProps) {
  if (alerts.length === 0) return null;

  const sorted = [...alerts].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
  );

  return (
    <div className="flex flex-wrap gap-2" role="status" aria-label="Alertas geriátricas">
      {sorted.map((alert, idx) => {
        const config = SEVERITY_CONFIG[alert.severity];
        return (
          <div
            key={alert.id}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
              ring-1 cursor-default
              ${config.bg} ${config.text} ${config.ring}
              animate-in fade-in slide-in-from-bottom-1 duration-300
            `}
            style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
            title={alert.description}
            role="alert"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${
                alert.severity === 'critical' ? 'animate-pulse' : ''
              }`}
            />
            {alert.label}
          </div>
        );
      })}
    </div>
  );
}
