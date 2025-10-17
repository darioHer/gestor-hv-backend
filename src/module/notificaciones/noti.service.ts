import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, TipoNotificacion } from './entities/noti.entity';
import { Docente } from '../docentes/entities/docente.entity';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,

    @InjectRepository(Docente)
    private readonly docenteRepo: Repository<Docente>,
  ) {}

  async crear(
    usuarioId: number,
    mensaje: string,
    tipo: TipoNotificacion,
    esAdmin = false
  ) {
    let docente: Docente | null = null;

docente = await this.docenteRepo.findOne({ where: { id: usuarioId } });

    if (!esAdmin) {
      docente = await this.docenteRepo.findOne({ where: { id: usuarioId } });
      if (!docente) throw new NotFoundException(`No se encontró el docente con ID ${usuarioId}`);
    }

    const notificacion = this.notificacionRepo.create({
      mensaje,
      tipo,
      leida: false,
      docente: docente || null,
    });

    return await this.notificacionRepo.save(notificacion);
  }

  async findAll() {
    return await this.notificacionRepo.find({ order: { id: 'DESC' } });
  }

  async findByDocente(docenteId: number) {
    return await this.notificacionRepo.find({
      where: { docente: { id: docenteId } },
      order: { id: 'DESC' },
    });
  }

  async marcarLeida(id: number) {
    const notificacion = await this.notificacionRepo.findOne({ where: { id } });
    if (!notificacion) throw new NotFoundException('Notificación no encontrada');

    notificacion.leida = true;
    return await this.notificacionRepo.save(notificacion);
  }

  async eliminar(id: number) {
    const notificacion = await this.notificacionRepo.findOne({ where: { id } });
    if (!notificacion) throw new NotFoundException('Notificación no encontrada');

    return await this.notificacionRepo.remove(notificacion);
  }
}
