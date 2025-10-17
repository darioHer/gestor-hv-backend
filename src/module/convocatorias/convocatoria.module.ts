import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { NotificacionModule } from '../notificaciones/noti.module';
import { PostulacionModule } from '../postulacion/postulacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convocatoria]),
    forwardRef(() => PostulacionModule), // 👈 importa el módulo completo, no el servicio
    forwardRef(() => NotificacionModule), // 👈 necesario porque hay dependencia entre ambos
  ],
  controllers: [ConvocatoriaController],
  providers: [ConvocatoriaService],
  exports: [ConvocatoriaService],
})
export class ConvocatoriaModule {}
