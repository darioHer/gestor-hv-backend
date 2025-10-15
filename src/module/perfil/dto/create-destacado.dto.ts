import { IsString, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreateDestacadoDto {
    @IsInt() perfil_id: number;
    @IsString() titulo: string;
    @IsOptional() @IsString() descripcion?: string;
    @IsOptional() @IsUrl() evidenciaUrl?: string;
}
