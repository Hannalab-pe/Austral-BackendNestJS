import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Vista } from './vista.entity';
import { Permiso } from './permiso.entity';

@Entity('rol_permiso_vista')
export class RolPermisoVista {
  @PrimaryColumn('uuid', { name: 'id_rol' })
  idRol: string;

  @PrimaryColumn('uuid', { name: 'id_vista' })
  idVista: string;

  @PrimaryColumn('uuid', { name: 'id_permiso' })
  idPermiso: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Vista)
  @JoinColumn({ name: 'id_vista' })
  vista: Vista;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'id_permiso' })
  permiso: Permiso;
}