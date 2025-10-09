import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController, ContactosClienteController } from './controllers';
import { ClientesService, ContactosClienteService } from './services';
import { Cliente, ContactoCliente, Beneficiario } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, ContactoCliente, Beneficiario])],
  controllers: [ClientesController, ContactosClienteController],
  providers: [ClientesService, ContactosClienteService],
  exports: [ClientesService, ContactosClienteService],
})
export class ClientsServiceModule {}
