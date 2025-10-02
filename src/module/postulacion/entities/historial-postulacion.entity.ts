import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Postulacion } from './postulacion.entity';

@Entity('historial_postulaciones')
export class HistorialPostulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estado: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCambio: Date;

  @ManyToOne(() => Postulacion, (p) => p.historial, { onDelete: 'CASCADE' })
  postulacion: Postulacion;
}
