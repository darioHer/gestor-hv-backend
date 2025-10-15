import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilDocente } from './entities/perfil-docente.entity';
import { PerfilDestacado } from './entities/perfil-destacado.entity';
import { PerfilEvidencia } from './entities/perfil-evidencia.entity';
import { RevisionPostulacion } from './entities/revision-postulacion.entity';
import { RevisionEtiqueta } from './entities/revision-etiqueta.entity';
import { CreateDestacadoDto } from './dto/create-destacado.dto';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpsertPerfilDto } from './dto/upsert-perfil.dto';
import { SetRevisionEtiquetasDto } from './dto/set-revision-etiquetas.dto';
import { SetRevisionMarcadorDto } from './dto/set-revision-marcador.dto';

@Injectable()
export class PerfilService {
    constructor(
        @InjectRepository(PerfilDocente) private perfilRepo: Repository<PerfilDocente>,
        @InjectRepository(PerfilDestacado) private destRepo: Repository<PerfilDestacado>,
        @InjectRepository(PerfilEvidencia) private evidRepo: Repository<PerfilEvidencia>,
        @InjectRepository(RevisionPostulacion) private revRepo: Repository<RevisionPostulacion>,
        @InjectRepository(RevisionEtiqueta) private etiqRepo: Repository<RevisionEtiqueta>,
    ) { }

    async upsertPerfil(dto: UpsertPerfilDto) {
        let perfil = await this.perfilRepo.findOne({ where: { user_id: dto.user_id } });
        if (!perfil) perfil = this.perfilRepo.create({ user_id: dto.user_id });
        perfil.resumen = dto.resumen ?? perfil.resumen;
        if (dto.modalidadPreferida === 'presencial' || dto.modalidadPreferida === 'virtual' || dto.modalidadPreferida === 'mixta') {
            perfil.modalidadPreferida = dto.modalidadPreferida;
        }
        return this.perfilRepo.save(perfil);
    }

    async addDestacado(dto: CreateDestacadoDto) {
        const destacado = this.destRepo.create(dto);
        return this.destRepo.save(destacado);
    }

    async addEvidencia(dto: CreateEvidenciaDto) {
        const evidencia = this.evidRepo.create(dto);
        return this.evidRepo.save(evidencia);
    }

    async getPerfilParaRevision(postId: number) {
        // simplificado; aquí se conectaría con postulacion para obtener user_id
        const perfil = await this.perfilRepo.findOne({
            where: { user_id: postId },
            relations: ['destacados', 'evidencias'],
        });
        return perfil ?? { message: 'Perfil no encontrado' };
    }

    async setEtiquetas(postId: number, dto: SetRevisionEtiquetasDto) {
        let rev = await this.revRepo.findOne({ where: { postulacion_id: postId }, relations: ['etiquetas'] });
        if (!rev) rev = this.revRepo.create({ postulacion_id: postId, convocatoria_id: 0, revisor_id: 0 });
        rev.etiquetas = dto.etiquetas.map(et => this.etiqRepo.create({ etiqueta: et, revision: rev }));
        return this.revRepo.save(rev);
    }

    async setMarcador(postId: number, dto: SetRevisionMarcadorDto) {
        let rev = await this.revRepo.findOne({ where: { postulacion_id: postId } });
        if (!rev) rev = this.revRepo.create({ postulacion_id: postId, convocatoria_id: 0, revisor_id: 0 });
        rev.marcador = dto.marcador;
        return this.revRepo.save(rev);
    }
}
