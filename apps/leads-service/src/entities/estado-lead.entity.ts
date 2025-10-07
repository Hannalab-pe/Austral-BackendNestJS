import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity, PrioridadLead } from 'y/common';

@Entity('estado_lead')
@Index('idx_estado_lead_nombre', ['nombre'])
export class EstadoLead extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 7, default: '#3B82F6', name: 'color_hex' })
  colorHex: string;

  @Column({ type: 'int', default: 1, name: 'orden_proceso' })
  ordenProceso: number;

  @Column({ type: 'boolean', default: false, name: 'es_estado_final' })
  esEstadoFinal: boolean;
}
