-- Script para crear las tablas relacionadas con POLIZA
-- Base de datos: AUSTRALBDlocal

-- ============================================
-- TABLA: tipo_seguro
-- ============================================

CREATE TABLE IF NOT EXISTS tipo_seguro (
    id_tipo_seguro UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tipo_seguro_activo ON tipo_seguro(esta_activo);
CREATE INDEX IF NOT EXISTS idx_tipo_seguro_nombre ON tipo_seguro(nombre);

COMMENT ON TABLE tipo_seguro IS 'Catálogo de tipos de seguros (VIDA, AUTO, SALUD, SCTR, etc.)';

-- Insertar tipos de seguros básicos
INSERT INTO tipo_seguro (nombre, descripcion) VALUES
    ('VIDA', 'Seguros de vida'),
    ('AUTO', 'Seguros de automóviles'),
    ('SALUD', 'Seguros de salud'),
    ('SCTR', 'Seguro Complementario de Trabajo de Riesgo'),
    ('HOGAR', 'Seguros para el hogar'),
    ('EMPRESARIAL', 'Seguros empresariales')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- TABLA: compania_seguro
-- ============================================

CREATE TABLE IF NOT EXISTS compania_seguro (
    id_compania UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(200) NOT NULL,
    razon_social VARCHAR(300),
    ruc VARCHAR(20) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    contacto_principal VARCHAR(200),
    telefono_contacto VARCHAR(20),
    email_contacto VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_compania_activo ON compania_seguro(esta_activo);
CREATE INDEX IF NOT EXISTS idx_compania_nombre ON compania_seguro(nombre);
CREATE INDEX IF NOT EXISTS idx_compania_ruc ON compania_seguro(ruc);

COMMENT ON TABLE compania_seguro IS 'Compañías aseguradoras';

-- Insertar algunas compañías de ejemplo (Perú)
INSERT INTO compania_seguro (nombre, razon_social) VALUES
    ('Rimac Seguros', 'Rimac Seguros y Reaseguros'),
    ('Pacífico Seguros', 'Pacífico Seguros S.A.'),
    ('La Positiva Seguros', 'La Positiva Seguros y Reaseguros'),
    ('Mapfre Perú', 'MAPFRE PERU COMPAÑIA DE SEGUROS Y REASEGUROS'),
    ('Interseguro', 'Interseguro Compañía de Seguros S.A.')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLA: producto_seguro
-- ============================================

CREATE TABLE IF NOT EXISTS producto_seguro (
    id_producto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    codigo_producto VARCHAR(50),
    prima_base DECIMAL(12, 2),
    prima_minima DECIMAL(12, 2),
    prima_maxima DECIMAL(12, 2),
    porcentaje_comision DECIMAL(5, 2) DEFAULT 0.0,
    cobertura_maxima DECIMAL(15, 2),
    deducible DECIMAL(12, 2),
    edad_minima INTEGER,
    edad_maxima INTEGER,
    condiciones_especiales TEXT,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_compania UUID NOT NULL,
    id_tipo_seguro UUID NOT NULL,

    CONSTRAINT fk_producto_compania FOREIGN KEY (id_compania)
        REFERENCES compania_seguro(id_compania) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_producto_tipo_seguro FOREIGN KEY (id_tipo_seguro)
        REFERENCES tipo_seguro(id_tipo_seguro) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_producto_activo ON producto_seguro(esta_activo);
CREATE INDEX IF NOT EXISTS idx_producto_compania ON producto_seguro(id_compania);
CREATE INDEX IF NOT EXISTS idx_producto_tipo ON producto_seguro(id_tipo_seguro);
CREATE INDEX IF NOT EXISTS idx_producto_nombre ON producto_seguro(nombre);

COMMENT ON TABLE producto_seguro IS 'Productos de seguros ofrecidos por las compañías';

-- ============================================
-- AGREGAR FOREIGN KEYS A LA TABLA POLIZA
-- ============================================

-- Primero eliminamos las constraints si existen (por si se ejecuta múltiples veces)
ALTER TABLE poliza DROP CONSTRAINT IF EXISTS fk_poliza_compania;
ALTER TABLE poliza DROP CONSTRAINT IF EXISTS fk_poliza_producto;
ALTER TABLE poliza DROP CONSTRAINT IF EXISTS fk_poliza_cliente;

-- Agregar foreign key a compania_seguro
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_compania
FOREIGN KEY (id_compania)
REFERENCES compania_seguro(id_compania)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Agregar foreign key a producto_seguro
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_producto
FOREIGN KEY (id_producto)
REFERENCES producto_seguro(id_producto)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Agregar foreign key a cliente (si la tabla existe)
ALTER TABLE poliza
ADD CONSTRAINT fk_poliza_cliente
FOREIGN KEY (id_cliente)
REFERENCES cliente(id_cliente)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar tablas creadas
SELECT 'tipo_seguro' as tabla, COUNT(*) as registros FROM tipo_seguro
UNION ALL
SELECT 'compania_seguro' as tabla, COUNT(*) as registros FROM compania_seguro
UNION ALL
SELECT 'producto_seguro' as tabla, COUNT(*) as registros FROM producto_seguro
UNION ALL
SELECT 'poliza' as tabla, COUNT(*) as registros FROM poliza;

-- Verificar foreign keys de poliza
SELECT
    conname AS constraint_name,
    conrelid::regclass AS tabla,
    confrelid::regclass AS tabla_referenciada,
    pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid = 'poliza'::regclass
    AND contype = 'f'
ORDER BY conname;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✓ Tablas relacionadas creadas exitosamente';
    RAISE NOTICE '✓ Foreign keys agregadas a la tabla poliza';
    RAISE NOTICE '✓ Datos de ejemplo insertados';
END $$;
