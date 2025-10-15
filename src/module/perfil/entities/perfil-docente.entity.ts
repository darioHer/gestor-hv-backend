import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PerfilDestacado } from './perfil-destacado.entity';
import { PerfilEvidencia } from './perfil-evidencia.entity';

@Entity('perfil_docente')
export class PerfilDocente {
    @PrimaryGeneratedColumn() id: number;
    @Column() user_id: number;
    @Column({ length: 160, nullable: true }) resumen?: string;
    @Column({ length: 80, nullable: true }) modalidadPreferida?: 'presencial' | 'virtual' | 'mixta';
    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;

    @OneToMany(() => PerfilDestacado, d => d.perfil, { cascade: true }) destacados: PerfilDestacado[];
    @OneToMany(() => PerfilEvidencia, e => e.perfil, { cascade: true }) evidencias: PerfilEvidencia[];
}
