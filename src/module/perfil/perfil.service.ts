import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PerfilDocente } from './entities/perfil-docente.entity';
import { PerfilDestacado } from './entities/perfil-destacado.entity';
import { PerfilEvidencia } from './entities/perfil-evidencia.entity';
import { RevisionPostulacion } from './entities/revision-postulacion.entity';
import { RevisionEtiqueta } from './entities/revision-etiqueta.entity';

import { UpsertPerfilDto } from './dto/upsert-perfil.dto';
import { CreateDestacadoDto } from './dto/create-destacado.dto';
import { UpdateDestacadoDto } from './dto/update-destacado.dto';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { SetRevisionEtiquetasDto } from './dto/set-revision-etiquetas.dto';
import { SetRevisionMarcadorDto } from './dto/set-revision-marcador.dto';
import { MarcadorRevision } from './enums/marcador.enum';

@Injectable()
export class PerfilService {
    constructor(
        @InjectRepository(PerfilDocente) private perfiles: Repository<PerfilDocente>,
        @InjectRepository(PerfilDestacado) private destacados: Repository<PerfilDestacado>,
        @InjectRepository(PerfilEvidencia) private evidencias: Repository<PerfilEvidencia>,
        @InjectRepository(RevisionPostulacion) private revisiones: Repository<RevisionPostulacion>,
        @InjectRepository(RevisionEtiqueta) private etiquetasRepo: Repository<RevisionEtiqueta>,
    ) { }

    // ---------- helpers ----------
    private async ensurePerfil(userId: number): Promise<PerfilDocente> {
        let perfil = await this.perfiles.findOne({ where: { user_id: userId } });
        if (!perfil) {
            perfil = this.perfiles.create({ user_id: userId });
            perfil = await this.perfiles.save(perfil);
        }
        return perfil;
    }

    private ensureEtiquetas(dto: SetRevisionEtiquetasDto) {
        const normalized = dto.etiquetas
            .map((e) => e.trim().toLowerCase())
            .filter((e) => !!e);
        if (normalized.length !== dto.etiquetas.length) {
            throw new BadRequestException('Algunas etiquetas son vacías/espacios.');
        }
        return Array.from(new Set(normalized)).slice(0, 20);
    }

    private validateFechas(emision?: string, vencimiento?: string) {
        if (emision && vencimiento && new Date(vencimiento) < new Date(emision)) {
            throw new BadRequestException('La fecha de vencimiento no puede ser anterior a la de emisión.');
        }
    }

    // ---------- docente ----------
    async getPerfilForUser(userId: number) {
        const perfil = await this.perfiles.findOne({
            where: { user_id: userId },
            relations: ['destacados', 'evidencias'],
            order: { evidencias: { id: 'DESC' }, destacados: { id: 'DESC' } },
        });
        return perfil ?? { user_id: userId, resumen: null, modalidadPreferida: null, destacados: [], evidencias: [] };
    }

    async upsertPerfilForUser(userId: number, dto: UpsertPerfilDto) {
        const perfil = await this.ensurePerfil(userId);
        this.perfiles.merge(perfil, dto);
        return this.perfiles.save(perfil);
    }

    async addDestacadoForUser(userId: number, dto: CreateDestacadoDto) {
        const perfil = await this.ensurePerfil(userId);
        const entity = this.destacados.create({ ...dto, perfil_id: perfil.id });
        return this.destacados.save(entity);
    }

    async updateDestacadoForUser(userId: number, id: number, dto: UpdateDestacadoDto) {
        const perfil = await this.ensurePerfil(userId);
        const entity = await this.destacados.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Destacado no encontrado');
        if (entity.perfil_id !== perfil.id) throw new ForbiddenException();
        this.destacados.merge(entity, dto);
        return this.destacados.save(entity);
    }

    async removeDestacadoForUser(userId: number, id: number) {
        const perfil = await this.ensurePerfil(userId);
        const entity = await this.destacados.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Destacado no encontrado');
        if (entity.perfil_id !== perfil.id) throw new ForbiddenException();
        await this.destacados.delete(id);
        return { ok: true };
    }

    async addEvidenciaForUser(userId: number, dto: CreateEvidenciaDto) {
        const perfil = await this.ensurePerfil(userId);
        this.validateFechas(dto.fechaEmision, dto.fechaVencimiento);
        const entity = this.evidencias.create({ ...dto, perfil_id: perfil.id });
        return this.evidencias.save(entity);
    }

    async updateEvidenciaForUser(userId: number, id: number, dto: UpdateEvidenciaDto) {
        const perfil = await this.ensurePerfil(userId);
        const entity = await this.evidencias.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Evidencia no encontrada');
        if (entity.perfil_id !== perfil.id) throw new ForbiddenException();
        this.validateFechas(dto.fechaEmision, dto.fechaVencimiento);
        this.evidencias.merge(entity, dto);
        return this.evidencias.save(entity);
    }

    async removeEvidenciaForUser(userId: number, id: number) {
        const perfil = await this.ensurePerfil(userId);
        const entity = await this.evidencias.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Evidencia no encontrada');
        if (entity.perfil_id !== perfil.id) throw new ForbiddenException();
        await this.evidencias.delete(id);
        return { ok: true };
    }

    // ---------- admin / comité ----------
    async getPerfilParaRevision(convId: number, postId: number) {
        // Aquí idealmente traes la postulación -> usuario -> perfil.
        // Como no tenemos entidad Postulacion en este snippet, retornamos la revisión (si existe) y el perfil asociado a la postulación.
        // Ajusta esta consulta según tu modelo real de Postulación <-> Usuario.
        const revision = await this.revisiones.findOne({
            where: { convocatoria_id: convId, postulacion_id: postId },
            relations: ['etiquetas'],
        });

        return {
            revision: revision ?? null,
            // perfilPostulante: ... (traer por join real en tu dominio)
        };
    }

    async setEtiquetas(convId: number, postId: number, revisorId: number, dto: SetRevisionEtiquetasDto) {
        const normalized = this.ensureEtiquetas(dto);
        let revision = await this.revisiones.findOne({
            where: { convocatoria_id: convId, postulacion_id: postId, revisor_id: revisorId },
            relations: ['etiquetas'],
        });
        if (!revision) {
            revision = this.revisiones.create({
                convocatoria_id: convId,
                postulacion_id: postId,
                revisor_id: revisorId,
                marcador: MarcadorRevision.OBSERVAR,
                etiquetas: [],
            });
            revision = await this.revisiones.save(revision);
        }

        // Reemplazo total de etiquetas
        await this.etiquetasRepo.delete({ revision_id: revision.id });
        const toSave = normalized.map((et) => this.etiquetasRepo.create({ revision_id: revision.id, etiqueta: et }));
        await this.etiquetasRepo.save(toSave);

        revision.etiquetas = toSave;
        return revision;
    }

    async setMarcador(convId: number, postId: number, revisorId: number, dto: SetRevisionMarcadorDto) {
        let revision = await this.revisiones.findOne({
            where: { convocatoria_id: convId, postulacion_id: postId, revisor_id: revisorId },
        });
        if (!revision) {
            revision = this.revisiones.create({
                convocatoria_id: convId,
                postulacion_id: postId,
                revisor_id: revisorId,
                marcador: dto.marcador,
            });
        } else {
            revision.marcador = dto.marcador;
        }
        return this.revisiones.save(revision);
    }
}