    import { IsInt, IsString, Length } from 'class-validator';

    export class CreatePostulacionDto {
        @IsInt()
        docenteId: number;

        @IsInt()
        convocatoriaId: number;

        @IsString()
        @Length(1, 120)
        programaObjetivo: string;
    }