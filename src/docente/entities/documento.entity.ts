import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ nullable: true })
  rutaArchivo: string;
}