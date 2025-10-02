import { IsOptional, IsString, Length } from 'class-validator';

export class CreateDocenteDto {
    @IsString() @Length(1, 120)
    nombre: string;

    @IsString() @Length(5, 30)
    identificacion: string;

    @IsOptional() @IsString()
    contacto?: string;

    @IsOptional() @IsString()
    foto?: string;

    @IsOptional() @IsString()
    disponibilidadHoraria?: string;
}