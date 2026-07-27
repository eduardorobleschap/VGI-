'use client';

import React from 'react';
import type { PatientContext, DoctorContext } from '../../types/vgi';

interface VGITriggerProps {
  patient: PatientContext;
  doctor: DoctorContext;
  onActivate: () => void;
  isActive: boolean;
}

export function VGITrigger({
  patient,
  doctor,
  onActivate,
  isActive,
}: VGITriggerProps) {
  const isElderly = patient.age >= 65;
  const isGeriatrician = doctor.specialty === 'Geriatría';
  const shouldShow = isElderly || isGeriatrician;

  if (!shouldShow || isActive) return null;

  const reasons: string[] = [];
  if (isElderly) reasons.push(`Paciente de ${patient.age} años`);
  if (isGeriatrician) reasons.push('Especialidad: Geriatría');

  return (
    <button
      id="vgi-trigger-button"
      onClick={onActivate}
      className="group w-full relative overflow-hidden rounded-xl border border-violet-200
                 bg-gradient-to-r from-violet-50 via-white to-indigo-50
                 p-4 hover:border-violet-300 transition-all duration-300
                 hover:shadow-md hover:shadow-violet-100 text-left"
      aria-label="Añadir Valoración Geriátrica Integral"
    >
      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center border border-violet-200 group-hover:bg-violet-200 transition-colors">
          <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 3h1a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C8.845 4.763 8 5.726 8 6.858V19.5a2.25 2.25 0 002.25 2.25h5.25" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-violet-700 group-hover:text-violet-800 transition-colors">
            Añadir Valoración Geriátrica Integral
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {reasons.join(' · ')} — Se sugiere realizar VGI
          </p>
        </div>

        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500 group-hover:text-violet-600 group-hover:bg-violet-100 group-hover:translate-x-0.5 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </button>
  );
}
