-- Cambiar el tipo de dato de la columna reembolso de DECIMAL a VARCHAR
ALTER TABLE detalle_seguro_salud ALTER COLUMN reembolso TYPE VARCHAR(255);

-- Si quieres que sea TEXT en lugar de VARCHAR:
-- ALTER TABLE detalle_seguro_salud ALTER COLUMN reembolso TYPE TEXT;

-- Verificar el cambio
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'detalle_seguro_salud' AND column_name = 'reembolso';