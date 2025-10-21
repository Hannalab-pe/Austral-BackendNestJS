import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleSeguroSaludDto {
  @ApiProperty({ description: 'ID del lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  lead_id: string;

  @ApiProperty({ description: 'Edad del asegurado', example: 35 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(120)
  edad: number;

  @ApiProperty({
    description: 'Sexo del asegurado',
    example: 'Masculino',
    enum: ['Masculino', 'Femenino', 'Otro'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Otro'])
  sexo: string;

  @ApiProperty({
    description: 'Grupo familiar',
    example: 'Pareja e hijos (2)',
  })
  @IsNotEmpty()
  @IsString()
  grupo_familiar: string;

  @ApiProperty({
    description: 'Estado clínico',
    example: 'Buen estado general, sin enfermedades crónicas',
  })
  @IsNotEmpty()
  @IsString()
  estado_clinico: string;

  @ApiProperty({
    description: 'Zona de trabajo o vivienda',
    example: 'Buenos Aires, Argentina',
  })
  @IsNotEmpty()
  @IsString()
  zona_trabajo_vivienda: string;

  @ApiProperty({
    description: 'Preferencia de plan',
    example: 'Plan Premium',
  })
  @IsNotEmpty()
  @IsString()
  preferencia_plan: string;

  @ApiProperty({
    description: 'Reembolso esperado',
    example: 1500.50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  reembolso?: number;

  @ApiProperty({
    description: 'Coberturas deseadas',
    example: 'Consultas médicas, hospitalización, medicamentos',
  })
  @IsNotEmpty()
  @IsString()
  coberturas: string;
}

export class UpdateDetalleSeguroSaludDto {
  @ApiProperty({
    description: 'Edad del asegurado',
    example: 35,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(120)
  edad?: number;

  @ApiProperty({
    description: 'Sexo del asegurado',
    example: 'Masculino',
    enum: ['Masculino', 'Femenino', 'Otro'],
    required: false,
  })
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Otro'])
  sexo?: string;

  @ApiProperty({
    description: 'Grupo familiar',
    example: 'Pareja e hijos (2)',
    required: false,
  })
  @IsString()
  grupo_familiar?: string;

  @ApiProperty({
    description: 'Estado clínico',
    example: 'Buen estado general, sin enfermedades crónicas',
    required: false,
  })
  @IsString()
  estado_clinico?: string;

  @ApiProperty({
    description: 'Zona de trabajo o vivienda',
    example: 'Buenos Aires, Argentina',
    required: false,
  })
  @IsString()
  zona_trabajo_vivienda?: string;

  @ApiProperty({
    description: 'Preferencia de plan',
    example: 'Plan Premium',
    required: false,
  })
  @IsString()
  preferencia_plan?: string;

  @ApiProperty({
    description: 'Reembolso esperado',
    example: 1500.50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  reembolso?: number;

  @ApiProperty({
    description: 'Coberturas deseadas',
    example: 'Consultas médicas, hospitalización, medicamentos',
    required: false,
  })
  @IsString()
  coberturas?: string;
}