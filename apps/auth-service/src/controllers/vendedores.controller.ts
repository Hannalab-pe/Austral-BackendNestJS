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
    Request,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { VendedoresService, VendedorFiltros } from '../services/vendedores.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateVendedorDto } from '../dto/create-vendedor.dto';
import { UpdateVendedorDto } from '../dto/update-vendedor.dto';

@ApiTags('vendedores')
@Controller('vendedores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendedoresController {
    constructor(private readonly vendedoresService: VendedoresService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear nuevo vendedor',
        description: 'Crea un nuevo vendedor y lo asigna automáticamente al broker autenticado',
    })
    @ApiBody({ type: CreateVendedorDto })
    @ApiResponse({
        status: 201,
        description: 'Vendedor creado exitosamente y asignado al broker',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos o usuario no es broker',
    })
    @ApiResponse({
        status: 409,
        description: 'Email o nombre de usuario ya existe',
    })
    async create(
        @Request() req: any,
        @Body() createVendedorDto: CreateVendedorDto,
    ) {
        const idBroker = req.user.userId; // ID del broker autenticado
        return this.vendedoresService.create(createVendedorDto, idBroker);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener vendedores del broker',
        description: 'Lista todos los vendedores asignados al broker autenticado',
    })
    @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Lista de vendedores obtenida exitosamente',
    })
    async findAll(
        @Request() req: any,
        @Query('esta_activo') esta_activo?: string,
        @Query('search') search?: string,
    ) {
        const idBroker = req.user.userId;
        const filtros: VendedorFiltros = {};

        if (esta_activo !== undefined) {
            filtros.estaActivo = esta_activo === 'true';
        }

        if (search) {
            filtros.search = search;
        }

        return this.vendedoresService.findAllByBroker(idBroker, filtros);
    }

    @Get('paginado')
    @ApiOperation({
        summary: 'Obtener vendedores con paginación',
        description: 'Lista vendedores del broker autenticado con paginación',
    })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de vendedores',
    })
    async findAllPaginated(
        @Request() req: any,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('esta_activo') esta_activo?: string,
        @Query('search') search?: string,
    ) {
        const idBroker = req.user.userId;
        const filtros: VendedorFiltros = {};

        if (esta_activo !== undefined) {
            filtros.estaActivo = esta_activo === 'true';
        }

        if (search) {
            filtros.search = search;
        }

        return this.vendedoresService.findAllByBrokerPaginated(
            idBroker,
            page,
            limit,
            filtros,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener vendedor por ID',
        description: 'Obtiene información detallada de un vendedor específico',
    })
    @ApiParam({ name: 'id', description: 'ID del vendedor' })
    @ApiResponse({
        status: 200,
        description: 'Vendedor encontrado',
    })
    @ApiResponse({
        status: 404,
        description: 'Vendedor no encontrado o no pertenece al broker',
    })
    async findOne(@Request() req: any, @Param('id') id: string) {
        const idBroker = req.user.userId;
        return this.vendedoresService.findOne(id, idBroker);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar vendedor',
        description: 'Actualiza información de un vendedor',
    })
    @ApiParam({ name: 'id', description: 'ID del vendedor' })
    @ApiBody({ type: UpdateVendedorDto })
    @ApiResponse({
        status: 200,
        description: 'Vendedor actualizado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Vendedor no encontrado o no pertenece al broker',
    })
    @ApiResponse({
        status: 409,
        description: 'Email o nombre de usuario ya existe',
    })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateVendedorDto: UpdateVendedorDto,
    ) {
        const idBroker = req.user.userId;
        return this.vendedoresService.update(id, idBroker, updateVendedorDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Desactivar vendedor',
        description: 'Desactiva un vendedor (no lo elimina físicamente)',
    })
    @ApiParam({ name: 'id', description: 'ID del vendedor' })
    @ApiResponse({
        status: 200,
        description: 'Vendedor desactivado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Vendedor no encontrado o no pertenece al broker',
    })
    async remove(@Request() req: any, @Param('id') id: string) {
        const idBroker = req.user.userId;
        await this.vendedoresService.remove(id, idBroker);
        return { message: 'Vendedor desactivado exitosamente' };
    }

    @Patch(':id/activar')
    @ApiOperation({
        summary: 'Reactivar vendedor',
        description: 'Reactiva un vendedor previamente desactivado',
    })
    @ApiParam({ name: 'id', description: 'ID del vendedor' })
    @ApiResponse({
        status: 200,
        description: 'Vendedor reactivado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Vendedor no encontrado o no pertenece al broker',
    })
    async activate(@Request() req: any, @Param('id') id: string) {
        const idBroker = req.user.userId;
        return this.vendedoresService.activate(id, idBroker);
    }
}
