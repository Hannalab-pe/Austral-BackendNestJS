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
import { ContactosClienteService } from '../services/contactos-cliente.service';
import { CreateContactoClienteDto, UpdateContactoClienteDto } from '../dto';

@Controller('contactos-cliente')
export class ContactosClienteController {
  constructor(private readonly contactosService: ContactosClienteService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.contactosService.findAll(page, limit);
  }

  @Get('cliente/:clienteId')
  async findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return await this.contactosService.findByCliente(clienteId);
  }

  @Get('tipo/:tipo')
  async findByTipo(@Param('tipo') tipo: string) {
    return await this.contactosService.findByTipo(tipo);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.contactosService.findOne(id);
  }

  @Post()
  async create(@Body() createContactoDto: CreateContactoClienteDto) {
    return await this.contactosService.create(createContactoDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactoDto: UpdateContactoClienteDto,
  ) {
    return await this.contactosService.update(id, updateContactoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.contactosService.remove(id);
  }
}
