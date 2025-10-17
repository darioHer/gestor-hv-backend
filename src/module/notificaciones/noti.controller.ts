import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { NotificacionService } from './noti.service';
import { TipoNotificacion } from './entities/noti.entity';

@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly service: NotificacionService) {}

  // 📨 Crear notificación manual (Postman o backend)
  @Post()
  crear(@Body() body: { docenteId: number; mensaje: string; tipo: TipoNotificacion; esAdmin?: boolean }) {
    return this.service.crear(body.docenteId, body.mensaje, body.tipo, body.esAdmin || false);
  }

  // 📋 Ver todas las notificaciones
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 📬 Ver notificaciones de un docente específico
  @Get('docente/:id')
  findByDocente(@Param('id') id: number) {
    return this.service.findByDocente(id);
  }
  @Get('admin')
findAdmin() {
  return this.service.findAll().then(notas => notas.filter(n => !n.docente));
}

  // ✅ Marcar una notificación como leída
  @Patch(':id/leida')
  marcarLeida(@Param('id') id: number) {
    return this.service.marcarLeida(id);
  }

  // 🗑️ Eliminar una notificación
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.service.eliminar(id);
  }
}

