export enum TipoDocumento {
  DNI = 'DNI',
  CARNET_EXTRANJERIA = 'CE',
  PASAPORTE = 'PASAPORTE',
  RUC = 'RUC',
}

export enum EstadoCivil {
  SOLTERO = 'SOLTERO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUDO = 'VIUDO',
  CONVIVIENTE = 'CONVIVIENTE',
}

export enum PrioridadLead {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export enum TipoActividad {
  LLAMADA = 'LLAMADA',
  EMAIL = 'EMAIL',
  REUNION = 'REUNION',
  VISITA = 'VISITA',
  COTIZACION = 'COTIZACION',
  SEGUIMIENTO = 'SEGUIMIENTO',
}

export enum EstadoPoliza {
  ACTIVA = 'ACTIVA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA',
  SUSPENDIDA = 'SUSPENDIDA',
}

export enum FrecuenciaPago {
  MENSUAL = 'MENSUAL',
  BIMESTRAL = 'BIMESTRAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
}

export enum EstadoSiniestro {
  REPORTADO = 'REPORTADO',
  EN_REVISION = 'EN_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  PAGADO = 'PAGADO',
}

export enum TipoNotificacion {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum PrioridadNotificacion {
  BAJA = 'BAJA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}
