import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'y/common';

@Entity('fuente_lead')
export class FuenteLead extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo?: string;
}
