import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PerfilDocente } from './perfil-docente.entity';

@Entity('perfil_evidencia')
export class PerfilEvidencia {
    @PrimaryGeneratedColumn() id: number;
    @ManyToOne(() => PerfilDocente, p => p.evidencias) @JoinColumn({ name: 'perfil_id' }) perfil: PerfilDocente;
    @Column() perfil_id: number;
    @Column({ length: 30 }) tipo: string;
    @Column({ length: 160 }) nombre: string;
    @Column({ length: 300 }) url: string;
    @Column({ length: 64 }) sha256: string;
    @Column({ type: 'date', nullable: true }) fechaEmision?: string;
    @Column({ type: 'date', nullable: true }) fechaVencimiento?: string;
    @Column({ type: 'text', nullable: true }) notaPostulante?: string;
}
