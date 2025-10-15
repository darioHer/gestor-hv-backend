import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { CreateDestacadoDto } from './dto/create-destacado.dto';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpsertPerfilDto } from './dto/upsert-perfil.dto';
import { SetRevisionEtiquetasDto } from './dto/set-revision-etiquetas.dto';
import { SetRevisionMarcadorDto } from './dto/set-revision-marcador.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('perfil')
export class PerfilController {
    constructor(private readonly service: PerfilService) { }

    // docente: actualizar info general
    @Post('mi-perfil')
    upsertPerfil(@Body() dto: UpsertPerfilDto) {
        return this.service.upsertPerfil(dto);
    }

    // docente: añadir logros
    @Post('mi-perfil/destacados')
    addDestacado(@Body() dto: CreateDestacadoDto) {
        return this.service.addDestacado(dto);
    }

    // docente: añadir evidencias
    @Post('mi-perfil/evidencias')
    addEvidencia(@Body() dto: CreateEvidenciaDto) {
        return this.service.addEvidencia(dto);
    }

    // admin/revisor: ver perfil de postulante
    @Get('convocatoria/:convId/postulacion/:postId')
    getPerfilParaRevision(@Param('postId') postId: number) {
        return this.service.getPerfilParaRevision(postId);
    }

    // admin/revisor: asignar etiquetas cualitativas
    @Post('convocatoria/:convId/postulacion/:postId/etiquetas')
    setEtiquetas(@Param('postId') postId: number, @Body() dto: SetRevisionEtiquetasDto) {
        return this.service.setEtiquetas(postId, dto);
    }

    // admin/revisor: marcar favorito / observar / descartar
    @Post('convocatoria/:convId/postulacion/:postId/marcador')
    setMarcador(@Param('postId') postId: number, @Body() dto: SetRevisionMarcadorDto) {
        return this.service.setMarcador(postId, dto);
    }
}
