import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateTareaDto {
  @ApiProperty({
    description: 'Título de la tarea',
    required: false,
    example: 'Llamar al cliente',
  })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    required: false,
    example: 'Llamar al cliente para seguimiento de póliza',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Tipo de tarea',
    required: false,
    example: 'llamada',
  })
  @IsOptional()
  @IsString()
  tipo_tarea?: string;

  @ApiProperty({
    description: 'Estado de la tarea',
    required: false,
    example: 'COMPLETADA',
    enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'],
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    required: false,
    example: 'ALTA',
    enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
  })
  @IsOptional()
  @IsString()
  prioridad?: string;

  @ApiProperty({
    description: 'Fecha de inicio de la tarea',
    required: false,
    example: '2024-12-01T09:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @ApiProperty({
    description: 'Fecha de vencimiento de la tarea',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: Date;

  @ApiProperty({
    description: 'Fecha de completado de la tarea',
    required: false,
    example: '2024-12-30T15:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_completada?: Date;

  @ApiProperty({
    description: 'Progreso de la tarea (0-100)',
    required: false,
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  progreso?: number;

  @ApiProperty({
    description: 'ID del usuario asignado',
    required: false,
    example: 'uuid-del-usuario',
  })
  @IsOptional()
  @IsUUID()
  asignada_a?: string;

  @ApiProperty({
    description: 'ID del cliente relacionado',
    required: false,
    example: 'uuid-del-cliente',
  })
  @IsOptional()
  @IsUUID()
  id_cliente?: string;

  @ApiProperty({
    description: 'ID del lead relacionado',
    required: false,
    example: 'uuid-del-lead',
  })
  @IsOptional()
  @IsUUID()
  id_lead?: string;

  @ApiProperty({
    description: 'ID de la póliza relacionada',
    required: false,
    example: 'uuid-de-la-poliza',
  })
  @IsOptional()
  @IsUUID()
  id_poliza?: string;

  @ApiProperty({
    description: 'Recordatorio enviado',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  recordatorio_enviado?: boolean;

  @ApiProperty({
    description: 'Fecha de recordatorio',
    required: false,
    example: '2024-12-30T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_recordatorio?: Date;

  @ApiProperty({
    description: 'Notas adicionales',
    required: false,
    example: 'Cliente prefiere llamadas por la mañana',
  })
  @IsOptional()
  @IsString()
  notas?: string;
}
