export interface LeadFilters {
  estado?: string;
  asignado?: string;
  prioridad?: string;
  fuente?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeadStats {
  totalLeads: number;
  leadsPorEstado: Array<{ estado: string; count: number }>;
  leadsPorPrioridad: Array<{ prioridad: string; count: number }>;
  leadsPorFuente: Array<{ fuente: string; count: number }>;
}
