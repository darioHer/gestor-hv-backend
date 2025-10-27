import { IsInt, IsString, Length } from 'class-validator';

export class CreatePostulacionDto {
    @IsInt()
    convocatoriaId: number;

    @IsString()
    @Length(1, 120)
    programaObjetivo: string;
}
