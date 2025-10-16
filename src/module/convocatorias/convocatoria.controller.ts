import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dtos/create-convocatoria.dto';


@Controller('convocatorias')
export class ConvocatoriaController {
    constructor(private readonly service: ConvocatoriaService) { }

    @Post()
    create(@Body() dto: CreateConvocatoriaDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query('estado') estado?: string) {
        return this.service.findAll(estado);
}

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    // Nuevo endpoint para cerrar convocatoria
    @Patch(':id/cerrar')
    cerrar(@Param('id', ParseIntPipe) id: number) {
        return this.service.cerrarConvocatoria(id);
    }
}

