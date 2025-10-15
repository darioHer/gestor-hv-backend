import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RevisionPostulacion } from './revision-postulacion.entity';

@Entity('revision_etiqueta')
export class RevisionEtiqueta {
    @PrimaryGeneratedColumn() id: number;
    @ManyToOne(() => RevisionPostulacion, r => r.etiquetas) @JoinColumn({ name: 'revision_id' }) revision: RevisionPostulacion;
    @Column() revision_id: number;
    @Column({ length: 40 }) etiqueta: string;
}
