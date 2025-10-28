// src/module/auth/dtos/register.dto.ts
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from 'src/module/common/enums/role.enum';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsString()
  usuario: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  rol?: Role;

  // Campos adicionales (solo aplican para DOCENTE)
  @IsOptional()
  @IsString()
  identificacion?: string;

  @IsOptional()
  @IsString()
  contacto?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  disponibilidadHoraria?: string;
}
