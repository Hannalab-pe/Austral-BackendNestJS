import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioBase: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  categoriaId: number;

  @Column({ nullable: true })
  companiaId: number;

  @Column({ nullable: true })
  codigo: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
