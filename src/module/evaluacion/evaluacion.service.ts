import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { ItemEvaluacion } from './entities/item-evaluacion.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { Postulacion } from '../postulacion/entities/postulacion.entity';


@Injectable()
export class EvaluacionService {
    constructor(
        @InjectRepository(Evaluacion) private evalRepo: Repository<Evaluacion>,
        @InjectRepository(ItemEvaluacion) private itemRepo: Repository<ItemEvaluacion>,
        @InjectRepository(Postulacion) private postRepo: Repository<Postulacion>,
    ) { }

    private computeNotaTotal(items: ItemEvaluacion[]) {
        return items.reduce((acc, i) => acc + Number(i.peso) * Number(i.notaAsignada), 0);
    }

    async create(dto: CreateEvaluacionDto) {
        const post = await this.postRepo.findOne({ where: { id: dto.postulacionId } });
        if (!post) throw new NotFoundException('Postulación no encontrada');
        const evalEntity = this.evalRepo.create({
            comentarios: dto.comentarios,
            postulacion: post,
            items: dto.items as any,
        });
        evalEntity.notaTotal = this.computeNotaTotal(evalEntity.items);
        return this.evalRepo.save(evalEntity);
    }

    findAll() { return this.evalRepo.find(); }

    async remove(id: number) {
        const e = await this.evalRepo.findOne({ where: { id } });
        if (!e) throw new NotFoundException('Evaluación no encontrada');
        await this.evalRepo.remove(e);
        return { deleted: true };
    }
}
