import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadoLead } from './estado-lead.entity';
import { FuenteLead } from './fuente-lead.entity';

@Entity('lead')
@Index('idx_lead_activo', ['esta_activo'])
@Index('idx_lead_asignado', ['asignado_a_usuario'])
@Index('idx_lead_cumpleanos', ['fecha_nacimiento'])
@Index('idx_lead_estado', ['id_estado'])
@Index('idx_lead_seguimiento', ['proxima_fecha_seguimiento'])
@Index('idx_lead_telefono', ['telefono'])
export class Lead {
  @PrimaryGeneratedColumn('uuid', { name: 'id_lead' })
  idLead: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo_seguro_interes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  presupuesto_aproximado?: number;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ type: 'int', default: 0 })
  puntaje_calificacion: number;

  @Column({ type: 'varchar', length: 20, default: 'MEDIA' })
  prioridad: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_primer_contacto: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_ultimo_contacto?: Date;

  @Column({ type: 'timestamp', nullable: true })
  proxima_fecha_seguimiento?: Date;

  @Column({ type: 'uuid' })
  id_estado: string;

  @Column({ type: 'uuid' })
  id_fuente: string;

  @Column({ type: 'uuid', nullable: true })
  asignado_a_usuario?: string;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => EstadoLead)
  @JoinColumn({ name: 'id_estado' })
  estado: EstadoLead;

  @ManyToOne(() => FuenteLead)
  @JoinColumn({ name: 'id_fuente' })
  fuente: FuenteLead;

  // Relación con DetalleSeguroAuto (OneToMany)
  detalles_seguro_auto?: any[];
}
