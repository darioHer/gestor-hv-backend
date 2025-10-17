import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/noti.entity';
import { Docente } from '../docentes/entities/docente.entity';
import { NotificacionService } from './noti.service';
import { NotificacionController } from './noti.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion, Docente])],
  providers: [NotificacionService],
  controllers: [NotificacionController],
  exports: [NotificacionService], // 👈 Para usarlo en otros módulos (como PostulacionService)
})
export class NotificacionModule {}
