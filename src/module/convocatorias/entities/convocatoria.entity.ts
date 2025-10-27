import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Postulacion } from '../../postulacion/entities/postulacion.entity';
import { ConvocatoriaEstado } from 'src/module/common/enums/convocatoria-estado.enum';

@Entity('convocatorias')
export class Convocatoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 60 })
    tipoVinculacion: string;

    @Column({ type: 'date' })
    fechaInicio: string; // ISO yyyy-mm-dd

    @Column({ type: 'date' })
    fechaCierre: string; // ISO yyyy-mm-dd

    @Column({ length: 120 })
    programa: string;

    @Column('text', { nullable: true })
    requisitos: string;

    @Column({ type: 'enum', enum: ConvocatoriaEstado, default: ConvocatoriaEstado.ABIERTA })
    estado: ConvocatoriaEstado;

    @OneToMany(() => Postulacion, (p) => p.convocatoria)
    postulaciones: Postulacion[];
}
