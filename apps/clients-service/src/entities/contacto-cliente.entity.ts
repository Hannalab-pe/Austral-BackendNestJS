import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contactos_cliente')
export class ContactoCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column()
  tipo: string; // 'telefono', 'email', 'direccion', etc.

  @Column()
  valor: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
