export class UpdateTareaDto {
  titulo?: string;
  descripcion?: string;
  estado?: string;
  prioridad?: string;
  fechaVencimiento?: Date;
  fechaCompletada?: Date;
  usuarioAsignadoId?: number;
  clienteId?: number;
  leadId?: number;
  notas?: string;
}
