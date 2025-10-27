import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Convocatoria } from './entities/convocatoria.entity';
import { Postulacion } from '../postulacion/entities/postulacion.entity';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Convocatoria, Postulacion]),
        ScheduleModule.forRoot(),
    ],
    controllers: [ConvocatoriaController],
    providers: [ConvocatoriaService],
})
export class ConvocatoriaModule { }
