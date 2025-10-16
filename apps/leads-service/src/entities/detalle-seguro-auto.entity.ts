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
@Check(`"ano_auto" >= 1900 AND "ano_auto" <= EXTRACT(YEAR FROM CURRENT_DATE) + 1`)
export class DetalleSeguroAuto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lead_id: string;

  @Column({ type: 'varchar', length: 100 })
  marca_auto: string;

  @Column({ type: 'integer' })
  ano_auto: number;

  @Column({ type: 'varchar', length: 100 })
  modelo_auto: string;

  @Column({ type: 'varchar', length: 20 })
  placa_auto: string;

  @Column({ type: 'varchar', length: 50 })
  tipo_uso: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  // Relación con Lead
  @ManyToOne(() => Lead, (lead) => lead.detalles_seguro_auto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}