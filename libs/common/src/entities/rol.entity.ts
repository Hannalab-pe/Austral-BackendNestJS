import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('rol')
@Index('idx_rol_nombre', ['nombre'])
export class Rol extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'int', default: 1, name: 'nivel_acceso' })
  nivelAcceso: number;

  // Relaciones se definirán en cada microservicio según necesidad
}
