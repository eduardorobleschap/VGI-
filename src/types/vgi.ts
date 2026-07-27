import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// Dominio 1: FUNCIONAL
// ═══════════════════════════════════════════════════════════════

export const KatzSchema = z.object({
  score: z.number().min(0).max(6).nullable().default(null),
  notes: z.string().default(''),
});

export const BarthelSchema = z.object({
  score: z.number().min(0).max(100).nullable().default(null),
  max: z.number().default(100),
});

export const LawtonSchema = z.object({
  score: z.number().min(0).max(8).nullable().default(null),
  max: z.number().default(8),
});

export const SarcFSchema = z.object({
  score: z.number().min(0).max(10).nullable().default(null),
});

export const FrailSchema = z.object({
  score: z.number().min(0).max(5).nullable().default(null),
});

export const FuerzaPresionSchema = z.object({
  der: z.number().nullable().default(null),
  izq: z.number().nullable().default(null),
});

export const FuncionalSchema = z.object({
  katz: KatzSchema.default({}),
  barthel: BarthelSchema.default({}),
  lawton: LawtonSchema.default({}),
  sarc_f: SarcFSchema.default({}),
  frail: FrailSchema.default({}),
  fuerza_prension: FuerzaPresionSchema.default({}),
});

// ═══════════════════════════════════════════════════════════════
// Dominio 2: MENTAL / PSICOAFECTIVO
// ═══════════════════════════════════════════════════════════════

export const PfeifferSchema = z.object({
  errores: z.number().min(0).max(10).nullable().default(null),
});

export const MiniMentalSchema = z.object({
  score: z.number().min(0).max(30).nullable().default(null),
});

export const MoCASchema = z.object({
  score: z.number().min(0).max(30).nullable().default(null),
});

export const GDSSchema = z.object({
  score: z.number().min(0).max(15).nullable().default(null),
});

export const HamiltonSchema = z.object({
  score: z.number().min(0).max(52).nullable().default(null),
});

export const CAMSchema = z.object({
  delirium: z.boolean().default(false),
  notes: z.string().default(''),
});

export const MentalPsicoafectivoSchema = z.object({
  pfeiffer: PfeifferSchema.default({}),
  minimental: MiniMentalSchema.default({}),
  moca: MoCASchema.default({}),
  gds: GDSSchema.default({}),
  hamilton: HamiltonSchema.default({}),
  cam: CAMSchema.default({}),
});

// ═══════════════════════════════════════════════════════════════
// Dominio 3: SÍNDROMES GERIÁTRICOS
// ═══════════════════════════════════════════════════════════════

export const CaidasSchema = z.object({
  cantidad_12_meses: z.number().min(0).nullable().default(null),
  historial: z.string().default(''),
});

export const MarchaSchema = z.object({
  auxiliar: z.string().default(''),
  tug_segundos: z.number().nullable().default(null),
});

export const NotasSchema = z.object({
  notas: z.string().default(''),
});

export const SindromesSchema = z.object({
  caidas: CaidasSchema.default({}),
  marcha: MarchaSchema.default({}),
  sueno: NotasSchema.default({}),
  estrenimiento: NotasSchema.default({}),
  deficit_visual: NotasSchema.default({}),
  deficit_auditivo: NotasSchema.default({}),
});

// ═══════════════════════════════════════════════════════════════
// Dominio 4: NUTRICIÓN Y SOCIAL
// ═══════════════════════════════════════════════════════════════

export const NutricionSocialSchema = z.object({
  mna: z.object({
    score: z.number().min(0).max(30).nullable().default(null),
  }).default({}),
  denticion: NotasSchema.default({}),
  deglucion: NotasSchema.default({}),
  peso: z.object({
    kg: z.number().nullable().default(null),
  }).default({}),
  vive_solo: z.boolean().default(false),
  vivienda: z.string().default(''),
  cuidador_primario: z.string().default(''),
});

// ═══════════════════════════════════════════════════════════════
// Dominio 5: PREVENCIÓN Y FÁRMACOS
// ═══════════════════════════════════════════════════════════════

export const PrevencionFarmacosSchema = z.object({
  vacunas: z.string().default(''),
  densitometria: z.string().default(''),
  medicamentos_actuales: z.string().default(''),
});

// ═══════════════════════════════════════════════════════════════
// VGI DATA — Esquema consolidado
// ═══════════════════════════════════════════════════════════════

export const VGIDataSchema = z.object({
  funcional: FuncionalSchema.default({}),
  mental_psicoafectivo: MentalPsicoafectivoSchema.default({}),
  sindromes: SindromesSchema.default({}),
  nutricion_social: NutricionSocialSchema.default({}),
  prevencion_farmacos: PrevencionFarmacosSchema.default({}),
});

// ═══════════════════════════════════════════════════════════════
// Tipos TypeScript inferidos desde Zod
// ═══════════════════════════════════════════════════════════════

export type Funcional = z.infer<typeof FuncionalSchema>;
export type MentalPsicoafectivo = z.infer<typeof MentalPsicoafectivoSchema>;
export type Sindromes = z.infer<typeof SindromesSchema>;
export type NutricionSocial = z.infer<typeof NutricionSocialSchema>;
export type PrevencionFarmacos = z.infer<typeof PrevencionFarmacosSchema>;
export type VGIData = z.infer<typeof VGIDataSchema>;

// ═══════════════════════════════════════════════════════════════
// Tipo de fila de Base de Datos
// ═══════════════════════════════════════════════════════════════

export interface GeriatricAssessment {
  id: string;
  consultation_id: string;
  patient_id: string;
  doctor_id: string;
  vgi_data: VGIData;
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════
// Tipos de Alerta Geriátrica
// ═══════════════════════════════════════════════════════════════

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface GeriatricAlert {
  id: string;
  label: string;
  severity: AlertSeverity;
  domain: keyof VGIData;
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// Tipos de Contexto (Paciente / Doctor)
// ═══════════════════════════════════════════════════════════════

export interface PatientContext {
  id: string;
  name: string;
  age: number;
}

export interface DoctorContext {
  id: string;
  name: string;
  specialty: string;
}

// ═══════════════════════════════════════════════════════════════
// Definición de Tabs
// ═══════════════════════════════════════════════════════════════

export type VGITabId =
  | 'funcional'
  | 'mental_psicoafectivo'
  | 'sindromes'
  | 'nutricion_social'
  | 'prevencion_farmacos';

export interface VGITab {
  id: VGITabId;
  label: string;
  icon: string;
  description: string;
}

export const VGI_TABS: VGITab[] = [
  {
    id: 'funcional',
    label: 'Funcional',
    icon: '',
    description: 'Escalas de independencia funcional y fuerza',
  },
  {
    id: 'mental_psicoafectivo',
    label: 'Mental',
    icon: '',
    description: 'Evaluación cognitiva y psicoafectiva',
  },
  {
    id: 'sindromes',
    label: 'Síndromes',
    icon: '',
    description: 'Síndromes geriátricos comunes',
  },
  {
    id: 'nutricion_social',
    label: 'Nutrición y Social',
    icon: '',
    description: 'Estado nutricional y contexto social',
  },
  {
    id: 'prevencion_farmacos',
    label: 'Prevención',
    icon: '',
    description: 'Vacunas, estudios y medicamentos',
  },
];

// ═══════════════════════════════════════════════════════════════
// Factory: VGI Data vacío con defaults
// ═══════════════════════════════════════════════════════════════

export function createEmptyVGIData(): VGIData {
  return {
    funcional: {
      katz: { score: null, notes: '' },
      barthel: { score: null, max: 100 },
      lawton: { score: null, max: 8 },
      sarc_f: { score: null },
      frail: { score: null },
      fuerza_prension: { der: null, izq: null },
    },
    mental_psicoafectivo: {
      pfeiffer: { errores: null },
      minimental: { score: null },
      moca: { score: null },
      gds: { score: null },
      hamilton: { score: null },
      cam: { delirium: false, notes: '' },
    },
    sindromes: {
      caidas: { cantidad_12_meses: null, historial: '' },
      marcha: { auxiliar: '', tug_segundos: null },
      sueno: { notas: '' },
      estrenimiento: { notas: '' },
      deficit_visual: { notas: '' },
      deficit_auditivo: { notas: '' },
    },
    nutricion_social: {
      mna: { score: null },
      denticion: { notas: '' },
      deglucion: { notas: '' },
      peso: { kg: null },
      vive_solo: false,
      vivienda: '',
      cuidador_primario: '',
    },
    prevencion_farmacos: {
      vacunas: '',
      densitometria: '',
      medicamentos_actuales: '',
    },
  };
}
