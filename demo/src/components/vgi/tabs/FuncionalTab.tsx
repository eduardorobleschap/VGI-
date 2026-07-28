'use client';

import React from 'react';
import type { Funcional } from '../../../types/vgi';
import { ScoreInput } from '../ScoreInput';
import { KatzIndexForm } from '../KatzIndexForm';
import { BarthelIndexForm } from '../BarthelIndexForm';
import { LawtonIndexForm } from '../LawtonIndexForm';
import { RosowIndexForm } from '../RosowIndexForm';
import { NagiIndexForm } from '../NagiIndexForm';

interface FuncionalTabProps {
  data: Funcional;
  onChange: (path: string, value: unknown) => void;
}

export function FuncionalTab({ data, onChange }: FuncionalTabProps) {
  return (
    <div className="space-y-6">
      {/* Katz */}
      <KatzIndexForm
        data={data.katz}
        onChange={(field, value) => onChange(`katz.${field}`, value)}
      />

      {/* Barthel */}
      <BarthelIndexForm
        data={data.barthel}
        onChange={(field, value) => onChange(`barthel.${field}`, value)}
      />

      {/* Lawton */}
      <LawtonIndexForm
        data={data.lawton}
        onChange={(field, value) => onChange(`lawton.${field}`, value)}
      />

      {/* Rosow-Breslau */}
      <RosowIndexForm
        data={data.rosow}
        onChange={(field, value) => onChange(`rosow.${field}`, value)}
      />

      {/* Nagi */}
      <NagiIndexForm
        data={data.nagi}
        onChange={(field, value) => onChange(`nagi.${field}`, value)}
      />

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
