import React, { useState } from 'react';
import type { Funcional } from '../../types/vgi';
import { calculateBarthelScore, getBarthelCategory } from '../../lib/geriatric-profile';

interface BarthelIndexFormProps {
  data: Funcional['barthel'];
  onChange: (field: string, value: unknown) => void;
}

const BARTHEL_QUESTIONS = [
  {
    key: 'comer',
    label: 'Comer',
    options: [
      { value: 10, label: 'Independiente', desc: 'Capaz de usar cualquier instrumento necesario, come en un tiempo razonable.' },
      { value: 5, label: 'Necesita ayuda', desc: 'Para cortar la carne, el pan, etc. pero come solo.' },
      { value: 0, label: 'Dependiente', desc: 'Necesita ser alimentado por otra persona.' }
    ]
  },
  {
    key: 'lavarse',
    label: 'Lavarse o bañarse',
    options: [
      { value: 5, label: 'Independiente', desc: 'Capaz de lavarse entero, puede entrar y salir del baño sin ayuda.' },
      { value: 0, label: 'Dependiente', desc: 'Necesita algún tipo de ayuda o supervisión.' }
    ]
  },
  {
    key: 'vestirse',
    label: 'Vestirse',
    options: [
      { value: 10, label: 'Independiente', desc: 'Capaz de ponerse y quitarse la ropa, atarse los zapatos, abrocharse.' },
      { value: 5, label: 'Necesita ayuda', desc: 'Pero hace la mitad de la tarea él solo en un tiempo razonable.' },
      { value: 0, label: 'Dependiente', desc: 'Necesita ayuda en más de la mitad de la tarea o por completo.' }
    ]
  },
  {
    key: 'arreglarse',
    label: 'Arreglarse (aseo personal)',
    options: [
      { value: 5, label: 'Independiente', desc: 'Realiza todas las actividades personales sin ayuda (lavarse cara, manos, peinarse, afeitarse).' },
      { value: 0, label: 'Dependiente', desc: 'Necesita alguna ayuda.' }
    ]
  },
  {
    key: 'deposiciones',
    label: 'Deposiciones (control de heces)',
    options: [
      { value: 10, label: 'Continente', desc: 'Ningún episodio de incontinencia.' },
      { value: 5, label: 'Accidente ocasional', desc: 'Menos de 1 vez por semana o necesita ayuda para poner enemas/supositorios.' },
      { value: 0, label: 'Incontinente', desc: 'Más de un episodio semanal.' }
    ]
  },
  {
    key: 'miccion',
    label: 'Micción (control de orina)',
    options: [
      { value: 10, label: 'Continente', desc: 'Ningún episodio de incontinencia. Capaz de usar cualquier dispositivo sin ayuda.' },
      { value: 5, label: 'Accidente ocasional', desc: 'Máximo un episodio de incontinencia en 24h, o necesita ayuda para usar sondas.' },
      { value: 0, label: 'Incontinente', desc: 'Más de un episodio en 24h, o dependiente completo.' }
    ]
  },
  {
    key: 'uso_retrete',
    label: 'Usar el retrete',
    options: [
      { value: 10, label: 'Independiente', desc: 'Entra y sale solo, se limpia y se viste.' },
      { value: 5, label: 'Necesita ayuda', desc: 'Capaz de limpiarse solo pero necesita ayuda para mantener equilibrio, desvestirse.' },
      { value: 0, label: 'Dependiente', desc: 'Incapaz de manejarse sin asistencia mayor.' }
    ]
  },
  {
    key: 'trasladarse',
    label: 'Trasladarse (camilla/silla)',
    options: [
      { value: 15, label: 'Independiente', desc: 'No requiere ayuda para sentarse o levantarse.' },
      { value: 10, label: 'Mínima ayuda', desc: 'Incluye supervisión verbal o pequeña ayuda física.' },
      { value: 5, label: 'Gran ayuda', desc: 'Capaz de sentarse pero necesita mucha asistencia para trasladarse.' },
      { value: 0, label: 'Dependiente', desc: 'Necesita grúa o traslado por dos personas.' }
    ]
  },
  {
    key: 'deambular',
    label: 'Deambular (caminar)',
    options: [
      { value: 15, label: 'Independiente', desc: 'Camina solo 50 metros o más, puede usar bastón/muleta (no andador).' },
      { value: 10, label: 'Necesita ayuda', desc: 'Necesita supervisión o ayuda física para caminar 50 metros.' },
      { value: 5, label: 'Silla de ruedas', desc: 'Independiente en silla de ruedas 50 metros.' },
      { value: 0, label: 'Dependiente', desc: 'Si no es independiente en silla de ruedas.' }
    ]
  },
  {
    key: 'escaleras',
    label: 'Subir y bajar escaleras',
    options: [
      { value: 10, label: 'Independiente', desc: 'Capaz de subir y bajar un piso sin ayuda ni supervisión. Puede usar bastón.' },
      { value: 5, label: 'Necesita ayuda', desc: 'Ayuda física o supervisión.' },
      { value: 0, label: 'Dependiente', desc: 'Incapaz de hacerlo.' }
    ]
  }
];

export function BarthelIndexForm({ data, onChange }: BarthelIndexFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const score = calculateBarthelScore(data);
  const category = score !== null ? getBarthelCategory(score) : null;

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
            Índice de Barthel — Actividades Básicas de la Vida Diaria
          </h3>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
          Resultado Barthel: {getScoreText()}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {BARTHEL_QUESTIONS.map((q) => {
            const value = data[q.key as keyof typeof data] as number | null;
            
            return (
              <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 mb-2">{q.label}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 auto-cols-fr">
                  {q.options.map(opt => {
                    const isHighest = opt.value === Math.max(...q.options.map(o => o.value));
                    const isLowest = opt.value === Math.min(...q.options.map(o => o.value));
                    
                    let activeClass = 'bg-blue-50 border-blue-500 text-blue-700'; // mid values
                    if (isHighest) activeClass = 'bg-emerald-50 border-emerald-500 text-emerald-700';
                    if (isLowest && opt.value === 0) activeClass = 'bg-red-50 border-red-500 text-red-700';

                    const checked = value === opt.value;

                    return (
                      <label
                        key={opt.value}
                        className={`flex flex-col items-start px-3 py-2.5 rounded-md border cursor-pointer transition-colors ${
                          checked ? activeClass : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <input
                            type="radio"
                            name={`barthel-${q.key}`}
                            checked={checked}
                            onChange={() => onChange(q.key, opt.value)}
                            className={`mt-0.5 ${
                              checked
                                ? (isHighest ? 'text-emerald-600 focus:ring-emerald-500' 
                                   : (isLowest && opt.value === 0 ? 'text-red-600 focus:ring-red-500' : 'text-blue-600 focus:ring-blue-500'))
                                : ''
                            }`}
                          />
                          <span className="text-[13px] font-semibold leading-none">{opt.label}</span>
                        </div>
                        <span className="text-[11px] text-gray-500 pl-5 leading-tight mt-1">
                          ({opt.value} pts) {opt.desc}
                        </span>
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
              placeholder="Observaciones adicionales sobre Barthel..."
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
