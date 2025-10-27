
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
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

    // docente: actualizar info general (NO requiere user_id en body)
    @Post('mi-perfil')
    upsertPerfil(@Body() dto: UpsertPerfilDto, @Request() req) {
        const userId = req.user.id;               // <- del JWT
        return this.service.upsertPerfilForUser(userId, dto);
    }

    // docente: añadir logros (si no mandan perfil_id, se resuelve por user)
    @Post('mi-perfil/destacados')
    addDestacado(@Body() dto: CreateDestacadoDto, @Request() req) {
        const userId = req.user.id;
        return this.service.addDestacadoForUser(userId, dto);
    }

    // docente: añadir evidencias (igual que destacados)
    @Post('mi-perfil/evidencias')
    addEvidencia(@Body() dto: CreateEvidenciaDto, @Request() req) {
        const userId = req.user.id;
        return this.service.addEvidenciaForUser(userId, dto);
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
