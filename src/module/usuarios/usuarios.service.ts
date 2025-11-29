import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
  ) {}

  // Crear un nuevo usuario (DTO simplificado)
  async create(dto: RegisterDto) {
    const username = dto.usuario.trim().toLowerCase();

    const exists = await this.userRepo.findOne({ where: { usuario: username } });
    if (exists) throw new BadRequestException('El usuario ya existe');

    const hash = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = this.userRepo.create({
      nombre: dto.nombre,
      usuario: username,
      password: hash,
      rol: dto.rol ?? Role.DOCENTE,
    });

    const saved = await this.userRepo.save(nuevoUsuario);
    // Retornar sin password
    const { password: _omit, ...safe } = saved;
    return safe;
  }

  async findAll() {
    // Selección segura por defecto (sin password)
    return this.userRepo.find({
      select: ['id', 'nombre', 'usuario', 'rol'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'nombre', 'usuario', 'rol'], // seguro
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: Partial<RegisterDto>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.usuario && dto.usuario.trim().toLowerCase() !== user.usuario) {
      const nextUsername = dto.usuario.trim().toLowerCase();
      const exists = await this.userRepo.findOne({ where: { usuario: nextUsername } });
      if (exists) throw new BadRequestException('Ya existe un usuario con ese nombre');
      user.usuario = nextUsername;
    }

    if (dto.nombre) user.nombre = dto.nombre;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.rol) {
      user.rol = dto.rol as Role;
    }

    const saved = await this.userRepo.save(user);
    const { password: _omit, ...safe } = saved;
    return safe;
  }

  async delete(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario eliminado correctamente' };
  }
}
