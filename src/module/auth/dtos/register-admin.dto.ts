import { IsString, Length, IsOptional, IsIn } from 'class-validator';

export class RegisterAdminDto {
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
    @IsIn(['ADMIN', 'POSTULANTE', 'COMITE']) 
    rol?: 'ADMIN' | 'POSTULANTE' | 'COMITE';
}
