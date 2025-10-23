import { PartialType } from '@nestjs/mapped-types';
import { CreateActividadDto } from './create-actividad.dto';
import { IsOptional, IsString, IsDateString, IsInt, IsUUID } from 'class-validator';

export class UpdateActividadDto extends PartialType(CreateActividadDto) {
  // El PartialType ya incluye todos los campos como opcionales
  // Podemos agregar validaciones adicionales si es necesario
}