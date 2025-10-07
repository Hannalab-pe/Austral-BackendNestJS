import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('rol_permiso')
@Unique(['idRol', 'idPermiso'])
export class RolPermiso extends BaseEntity {
  @Column({ type: 'uuid', name: 'id_rol' })
  idRol: string;

  @Column({ type: 'uuid', name: 'id_permiso' })
  idPermiso: string;

  // Las relaciones ManyToOne se definirán en cada microservicio según necesidad
}
