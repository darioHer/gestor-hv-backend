import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Controller('docentes')
export class DocenteController {
    constructor(private readonly service: DocenteService) { }

    @Post() create(@Body() dto: CreateDocenteDto) { return this.service.create(dto); }


    @Get() findAll() { return this.service.findAll(); }

    @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDocenteDto) { return this.service.update(id, dto); }


    @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}