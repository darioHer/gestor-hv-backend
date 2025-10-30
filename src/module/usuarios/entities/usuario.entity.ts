import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, OneToOne } from 'typeorm';
import { Role } from 'src/module/common/enums/role.enum';
import { Postulacion } from 'src/module/postulacion/entities/postulacion.entity';
import { Notificacion } from 'src/module/notificaciones/entities/noti.entity';
import { HojaDeVida } from 'src/module/docentes/entities/hoja-de-vida.entity';
import { Docente } from 'src/module/docentes/entities/docente.entity';

@Entity('usuarios')
@Unique(['usuario'])
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  nombre: string;

  @Column({ length: 30 })
  usuario: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.DOCENTE })
  rol: Role;

  @OneToMany(() => Notificacion, (n) => n.docente)
  notificaciones: Notificacion[];

    @OneToOne(() => Docente, (d) => d.usuario)
  docente: Docente;

}
