import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PerfilDocente } from './perfil-docente.entity';

@Entity('perfil_destacado')
export class PerfilDestacado {
    @PrimaryGeneratedColumn() id: number;
    @ManyToOne(() => PerfilDocente, p => p.destacados) @JoinColumn({ name: 'perfil_id' }) perfil: PerfilDocente;
    @Column() perfil_id: number;
    @Column({ length: 140 }) titulo: string;
    @Column({ type: 'text', nullable: true }) descripcion?: string;
    @Column({ length: 300, nullable: true }) evidenciaUrl?: string;
}
