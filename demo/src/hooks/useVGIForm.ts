'use client';

import { useState, useCallback, useMemo } from 'react';
import { VGIDataSchema, createEmptyVGIData } from '../types/vgi';
import type { VGIData, VGITabId, GeriatricAlert } from '../types/vgi';
import { calculateGeriatricProfile } from '../lib/geriatric-profile';

// ═══════════════════════════════════════════════════════════════
// useVGIForm — Hook de estado para el formulario VGI
// ═══════════════════════════════════════════════════════════════

interface UseVGIFormOptions {
  /** Datos iniciales parciales (ej: cargados de BD) */
  initialData?: Partial<VGIData>;
}

interface UseVGIFormReturn {
  /** Estado actual completo del formulario */
  data: VGIData;
  /** Alertas calculadas en tiempo real */
  alerts: GeriatricAlert[];
  /** Tab activa */
  activeTab: VGITabId;
  /** Cambiar tab activa */
  setActiveTab: (tab: VGITabId) => void;
  /** ¿Se ha modificado desde el estado inicial? */
  isDirty: boolean;
  /** Actualizar un dominio completo */
  updateDomain: <K extends keyof VGIData>(
    domain: K,
    value: Partial<VGIData[K]>,
  ) => void;
  /** Actualizar un campo específico con dot-notation */
  updateField: (domain: keyof VGIData, path: string, value: unknown) => void;
  /** Resetear al estado inicial */
  reset: () => void;
  /** Validar con Zod antes de submit */
  validate: () => { success: boolean; errors: unknown };
  /** Obtener snapshot actual del data */
  getData: () => VGIData;
}

export function useVGIForm(options?: UseVGIFormOptions): UseVGIFormReturn {
  const initialData = useMemo(() => {
    const empty = createEmptyVGIData();
    if (options?.initialData) {
      return VGIDataSchema.parse(deepMerge(empty, options.initialData));
    }
    return empty;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setData] = useState<VGIData>(initialData);
  const [activeTab, setActiveTab] = useState<VGITabId>('funcional');
  const [isDirty, setIsDirty] = useState(false);

  // Alertas se recalculan cada vez que cambia el data
  const alerts = useMemo(() => calculateGeriatricProfile(data), [data]);

  const updateDomain = useCallback(
    <K extends keyof VGIData>(domain: K, value: Partial<VGIData[K]>) => {
      setData((prev) => ({
        ...prev,
        [domain]: { ...prev[domain], ...value },
      }));
      setIsDirty(true);
    },
    [],
  );

  const updateField = useCallback(
    (domain: keyof VGIData, path: string, value: unknown) => {
      setData((prev) => {
        const domainData = structuredClone(prev[domain]) as Record<string, unknown>;
        setNestedValue(domainData, path, value);
        return { ...prev, [domain]: domainData };
      });
      setIsDirty(true);
    },
    [],
  );

  const reset = useCallback(() => {
    setData(initialData);
    setIsDirty(false);
  }, [initialData]);

  const validate = useCallback(() => {
    const result = VGIDataSchema.safeParse(data);
    return {
      success: result.success,
      errors: result.success ? null : result.error.format(),
    };
  }, [data]);

  const getData = useCallback(() => data, [data]);

  return {
    data,
    alerts,
    activeTab,
    setActiveTab,
    isDirty,
    updateDomain,
    updateField,
    reset,
    validate,
    getData,
  };
}

// ═══════════════════════════════════════════════════════════════
// Helpers internos
// ═══════════════════════════════════════════════════════════════

/** Asignar valor en un objeto usando dot-notation (ej: "katz.score") */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}

/** Deep merge de dos objetos (source sobrescribe target) */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      (result as Record<string, unknown>)[key as string] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>,
      );
    } else if (sourceVal !== undefined) {
      (result as Record<string, unknown>)[key as string] = sourceVal;
    }
  }

  return result;
}
