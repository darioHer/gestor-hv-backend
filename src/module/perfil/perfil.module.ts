import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';
import { PerfilDocente } from './entities/perfil-docente.entity';
import { PerfilDestacado } from './entities/perfil-destacado.entity';
import { PerfilEvidencia } from './entities/perfil-evidencia.entity';
import { RevisionPostulacion } from './entities/revision-postulacion.entity';
import { RevisionEtiqueta } from './entities/revision-etiqueta.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PerfilDocente,
            PerfilDestacado,
            PerfilEvidencia,
            RevisionPostulacion,
            RevisionEtiqueta,
        ]),
    ],
    controllers: [PerfilController],
    providers: [PerfilService],
    exports: [PerfilService],
})
export class PerfilModule { }
