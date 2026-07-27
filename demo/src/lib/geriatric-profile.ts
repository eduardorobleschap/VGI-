import type { VGIData, GeriatricAlert, AlertSeverity } from '../types/vgi';

// ═══════════════════════════════════════════════════════════════
// calculateGeriatricProfile
// Recibe el estado completo del formulario VGI y retorna un
// arreglo de alertas/badges clínicos basados en reglas de scoring.
// ═══════════════════════════════════════════════════════════════

export function calculateGeriatricProfile(vgiData: VGIData): GeriatricAlert[] {
  const alerts: GeriatricAlert[] = [];

  // ─── DOMINIO: FUNCIONAL ────────────────────────────────────

  // Barthel — Dependencia
  const barthel = vgiData.funcional?.barthel?.score;
  if (barthel !== null && barthel !== undefined) {
    if (barthel < 60) {
      alerts.push({
        id: 'barthel-severe',
        label: 'Dependencia Severa',
        severity: 'critical',
        domain: 'funcional',
        description: `Índice de Barthel: ${barthel}/100. Dependencia severa para actividades básicas de la vida diaria.`,
      });
    } else if (barthel < 90) {
      alerts.push({
        id: 'barthel-moderate',
        label: 'Dependencia Moderada',
        severity: 'high',
        domain: 'funcional',
        description: `Índice de Barthel: ${barthel}/100. Dependencia moderada para ABVD.`,
      });
    }
  }

  // Katz — Dependencia funcional severa
  const katz = vgiData.funcional?.katz?.score;
  if (katz !== null && katz !== undefined && katz <= 2) {
    alerts.push({
      id: 'katz-severe',
      label: 'Dependencia Funcional Severa',
      severity: 'critical',
      domain: 'funcional',
      description: `Índice de Katz: ${katz}/6. Dependencia funcional severa.`,
    });
  }

  // FRAIL — Fragilidad
  const frail = vgiData.funcional?.frail?.score;
  if (frail !== null && frail !== undefined && frail >= 3) {
    alerts.push({
      id: 'frail',
      label: 'Fragilidad',
      severity: 'high',
      domain: 'funcional',
      description: `Escala FRAIL: ${frail}/5. Paciente frágil.`,
    });
  }

  // SARC-F — Riesgo de Sarcopenia
  const sarcf = vgiData.funcional?.sarc_f?.score;
  if (sarcf !== null && sarcf !== undefined && sarcf >= 4) {
    alerts.push({
      id: 'sarcopenia',
      label: 'Riesgo de Sarcopenia',
      severity: 'high',
      domain: 'funcional',
      description: `SARC-F: ${sarcf}/10. Riesgo de sarcopenia.`,
    });
  }

  // ─── DOMINIO: MENTAL / PSICOAFECTIVO ───────────────────────

  // Pfeiffer — Deterioro cognitivo
  const pfeiffer = vgiData.mental_psicoafectivo?.pfeiffer?.errores;
  if (pfeiffer !== null && pfeiffer !== undefined && pfeiffer >= 5) {
    alerts.push({
      id: 'cognitive-impairment',
      label: 'Deterioro Cognitivo',
      severity: 'high',
      domain: 'mental_psicoafectivo',
      description: `Pfeiffer: ${pfeiffer} errores. Deterioro cognitivo moderado-severo.`,
    });
  }

  // Mini-Mental — Déficit cognitivo
  const minimental = vgiData.mental_psicoafectivo?.minimental?.score;
  if (minimental !== null && minimental !== undefined && minimental < 24) {
    alerts.push({
      id: 'minimental-low',
      label: 'Déficit Cognitivo',
      severity: minimental < 18 ? 'critical' : 'high',
      domain: 'mental_psicoafectivo',
      description: `Mini-Mental: ${minimental}/30. ${minimental < 18 ? 'Deterioro cognitivo severo' : 'Deterioro cognitivo leve-moderado'}.`,
    });
  }

  // GDS — Depresión
  const gds = vgiData.mental_psicoafectivo?.gds?.score;
  if (gds !== null && gds !== undefined && gds >= 10) {
    alerts.push({
      id: 'depression',
      label: 'Depresión',
      severity: 'high',
      domain: 'mental_psicoafectivo',
      description: `GDS (Yesavage): ${gds}/15. Probable depresión establecida.`,
    });
  }

  // CAM — Delirium
  const cam = vgiData.mental_psicoafectivo?.cam;
  if (cam?.delirium) {
    alerts.push({
      id: 'delirium',
      label: 'Delirium',
      severity: 'critical',
      domain: 'mental_psicoafectivo',
      description: 'CAM positivo. Delirium detectado — requiere atención inmediata.',
    });
  }

  // ─── DOMINIO: SÍNDROMES GERIÁTRICOS ────────────────────────

  // TUG — Riesgo de caídas
  const tug = vgiData.sindromes?.marcha?.tug_segundos;
  if (tug !== null && tug !== undefined) {
    if (tug > 20) {
      alerts.push({
        id: 'falls-high-risk',
        label: 'Alto Riesgo de Caídas',
        severity: 'critical',
        domain: 'sindromes',
        description: `Timed Up & Go: ${tug}s. Alto riesgo de caídas y movilidad severamente reducida.`,
      });
    } else if (tug > 12) {
      alerts.push({
        id: 'falls-risk',
        label: 'Riesgo de Caídas',
        severity: 'high',
        domain: 'sindromes',
        description: `Timed Up & Go: ${tug}s. Riesgo incrementado de caídas.`,
      });
    }
  }

  // Caídas recurrentes
  const caidas = vgiData.sindromes?.caidas?.cantidad_12_meses;
  if (caidas !== null && caidas !== undefined && caidas >= 2) {
    alerts.push({
      id: 'recurrent-falls',
      label: 'Caídas Recurrentes',
      severity: 'high',
      domain: 'sindromes',
      description: `${caidas} caídas en los últimos 12 meses. Patrón de caídas recurrentes.`,
    });
  }

  // ─── DOMINIO: NUTRICIÓN ────────────────────────────────────

  // MNA — Estado nutricional
  const mna = vgiData.nutricion_social?.mna?.score;
  if (mna !== null && mna !== undefined) {
    if (mna < 17) {
      alerts.push({
        id: 'malnutrition',
        label: 'Desnutrición',
        severity: 'critical',
        domain: 'nutricion_social',
        description: `MNA: ${mna}/30. Estado de desnutrición establecida.`,
      });
    } else if (mna < 23.5) {
      alerts.push({
        id: 'malnutrition-risk',
        label: 'Riesgo de Desnutrición',
        severity: 'medium',
        domain: 'nutricion_social',
        description: `MNA: ${mna}/30. Riesgo de desnutrición.`,
      });
    }
  }

  return alerts;
}

// ═══════════════════════════════════════════════════════════════
// Utilidades auxiliares
// ═══════════════════════════════════════════════════════════════

/** Filtra alertas por dominio de la VGI */
export function getAlertsByDomain(
  alerts: GeriatricAlert[],
  domain: keyof VGIData,
): GeriatricAlert[] {
  return alerts.filter((a) => a.domain === domain);
}

/** Agrupa alertas por severidad */
export function getAlertsBySeverity(
  alerts: GeriatricAlert[],
): Record<AlertSeverity, GeriatricAlert[]> {
  const grouped: Record<AlertSeverity, GeriatricAlert[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };
  for (const alert of alerts) {
    grouped[alert.severity].push(alert);
  }
  return grouped;
}

/** Verifica si existen alertas de alta prioridad */
export function hasHighRiskAlerts(alerts: GeriatricAlert[]): boolean {
  return alerts.some(
    (a) => a.severity === 'critical' || a.severity === 'high',
  );
}

/** Cuenta total de alertas por severidad */
export function countAlertsBySeverity(
  alerts: GeriatricAlert[],
): Record<AlertSeverity, number> {
  const counts: Record<AlertSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const alert of alerts) {
    counts[alert.severity]++;
  }
  return counts;
}
