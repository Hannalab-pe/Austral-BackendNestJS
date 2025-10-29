-- Script para corregir problemas de índices duplicados en la base de datos
-- Ejecutar este script usando psql o pgAdmin

-- ============================================
-- OPCIÓN 1: Eliminar solo los índices duplicados
-- ============================================

-- Eliminar índices si existen (esto no afectará los datos)
DROP INDEX IF EXISTS idx_lead_activo;
DROP INDEX IF EXISTS idx_lead_asignado;
DROP INDEX IF EXISTS idx_lead_cumpleanos;
DROP INDEX IF EXISTS idx_lead_estado;
DROP INDEX IF EXISTS idx_lead_seguimiento;
DROP INDEX IF EXISTS idx_lead_telefono;

-- Recrear los índices
CREATE INDEX IF NOT EXISTS idx_lead_activo ON lead(esta_activo);
CREATE INDEX IF NOT EXISTS idx_lead_asignado ON lead(asignado_a_usuario);
CREATE INDEX IF NOT EXISTS idx_lead_cumpleanos ON lead(fecha_nacimiento);
CREATE INDEX IF NOT EXISTS idx_lead_estado ON lead(id_estado);
CREATE INDEX IF NOT EXISTS idx_lead_seguimiento ON lead(proxima_fecha_seguimiento);
CREATE INDEX IF NOT EXISTS idx_lead_telefono ON lead(telefono);

-- Verificar que los índices se crearon correctamente
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'lead'
ORDER BY
    indexname;

-- ============================================
-- OPCIÓN 2: Recrear toda la tabla (CUIDADO: ESTO BORRARÁ TODOS LOS DATOS)
-- Solo usar si es necesario y tienes backup
-- ============================================

/*
-- Descomenta estas líneas solo si quieres recrear toda la tabla

-- Eliminar la tabla y recrearla
DROP TABLE IF EXISTS lead CASCADE;

CREATE TABLE lead (
    id_lead UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE,
    tipo_seguro_interes VARCHAR(100),
    presupuesto_aproximado DECIMAL(10, 2),
    notas TEXT,
    puntaje_calificacion INTEGER DEFAULT 0,
    prioridad VARCHAR(20) DEFAULT 'MEDIA',
    fecha_primer_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_contacto TIMESTAMP,
    proxima_fecha_seguimiento TIMESTAMP,
    id_estado UUID NOT NULL,
    id_fuente UUID NOT NULL,
    asignado_a_usuario UUID,
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estado) REFERENCES estado_lead(id_estado),
    FOREIGN KEY (id_fuente) REFERENCES fuente_lead(id_fuente)
);

-- Crear índices
CREATE INDEX idx_lead_activo ON lead(esta_activo);
CREATE INDEX idx_lead_asignado ON lead(asignado_a_usuario);
CREATE INDEX idx_lead_cumpleanos ON lead(fecha_nacimiento);
CREATE INDEX idx_lead_estado ON lead(id_estado);
CREATE INDEX idx_lead_seguimiento ON lead(proxima_fecha_seguimiento);
CREATE INDEX idx_lead_telefono ON lead(telefono);
*/
