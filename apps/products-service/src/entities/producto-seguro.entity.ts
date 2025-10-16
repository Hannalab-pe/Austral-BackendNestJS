import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompaniaSeguro } from './compania-seguro.entity';
import { TipoSeguro } from './tipo-seguro.entity';

@Entity('producto_seguro')
export class ProductoSeguro {
  @PrimaryGeneratedColumn('uuid', { name: 'id_producto' })
  idProducto: string;

  @Column({ type: 'varchar', length: 200, name: 'nombre' })
  nombre: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion' })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'codigo_producto' })
  codigoProducto?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'prima_base' })
  primaBase?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'prima_minima' })
  primaMinima?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'prima_maxima' })
  primaMaxima?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0, nullable: true, name: 'porcentaje_comision' })
  porcentajeComision?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'cobertura_maxima' })
  coberturaMaxima?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'deducible' })
  deducible?: number;

  @Column({ type: 'int', nullable: true, name: 'edad_minima' })
  edadMinima?: number;

  @Column({ type: 'int', nullable: true, name: 'edad_maxima' })
  edadMaxima?: number;

  @Column({ type: 'text', nullable: true, name: 'condiciones_especiales' })
  condicionesEspeciales?: string;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column({ type: 'uuid', name: 'id_compania' })
  idCompania: string;

  @Column({ type: 'uuid', name: 'id_tipo_seguro' })
  idTipoSeguro: string;

  @ManyToOne(() => CompaniaSeguro, (compania) => compania.productos)
  @JoinColumn({ name: 'id_compania' })
  compania: CompaniaSeguro;

  @ManyToOne(() => TipoSeguro, (tipo) => tipo.productos)
  @JoinColumn({ name: 'id_tipo_seguro' })
  tipoSeguro: TipoSeguro;
}
