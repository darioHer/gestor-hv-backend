import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Docente } from './docente.entity';
import { Documento } from './documento.entity';


@Entity('hojas_de_vida')
export class HojaDeVida {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: true })
    formacionAcademica: string;

    @Column('text', { nullable: true })
    experienciaLaboral: string;

    @Column('text', { nullable: true })
    produccionAcademica: string;

    @Column('text', { nullable: true })
    certificaciones: string;

    @OneToMany(() => Documento, (d) => d.hojaDeVida, { cascade: true, eager: true })
    documentos: Documento[];

    @OneToOne(() => Docente, (d) => d.hojaDeVida)
    @JoinColumn()
    docente: Docente;
}
