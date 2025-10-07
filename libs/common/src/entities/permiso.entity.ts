import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('permiso')
@Index('idx_permiso_modulo', ['modulo'])
export class Permiso extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50 })
  modulo: string;

  @Column({ type: 'varchar', length: 50 })
  accion: string;
}
