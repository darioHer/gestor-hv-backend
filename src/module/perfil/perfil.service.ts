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
    private readonly modalidades = ['presencial', 'virtual', 'mixta'] as const;

    constructor(
        @InjectRepository(PerfilDocente) private readonly perfilRepo: Repository<PerfilDocente>,
        @InjectRepository(PerfilDestacado) private readonly destRepo: Repository<PerfilDestacado>,
        @InjectRepository(PerfilEvidencia) private readonly evidRepo: Repository<PerfilEvidencia>,
        @InjectRepository(RevisionPostulacion) private readonly revRepo: Repository<RevisionPostulacion>,
        @InjectRepository(RevisionEtiqueta) private readonly etiqRepo: Repository<RevisionEtiqueta>,
    ) { }


    private async ensurePerfil(userId: number): Promise<PerfilDocente> {
        let perfil = await this.perfilRepo.findOne({ where: { user_id: userId } });
        if (!perfil) {
            perfil = this.perfilRepo.create({ user_id: userId });
            perfil = await this.perfilRepo.save(perfil);
        }
        return perfil;
    }

  
    private applyPerfilChanges(perfil: PerfilDocente, dto: UpsertPerfilDto): void {
        if (typeof dto.resumen === 'string') {
            perfil.resumen = dto.resumen;
        }
        if (
            dto.modalidadPreferida &&
            this.modalidades.includes(dto.modalidadPreferida as (typeof this.modalidades)[number])
        ) {
            perfil.modalidadPreferida = dto.modalidadPreferida as typeof this.modalidades[number];
        }
    }


    async upsertPerfilForUser(userId: number, dto: UpsertPerfilDto) {
        const perfil = await this.ensurePerfil(userId);
        this.applyPerfilChanges(perfil, dto);
        return this.perfilRepo.save(perfil);
    }

    async addDestacadoForUser(userId: number, dto: CreateDestacadoDto) {
        const perfil = await this.ensurePerfil(userId);
        const destacado = this.destRepo.create({
            ...dto,
            perfil_id: (perfil as any).id ?? perfil['id'],

        });
        return this.destRepo.save(destacado);
    }


    async addEvidenciaForUser(userId: number, dto: CreateEvidenciaDto) {
        const perfil = await this.ensurePerfil(userId);
        const evidencia = this.evidRepo.create({
            ...dto,
            perfil_id: (perfil as any).id ?? perfil['id'],

        });
        return this.evidRepo.save(evidencia);
    }


    async upsertPerfil(dto: UpsertPerfilDto) {
        let perfil = await this.perfilRepo.findOne({ where: { user_id: dto.user_id } });
        if (!perfil) perfil = this.perfilRepo.create({ user_id: dto.user_id });
        this.applyPerfilChanges(perfil, dto);
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
        const perfil = await this.perfilRepo.findOne({
            where: { user_id: postId },
            relations: ['destacados', 'evidencias'],
        });
        return perfil ?? { message: 'Perfil no encontrado' };
    }


    async setEtiquetas(postId: number, dto: SetRevisionEtiquetasDto) {
        let rev = await this.revRepo.findOne({
            where: { postulacion_id: postId },
            relations: ['etiquetas'],
        });

        if (!rev) {
            rev = this.revRepo.create({
                postulacion_id: postId,
                convocatoria_id: 0, 
                revisor_id: 0,     
            });
        }


        rev.etiquetas = (dto.etiquetas ?? []).map((et) =>
            this.etiqRepo.create({ etiqueta: et, revision: rev }),
        );

        return this.revRepo.save(rev);
    }


    async setMarcador(postId: number, dto: SetRevisionMarcadorDto) {
        let rev = await this.revRepo.findOne({ where: { postulacion_id: postId } });
        if (!rev) {
            rev = this.revRepo.create({
                postulacion_id: postId,
                convocatoria_id: 0, 
                revisor_id: 0,      
            });
        }
        rev.marcador = dto.marcador;
        return this.revRepo.save(rev);
    }
}
