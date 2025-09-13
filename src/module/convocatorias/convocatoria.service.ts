import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';

@Injectable()
export class ConvocatoriaService {
    constructor(@InjectRepository(Convocatoria) private repo: Repository<Convocatoria>) { }

    create(dto: CreateConvocatoriaDto) { return this.repo.save(this.repo.create(dto)); }
    findAll() { return this.repo.find(); }
    async findOne(id: number) {
        const c = await this.repo.findOne({ where: { id }, relations: { postulaciones: true } });
        if (!c) throw new NotFoundException('Convocatoria no encontrada');
        return c;
    }
    async remove(id: number) {
        const c = await this.findOne(id);
        await this.repo.remove(c);
        return { deleted: true };
    }
}