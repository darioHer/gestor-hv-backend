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
    if (!esAdmin) {
      docente = await this.docenteRepo.findOne({ 
        where: { id: usuarioId } 
      });
      
      if (!docente) {
        throw new NotFoundException(`No se encontró el docente con ID ${usuarioId}`);
      }
    }

    const notificacion = this.notificacionRepo.create({
      mensaje,
      tipo,
      leida: false,
      docente: docente, 
    });

    const notificacionGuardada = await this.notificacionRepo.save(notificacion);
    return notificacionGuardada;
  }
  
async crearMasiva(
  mensaje: string,
  tipo: TipoNotificacion,
) {
  const notificacion = this.notificacionRepo.create({
    mensaje,
    tipo,
    leida: false,
    docente: null, 
  });

  const notificacionGuardada = await this.notificacionRepo.save(notificacion);
  return notificacionGuardada;
}

  async findAll() {
  const notificaciones = await this.notificacionRepo.find({
    relations: ['docente'],
    order: { id: 'DESC' }
  });

  return notificaciones.map(noti => ({
    id: noti.id,
    mensaje: noti.mensaje,
    tipo: noti.tipo,
    leida: noti.leida,
    fechaCreacion: noti.createdAt,
    docente: noti.docente ? {
      id: noti.docente.id,
      nombre: noti.docente.nombre
    } : null
  }));
}

  async findByDocente(docenteId: number) {
  const notificaciones = await this.notificacionRepo.find({
    where: { docente: { id: docenteId } },
    relations: ['docente'],
    order: { id: 'DESC' },
  });

  return notificaciones.map(noti => ({
    id: noti.id,
    mensaje: noti.mensaje,
    tipo: noti.tipo,
    leida: noti.leida,
    fechaCreacion: noti.createdAt
  }));
}

  async findForAdmin() {
  const notificaciones = await this.notificacionRepo.find({
    relations: ['docente'],
    order: { id: 'DESC' },
  });

  return notificaciones.map(noti => ({
    id: noti.id,
    mensaje: noti.mensaje,
    tipo: noti.tipo,
    leida: noti.leida,
    fechaCreacion: noti.createdAt,
    docente: noti.docente ? {
      id: noti.docente.id,
      nombre: noti.docente.nombre
    } : null
  }));
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