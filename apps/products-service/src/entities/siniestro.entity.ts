import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Poliza } from './poliza.entity';
import { SiniestroEstado } from '../enums';

@Entity('siniestro')
@Index('idx_siniestro_poliza', ['idPoliza'])
@Index('idx_siniestro_estado', ['estado'])
export class Siniestro {
  @PrimaryGeneratedColumn('uuid', { name: 'id_siniestro' })
  idSiniestro: string;

  @Column({ type: 'uuid', name: 'id_poliza' })
  idPoliza: string;

  @ManyToOne(() => Poliza, (poliza) => poliza.siniestros, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_poliza' })
  poliza: Poliza;

  @Column({ type: 'varchar', length: 50, name: 'numero_siniestro' })
  numeroSiniestro: string;

  @Column({ type: 'date', name: 'fecha_ocurrencia' })
  fechaOcurrencia: Date;

  @Column({ type: 'text', name: 'descripcion' })
  descripcion: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'monto_reclamado' })
  montoReclamado: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'monto_pagado', nullable: true })
  montoPagado?: number;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: SiniestroEstado.REPORTADO })
  estado: SiniestroEstado;

  @Column({ type: 'text', nullable: true, name: 'observaciones' })
  observaciones?: string;

  @CreateDateColumn({ name: 'fecha_reporte' })
  fechaReporte: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'timestamp', name: 'fecha_cierre', nullable: true })
  fechaCierre?: Date;
}
