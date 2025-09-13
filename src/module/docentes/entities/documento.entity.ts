import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HojaDeVida } from './hoja-de-vida.entity';

@Entity('documentos')
export class Documento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 60 })
    tipo: string; // ej. 'certificado', 'cedula', ...

    @Column({ length: 255 })
    descripcion: string;

    @Column()
    archivo: string; // URL o path en almacenamiento

    @ManyToOne(() => HojaDeVida, (hv) => hv.documentos, { onDelete: 'CASCADE' })
    hojaDeVida: HojaDeVida;
}
