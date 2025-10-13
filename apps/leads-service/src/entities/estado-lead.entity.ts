import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('estado_lead')
@Index('idx_estado_lead_nombre', ['nombre'])
export class EstadoLead {
  @PrimaryGeneratedColumn('uuid')
  id_estado: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 7, default: '#3B82F6' })
  color_hex: string;

  @Column({ type: 'int', default: 1 })
  orden_proceso: number;

  @Column({ type: 'boolean', default: false })
  es_estado_final: boolean;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;
}
