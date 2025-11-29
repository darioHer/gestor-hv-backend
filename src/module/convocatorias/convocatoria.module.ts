import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Convocatoria } from './entities/convocatoria.entity';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { NotificacionModule } from '../notificaciones/noti.module';
import { PostulacionModule } from '../postulacion/postulacion.module';
import { Postulacion } from '../postulacion/entities/postulacion.entity';
import { Docente } from '../docentes/entities/docente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convocatoria, Postulacion, Docente]),
    ScheduleModule.forRoot(),
    forwardRef(() => PostulacionModule),
    forwardRef(() => NotificacionModule),
  ],
  controllers: [ConvocatoriaController],
  providers: [ConvocatoriaService],
  exports: [ConvocatoriaService],
})
export class ConvocatoriaModule {}
