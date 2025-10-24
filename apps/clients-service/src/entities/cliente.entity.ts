import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ClienteContacto } from './cliente-contacto.entity';
import { ClienteDocumento } from './cliente-documento.entity';

@Entity('cliente')
@Index('idx_cliente_activo', ['estaActivo'])
@Index('idx_cliente_asignado', ['asignadoA'])
@Index('idx_cliente_cumpleanos', ['cumpleanos'])
@Index('idx_cliente_documento', ['numeroDocumento'])
@Index('idx_cliente_email_notif', ['emailNotificaciones'])
@Index('idx_cliente_registrado_por', ['registradoPor'])
@Index('idx_cliente_tipo_persona', ['tipoPersona'])
export class Cliente {
  @PrimaryGeneratedColumn('uuid', { name: 'id_cliente' })
  idCliente: string;

  @Column({ type: 'varchar', length: 20, name: 'tipo_persona' })
  tipoPersona: string; // 'NATURAL' o 'JURIDICO'

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'razon_social' })
  razonSocial?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombres?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellidos?: string;

  @Column({ type: 'varchar', length: 20, name: 'tipo_documento' })
  tipoDocumento: string;

  @Column({ type: 'varchar', length: 20, name: 'numero_documento' })
  numeroDocumento: string;

  @Column({ type: 'text' })
  direccion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  distrito?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string;

  @Column({ type: 'varchar', length: 20, name: 'telefono_1' })
  telefono1: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'telefono_2' })
  telefono2?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  whatsapp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email_notificaciones' })
  emailNotificaciones?: string;

  @Column({ type: 'boolean', default: true, name: 'recibir_notificaciones' })
  recibirNotificaciones: boolean;

  @Column({ type: 'date', nullable: true })
  cumpleanos?: Date;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'id_lead' })
  idLead?: string;

  @Column({ type: 'uuid', nullable: true, name: 'asignado_a' })
  asignadoA?: string;

  @Column({ type: 'uuid', nullable: true, name: 'registrado_por' })
  registradoPor?: string;

  @OneToMany(() => ClienteContacto, contacto => contacto.cliente)
  contactos: ClienteContacto[];

  @OneToMany(() => ClienteDocumento, documento => documento.cliente)
  documentos: ClienteDocumento[];

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;
}
