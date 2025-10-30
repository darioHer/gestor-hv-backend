// src/module/docentes/docente.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
;

@Controller('docentes')
export class DocenteController {
    constructor(private readonly service: DocenteService) { }

    // Crear docente: normalmente ADMIN/COMITE
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    create(@Body() dto: CreateDocenteDto) {
        return this.service.create(dto);
    }

    // Listar docentes: ADMIN/COMITE
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    findAll() {
        return this.service.findAll();
    }

    // Ver un docente por id: ADMIN/COMITE
    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    // (Opcional) Perfil propio del docente logueado
    @Get('me/profile')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.DOCENTE)
    me(@Request() req) {
        return this.service.findOne(req.user.id);
    }

    // Actualizar: ADMIN/COMITE
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDocenteDto) {
        return this.service.update(id, dto);
    }

    // Eliminar: ADMIN/COMITE
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.COMITE)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
