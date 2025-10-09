export class CreateTareaDto {
  titulo: string;
  descripcion?: string;
  prioridad: string;
  fechaVencimiento?: Date;
  usuarioAsignadoId: number;
  usuarioCreadorId: number;
  clienteId?: number;
  leadId?: number;
  notas?: string;
}
