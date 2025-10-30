// entities/postulacion.entity.ts (modificar)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Docente } from '../../docentes/entities/docente.entity';
import { Convocatoria } from '../../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './historial-postulacion.entity';
import { DocumentoPostulacion } from './documento-postulacion.entity';
import { EstadoPostulacion } from '../../common/enums/postulacion-estado.enum';

@Entity('postulaciones')
export class Postulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  programaObjetivo: string;

  @Column({ type: 'enum', enum: EstadoPostulacion, default: EstadoPostulacion.BORRADOR })
  estado: EstadoPostulacion;

  @ManyToOne(() => Docente, docente => docente.postulaciones)
  docente: Docente;

  @ManyToOne(() => Convocatoria, convocatoria => convocatoria.postulaciones)
  convocatoria: Convocatoria;

  @OneToMany(() => HistorialPostulacion, historial => historial.postulacion)
  historial: HistorialPostulacion[];

  // NUEVO: Relación con documentos
  @OneToMany(() => DocumentoPostulacion, documento => documento.postulacion)
  documentos: DocumentoPostulacion[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaEnvio: Date;
}