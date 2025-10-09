export class UpdateActividadDto {
  titulo?: string;
  descripcion?: string;
  tipo?: string;
  fechaVencimiento?: Date;
  completada?: boolean;
  fechaCompletada?: Date;
  prioridad?: string;
  notas?: string;
}
