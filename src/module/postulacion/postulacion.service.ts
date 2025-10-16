import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';


@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
    @InjectRepository(Docente) private docenteRepo: Repository<Docente>,
    @InjectRepository(Convocatoria) private convocatoriaRepo: Repository<Convocatoria>,
    @InjectRepository(HistorialPostulacion)
private historialRepo: Repository<HistorialPostulacion>,
  ) {}

  async create(dto: CreatePostulacionDto) {
    const docente = await this.docenteRepo.findOne({ where: { id: dto.docenteId } });
    const convocatoria = await this.convocatoriaRepo.findOne({ where: { id: dto.convocatoriaId } });

    if (!docente) throw new NotFoundException('Docente no encontrado');
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

    // Validar duplicados, ahora con relaciones explícitas
    const existente = await this.repo.findOne({
      where: {
        docente: { id: dto.docenteId },
        convocatoria: { id: dto.convocatoriaId },
      },
      relations: ['docente', 'convocatoria'],
    });

    if (existente) {
      throw new BadRequestException(
        'Ya existe una postulación para este docente en esta convocatoria',
      );
    }

    const postulacion = this.repo.create({
      programaObjetivo: dto.programaObjetivo,
      docente,
      convocatoria,
    });

    return this.repo.save(postulacion);
  }

async findAll(estado?: string) {
  const where: any = {};

  // Si el estado viene en la query (?estado=aprobada)
  if (estado) {
    where.estado = estado;
  }

  return this.repo.find({
    where,
    relations: ['convocatoria', 'docente'],
  });
}

async findByConvocatoria(convocatoriaId: number) {
  const convocatoria = await this.convocatoriaRepo.findOne({ where: { id: convocatoriaId } });
  if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

  return this.repo.find({
    where: { convocatoria: { id: convocatoriaId } },
    relations: ['docente', 'convocatoria'],
  });
}


  async findOneWithHistorial(id: number) {
  const postulacion = await this.repo.findOne({
    where: { id },
    relations: ['historial'],
  });

  if (!postulacion) {
    throw new NotFoundException('Postulación no encontrada');
  }

  return postulacion;
}

  async updateEstado(id: number, nuevoEstado: string) {
  const postulacion = await this.repo.findOne({
    where: { id },
    relations: ['docente', 'convocatoria'],
  });

  if (!postulacion) {
    throw new NotFoundException('Postulación no encontrada');
  }

  const estadosPermitidos = ['enviada', 'en_evaluacion', 'aprobada', 'rechazada'];
  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new BadRequestException(
      `Estado inválido. Solo se permiten: ${estadosPermitidos.join(', ')}`,
    );
  }

  //  actualizar estado actual
  postulacion.estado = nuevoEstado;
  await this.repo.save(postulacion);

  //  crear registro en historial
  const historial = this.historialRepo.create({
    estado: nuevoEstado,
    postulacion,
  });
  await this.historialRepo.save(historial);

  return postulacion;
}

async findAllWithFilters(filters: any) {
  const query = this.repo.createQueryBuilder('postulacion')
    .leftJoinAndSelect('postulacion.docente', 'docente')
    .leftJoinAndSelect('postulacion.convocatoria', 'convocatoria');

  // Validar estado
  if (filters.estado) {
    const estadosValidos = ['enviada', 'en_evaluacion', 'aprobada', 'rechazada'];
    if (!estadosValidos.includes(filters.estado)) {
      throw new BadRequestException(
        `El estado '${filters.estado}' no es válido. Usa uno de: ${estadosValidos.join(', ')}.`
      );
    }

    query.andWhere('postulacion.estado = :estado', { estado: filters.estado });
  }

  if (filters.docenteId) {
    query.andWhere('docente.id = :docenteId', { docenteId: filters.docenteId });
  }

  if (filters.convocatoriaId) {
    query.andWhere('convocatoria.id = :convocatoriaId', { convocatoriaId: filters.convocatoriaId });
  }

  return await query.getMany();
}




}
