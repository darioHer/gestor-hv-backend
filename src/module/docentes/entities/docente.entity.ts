import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HojaDeVida } from './hoja-de-vida.entity';
import { Postulacion } from '../../postulacion/entities/postulacion.entity';

@Entity('docentes')
export class Docente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    nombre: string;

    @Column({ unique: true, length: 30 })
    identificacion: string;

    @Column({ nullable: true, length: 120 })
    contacto: string;

    @Column({ nullable: true })
    foto: string;

    @Column({ nullable: true, length: 120 })
    disponibilidadHoraria: string;

    @OneToOne(() => HojaDeVida, (hv) => hv.docente, { cascade: true, eager: true })
    hojaDeVida: HojaDeVida;

    @OneToMany(() => Postulacion, (p) => p.docente)
    postulaciones: Postulacion[];
}
