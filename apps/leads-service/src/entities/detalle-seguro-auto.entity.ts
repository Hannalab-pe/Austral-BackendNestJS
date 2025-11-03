import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Lead } from './lead.entity';

@Entity('detalle_seguro_auto')
@Check(`"anio" >= 1900 AND "anio" <= 2100`)
export class DetalleSeguroAuto {
  @PrimaryGeneratedColumn('uuid', { name: 'id_detalle_auto' })
  id_detalle_auto: string;

  @Column({ type: 'uuid', name: 'id_lead' })
  id_lead: string;

  @Column({ type: 'varchar', length: 50 })
  marca: string;

  @Column({ type: 'varchar', length: 50 })
  modelo: string;

  @Column({ type: 'integer' })
  anio: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  placa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_vehiculo: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_cobertura: string;

  @Column({ type: 'varchar', length: 20, default: 'Media' })
  zona_riesgo: string;

  @Column({ type: 'integer', nullable: true })
  antiguedad_licencia: number;

  @Column({ type: 'boolean', default: false })
  tiene_gps: boolean;

  @Column({ type: 'boolean', default: false })
  tiene_alarma: boolean;

  @Column({ type: 'integer', default: 0 })
  numero_siniestros_previos: number;

  @Column({ type: 'boolean', default: false })
  esta_financiado: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  uso_vehiculo: string;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  // Relación con Lead
  @ManyToOne(() => Lead, (lead) => lead.detalles_seguro_auto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_lead' })
  lead: Lead;
}