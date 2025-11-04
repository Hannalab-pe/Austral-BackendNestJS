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
import { Prima } from './prima.entity';
import { EstadoAvisoCobranza } from '../enums';

@Entity('aviso_cobranza')
@Index('idx_aviso_prima', ['idPrima'])
@Index('idx_aviso_estado', ['estado'])
export class AvisoCobranza {
  @PrimaryGeneratedColumn('uuid', { name: 'id_aviso_cobranza' })
  idAvisoCobranza: string;

  @Column({ type: 'uuid', name: 'id_prima' })
  idPrima: string;

  @ManyToOne(() => Prima, (prima) => prima.avisosCobranza, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prima' })
  prima: Prima;

  @Column({ type: 'date', name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'monto' })
  monto: number;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: EstadoAvisoCobranza.PENDIENTE })
  estado: EstadoAvisoCobranza;

  @Column({ type: 'date', name: 'fecha_pago', nullable: true })
  fechaPago?: Date;

  @Column({ type: 'text', nullable: true, name: 'observaciones' })
  observaciones?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
