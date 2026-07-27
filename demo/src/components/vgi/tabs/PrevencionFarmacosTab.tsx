'use client';

import React from 'react';
import type { PrevencionFarmacos } from '../../../types/vgi';

interface PrevencionFarmacosTabProps {
  data: PrevencionFarmacos;
  onChange: (path: string, value: unknown) => void;
}

export function PrevencionFarmacosTab({ data, onChange }: PrevencionFarmacosTabProps) {
  return (
    <div className="space-y-6">
      {/* Vacunas */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Esquema de Vacunación</legend>
        <textarea
          value={data.vacunas}
          onChange={(e) => onChange('vacunas', e.target.value)}
          rows={4}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 resize-none"
          placeholder="Influenza, neumococo (PCV13/PPSV23), herpes zóster, COVID-19, tétanos/difteria..."
        />
        <p className="text-xs text-gray-400">
          Registrar esquema completo, fechas de última aplicación y vacunas pendientes.
        </p>
      </fieldset>

      {/* Densitometría */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">Densitometría Ósea</legend>
        <textarea
          value={data.densitometria}
          onChange={(e) => onChange('densitometria', e.target.value)}
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 resize-none"
          placeholder="Última densitometría, T-score columna/cadera, diagnóstico (normal/osteopenia/osteoporosis), FRAX..."
        />
        <p className="text-xs text-gray-400">
          Mujeres &gt;=65 años y hombres &gt;=70 años — tamizaje rutinario recomendado.
        </p>
      </fieldset>

      {/* Medicamentos Actuales */}
      <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
        <legend className="text-sm font-semibold text-gray-800 px-2">
          Medicamentos Actuales — Revisión Farmacológica
        </legend>
        <textarea
          value={data.medicamentos_actuales}
          onChange={(e) => onChange('medicamentos_actuales', e.target.value)}
          rows={6}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30
                     focus:border-violet-500 resize-none"
          placeholder={`Listar medicamentos con dosis y frecuencia:\n- Medicamento 1: dosis, frecuencia\n- Medicamento 2: dosis, frecuencia\n\nNotar: polifarmacia, interacciones, criterios STOPP/START, medicamentos potencialmente inapropiados (Beers)...`}
        />

        <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50 border border-violet-200">
          <svg className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-violet-700 space-y-1">
            <p className="font-medium">Revisión farmacológica sugerida:</p>
            <ul className="list-disc list-inside text-violet-600 space-y-0.5">
              <li>Polifarmacia: 5 o más medicamentos = riesgo incrementado</li>
              <li>Criterios STOPP/START para prescripción inapropiada</li>
              <li>Criterios de Beers para medicamentos a evitar</li>
              <li>Cascada de prescripción y desprescripción</li>
            </ul>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
