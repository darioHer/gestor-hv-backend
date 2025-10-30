import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulacionController } from './postulacion.controller';
import { PostulacionService } from './postulacion.service';
import { Postulacion } from './entities/postulacion.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';
import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { NotificacionModule } from '../notificaciones/noti.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Postulacion,
      HistorialPostulacion,
      Docente,
      Convocatoria,
    ]),
    forwardRef(() => NotificacionModule),
  ],
  controllers: [PostulacionController],
  providers: [PostulacionService],
  exports: [PostulacionService],
})
export class PostulacionModule {}
