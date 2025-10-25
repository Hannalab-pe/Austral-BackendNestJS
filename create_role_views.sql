
-- INSERTANDO RUTAS POR ROL
-- Primero eliminamos las antiguas

delete from vista
select * from vista

-- Script para crear vistas necesarias por rol
-- Ejecutar después de crear los roles por defecto

-- Insertar vistas para Administrador
INSERT INTO vista (nombre, descripcion, ruta, esta_activa, fecha_creacion) VALUES
('Dashboard Administrador - Admin', 'Dashboard principal para Administradores con métricas y resumen', '/admin/dashboard', true, NOW()),
('Gestión de Actividades - Admin', 'Lista y gestión de actividades', '/admin/actividades', true, NOW()),
('Auditoría - Admin', 'Vista de auditoría del sistema', '/admin/auditoria', true, NOW()),
('Gestión de Clientes - Admin', 'Lista y gestión de clientes', '/admin/clientes', true, NOW()),
('Gestión de Compañías - Admin', 'Lista y gestión de compañías aseguradoras', '/admin/companias', true, NOW()),
('Configuración - Admin', 'Configuración del sistema', '/admin/configuracion', true, NOW()),
('Cotizaciones - Admin', 'Vista de cotizaciones', '/admin/cotizaciones', true, NOW()),
('Cotizar - Admin', 'Herramienta para cotizar seguros', '/admin/cotizar', true, NOW()),
('Gestión de Leads - Admin', 'Lista y gestión de leads', '/admin/leads', true, NOW()),
('Notificaciones - Admin', 'Vista de notificaciones', '/admin/notificaciones', true, NOW()),
('Perfil - Admin', 'Perfil del usuario', '/admin/perfil', true, NOW()),
('Gestión de Pólizas - Admin', 'Lista y gestión de pólizas', '/admin/polizas', true, NOW()),
('Reportes - Admin', 'Vista de reportes', '/admin/reportes', true, NOW()),
('Siniestros - Admin', 'Vista de siniestros', '/admin/siniestros', true, NOW()),
('Solicitudes - Admin', 'Vista de solicitudes', '/admin/solicitudes', true, NOW()),
('Gestión de Usuarios - Admin', 'Lista y gestión de usuarios', '/admin/usuarios', true, NOW())
ON CONFLICT (nombre) DO NOTHING;

-- Insertar vistas para Broker
INSERT INTO vista (nombre, descripcion, ruta, esta_activa, fecha_creacion) VALUES
('Dashboard Broker - Broker', 'Dashboard principal para Brokers con métricas y resumen', '/brokers/dashboard', true, NOW()),
('Gestión de Actividades - Broker', 'Lista y gestión de actividades', '/brokers/actividades', true, NOW()),
('Gestión de Clientes - Broker', 'Lista y gestión de clientes', '/brokers/clientes', true, NOW()),
('Notificaciones - Broker', 'Vista de notificaciones', '/brokers/notificaciones', true, NOW()),
('Perfil - Broker', 'Perfil del usuario', '/brokers/perfil', true, NOW()),
('Solicitudes - Broker', 'Vista de solicitudes', '/brokers/solicitudes', true, NOW()),
('Gestión de Vendedores - Broker', 'Lista y gestión de vendedores asignados al Broker', '/brokers/vendedores', true, NOW())
ON CONFLICT (nombre) DO NOTHING;

-- Insertar vistas para Vendedor
INSERT INTO vista (nombre, descripcion, ruta, esta_activa, fecha_creacion) VALUES
('Gestión de Actividades - Vendedor', 'Lista y gestión de actividades', '/vendedor/actividades', true, NOW()),
('Gestión de Clientes - Vendedor', 'Lista y gestión de clientes', '/vendedor/clientes', true, NOW()),
('Notificaciones - Vendedor', 'Vista de notificaciones', '/vendedor/notificaciones', true, NOW()),
('Perfil - Vendedor', 'Perfil del usuario', '/vendedor/perfil', true, NOW()),
('Gestión de Pólizas - Vendedor', 'Lista y gestión de pólizas', '/vendedor/polizas', true, NOW())
ON CONFLICT (nombre) DO NOTHING;

select * from vista

-- Obtener IDs de las vistas y roles
-- Asignar permisos de acceso a las vistas para cada rol
-- (Esto se haría después de ejecutar el script anterior)

-- Primero obtener el ID del rol correspondiente
-- Luego obtener los IDs de las vistas
-- Finalmente insertar en rol_permiso_vista con el permiso de 'acceso'