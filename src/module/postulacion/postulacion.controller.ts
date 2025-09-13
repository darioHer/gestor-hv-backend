import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from '../convocatorias/dto/create-postulacion.dto';


@Controller('postulaciones')
export class PostulacionController {
    constructor(private readonly service: PostulacionService) { }

    @Post()
    create(@Body() dto: CreatePostulacionDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('convocatoria/:id')
    findByConvocatoria(@Param('id', ParseIntPipe) id: number) {
        return this.service.findByConvocatoria(id);
    }
}