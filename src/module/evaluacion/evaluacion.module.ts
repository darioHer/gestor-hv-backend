import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { ItemEvaluacion } from './entities/item-evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { Postulacion } from '../postulacion/entities/postulacion.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Evaluacion, ItemEvaluacion, Postulacion])],
    controllers: [EvaluacionController],
    providers: [EvaluacionService],
})
export class EvaluacionModule { }
