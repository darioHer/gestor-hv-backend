import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';
import { NotificacionService } from '../notificaciones/noti.service';
import { TipoNotificacion } from '../notificaciones/entities/noti.entity'; // ✅ Importar enum

@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
    @InjectRepository(Docente) private docenteRepo: Repository<Docente>,
    @InjectRepository(Convocatoria) private convocatoriaRepo: Repository<Convocatoria>,
    @InjectRepository(HistorialPostulacion) private historialRepo: Repository<HistorialPostulacion>,
    private readonly notificacionService: NotificacionService,
  ) {}

  async create(dto: CreatePostulacionDto) {
    const docente = await this.docenteRepo.findOne({ where: { id: dto.docenteId } });
    const convocatoria = await this.convocatoriaRepo.findOne({ where: { id: dto.convocatoriaId } });

    if (!docente) throw new NotFoundException('Docente no encontrado');
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

    // Validar duplicados
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

    // Crear nueva postulación
    const postulacion = this.repo.create({
      programaObjetivo: dto.programaObjetivo,
      docente,
      convocatoria,
    });

    const nueva = await this.repo.save(postulacion);

    // 📨 Notificar al docente usando enum
    await this.notificacionService.crear(
      docente.id,
      `Tu postulación a la convocatoria "${convocatoria.nombre}" ha sido registrada exitosamente.`,
      TipoNotificacion.POSTULACION
    );

    // 🧑‍💼 Notificar al administrador (usa ID fijo o ajusta a tu sistema)
    try {
      await this.notificacionService.crear(
        1, // ID del administrador
        `El docente ${docente.nombre} se ha postulado a la convocatoria "${convocatoria.nombre}".`,
        TipoNotificacion.ADMIN, // ⚡ usar enum ADMIN
        true // esAdmin = true
      );
    } catch (error) {
      console.warn('No se pudo enviar la notificación al administrador:', error.message);
    }

    return nueva;
  }

  async findAll(estado?: string) {
    const where: any = {};

    if (estado) where.estado = estado;

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
      relations: ['convocatoria', 'docente'],
    });

    if (!postulacion) throw new NotFoundException('Postulación no encontrada');

    const estadosPermitidos = ['enviada', 'en_evaluacion', 'aprobada', 'rechazada'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido. Solo se permiten: ${estadosPermitidos.join(', ')}`
      );
    }

    // actualizar estado actual
    postulacion.estado = nuevoEstado;
    await this.repo.save(postulacion);

    // crear registro en historial
    const historial = this.historialRepo.create({
      estado: nuevoEstado,
      postulacion,
    });
    await this.historialRepo.save(historial);

    // 📨 Notificación automática según el nuevo estado usando enum
    const mensaje = `El estado de tu postulación a la convocatoria "${postulacion.convocatoria.nombre}" cambió a "${nuevoEstado}".`;
    await this.notificacionService.crear(
      postulacion.docente.id,
      mensaje,
      TipoNotificacion.ACEPTACION
    );

    return postulacion;
  }

  async findAllWithFilters(filters: any) {
    const query = this.repo.createQueryBuilder('postulacion')
      .leftJoinAndSelect('postulacion.docente', 'docente')
      .leftJoinAndSelect('postulacion.convocatoria', 'convocatoria');

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
