import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PerfilDocente } from './perfil-docente.entity';
import { TipoEvidencia } from '../enums/tipo-evidencia.enum';

@Entity('perfil_evidencia')
export class PerfilEvidencia {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PerfilDocente, (p) => p.evidencias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'perfil_id' })
    perfil: PerfilDocente;

    @Index()
    @Column()
    perfil_id: number;

    @Column({ type: 'enum', enum: TipoEvidencia })
    tipo: TipoEvidencia;

    @Column({ length: 160 })
    nombre: string;

    @Column({ length: 300 })
    url: string;

    @Column({ length: 64 })
    sha256: string;

    @Column({ type: 'date', nullable: true })
    fechaEmision?: string;

    @Column({ type: 'date', nullable: true })
    fechaVencimiento?: string;

    @Column({ type: 'text', nullable: true })
    notaPostulante?: string;
}