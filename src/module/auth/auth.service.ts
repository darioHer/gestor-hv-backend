import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Docente } from '../docentes/entities/docente.entity';
import { RegisterDto } from './dtos/register.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,

    @InjectRepository(Docente)
    private readonly docenteRepo: Repository<Docente>,

    private readonly jwt: JwtService,
  ) {}

  // ✅ Validar credenciales de login
  async validateUser(usuario: string, password: string) {
    const user = await this.userRepo.findOne({ where: { usuario } });
    if (!user) throw new UnauthorizedException('Usuario o contraseña inválidos');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Usuario o contraseña inválidos');

    const { password: _, ...safe } = user;
    return safe;
  }

  // ✅ Generar token JWT
  async login(user: { id: number; usuario: string; rol: Role }) {
    const payload = { sub: user.id, usuario: user.usuario, rol: user.rol };
    return {
      access_token: await this.jwt.signAsync(payload),
      user,
    };
  }

  // ✅ Registrar nuevos usuarios (por defecto DOCENTE)
  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { usuario: dto.usuario } });
    if (exists) throw new BadRequestException('El usuario ya existe');

    const hash = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = this.userRepo.create({
      nombre: dto.nombre,
      usuario: dto.usuario,
      password: hash,
      rol: dto.rol ?? Role.DOCENTE
    });

    const savedUser = await this.userRepo.save(nuevoUsuario);

    // 🔹 Si el usuario registrado es un docente, crea su entrada asociada
    if (savedUser.rol === Role.DOCENTE) {
      const nuevoDocente = this.docenteRepo.create({
        usuario: savedUser, // relación 1:1 con Usuario
      });
      await this.docenteRepo.save(nuevoDocente);
    }

    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  // ✅ Buscar usuario por ID
  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('No autorizado');
    const { password: _, ...safe } = user;
    return safe;
  }
}
