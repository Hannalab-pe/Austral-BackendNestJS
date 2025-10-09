import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  telefonoSecundario?: string;

  @Column({ unique: true })
  numeroDocumento: string;

  @Column()
  tipoDocumento: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column('text')
  direccion: string;

  @Column({ nullable: true })
  distrito?: string;

  @Column({ nullable: true })
  provincia?: string;

  @Column({ nullable: true })
  departamento?: string;

  @Column({ nullable: true })
  ocupacion?: string;

  @Column({ nullable: true })
  empresa?: string;

  @Column({ nullable: true })
  estadoCivil?: string;

  @Column({ nullable: true })
  contactoEmergenciaNombre?: string;

  @Column({ nullable: true })
  contactoEmergenciaTelefono?: string;

  @Column({ nullable: true })
  contactoEmergenciaRelacion?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
