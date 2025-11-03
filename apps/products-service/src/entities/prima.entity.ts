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
import { PrimaEstado } from '../enums';

@Entity('prima')
@Index('idx_prima_poliza', ['idPoliza'])
@Index('idx_prima_estado', ['estado'])
export class Prima {
  @PrimaryGeneratedColumn('uuid', { name: 'id_prima' })
  idPrima: string;

  @Column({ type: 'uuid', name: 'id_poliza' })
  idPoliza: string;

  @ManyToOne(() => Poliza, (poliza) => poliza.primas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_poliza' })
  poliza: Poliza;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'monto' })
  monto: number;

  @Column({ type: 'date', name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @Column({ type: 'date', name: 'fecha_pago', nullable: true })
  fechaPago?: Date;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: PrimaEstado.PENDIENTE })
  estado: PrimaEstado;

  @Column({ type: 'text', nullable: true, name: 'observaciones' })
  observaciones?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
