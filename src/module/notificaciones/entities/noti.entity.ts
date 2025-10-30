import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Docente } from '../../docentes/entities/docente.entity';

export enum TipoNotificacion {
  POSTULACION = 'POSTULACION',
  ACEPTACION = 'ACEPTACION',
  RECHAZO = 'RECHAZO',
  GENERAL = 'GENERAL',
  ADMIN = 'ADMIN',
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ type: 'enum', enum: TipoNotificacion })
  tipo: TipoNotificacion;

  @ManyToOne(() => Docente, { nullable: true, eager: true })
  docente?: Docente | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
