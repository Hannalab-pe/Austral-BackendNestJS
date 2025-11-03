import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PrimaService } from '../services/prima.service';

@Controller('primas')
export class PrimaController {
  constructor(private readonly primaService: PrimaService) {}

  @Get()
  findAll() {
    return this.primaService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.primaService.findById(id);
  }

  @Get('poliza/:idPoliza')
  findByPoliza(@Param('idPoliza') idPoliza: string) {
    return this.primaService.findByPoliza(idPoliza);
  }

  @Post()
  create(@Body() data: any) {
    return this.primaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.primaService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.primaService.delete(id);
  }
}
