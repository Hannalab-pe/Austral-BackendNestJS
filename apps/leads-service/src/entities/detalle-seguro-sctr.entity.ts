import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

@Entity('detalle_seguro_sctr')
export class DetalleSeguroSctr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lead_id: string;

  @Column({ type: 'varchar', length: 255 })
  razon_social: string;

  @Column({ type: 'varchar', length: 20 })
  ruc: string;

  @Column({ type: 'int' })
  numero_trabajadores: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto_planilla: number;

  @Column({ type: 'varchar', length: 255 })
  actividad_negocio: string;

  @Column({ type: 'varchar', length: 100 })
  tipo_seguro: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}