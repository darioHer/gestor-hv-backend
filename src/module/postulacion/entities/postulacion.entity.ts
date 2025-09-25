import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Convocatoria } from '../../convocatorias/entities/convocatoria.entity';
import { Docente } from 'src/module/docentes/entities/docente.entity';
import { HistorialPostulacion } from './historial-postulacion.entity';


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

    @OneToMany(() => HistorialPostulacion, (h) => h.postulacion, { cascade: true })
historial: HistorialPostulacion[];

    
}
