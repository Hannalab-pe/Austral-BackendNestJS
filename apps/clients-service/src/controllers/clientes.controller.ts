import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ClientesService, ClienteFiltros } from '../services/clientes.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

@ApiTags('clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo cliente con asignación automática de broker',
    description: 'Crea un nuevo cliente y asigna automáticamente registrado_por y broker_asignado según la jerarquía',
  })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o email/documento duplicado',
  })
  async create(
    @Body() createClienteDto: CreateClienteDto,
    @Request() req: any,
  ): Promise<Cliente> {
    // Obtener información del usuario autenticado
    const userId = req.user.idUsuario;
    const userRole = req.user.rol?.nombre || '';
    const userSupervisorId = req.user.supervisorId || null;

    // Crear el cliente con asignación automática de campos
    return this.clientesService.create(
      createClienteDto,
      userId,
      userRole,
      userSupervisorId,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener clientes según jerarquía',
    description: 'Lista clientes filtrados según los permisos del usuario autenticado (Admin ve todos, Broker ve los suyos, Vendedor ve los suyos)',
  })
  @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente según jerarquía',
  })
  async findAll(
    @Request() req: any,
    @Query('esta_activo') esta_activo?: string,
    @Query('search') search?: string,
  ): Promise<Cliente[]> {
    const filtros: ClienteFiltros = {};

    if (esta_activo !== undefined) {
      filtros.estaActivo = esta_activo === 'true';
    }

    if (search) {
      filtros.search = search;
    }

    // Aplicar filtros de jerarquía según el usuario autenticado
    return this.clientesService.findClientesByHierarchy(
      req.user.idUsuario,
      req.user.rol?.nombre || '',
      req.user.supervisorId || null,
      filtros,
    );
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Obtener clientes paginados',
    description: 'Lista clientes con paginación y filtros',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de clientes obtenida exitosamente',
  })
  async findAllPaginated(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('esta_activo') esta_activo?: string,
    @Query('search') search?: string,
  ) {
    const filtros: ClienteFiltros = {};

    if (esta_activo !== undefined) {
      filtros.estaActivo = esta_activo === 'true';
    }

    if (search) {
      filtros.search = search;
    }

    // Obtener clientes filtrados por jerarquía
    const allClientes = await this.clientesService.findClientesByHierarchy(
      req.user.idUsuario,
      req.user.rol?.nombre || '',
      req.user.supervisorId || null,
      filtros,
    );

    // Aplicar paginación manualmente
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClientes = allClientes.slice(startIndex, endIndex);

    return {
      data: paginatedClientes,
      total: allClientes.length,
      page,
      limit,
      totalPages: Math.ceil(allClientes.length / limit),
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas de clientes',
    description: 'Retorna estadísticas generales de los clientes',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  async getStats() {
    return this.clientesService.getStats();
  }

  @Get('cumpleanos-proximos')
  @ApiOperation({
    summary: 'Obtener cumpleaños próximos',
    description: 'Retorna lista de clientes con cumpleaños próximos en los próximos días',
  })
  @ApiQuery({ name: 'dias', required: false, type: Number, example: 30 })
  @ApiResponse({
    status: 200,
    description: 'Cumpleaños próximos obtenidos exitosamente',
  })
  async getCumpleanosProximos(
    @Query('dias', new DefaultValuePipe(30), ParseIntPipe) dias: number,
  ): Promise<Cliente[]> {
    return this.clientesService.getCumpleanosProximos(dias);
  }

  @Get('broker/:brokerId')
  @ApiOperation({
    summary: 'Obtener clientes por broker',
    description: 'Lista todos los clientes asignados a un broker específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes por broker obtenida exitosamente',
  })
  async findByBroker(@Param('brokerId') brokerId: string): Promise<Cliente[]> {
    return this.clientesService.findByBroker(brokerId);
  }

  @Get('documento/:tipoDocumento/:documentoIdentidad')
  @ApiOperation({
    summary: 'Buscar cliente por documento',
    description: 'Busca un cliente por tipo y número de documento',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async findByDocumento(
    @Param('tipoDocumento') tipoDocumento: string,
    @Param('documentoIdentidad') documentoIdentidad: string,
  ): Promise<Cliente | null> {
    return this.clientesService.findByDocumento(tipoDocumento, documentoIdentidad);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cliente por ID',
    description: 'Retorna la información de un cliente específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<Cliente> {
    return this.clientesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar cliente',
    description: 'Actualiza la información de un cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email o documento ya en uso',
  })
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.clientesService.update(id, updateData);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activar cliente',
    description: 'Activa un cliente desactivado',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente activado exitosamente',
  })
  async activate(@Param('id') id: string): Promise<Cliente> {
    return this.clientesService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desactivar cliente',
    description: 'Desactiva un cliente (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente desactivado exitosamente',
  })
  async deactivate(@Param('id') id: string): Promise<{ message: string }> {
    await this.clientesService.deactivate(id);
    return { message: 'Cliente desactivado exitosamente' };
  }
}
