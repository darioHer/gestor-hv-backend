import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Administrador } from './entities/admin.entity';

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Administrador) private repo: Repository<Administrador>) { }

    async create(dto: CreateAdminDto) {
        const exists = await this.repo.findOne({ where: { usuario: dto.usuario } });
        if (exists) throw new BadRequestException('El usuario ya existe');

        const hash = await bcrypt.hash(dto.password, 10);
        const admin = this.repo.create({ ...dto, password: hash });
        const saved = await this.repo.save(admin);
        const { password, ...safe } = saved;
        return safe;
    }

    async findAll() {
        const list = await this.repo.find();
        return list.map(({ password, ...safe }) => safe);
    }

    async findOne(id: number) {
        const a = await this.repo.findOne({ where: { id } });
        if (!a) throw new NotFoundException('Admin no encontrado');
        const { password, ...safe } = a;
        return safe;
    }

    async update(id: number, dto: UpdateAdminDto) {
        const a = await this.repo.findOne({ where: { id } });
        if (!a) throw new NotFoundException('Admin no encontrado');

        if (dto.usuario && dto.usuario !== a.usuario) {
            const exists = await this.repo.findOne({ where: { usuario: dto.usuario } });
            if (exists) throw new BadRequestException('El usuario ya existe');
        }

        if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

        Object.assign(a, dto);
        const saved = await this.repo.save(a);
        const { password, ...safe } = saved;
        return safe;
    }

    async remove(id: number) {
        const a = await this.repo.findOne({ where: { id } });
        if (!a) throw new NotFoundException('Admin no encontrado');
        await this.repo.remove(a);
        return { deleted: true };
    }
}
