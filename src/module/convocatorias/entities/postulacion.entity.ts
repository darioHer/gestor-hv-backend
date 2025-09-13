import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Convocatoria } from './convocatoria.entity';
import { Docente } from 'src/module/docentes/entities/docente.entity';


@Entity('postulaciones')
export class Postulacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, default: 'enviada' })
    estado: string; // enviada | en_evaluacion | aprobada | rechazada

    @Column({ length: 120 })
    programaObjetivo: string;

    @ManyToOne(() => Convocatoria, (c) => c.postulaciones, { onDelete: 'CASCADE' })
    convocatoria: Convocatoria;

    @ManyToOne(() => Docente, { eager: true })
    docente: Docente;
}
