'use client';

import React from 'react';
import type { Funcional } from '../../../types/vgi';
import { ScoreInput } from '../ScoreInput';

interface FuncionalTabProps {
  data: Funcional;
  onChange: (path: string, value: unknown) => void;
}

export function FuncionalTab({ data, onChange }: FuncionalTabProps) {
  return (
    <div className="space-y-6">
      {/* Katz */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Índice de Katz — Actividades Básicas de la Vida Diaria
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.katz.score}
          onChange={(v) => onChange('katz.score', v)}
          min={0}
          max={6}
          helperText="0 = Dependencia total · 6 = Independencia completa en las 6 funciones"
          futureCalculator
        />
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Notas clínicas</label>
          <textarea
            value={data.katz.notes}
            onChange={(e) => onChange('katz.notes', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                       text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-violet-500/30 focus:border-violet-500 resize-none"
            placeholder="Observaciones sobre funcionalidad básica..."
          />
        </div>
      </fieldset>

      {/* Barthel */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Índice de Barthel — ABVD
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.barthel.score}
          onChange={(v) => onChange('barthel.score', v)}
          min={0}
          max={data.barthel.max}
          helperText="0-20 Total · 21-60 Severa · 61-90 Moderada · 91-99 Leve · 100 Independiente"
          futureCalculator
        />
      </fieldset>

      {/* Lawton */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Escala de Lawton & Brody — AIVD
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.lawton.score}
          onChange={(v) => onChange('lawton.score', v)}
          min={0}
          max={data.lawton.max}
          helperText="0 = Máxima dependencia · 8 = Independencia instrumental total"
          futureCalculator
        />
      </fieldset>

      {/* SARC-F */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          SARC-F — Cribaje de Sarcopenia
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.sarc_f.score}
          onChange={(v) => onChange('sarc_f.score', v)}
          min={0}
          max={10}
          helperText="4 puntos = Riesgo de sarcopenia — considerar evaluación completa"
        />
      </fieldset>

      {/* FRAIL */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Escala FRAIL — Fragilidad
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.frail.score}
          onChange={(v) => onChange('frail.score', v)}
          min={0}
          max={5}
          helperText="0 = Robusto · 1-2 = Pre-frágil · 3-5 = Frágil"
        />
      </fieldset>

      {/* Fuerza de Prensión */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Fuerza de Prensión — Dinamometría
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1.5 block">Mano Derecha</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.fuerza_prension.der ?? ''}
                onChange={(e) =>
                  onChange('fuerza_prension.der', e.target.value === '' ? null : Number(e.target.value))
                }
                min={0}
                step={0.1}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                           text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-violet-500/30 focus:border-violet-500
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="—"
              />
              <span className="text-xs text-gray-400">kg</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1.5 block">Mano Izquierda</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.fuerza_prension.izq ?? ''}
                onChange={(e) =>
                  onChange('fuerza_prension.izq', e.target.value === '' ? null : Number(e.target.value))
                }
                min={0}
                step={0.1}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                           text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-violet-500/30 focus:border-violet-500
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="—"
              />
              <span className="text-xs text-gray-400">kg</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Valores de referencia varían por sexo y edad. Considerar punto de corte
          &lt;27kg (hombres) / &lt;16kg (mujeres).
        </p>
      </fieldset>
    </div>
  );
}
