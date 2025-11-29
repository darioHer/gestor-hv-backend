import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class UpdateDestacadoDto {
    @IsOptional()
    @IsString()
    @MaxLength(140)
    titulo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    descripcion?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(300)
    evidenciaUrl?: string;
}