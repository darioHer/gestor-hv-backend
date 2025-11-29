// entities/documento-postulacion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Postulacion } from './postulacion.entity';
import { DocumentType } from '../../common/enums/document-type.enum';

@Entity('documentos_postulacion')
export class DocumentoPostulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Postulacion, postulacion => postulacion.documentos, { onDelete: 'CASCADE' })
  postulacion: Postulacion;

  @Column({ type: 'enum', enum: DocumentType })
  tipoDocumento: DocumentType;

  @Column()
  nombreArchivo: string;

  @Column()
  rutaArchivo: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  tamaño: number; 

  @Column({ default: false })
  verificado: boolean;

  @CreateDateColumn()
  fechaSubida: Date;
}