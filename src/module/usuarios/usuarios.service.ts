import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import { Role } from '../common/enums/role.enum';
import { Docente } from '../docentes/entities/docente.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,

    @InjectRepository(Docente)
    private readonly docenteRepo: Repository<Docente>,
  ) {}

  // 🔹 Crear un nuevo usuario
   async create(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { usuario: dto.usuario } });
    if (exists) throw new BadRequestException('El usuario ya existe');

    const hash = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = this.userRepo.create({
      nombre: dto.nombre,
      usuario: dto.usuario,
      password: hash,
      rol: dto.rol ?? Role.DOCENTE, // Por defecto DOCENTE
    });

    const savedUser = await this.userRepo.save(nuevoUsuario);

    // 🧩 Si el rol es DOCENTE, crear automáticamente su registro en la tabla docentes
    if (savedUser.rol === Role.DOCENTE) {
      const docente = this.docenteRepo.create({
        usuario: savedUser,
        nombre: dto.nombre, // Asegura que no quede vacío
        identificacion: dto.identificacion ?? '',
        contacto: dto.contacto ?? '',
        disponibilidadHoraria: dto.disponibilidadHoraria ?? '',
      });
      await this.docenteRepo.save(docente);
    }

    return savedUser;
  }

  // 🔹 Obtener todos los usuarios
  async findAll() {
    return this.userRepo.find({
      select: ['id', 'nombre', 'usuario', 'rol'],
    });
  }

  // 🔹 Obtener un usuario por ID
  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // 🔹 Actualizar un usuario
  async update(id: number, dto: Partial<RegisterDto>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.usuario && dto.usuario !== user.usuario) {
      const exists = await this.userRepo.findOne({ where: { usuario: dto.usuario } });
      if (exists) throw new BadRequestException('Ya existe un usuario con ese nombre');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  // 🔹 Eliminar un usuario
  async delete(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario eliminado correctamente' };
  }
}
