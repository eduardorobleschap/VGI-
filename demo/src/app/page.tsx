'use client';

import React, { useState } from 'react';
import { VGITrigger } from '@/components/vgi/VGITrigger';
import { VGIPanel } from '@/components/vgi/VGIPanel';
import type { VGIData } from '@/types/vgi';

const MOCK_PATIENT = {
  id: 'pat-001',
  name: 'María Elena Rodríguez Vázquez',
  age: 78,
};

const MOCK_DOCTOR = {
  id: 'doc-001',
  name: 'Dr. Carlos Mendoza',
  specialty: 'Geriatría', // Valor por defecto del médico, pero la selección es manual
};

const SPECIALTIES = [
  { id: '', label: 'Selecciona una especialidad...' },
  { id: 'general', label: 'Medicina General' },
  { id: 'pediatria', label: 'Pediatría' },
  { id: 'ginecologia', label: 'Ginecología' },
  { id: 'geriatria', label: 'Geriatría' },
  { id: 'cardiologia', label: 'Cardiología' },
];

export default function DemoPage() {
  const [showVGI, setShowVGI] = useState(false);
  const [savedData, setSavedData] = useState<VGIData | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  const handleSave = (data: VGIData) => {
    setSavedData(data);
    setShowVGI(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">
              Doc<span className="text-emerald-600">Tree</span>
            </h1>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Consulta en curso
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Info paciente + doctor */}
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Paciente</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  MR
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_PATIENT.name}</p>
                  <p className="text-xs text-gray-500">{MOCK_PATIENT.age} años</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Médico</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  CM
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{MOCK_DOCTOR.name}</p>
                  <p className="text-xs text-gray-500">{MOCK_DOCTOR.specialty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formatos Adicionales */}
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Formatos Adicionales</h3>
            <p className="text-sm text-gray-500 mt-1">
              Seleccione la especialidad para cargar los formatos de evaluación correspondientes.
            </p>
          </div>

          <div className="max-w-sm">
            <label htmlFor="specialty-select" className="block text-sm font-medium text-gray-700 mb-1.5">
              Especialidad
            </label>
            <div className="relative">
              <select
                id="specialty-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm
                           text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                           focus:border-emerald-500 appearance-none cursor-pointer transition-colors"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Renderizado condicional basado en la especialidad seleccionada */}
          <div className="pt-2">
            {selectedSpecialty === '' ? (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-center">
                <p className="text-sm text-gray-500">Selecciona una especialidad para ver los formatos disponibles.</p>
              </div>
            ) : selectedSpecialty === 'geriatria' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <h4 className="text-sm font-medium text-gray-700">Formatos de Geriatría</h4>
                
                {savedData ? (
                  <div className="rounded-xl bg-white border border-emerald-200 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-sm text-emerald-700 font-medium">VGI guardada exitosamente</p>
                    </div>
                    <button
                      onClick={() => setShowVGI(true)}
                      className="text-xs text-violet-600 hover:text-violet-700 underline underline-offset-2 transition-colors"
                    >
                      Ver / Editar valoración
                    </button>
                  </div>
                ) : (
                  <VGITrigger
                    patient={MOCK_PATIENT}
                    doctor={{ ...MOCK_DOCTOR, specialty: 'Geriatría' }} // Aseguramos que pase la validación interna del trigger
                    onActivate={() => setShowVGI(true)}
                    isActive={showVGI}
                  />
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-1 duration-300">
                <p className="text-sm text-gray-500">
                  Aún no hay formatos adicionales configurados para esta especialidad.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <VGIPanel
        isOpen={showVGI}
        onClose={() => setShowVGI(false)}
        onSave={handleSave}
        initialData={savedData ?? undefined}
      />
    </main>
  );
}
