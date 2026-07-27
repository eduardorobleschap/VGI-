'use client';

import React, { useEffect } from 'react';
import type { VGIData } from '../../types/vgi';
import { VGI_TABS } from '../../types/vgi';
import { AlertBadges } from './AlertBadges';
import { FuncionalTab } from './tabs/FuncionalTab';
import { MentalTab } from './tabs/MentalTab';
import { SindromesTab } from './tabs/SindromesTab';
import { NutricionSocialTab } from './tabs/NutricionSocialTab';
import { PrevencionFarmacosTab } from './tabs/PrevencionFarmacosTab';
import { useVGIForm } from '../../hooks/useVGIForm';
import { getAlertsByDomain } from '../../lib/geriatric-profile';

interface VGIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VGIData) => void;
  initialData?: Partial<VGIData>;
}

export function VGIPanel({
  isOpen,
  onClose,
  onSave,
  initialData,
}: VGIPanelProps) {
  const {
    data,
    alerts,
    activeTab,
    setActiveTab,
    isDirty,
    updateField,
    reset,
    validate,
    getData,
  } = useVGIForm({ initialData });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handler);
    }
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    const { success } = validate();
    if (success) {
      onSave(getData());
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const renderActiveTab = () => {
    const handler = (path: string, value: unknown) =>
      updateField(activeTab, path, value);

    switch (activeTab) {
      case 'funcional':
        return <FuncionalTab data={data.funcional} onChange={handler} />;
      case 'mental_psicoafectivo':
        return <MentalTab data={data.mental_psicoafectivo} onChange={handler} />;
      case 'sindromes':
        return <SindromesTab data={data.sindromes} onChange={handler} />;
      case 'nutricion_social':
        return <NutricionSocialTab data={data.nutricion_social} onChange={handler} />;
      case 'prevencion_farmacos':
        return <PrevencionFarmacosTab data={data.prevencion_farmacos} onChange={handler} />;
      default:
        return null;
    }
  };

  return (
    <div
      id="vgi-panel-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Valoración Geriátrica Integral"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Window */}
      <div
        id="vgi-floating-window"
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl
                   border border-gray-200 shadow-2xl shadow-gray-300/50
                   flex flex-col zoom-in-95"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 3h1a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C8.845 4.763 8 5.726 8 6.858V19.5a2.25 2.25 0 002.25 2.25h5.25" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Valoración Geriátrica Integral
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Evaluación multidimensional del paciente adulto mayor
                </p>
              </div>
            </div>
            <button
              id="vgi-close-button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center
                         text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {alerts.length > 0 && (
            <div className="mb-3">
              <AlertBadges alerts={alerts} />
            </div>
          )}

          {/* Tabs */}
          <nav
            className="flex gap-1 overflow-x-auto pb-0.5"
            role="tablist"
            aria-label="Dominios de la VGI"
            style={{ scrollbarWidth: 'none' }}
          >
            {VGI_TABS.map((tab) => {
              const tabAlerts = getAlertsByDomain(alerts, tab.id);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`vgi-tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`vgi-tabpanel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    whitespace-nowrap transition-all duration-200
                    ${
                      isActive
                        ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{tab.label}</span>

                  {tabAlerts.length > 0 && (
                    <span
                      className={`
                        w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
                        ${
                          tabAlerts.some((a) => a.severity === 'critical')
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-600'
                        }
                      `}
                    >
                      {tabAlerts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div
          id={`vgi-tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`vgi-tab-${activeTab}`}
          className="flex-1 overflow-y-auto px-6 py-5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          {renderActiveTab()}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Cambios sin guardar
              </span>
            ) : (
              <span>
                {alerts.length > 0
                  ? `${alerts.length} alerta${alerts.length > 1 ? 's' : ''} detectada${alerts.length > 1 ? 's' : ''}`
                  : 'Sin alertas'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="vgi-cancel-button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500
                         hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="vgi-save-button"
              onClick={handleSave}
              disabled={!isDirty}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white
                         bg-gradient-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         shadow-md shadow-violet-200
                         disabled:opacity-40 disabled:cursor-not-allowed
                         disabled:shadow-none
                         transition-all duration-200 active:scale-[0.98]"
            >
              Guardar VGI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
