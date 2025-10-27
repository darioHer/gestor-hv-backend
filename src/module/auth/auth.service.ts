import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Administrador } from '../admin/entities/admin.entity';

import { RegisterDto } from './dtos/register.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Administrador) private adminRepo: Repository<Administrador>,
        private jwt: JwtService,
    ) { }
    async validateUser(usuario: string, password: string) {
        const user = await this.adminRepo.findOne({ where: { usuario } });
        if (!user) throw new UnauthorizedException('Usuario o contraseña inválidos');

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new UnauthorizedException('Usuario o contraseña inválidos');

        const { password: _, ...safe } = user;
        return safe; 
    }

    async login(user: { id: number; usuario: string; rol: Role }) {
        const payload = { sub: user.id, usuario: user.usuario, rol: user.rol };
        return {
            access_token: await this.jwt.signAsync(payload),
            user,
        };
    }

    async register(dto: RegisterDto) {
        const exists = await this.adminRepo.findOne({ where: { usuario: dto.usuario } });
        if (exists) throw new BadRequestException('El usuario ya existe');

        const hash = await bcrypt.hash(dto.password, 10);
        const admin = this.adminRepo.create({
            nombre: dto.nombre,
            usuario: dto.usuario,
            password: hash,
            rol: dto.rol ?? Role.DOCENTE, 
        });

        const saved = await this.adminRepo.save(admin);
        const { password: _, ...safe } = saved;
        return safe;
    }

    async findById(id: number) {
        const user = await this.adminRepo.findOne({ where: { id } });
        if (!user) throw new UnauthorizedException('No autorizado');
        const { password: _, ...safe } = user;
        return safe;
    }
}
