import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number;

  @Column()
  titulo: string;

  @Column('text')
  mensaje: string;

  @Column()
  tipo: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ nullable: true })
  fechaLectura: Date;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
