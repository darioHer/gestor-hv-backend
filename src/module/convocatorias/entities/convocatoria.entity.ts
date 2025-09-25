import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Postulacion } from '../../postulacion/entities/postulacion.entity';


@Entity('convocatorias')
export class Convocatoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 60 })
    tipoVinculacion: string;

    @Column({ type: 'date' })
    fechaInicio: string;

    @Column({ type: 'date' })
    fechaCierre: string;

    @Column({ length: 120 })
    programa: string;

    @Column('text', { nullable: true })
    requisitos: string;

    @Column({ type: 'enum', enum: ['abierta', 'cerrada'], default: 'abierta' })
estado: 'abierta' | 'cerrada';

    @OneToMany(() => Postulacion, (p) => p.convocatoria)
    postulaciones: Postulacion[];
}
