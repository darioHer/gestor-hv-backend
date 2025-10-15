import { IsArray, IsString } from 'class-validator';

export class SetRevisionEtiquetasDto {
    @IsArray() @IsString({ each: true }) etiquetas: string[];
}
