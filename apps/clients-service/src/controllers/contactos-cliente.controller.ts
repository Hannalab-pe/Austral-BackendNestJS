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
  constructor(private readonly contactosService: ContactosClienteService) { }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.contactosService.findAll(page, limit);
  }

  @Get('cliente/:clienteId')
  async findByCliente(@Param('clienteId') clienteId: string) {
    return await this.contactosService.findByCliente(clienteId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactosService.findOne(id);
  }

  @Post()
  async create(@Body() createContactoDto: CreateContactoClienteDto) {
    return await this.contactosService.create(createContactoDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactoDto: UpdateContactoClienteDto,
  ) {
    return await this.contactosService.update(id, updateContactoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contactosService.remove(id);
  }
}
