import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostulacionController } from './postulacion.controller';
import { PostulacionService } from './postulacion.service';

import { Postulacion } from './entities/postulacion.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';
import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Postulacion,
            HistorialPostulacion,
            Docente,
            Convocatoria,
        ]),
    ],
    controllers: [PostulacionController],
    providers: [PostulacionService],
    exports: [PostulacionService],
})
export class PostulacionModule { }
