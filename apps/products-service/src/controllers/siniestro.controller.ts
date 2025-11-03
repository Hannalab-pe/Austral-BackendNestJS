import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SiniestroService } from '../services/siniestro.service';

@Controller('siniestros')
export class SiniestroController {
  constructor(private readonly siniestroService: SiniestroService) {}

  @Get()
  findAll() {
    return this.siniestroService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.siniestroService.findById(id);
  }

  @Get('poliza/:idPoliza')
  findByPoliza(@Param('idPoliza') idPoliza: string) {
    return this.siniestroService.findByPoliza(idPoliza);
  }

  @Post()
  create(@Body() data: any) {
    return this.siniestroService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.siniestroService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.siniestroService.delete(id);
  }
}
