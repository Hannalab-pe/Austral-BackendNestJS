-- Migración para cambiar el ID de detalle_seguro_auto de INTEGER a UUID
-- Ejecutar estos comandos en orden en PostgreSQL

-- 1. Crear una nueva columna temporal con UUID
ALTER TABLE detalle_seguro_auto ADD COLUMN id_new UUID DEFAULT gen_random_uuid();

-- 2. Generar UUIDs únicos para los registros existentes
UPDATE detalle_seguro_auto SET id_new = gen_random_uuid() WHERE id_new IS NULL;

-- 3. Hacer que la nueva columna no permita NULL
ALTER TABLE detalle_seguro_auto ALTER COLUMN id_new SET NOT NULL;

-- 4. Crear un índice único en la nueva columna
CREATE UNIQUE INDEX idx_detalle_seguro_auto_id_new ON detalle_seguro_auto(id_new);

-- 5. Eliminar la columna antigua
ALTER TABLE detalle_seguro_auto DROP COLUMN id;

-- 6. Renombrar la nueva columna
ALTER TABLE detalle_seguro_auto RENAME COLUMN id_new TO id;

-- 7. Hacer que la columna sea la primary key
ALTER TABLE detalle_seguro_auto ADD CONSTRAINT pk_detalle_seguro_auto PRIMARY KEY (id);

-- 8. Configurar el default para futuros inserts
ALTER TABLE detalle_seguro_auto ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verificar que todo esté correcto
SELECT id, lead_id, marca_auto FROM detalle_seguro_auto LIMIT 5;