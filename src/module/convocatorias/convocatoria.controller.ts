import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dtos/create-convocatoria.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('convocatorias')
export class ConvocatoriaController {
    constructor(private readonly service: ConvocatoriaService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
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
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Patch(':id/cerrar')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    cerrar(@Param('id', ParseIntPipe) id: number) {
        return this.service.cerrarConvocatoria(id);
    }
    @Post(':id/postular')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.DOCENTE)
    postular(@Param('id', ParseIntPipe) id: number, @Request() req) {

        return this.service.postular(req.user.id, id);
    }
}
