'use client';

import React from 'react';
import type { NutricionSocial } from '../../../types/vgi';
import { ScoreInput } from '../ScoreInput';

interface NutricionSocialTabProps {
  data: NutricionSocial;
  onChange: (path: string, value: unknown) => void;
}

export function NutricionSocialTab({ data, onChange }: NutricionSocialTabProps) {
  return (
    <div className="space-y-6">
      {/* MNA */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Mini Nutritional Assessment (MNA)
        </legend>
        <ScoreInput
          label="Puntuación"
          value={data.mna.score}
          onChange={(v) => onChange('mna.score', v)}
          min={0}
          max={30}
          step={0.5}
          helperText="24-30 Normal · 17-23.5 Riesgo de desnutrición · <17 Desnutrición"
          futureCalculator
        />
      </fieldset>

      {/* Peso */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Peso Corporal</legend>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={data.peso.kg ?? ''}
            onChange={(e) => onChange('peso.kg', e.target.value === '' ? null : Number(e.target.value))}
            min={0}
            step={0.1}
            className="w-32 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 [appearance:textfield]
                       [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="—"
          />
          <span className="text-xs text-gray-400">kg</span>
        </div>
        <p className="text-xs text-gray-400">
          Registrar pérdida de peso involuntaria &gt;5% en 6 meses o &gt;10% en 12 meses como dato de alarma.
        </p>
      </fieldset>

      {/* Dentición y Deglución */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
          <legend className="text-sm font-semibold text-gray-800 px-2">Dentición</legend>
          <textarea
            value={data.denticion.notas}
            onChange={(e) => onChange('denticion.notas', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 resize-none"
            placeholder="Estado dental, prótesis, edentulismo, dificultad para masticar..."
          />
        </fieldset>

        <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
          <legend className="text-sm font-semibold text-gray-800 px-2">Deglución</legend>
          <textarea
            value={data.deglucion.notas}
            onChange={(e) => onChange('deglucion.notas', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 resize-none"
            placeholder="Disfagia, riesgo de aspiración, modificación de texturas..."
          />
        </fieldset>
      </div>

      {/* Contexto Social */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-5">
        <legend className="text-sm font-semibold text-gray-800 px-2">Contexto Social</legend>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={data.vive_solo}
            onClick={() => onChange('vive_solo', !data.vive_solo)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2
              ${data.vive_solo ? 'bg-amber-500' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
                ${data.vive_solo ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          <span className={`text-sm font-medium ${data.vive_solo ? 'text-amber-600' : 'text-gray-500'}`}>
            {data.vive_solo ? 'Vive solo/a' : 'No vive solo/a'}
          </span>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1.5 block">Tipo de vivienda</label>
          <input
            type="text"
            value={data.vivienda}
            onChange={(e) => onChange('vivienda', e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500"
            placeholder="Ej: Casa propia, departamento, asilo, planta baja, escaleras..."
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1.5 block">Cuidador primario</label>
          <input
            type="text"
            value={data.cuidador_primario}
            onChange={(e) => onChange('cuidador_primario', e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500"
            placeholder="Nombre, parentesco, disponibilidad..."
          />
        </div>
      </fieldset>
    </div>
  );
}
