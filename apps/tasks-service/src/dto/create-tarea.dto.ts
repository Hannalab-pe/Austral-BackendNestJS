import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Llamar al cliente',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

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
    description: 'Prioridad de la tarea',
    example: 'MEDIA',
    enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
  })
  @IsString()
  @IsNotEmpty()
  prioridad: string;

  @ApiProperty({
    description: 'Fecha de inicio de la tarea',
    example: '2024-12-01T09:00:00Z',
  })
  @IsDateString()
  fecha_inicio: Date;

  @ApiProperty({
    description: 'Fecha de vencimiento de la tarea',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  fecha_vencimiento: Date;

  @ApiProperty({
    description: 'ID del usuario que crea la tarea',
    example: 'uuid-del-usuario-creador',
  })
  @IsUUID()
  creada_por: string;

  @ApiProperty({
    description: 'ID del usuario asignado',
    example: 'uuid-del-usuario-asignado',
  })
  @IsUUID()
  asignada_a: string;

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
    description: 'Notas adicionales',
    required: false,
    example: 'Cliente prefiere llamadas por la mañana',
  })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({
    description: 'Fecha de recordatorio',
    required: false,
    example: '2024-12-30T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_recordatorio?: Date;
}
