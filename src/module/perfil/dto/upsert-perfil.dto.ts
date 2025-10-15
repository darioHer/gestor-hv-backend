import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';

export class UpsertPerfilDto {
    @IsInt() user_id: number;
    @IsOptional() @IsString() resumen?: string;
    @IsOptional() @IsIn(['presencial', 'virtual', 'mixta']) modalidadPreferida?: string;
}
