-- ============================================
-- SCRIPT PARA AGREGAR TABLAS FALTANTES
-- Solo crea las tablas de detalle si no existen
-- ============================================

-- Habilitar la extensión para generar UUIDs (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLA: detalle_seguro_auto (SI NO EXISTE)
-- ============================================
CREATE TABLE IF NOT EXISTS detalle_seguro_auto (
    id_detalle_auto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_lead UUID NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio >= 1900 AND anio <= 2100),
    valor_vehiculo DECIMAL(10, 2),
    tipo_cobertura VARCHAR(50) CHECK (tipo_cobertura IN ('Terceros', 'Terceros completo', 'Todo riesgo')),
    zona_riesgo VARCHAR(20) DEFAULT 'Media' CHECK (zona_riesgo IN ('Baja', 'Media', 'Alta')),
    antiguedad_licencia INTEGER,
    tiene_gps BOOLEAN DEFAULT false,
    tiene_alarma BOOLEAN DEFAULT false,
    numero_siniestros_previos INTEGER DEFAULT 0,
    esta_financiado BOOLEAN DEFAULT false,
    uso_vehiculo VARCHAR(50) CHECK (uso_vehiculo IN ('Particular', 'Comercial', 'Uber/Taxi', 'Otro')),
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar constraint de FK solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_detalle_auto_lead'
    ) THEN
        ALTER TABLE detalle_seguro_auto
        ADD CONSTRAINT fk_detalle_auto_lead
        FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE;
    END IF;
END $$;

-- Crear índices solo si no existen
CREATE INDEX IF NOT EXISTS idx_detalle_auto_lead ON detalle_seguro_auto(id_lead);
CREATE INDEX IF NOT EXISTS idx_detalle_auto_marca_modelo ON detalle_seguro_auto(marca, modelo);

COMMENT ON TABLE detalle_seguro_auto IS 'Información detallada de seguros vehiculares';

-- ============================================
-- 2. TABLA: detalle_seguro_salud (SI NO EXISTE)
-- ============================================
CREATE TABLE IF NOT EXISTS detalle_seguro_salud (
    id_detalle_salud UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_lead UUID NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    tipo_plan VARCHAR(50) NOT NULL CHECK (tipo_plan IN ('basico', 'intermedio', 'premium', 'internacional')),
    enfermedades_preexistentes TEXT[],
    es_eps BOOLEAN DEFAULT false,
    tipo_familiar VARCHAR(20) DEFAULT 'individual' CHECK (tipo_familiar IN ('individual', 'pareja', 'familiar')),
    numero_beneficiarios INTEGER DEFAULT 1,
    zona_riesgo VARCHAR(20) DEFAULT 'Media' CHECK (zona_riesgo IN ('Baja', 'Media', 'Alta')),
    fuma BOOLEAN DEFAULT false,
    practica_deportes_riesgo BOOLEAN DEFAULT false,
    tiene_seguro_actual BOOLEAN DEFAULT false,
    compania_actual VARCHAR(100),
    prima_actual DECIMAL(10, 2),
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar constraint de FK solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_detalle_salud_lead'
    ) THEN
        ALTER TABLE detalle_seguro_salud
        ADD CONSTRAINT fk_detalle_salud_lead
        FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE;
    END IF;
END $$;

-- Crear índices solo si no existen
CREATE INDEX IF NOT EXISTS idx_detalle_salud_lead ON detalle_seguro_salud(id_lead);
CREATE INDEX IF NOT EXISTS idx_detalle_salud_tipo_plan ON detalle_seguro_salud(tipo_plan);

COMMENT ON TABLE detalle_seguro_salud IS 'Información detallada de seguros de salud';

-- ============================================
-- 3. TABLA: detalle_seguro_sctr (SI NO EXISTE)
-- ============================================
CREATE TABLE IF NOT EXISTS detalle_seguro_sctr (
    id_detalle_sctr UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_lead UUID NOT NULL,
    codigo_actividad VARCHAR(10) NOT NULL,
    descripcion_actividad VARCHAR(255),
    numero_trabajadores INTEGER NOT NULL CHECK (numero_trabajadores > 0),
    sueldo_minimo DECIMAL(10, 2) NOT NULL CHECK (sueldo_minimo >= 1025),
    evaluacion_riesgo_realizada BOOLEAN DEFAULT false,
    nivel_riesgo VARCHAR(20) CHECK (nivel_riesgo IN ('Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy Alto')),
    tasa_aplicada DECIMAL(5, 4),
    tiene_seguro_actual BOOLEAN DEFAULT false,
    compania_actual VARCHAR(100),
    fecha_vencimiento_poliza DATE,
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar constraint de FK solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_detalle_sctr_lead'
    ) THEN
        ALTER TABLE detalle_seguro_sctr
        ADD CONSTRAINT fk_detalle_sctr_lead
        FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE;
    END IF;
END $$;

-- Crear índices solo si no existen
CREATE INDEX IF NOT EXISTS idx_detalle_sctr_lead ON detalle_seguro_sctr(id_lead);
CREATE INDEX IF NOT EXISTS idx_detalle_sctr_actividad ON detalle_seguro_sctr(codigo_actividad);

COMMENT ON TABLE detalle_seguro_sctr IS 'Información detallada de seguros SCTR (Seguro Complementario de Trabajo de Riesgo)';
COMMENT ON COLUMN detalle_seguro_sctr.sueldo_minimo IS 'Sueldo mínimo debe ser al menos S/ 1,025 (SMV 2024 Perú)';

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
    'Tabla creada/verificada: ' || tablename as resultado
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('detalle_seguro_auto', 'detalle_seguro_salud', 'detalle_seguro_sctr')
ORDER BY tablename;

SELECT 'Script completado exitosamente!' AS resultado;
