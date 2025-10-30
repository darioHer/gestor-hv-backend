import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulacionController } from './postulacion.controller';
import { PostulacionService } from './postulacion.service';
import { Postulacion } from './entities/postulacion.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';
import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { NotificacionModule } from '../notificaciones/noti.module';
import { DocumentoPostulacion } from './entities/documento-postulacion.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
      MulterModule.register(),
      TypeOrmModule.forFeature([
      Postulacion,
      HistorialPostulacion,
      DocumentoPostulacion,
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
