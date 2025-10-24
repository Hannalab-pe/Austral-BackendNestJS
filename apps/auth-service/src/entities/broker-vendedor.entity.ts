import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('broker_vendedor')
@Index('idx_broker_vendedor_activo', ['estaActivo'])
@Index('idx_broker_vendedor_broker', ['idBroker'])
@Index('idx_broker_vendedor_vendedor', ['idVendedor'])
export class BrokerVendedor {
    @PrimaryColumn('uuid', { name: 'id_broker' })
    idBroker: string;

    @PrimaryColumn('uuid', { name: 'id_vendedor' })
    idVendedor: string;

    @Column({ type: 'numeric', precision: 5, scale: 2, name: 'porcentaje_comision' })
    porcentajeComision: number;

    @Column({ type: 'boolean', default: true, name: 'esta_activo' })
    estaActivo: boolean;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_broker' })
    broker: Usuario;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_vendedor' })
    vendedor: Usuario;

    @CreateDateColumn({ name: 'fecha_asignacion' })
    fechaAsignacion: Date;
}