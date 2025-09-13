import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { HojaDeVida } from './entities/hoja-de-vida.entity';
import { Documento } from './entities/documento.entity';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Docente, HojaDeVida, Documento])],
    controllers: [DocenteController],
    providers: [DocenteService],
    exports: [TypeOrmModule],
})
export class DocenteModule { }