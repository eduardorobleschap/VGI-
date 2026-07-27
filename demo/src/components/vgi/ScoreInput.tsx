'use client';

import React from 'react';

interface ScoreInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helperText?: string;
  futureCalculator?: boolean;
}

export function ScoreInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  helperText,
  futureCalculator = false,
}: ScoreInputProps) {
  const range = max - min;
  const percentage =
    value !== null && range > 0 ? ((value - min) / range) * 100 : 0;

  const getBarColor = () => {
    if (percentage <= 30) return 'bg-red-500';
    if (percentage <= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </label>
        {futureCalculator && (
          <span className="text-[10px] uppercase tracking-wider text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
            Calculadora pronto
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '') {
              onChange(null);
            } else {
              const num = Number(v);
              onChange(Math.min(max, Math.max(min, num)));
            }
          }}
          min={min}
          max={max}
          step={step}
          className="w-24 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 transition-all
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                     [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="—"
        />

        {unit && (
          <span className="text-xs text-gray-400 min-w-[2ch]">{unit}</span>
        )}

        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              value !== null ? getBarColor() : 'bg-transparent'
            }`}
            style={{ width: `${value !== null ? Math.max(percentage, 2) : 0}%` }}
          />
        </div>

        {value !== null && (
          <span className="text-xs text-gray-500 font-mono min-w-[5ch] text-right">
            {value}/{max}
          </span>
        )}
      </div>

      {helperText && (
        <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}
