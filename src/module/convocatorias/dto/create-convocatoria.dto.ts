import { IsDateString, IsString, Length, IsOptional } from 'class-validator';
export class CreateConvocatoriaDto {
    @IsString() @Length(1, 60) tipoVinculacion: string;

    @IsDateString() fechaInicio: string;

    @IsDateString() fechaCierre: string;

    @IsString() @Length(1, 120) programa: string;
    
    @IsOptional() @IsString() requisitos?: string;
}