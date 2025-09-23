import { IsInt, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';

export class CreateEvaluacionDto {
    @IsInt() postulacionId: number;
    @IsOptional() @IsString() comentarios?: string;

    @ValidateNested({ each: true })
    @Type(() => CreateItemDto)
    @ArrayMinSize(1)
    items: CreateItemDto[];
}
