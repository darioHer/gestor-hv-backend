import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEvaluacion } from './item-evaluacion.entity';
import { Postulacion } from '../convocatoria/entities/postulacion.entity';

@Entity('evaluaciones')
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column('text', { nullable: true })
    comentarios: string;

    @Column('decimal', { precision: 6, scale: 2, default: 0 })
    notaTotal: number;

    @OneToMany(() => ItemEvaluacion, (i) => i.evaluacion, { cascade: true, eager: true })
    items: ItemEvaluacion[];

    @ManyToOne(() => Postulacion, { eager: true, onDelete: 'CASCADE' })
    postulacion: Postulacion;
}
