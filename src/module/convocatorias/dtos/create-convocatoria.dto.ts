import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateConvocatoriaDto {
    @IsString() @Length(1, 60)
    tipoVinculacion: string;

    @IsDateString()
    fechaInicio: string;

    @IsDateString()
    fechaCierre: string;

    @IsString() @Length(1, 120)
    programa: string;

    @IsOptional() @IsString()
    requisitos?: string;

    @IsOptional() @IsEnum(['abierta', 'cerrada'])
    estado?: 'abierta' | 'cerrada';
}
