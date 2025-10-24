import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Rol } from './rol.entity';
import { Vista } from './vista.entity';

@Entity('rol_vista')
@Index('idx_rol_vista_rol', ['idRol'])
@Index('idx_rol_vista_vista', ['idVista'])
export class RolVista {
  @PrimaryColumn('uuid', { name: 'id_rol' })
  idRol: string;

  @PrimaryColumn('uuid', { name: 'id_vista' })
  idVista: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Vista)
  @JoinColumn({ name: 'id_vista' })
  vista: Vista;
}