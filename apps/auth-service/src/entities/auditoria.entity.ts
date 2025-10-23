import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('auditoria')
@Index('idx_auditoria_fecha', ['fechaAccion'])
@Index('idx_auditoria_tabla_registro', ['tabla', 'idRegistro'])
export class Auditoria {
    @PrimaryGeneratedColumn('uuid', { name: 'id_auditoria' })
    idAuditoria: string;

    @Column({ type: 'varchar', length: 100, name: 'tabla' })
    tabla: string;

    @Column({ type: 'uuid', name: 'id_registro' })
    idRegistro: string;

    @Column({ type: 'varchar', length: 20, name: 'accion' })
    accion: string;

    @Column({ type: 'uuid', nullable: true, name: 'id_usuario' })
    idUsuario?: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'ip_address' })
    ipAddress?: string;

    @CreateDateColumn({ name: 'fecha_accion' })
    fechaAccion: Date;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario?: Usuario;
}