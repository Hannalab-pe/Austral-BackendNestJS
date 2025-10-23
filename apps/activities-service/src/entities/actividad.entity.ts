import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('actividad')
export class Actividad {
  @PrimaryGeneratedColumn('uuid', { name: 'id_actividad' })
  idActividad: string;

  @Column({ length: 50, name: 'tipo_actividad' })
  @Index()
  tipoActividad: string;

  @Column({ length: 200, name: 'titulo' })
  titulo: string;

  @Column('text', { nullable: true, name: 'descripcion' })
  descripcion?: string;

  @Column({ type: 'timestamp', name: 'fecha_actividad' })
  @Index()
  fechaActividad: Date;

  @Column({ type: 'int', nullable: true, name: 'duracion_minutos' })
  duracionMinutos?: number;

  @Column({ length: 100, nullable: true, name: 'resultado' })
  resultado?: string;

  @Column('text', { nullable: true, name: 'proxima_accion' })
  proximaAccion?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'fecha_proxima_accion' })
  fechaProximaAccion?: Date;

  @Column('uuid', { nullable: true, name: 'id_lead' })
  idLead?: string;

  @Column('uuid', { nullable: true, name: 'id_cliente' })
  idCliente?: string;

  @Column('uuid', { nullable: true, name: 'id_poliza' })
  idPoliza?: string;

  @Column('uuid', { name: 'realizada_por_usuario' })
  @Index()
  realizadaPorUsuario: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
