-- ============================================================
-- Migración: Crear tabla geriatric_assessments
-- Módulo: Valoración Geriátrica Integral (VGI)
-- Plataforma: DocTree EHR
-- ============================================================

CREATE TABLE IF NOT EXISTS geriatric_assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL,
    patient_id      UUID NOT NULL,
    doctor_id       UUID NOT NULL,

    -- Almacena el objeto completo de la VGI como JSONB
    -- Estructura: { funcional, mental_psicoafectivo, sindromes, nutricion_social, prevencion_farmacos }
    vgi_data        JSONB NOT NULL DEFAULT '{}',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Descomenta y ajusta los FK a los nombres reales de tus tablas:
    -- CONSTRAINT fk_ga_consultation FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_ga_patient      FOREIGN KEY (patient_id)      REFERENCES patients(id),
    -- CONSTRAINT fk_ga_doctor        FOREIGN KEY (doctor_id)        REFERENCES doctors(id),

    -- Una sola VGI por consulta
    CONSTRAINT uq_ga_consultation UNIQUE (consultation_id)
);

-- Índices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_ga_patient_id
    ON geriatric_assessments (patient_id);

CREATE INDEX IF NOT EXISTS idx_ga_consultation_id
    ON geriatric_assessments (consultation_id);

CREATE INDEX IF NOT EXISTS idx_ga_created_at
    ON geriatric_assessments (created_at DESC);

-- Índice GIN para queries dentro del JSONB (ej: buscar pacientes con delirium)
CREATE INDEX IF NOT EXISTS idx_ga_vgi_data
    ON geriatric_assessments USING GIN (vgi_data);

-- ============================================================
-- Trigger: Actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_ga_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ga_updated_at ON geriatric_assessments;

CREATE TRIGGER trg_ga_updated_at
    BEFORE UPDATE ON geriatric_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_ga_updated_at();

-- ============================================================
-- Queries de ejemplo para validar la migración
-- ============================================================
-- Insertar:
--   INSERT INTO geriatric_assessments (consultation_id, patient_id, doctor_id, vgi_data)
--   VALUES ('uuid', 'uuid', 'uuid', '{"funcional":{"barthel":{"score":45,"max":100}}}');
--
-- Buscar pacientes con delirium:
--   SELECT * FROM geriatric_assessments
--   WHERE vgi_data->'mental_psicoafectivo'->'cam'->>'delirium' = 'true';
--
-- Buscar valoraciones con Barthel < 60:
--   SELECT * FROM geriatric_assessments
--   WHERE (vgi_data->'funcional'->'barthel'->>'score')::int < 60;
