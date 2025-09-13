import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Docente } from '../docentes/entities/docente.entity';
import { Postulacion } from '../convocatorias/entities/postulacion.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { CreatePostulacionDto } from '../convocatorias/dto/create-postulacion.dto';


@Injectable()
export class PostulacionService {
    constructor(
        @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
        @InjectRepository(Convocatoria) private convRepo: Repository<Convocatoria>,
        @InjectRepository(Docente) private docRepo: Repository<Docente>,
    ) { }

    async create(dto: CreatePostulacionDto) {
        const docente = await this.docRepo.findOne({ where: { id: dto.docenteId } });
        if (!docente) throw new NotFoundException('Docente no encontrado');

        const convocatoria = await this.convRepo.findOne({ where: { id: dto.convocatoriaId } });
        if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

        const postulacion = this.repo.create({
            docente,
            convocatoria,
            programaObjetivo: dto.programaObjetivo,
        });
        return this.repo.save(postulacion);
    }

    findAll() {
        return this.repo.find({ relations: { convocatoria: true } });
    }

    findByConvocatoria(convocatoriaId: number) {
        return this.repo.find({
            where: { convocatoria: { id: convocatoriaId } },
            relations: { docente: true },
        });
    }
}