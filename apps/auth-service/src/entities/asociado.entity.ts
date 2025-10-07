import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from 'y/common';

@Entity('asociado')
@Index('idx_asociado_activo', ['estaActivo'])
export class Asociado extends BaseEntity {
  @Column({ type: 'varchar', length: 300, name: 'razon_social' })
  razonSocial: string;

  @Column({ type: 'varchar', length: 200, name: 'nombre_comercial' })
  nombreComercial: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  ruc?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'documento_representante',
  })
  documentoRepresentante?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'nombre_representante',
  })
  nombreRepresentante?: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.0,
    name: 'porcentaje_comision_base',
  })
  porcentajeComisionBase: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_registro',
  })
  fechaRegistro: Date;
}
