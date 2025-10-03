import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Administrador } from '../admin/entities/admin.entity';
import { RegisterAdminDto } from './dtos/register-admin.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Administrador) private adminRepo: Repository<Administrador>,
        private jwt: JwtService,
    ) { }

    async validateUser(usuario: string, password: string) {
        const user = await this.adminRepo.findOne({ where: { usuario } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        return ok ? user : null;
    }

    async login(user: Administrador) {
        const payload = { sub: user.id, rol: user.rol, usuario: user.usuario };
        return { access_token: await this.jwt.signAsync(payload) };
    }

    async seedAdmin() {
        const exists = await this.adminRepo.findOne({ where: { usuario: 'admin' } });
        if (exists) return exists;
        const hash = await bcrypt.hash('admin123', 10);
        const admin = this.adminRepo.create({
            nombre: 'Super Admin',
            usuario: 'admin',
            password: hash,
            rol: 'ADMIN',
        });
        return this.adminRepo.save(admin);
    }

    async register(dto: RegisterAdminDto) {
        

        const exists = await this.adminRepo.findOne({ where: { usuario: dto.usuario } });
        if (exists) {
            throw new BadRequestException('El usuario ya existe');
        }

        const hash = await bcrypt.hash(dto.password, 10);
        const admin = this.adminRepo.create({
            nombre: dto.nombre,
            usuario: dto.usuario,
            password: hash,
            rol: dto.rol ?? 'ADMIN',
        });

        return this.adminRepo.save(admin);
    }
}
