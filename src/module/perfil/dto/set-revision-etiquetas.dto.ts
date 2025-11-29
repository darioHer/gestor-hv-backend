import { ArrayMaxSize, IsArray, IsString, MaxLength } from 'class-validator';

export class SetRevisionEtiquetasDto {
    @IsArray()
    @ArrayMaxSize(20)
    @IsString({ each: true })
    @MaxLength(40, { each: true })
    etiquetas: string[];
}