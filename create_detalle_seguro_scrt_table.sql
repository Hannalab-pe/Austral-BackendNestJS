-- Crear tabla detalle_seguro_scrt con ID UUID auto-generado
CREATE TABLE IF NOT EXISTS detalle_seguro_scrt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    ruc VARCHAR(20) NOT NULL,
    numero_trabajadores INTEGER NOT NULL CHECK (numero_trabajadores > 0),
    monto_planilla DECIMAL(15, 2) NOT NULL CHECK (monto_planilla >= 0),
    actividad_negocio VARCHAR(255) NOT NULL,
    tipo_seguro VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_detalle_seguro_scrt_lead
    FOREIGN KEY (lead_id) REFERENCES lead(id_lead) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_scrt_lead_id ON detalle_seguro_scrt(lead_id);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_scrt_fecha_creacion ON detalle_seguro_scrt(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_scrt_ruc ON detalle_seguro_scrt(ruc);

-- Crear trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_scrt()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_detalle_seguro_scrt
    BEFORE UPDATE ON detalle_seguro_scrt
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_scrt();

-- Verificar que la tabla se creó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'detalle_seguro_scrt'
ORDER BY ordinal_position;