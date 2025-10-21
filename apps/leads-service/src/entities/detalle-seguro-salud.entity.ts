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

@Entity('detalle_seguro_salud')
export class DetalleSeguroSalud {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lead_id: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ type: 'varchar', length: 20 })
  sexo: string;

  @Column({ type: 'varchar', length: 100 })
  grupo_familiar: string;

  @Column({ type: 'text' })
  estado_clinico: string;

  @Column({ type: 'varchar', length: 255 })
  zona_trabajo_vivienda: string;

  @Column({ type: 'varchar', length: 100 })
  preferencia_plan: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  reembolso: number;

  @Column({ type: 'text' })
  coberturas: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}