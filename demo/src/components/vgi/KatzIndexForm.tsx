import React, { useState } from 'react';
import type { Funcional } from '../../types/vgi';
import { calculateKatzGrade } from '../../lib/geriatric-profile';

interface KatzIndexFormProps {
  data: Funcional['katz'];
  onChange: (field: string, value: unknown) => void;
}

const KATZ_QUESTIONS = [
  {
    key: 'bano',
    label: 'Baño',
    independiente: 'Se lava solo/a o solo necesita ayuda para lavar una sola parte del cuerpo (como la espalda).',
    dependiente: 'Necesita ayuda para lavarse más de una parte del cuerpo o no puede hacerlo por sí mismo/a.',
  },
  {
    key: 'vestido',
    label: 'Vestido',
    independiente: 'Puede elegir la ropa y vestirse completamente sin asistencia.',
    dependiente: 'Necesita ayuda para vestirse, abrocharse o no puede hacerlo por sí mismo/a.',
  },
  {
    key: 'uso_bano',
    label: 'Uso del baño',
    independiente: 'Entra y sale del baño, se sienta, se levanta y se limpia sin ayuda.',
    dependiente: 'Necesita asistencia para ir al baño, limpiarse o usar el retrete.',
  },
  {
    key: 'movilidad',
    label: 'Movilidad',
    independiente: 'Se traslada de la cama a la silla y viceversa de forma segura sin ayuda.',
    dependiente: 'Necesita ayuda humana o mecánica para los traslados o no puede salir de la cama.',
  },
  {
    key: 'continencia',
    label: 'Continencia',
    independiente: 'Controla de manera autónoma y completa la orina y las heces.',
    dependiente: 'Tiene episodios de incontinencia parcial o total (orina o heces) o usa sonda.',
  },
  {
    key: 'alimentacion',
    label: 'Alimentación',
    independiente: 'Es capaz de comer por sí mismo/a sin apoyo (la comida puede estar servida).',
    dependiente: 'Necesita ayuda para llevar la comida a la boca o requiere alimentación enteral/parenteral.',
  },
] as const;

export function KatzIndexForm({ data, onChange }: KatzIndexFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const grade = calculateKatzGrade(data);

  // Badge configs
  const getBadgeStyle = () => {
    if (grade === null) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (grade === 'A' || grade === 'B') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade === 'C' || grade === 'D') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200'; // E, F, G
  };

  const getGradeText = () => {
    if (grade === null) return 'Faltan respuestas';
    if (grade === 'A') return 'A - Independencia total';
    if (grade === 'B') return 'B - Independencia (1 dependencia)';
    if (grade === 'C') return 'C - Dependencia leve (2)';
    if (grade === 'D') return 'D - Dependencia moderada (3)';
    if (grade === 'E') return 'E - Dependencia moderada (4)';
    if (grade === 'F') return 'F - Dependencia severa (5)';
    if (grade === 'G') return 'G - Dependencia total (6)';
    return grade;
  };

  return (
    <fieldset className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-0">
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800">
            Índice de Katz — Actividades Básicas de la Vida Diaria
          </h3>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
          Resultado Katz: {getGradeText()}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {KATZ_QUESTIONS.map((q) => {
            const value = data[q.key as keyof typeof data] as boolean | null;
            
            return (
              <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 mb-2">{q.label}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      value === true
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`katz-${q.key}`}
                      checked={value === true}
                      onChange={() => onChange(q.key, true)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-[13px] font-semibold text-gray-900 leading-none">Independiente</span>
                      <span className="block text-[11px] text-gray-500 mt-1 leading-tight">{q.independiente}</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      value === false
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`katz-${q.key}`}
                      checked={value === false}
                      onChange={() => onChange(q.key, false)}
                      className="mt-0.5 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="block text-[13px] font-semibold text-gray-900 leading-none">Dependiente</span>
                      <span className="block text-[11px] text-gray-500 mt-1 leading-tight">{q.dependiente}</span>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}

          <div className="pt-1">
            <label className="text-[13px] font-medium text-gray-700 mb-1 block px-1">Notas clínicas</label>
            <textarea
              value={data.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              rows={2}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
                         text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-violet-500/30 focus:border-violet-500 resize-none"
              placeholder="Observaciones sobre funcionalidad básica..."
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
