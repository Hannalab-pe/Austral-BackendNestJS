export class CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precioBase: number;
  categoriaId?: number;
  companiaId?: number;
  codigo?: string;
}
