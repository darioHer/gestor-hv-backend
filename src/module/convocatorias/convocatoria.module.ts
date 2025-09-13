import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { Postulacion } from './entities/postulacion.entity';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { PostulacionController } from '../postulacion/postulacion.controller';
import { Docente } from '../docentes/entities/docente.entity';
import { PostulacionService } from '../postulacion/postulacion.service';

@Module({
    imports: [TypeOrmModule.forFeature([Convocatoria, Postulacion, Docente])],
    controllers: [ConvocatoriaController, PostulacionController],
    providers: [ConvocatoriaService, PostulacionService],
})
export class ConvocatoriaModule { }