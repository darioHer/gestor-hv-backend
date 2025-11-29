import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsuariosService } from "../usuarios/usuarios.service";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { Repository } from "typeorm";
import { Role } from "../common/enums/role.enum";
import { RegisterDto } from "./dtos/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly jwt: JwtService,

    // Para validar credenciales (obtener password hash)
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
  ) {}


  async validateUser(usuario: string, password: string) {
    const key = usuario.trim().toLowerCase();

    const user = await this.userRepo.findOne({ where: { usuario: key } });
    if (!user) throw new UnauthorizedException('Usuario o contraseña inválidos');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Usuario o contraseña inválidos');
    const { password: _omit, ...safe } = user;
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
    const saved = await this.usuarios.create({
      ...dto,
      usuario: dto.usuario.trim().toLowerCase(),
      rol: dto.rol ?? Role.DOCENTE,
    });

    const payload = { sub: saved.id, usuario: saved.usuario, rol: saved.rol };
    return {
      message: 'Registro exitoso',
      access_token: await this.jwt.signAsync(payload),
      user: { id: saved.id, nombre: saved.nombre, usuario: saved.usuario, rol: saved.rol },
    };
  }
  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('No autorizado');
    const { password: _omit, ...safe } = user;
    return safe;
  }
}

