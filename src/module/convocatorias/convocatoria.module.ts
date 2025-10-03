import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { Postulacion } from '../postulacion/entities/postulacion.entity';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { PostulacionController } from '../postulacion/postulacion.controller';
import { Docente } from '../docentes/entities/docente.entity';
import { PostulacionService } from '../postulacion/postulacion.service';
import { HistorialPostulacion } from '../postulacion/entities/historial-postulacion.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Convocatoria, Postulacion, Docente, HistorialPostulacion])],
    controllers: [ConvocatoriaController, PostulacionController],
    providers: [ConvocatoriaService, PostulacionService],
})
export class ConvocatoriaModule { }