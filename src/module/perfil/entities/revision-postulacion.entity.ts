import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index, Unique,
} from 'typeorm';
import { RevisionEtiqueta } from './revision-etiqueta.entity';
import { MarcadorRevision } from '../enums/marcador.enum';

@Entity('revision_postulacion')
@Unique(['convocatoria_id', 'postulacion_id', 'revisor_id'])
export class RevisionPostulacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    convocatoria_id: number;

    @Index()
    @Column()
    postulacion_id: number;

    @Index()
    @Column()
    revisor_id: number;

    @Column({ type: 'enum', enum: MarcadorRevision, default: MarcadorRevision.OBSERVAR })
    marcador: MarcadorRevision;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RevisionEtiqueta, (e) => e.revision, { cascade: true })
    etiquetas: RevisionEtiqueta[];
}