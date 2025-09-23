import { IsNumber, IsString, Length } from 'class-validator';
export class CreateItemDto {
    @IsString() @Length(1, 120) descripcion: string;
    @IsNumber() peso: number;
    @IsNumber() notaAsignada: number;
}
