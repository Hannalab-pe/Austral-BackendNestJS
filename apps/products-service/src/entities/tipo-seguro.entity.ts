import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductoSeguro } from './producto-seguro.entity';

@Entity('tipo_seguro')
export class TipoSeguro {
  @PrimaryGeneratedColumn('uuid', { name: 'id_tipo_seguro' })
  idTipoSeguro: string;

  @Column({ type: 'varchar', length: 150, name: 'nombre' })
  nombre: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion' })
  descripcion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'categoria' })
  categoria?: string;

  @Column({ type: 'boolean', default: false, nullable: true, name: 'requiere_inspeccion' })
  requiereInspeccion?: boolean;

  @Column({ type: 'int', default: 12, nullable: true, name: 'duracion_minima_meses' })
  duracionMinimaMeses?: number;

  @Column({ type: 'int', default: 60, nullable: true, name: 'duracion_maxima_meses' })
  duracionMaximaMeses?: number;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany(() => ProductoSeguro, (producto) => producto.tipoSeguro)
  productos?: ProductoSeguro[];
}
