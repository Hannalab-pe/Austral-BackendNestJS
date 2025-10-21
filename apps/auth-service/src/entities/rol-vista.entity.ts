import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Vista } from './vista.entity';

@Entity('rol_vista')
export class RolVista {
  @PrimaryColumn('uuid')
  id_rol: string;

  @PrimaryColumn('uuid')
  id_vista: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Vista)
  @JoinColumn({ name: 'id_vista' })
  vista: Vista;
}