import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrador } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Administrador) private repo: Repository<Administrador>) { }

    async create(dto: CreateAdminDto) {
        const hash = await bcrypt.hash(dto.password, 10);
        const admin = this.repo.create({ ...dto, password: hash });
        return this.repo.save(admin);
    }
    findAll() { return this.repo.find(); }
    async findOne(id: number) {
        const a = await this.repo.findOne({ where: { id } });
        if (!a) throw new NotFoundException('Admin no encontrado');
        return a;
    }
    async update(id: number, dto: UpdateAdminDto) {
        const a = await this.findOne(id);
        if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
        Object.assign(a, dto);
        return this.repo.save(a);
    }
    async remove(id: number) {
        const a = await this.findOne(id);
        await this.repo.remove(a);
        return { deleted: true };
    }
}
