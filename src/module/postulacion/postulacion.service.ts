import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';

// 🔹 Mantener ambas importaciones importantes
import { NotificacionService } from '../notificaciones/noti.service';
import { TipoNotificacion } from '../notificaciones/entities/noti.entity';
import { EstadoPostulacion } from '../common/enums/postulacion-estado.enum';

@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
    @InjectRepository(Docente) private docenteRepo: Repository<Docente>,
    @InjectRepository(Convocatoria)
    private convocatoriaRepo: Repository<Convocatoria>,
    @InjectRepository(HistorialPostulacion)
    private historialRepo: Repository<HistorialPostulacion>,
    private readonly notificacionService: NotificacionService,
  ) {}

  /** Crear como DOCENTE (id viene del JWT) */
  async createForDocente(docenteId: number, dto: CreatePostulacionDto) {
    return this.createInternal({ docenteId, ...dto });
  }

  private async createInternal(dto: {
    docenteId: number;
    convocatoriaId: number;
    programaObjetivo: string;
  }) {
    const docente = await this.docenteRepo.findOne({
      where: {usuario : {id: dto.docenteId } },
      relations: ['usuario'],
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    const convocatoria = await this.convocatoriaRepo.findOne({
      where: { id: dto.convocatoriaId },
    });
    if (!convocatoria)
      throw new NotFoundException('Convocatoria no encontrada');

    // 🔹 Validar estado/rango de fechas (del remoto)
    const hoy = new Date();
    const fechaInicio = new Date(convocatoria.fechaInicio);
    const fechaCierre = new Date(convocatoria.fechaCierre);
    const enRango = fechaInicio <= hoy && hoy <= fechaCierre;
    console.log({
  estado: convocatoria.estado,
  fechaInicio: convocatoria.fechaInicio,
  fechaCierre: convocatoria.fechaCierre,
  hoy: new Date().toISOString(),
});
    if (convocatoria.estado.toUpperCase() !== 'ABIERTA' || !enRango) {
      throw new ForbiddenException(
        'La convocatoria no está abierta para postulación',
      );
    }

    // Validar duplicados
    const existente = await this.repo.findOne({
      where: {
        docente: { id: dto.docenteId },
        convocatoria: { id: dto.convocatoriaId },
      },
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
      estado: EstadoPostulacion.ENVIADA,
    });

    const nueva = await this.repo.save(postulacion);

    // 📨 Notificar al docente usando enum
    await this.notificacionService.crear(
      docente.id,
      `Tu postulación a la convocatoria "${convocatoria.nombre}" ha sido registrada exitosamente.`,
      TipoNotificacion.POSTULACION,
    );

    // 🧑‍💼 Notificar al administrador
    try {
      await this.notificacionService.crear(
        1,
        `El docente ${docente.nombre} se ha postulado a la convocatoria "${convocatoria.nombre}".`,
        TipoNotificacion.ADMIN,
        true,
      );
    } catch (error) {
      console.warn(
        'No se pudo enviar la notificación al administrador:',
        error.message,
      );
    }

    return nueva;
  }

  async findAll(filters?: any) {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.docente', 'docente')
      .leftJoinAndSelect('p.convocatoria', 'convocatoria');

    if (filters?.estado) {
      const permitidos = Object.values(EstadoPostulacion);
      if (!permitidos.includes(filters.estado)) {
        throw new BadRequestException(
          `Estado inválido. Usa uno de: ${permitidos.join(', ')}`,
        );
      }
      qb.andWhere('p.estado = :estado', { estado: filters.estado });
    }

    if (filters?.docenteId) {
      qb.andWhere('docente.id = :docenteId', {
        docenteId: Number(filters.docenteId),
      });
    }

    if (filters?.convocatoriaId) {
      qb.andWhere('convocatoria.id = :convocatoriaId', {
        convocatoriaId: Number(filters.convocatoriaId),
      });
    }

    return qb.getMany();
  }

  async findByConvocatoria(convocatoriaId: number) {
    const convocatoria = await this.convocatoriaRepo.findOne({
      where: { id: convocatoriaId },
    });
    if (!convocatoria)
      throw new NotFoundException('Convocatoria no encontrada');

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
    if (!postulacion)
      throw new NotFoundException('Postulación no encontrada');
    return postulacion;
  }

  async updateEstado(id: number, nuevoEstado: EstadoPostulacion) {
    const postulacion = await this.repo.findOne({
      where: { id },
      relations: ['docente', 'convocatoria'],
    });
    if (!postulacion)
      throw new NotFoundException('Postulación no encontrada');

    const permitidos = Object.values(EstadoPostulacion);
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido. Usa uno de: ${permitidos.join(', ')}`,
      );
    }

    postulacion.estado = nuevoEstado;
    await this.repo.save(postulacion);

    const historial = this.historialRepo.create({
      estado: nuevoEstado,
      postulacion,
    });
    await this.historialRepo.save(historial);

    // 🔹 Agregamos notificación automática (de tu versión)
    const mensaje = `El estado de tu postulación a la convocatoria "${postulacion.convocatoria.nombre}" cambió a "${nuevoEstado}".`;
    await this.notificacionService.crear(
      postulacion.docente.id,
      mensaje,
      TipoNotificacion.ACEPTACION,
    );

    return postulacion;
  }
}
