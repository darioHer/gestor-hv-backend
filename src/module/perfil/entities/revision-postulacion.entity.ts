import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RevisionEtiqueta } from './revision-etiqueta.entity';

@Entity('revision_postulacion')
export class RevisionPostulacion {
    @PrimaryGeneratedColumn() id: number;
    @Column() convocatoria_id: number;
    @Column() postulacion_id: number;
    @Column() revisor_id: number;
    @Column({ default: 'OBSERVAR' }) marcador: 'FAVORITO' | 'DESCARTAR' | 'OBSERVAR';
    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;

    @OneToMany(() => RevisionEtiqueta, e => e.revision, { cascade: true }) etiquetas: RevisionEtiqueta[];
}
