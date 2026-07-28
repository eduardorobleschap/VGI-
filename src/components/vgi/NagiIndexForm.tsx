import React, { useState } from 'react';
import type { Funcional } from '../../types/vgi';
import { calculateNagiScore, getNagiCategory } from '../../lib/geriatric-profile';

interface NagiIndexFormProps {
  data: Funcional['nagi'];
  onChange: (field: string, value: unknown) => void;
}

const NAGI_QUESTIONS = [
  {
    key: 'empujar',
    label: '1. Empujar o tirar de objetos grandes',
    desc: 'Por ejemplo, empujar un sillón de la sala o mover muebles pesados.',
    options: [
      { value: 0, label: 'Sin dificultad' },
      { value: 1, label: 'Poca dificultad' },
      { value: 2, label: 'Mucha dificultad' },
      { value: 3, label: 'Incapaz' }
    ]
  },
  {
    key: 'agacharse',
    label: '2. Agacharse, arrodillarse o cuclillas',
    desc: 'Doblarse para recoger algo del suelo.',
    options: [
      { value: 0, label: 'Sin dificultad' },
      { value: 1, label: 'Poca dificultad' },
      { value: 2, label: 'Mucha dificultad' },
      { value: 3, label: 'Incapaz' }
    ]
  },
  {
    key: 'levantar_brazos',
    label: '3. Levantar los brazos',
    desc: 'Alcanzar o extender los brazos por encima del nivel de los hombros.',
    options: [
      { value: 0, label: 'Sin dificultad' },
      { value: 1, label: 'Poca dificultad' },
      { value: 2, label: 'Mucha dificultad' },
      { value: 3, label: 'Incapaz' }
    ]
  },
  {
    key: 'escribir',
    label: '4. Escribir o manipular objetos pequeños',
    desc: 'Por ejemplo, abotonarse la camisa, usar una llave o escribir.',
    options: [
      { value: 0, label: 'Sin dificultad' },
      { value: 1, label: 'Poca dificultad' },
      { value: 2, label: 'Mucha dificultad' },
      { value: 3, label: 'Incapaz' }
    ]
  },
  {
    key: 'cargar_peso',
    label: '5. Levantar o cargar pesos de 5 kg',
    desc: 'Cargar bolsas de compras pesadas o unos 5 kilogramos (10 lbs).',
    options: [
      { value: 0, label: 'Sin dificultad' },
      { value: 1, label: 'Poca dificultad' },
      { value: 2, label: 'Mucha dificultad' },
      { value: 3, label: 'Incapaz' }
    ]
  }
];

export function NagiIndexForm({ data, onChange }: NagiIndexFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const score = calculateNagiScore(data);
  const category = score !== null ? getNagiCategory(score) : null;

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
            Escala de Nagi — Discapacidad Física
          </h3>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
          Resultado Nagi: {getScoreText()}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {NAGI_QUESTIONS.map((q) => {
            const value = data[q.key as keyof typeof data] as number | null;
            
            return (
              <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-[13px] font-medium text-gray-900 mb-0.5">{q.label}</p>
                <p className="text-[11px] text-gray-500 mb-2">{q.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {q.options.map(opt => {
                    const isHealthy = opt.value === 0;
                    const isCritical = opt.value === 3;
                    const isWarning = opt.value === 2;
                    
                    let activeClass = 'bg-blue-50 border-blue-500 text-blue-700'; // value 1
                    if (isHealthy) activeClass = 'bg-emerald-50 border-emerald-500 text-emerald-700';
                    if (isWarning) activeClass = 'bg-amber-50 border-amber-500 text-amber-700';
                    if (isCritical) activeClass = 'bg-red-50 border-red-500 text-red-700';

                    const checked = value === opt.value;

                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                          checked ? activeClass : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`nagi-${q.key}`}
                          checked={checked}
                          onChange={() => onChange(q.key, opt.value)}
                          className={`mt-0.5 ${
                            checked
                              ? (isHealthy ? 'text-emerald-600 focus:ring-emerald-500' 
                                 : (isCritical ? 'text-red-600 focus:ring-red-500' 
                                 : (isWarning ? 'text-amber-600 focus:ring-amber-500' : 'text-blue-600 focus:ring-blue-500')))
                              : ''
                          }`}
                        />
                        <span className="text-[13px] font-semibold leading-none">{opt.label}</span>
                      </label>
                    );
                  })}
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
              placeholder="Observaciones adicionales sobre Nagi..."
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
