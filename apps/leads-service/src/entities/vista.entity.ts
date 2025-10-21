import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('vista')
@Index('idx_vista_activa', ['esta_activa'])
@Index('idx_vista_ruta', ['ruta'])
export class Vista {
  @PrimaryGeneratedColumn('uuid')
  id_vista: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 255 })
  ruta: string;

  @Column({ type: 'boolean', default: true })
  esta_activa: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
}