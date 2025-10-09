import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductosController,
  CategoriasProductoController,
  CompaniasController,
} from './controllers';
import {
  ProductosService,
  CategoriasProductoService,
  CompaniasService,
} from './services';
import { Producto, CategoriaProducto, Compania } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, CategoriaProducto, Compania])],
  controllers: [
    ProductosController,
    CategoriasProductoController,
    CompaniasController,
  ],
  providers: [ProductosService, CategoriasProductoService, CompaniasService],
  exports: [ProductosService, CategoriasProductoService, CompaniasService],
})
export class ProductsServiceModule {}
