import { Role } from 'src/module/common/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('administradores')
export class Administrador {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    nombre: string;

    @Column({ unique: true, length: 60 })
    usuario: string;

    @Column() // hash bcrypt
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
    rol: Role;

    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;
}
