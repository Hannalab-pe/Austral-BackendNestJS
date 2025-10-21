-- Crear tabla detalle_seguro_salud con ID UUID auto-generado
CREATE TABLE IF NOT EXISTS detalle_seguro_salud (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 120),
    sexo VARCHAR(20) NOT NULL CHECK (sexo IN ('Masculino', 'Femenino', 'Otro')),
    grupo_familiar VARCHAR(100) NOT NULL,
    estado_clinico TEXT NOT NULL,
    zona_trabajo_vivienda VARCHAR(255) NOT NULL,
    preferencia_plan VARCHAR(100) NOT NULL,
    reembolso DECIMAL(10, 2) DEFAULT 0,
    coberturas TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_detalle_seguro_salud_lead
    FOREIGN KEY (lead_id) REFERENCES lead(id_lead) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_salud_lead_id ON detalle_seguro_salud(lead_id);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_salud_fecha_creacion ON detalle_seguro_salud(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_salud_edad ON detalle_seguro_salud(edad);
CREATE INDEX IF NOT EXISTS idx_detalle_seguro_salud_sexo ON detalle_seguro_salud(sexo);

-- Crear trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_salud()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_detalle_seguro_salud
    BEFORE UPDATE ON detalle_seguro_salud
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_salud();

-- Verificar que la tabla se creó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'detalle_seguro_salud'
ORDER BY ordinal_position;