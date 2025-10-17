import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotificacionService } from './noti.service';

@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Post()
  async crear(@Body() body: { usuarioId: number; mensaje: string }) {
    return this.notificacionService.crear(body.usuarioId, body.mensaje);
  }

  @Get(':usuarioId')
  async listar(@Param('usuarioId') usuarioId: number) {
    return this.notificacionService.listarPorUsuario(usuarioId);
  }
}
