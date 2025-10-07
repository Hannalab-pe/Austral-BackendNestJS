import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, TipoDocumento } from 'y/common';
import { Cliente } from './cliente.entity';

@Entity('beneficiario')
export class Beneficiario extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, name: 'documento_identidad' })
  documentoIdentidad: string;

  @Column({
    type: 'enum',
    enum: TipoDocumento,
    name: 'tipo_documento',
  })
  tipoDocumento: TipoDocumento;

  @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
  fechaNacimiento?: Date;

  @Column({ type: 'varchar', length: 50, name: 'relacion_con_asegurado' })
  relacionConAsegurado: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100.0,
    name: 'porcentaje_beneficio',
  })
  porcentajeBeneficio: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ type: 'uuid', name: 'id_cliente' })
  idCliente: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
