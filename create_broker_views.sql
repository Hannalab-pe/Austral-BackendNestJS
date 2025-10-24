-- Script para crear vistas necesarias para Brokers
-- Ejecutar después de crear los roles por defecto

-- Insertar vistas para Brokers
INSERT INTO vista (nombre, descripcion, ruta, esta_activa, fecha_creacion) VALUES
('Dashboard Broker', 'Dashboard principal para Brokers con métricas y resumen', '/brokers', true, NOW()),
('Gestión de Vendedores', 'Lista y gestión de vendedores asignados al Broker', '/brokers/vendedores', true, NOW()),
('Crear Vendedor', 'Formulario para crear nuevos vendedores', '/brokers/vendedores/nuevo', true, NOW())
ON CONFLICT (nombre) DO NOTHING;

-- Obtener IDs de las vistas y rol Broker
-- Asignar permisos de acceso a las vistas para el rol Broker
-- (Esto se haría después de ejecutar el script anterior)

-- Primero obtener el ID del rol Broker
-- Luego obtener los IDs de las vistas
-- Finalmente insertar en rol_permiso_vista con el permiso de 'acceso'