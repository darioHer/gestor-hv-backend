import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ModalidadPreferida } from '../enums/modalidad.enum';

export class UpsertPerfilDto {
    @IsOptional()
    @IsString()
    @MaxLength(160)
    resumen?: string;

    @IsOptional()
    @IsIn(Object.values(ModalidadPreferida))
    modalidadPreferida?: ModalidadPreferida;
}