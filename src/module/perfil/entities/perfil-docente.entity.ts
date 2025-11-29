import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index, Unique,
} from 'typeorm';
import { PerfilDestacado } from './perfil-destacado.entity';
import { PerfilEvidencia } from './perfil-evidencia.entity';
import { ModalidadPreferida } from '../enums/modalidad.enum';

@Entity('perfil_docente')
@Unique(['user_id'])
export class PerfilDocente {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    user_id: number;

    @Column({ length: 160, nullable: true })
    resumen?: string;

    @Column({ type: 'enum', enum: ModalidadPreferida, nullable: true })
    modalidadPreferida?: ModalidadPreferida;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PerfilDestacado, (d) => d.perfil, { cascade: true })
    destacados: PerfilDestacado[];

    @OneToMany(() => PerfilEvidencia, (e) => e.perfil, { cascade: true })
    evidencias: PerfilEvidencia[];
}