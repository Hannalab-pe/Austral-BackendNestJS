-- Migración para crear las tablas de roles, permisos y vistas
-- Ejecutar después de las migraciones existentes

-- Tabla vista
CREATE TABLE IF NOT EXISTS vista (
    id_vista UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    ruta VARCHAR(255) NOT NULL,
    esta_activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para vista
CREATE INDEX IF NOT EXISTS idx_vista_activa ON vista(esta_activa);
CREATE INDEX IF NOT EXISTS idx_vista_ruta ON vista(ruta);

-- Tabla permiso
CREATE TABLE IF NOT EXISTS permiso (
    id_permiso UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    esta_activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para permiso
CREATE INDEX IF NOT EXISTS idx_permiso_activo ON permiso(esta_activo);

-- Tabla rol_vista (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS rol_vista (
    id_rol UUID NOT NULL,
    id_vista UUID NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_vista),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_vista) REFERENCES vista(id_vista) ON DELETE CASCADE
);

-- Tabla rol_permiso_vista (permisos específicos por rol y vista)
CREATE TABLE IF NOT EXISTS rol_permiso_vista (
    id_rol UUID NOT NULL,
    id_vista UUID NOT NULL,
    id_permiso UUID NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_vista, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_vista) REFERENCES vista(id_vista) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE
);

-- Datos iniciales para vistas
INSERT INTO vista (id_vista, nombre, descripcion, ruta) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dashboard', 'Panel principal del sistema', '/dashboard'),
('550e8400-e29b-41d4-a716-446655440002', 'Leads', 'Gestión de leads y oportunidades', '/leads'),
('550e8400-e29b-41d4-a716-446655440003', 'Usuarios', 'Administración de usuarios', '/usuarios'),
('550e8400-e29b-41d4-a716-446655440004', 'Clientes', 'Gestión de clientes', '/clientes'),
('550e8400-e29b-41d4-a716-446655440005', 'Compañías', 'Administración de compañías de seguros', '/companias'),
('550e8400-e29b-41d4-a716-446655440006', 'Productos', 'Gestión de productos de seguros', '/productos'),
('550e8400-e29b-41d4-a716-446655440007', 'Pólizas', 'Administración de pólizas', '/polizas'),
('550e8400-e29b-41d4-a716-446655440008', 'Siniestros', 'Gestión de siniestros', '/siniestros'),
('550e8400-e29b-41d4-a716-446655440009', 'Reportes', 'Reportes y estadísticas', '/reportes'),
('550e8400-e29b-41d4-a716-446655440010', 'Configuración', 'Configuración del sistema', '/configuracion')
ON CONFLICT (id_vista) DO NOTHING;

-- Datos iniciales para permisos
INSERT INTO permiso (id_permiso, nombre, descripcion) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'crear', 'Permiso para crear registros'),
('660e8400-e29b-41d4-a716-446655440002', 'leer', 'Permiso para leer/ver registros'),
('660e8400-e29b-41d4-a716-446655440003', 'actualizar', 'Permiso para actualizar registros'),
('660e8400-e29b-41d4-a716-446655440004', 'eliminar', 'Permiso para eliminar registros')
ON CONFLICT (id_permiso) DO NOTHING;

-- Datos iniciales para rol administrador (asumiendo que ya existe el rol)
-- Primero verificar si existe el rol administrador
INSERT INTO rol_vista (id_rol, id_vista)
SELECT r.id_rol, v.id_vista
FROM rol r
CROSS JOIN vista v
WHERE r.nombre = 'Administrador'
ON CONFLICT (id_rol, id_vista) DO NOTHING;

-- Asignar todos los permisos al rol administrador para todas las vistas
INSERT INTO rol_permiso_vista (id_rol, id_vista, id_permiso)
SELECT r.id_rol, v.id_vista, p.id_permiso
FROM rol r
CROSS JOIN vista v
CROSS JOIN permiso p
WHERE r.nombre = 'Administrador'
ON CONFLICT (id_rol, id_vista, id_permiso) DO NOTHING;