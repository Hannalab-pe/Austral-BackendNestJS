import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientesService } from '../services/clientes.service';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.clientesService.findAll(page, limit);
  }

  @Get('activos')
  async findActiveClients() {
    return await this.clientesService.findActiveClients();
  }

  @Get('documento/:tipoDocumento/:numeroDocumento')
  async findByDocumento(
    @Param('tipoDocumento') tipoDocumento: string,
    @Param('numeroDocumento') numeroDocumento: string,
  ) {
    return await this.clientesService.findByTipoDocumento(
      tipoDocumento,
      numeroDocumento,
    );
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.clientesService.findByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clientesService.findOne(id);
  }

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clientesService.create(createClienteDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return await this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.clientesService.remove(id);
  }
}
