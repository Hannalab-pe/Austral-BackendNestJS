# Estructura del Proyecto Austral - Backend

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura de Microservicios](#arquitectura-de-microservicios)
3. [Estructura de un Microservicio](#estructura-de-un-microservicio)
4. [Creación de una Entidad (Entity)](#creación-de-una-entidad-entity)
5. [Servicios (Services)](#servicios-services)
6. [Controladores (Controllers)](#controladores-controllers)
7. [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
8. [Enums](#enums)
9. [Module Principal](#module-principal)
10. [Convenciones y Mejores Prácticas](#convenciones-y-mejores-prácticas)
11. [Checklist para Crear una Nueva Entidad](#checklist-para-crear-una-nueva-entidad)
12. [Ejemplo Completo: Entity Cliente](#ejemplo-completo-entity-cliente)

---

## 🎯 Visión General

El proyecto **Austral Backend** es una aplicación de **microservicios** construida con **NestJS**, **TypeScript**, **TypeORM** y **PostgreSQL**. Utiliza una arquitectura modular donde cada dominio de negocio tiene su propio microservicio independiente.

### Principios Fundamentales
- **Arquitectura de Microservicios**: Cada dominio tiene su propio servicio independiente
- **camelCase OBLIGATORIO**: Todas las propiedades, variables y nombres deben estar en camelCase
- **TypeORM**: ORM para manejo de base de datos PostgreSQL
- **DTOs con Validación**: Validación automática con class-validator
- **Swagger/OpenAPI**: Documentación automática de la API
- **JWT Authentication**: Autenticación basada en tokens
- **Auditoría Automática**: Todas las entidades tienen `fechaCreacion` y `fechaActualizacion`
- **Enums Específicos**: Los enums se crean en cada microservicio, NO hay enums globales

### Stack Tecnológico
- **Framework**: NestJS 10+
- **Lenguaje**: TypeScript 5+
- **Base de Datos**: PostgreSQL 14+
- **ORM**: TypeORM
- **Autenticación**: JWT (Passport)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Monorepo**: NestJS Monorepo (apps/ y libs/)

---

## 🏗️ Arquitectura de Microservicios

```
backend/
├── apps/                           # Microservicios de la aplicación
│   ├── api-gateway/               # Gateway principal (puerto 3000)
│   ├── auth-service/              # Servicio de autenticación (puerto 3001)
│   ├── clients-service/           # Servicio de clientes (puerto 3002)
│   ├── products-service/          # Servicio de productos (puerto 3003)
│   ├── activities-service/        # Servicio de actividades (puerto 3004)
│   ├── leads-service/             # Servicio de leads (puerto 3005)
│   ├── tasks-service/             # Servicio de tareas (puerto 3006)
│   └── notifications-service/     # Servicio de notificaciones (puerto 3007)
│
├── libs/                          # Librerías compartidas
│   └── common/                    # Código común entre servicios
│       ├── entities/              # Entidades base compartidas
│       ├── dto/                   # DTOs compartidos
│       ├── guards/                # Guards compartidos
│       ├── decorators/            # Decoradores compartidos
│       └── config/                # Configuraciones compartidas
│
├── bd-final.sql                   # Script SQL de la base de datos
├── package.json                   # Dependencias del proyecto
├── tsconfig.json                  # Configuración TypeScript
└── nest-cli.json                  # Configuración NestJS
```

### Microservicios Disponibles

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **api-gateway** | 3000 | Gateway principal que enruta a los demás servicios |
| **auth-service** | 3001 | Autenticación, usuarios, roles y permisos |
| **clients-service** | 3002 | Gestión de clientes y contactos |
| **products-service** | 3003 | Gestión de productos y compañías |
| **activities-service** | 3004 | Gestión de actividades y eventos |
| **leads-service** | 3005 | Gestión de leads y conversiones |
| **tasks-service** | 3006 | Gestión de tareas y seguimiento |
| **notifications-service** | 3007 | Notificaciones y alertas |

---

## 📂 Estructura de un Microservicio

Cada microservicio sigue una estructura **estandarizada**:

```
apps/[nombre-service]/
├── src/
│   ├── entities/                  # Entidades TypeORM
│   │   ├── [entidad].entity.ts
│   │   └── index.ts              # Exportar todas las entidades
│   │
│   ├── dto/                       # Data Transfer Objects
│   │   ├── create-[entidad].dto.ts
│   │   ├── update-[entidad].dto.ts
│   │   └── index.ts              # Exportar todos los DTOs
│   │
│   ├── services/                  # Lógica de negocio
│   │   ├── [entidad].service.ts
│   │   └── index.ts              # Exportar todos los servicios
│   │
│   ├── controllers/               # Controladores HTTP
│   │   ├── [entidad].controller.ts
│   │   └── index.ts              # Exportar todos los controladores
│   │
│   ├── enums/                     # Enums específicos del servicio (opcional)
│   │   └── index.ts              # Exportar todos los enums
│   │
│   ├── guards/                    # Guards de autenticación
│   │   └── jwt-auth.guard.ts
│   │
│   ├── strategies/                # Estrategias de autenticación
│   │   └── jwt.strategy.ts
│   │
│   ├── [nombre-service].module.ts # Módulo principal del servicio
│   └── main.ts                    # Punto de entrada del servicio
│
├── test/                          # Tests del servicio
└── tsconfig.app.json             # Configuración TypeScript del servicio
```

---

## 🗃️ Creación de una Entidad (Entity)

Las entidades son clases que representan tablas de la base de datos usando **TypeORM**.

### Ubicación
```
src/entities/[nombre-entidad].entity.ts
```

### Convenciones de Naming

- **Archivo**: `[entidad].entity.ts` (ej: `cliente.entity.ts`)
- **Clase**: PascalCase (ej: `Cliente`)
- **Propiedades**: camelCase (ej: `idCliente`, `fechaCreacion`)
- **Columnas en BD**: snake_case (ej: `id_cliente`, `fecha_creacion`)

### Estructura Básica de una Entidad

Toda entidad **DEBE** incluir:
1. ✅ **Decorador @Entity**: Define la tabla en la BD
2. ✅ **@PrimaryGeneratedColumn**: Clave primaria UUID
3. ✅ **Propiedades de la entidad**: Con decoradores @Column
4. ✅ **@CreateDateColumn**: Campo `fechaCreacion` automático
5. ✅ **@UpdateDateColumn**: Campo `fechaActualizacion` automático (opcional pero recomendado)
6. ✅ **Índices**: @Index para optimización de consultas

### Ejemplo: Entity Vendedor

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('vendedor')
@Index('idx_vendedor_activo', ['estaActivo'])
@Index('idx_vendedor_usuario', ['usuarioId'])
export class Vendedor {
  // ========================================================================
  // CLAVE PRIMARIA
  // ========================================================================
  
  @PrimaryGeneratedColumn('uuid', { name: 'id_vendedor' })
  idVendedor: string;

  // ========================================================================
  // CAMPOS DE INFORMACIÓN
  // ========================================================================

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'documento_identidad' })
  documentoIdentidad?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'porcentaje_comision' })
  porcentajeComision?: number;

  // ========================================================================
  // CAMPOS DE ESTADO Y CONTROL
  // ========================================================================

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  // ========================================================================
  // RELACIONES
  // ========================================================================

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // ========================================================================
  // CAMPOS DE AUDITORÍA (OBLIGATORIOS)
  // ========================================================================

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
```

### Exportar la Entidad en `entities/index.ts`

```typescript
// src/entities/index.ts
export { Vendedor } from './vendedor.entity';
export { Usuario } from './usuario.entity';
export { Cliente } from './cliente.entity';
// ... otras entidades
```

### Decoradores Comunes de TypeORM

| Decorador | Uso | Ejemplo |
|-----------|-----|---------|
| `@Entity('tabla')` | Define la tabla en la BD | `@Entity('vendedor')` |
| `@PrimaryGeneratedColumn('uuid')` | Clave primaria UUID | `idVendedor: string` |
| `@Column({ type, length, nullable })` | Columna de tabla | `@Column({ type: 'varchar', length: 100 })` |
| `@CreateDateColumn()` | Timestamp de creación | `fechaCreacion: Date` |
| `@UpdateDateColumn()` | Timestamp de actualización | `fechaActualizacion: Date` |
| `@Index('nombre_index', ['campo'])` | Índice en BD | `@Index('idx_vendedor_activo', ['estaActivo'])` |
| `@ManyToOne(() => Entity)` | Relación muchos a uno | `@ManyToOne(() => Usuario)` |
| `@OneToMany(() => Entity, e => e.campo)` | Relación uno a muchos | `@OneToMany(() => Poliza, p => p.cliente)` |
| `@JoinColumn({ name })` | Columna de unión | `@JoinColumn({ name: 'usuario_id' })` |

---

## 🔧 Servicios (Services)

Los servicios contienen la **lógica de negocio** y las operaciones CRUD básicas.

### Ubicación
```
src/services/[nombre-entidad].service.ts
```

### Convenciones

- **Archivo**: `[entidad].service.ts` (ej: `vendedores.service.ts`)
- **Clase**: `[Entidad]Service` (ej: `VendedoresService`)
- **Decorador**: `@Injectable()`

### Métodos CRUD Básicos

Todo servicio **DEBE** incluir estos 5 métodos básicos:

1. ✅ **findAll()**: Obtener todos los registros (con filtros opcionales)
2. ✅ **findOne(id)**: Obtener un registro por ID
3. ✅ **create(dto)**: Crear un nuevo registro
4. ✅ **update(id, dto)**: Actualizar un registro existente
5. ✅ **remove(id)**: Eliminar (soft delete) un registro

### Ejemplo: `vendedores.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedor } from '../entities/vendedor.entity';
import { CreateVendedorDto, UpdateVendedorDto } from '../dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
  ) {}

  /**
   * Obtener todos los vendedores (con filtros opcionales)
   */
  async findAll(filtros?: { estaActivo?: boolean }): Promise<Vendedor[]> {
    const where: any = {};

    if (filtros?.estaActivo !== undefined) {
      where.estaActivo = filtros.estaActivo;
    }

    return this.vendedorRepository.find({
      where,
      order: { fechaCreacion: 'DESC' },
      relations: ['usuario'], // Cargar relaciones si es necesario
    });
  }

  /**
   * Obtener un vendedor por ID
   */
  async findOne(id: string): Promise<Vendedor> {
    const vendedor = await this.vendedorRepository.findOne({
      where: { idVendedor: id },
      relations: ['usuario'],
    });

    if (!vendedor) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    return vendedor;
  }

  /**
   * Crear un nuevo vendedor
   */
  async create(createVendedorDto: CreateVendedorDto): Promise<Vendedor> {
    // Validaciones adicionales aquí (se agregan progresivamente)
    
    const vendedor = this.vendedorRepository.create(createVendedorDto);
    return this.vendedorRepository.save(vendedor);
  }

  /**
   * Actualizar un vendedor existente
   */
  async update(
    id: string,
    updateVendedorDto: UpdateVendedorDto,
  ): Promise<Vendedor> {
    const vendedor = await this.findOne(id);

    // Aplicar cambios
    Object.assign(vendedor, updateVendedorDto);

    return this.vendedorRepository.save(vendedor);
  }

  /**
   * Eliminar (soft delete) un vendedor
   */
  async remove(id: string): Promise<void> {
    const vendedor = await this.findOne(id);
    
    // Soft delete: marcar como inactivo en lugar de eliminar
    vendedor.estaActivo = false;
    await this.vendedorRepository.save(vendedor);
  }
}
```

### Exportar el Servicio en `services/index.ts`

```typescript
// src/services/index.ts
export { VendedoresService } from './vendedores.service';
export { ClientesService } from './clientes.service';
// ... otros servicios
```

### Mejores Prácticas para Servicios

1. **Inyección de Dependencias**: Usar `@InjectRepository()` para repositorios
2. **Manejo de Errores**: Lanzar excepciones de NestJS (`NotFoundException`, `BadRequestException`)
3. **Validaciones Progresivas**: Empezar sin validaciones, agregar conforme se necesiten
4. **Relaciones**: Cargar relaciones con `relations: []` cuando sea necesario
5. **Filtros Opcionales**: Usar parámetros opcionales para filtrado flexible
6. **Soft Delete**: Preferir `estaActivo = false` en lugar de delete físico

---

## 🎮 Controladores (Controllers)

Los controladores exponen los **endpoints HTTP** y manejan las peticiones.

### Ubicación
```
src/controllers/[nombre-entidad].controller.ts
```

### Convenciones

- **Archivo**: `[entidad].controller.ts` (ej: `vendedores.controller.ts`)
- **Clase**: `[Entidad]Controller` (ej: `VendedoresController`)
- **Decorador**: `@Controller('[ruta]')`
- **Rutas**: Seguir convenciones REST

### Rutas REST Estándar

| Método HTTP | Ruta | Acción | Método del Controller |
|-------------|------|--------|----------------------|
| GET | `/vendedores` | Listar todos | `findAll()` |
| GET | `/vendedores/:id` | Obtener uno | `findOne(id)` |
| POST | `/vendedores` | Crear nuevo | `create(dto)` |
| PUT/PATCH | `/vendedores/:id` | Actualizar | `update(id, dto)` |
| DELETE | `/vendedores/:id` | Eliminar | `remove(id)` |

### Ejemplo: `vendedores.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { VendedoresService } from '../services/vendedores.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Vendedor } from '../entities/vendedor.entity';
import { CreateVendedorDto, UpdateVendedorDto } from '../dto';

@ApiTags('vendedores')
@Controller('vendedores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los vendedores',
    description: 'Lista todos los vendedores con filtros opcionales',
  })
  @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendedores obtenida exitosamente',
  })
  async findAll(
    @Query('esta_activo') estaActivo?: boolean,
  ): Promise<Vendedor[]> {
    const filtros = estaActivo !== undefined ? { estaActivo } : undefined;
    return this.vendedoresService.findAll(filtros);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un vendedor por ID',
    description: 'Obtiene los detalles de un vendedor específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendedor encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendedor no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<Vendedor> {
    return this.vendedoresService.findOne(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo vendedor',
    description: 'Registra un nuevo vendedor en el sistema',
  })
  @ApiBody({ type: CreateVendedorDto })
  @ApiResponse({
    status: 201,
    description: 'Vendedor creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(
    @Body() createVendedorDto: CreateVendedorDto,
  ): Promise<Vendedor> {
    return this.vendedoresService.create(createVendedorDto);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un vendedor',
    description: 'Actualiza parcialmente los datos de un vendedor',
  })
  @ApiBody({ type: UpdateVendedorDto })
  @ApiResponse({
    status: 200,
    description: 'Vendedor actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendedor no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ): Promise<Vendedor> {
    return this.vendedoresService.update(id, updateVendedorDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar un vendedor',
    description: 'Desactiva un vendedor (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendedor eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendedor no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vendedoresService.remove(id);
  }
}
```

### Exportar el Controlador en `controllers/index.ts`

```typescript
// src/controllers/index.ts
export { VendedoresController } from './vendedores.controller';
export { ClientesController } from './clientes.controller';
// ... otros controladores
```

### Decoradores Comunes de NestJS

| Decorador | Uso | Ejemplo |
|-----------|-----|---------|
| `@Controller('ruta')` | Define el controlador | `@Controller('vendedores')` |
| `@Get()` | Endpoint GET | `@Get()` o `@Get(':id')` |
| `@Post()` | Endpoint POST | `@Post()` |
| `@Put()` | Endpoint PUT | `@Put(':id')` |
| `@Patch()` | Endpoint PATCH | `@Patch(':id')` |
| `@Delete()` | Endpoint DELETE | `@Delete(':id')` |
| `@Param('nombre')` | Parámetro de ruta | `@Param('id') id: string` |
| `@Body()` | Cuerpo de la petición | `@Body() dto: CreateDto` |
| `@Query('nombre')` | Query parameter | `@Query('activo') activo: boolean` |
| `@UseGuards(Guard)` | Aplicar guard | `@UseGuards(JwtAuthGuard)` |

### Decoradores de Swagger

| Decorador | Uso |
|-----------|-----|
| `@ApiTags('nombre')` | Agrupa endpoints en Swagger |
| `@ApiOperation({ summary, description })` | Describe el endpoint |
| `@ApiResponse({ status, description })` | Documenta respuestas |
| `@ApiBody({ type })` | Documenta el body |
| `@ApiQuery({ name, type, required })` | Documenta query params |
| `@ApiBearerAuth()` | Indica autenticación JWT |

---

## 📝 DTOs (Data Transfer Objects)

Los DTOs definen la **estructura y validación** de los datos de entrada.

### Ubicación
```
src/dto/create-[entidad].dto.ts
src/dto/update-[entidad].dto.ts
```

### Convenciones

- **Archivo Create**: `create-[entidad].dto.ts` (ej: `create-vendedor.dto.ts`)
- **Archivo Update**: `update-[entidad].dto.ts` (ej: `update-vendedor.dto.ts`)
- **Clase Create**: `Create[Entidad]Dto` (ej: `CreateVendedorDto`)
- **Clase Update**: `Update[Entidad]Dto` (ej: `UpdateVendedorDto`)

### Ejemplo: `create-vendedor.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsUUID,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateVendedorDto {
  @ApiProperty({ 
    description: 'Nombres del vendedor', 
    example: 'Juan Carlos',
  })
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString()
  @Length(1, 100)
  nombres: string;

  @ApiProperty({ 
    description: 'Apellidos del vendedor', 
    example: 'Pérez García',
  })
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString()
  @Length(1, 100)
  apellidos: string;

  @ApiProperty({ 
    description: 'Email del vendedor', 
    example: 'juan.perez@email.com',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @ApiProperty({ 
    description: 'Teléfono del vendedor', 
    example: '+51 925 757 151',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ 
    description: 'Documento de identidad', 
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  documentoIdentidad?: string;

  @ApiProperty({ 
    description: 'Porcentaje de comisión (0-100)', 
    example: 10.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'La comisión no puede ser negativa' })
  @Max(100, { message: 'La comisión no puede exceder 100%' })
  porcentajeComision?: number;

  @ApiProperty({ 
    description: 'ID del usuario asociado', 
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsUUID('4', { message: 'Debe ser un UUID válido' })
  usuarioId: string;
}
```

### Ejemplo: `update-vendedor.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  IsEmail, 
  IsBoolean,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';

export class UpdateVendedorDto {
  @ApiProperty({ 
    description: 'Nombres del vendedor', 
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombres?: string;

  @ApiProperty({ 
    description: 'Apellidos del vendedor', 
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidos?: string;

  @ApiProperty({ 
    description: 'Email del vendedor', 
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @ApiProperty({ 
    description: 'Teléfono del vendedor', 
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ 
    description: 'Documento de identidad', 
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  documentoIdentidad?: string;

  @ApiProperty({ 
    description: 'Porcentaje de comisión (0-100)', 
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeComision?: number;

  @ApiProperty({ 
    description: 'Estado activo/inactivo', 
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
```

### Exportar DTOs en `dto/index.ts`

```typescript
// src/dto/index.ts
export { CreateVendedorDto } from './create-vendedor.dto';
export { UpdateVendedorDto } from './update-vendedor.dto';
// ... otros DTOs
```

### Validadores Comunes de class-validator

| Validador | Uso | Ejemplo |
|-----------|-----|---------|
| `@IsNotEmpty()` | Campo requerido | `@IsNotEmpty({ message: 'Campo requerido' })` |
| `@IsOptional()` | Campo opcional | `@IsOptional()` |
| `@IsString()` | Debe ser string | `@IsString()` |
| `@IsNumber()` | Debe ser número | `@IsNumber()` |
| `@IsBoolean()` | Debe ser boolean | `@IsBoolean()` |
| `@IsEmail()` | Debe ser email | `@IsEmail({}, { message: 'Email inválido' })` |
| `@IsUUID()` | Debe ser UUID | `@IsUUID('4')` |
| `@IsDate()` | Debe ser fecha | `@IsDate()` |
| `@IsEnum()` | Debe ser enum | `@IsEnum(MiEnum)` |
| `@Length(min, max)` | Longitud de string | `@Length(1, 100)` |
| `@Min(value)` | Valor mínimo | `@Min(0)` |
| `@Max(value)` | Valor máximo | `@Max(100)` |
| `@IsArray()` | Debe ser array | `@IsArray()` |
| `@ValidateNested()` | Validar objeto anidado | `@ValidateNested()` |

---

## 🔢 Enums

Los enums se usan para definir **valores constantes** y se crean **SIEMPRE de forma específica en cada microservicio**.

### ⚠️ IMPORTANTE: NO usar Enums Globales

- ❌ **NO** crear enums en `libs/common/src/enums/`
- ✅ **SÍ** crear enums en cada microservicio según necesidad
- ✅ Cada microservicio tiene sus propios enums independientes
- ✅ Si dos servicios necesitan el mismo enum, se duplica en ambos

### Ubicación

Los enums se crean **SOLO en el microservicio específico**:

```
apps/[nombre-service]/src/enums/index.ts
```

### ¿Cuándo Crear Carpeta `enums/`?

La carpeta `enums/` y el archivo `index.ts` se crean **solo si la entidad de ese microservicio incluye enums**. Si no hay enums, no es necesario crear la carpeta.

### Ejemplo: Enums en `apps/clients-service/src/enums/index.ts`

```typescript
// Enums específicos del servicio de clientes
export enum TipoPersona {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA',
}

export enum TipoDocumento {
  DNI = 'DNI',
  CARNET_EXTRANJERIA = 'CE',
  PASAPORTE = 'PASAPORTE',
  RUC = 'RUC',
}

export enum EstadoCivil {
  SOLTERO = 'SOLTERO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUDO = 'VIUDO',
  CONVIVIENTE = 'CONVIVIENTE',
}
```

### Ejemplo: Enums en `apps/products-service/src/enums/index.ts`

```typescript
// Enums específicos del servicio de productos
export enum EstadoPoliza {
  ACTIVA = 'ACTIVA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA',
  SUSPENDIDA = 'SUSPENDIDA',
}

export enum FrecuenciaPago {
  MENSUAL = 'MENSUAL',
  BIMESTRAL = 'BIMESTRAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
}

export enum TipoSeguro {
  VIDA = 'VIDA',
  SALUD = 'SALUD',
  VEHICULAR = 'VEHICULAR',
  HOGAR = 'HOGAR',
  SCTR = 'SCTR',
}
```

### Ejemplo: Enums en `apps/activities-service/src/enums/index.ts`

```typescript
// Enums específicos del servicio de actividades
export enum TipoActividad {
  LLAMADA = 'LLAMADA',
  EMAIL = 'EMAIL',
  REUNION = 'REUNION',
  VISITA = 'VISITA',
  COTIZACION = 'COTIZACION',
  SEGUIMIENTO = 'SEGUIMIENTO',
}

export enum PrioridadActividad {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}
```

### Uso de Enums en Entidades

```typescript
// Importar desde el mismo microservicio
import { TipoPersona, TipoDocumento } from '../enums';

@Entity('cliente')
export class Cliente {
  @Column({ 
    type: 'enum', 
    enum: TipoPersona,
    name: 'tipo_persona',
  })
  tipoPersona: TipoPersona;

  @Column({ 
    type: 'enum', 
    enum: TipoDocumento,
    name: 'tipo_documento',
  })
  tipoDocumento: TipoDocumento;
}
```

### Convenciones de Enums

1. **Naming**: PascalCase para el nombre del enum (ej: `TipoPersona`)
2. **Valores**: UPPER_SNAKE_CASE (ej: `NATURAL`, `JURIDICA`)
3. **Ubicación**: SIEMPRE específicos en `apps/[service]/src/enums/`, NUNCA globales
4. **Exportación**: Todos los enums se exportan en `index.ts`
5. **Duplicación**: Si dos servicios necesitan el mismo enum, se duplica en ambos

### ⚠️ Regla de Oro de Enums

**Cada microservicio es independiente y tiene sus propios enums. NO compartir enums entre servicios.**

---

## 🧩 Module Principal

El módulo principal del microservicio importa y configura todos los componentes.

### Ubicación
```
src/[nombre-service].module.ts
```

### Ejemplo: `clientes-service.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// 1️⃣ Importar Controladores
import { 
  ClientesController, 
  ContactosClienteController,
} from './controllers';

// 2️⃣ Importar Servicios
import { 
  ClientesService, 
  ContactosClienteService,
} from './services';

// 3️⃣ Importar Entidades
import { 
  Cliente, 
  ClienteContacto, 
  ClienteDocumento,
} from './entities';

// 4️⃣ Importar Estrategias
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'austral_seguros'),
        entities: [Cliente, ClienteContacto, ClienteDocumento], // 5️⃣ Entidades
        synchronize: false, // ⚠️ NUNCA usar en producción
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Registrar entidades para este módulo
    TypeOrmModule.forFeature([Cliente, ClienteContacto, ClienteDocumento]),

    // Autenticación JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'austral-jwt-secret-2024'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
  ],

  // 6️⃣ Registrar Controladores
  controllers: [ClientesController, ContactosClienteController],

  // 7️⃣ Registrar Servicios y Estrategias
  providers: [ClientesService, ContactosClienteService, JwtStrategy],

  // 8️⃣ Exportar Servicios para usar en otros módulos
  exports: [ClientesService, ContactosClienteService],
})
export class ClientsServiceModule {}
```

### Pasos para Configurar el Module

1. ✅ **Importar Controllers** desde `./controllers`
2. ✅ **Importar Services** desde `./services`
3. ✅ **Importar Entities** desde `./entities`
4. ✅ **Configurar TypeORM** con las entidades
5. ✅ **Registrar Controllers** en el array `controllers: []`
6. ✅ **Registrar Providers** (services, strategies) en `providers: []`
7. ✅ **Exportar Services** en `exports: []` si otros módulos los usarán

---

## 📋 Convenciones y Mejores Prácticas

### 1. **Naming Conventions**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Entidades | PascalCase | `Cliente`, `Vendedor` |
| Archivos de entidades | kebab-case.entity.ts | `cliente.entity.ts` |
| Servicios | PascalCase + Service | `ClientesService` |
| Archivos de servicios | kebab-case.service.ts | `clientes.service.ts` |
| Controladores | PascalCase + Controller | `ClientesController` |
| Archivos de controladores | kebab-case.controller.ts | `clientes.controller.ts` |
| DTOs | PascalCase + Dto | `CreateClienteDto` |
| Archivos de DTOs | kebab-case.dto.ts | `create-cliente.dto.ts` |
| **Propiedades de clase** | **camelCase (OBLIGATORIO)** | **`idCliente`, `fechaCreacion`, `nombreCompleto`** |
| Columnas de BD | snake_case | `id_cliente`, `fecha_creacion` |
| Enums | PascalCase | `TipoPersona`, `EstadoPoliza` |
| Valores de Enum | UPPER_SNAKE_CASE | `NATURAL`, `ACTIVA` |
| Variables | camelCase | `cliente`, `nombreUsuario` |
| Funciones/Métodos | camelCase | `findAll()`, `crearCliente()` |

### ⚠️ REGLA CRÍTICA: TODO en camelCase

**TODAS las propiedades, variables, parámetros y nombres de campos DEBEN estar en camelCase.**

✅ **CORRECTO**:
```typescript
export class Cliente {
  idCliente: string;           // ✅ camelCase
  nombreCompleto: string;      // ✅ camelCase
  fechaCreacion: Date;         // ✅ camelCase
  emailNotificaciones: string; // ✅ camelCase
}
```

❌ **INCORRECTO**:
```typescript
export class Cliente {
  id_cliente: string;           // ❌ snake_case
  NombreCompleto: string;       // ❌ PascalCase
  fecha_creacion: Date;         // ❌ snake_case
  email_notificaciones: string; // ❌ snake_case
}
```

### 2. **Estructura de Archivos**

```typescript
// ============================================================================
// IMPORTS
// ============================================================================
import { Entity, Column } from 'typeorm';

// ============================================================================
// DECORADORES Y DEFINICIÓN DE CLASE
// ============================================================================
@Entity('nombre_tabla')
export class NombreEntidad {
  // ========================================================================
  // CLAVE PRIMARIA
  // ========================================================================
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========================================================================
  // CAMPOS DE INFORMACIÓN
  // ========================================================================
  @Column()
  campo: string;

  // ========================================================================
  // CAMPOS DE ESTADO Y CONTROL
  // ========================================================================
  @Column({ default: true })
  estaActivo: boolean;

  // ========================================================================
  // RELACIONES
  // ========================================================================
  @ManyToOne(() => OtraEntidad)
  relacion: OtraEntidad;

  // ========================================================================
  // CAMPOS DE AUDITORÍA
  // ========================================================================
  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
```

### 3. **Campos Obligatorios en Toda Entidad**

```typescript
// ✅ Clave primaria UUID
@PrimaryGeneratedColumn('uuid', { name: 'id_[entidad]' })
id[Entidad]: string;

// ✅ Fecha de creación (automática)
@CreateDateColumn({ name: 'fecha_creacion' })
fechaCreacion: Date;

// ✅ Fecha de actualización (automática) - OPCIONAL pero recomendada
@UpdateDateColumn({ name: 'fecha_actualizacion' })
fechaActualizacion: Date;

// ✅ Estado activo (para soft delete)
@Column({ type: 'boolean', default: true, name: 'esta_activo' })
estaActivo: boolean;
```

### 4. **Orden de Imports**

```typescript
// 1. Módulos de NestJS
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Módulos de TypeORM
import { Repository } from 'typeorm';

// 3. Entidades
import { Cliente } from '../entities/cliente.entity';

// 4. DTOs
import { CreateClienteDto } from '../dto';

// 5. Enums
import { TipoPersona } from '@app/common/enums';

// 6. Otros servicios
import { OtroServicio } from '../services/otro.service';
```

### 5. **Documentación con Swagger**

```typescript
// En Controladores
@ApiTags('nombre-recurso')           // Agrupar en Swagger
@ApiOperation({ summary, description }) // Describir endpoint
@ApiResponse({ status, description })   // Documentar respuestas
@ApiBearerAuth()                        // Indicar autenticación

// En DTOs
@ApiProperty({ 
  description: 'Descripción del campo',
  example: 'Valor de ejemplo',
  required: false,  // Si es opcional
})
```

### 6. **Validaciones Progresivas**

1. **Primera Versión**: CRUD básico sin validaciones complejas
2. **Segunda Versión**: Agregar validaciones de negocio
3. **Tercera Versión**: Agregar validaciones de permisos y roles
4. **Cuarta Versión**: Agregar endpoints adicionales según necesidad

### 7. **Manejo de Errores**

```typescript
// Usar excepciones de NestJS
throw new NotFoundException('Recurso no encontrado');
throw new BadRequestException('Datos inválidos');
throw new UnauthorizedException('No autorizado');
throw new ForbiddenException('Acceso denegado');
throw new ConflictException('Conflicto con estado actual');
```

### 8. **Soft Delete vs Hard Delete**

```typescript
// ✅ PREFERIDO: Soft Delete
async remove(id: string): Promise<void> {
  const entidad = await this.findOne(id);
  entidad.estaActivo = false;
  await this.repository.save(entidad);
}

// ❌ EVITAR: Hard Delete (salvo casos específicos)
async remove(id: string): Promise<void> {
  await this.repository.delete(id);
}
```

---

## ✅ Checklist para Crear una Nueva Entidad

### Paso 1: Crear la Entidad
- [ ] Crear archivo `src/entities/[entidad].entity.ts`
- [ ] Definir clase con decorador `@Entity('nombre_tabla')`
- [ ] Agregar `@PrimaryGeneratedColumn('uuid')`
- [ ] Definir todas las propiedades con `@Column()`
- [ ] Agregar `@CreateDateColumn()` para `fechaCreacion`
- [ ] Agregar `@UpdateDateColumn()` para `fechaActualizacion`
- [ ] Agregar índices con `@Index()` para optimización
- [ ] Definir relaciones si es necesario
- [ ] Exportar la entidad en `src/entities/index.ts`

### Paso 2: Crear Enums (si la entidad los necesita)
- [ ] Crear carpeta `src/enums/` si no existe
- [ ] Crear archivo `src/enums/index.ts` si no existe
- [ ] Definir enums necesarios en `src/enums/index.ts`
- [ ] Exportar todos los enums

### Paso 3: Crear DTOs
- [ ] Crear archivo `src/dto/create-[entidad].dto.ts`
- [ ] Definir clase `Create[Entidad]Dto` con validaciones
- [ ] Agregar decoradores de Swagger `@ApiProperty()`
- [ ] Agregar decoradores de validación (class-validator)
- [ ] Crear archivo `src/dto/update-[entidad].dto.ts`
- [ ] Definir clase `Update[Entidad]Dto` (todos los campos opcionales)
- [ ] Exportar ambos DTOs en `src/dto/index.ts`

### Paso 4: Crear el Servicio
- [ ] Crear archivo `src/services/[entidad].service.ts`
- [ ] Definir clase con decorador `@Injectable()`
- [ ] Inyectar el repositorio con `@InjectRepository()`
- [ ] Implementar método `findAll()` con filtros opcionales
- [ ] Implementar método `findOne(id)` con validación de existencia
- [ ] Implementar método `create(dto)` **sin validaciones complejas**
- [ ] Implementar método `update(id, dto)` **sin validaciones complejas**
- [ ] Implementar método `remove(id)` con soft delete
- [ ] Exportar el servicio en `src/services/index.ts`

### Paso 5: Crear el Controlador
- [ ] Crear archivo `src/controllers/[entidad].controller.ts`
- [ ] Definir clase con decoradores `@Controller()`, `@ApiTags()`
- [ ] Inyectar el servicio en el constructor
- [ ] Implementar endpoint GET `/` (findAll)
- [ ] Implementar endpoint GET `/:id` (findOne)
- [ ] Implementar endpoint POST `/` (create)
- [ ] Implementar endpoint PATCH `/:id` (update)
- [ ] Implementar endpoint DELETE `/:id` (remove)
- [ ] Agregar documentación de Swagger a cada endpoint
- [ ] Agregar guards de autenticación `@UseGuards(JwtAuthGuard)`
- [ ] Exportar el controlador en `src/controllers/index.ts`

### Paso 6: Actualizar el Module
- [ ] Abrir `src/[nombre-service].module.ts`
- [ ] Importar la nueva entidad desde `./entities`
- [ ] Agregar la entidad al array `entities: []` en TypeORM config
- [ ] Agregar la entidad a `TypeOrmModule.forFeature([...])`
- [ ] Importar el nuevo servicio desde `./services`
- [ ] Agregar el servicio al array `providers: []`
- [ ] Importar el nuevo controlador desde `./controllers`
- [ ] Agregar el controlador al array `controllers: []`
- [ ] (Opcional) Exportar el servicio en `exports: []` si otros módulos lo usarán

### Paso 7: Actualizar la Base de Datos (SQL)
- [ ] Agregar la tabla al archivo `bd-final.sql`
- [ ] Incluir todos los campos definidos en la entidad
- [ ] Crear índices correspondientes
- [ ] Agregar foreign keys si hay relaciones
- [ ] Ejecutar el script SQL en la base de datos de desarrollo

### Paso 8: Validaciones Finales
- [ ] Compilar el proyecto: `npm run build`
- [ ] Verificar que no hay errores de TypeScript
- [ ] Iniciar el servicio: `npm run start:dev`
- [ ] Probar endpoints en Swagger (http://localhost:[puerto]/api)
- [ ] Probar crear un registro
- [ ] Probar listar registros
- [ ] Probar obtener un registro por ID
- [ ] Probar actualizar un registro
- [ ] Probar eliminar un registro (soft delete)

---

## 📚 Ejemplo Completo: Entity Cliente

A continuación un ejemplo completo de todos los archivos necesarios para una entidad.

### 1. Entity: `cliente.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ClienteContacto } from './cliente-contacto.entity';

@Entity('cliente')
@Index('idx_cliente_activo', ['estaActivo'])
@Index('idx_cliente_documento', ['numeroDocumento'])
@Index('idx_cliente_email', ['emailNotificaciones'])
export class Cliente {
  @PrimaryGeneratedColumn('uuid', { name: 'id_cliente' })
  idCliente: string;

  @Column({ type: 'varchar', length: 20, name: 'tipo_persona' })
  tipoPersona: string; // 'NATURAL' o 'JURIDICA'

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'razon_social' })
  razonSocial?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombres?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellidos?: string;

  @Column({ type: 'varchar', length: 20, name: 'tipo_documento' })
  tipoDocumento: string;

  @Column({ type: 'varchar', length: 20, name: 'numero_documento' })
  numeroDocumento: string;

  @Column({ type: 'text' })
  direccion: string;

  @Column({ type: 'varchar', length: 20, name: 'telefono_1' })
  telefono1: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'telefono_2' })
  telefono2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email_notificaciones' })
  emailNotificaciones?: string;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @OneToMany(() => ClienteContacto, contacto => contacto.cliente)
  contactos: ClienteContacto[];

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
```

### 2. DTO Create: `create-cliente.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ description: 'Tipo de persona', example: 'NATURAL' })
  @IsNotEmpty()
  @IsString()
  tipoPersona: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'DNI' })
  @IsNotEmpty()
  @IsString()
  tipoDocumento: string;

  @ApiProperty({ description: 'Número de documento', example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  numeroDocumento: string;

  @ApiProperty({ description: 'Nombres', required: false })
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiProperty({ description: 'Apellidos', required: false })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiProperty({ description: 'Razón social', required: false })
  @IsOptional()
  @IsString()
  razonSocial?: string;

  @ApiProperty({ description: 'Teléfono principal', example: '925757151' })
  @IsNotEmpty()
  @IsString()
  telefono1: string;

  @ApiProperty({ description: 'Email notificaciones', required: false })
  @IsOptional()
  @IsEmail()
  emailNotificaciones?: string;

  @ApiProperty({ description: 'Dirección', example: 'Av. Siempre Viva 123' })
  @IsNotEmpty()
  @IsString()
  direccion: string;
}
```

### 3. DTO Update: `update-cliente.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateClienteDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefono1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  emailNotificaciones?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
```

### 4. Service: `clientes.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    cliente.estaActivo = false;
    await this.clienteRepository.save(cliente);
  }
}
```

### 5. Controller: `clientes.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from '../services/clientes.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

@ApiTags('clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo cliente' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cliente (soft delete)' })
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }
}
```

---

## 🎯 Resumen de Principios Clave

1. **Arquitectura de Microservicios**: Cada dominio es independiente
2. **⚠️ camelCase OBLIGATORIO**: Todas las propiedades, variables y datos en camelCase
3. **TypeORM para ORM**: Entidades con decoradores para mapeo a BD
4. **Auditoría Automática**: Siempre incluir `fechaCreacion` y `fechaActualizacion`
5. **DTOs con Validación**: Validar datos de entrada con class-validator
6. **Swagger Automático**: Documentar todos los endpoints
7. **CRUD Básico Primero**: Implementar CRUD sin validaciones complejas
8. **Validaciones Progresivas**: Agregar validaciones conforme se necesiten
9. **Soft Delete**: Preferir `estaActivo = false` sobre delete físico
10. **⚠️ Enums Específicos**: NUNCA usar enums globales, siempre específicos por microservicio
11. **Separación de Responsabilidades**:
    - **Entities**: Representan tablas de BD
    - **DTOs**: Validan datos de entrada
    - **Services**: Lógica de negocio
    - **Controllers**: Endpoints HTTP
12. **Naming Conventions**: Seguir convenciones establecidas (camelCase para datos)
13. **Index Exportation**: Exportar en `index.ts` para imports limpios
14. **Module Registration**: Registrar todo en el módulo principal

---

## 📖 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI](https://swagger.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Última actualización**: 4 de noviembre de 2025
