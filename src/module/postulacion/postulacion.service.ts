import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';
import { EstadoPostulacion } from '../common/enums/postulacion-estado.enum';


@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
    @InjectRepository(Docente) private docenteRepo: Repository<Docente>,
    @InjectRepository(Convocatoria) private convocatoriaRepo: Repository<Convocatoria>,
    @InjectRepository(HistorialPostulacion) private historialRepo: Repository<HistorialPostulacion>,
  ) { }

  /** Crear como DOCENTE (id viene del JWT) */
  async createForDocente(docenteId: number, dto: CreatePostulacionDto) {
    return this.createInternal({ docenteId, ...dto });
  }


  private async createInternal(dto: { docenteId: number; convocatoriaId: number; programaObjetivo: string }) {
    const docente = await this.docenteRepo.findOne({ where: { id: dto.docenteId } });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    const convocatoria = await this.convocatoriaRepo.findOne({ where: { id: dto.convocatoriaId } });
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

    // Validar estado/rango de fechas
    const hoy = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const enRango = convocatoria.fechaInicio <= hoy && hoy <= convocatoria.fechaCierre;
    if (convocatoria.estado !== 'abierta' || !enRango) {
      throw new ForbiddenException('La convocatoria no está abierta para postulación');
    }

    // Validar duplicados
    const existente = await this.repo.findOne({
      where: {
        docente: { id: dto.docenteId },
        convocatoria: { id: dto.convocatoriaId },
      },
    });
    if (existente) {
      throw new BadRequestException('Ya existe una postulación para este docente en esta convocatoria');
    }

    const postulacion = this.repo.create({
      programaObjetivo: dto.programaObjetivo,
      docente,
      convocatoria,
      estado: EstadoPostulacion.ENVIADA,
    });

    return this.repo.save(postulacion);
  }

  async findAll(filters?: any) {
    const qb = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.docente', 'docente')
      .leftJoinAndSelect('p.convocatoria', 'convocatoria');

    if (filters?.estado) {
      const permitidos = Object.values(EstadoPostulacion);
      if (!permitidos.includes(filters.estado)) {
        throw new BadRequestException(`Estado inválido. Usa uno de: ${permitidos.join(', ')}`);
      }
      qb.andWhere('p.estado = :estado', { estado: filters.estado });
    }

    if (filters?.docenteId) {
      qb.andWhere('docente.id = :docenteId', { docenteId: Number(filters.docenteId) });
    }

    if (filters?.convocatoriaId) {
      qb.andWhere('convocatoria.id = :convocatoriaId', { convocatoriaId: Number(filters.convocatoriaId) });
    }

    return qb.getMany();
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
      relations: ['historial', 'docente', 'convocatoria'],
    });
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');
    return postulacion;
  }

  async updateEstado(id: number, nuevoEstado: EstadoPostulacion) {
    const postulacion = await this.repo.findOne({
      where: { id },
      relations: ['docente', 'convocatoria'],
    });
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');

    const permitidos = Object.values(EstadoPostulacion);
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(`Estado inválido. Usa uno de: ${permitidos.join(', ')}`);
    }

    postulacion.estado = nuevoEstado;
    await this.repo.save(postulacion);

    const historial = this.historialRepo.create({
      estado: nuevoEstado,
      postulacion,
    });
    await this.historialRepo.save(historial);

    return postulacion;
  }
}
