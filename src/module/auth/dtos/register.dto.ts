// src/module/auth/dtos/register.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from 'src/module/common/enums/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  // Este solo se usa si un admin crea usuarios manualmente
  @IsEnum(Role)
  @IsOptional()
  rol?: Role;

  // Campos obligatorios para docentes
  @IsNotEmpty()
  @IsString()
  identificacion: string;

  @IsNotEmpty()
  @IsString()
  contacto: string;

  @IsString()
  @IsOptional()
  foto?: string;

  @IsNotEmpty()
  @IsString()
  disponibilidadHoraria: string;
}
