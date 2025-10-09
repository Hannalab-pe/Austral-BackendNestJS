import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('beneficiarios')
export class Beneficiario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  numeroDocumento: string;

  @Column()
  tipoDocumento: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento?: Date;

  @Column()
  relacionConAsegurado: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100.0 })
  porcentajeBeneficio: number;

  @Column({ nullable: true })
  telefono?: string;

  @Column('text', { nullable: true })
  direccion?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
