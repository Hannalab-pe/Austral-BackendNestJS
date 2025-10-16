import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductoSeguro } from './producto-seguro.entity';

@Entity('compania_seguro')
export class CompaniaSeguro {
  @PrimaryGeneratedColumn('uuid', { name: 'id_compania' })
  idCompania: string;

  @Column({ type: 'varchar', length: 200, name: 'nombre' })
  nombre: string;

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'razon_social' })
  razonSocial?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true, name: 'ruc' })
  ruc?: string;

  @Column({ type: 'text', nullable: true, name: 'direccion' })
  direccion?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'telefono' })
  telefono?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email' })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'sitio_web' })
  sitioWeb?: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'contacto_principal' })
  contactoPrincipal?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'telefono_contacto' })
  telefonoContacto?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email_contacto' })
  emailContacto?: string;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany(() => ProductoSeguro, (producto) => producto.compania)
  productos?: ProductoSeguro[];
}
