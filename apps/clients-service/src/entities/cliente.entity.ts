import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity, TipoDocumento, EstadoCivil } from 'y/common';

@Entity('cliente')
@Index('idx_cliente_activo', ['estaActivo'])
@Index('idx_cliente_documento', ['documentoIdentidad'])
@Index('idx_cliente_email', ['email'])
@Index('idx_cliente_cumpleanos', ['fechaNacimiento'])
@Index('idx_cliente_broker', ['brokerAsignado'])
export class Cliente extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'telefono_secundario',
  })
  telefonoSecundario?: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    name: 'documento_identidad',
  })
  documentoIdentidad: string;

  @Column({
    type: 'enum',
    enum: TipoDocumento,
    name: 'tipo_documento',
  })
  tipoDocumento: TipoDocumento;

  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @Column({ type: 'text' })
  direccion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  distrito?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ocupacion?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  empresa?: string;

  @Column({
    type: 'enum',
    enum: EstadoCivil,
    nullable: true,
    name: 'estado_civil',
  })
  estadoCivil?: EstadoCivil;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'contacto_emergencia_nombre',
  })
  contactoEmergenciaNombre?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'contacto_emergencia_telefono',
  })
  contactoEmergenciaTelefono?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'contacto_emergencia_relacion',
  })
  contactoEmergenciaRelacion?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_registro',
  })
  fechaRegistro: Date;

  @Column({ type: 'uuid', nullable: true, name: 'id_lead' })
  idLead?: string;

  @Column({ type: 'uuid', nullable: true, name: 'broker_asignado' })
  brokerAsignado?: string;
}
