import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ConvocatoriaEstado } from 'src/module/common/enums/convocatoria-estado.enum';


export class CreateConvocatoriaDto {    

    @IsString()
    nombre: string;
    
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

    @IsOptional() @IsEnum(ConvocatoriaEstado)
    estado?: ConvocatoriaEstado; // default se pone en la entidad
}
