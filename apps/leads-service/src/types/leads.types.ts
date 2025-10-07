export type LeadStatus =
  | 'NUEVO'
  | 'CONTACTADO'
  | 'CUALIFICADO'
  | 'PROPUESTA'
  | 'NEGOCIACION'
  | 'CERRADO'
  | 'PERDIDO';

export type LeadPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type LeadSource =
  | 'WEB'
  | 'REFERIDO'
  | 'PUBLICIDAD'
  | 'LLAMADA'
  | 'EMAIL'
  | 'REDES_SOCIALES'
  | 'EVENTO';

export type SortOrder = 'ASC' | 'DESC';

export type LeadSortField =
  | 'fechaCreacion'
  | 'fechaUltimoContacto'
  | 'proximaFechaSeguimiento'
  | 'puntajeCalificacion'
  | 'nombre';
