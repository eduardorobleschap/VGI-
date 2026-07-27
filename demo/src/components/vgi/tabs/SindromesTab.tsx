'use client';

import React from 'react';
import type { Sindromes } from '../../../types/vgi';

const AUXILIAR_OPTIONS = [
  { value: '', label: 'Sin auxiliar' },
  { value: 'baston', label: 'Bastón' },
  { value: 'andadera', label: 'Andadera' },
  { value: 'silla_ruedas', label: 'Silla de ruedas' },
  { value: 'muletas', label: 'Muletas' },
  { value: 'otro', label: 'Otro' },
];

interface SindromesTabProps {
  data: Sindromes;
  onChange: (path: string, value: unknown) => void;
}

export function SindromesTab({ data, onChange }: SindromesTabProps) {
  return (
    <div className="space-y-6">
      {/* Caídas */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Evaluación de Caídas</legend>
        <div>
          <label className="text-sm text-gray-500 mb-1.5 block">Número de caídas en los últimos 12 meses</label>
          <input
            type="number"
            value={data.caidas.cantidad_12_meses ?? ''}
            onChange={(e) => onChange('caidas.cantidad_12_meses', e.target.value === '' ? null : Number(e.target.value))}
            min={0}
            className="w-32 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 [appearance:textfield]
                       [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="—"
          />
          {data.caidas.cantidad_12_meses !== null && data.caidas.cantidad_12_meses >= 2 && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Patrón de caídas recurrentes — evaluar factores de riesgo
            </p>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Historial / Circunstancias de caídas</label>
          <textarea
            value={data.caidas.historial}
            onChange={(e) => onChange('caidas.historial', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 resize-none"
            placeholder="Descripción de caídas, lugar, hora, lesiones, medicamentos asociados..."
          />
        </div>
      </fieldset>

      {/* Marcha / TUG */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Marcha y Equilibrio</legend>
        <div>
          <label className="text-sm text-gray-500 mb-1.5 block">Auxiliar de marcha</label>
          <select
            value={data.marcha.auxiliar}
            onChange={(e) => onChange('marcha.auxiliar', e.target.value)}
            className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {AUXILIAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1.5 block">Timed Up & Go (TUG)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={data.marcha.tug_segundos ?? ''}
              onChange={(e) => onChange('marcha.tug_segundos', e.target.value === '' ? null : Number(e.target.value))}
              min={0}
              step={0.1}
              className="w-32 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                         focus:border-violet-500 [appearance:textfield]
                         [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="—"
            />
            <span className="text-xs text-gray-400">segundos</span>
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            &lt;=12s Normal · 12-20s Riesgo moderado · &gt;20s Alto riesgo de caídas
          </p>
        </div>
      </fieldset>

      {/* Sueño */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Trastornos del Sueño</legend>
        <textarea
          value={data.sueno.notas}
          onChange={(e) => onChange('sueno.notas', e.target.value)}
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 resize-none"
          placeholder="Calidad del sueño, insomnio, apnea, uso de hipnóticos, higiene del sueño..."
        />
      </fieldset>

      {/* Estreñimiento */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Estreñimiento</legend>
        <textarea
          value={data.estrenimiento.notas}
          onChange={(e) => onChange('estrenimiento.notas', e.target.value)}
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 resize-none"
          placeholder="Frecuencia de evacuaciones, uso de laxantes, dieta, hidratación..."
        />
      </fieldset>

      {/* Déficits sensoriales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
          <legend className="text-sm font-semibold text-gray-800 px-2">Déficit Visual</legend>
          <textarea
            value={data.deficit_visual.notas}
            onChange={(e) => onChange('deficit_visual.notas', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 resize-none"
            placeholder="Agudeza visual, uso de lentes, cataratas, glaucoma..."
          />
        </fieldset>

        <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
          <legend className="text-sm font-semibold text-gray-800 px-2">Déficit Auditivo</legend>
          <textarea
            value={data.deficit_auditivo.notas}
            onChange={(e) => onChange('deficit_auditivo.notas', e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                       focus:border-violet-500 resize-none"
            placeholder="Hipoacusia, uso de auxiliar auditivo, prueba de susurro..."
          />
        </fieldset>
      </div>
    </div>
  );
}
