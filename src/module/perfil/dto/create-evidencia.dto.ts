import { IsString, IsOptional, IsUrl, IsDateString, IsInt } from 'class-validator';

export class CreateEvidenciaDto {
    @IsInt() perfil_id: number;
    @IsString() tipo: string;
    @IsString() nombre: string;
    @IsUrl() url: string;
    @IsString() sha256: string;
    @IsOptional() @IsDateString() fechaEmision?: string;
    @IsOptional() @IsDateString() fechaVencimiento?: string;
    @IsOptional() @IsString() notaPostulante?: string;
}
