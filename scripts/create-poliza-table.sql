-- Script para crear la tabla POLIZA en PostgreSQL
-- Base de datos: AUSTRALBDlocal

-- ============================================
-- TABLA: poliza
-- ============================================

CREATE TABLE IF NOT EXISTS poliza (
    id_poliza UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_poliza VARCHAR(100) NOT NULL UNIQUE,
    asegurado VARCHAR(300) NOT NULL,
    sub_agente VARCHAR(300),
    id_compania UUID NOT NULL,
    ramo VARCHAR(100) NOT NULL,
    id_producto UUID NOT NULL,
    porcentaje_comision_compania DECIMAL(5, 2) DEFAULT 0.0,
    porcentaje_comision_subagente DECIMAL(5, 2) DEFAULT 0.0,
    tipo_vigencia VARCHAR(50) NOT NULL,
    vigencia_inicio DATE NOT NULL,
    vigencia_fin DATE NOT NULL,
    fecha_emision DATE NOT NULL,
    moneda VARCHAR(10) DEFAULT 'PEN',
    descripcion_asegura TEXT,
    ejecutivo_cuenta VARCHAR(300),
    mas_informacion TEXT,
    id_cliente UUID NOT NULL,
    id_usuario_creador UUID NOT NULL,
    fecha_renovacion DATE,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints para validar rangos
    CONSTRAINT chk_porcentaje_comision_compania CHECK (porcentaje_comision_compania >= 0 AND porcentaje_comision_compania <= 100),
    CONSTRAINT chk_porcentaje_comision_subagente CHECK (porcentaje_comision_subagente >= 0 AND porcentaje_comision_subagente <= 100),
    CONSTRAINT chk_vigencia_fechas CHECK (vigencia_fin > vigencia_inicio)
);

-- ============================================
-- ÍNDICES para optimizar consultas
-- ============================================

CREATE INDEX IF NOT EXISTS idx_poliza_cliente ON poliza(id_cliente);
CREATE INDEX IF NOT EXISTS idx_poliza_asegurado ON poliza(asegurado);
CREATE INDEX IF NOT EXISTS idx_poliza_vigencia_inicio ON poliza(vigencia_inicio);
CREATE INDEX IF NOT EXISTS idx_poliza_vigencia_fin ON poliza(vigencia_fin);
CREATE INDEX IF NOT EXISTS idx_poliza_usuario_creador ON poliza(id_usuario_creador);
CREATE INDEX IF NOT EXISTS idx_poliza_compania ON poliza(id_compania);
CREATE INDEX IF NOT EXISTS idx_poliza_producto ON poliza(id_producto);
CREATE INDEX IF NOT EXISTS idx_poliza_activo ON poliza(esta_activo);
CREATE INDEX IF NOT EXISTS idx_poliza_numero ON poliza(numero_poliza);
CREATE INDEX IF NOT EXISTS idx_poliza_fecha_emision ON poliza(fecha_emision);

-- ============================================
-- FOREIGN KEYS (Relaciones con otras tablas)
-- ============================================

-- Relación con compania_seguro (si existe la tabla)
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_compania
FOREIGN KEY (id_compania)
REFERENCES compania_seguro(id_compania)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Relación con producto_seguro (si existe la tabla)
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_producto
FOREIGN KEY (id_producto)
REFERENCES producto_seguro(id_producto)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Relación con cliente (si existe la tabla)
-- Descomenta la siguiente sección si tienes la tabla cliente
/*
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_cliente
FOREIGN KEY (id_cliente)
REFERENCES cliente(id_cliente)
ON DELETE RESTRICT
ON UPDATE CASCADE;
*/

-- Relación con usuario (si existe la tabla)
-- Descomenta la siguiente sección si tienes la tabla usuario
/*
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_usuario_creador
FOREIGN KEY (id_usuario_creador)
REFERENCES usuario(id_usuario)
ON DELETE RESTRICT
ON UPDATE CASCADE;
*/

-- ============================================
-- TRIGGER para actualizar fecha_actualizacion automáticamente
-- ============================================

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_poliza_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_update_poliza_timestamp ON poliza;
CREATE TRIGGER trigger_update_poliza_timestamp
    BEFORE UPDATE ON poliza
    FOR EACH ROW
    EXECUTE FUNCTION update_poliza_timestamp();

-- ============================================
-- COMENTARIOS en la tabla y columnas (opcional pero recomendado)
-- ============================================

COMMENT ON TABLE poliza IS 'Tabla que almacena las pólizas de seguros emitidas';
COMMENT ON COLUMN poliza.id_poliza IS 'Identificador único de la póliza (UUID)';
COMMENT ON COLUMN poliza.numero_poliza IS 'Número único de la póliza';
COMMENT ON COLUMN poliza.asegurado IS 'Nombre completo del asegurado';
COMMENT ON COLUMN poliza.sub_agente IS 'Nombre del sub agente (opcional)';
COMMENT ON COLUMN poliza.id_compania IS 'ID de la compañía de seguros';
COMMENT ON COLUMN poliza.ramo IS 'Ramo del seguro (VIDA, AUTO, SALUD, etc.)';
COMMENT ON COLUMN poliza.id_producto IS 'ID del producto de seguro';
COMMENT ON COLUMN poliza.porcentaje_comision_compania IS 'Porcentaje de comisión de la compañía (0-100)';
COMMENT ON COLUMN poliza.porcentaje_comision_subagente IS 'Porcentaje de comisión del sub agente (0-100)';
COMMENT ON COLUMN poliza.tipo_vigencia IS 'Tipo de vigencia (ANUAL, SEMESTRAL, TRIMESTRAL, MENSUAL)';
COMMENT ON COLUMN poliza.vigencia_inicio IS 'Fecha de inicio de vigencia';
COMMENT ON COLUMN poliza.vigencia_fin IS 'Fecha de fin de vigencia';
COMMENT ON COLUMN poliza.fecha_emision IS 'Fecha de emisión de la póliza';
COMMENT ON COLUMN poliza.moneda IS 'Moneda de la póliza (PEN, USD, EUR)';
COMMENT ON COLUMN poliza.descripcion_asegura IS 'Descripción de lo que se asegura';
COMMENT ON COLUMN poliza.ejecutivo_cuenta IS 'Nombre del ejecutivo de cuenta';
COMMENT ON COLUMN poliza.mas_informacion IS 'Información adicional sobre la póliza';
COMMENT ON COLUMN poliza.id_cliente IS 'ID del cliente propietario de la póliza';
COMMENT ON COLUMN poliza.id_usuario_creador IS 'ID del usuario que creó la póliza';
COMMENT ON COLUMN poliza.fecha_renovacion IS 'Fecha programada de renovación';
COMMENT ON COLUMN poliza.esta_activo IS 'Indica si la póliza está activa';
COMMENT ON COLUMN poliza.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN poliza.fecha_actualizacion IS 'Fecha de última actualización del registro';

-- ============================================
-- VERIFICAR LA CREACIÓN
-- ============================================

-- Verificar que la tabla se creó correctamente
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'poliza'
ORDER BY ordinal_position;

-- Verificar índices creados
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'poliza';

-- Verificar constraints
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'poliza'::regclass;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE 'Tabla POLIZA creada exitosamente con todos sus índices, constraints y triggers';
END $$;
