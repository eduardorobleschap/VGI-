'use client';

import React from 'react';
import type { MentalPsicoafectivo } from '../../../types/vgi';
import { ScoreInput } from '../ScoreInput';

interface MentalTabProps {
  data: MentalPsicoafectivo;
  onChange: (path: string, value: unknown) => void;
}

export function MentalTab({ data, onChange }: MentalTabProps) {
  return (
    <div className="space-y-6">
      {/* Pfeiffer */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Test de Pfeiffer — Cribaje Cognitivo
        </legend>
        <ScoreInput
          label="Número de errores"
          value={data.pfeiffer.errores}
          onChange={(v) => onChange('pfeiffer.errores', v)}
          min={0}
          max={10}
          helperText="0-2 Normal · 3-4 Leve · 5-7 Moderado · 8-10 Severo"
        />
      </fieldset>

      {/* Mini-Mental */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Mini-Mental State Examination (MMSE)
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.minimental.score}
          onChange={(v) => onChange('minimental.score', v)}
          min={0}
          max={30}
          helperText="27-30 Normal · 24-26 Leve · 18-23 Moderado · <18 Severo"
          futureCalculator
        />
      </fieldset>

      {/* MoCA */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Montreal Cognitive Assessment (MoCA)
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.moca.score}
          onChange={(v) => onChange('moca.score', v)}
          min={0}
          max={30}
          helperText=">=26 Normal · <26 Deterioro cognitivo (ajustar +1 si escolaridad <=12 años)"
          futureCalculator
        />
      </fieldset>

      {/* GDS */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Escala de Depresión Geriátrica (GDS-15)
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.gds.score}
          onChange={(v) => onChange('gds.score', v)}
          min={0}
          max={15}
          helperText="0-5 Normal · 6-9 Depresión leve · 10-15 Depresión establecida"
        />
      </fieldset>

      {/* Hamilton */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Escala de Hamilton — Ansiedad / Depresión
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.hamilton.score}
          onChange={(v) => onChange('hamilton.score', v)}
          min={0}
          max={52}
          helperText="0-7 Normal · 8-13 Leve · 14-18 Moderada · 19-22 Severa · >=23 Muy severa"
        />
      </fieldset>

      {/* CAM */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Confusion Assessment Method (CAM) — Delirium
        </legend>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={data.cam.delirium}
            onClick={() => onChange('cam.delirium', !data.cam.delirium)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2
              ${data.cam.delirium ? 'bg-red-500' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
                ${data.cam.delirium ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          <span className={`text-sm font-medium ${data.cam.delirium ? 'text-red-600' : 'text-gray-500'}`}>
            {data.cam.delirium ? 'Delirium POSITIVO' : 'Delirium negativo'}
          </span>
        </div>

        {data.cam.delirium && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-red-700">
              CAM positivo — Considerar evaluación urgente y manejo del delirium.
              Identificar y tratar causas reversibles.
            </p>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Notas clínicas</label>
          <textarea
            value={data.cam.notes}
            onChange={(e) => onChange('cam.notes', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                       text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-violet-500/30 focus:border-violet-500 resize-none"
            placeholder="Criterios CAM evaluados, hallazgos, factores precipitantes..."
          />
        </div>
      </fieldset>
    </div>
  );
}
