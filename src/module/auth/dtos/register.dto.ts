import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
    @IsString()
    @Length(3, 80)
    nombre: string;

    @IsString()
    @Length(3, 30)
    usuario: string;

    @IsString()
    @Length(6, 100)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    rol?: Role; // ADMIN | DOCENTE | COMITE
}
