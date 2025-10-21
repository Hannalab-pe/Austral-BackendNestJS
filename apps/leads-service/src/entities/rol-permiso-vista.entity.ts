import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Vista } from './vista.entity';
import { Permiso } from './permiso.entity';

@Entity('rol_permiso_vista')
export class RolPermisoVista {
  @PrimaryColumn('uuid')
  id_rol: string;

  @PrimaryColumn('uuid')
  id_vista: string;

  @PrimaryColumn('uuid')
  id_permiso: string;

  @CreateDateColumn()
  fecha_creacion: Date;

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