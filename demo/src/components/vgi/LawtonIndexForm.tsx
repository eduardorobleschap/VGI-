import React, { useState } from 'react';
import type { Funcional } from '../../types/vgi';
import { calculateLawtonScore, getLawtonCategory } from '../../lib/geriatric-profile';

interface LawtonIndexFormProps {
  data: Funcional['lawton'];
  onChange: (field: string, value: unknown) => void;
}

const LAWTON_QUESTIONS = [
  {
    key: 'telefono',
    label: 'Uso del teléfono',
    desc: 'Marcar números o contestar.',
  },
  {
    key: 'compras',
    label: 'Compras',
    desc: 'Ir a comprar comida u otras cosas.',
  },
  {
    key: 'comida',
    label: 'Preparar la comida',
    desc: 'Cocinar y servir los alimentos.',
  },
  {
    key: 'casa',
    label: 'Cuidado de la casa',
    desc: 'Limpiar y ordenar el hogar.',
  },
  {
    key: 'ropa',
    label: 'Lavar la ropa',
    desc: 'Hacer la colada.',
  },
  {
    key: 'transporte',
    label: 'Medios de transporte',
    desc: 'Usar el autobús o taxis.',
  },
  {
    key: 'medicacion',
    label: 'Medicación',
    desc: 'Tomar las pastillas a su hora.',
  },
  {
    key: 'dinero',
    label: 'Manejo del dinero',
    desc: 'Pagar cuentas y administrar efectivo.',
  }
];

export function LawtonIndexForm({ data, onChange }: LawtonIndexFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const score = calculateLawtonScore(data);
  const category = score !== null ? getLawtonCategory(score) : null;

  const getBadgeStyle = () => {
    if (!category) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (category.severity === null) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (category.severity === 'medium') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (category.severity === 'high') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200'; // critical
  };

  const getScoreText = () => {
    if (score === null) return 'Faltan respuestas';
    return `${score} pts - ${category?.label}`;
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
            Índice de Lawton y Brody — AIVD
          </h3>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
          Resultado Lawton: {getScoreText()}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {LAWTON_QUESTIONS.map((q, index) => {
            const value = data[q.key as keyof typeof data] as number | null;
            
            return (
              <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-900 mb-0.5">{index + 1}. {q.label}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">{q.desc}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 min-w-[240px]">
                  {/* Independiente = 1 */}
                  <label
                    className={`flex justify-center items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      value === 1 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`lawton-${q.key}`}
                      checked={value === 1}
                      onChange={() => onChange(q.key, 1)}
                      className={value === 1 ? 'text-emerald-600 focus:ring-emerald-500 mt-0.5' : 'mt-0.5'}
                    />
                    <span className="text-[13px] font-semibold leading-none">Independiente (1)</span>
                  </label>

                  {/* Necesita Ayuda = 0 */}
                  <label
                    className={`flex justify-center items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      value === 0 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`lawton-${q.key}`}
                      checked={value === 0}
                      onChange={() => onChange(q.key, 0)}
                      className={value === 0 ? 'text-red-600 focus:ring-red-500 mt-0.5' : 'mt-0.5'}
                    />
                    <span className="text-[13px] font-semibold leading-none">Necesita ayuda (0)</span>
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
              placeholder="Observaciones adicionales sobre Lawton..."
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
