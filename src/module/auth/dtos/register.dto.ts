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

  // Permite seleccionar un rol existente al registrarse
  @IsEnum(Role)
  @IsOptional()
  rol?: Role;
}
