import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity, PrioridadLead } from 'y/common';
import { EstadoLead } from './estado-lead.entity';
import { FuenteLead } from './fuente-lead.entity';

@Entity('lead')
@Index('idx_lead_activo', ['estaActivo'])
@Index('idx_lead_asignado', ['asignadoAUsuario'])
@Index('idx_lead_estado', ['idEstado'])
@Index('idx_lead_seguimiento', ['proximaFechaSeguimiento'])
@Index('idx_lead_telefono', ['telefono'])
@Index('idx_lead_cumpleanos', ['fechaNacimiento'])
export class Lead extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
  fechaNacimiento?: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tipo_seguro_interes',
  })
  tipoSeguroInteres?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'presupuesto_aproximado',
  })
  presupuestoAproximado?: number;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ type: 'int', default: 0, name: 'puntaje_calificacion' })
  puntajeCalificacion: number;

  @Column({
    type: 'enum',
    enum: PrioridadLead,
    default: PrioridadLead.MEDIA,
  })
  prioridad: PrioridadLead;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_primer_contacto',
  })
  fechaPrimerContacto: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'fecha_ultimo_contacto' })
  fechaUltimoContacto?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'proxima_fecha_seguimiento',
  })
  proximaFechaSeguimiento?: Date;

  @Column({ type: 'uuid', name: 'id_estado' })
  idEstado: string;

  @Column({ type: 'uuid', name: 'id_fuente' })
  idFuente: string;

  @Column({ type: 'uuid', nullable: true, name: 'asignado_a_usuario' })
  asignadoAUsuario?: string;

  @ManyToOne(() => EstadoLead)
  @JoinColumn({ name: 'id_estado' })
  estado: EstadoLead;

  @ManyToOne(() => FuenteLead)
  @JoinColumn({ name: 'id_fuente' })
  fuente: FuenteLead;
}
