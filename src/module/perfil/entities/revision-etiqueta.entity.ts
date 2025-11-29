import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { RevisionPostulacion } from './revision-postulacion.entity';

@Entity('revision_etiqueta')
export class RevisionEtiqueta {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RevisionPostulacion, (r) => r.etiquetas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'revision_id' })
    revision: RevisionPostulacion;

    @Index()
    @Column()
    revision_id: number;

    @Column({ length: 40 })
    etiqueta: string;
}