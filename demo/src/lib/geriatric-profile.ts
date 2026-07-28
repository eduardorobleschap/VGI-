import type { VGIData, GeriatricAlert, AlertSeverity, Funcional } from '../types/vgi';

// ═══════════════════════════════════════════════════════════════
// calculateGeriatricProfile
// Recibe el estado completo del formulario VGI y retorna un
// arreglo de alertas/badges clínicos basados en reglas de scoring.
// ═══════════════════════════════════════════════════════════════

export function calculateGeriatricProfile(vgiData: VGIData): GeriatricAlert[] {
  const alerts: GeriatricAlert[] = [];

  // ─── DOMINIO: FUNCIONAL ────────────────────────────────────

  // Lawton — AIVD
  const lawtonNode = vgiData.funcional?.lawton;
  if (lawtonNode) {
    const lawtonScore = calculateLawtonScore(lawtonNode);
    if (lawtonScore !== null) {
      const category = getLawtonCategory(lawtonScore);
      if (category.severity) {
        alerts.push({
          id: 'lawton-alert',
          label: category.label,
          severity: category.severity,
          domain: 'funcional',
          description: `Índice de Lawton y Brody: ${lawtonScore}/8. ${category.label}.`,
        });
      }
    }
  }

  // Barthel — Dependencia
  const barthelNode = vgiData.funcional?.barthel;
  if (barthelNode) {
    const barthelScore = calculateBarthelScore(barthelNode);
    if (barthelScore !== null) {
      const category = getBarthelCategory(barthelScore);
      if (category.severity) {
        alerts.push({
          id: 'barthel-alert',
          label: category.label,
          severity: category.severity,
          domain: 'funcional',
          description: `Índice de Barthel: ${barthelScore}/100. ${category.label}.`,
        });
      }
    }
  }

  // Rosow-Breslau
  const rosowNode = vgiData.funcional?.rosow;
  if (rosowNode) {
    const rosowScore = calculateRosowScore(rosowNode);
    if (rosowScore !== null) {
      const category = getRosowCategory(rosowScore);
      if (category.severity) {
        alerts.push({
          id: 'rosow-alert',
          label: category.label,
          severity: category.severity,
          domain: 'funcional',
          description: `Escala de Rosow: ${rosowScore}/6. ${category.label} de movilidad.`,
        });
      }
    }
  }

  // Nagi
  const nagiNode = vgiData.funcional?.nagi;
  if (nagiNode) {
    const nagiScore = calculateNagiScore(nagiNode);
    if (nagiScore !== null) {
      const category = getNagiCategory(nagiScore);
      if (category.severity) {
        alerts.push({
          id: 'nagi-alert',
          label: category.label,
          severity: category.severity,
          domain: 'funcional',
          description: `Escala de Nagi: ${nagiScore}/15. ${category.label} física.`,
        });
      }
    }
  }

  // Katz — Dependencia funcional
  const katzNode = vgiData.funcional?.katz;
  if (katzNode) {
    const grade = calculateKatzGrade(katzNode);
    if (grade !== null && (grade === 'E' || grade === 'F' || grade === 'G')) {
      alerts.push({
        id: 'katz-severe',
        label: 'Dependencia Funcional Severa',
        severity: 'critical',
        domain: 'funcional',
        description: `Índice de Katz: Grado ${grade}. Dependencia en múltiples funciones básicas (Baño, Vestido, Uso del baño y más).`,
      });
    }
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

// ═══════════════════════════════════════════════════════════════
// Funciones de Escalas Geriátricas Específicas
// ═══════════════════════════════════════════════════════════════

export type KatzGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;

export function calculateKatzGrade(katz: Funcional['katz']): KatzGrade {
  const { bano, vestido, uso_bano, movilidad, continencia, alimentacion } = katz;
  
  if (
    bano === null ||
    vestido === null ||
    uso_bano === null ||
    movilidad === null ||
    continencia === null ||
    alimentacion === null
  ) {
    return null;
  }

  // true = independiente, false = dependiente
  const deps = [
    { key: 'bano', val: bano },
    { key: 'vestido', val: vestido },
    { key: 'uso_bano', val: uso_bano },
    { key: 'movilidad', val: movilidad },
    { key: 'continencia', val: continencia },
    { key: 'alimentacion', val: alimentacion },
  ];

  const totalDeps = deps.filter((d) => d.val === false).length;

  if (totalDeps === 0) return 'A';
  if (totalDeps === 1) return 'B';
  if (totalDeps === 6) return 'G';

  // Lógica estricta de Katz
  // C: Independiente en todas menos Baño y otra (2 dependencias)
  if (totalDeps === 2 && bano === false) return 'C';
  // D: Independiente en todas menos Baño, Vestido y otra (3 dependencias)
  if (totalDeps === 3 && bano === false && vestido === false) return 'D';
  // E: Independiente en todas menos Baño, Vestido, Uso del baño y otra (4 dependencias)
  if (totalDeps === 4 && bano === false && vestido === false && uso_bano === false) return 'E';
  // F: Independiente en todas menos Baño, Vestido, Uso del baño, Movilidad y otra (5 dependencias)
  if (totalDeps === 5 && bano === false && vestido === false && uso_bano === false && movilidad === false) return 'F';

  // Fallback: Si no cumple el patrón jerárquico estricto (lo cual es raro pero posible), 
  // se clasifica por el número total de dependencias.
  const fallbacks: Record<number, KatzGrade> = { 2: 'C', 3: 'D', 4: 'E', 5: 'F' };
  return fallbacks[totalDeps] || null;
}

export function calculateBarthelScore(barthel: Funcional['barthel']): number | null {
  const { comer, lavarse, vestirse, arreglarse, deposiciones, miccion, uso_retrete, trasladarse, deambular, escaleras } = barthel;
  
  if (
    comer === null || lavarse === null || vestirse === null || arreglarse === null || 
    deposiciones === null || miccion === null || uso_retrete === null || 
    trasladarse === null || deambular === null || escaleras === null
  ) {
    return null;
  }
  
  return comer + lavarse + vestirse + arreglarse + deposiciones + miccion + uso_retrete + trasladarse + deambular + escaleras;
}

export function getBarthelCategory(score: number): { label: string; severity: AlertSeverity | null } {
  if (score < 20) return { label: 'Dependencia Total', severity: 'critical' };
  if (score <= 35) return { label: 'Dependencia Grave', severity: 'critical' };
  if (score <= 55) return { label: 'Dependencia Moderada', severity: 'high' };
  if (score <= 99) return { label: 'Dependencia Leve', severity: 'medium' };
  return { label: 'Independiente', severity: null };
}

export function calculateRosowScore(rosow: Funcional['rosow']): number | null {
  if (!rosow) return null;
  const { trabajo_pesado, escaleras, caminar } = rosow;
  if (trabajo_pesado === null || escaleras === null || caminar === null) return null;
  return trabajo_pesado + escaleras + caminar;
}

export function getRosowCategory(score: number): { label: string; severity: AlertSeverity | null } {
  if (score === 6) return { label: 'Independiente', severity: null };
  if (score >= 4) return { label: 'Limitación leve', severity: 'medium' };
  if (score >= 2) return { label: 'Limitación moderada', severity: 'high' };
  return { label: 'Limitación severa', severity: 'critical' };
}

export function calculateNagiScore(nagi: Funcional['nagi']): number | null {
  if (!nagi) return null;
  const { empujar, agacharse, levantar_brazos, escribir, cargar_peso } = nagi;
  if (empujar === null || agacharse === null || levantar_brazos === null || escribir === null || cargar_peso === null) return null;
  return empujar + agacharse + levantar_brazos + escribir + cargar_peso;
}

export function getNagiCategory(score: number): { label: string; severity: AlertSeverity | null } {
  if (score === 0) return { label: 'Sin discapacidad', severity: null };
  if (score <= 5) return { label: 'Discapacidad leve', severity: 'medium' };
  if (score <= 10) return { label: 'Discapacidad moderada', severity: 'high' };
  return { label: 'Discapacidad severa', severity: 'critical' };
}

export function calculateLawtonScore(lawton: Funcional['lawton']): number | null {
  if (!lawton) return null;
  const { telefono, compras, comida, casa, ropa, transporte, medicacion, dinero } = lawton;
  if (telefono === null || compras === null || comida === null || casa === null ||
      ropa === null || transporte === null || medicacion === null || dinero === null) return null;
  return telefono + compras + comida + casa + ropa + transporte + medicacion + dinero;
}

export function getLawtonCategory(score: number): { label: string; severity: AlertSeverity | null } {
  if (score <= 1) return { label: 'Dependencia total', severity: 'critical' };
  if (score <= 3) return { label: 'Dependencia grave', severity: 'critical' };
  if (score <= 5) return { label: 'Dependencia moderada', severity: 'high' };
  if (score <= 7) return { label: 'Dependencia ligera', severity: 'medium' };
  return { label: 'Independencia total', severity: null };
}
