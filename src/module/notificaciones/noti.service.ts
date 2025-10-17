import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/noti.entity';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
  ) {}

  async crear(usuarioId: number, mensaje: string): Promise<Notificacion> {
    const notificacion = this.notificacionRepo.create({ usuarioId, mensaje });
    return this.notificacionRepo.save(notificacion);
  }

  async listarPorUsuario(usuarioId: number): Promise<Notificacion[]> {
    return this.notificacionRepo.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }
}
