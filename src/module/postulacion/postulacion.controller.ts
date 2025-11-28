import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Query, Request, UseGuards, UseInterceptors, UploadedFile, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentoDto } from './dto/upload-documento.dto';
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { EstadoPostulacion } from '../common/enums/postulacion-estado.enum';
import { multerConfig } from 'src/config/multer.config';


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
     if (!estado) {
    throw new BadRequestException('El campo "estado" es requerido');
  }
    return this.service.updateEstado(id, estado);
  }

  @Get(':id/historial')
  @UseGuards(AuthGuard('jwt'))
  async getHistorial(@Param('id', ParseIntPipe) id: number) {
    const postulacion = await this.service.findOneWithHistorial(id);
    return postulacion.historial;
  }

  // postulacion.controller.ts - AGREGAR estos endpoints

// ✅ NUEVO: Subir documento a una postulación
@Post(':id/documentos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.DOCENTE)
@UseInterceptors(FileInterceptor('archivo', multerConfig))
async uploadDocument(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UploadDocumentoDto,
  @UploadedFile() archivo: Express.Multer.File,
  @Request() req
) {
  if (!archivo) {
    throw new BadRequestException('No se recibió ningún archivo');
  }
  
  return this.service.uploadDocument(
    id, 
    req.user.id, 
    dto.tipoDocumento, 
    archivo
  );
}

// ✅ NUEVO: Enviar postulación (validar documentos completos)
@Post(':id/enviar')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.DOCENTE)
async enviarPostulacion(
  @Param('id', ParseIntPipe) id: number,
  @Request() req
) {
  return this.service.enviarPostulacion(id, req.user.id);
}

// ✅ NUEVO: Listar documentos de una postulación
@Get(':id/documentos')
@UseGuards(AuthGuard('jwt'))
async getDocumentos(
  @Param('id', ParseIntPipe) id: number,
  @Request() req
) {
  return this.service.getDocumentosByPostulacion(id, req.user.id);
}

@Get('mias')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.DOCENTE)
getMisPostulaciones(@Request() req) {
  return this.service.findByDocente(req.user.id);
}

}
