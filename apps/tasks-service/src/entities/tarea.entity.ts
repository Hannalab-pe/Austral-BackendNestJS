import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tarea') // Cambiar a 'tarea' para coincidir con la BD
export class Tarea {
  @PrimaryGeneratedColumn('uuid') // Tu BD usa UUID
  id_tarea: string; // Campo real de la BD

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  tipo_tarea: string; // Campo real de la BD

  @Column({ default: 'MEDIA' })
  prioridad: string;

  @Column({ type: 'timestamp' })
  fecha_inicio: Date; // Campo real de la BD

  @Column({ type: 'timestamp' })
  fecha_vencimiento: Date; // Campo real de la BD

  @Column({ type: 'timestamp', nullable: true })
  fecha_completada: Date;

  @Column({ default: 'PENDIENTE' })
  estado: string;

  @Column({ default: 0 })
  progreso: number; // Campo real de la BD

  @Column({ type: 'uuid', nullable: true })
  id_lead: string; // Campo real de la BD

  @Column({ type: 'uuid', nullable: true })
  id_cliente: string; // Campo real de la BD

  @Column({ type: 'uuid', nullable: true })
  id_poliza: string; // Campo real de la BD

  @Column({ type: 'uuid' })
  creada_por: string; // Campo real de la BD

  @Column({ type: 'uuid' })
  asignada_a: string; // Campo real de la BD

  @Column({ default: false })
  recordatorio_enviado: boolean; // Campo real de la BD

  @Column({ type: 'timestamp', nullable: true })
  fecha_recordatorio: Date; // Campo real de la BD

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  fecha_creacion: Date; // Campo real de la BD
}
