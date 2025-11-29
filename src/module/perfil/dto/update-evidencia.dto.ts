import { IsDateString, IsIn, IsOptional, IsString, Length, Matches, MaxLength, IsUrl } from 'class-validator';
import { TipoEvidencia } from '../enums/tipo-evidencia.enum';

export class UpdateEvidenciaDto {
    @IsOptional()
    @IsIn(Object.values(TipoEvidencia))
    tipo?: TipoEvidencia;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    nombre?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(300)
    url?: string;

    @IsOptional()
    @IsString()
    @Length(64, 64)
    @Matches(/^[a-f0-9]{64}$/i)
    sha256?: string;

    @IsOptional()
    @IsDateString()
    fechaEmision?: string;

    @IsOptional()
    @IsDateString()
    fechaVencimiento?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    notaPostulante?: string;
}