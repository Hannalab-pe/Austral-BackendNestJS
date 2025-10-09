export class CreateActividadDto {
  titulo: string;
  descripcion?: string;
  tipo: string;
  usuarioId: number;
  clienteId?: number;
  leadId?: number;
  fechaVencimiento: Date;
  prioridad?: string;
  notas?: string;
}
