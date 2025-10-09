import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column()
  tipo: string;

  @Column()
  usuarioId: number;

  @Column({ nullable: true })
  clienteId?: number;

  @Column({ nullable: true })
  leadId?: number;

  @Column({ type: 'datetime' })
  fechaVencimiento: Date;

  @Column({ default: false })
  completada: boolean;

  @Column({ nullable: true })
  fechaCompletada?: Date;

  @Column({ nullable: true })
  prioridad?: string; // 'alta', 'media', 'baja'

  @Column('text', { nullable: true })
  notas?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
