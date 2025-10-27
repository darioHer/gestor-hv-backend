import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { EstadoPostulacion } from '../common/enums/postulacion-estado.enum';


@Controller('postulaciones')
export class PostulacionController {
  constructor(private readonly service: PostulacionService) {}

  /** DOCENTE crea su propia postulación */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCENTE)
  createAsDocente(@Request() req, @Body() dto: CreatePostulacionDto) {
    return this.service.createForDocente(req.user.id, dto);
  }



  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.COMITE) 
  findAll(@Query() filters: any) {
    return this.service.findAll(filters);
  }

  @Get('convocatoria/:id')
  @UseGuards(AuthGuard('jwt'))
  findByConvocatoria(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByConvocatoria(id);
  }

  @Patch(':id/estado')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.COMITE)
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: EstadoPostulacion,
  ) {
    return this.service.updateEstado(id, estado);
  }

  @Get(':id/historial')
  @UseGuards(AuthGuard('jwt'))
  async getHistorial(@Param('id', ParseIntPipe) id: number) {
    const postulacion = await this.service.findOneWithHistorial(id);
    return postulacion.historial;
  }
}
