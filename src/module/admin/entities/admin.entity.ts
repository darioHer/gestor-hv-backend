import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('administradores')
@Unique(['usuario'])
export class Administrador {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    nombre: string;

    @Column({ length: 30 })
    usuario: string;

    @Column()
    password: string;

    @Column({ default: 'ADMIN' })
    rol: string;
}
