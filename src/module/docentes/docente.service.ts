import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Docente } from './entities/docente.entity';
import { HojaDeVida } from './entities/hoja-de-vida.entity';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Injectable()
export class DocenteService {
    constructor(
        @InjectRepository(Docente) private repo: Repository<Docente>,
        @InjectRepository(HojaDeVida) private hvRepo: Repository<HojaDeVida>,
    ) { }

    async create(dto: CreateDocenteDto) {
        const existe = await this.repo.findOne({ where: { identificacion: dto.identificacion } });
        if (existe) {
            throw new BadRequestException('Ya existe un docente con esa identificación');
        }

        const docente = this.repo.create(dto);
        const hv = this.hvRepo.create({});
        docente.hojaDeVida = hv;
        await this.hvRepo.save(hv);
        return this.repo.save(docente);
    }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const d = await this.repo.findOne({ where: { id } });
        if (!d) throw new NotFoundException('Docente no encontrado');
        return d;
    }

    async update(id: number, dto: UpdateDocenteDto) {
        const d = await this.findOne(id);
        if (dto.identificacion && dto.identificacion !== d.identificacion) {
            const existe = await this.repo.findOne({ where: { identificacion: dto.identificacion } });
            if (existe) {
                throw new BadRequestException('Ya existe un docente con esa identificación');
            }
        }

        Object.assign(d, dto);
        return this.repo.save(d);
    }

    async remove(id: number) {
        const d = await this.findOne(id);
        await this.repo.remove(d);
        return { deleted: true };
    }
}
