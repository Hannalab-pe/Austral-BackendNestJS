-- Tabla de primas
CREATE TABLE prima (
	id_prima uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	id_poliza uuid NOT NULL,
	monto numeric(12,2) NOT NULL,
	fecha_vencimiento date NOT NULL,
	fecha_pago date NULL,
	estado varchar(20) DEFAULT 'PENDIENTE', -- PENDIENTE, PAGADA, VENCIDA
	observaciones text NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	fecha_actualizacion timestamp NULL,
	CONSTRAINT prima_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
);
CREATE INDEX idx_prima_poliza ON prima(id_poliza);
CREATE INDEX idx_prima_estado ON prima(estado);

-- Tabla de siniestros
CREATE TABLE siniestro (
	id_siniestro uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	id_poliza uuid NOT NULL,
	numero_siniestro varchar(50) NOT NULL,
	fecha_ocurrencia date NOT NULL,
	descripcion text NOT NULL,
	monto_reclamado numeric(12,2) NOT NULL,
	monto_pagado numeric(12,2) NULL,
	estado varchar(20) DEFAULT 'REPORTADO', -- REPORTADO, EN_PROCESO, CERRADO, RECHAZADO
	observaciones text NULL,
	fecha_reporte timestamp DEFAULT now() NULL,
	fecha_actualizacion timestamp NULL,
	fecha_cierre timestamp NULL,
	CONSTRAINT siniestro_id_poliza_fkey FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
);
CREATE INDEX idx_siniestro_poliza ON siniestro(id_poliza);
CREATE INDEX idx_siniestro_estado ON siniestro(estado);
-- rol definition

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
CREATE INDEX idx_rol_activo ON public.rol USING btree (esta_activo);


-- usuario definition

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
	esta_activo bool DEFAULT true NOT NULL,
	ultimo_acceso timestamp NULL,
	intentos_fallidos int4 DEFAULT 0 NULL,
	cuenta_bloqueada bool DEFAULT false NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	id_rol uuid NOT NULL,
	CONSTRAINT usuario_email_key UNIQUE (email),
	CONSTRAINT usuario_nombre_usuario_key UNIQUE (nombre_usuario),
	CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario),
	CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);
CREATE INDEX idx_usuario_activo ON public.usuario USING btree (esta_activo);
CREATE INDEX idx_usuario_email ON public.usuario USING btree (email);


-- broker_vendedor definition

-- Drop table

-- DROP TABLE broker_vendedor;

CREATE TABLE broker_vendedor (
	id_broker uuid NOT NULL,
	id_vendedor uuid NOT NULL,
	porcentaje_comision numeric(5, 2) NOT NULL,
	fecha_asignacion timestamp DEFAULT now() NOT NULL,
	esta_activo bool DEFAULT true NOT NULL,
	CONSTRAINT broker_vendedor_pkey PRIMARY KEY (id_broker, id_vendedor),
	CONSTRAINT broker_vendedor_id_broker_fkey FOREIGN KEY (id_broker) REFERENCES usuario(id_usuario),
	CONSTRAINT broker_vendedor_id_vendedor_fkey FOREIGN KEY (id_vendedor) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_broker_vendedor_activo ON public.broker_vendedor USING btree (esta_activo);
CREATE INDEX idx_broker_vendedor_broker ON public.broker_vendedor USING btree (id_broker);
CREATE INDEX idx_broker_vendedor_vendedor ON public.broker_vendedor USING btree (id_vendedor);


-- vista definition

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


-- permiso definition

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


-- rol_permiso_vista definition

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


-- rol_vista definition

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
CREATE INDEX idx_rol_vista_rol ON public.rol_vista USING btree (id_rol);
CREATE INDEX idx_rol_vista_vista ON public.rol_vista USING btree (id_vista);


-- lead definition

-- Drop table

-- DROP TABLE lead;

CREATE TABLE lead (
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
	asignado_a_usuario uuid NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_creacion timestamp DEFAULT now() NOT NULL,
	CONSTRAINT lead_pkey PRIMARY KEY (id_lead)
);
CREATE INDEX idx_lead_activo ON public.lead USING btree (esta_activo);
CREATE INDEX idx_lead_asignado ON public.lead USING btree (asignado_a_usuario);
CREATE INDEX idx_lead_cumpleanos ON public.lead USING btree (EXTRACT(month FROM fecha_nacimiento), EXTRACT(day FROM fecha_nacimiento));
CREATE INDEX idx_lead_seguimiento ON public.lead USING btree (proxima_fecha_seguimiento);
CREATE INDEX idx_lead_telefono ON public.lead USING btree (telefono);


-- cliente definition

-- Drop table

-- DROP TABLE cliente;

CREATE TABLE cliente (
	id_cliente uuid DEFAULT gen_random_uuid() NOT NULL,
	tipo_persona varchar(20) NOT NULL, -- 'NATURAL' o 'JURIDICO'
	razon_social varchar(300) NULL, -- Para juridico
	nombres varchar(100) NULL, -- Para natural
	apellidos varchar(100) NULL, -- Para natural
	tipo_documento varchar(20) NOT NULL, -- DNI, CEDULA, etc.
	numero_documento varchar(20) NOT NULL,
	direccion text NOT NULL,
	distrito varchar(100) NULL,
	provincia varchar(100) NULL,
	departamento varchar(100) NULL,
	telefono_1 varchar(20) NOT NULL,
	telefono_2 varchar(20) NULL,
	whatsapp varchar(20) NULL, -- Con simbolo '+'
	email_notificaciones varchar(255) NULL,
	recibir_notificaciones bool DEFAULT true NOT NULL,
	cumpleanos date NULL,
	esta_activo bool DEFAULT true NOT NULL,
	fecha_registro timestamp DEFAULT now() NULL,
	id_lead uuid NULL,
	asignado_a uuid NULL, -- Cambiado de broker_asignado
	registrado_por uuid NULL,
	CONSTRAINT cliente_numero_documento_key UNIQUE (numero_documento),
	CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente),
	CONSTRAINT cliente_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES usuario(id_usuario),
	CONSTRAINT cliente_id_lead_fkey FOREIGN KEY (id_lead) REFERENCES lead(id_lead),
	CONSTRAINT cliente_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_cliente_activo ON public.cliente USING btree (esta_activo);
CREATE INDEX idx_cliente_asignado ON public.cliente USING btree (asignado_a);
CREATE INDEX idx_cliente_cumpleanos ON public.cliente USING btree (EXTRACT(month FROM cumpleanos), EXTRACT(day FROM cumpleanos));
CREATE INDEX idx_cliente_documento ON public.cliente USING btree (numero_documento);
CREATE INDEX idx_cliente_email_notif ON public.cliente USING btree (email_notificaciones);
CREATE INDEX idx_cliente_registrado_por ON public.cliente USING btree (registrado_por);
CREATE INDEX idx_cliente_tipo_persona ON public.cliente USING btree (tipo_persona);


-- cliente_contacto definition

-- Drop table

-- DROP TABLE cliente_contacto;

CREATE TABLE cliente_contacto (
	id_contacto uuid DEFAULT gen_random_uuid() NOT NULL,
	id_cliente uuid NOT NULL,
	nombre varchar(200) NOT NULL,
	cargo varchar(100) NULL,
	telefono varchar(20) NULL,
	correo varchar(255) NULL,
	fecha_creacion timestamp DEFAULT now() NULL,
	CONSTRAINT cliente_contacto_pkey PRIMARY KEY (id_contacto),
	CONSTRAINT cliente_contacto_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);
CREATE INDEX idx_cliente_contacto_cliente ON public.cliente_contacto USING btree (id_cliente);


-- cliente_documento definition

-- Drop table

-- DROP TABLE cliente_documento;

CREATE TABLE cliente_documento (
	id_documento uuid DEFAULT gen_random_uuid() NOT NULL,
	id_cliente uuid NOT NULL,
	tipo_documento varchar(100) NOT NULL, -- e.g. 'DNI', 'LICENCIA', etc.
	url_archivo text NOT NULL,
	descripcion text NULL,
	fecha_subida timestamp DEFAULT now() NULL,
	subido_por uuid NOT NULL,
	CONSTRAINT cliente_documento_pkey PRIMARY KEY (id_documento),
	CONSTRAINT cliente_documento_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
	CONSTRAINT cliente_documento_subido_por_fkey FOREIGN KEY (subido_por) REFERENCES usuario(id_usuario)
);
CREATE INDEX idx_cliente_documento_cliente ON public.cliente_documento USING btree (id_cliente);
CREATE INDEX idx_cliente_documento_tipo ON public.cliente_documento USING btree (tipo_documento);
