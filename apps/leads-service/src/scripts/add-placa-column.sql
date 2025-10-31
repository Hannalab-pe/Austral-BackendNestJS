-- ============================================
-- AGREGAR COLUMNA PLACA A DETALLE_SEGURO_AUTO
-- ============================================

-- Agregar columna placa
ALTER TABLE detalle_seguro_auto
ADD COLUMN IF NOT EXISTS placa VARCHAR(20);

-- Crear índice para búsquedas por placa
CREATE INDEX IF NOT EXISTS idx_detalle_auto_placa ON detalle_seguro_auto(placa);

-- Comentario de la columna
COMMENT ON COLUMN detalle_seguro_auto.placa IS 'Placa o matrícula del vehículo';

-- Verificar que la columna se agregó
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'detalle_seguro_auto'
AND column_name = 'placa';
