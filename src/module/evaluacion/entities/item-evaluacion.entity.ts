import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Evaluacion } from './evaluacion.entity';


@Entity('items_evaluacion')
export class ItemEvaluacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    descripcion: string;

    @Column('decimal', { precision: 5, scale: 2 })
    peso: number; // 0..1 o porcentaje (defínelo)

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    notaAsignada: number; // 0..5, 0..100, etc.

    @ManyToOne(() => Evaluacion, (e) => e.items, { onDelete: 'CASCADE' })
    evaluacion: Evaluacion;
}
