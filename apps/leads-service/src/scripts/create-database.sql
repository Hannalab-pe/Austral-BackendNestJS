-- ============================================
-- SCRIPT COMPLETO DE CREACIÓN DE BASE DE DATOS
-- Leads Service - Austral CRM
-- ============================================

-- Habilitar la extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLA: estado_lead
-- ============================================
DROP TABLE IF EXISTS estado_lead CASCADE;

CREATE TABLE estado_lead (
    id_estado UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    orden_proceso INTEGER DEFAULT 1,
    es_estado_final BOOLEAN DEFAULT false,
    esta_activo BOOLEAN DEFAULT true
);

-- Índice para estado_lead
CREATE INDEX idx_estado_lead_nombre ON estado_lead(nombre);

-- Insertar estados iniciales
INSERT INTO estado_lead (nombre, descripcion, color_hex, orden_proceso, es_estado_final) VALUES
('Nuevo', 'Lead recién ingresado al sistema', '#3B82F6', 1, false),
('Contactado', 'Primer contacto realizado con el lead', '#10B981', 2, false),
('Calificado', 'Lead evaluado y calificado como potencial cliente', '#F59E0B', 3, false),
('Propuesta Enviada', 'Propuesta de seguro enviada al lead', '#8B5CF6', 4, false),
('Negociación', 'En proceso de negociación de términos', '#EC4899', 5, false),
('Ganado', 'Lead convertido en cliente', '#059669', 6, true),
('Perdido', 'Lead no convertido', '#DC2626', 7, true),
('En Seguimiento', 'Lead requiere seguimiento posterior', '#6366F1', 8, false);

COMMENT ON TABLE estado_lead IS 'Estados del proceso de conversión de leads';

-- ============================================
-- 2. TABLA: fuente_lead
-- ============================================
DROP TABLE IF EXISTS fuente_lead CASCADE;

CREATE TABLE fuente_lead (
    id_fuente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar fuentes iniciales
INSERT INTO fuente_lead (nombre, descripcion, tipo) VALUES
('Sitio Web', 'Formulario de contacto del sitio web corporativo', 'Digital'),
('Facebook Ads', 'Campaña publicitaria en Facebook', 'Digital'),
('Google Ads', 'Campaña publicitaria en Google', 'Digital'),
('LinkedIn', 'Contacto a través de LinkedIn', 'Digital'),
('Instagram', 'Mensajes directos o formularios de Instagram', 'Digital'),
('Referido', 'Recomendación de cliente existente', 'Referido'),
('Llamada Entrante', 'Llamada telefónica directa', 'Telefónico'),
('Email', 'Correo electrónico directo', 'Email'),
('Evento', 'Feria, exposición o evento presencial', 'Presencial'),
('WhatsApp', 'Contacto vía WhatsApp Business', 'Digital'),
('Chat en Vivo', 'Chat del sitio web', 'Digital'),
('Base de Datos Comprada', 'Lead proveniente de base de datos adquirida', 'Comprado');

COMMENT ON TABLE fuente_lead IS 'Fuentes de origen de los leads';

-- ============================================
-- 3. TABLA: lead
-- ============================================
DROP TABLE IF EXISTS lead CASCADE;

CREATE TABLE lead (
    id_lead UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE,
    tipo_seguro_interes VARCHAR(100),
    presupuesto_aproximado DECIMAL(10, 2),
    notas TEXT,
    puntaje_calificacion INTEGER DEFAULT 0 CHECK (puntaje_calificacion >= 0 AND puntaje_calificacion <= 100),
    prioridad VARCHAR(20) DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'URGENTE')),
    fecha_primer_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_contacto TIMESTAMP,
    proxima_fecha_seguimiento TIMESTAMP,
    id_estado UUID NOT NULL,
    id_fuente UUID NOT NULL,
    asignado_a_usuario UUID,
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Claves foráneas
    CONSTRAINT fk_lead_estado FOREIGN KEY (id_estado) REFERENCES estado_lead(id_estado) ON DELETE RESTRICT,
    CONSTRAINT fk_lead_fuente FOREIGN KEY (id_fuente) REFERENCES fuente_lead(id_fuente) ON DELETE RESTRICT
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_lead_activo ON lead(esta_activo);
CREATE INDEX idx_lead_asignado ON lead(asignado_a_usuario);
CREATE INDEX idx_lead_cumpleanos ON lead(fecha_nacimiento);
CREATE INDEX idx_lead_estado ON lead(id_estado);
CREATE INDEX idx_lead_seguimiento ON lead(proxima_fecha_seguimiento);
CREATE INDEX idx_lead_telefono ON lead(telefono);
CREATE INDEX idx_lead_email ON lead(email);
CREATE INDEX idx_lead_fecha_creacion ON lead(fecha_creacion DESC);

COMMENT ON TABLE lead IS 'Leads del sistema de CRM para seguros';
COMMENT ON COLUMN lead.puntaje_calificacion IS 'Puntaje de calificación del lead (0-100)';
COMMENT ON COLUMN lead.prioridad IS 'Prioridad del lead: BAJA, MEDIA, ALTA, URGENTE';

-- ============================================
-- 4. TABLA: detalle_seguro_auto
-- ============================================
DROP TABLE IF EXISTS detalle_seguro_auto CASCADE;

CREATE TABLE detalle_seguro_auto (
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_detalle_auto_lead FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE
);

CREATE INDEX idx_detalle_auto_lead ON detalle_seguro_auto(id_lead);
CREATE INDEX idx_detalle_auto_marca_modelo ON detalle_seguro_auto(marca, modelo);

COMMENT ON TABLE detalle_seguro_auto IS 'Información detallada de seguros vehiculares';

-- ============================================
-- 5. TABLA: detalle_seguro_salud
-- ============================================
DROP TABLE IF EXISTS detalle_seguro_salud CASCADE;

CREATE TABLE detalle_seguro_salud (
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_detalle_salud_lead FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE
);

CREATE INDEX idx_detalle_salud_lead ON detalle_seguro_salud(id_lead);
CREATE INDEX idx_detalle_salud_tipo_plan ON detalle_seguro_salud(tipo_plan);

COMMENT ON TABLE detalle_seguro_salud IS 'Información detallada de seguros de salud';

-- ============================================
-- 6. TABLA: detalle_seguro_sctr
-- ============================================
DROP TABLE IF EXISTS detalle_seguro_sctr CASCADE;

CREATE TABLE detalle_seguro_sctr (
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_detalle_sctr_lead FOREIGN KEY (id_lead) REFERENCES lead(id_lead) ON DELETE CASCADE
);

CREATE INDEX idx_detalle_sctr_lead ON detalle_seguro_sctr(id_lead);
CREATE INDEX idx_detalle_sctr_actividad ON detalle_seguro_sctr(codigo_actividad);

COMMENT ON TABLE detalle_seguro_sctr IS 'Información detallada de seguros SCTR (Seguro Complementario de Trabajo de Riesgo)';
COMMENT ON COLUMN detalle_seguro_sctr.sueldo_minimo IS 'Sueldo mínimo debe ser al menos S/ 1,025 (SMV 2024 Perú)';

-- ============================================
-- 7. VISTAS ÚTILES
-- ============================================

-- Vista de leads con información completa
CREATE OR REPLACE VIEW v_leads_completo AS
SELECT
    l.id_lead,
    l.nombre,
    l.apellido,
    l.email,
    l.telefono,
    l.fecha_nacimiento,
    l.tipo_seguro_interes,
    l.presupuesto_aproximado,
    l.puntaje_calificacion,
    l.prioridad,
    l.fecha_primer_contacto,
    l.fecha_ultimo_contacto,
    l.proxima_fecha_seguimiento,
    l.esta_activo,
    l.fecha_creacion,
    e.nombre as estado_nombre,
    e.color_hex as estado_color,
    e.orden_proceso as estado_orden,
    f.nombre as fuente_nombre,
    f.tipo as fuente_tipo
FROM lead l
LEFT JOIN estado_lead e ON l.id_estado = e.id_estado
LEFT JOIN fuente_lead f ON l.id_fuente = f.id_fuente
WHERE l.esta_activo = true;

-- Vista de estadísticas de leads por estado
CREATE OR REPLACE VIEW v_estadisticas_leads_por_estado AS
SELECT
    e.nombre as estado,
    e.color_hex,
    COUNT(l.id_lead) as total_leads,
    COUNT(CASE WHEN l.fecha_creacion > CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as leads_ultimos_7_dias,
    COUNT(CASE WHEN l.fecha_creacion > CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as leads_ultimo_mes,
    AVG(l.puntaje_calificacion) as puntaje_promedio
FROM estado_lead e
LEFT JOIN lead l ON e.id_estado = l.id_estado AND l.esta_activo = true
GROUP BY e.id_estado, e.nombre, e.color_hex, e.orden_proceso
ORDER BY e.orden_proceso;

-- Vista de estadísticas de leads por fuente
CREATE OR REPLACE VIEW v_estadisticas_leads_por_fuente AS
SELECT
    f.nombre as fuente,
    f.tipo as tipo_fuente,
    COUNT(l.id_lead) as total_leads,
    COUNT(CASE WHEN l.fecha_creacion > CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as leads_ultimo_mes,
    AVG(l.puntaje_calificacion) as puntaje_promedio,
    COUNT(CASE WHEN e.es_estado_final = true AND e.nombre = 'Ganado' THEN 1 END) as leads_ganados,
    ROUND(
        CAST(COUNT(CASE WHEN e.es_estado_final = true AND e.nombre = 'Ganado' THEN 1 END) AS DECIMAL) /
        NULLIF(COUNT(l.id_lead), 0) * 100,
        2
    ) as tasa_conversion
FROM fuente_lead f
LEFT JOIN lead l ON f.id_fuente = l.id_fuente AND l.esta_activo = true
LEFT JOIN estado_lead e ON l.id_estado = e.id_estado
GROUP BY f.id_fuente, f.nombre, f.tipo
ORDER BY total_leads DESC;

-- ============================================
-- 8. FUNCIONES ÚTILES
-- ============================================

-- Función para calcular la edad de un lead
CREATE OR REPLACE FUNCTION calcular_edad(fecha_nac DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(fecha_nac));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para obtener leads que requieren seguimiento hoy
CREATE OR REPLACE FUNCTION obtener_leads_seguimiento_hoy()
RETURNS TABLE (
    id_lead UUID,
    nombre VARCHAR,
    apellido VARCHAR,
    telefono VARCHAR,
    email VARCHAR,
    estado VARCHAR,
    proxima_fecha_seguimiento TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id_lead,
        l.nombre,
        l.apellido,
        l.telefono,
        l.email,
        e.nombre as estado,
        l.proxima_fecha_seguimiento
    FROM lead l
    JOIN estado_lead e ON l.id_estado = e.id_estado
    WHERE l.esta_activo = true
      AND l.proxima_fecha_seguimiento::date = CURRENT_DATE
    ORDER BY l.proxima_fecha_seguimiento;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Trigger para actualizar fecha_ultimo_contacto automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_ultimo_contacto()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_estado != OLD.id_estado THEN
        NEW.fecha_ultimo_contacto = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha_ultimo_contacto
BEFORE UPDATE ON lead
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_ultimo_contacto();

-- ============================================
-- 10. PERMISOS Y SEGURIDAD
-- ============================================

-- Crear rol para la aplicación (opcional)
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'leads_app') THEN
--         CREATE ROLE leads_app WITH LOGIN PASSWORD 'change_this_password';
--     END IF;
-- END
-- $$;

-- Otorgar permisos
-- GRANT CONNECT ON DATABASE railway TO leads_app;
-- GRANT USAGE ON SCHEMA public TO leads_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO leads_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO leads_app;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todas las tablas se crearon
SELECT
    tablename,
    schemaname
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('estado_lead', 'fuente_lead', 'lead', 'detalle_seguro_auto', 'detalle_seguro_salud', 'detalle_seguro_sctr')
ORDER BY tablename;

-- Verificar índices
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('lead', 'estado_lead', 'fuente_lead')
ORDER BY tablename, indexname;

-- Verificar datos iniciales
SELECT 'Estados insertados: ' || COUNT(*) FROM estado_lead;
SELECT 'Fuentes insertadas: ' || COUNT(*) FROM fuente_lead;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

SELECT 'Base de datos creada exitosamente!' AS resultado;
