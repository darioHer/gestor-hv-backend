import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Convocatoria } from '../../convocatorias/entities/convocatoria.entity';
import { Docente } from '../../docentes/entities/docente.entity';
import { HistorialPostulacion } from './historial-postulacion.entity';
import { EstadoPostulacion } from 'src/module/common/enums/postulacion-estado.enum';


@Entity('postulaciones')
@Unique(['docente', 'convocatoria'])
export class Postulacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: EstadoPostulacion, default: EstadoPostulacion.ENVIADA })
    estado: EstadoPostulacion;

    @Column({ length: 120 })
    programaObjetivo: string;

    @ManyToOne(() => Convocatoria, (c) => c.postulaciones, { onDelete: 'CASCADE', eager: true })
    convocatoria: Convocatoria;

    @ManyToOne(() => Docente, (d) => d.postulaciones, { onDelete: 'CASCADE', eager: true })
    docente: Docente;

    @OneToMany(() => HistorialPostulacion, (h) => h.postulacion, { cascade: true })
    historial: HistorialPostulacion[];
}
