import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('cliente_contacto')
@Index('idx_cliente_contacto_cliente', ['idCliente'])
export class ClienteContacto {
  @PrimaryGeneratedColumn('uuid', { name: 'id_contacto' })
  idContacto: string;

  @Column({ type: 'uuid', name: 'id_cliente' })
  idCliente: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo?: string;

  @ManyToOne(() => Cliente, cliente => cliente.contactos)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
