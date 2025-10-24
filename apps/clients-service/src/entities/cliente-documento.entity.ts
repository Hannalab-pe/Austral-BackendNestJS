import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('cliente_documento')
@Index('idx_cliente_documento_cliente', ['idCliente'])
@Index('idx_cliente_documento_tipo', ['tipoDocumento'])
export class ClienteDocumento {
    @PrimaryGeneratedColumn('uuid', { name: 'id_documento' })
    idDocumento: string;

    @Column({ type: 'uuid', name: 'id_cliente' })
    idCliente: string;

    @Column({ type: 'varchar', length: 100, name: 'tipo_documento' })
    tipoDocumento: string;

    @Column({ type: 'text', name: 'url_archivo' })
    urlArchivo: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ type: 'uuid', name: 'subido_por' })
    subidoPor: string;

    @ManyToOne(() => Cliente, cliente => cliente.documentos)
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;

    @CreateDateColumn({ name: 'fecha_subida' })
    fechaSubida: Date;
}