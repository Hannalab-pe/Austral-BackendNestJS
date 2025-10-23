-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;
-- public.asociado definition

-- Drop table

-- DROP TABLE asociado;

CREATE TABLE asociado (
	id_asociado uuid DEFAULT gen_random_uuid() NOT NULL,
	razon_social varchar(300) NOT NULL,
	nombre_comercial varchar(200) NOT NULL,
	ruc varchar(20) NULL,
	documento_representante varchar(20) NULL,
	nombre_representante varchar(200) NULL,
	email varchar(255) NOT NULL,
	telefono varchar(20) NULL,
	direccion text NULL,
	porcentaje_comision_base numeric(5, 2) DEFAULT 0.00 NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_registro timestamp DEFAULT now() NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT asociado_pkey PRIMARY KEY (id_asociado),
	CONSTRAINT asociado_ruc_key UNIQUE (ruc)
);
CREATE INDEX idx_asociado_activo ON public.asociado USING btree (esta_activo);


-- public.compania_seguro definition

-- Drop table

-- DROP TABLE compania_seguro;

CREATE TABLE compania_seguro (
	id_compania uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(200) NOT NULL,
	razon_social varchar(300) NULL,
	ruc varchar(20) NULL,
	direccion text NULL,
	telefono varchar(20) NULL,
	email varchar(255) NULL,
	sitio_web varchar(255) NULL,
	contacto_principal varchar(200) NULL,
	telefono_contacto varchar(20) NULL,
	email_contacto varchar(255) NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT compania_seguro_pkey PRIMARY KEY (id_compania),
	CONSTRAINT compania_seguro_ruc_key UNIQUE (ruc)
);


-- public.estado_lead definition

-- Drop table

-- DROP TABLE estado_lead;

CREATE TABLE estado_lead (
	id_estado uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	color_hex varchar(7) DEFAULT '#3B82F6'::character varying NOT NULL,
	orden_proceso int4 DEFAULT 1 NOT NULL,
	es_estado_final bool DEFAULT false NOT NULL,
	esta_activo bool DEFAULT true NOT NULL,
	CONSTRAINT estado_lead_nombre_key UNIQUE (nombre),
	CONSTRAINT estado_lead_pkey PRIMARY KEY (id_estado)
);
CREATE INDEX idx_estado_lead_nombre ON public.estado_lead USING btree (nombre);


-- public.estado_poliza definition

-- Drop table

-- DROP TABLE estado_poliza;

CREATE TABLE estado_poliza (
	id_estado_poliza uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	color_hex varchar(7) DEFAULT '#3B82F6'::character varying NULL,
	permite_pagos bool DEFAULT true NULL,
	permite_siniestros bool DEFAULT true NULL,
	esta_activo bool DEFAULT true NOT NULL,
	CONSTRAINT estado_poliza_nombre_key UNIQUE (nombre),
	CONSTRAINT estado_poliza_pkey PRIMARY KEY (id_estado_poliza)
);


-- public.fuente_lead definition

-- Drop table

-- DROP TABLE fuente_lead;

CREATE TABLE fuente_lead (
	id_fuente uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	tipo varchar(50) NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT fuente_lead_pkey PRIMARY KEY (id_fuente)
);


-- public.permiso definition

-- Drop table

-- DROP TABLE permiso;

CREATE TABLE permiso (
	id_permiso uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	esta_activo bool DEFAULT true NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT permiso_nombre_key UNIQUE (nombre),
	CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso)
);
CREATE INDEX idx_permiso_activo ON public.permiso USING btree (esta_activo);


-- public.rol definition

-- Drop table

-- DROP TABLE rol;

CREATE TABLE rol (
	id_rol uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	nivel_acceso int4 DEFAULT 1 NOT NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT rol_nombre_key UNIQUE (nombre),
	CONSTRAINT rol_pkey PRIMARY KEY (id_rol)
);


-- public.tipo_seguro definition

-- Drop table

-- DROP TABLE tipo_seguro;

CREATE TABLE tipo_seguro (
	id_tipo_seguro uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(150) NOT NULL,
	descripcion text NULL,
	categoria varchar(100) NULL,
	requiere_inspeccion bool DEFAULT false NULL,
	duracion_minima_meses int4 DEFAULT 12 NULL,
	duracion_maxima_meses int4 DEFAULT 60 NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT tipo_seguro_pkey PRIMARY KEY (id_tipo_seguro)
);


-- public.tipo_siniestro definition

-- Drop table

-- DROP TABLE tipo_siniestro;

CREATE TABLE tipo_siniestro (
	id_tipo_siniestro uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(150) NOT NULL,
	descripcion text NULL,
	requiere_policia bool DEFAULT false NULL,
	requiere_peritaje bool DEFAULT false NULL,
	tiempo_maximo_reporte_dias int4 DEFAULT 30 NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT tipo_siniestro_pkey PRIMARY KEY (id_tipo_siniestro)
);


-- public.vista definition

-- Drop table

-- DROP TABLE vista;

CREATE TABLE vista (
	id_vista uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion text NULL,
	ruta varchar(255) NOT NULL,
	esta_activa bool DEFAULT true NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT vista_nombre_key UNIQUE (nombre),
	CONSTRAINT vista_pkey PRIMARY KEY (id_vista)
);
CREATE INDEX idx_vista_activa ON public.vista USING btree (esta_activa);
CREATE INDEX idx_vista_ruta ON public.vista USING btree (ruta);


-- public."lead" definition

-- Drop table

-- DROP TABLE "lead";

CREATE TABLE "lead" (
	id_lead uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido varchar(100) NULL,
	email varchar(255) NULL,
	telefono varchar(20) NOT NULL,
	fecha_nacimiento date NULL,
	tipo_seguro_interes varchar(100) NULL,
	presupuesto_aproximado numeric(10, 2) NULL,
	notas text NULL,
	puntaje_calificacion int4 DEFAULT 0 NOT NULL,
	prioridad varchar(20) DEFAULT 'MEDIA'::character varying NOT NULL,
	fecha_primer_contacto timestamp DEFAULT now() NOT NULL,
	fecha_ultimo_contacto timestamp NULL,
	proxima_fecha_seguimiento timestamp NULL,
	id_estado uuid NOT NULL,
	id_fuente uuid NOT NULL,
	asignado_a_usuario uuid NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT lead_pkey PRIMARY KEY (id_lead),
	CONSTRAINT "FK_918e7e7085326b1c68d8ace0342" FOREIGN KEY (id_fuente) REFERENCES fuente_lead(id_fuente),
	CONSTRAINT "FK_c566d983b39103569aa205f1269" FOREIGN KEY (id_estado) REFERENCES estado_lead(id_estado)
);
CREATE INDEX idx_lead_activo ON public.lead USING btree (esta_activo);
CREATE INDEX idx_lead_asignado ON public.lead USING btree (asignado_a_usuario);
CREATE INDEX idx_lead_cumpleanos ON public.lead USING btree (EXTRACT(month FROM fecha_nacimiento), EXTRACT(day FROM fecha_nacimiento));
CREATE INDEX idx_lead_estado ON public.lead USING btree (id_estado);
CREATE INDEX idx_lead_seguimiento ON public.lead USING btree (proxima_fecha_seguimiento);
CREATE INDEX idx_lead_telefono ON public.lead USING btree (telefono);


-- public.producto_seguro definition

-- Drop table

-- DROP TABLE producto_seguro;

CREATE TABLE producto_seguro (
	id_producto uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(200) NOT NULL,
	descripcion text NULL,
	codigo_producto varchar(50) NULL,
	prima_base numeric(12, 2) NULL,
	prima_minima numeric(12, 2) NULL,
	prima_maxima numeric(12, 2) NULL,
	porcentaje_comision numeric(5, 2) DEFAULT 0.00 NULL,
	cobertura_maxima numeric(15, 2) NULL,
	deducible numeric(12, 2) NULL,
	edad_minima int4 NULL,
	edad_maxima int4 NULL,
	condiciones_especiales text NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_compania uuid NOT NULL,
	id_tipo_seguro uuid NOT NULL,
	CONSTRAINT producto_seguro_pkey PRIMARY KEY (id_producto),
	CONSTRAINT producto_seguro_id_compania_fkey FOREIGN KEY (id_compania) REFERENCES compania_seguro(id_compania),
	CONSTRAINT producto_seguro_id_tipo_seguro_fkey FOREIGN KEY (id_tipo_seguro) REFERENCES tipo_seguro(id_tipo_seguro)
);


-- public.rol_permiso_vista definition

-- Drop table

-- DROP TABLE rol_permiso_vista;

CREATE TABLE rol_permiso_vista (
	id_rol uuid NOT NULL,
	id_vista uuid NOT NULL,
	id_permiso uuid NOT NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT rol_permiso_vista_pkey PRIMARY KEY (id_rol, id_vista, id_permiso),
	CONSTRAINT rol_permiso_vista_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE,
	CONSTRAINT rol_permiso_vista_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
	CONSTRAINT rol_permiso_vista_id_vista_fkey FOREIGN KEY (id_vista) REFERENCES vista(id_vista) ON DELETE CASCADE
);


-- public.rol_vista definition

-- Drop table

-- DROP TABLE rol_vista;

CREATE TABLE rol_vista (
	id_rol uuid NOT NULL,
	id_vista uuid NOT NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT rol_vista_pkey PRIMARY KEY (id_rol, id_vista),
	CONSTRAINT rol_vista_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
	CONSTRAINT rol_vista_id_vista_fkey FOREIGN KEY (id_vista) REFERENCES vista(id_vista) ON DELETE CASCADE
);


-- public.usuario definition

-- Drop table

-- DROP TABLE usuario;

CREATE TABLE usuario (
	id_usuario uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre_usuario varchar(50) NOT NULL,
	email varchar(255) NOT NULL,
	contrasena varchar(255) NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido varchar(100) NOT NULL,
	telefono varchar(20) NULL,
	documento_identidad varchar(20) NULL,
	id_asociado uuid NULL,
	supervisor_id uuid NULL,
	esta_activo bool DEFAULT true NOT NULL,
	ultimo_acceso timestamp NULL,
	intentos_fallidos int4 DEFAULT 0 NULL,
	cuenta_bloqueada bool DEFAULT false NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_rol uuid NOT NULL,
	CONSTRAINT usuario_email_key UNIQUE (email),
	CONSTRAINT usuario_nombre_usuario_key UNIQUE (nombre_usuario),
	CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario),
	CONSTRAINT usuario_id_asociado_fkey FOREIGN KEY (id_asociado) REFERENCES asociado(id_asociado),
	CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
	CONSTRAINT usuario_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_usuario_activo ON public.usuario USING btree (esta_activo);
CREATE INDEX idx_usuario_asociado ON public.usuario USING btree (id_asociado);
CREATE INDEX idx_usuario_email ON public.usuario USING btree (email);
CREATE INDEX idx_usuario_supervisor ON public.usuario USING btree (supervisor_id);


-- public.auditoria definition

-- Drop table

-- DROP TABLE auditoria;

CREATE TABLE auditoria (
	id_auditoria uuid DEFAULT gen_random_uuid() NOT NULL,
	tabla varchar(100) NOT NULL,
	id_registro uuid NOT NULL,
	accion varchar(20) NOT NULL,
	id_usuario uuid NULL,
	ip_address varchar(50) NULL,
	fecha_accion timestamp DEFAULT now() NULL,
	CONSTRAINT auditoria_pkey PRIMARY KEY (id_auditoria),
	CONSTRAINT auditoria_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_auditoria_fecha ON public.auditoria USING btree (fecha_accion);
CREATE INDEX idx_auditoria_tabla_registro ON public.auditoria USING btree (tabla, id_registro);


-- public.cliente definition

-- Drop table

-- DROP TABLE cliente;

CREATE TABLE cliente (
	id_cliente uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido varchar(100) NOT NULL,
	email varchar(255) NOT NULL,
	telefono varchar(20) NOT NULL,
	telefono_secundario varchar(20) NULL,
	documento_identidad varchar(20) NOT NULL,
	tipo_documento varchar(10) NOT NULL,
	fecha_nacimiento date NOT NULL,
	direccion text NOT NULL,
	distrito varchar(100) NULL,
	provincia varchar(100) NULL,
	departamento varchar(100) NULL,
	ocupacion varchar(150) NULL,
	empresa varchar(200) NULL,
	estado_civil varchar(20) NULL,
	contacto_emergencia_nombre varchar(200) NULL,
	contacto_emergencia_telefono varchar(20) NULL,
	contacto_emergencia_relacion varchar(50) NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_registro timestamp DEFAULT now() NULL,
	id_lead uuid NULL,
	broker_asignado uuid NULL,
	CONSTRAINT cliente_documento_identidad_key UNIQUE (documento_identidad),
	CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente),
	CONSTRAINT cliente_broker_asignado_fkey FOREIGN KEY (broker_asignado) REFERENCES usuario(id_usuario),
	CONSTRAINT cliente_id_lead_fkey FOREIGN KEY (id_lead) REFERENCES "lead"(id_lead)
);
CREATE INDEX idx_cliente_activo ON public.cliente USING btree (esta_activo);
CREATE INDEX idx_cliente_broker ON public.cliente USING btree (broker_asignado);
CREATE INDEX idx_cliente_cumpleanos ON public.cliente USING btree (EXTRACT(month FROM fecha_nacimiento), EXTRACT(day FROM fecha_nacimiento));
CREATE INDEX idx_cliente_documento ON public.cliente USING btree (documento_identidad);
CREATE INDEX idx_cliente_email ON public.cliente USING btree (email);


-- public.detalle_seguro_auto definition

-- Drop table

-- DROP TABLE detalle_seguro_auto;

CREATE TABLE detalle_seguro_auto (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	lead_id uuid NOT NULL,
	marca_auto varchar(100) NOT NULL,
	ano_auto int4 NOT NULL,
	modelo_auto varchar(100) NOT NULL,
	placa_auto varchar(20) NOT NULL,
	tipo_uso varchar(50) NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	fecha_actualizacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "CHK_428a7f63093a3a6f54faed7c81" CHECK (((ano_auto >= 1900) AND ((ano_auto)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric)))),
	CONSTRAINT detalle_seguro_auto_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_fc32ba8d3d4ca783efd13c63bbd" FOREIGN KEY (lead_id) REFERENCES "lead"(id_lead) ON DELETE CASCADE
);


-- public.detalle_seguro_salud definition

-- Drop table

-- DROP TABLE detalle_seguro_salud;

CREATE TABLE detalle_seguro_salud (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	lead_id uuid NOT NULL,
	edad int4 NOT NULL,
	sexo varchar(20) NOT NULL,
	grupo_familiar varchar(100) NOT NULL,
	estado_clinico text NOT NULL,
	zona_trabajo_vivienda varchar(255) NOT NULL,
	preferencia_plan varchar(100) NOT NULL,
	coberturas text NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	fecha_actualizacion timestamp DEFAULT now() NOT NULL,
	reembolso varchar(255) DEFAULT ''::character varying NOT NULL,
	CONSTRAINT detalle_seguro_salud_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_1b90bfbb90b5613bdeb1dd2f388" FOREIGN KEY (lead_id) REFERENCES "lead"(id_lead)
);

-- Table Triggers

create trigger trigger_update_detalle_seguro_salud before
update
    on
    public.detalle_seguro_salud for each row execute function update_fecha_actualizacion_salud();


-- public.detalle_seguro_scrt definition

-- Drop table

-- DROP TABLE detalle_seguro_scrt;

CREATE TABLE detalle_seguro_scrt (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	lead_id uuid NOT NULL,
	razon_social varchar(255) NOT NULL,
	ruc varchar(20) NOT NULL,
	numero_trabajadores int4 NOT NULL,
	monto_planilla numeric(15, 2) NOT NULL,
	actividad_negocio varchar(255) NOT NULL,
	tipo_seguro varchar(100) NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	fecha_actualizacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PK_0bfda779791e83a4cc967d41851" PRIMARY KEY (id),
	CONSTRAINT "FK_fb8d4f17e812f445656ffb138f2" FOREIGN KEY (lead_id) REFERENCES "lead"(id_lead)
);

-- Table Triggers

create trigger trigger_update_detalle_seguro_scrt before
update
    on
    public.detalle_seguro_scrt for each row execute function update_fecha_actualizacion_scrt();


-- public.detalle_seguro_sctr definition

-- Drop table

-- DROP TABLE detalle_seguro_sctr;

CREATE TABLE detalle_seguro_sctr (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	lead_id uuid NOT NULL,
	razon_social varchar(255) NOT NULL,
	ruc varchar(20) NOT NULL,
	numero_trabajadores int4 NOT NULL,
	monto_planilla numeric(15, 2) NOT NULL,
	actividad_negocio varchar(255) NOT NULL,
	tipo_seguro varchar(100) NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	fecha_actualizacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PK_ac684c9ad640b8c3446e88109cb" PRIMARY KEY (id),
	CONSTRAINT "FK_b0919f30c54bd60e4f3069a3c76" FOREIGN KEY (lead_id) REFERENCES "lead"(id_lead)
);


-- public.notificacion definition

-- Drop table

-- DROP TABLE notificacion;

CREATE TABLE notificacion (
	id_notificacion uuid DEFAULT gen_random_uuid() NOT NULL,
	tipo varchar(50) NOT NULL,
	titulo varchar(200) NOT NULL,
	mensaje text NOT NULL,
	prioridad varchar(20) DEFAULT 'NORMAL'::character varying NULL,
	leida bool DEFAULT false NULL,
	fecha_envio timestamp DEFAULT now() NULL,
	fecha_lectura timestamp NULL,
	id_usuario uuid NOT NULL,
	referencia_tabla varchar(50) NULL,
	CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion),
	CONSTRAINT notificacion_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
CREATE INDEX idx_notificacion_fecha ON public.notificacion USING btree (fecha_envio);
CREATE INDEX idx_notificacion_leida ON public.notificacion USING btree (leida);
CREATE INDEX idx_notificacion_tipo ON public.notificacion USING btree (tipo);
CREATE INDEX idx_notificacion_usuario ON public.notificacion USING btree (id_usuario);


-- public.poliza definition

-- Drop table

-- DROP TABLE poliza;

CREATE TABLE poliza (
	id_poliza uuid DEFAULT gen_random_uuid() NOT NULL,
	numero_poliza varchar(50) NOT NULL,
	modalidad_poliza varchar(20) DEFAULT 'UNITARIA'::character varying NULL,
	cantidad_unidades int4 DEFAULT 1 NULL,
	fecha_inicio date NOT NULL,
	fecha_vencimiento date NOT NULL,
	fecha_emision timestamp DEFAULT now() NULL,
	prima_total numeric(12, 2) NOT NULL,
	prima_neta numeric(12, 2) NOT NULL,
	comision_broker numeric(12, 2) DEFAULT 0.00 NULL,
	porcentaje_comision_aplicado numeric(5, 2) DEFAULT 0.00 NULL,
	suma_asegurada numeric(15, 2) NOT NULL,
	deducible numeric(12, 2) DEFAULT 0.00 NULL,
	frecuencia_pago varchar(20) DEFAULT 'MENSUAL'::character varying NULL,
	numero_cuotas int4 DEFAULT 12 NULL,
	observaciones text NULL,
	condiciones_especiales text NULL,
	archivo_poliza_url text NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_cliente uuid NOT NULL,
	id_producto uuid NOT NULL,
	id_estado_poliza uuid NOT NULL,
	vendido_por_usuario uuid NOT NULL,
	CONSTRAINT poliza_numero_poliza_key UNIQUE (numero_poliza),
	CONSTRAINT poliza_pkey PRIMARY KEY (id_poliza),
	CONSTRAINT poliza_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
	CONSTRAINT poliza_id_estado_poliza_fkey FOREIGN KEY (id_estado_poliza) REFERENCES estado_poliza(id_estado_poliza),
	CONSTRAINT poliza_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES producto_seguro(id_producto),
	CONSTRAINT poliza_vendido_por_usuario_fkey FOREIGN KEY (vendido_por_usuario) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_poliza_activa ON public.poliza USING btree (esta_activo);
CREATE INDEX idx_poliza_cliente ON public.poliza USING btree (id_cliente);
CREATE INDEX idx_poliza_estado ON public.poliza USING btree (id_estado_poliza);
CREATE INDEX idx_poliza_fecha_venc ON public.poliza USING btree (fecha_vencimiento);
CREATE INDEX idx_poliza_modalidad ON public.poliza USING btree (modalidad_poliza);
CREATE INDEX idx_poliza_numero ON public.poliza USING btree (numero_poliza);
CREATE INDEX idx_poliza_vendedor ON public.poliza USING btree (vendido_por_usuario);


-- public.renovacion_poliza definition

-- Drop table

-- DROP TABLE renovacion_poliza;

CREATE TABLE renovacion_poliza (
	id_renovacion uuid DEFAULT gen_random_uuid() NOT NULL,
	id_poliza_original uuid NOT NULL,
	id_poliza_nueva uuid NOT NULL,
	fecha_renovacion date NOT NULL,
	motivo_renovacion text NULL,
	cambios_realizados text NULL,
	prima_anterior numeric(12, 2) NULL,
	prima_nueva numeric(12, 2) NULL,
	procesado_por_usuario uuid NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT renovacion_poliza_pkey PRIMARY KEY (id_renovacion),
	CONSTRAINT renovacion_poliza_id_poliza_nueva_fkey FOREIGN KEY (id_poliza_nueva) REFERENCES poliza(id_poliza),
	CONSTRAINT renovacion_poliza_id_poliza_original_fkey FOREIGN KEY (id_poliza_original) REFERENCES poliza(id_poliza),
	CONSTRAINT renovacion_poliza_procesado_por_usuario_fkey FOREIGN KEY (procesado_por_usuario) REFERENCES usuario(id_usuario)
);


-- public.siniestro definition

-- Drop table

-- DROP TABLE siniestro;

CREATE TABLE siniestro (
	id_siniestro uuid DEFAULT gen_random_uuid() NOT NULL,
	numero_siniestro varchar(50) NOT NULL,
	fecha_ocurrencia timestamp NOT NULL,
	lugar_ocurrencia text NOT NULL,
	descripcion_evento text NOT NULL,
	monto_reclamado numeric(12, 2) NOT NULL,
	monto_aprobado numeric(12, 2) NULL,
	tiene_denuncia_policial bool DEFAULT false NULL,
	numero_denuncia varchar(50) NULL,
	tiene_peritaje bool DEFAULT false NULL,
	resultado_peritaje text NULL,
	estado varchar(50) DEFAULT 'REPORTADO'::character varying NULL,
	fecha_reporte timestamp DEFAULT now() NULL,
	fecha_resolucion timestamp NULL,
	observaciones text NULL,
	motivo_rechazo text NULL,
	id_poliza uuid NOT NULL,
	id_tipo_siniestro uuid NOT NULL,
	reportado_por_usuario uuid NULL,
	procesado_por_usuario uuid NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT siniestro_numero_siniestro_key UNIQUE (numero_siniestro),
	CONSTRAINT siniestro_pkey PRIMARY KEY (id_siniestro),
	CONSTRAINT siniestro_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
	CONSTRAINT siniestro_id_tipo_siniestro_fkey FOREIGN KEY (id_tipo_siniestro) REFERENCES tipo_siniestro(id_tipo_siniestro),
	CONSTRAINT siniestro_procesado_por_usuario_fkey FOREIGN KEY (procesado_por_usuario) REFERENCES usuario(id_usuario),
	CONSTRAINT siniestro_reportado_por_usuario_fkey FOREIGN KEY (reportado_por_usuario) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_siniestro_estado ON public.siniestro USING btree (estado);
CREATE INDEX idx_siniestro_fecha ON public.siniestro USING btree (fecha_ocurrencia);
CREATE INDEX idx_siniestro_numero ON public.siniestro USING btree (numero_siniestro);
CREATE INDEX idx_siniestro_poliza ON public.siniestro USING btree (id_poliza);


-- public.tarea definition

-- Drop table

-- DROP TABLE tarea;

CREATE TABLE tarea (
	id_tarea uuid DEFAULT gen_random_uuid() NOT NULL,
	titulo varchar(200) NOT NULL,
	descripcion text NULL,
	tipo_tarea varchar(50) NULL,
	prioridad varchar(20) DEFAULT 'MEDIA'::character varying NULL,
	fecha_inicio timestamp NOT NULL,
	fecha_vencimiento timestamp NOT NULL,
	fecha_completada timestamp NULL,
	estado varchar(30) DEFAULT 'PENDIENTE'::character varying NULL,
	progreso int4 DEFAULT 0 NULL,
	id_lead uuid NULL,
	id_cliente uuid NULL,
	id_poliza uuid NULL,
	creada_por uuid NOT NULL,
	asignada_a uuid NOT NULL,
	recordatorio_enviado bool DEFAULT false NULL,
	fecha_recordatorio timestamp NULL,
	notas text NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT tarea_pkey PRIMARY KEY (id_tarea),
	CONSTRAINT tarea_asignada_a_fkey FOREIGN KEY (asignada_a) REFERENCES usuario(id_usuario),
	CONSTRAINT tarea_creada_por_fkey FOREIGN KEY (creada_por) REFERENCES usuario(id_usuario),
	CONSTRAINT tarea_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
	CONSTRAINT tarea_id_lead_fkey FOREIGN KEY (id_lead) REFERENCES "lead"(id_lead) ON DELETE CASCADE,
	CONSTRAINT tarea_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
);
CREATE INDEX idx_tarea_asignada ON public.tarea USING btree (asignada_a);
CREATE INDEX idx_tarea_creador ON public.tarea USING btree (creada_por);
CREATE INDEX idx_tarea_estado ON public.tarea USING btree (estado);
CREATE INDEX idx_tarea_tipo ON public.tarea USING btree (tipo_tarea);
CREATE INDEX idx_tarea_vencimiento ON public.tarea USING btree (fecha_vencimiento);


-- public.actividad definition

-- Drop table

-- DROP TABLE actividad;

CREATE TABLE actividad (
	id_actividad uuid DEFAULT gen_random_uuid() NOT NULL,
	tipo_actividad varchar(50) NOT NULL,
	titulo varchar(200) NOT NULL,
	descripcion text NULL,
	fecha_actividad timestamp NOT NULL,
	duracion_minutos int4 NULL,
	resultado varchar(100) NULL,
	proxima_accion text NULL,
	fecha_proxima_accion timestamp NULL,
	id_lead uuid NULL,
	id_cliente uuid NULL,
	id_poliza uuid NULL,
	realizada_por_usuario uuid NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT actividad_check CHECK (((id_lead IS NOT NULL) OR (id_cliente IS NOT NULL) OR (id_poliza IS NOT NULL))),
	CONSTRAINT actividad_pkey PRIMARY KEY (id_actividad),
	CONSTRAINT actividad_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
	CONSTRAINT actividad_id_lead_fkey FOREIGN KEY (id_lead) REFERENCES "lead"(id_lead) ON DELETE CASCADE,
	CONSTRAINT actividad_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE,
	CONSTRAINT actividad_realizada_por_usuario_fkey FOREIGN KEY (realizada_por_usuario) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_actividad_cliente ON public.actividad USING btree (id_cliente);
CREATE INDEX idx_actividad_fecha ON public.actividad USING btree (fecha_actividad);
CREATE INDEX idx_actividad_lead ON public.actividad USING btree (id_lead);
CREATE INDEX idx_actividad_usuario ON public.actividad USING btree (realizada_por_usuario);


-- public.beneficiario definition

-- Drop table

-- DROP TABLE beneficiario;

CREATE TABLE beneficiario (
	id_beneficiario uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido varchar(100) NOT NULL,
	documento_identidad varchar(20) NOT NULL,
	tipo_documento varchar(10) NOT NULL,
	fecha_nacimiento date NULL,
	relacion_con_asegurado varchar(50) NOT NULL,
	porcentaje_beneficio numeric(5, 2) DEFAULT 100.00 NOT NULL,
	telefono varchar(20) NULL,
	direccion text NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_cliente uuid NOT NULL,
	CONSTRAINT beneficiario_pkey PRIMARY KEY (id_beneficiario),
	CONSTRAINT beneficiario_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);


-- public.comision definition

-- Drop table

-- DROP TABLE comision;

CREATE TABLE comision (
	id_comision uuid DEFAULT gen_random_uuid() NOT NULL,
	monto numeric(10, 2) NOT NULL,
	porcentaje numeric(5, 2) NOT NULL,
	tipo_comision varchar(50) NOT NULL,
	estado varchar(30) DEFAULT 'PENDIENTE'::character varying NULL,
	fecha_generacion timestamp DEFAULT now() NULL,
	fecha_pago timestamp NULL,
	periodo_mes int4 NOT NULL,
	periodo_ano int4 NOT NULL,
	observaciones text NULL,
	id_poliza uuid NOT NULL,
	id_usuario uuid NOT NULL,
	aprobado_por uuid NULL,
	fecha_aprobacion timestamp NULL,
	CONSTRAINT comision_pkey PRIMARY KEY (id_comision),
	CONSTRAINT comision_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES usuario(id_usuario),
	CONSTRAINT comision_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
	CONSTRAINT comision_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_comision_aprobador ON public.comision USING btree (aprobado_por);
CREATE INDEX idx_comision_estado ON public.comision USING btree (estado);
CREATE INDEX idx_comision_periodo ON public.comision USING btree (periodo_ano, periodo_mes);
CREATE INDEX idx_comision_poliza ON public.comision USING btree (id_poliza);
CREATE INDEX idx_comision_usuario ON public.comision USING btree (id_usuario);


-- public.cuota_poliza definition

-- Drop table

-- DROP TABLE cuota_poliza;

CREATE TABLE cuota_poliza (
	id_cuota uuid DEFAULT gen_random_uuid() NOT NULL,
	numero_cuota int4 NOT NULL,
	monto numeric(10, 2) NOT NULL,
	fecha_vencimiento date NOT NULL,
	fecha_pago date NULL,
	estado varchar(20) DEFAULT 'PENDIENTE'::character varying NULL,
	metodo_pago varchar(50) NULL,
	referencia_pago varchar(100) NULL,
	comprobante_url text NULL,
	mora numeric(8, 2) DEFAULT 0.00 NULL,
	descuento numeric(8, 2) DEFAULT 0.00 NULL,
	observaciones text NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_poliza uuid NOT NULL,
	CONSTRAINT cuota_poliza_id_poliza_numero_cuota_key UNIQUE (id_poliza, numero_cuota),
	CONSTRAINT cuota_poliza_pkey PRIMARY KEY (id_cuota),
	CONSTRAINT cuota_poliza_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
);
CREATE INDEX idx_cuota_estado ON public.cuota_poliza USING btree (estado);
CREATE INDEX idx_cuota_poliza ON public.cuota_poliza USING btree (id_poliza);
CREATE INDEX idx_cuota_vencimiento ON public.cuota_poliza USING btree (fecha_vencimiento);


-- public.documento_siniestro definition

-- Drop table

-- DROP TABLE documento_siniestro;

CREATE TABLE documento_siniestro (
	id_documento uuid DEFAULT gen_random_uuid() NOT NULL,
	nombre_archivo varchar(255) NOT NULL,
	tipo_documento varchar(100) NOT NULL,
	url_archivo text NOT NULL,
	descripcion text NULL,
	fecha_subida timestamp DEFAULT now() NULL,
	subido_por_usuario uuid NOT NULL,
	id_siniestro uuid NOT NULL,
	CONSTRAINT documento_siniestro_pkey PRIMARY KEY (id_documento),
	CONSTRAINT documento_siniestro_id_siniestro_fkey FOREIGN KEY (id_siniestro) REFERENCES siniestro(id_siniestro) ON DELETE CASCADE,
	CONSTRAINT documento_siniestro_subido_por_usuario_fkey FOREIGN KEY (subido_por_usuario) REFERENCES usuario(id_usuario)
);


-- public.movimiento_contable definition

-- Drop table

-- DROP TABLE movimiento_contable;

CREATE TABLE movimiento_contable (
	id_movimiento uuid DEFAULT gen_random_uuid() NOT NULL,
	tipo_movimiento varchar(20) NOT NULL,
	categoria varchar(100) NOT NULL,
	concepto varchar(200) NOT NULL,
	descripcion text NULL,
	monto numeric(12, 2) NOT NULL,
	fecha_movimiento date NOT NULL,
	fecha_registro timestamp DEFAULT now() NULL,
	comprobante_tipo varchar(50) NULL,
	comprobante_numero varchar(100) NULL,
	comprobante_url text NULL,
	id_poliza uuid NULL,
	id_usuario uuid NULL,
	id_asociado uuid NULL,
	registrado_por uuid NOT NULL,
	CONSTRAINT movimiento_contable_pkey PRIMARY KEY (id_movimiento),
	CONSTRAINT movimiento_contable_id_asociado_fkey FOREIGN KEY (id_asociado) REFERENCES asociado(id_asociado),
	CONSTRAINT movimiento_contable_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
	CONSTRAINT movimiento_contable_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
	CONSTRAINT movimiento_contable_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_movimiento_asociado ON public.movimiento_contable USING btree (id_asociado);
CREATE INDEX idx_movimiento_categoria ON public.movimiento_contable USING btree (categoria);
CREATE INDEX idx_movimiento_fecha ON public.movimiento_contable USING btree (fecha_movimiento);
CREATE INDEX idx_movimiento_tipo ON public.movimiento_contable USING btree (tipo_movimiento);
CREATE INDEX idx_movimiento_usuario ON public.movimiento_contable USING btree (id_usuario);


-- public.peticion definition

-- Drop table

-- DROP TABLE peticion;

CREATE TABLE peticion (
	id_peticion uuid DEFAULT gen_random_uuid() NOT NULL,
	tipo_peticion varchar(50) NOT NULL,
	titulo varchar(200) NOT NULL,
	descripcion text NOT NULL,
	motivo text NULL,
	estado varchar(30) DEFAULT 'PENDIENTE'::character varying NULL,
	observaciones_respuesta text NULL,
	fecha_solicitud timestamp DEFAULT now() NULL,
	fecha_respuesta timestamp NULL,
	solicitante_id uuid NOT NULL,
	aprobador_id uuid NULL,
	respondido_por uuid NULL,
	id_poliza uuid NULL,
	CONSTRAINT peticion_pkey PRIMARY KEY (id_peticion),
	CONSTRAINT peticion_aprobador_id_fkey FOREIGN KEY (aprobador_id) REFERENCES usuario(id_usuario),
	CONSTRAINT peticion_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
	CONSTRAINT peticion_respondido_por_fkey FOREIGN KEY (respondido_por) REFERENCES usuario(id_usuario),
	CONSTRAINT peticion_solicitante_id_fkey FOREIGN KEY (solicitante_id) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_peticion_aprobador ON public.peticion USING btree (aprobador_id);
CREATE INDEX idx_peticion_estado ON public.peticion USING btree (estado);
CREATE INDEX idx_peticion_fecha ON public.peticion USING btree (fecha_solicitud);
CREATE INDEX idx_peticion_solicitante ON public.peticion USING btree (solicitante_id);
CREATE INDEX idx_peticion_tipo ON public.peticion USING btree (tipo_peticion);



-- DROP FUNCTION public.update_fecha_actualizacion_salud();

CREATE OR REPLACE FUNCTION public.update_fecha_actualizacion_salud()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_fecha_actualizacion_scrt();

CREATE OR REPLACE FUNCTION public.update_fecha_actualizacion_scrt()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;