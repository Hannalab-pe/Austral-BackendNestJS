import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs para requests
export class VerificarPermisoRequest {
    @ApiProperty({
        description: 'ID del usuario que solicita la verificación',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    idUsuario: string;

    @ApiProperty({
        description: 'Ruta de la vista',
        example: '/usuarios'
    })
    @IsString()
    @IsNotEmpty()
    vista: string;

    @ApiProperty({
        description: 'Nombre del permiso',
        example: 'crear'
    })
    @IsString()
    @IsNotEmpty()
    permiso: string;
}

export class VerificarVistaRequest {
    @ApiProperty({
        description: 'ID del usuario que solicita la verificación',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    idUsuario: string;

    @ApiProperty({
        description: 'Ruta de la vista',
        example: '/usuarios'
    })
    @IsString()
    @IsNotEmpty()
    vista: string;
}

export class VerificarRutaRequest {
    @ApiProperty({
        description: 'ID del usuario que solicita la verificación',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    idUsuario: string;

    @ApiProperty({
        description: 'Ruta completa a verificar (soporta wildcards)',
        example: '/companias/123/editar'
    })
    @IsString()
    @IsNotEmpty()
    ruta: string;
}

// DTOs para responses
export class VerificarPermisoResponse {
    @ApiProperty({
        description: 'Indica si el usuario tiene el permiso solicitado',
        example: true
    })
    tienePermiso: boolean;

    @ApiPropertyOptional({
        description: 'Mensaje adicional (opcional)',
        example: 'Permiso concedido'
    })
    @IsOptional()
    @IsString()
    mensaje?: string;
}

export class VistaResponse {
    @ApiProperty({
        description: 'ID de la vista',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    idVista: string;

    @ApiProperty({
        description: 'Nombre de la vista',
        example: 'Usuarios'
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción de la vista'
    })
    descripcion?: string;

    @ApiProperty({
        description: 'Ruta de la vista',
        example: '/usuarios'
    })
    ruta: string;

    @ApiProperty({
        description: 'Indica si la vista está activa',
        example: true
    })
    estaActiva: boolean;
}

export class PermisoResponse {
    @ApiProperty({
        description: 'ID del permiso',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    idPermiso: string;

    @ApiProperty({
        description: 'Nombre del permiso',
        example: 'crear'
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del permiso'
    })
    descripcion?: string;

    @ApiProperty({
        description: 'Indica si el permiso está activo',
        example: true
    })
    estaActivo: boolean;
}

export class RolResponse {
    @ApiProperty({
        description: 'ID del rol',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    idRol: string;

    @ApiProperty({
        description: 'Nombre del rol',
        example: 'Administrador'
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del rol'
    })
    descripcion?: string;

    @ApiProperty({
        description: 'Nivel de acceso del rol',
        example: 1
    })
    nivelAcceso: number;

    @ApiProperty({
        description: 'Indica si el rol está activo',
        example: true
    })
    estaActivo: boolean;
}

// DTOs para listas
export class VistasResponse {
    @ApiProperty({
        description: 'Lista de vistas disponibles',
        type: [VistaResponse]
    })
    vistas: VistaResponse[];

    @ApiProperty({
        description: 'Total de vistas',
        example: 25
    })
    total: number;
}

export class PermisosResponse {
    @ApiProperty({
        description: 'Lista de permisos disponibles',
        type: [PermisoResponse]
    })
    permisos: PermisoResponse[];

    @ApiProperty({
        description: 'Total de permisos',
        example: 4
    })
    total: number;
}

export class RolesResponse {
    @ApiProperty({
        description: 'Lista de roles disponibles',
        type: [RolResponse]
    })
    roles: RolResponse[];

    @ApiProperty({
        description: 'Total de roles',
        example: 3
    })
    total: number;
}

// DTO para estadísticas
export class EstadisticasPermisos {
    @ApiProperty({
        description: 'Total de vistas activas',
        example: 25
    })
    totalVistas: number;

    @ApiProperty({
        description: 'Total de permisos activos',
        example: 4
    })
    totalPermisos: number;

    @ApiProperty({
        description: 'Total de roles activos',
        example: 3
    })
    totalRoles: number;

    @ApiProperty({
        description: 'Total de asignaciones rol-permiso-vista',
        example: 150
    })
    totalAsignaciones: number;
}