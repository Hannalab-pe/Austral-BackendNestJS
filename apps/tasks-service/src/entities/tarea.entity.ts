import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: 'PENDIENTE' })
  estado: string;

  @Column({ default: 'MEDIA' })
  prioridad: string;

  @Column({ nullable: true })
  fechaVencimiento: Date;

  @Column({ nullable: true })
  fechaCompletada: Date;

  @Column()
  usuarioAsignadoId: number;

  @Column()
  usuarioCreadorId: number;

  @Column({ nullable: true })
  clienteId: number;

  @Column({ nullable: true })
  leadId: number;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
