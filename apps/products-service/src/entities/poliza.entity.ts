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
import { ProductoSeguro } from './producto-seguro.entity';
import { CompaniaSeguro } from './compania-seguro.entity';

@Entity('poliza')
@Index('idx_poliza_cliente', ['idCliente'])
@Index('idx_poliza_asegurado', ['asegurado'])
@Index('idx_poliza_vigencia_inicio', ['vigenciaInicio'])
@Index('idx_poliza_vigencia_fin', ['vigenciaFin'])
@Index('idx_poliza_usuario_creador', ['idUsuarioCreador'])
@Index('idx_poliza_compania', ['idCompania'])
@Index('idx_poliza_producto', ['idProducto'])
@Index('idx_poliza_activo', ['estaActivo'])
export class Poliza {
  @PrimaryGeneratedColumn('uuid', { name: 'id_poliza' })
  idPoliza: string;

  @Column({ type: 'varchar', length: 100, name: 'numero_poliza' })
  numeroPoliza: string;

  @Column({ type: 'varchar', length: 300, name: 'asegurado' })
  asegurado: string;

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'sub_agente' })
  subAgente?: string;

  @Column({ type: 'uuid', name: 'id_compania' })
  idCompania: string;

  @Column({ type: 'varchar', length: 100, name: 'ramo' })
  ramo: string;

  @Column({ type: 'uuid', name: 'id_producto' })
  idProducto: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0, name: 'porcentaje_comision_compania' })
  porcentajeComisionCompania: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0, name: 'porcentaje_comision_subagente' })
  porcentajeComisionSubagente: number;

  @Column({ type: 'varchar', length: 50, name: 'tipo_vigencia' })
  tipoVigencia: string; // ANUAL, SEMESTRAL, TRIMESTRAL, MENSUAL, etc.

  @Column({ type: 'date', name: 'vigencia_inicio' })
  vigenciaInicio: Date;

  @Column({ type: 'date', name: 'vigencia_fin' })
  vigenciaFin: Date;

  @Column({ type: 'date', name: 'fecha_emision' })
  fechaEmision: Date;

  @Column({ type: 'varchar', length: 10, default: 'PEN', name: 'moneda' })
  moneda: string; // PEN, USD, EUR, etc.

  @Column({ type: 'text', nullable: true, name: 'descripcion_asegura' })
  descripcionAsegura?: string;

  @Column({ type: 'varchar', length: 300, nullable: true, name: 'ejecutivo_cuenta' })
  ejecutivoCuenta?: string;

  @Column({ type: 'text', nullable: true, name: 'mas_informacion' })
  masInformacion?: string;

  @Column({ type: 'uuid', name: 'id_cliente' })
  idCliente: string;

  @Column({ type: 'uuid', name: 'id_usuario_creador' })
  idUsuarioCreador: string;

  @Column({ type: 'date', nullable: true, name: 'fecha_renovacion' })
  fechaRenovacion?: Date;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  // Relaciones
  @ManyToOne(() => CompaniaSeguro)
  @JoinColumn({ name: 'id_compania' })
  compania: CompaniaSeguro;

  @ManyToOne(() => ProductoSeguro)
  @JoinColumn({ name: 'id_producto' })
  producto: ProductoSeguro;
}
