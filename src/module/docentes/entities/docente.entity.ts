import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn,JoinColumn} from 'typeorm';
import { HojaDeVida } from './hoja-de-vida.entity';
import { Postulacion } from '../../postulacion/entities/postulacion.entity';
import { Notificacion } from '../../notificaciones/entities/noti.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('docentes')
export class Docente {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Relación 1:1 con la tabla usuarios
  @OneToOne(() => Usuario, (u) => u.docente, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  usuario: Usuario;

  // 🔹 Campos adicionales del docente
  @Column({ length: 120 })
  nombre: string;

  @Column({ unique: true, length: 30 })
  identificacion: string;

  @Column({ nullable: true, length: 120 })
  contacto: string;

  @Column({ nullable: true })
  foto: string; // URL o path

  @Column({ nullable: true, length: 120 })
  disponibilidadHoraria: string;

  @OneToOne(() => HojaDeVida, (hv) => hv.docente, { cascade: true, eager: true })
  hojaDeVida: HojaDeVida;

  @OneToMany(() => Postulacion, (p) => p.docente)
  postulaciones: Postulacion[];

  @OneToMany(() => Notificacion, (n) => n.docente, { cascade: true })
  notificaciones: Notificacion[];
}
