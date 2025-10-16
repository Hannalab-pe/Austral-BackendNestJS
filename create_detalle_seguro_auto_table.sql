-- Crear tabla detalle_seguro_auto con ID UUID auto-generado
CREATE TABLE IF NOT EXISTS detalle_seguro_auto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    marca_auto VARCHAR(100) NOT NULL,
    ano_auto INTEGER NOT NULL CHECK (ano_auto >= 1900 AND ano_auto <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    modelo_auto VARCHAR(100) NOT NULL,
    placa_auto VARCHAR(20) NOT NULL,
    tipo_uso VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_detalle_seguro_auto_lead
    FOREIGN KEY (lead_id) REFERENCES lead(id_lead) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_auto_lead_id ON detalle_seguro_auto(lead_id);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_auto_fecha_creacion ON detalle_seguro_auto(fecha_creacion);

-- Crear trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_detalle_seguro_auto
    BEFORE UPDATE ON detalle_seguro_auto
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- Verificar que la tabla se creó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'detalle_seguro_auto'
ORDER BY ordinal_position;