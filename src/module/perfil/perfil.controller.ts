import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerfilService } from './perfil.service';
import { UpsertPerfilDto } from './dto/upsert-perfil.dto';
import { CreateDestacadoDto } from './dto/create-destacado.dto';
import { UpdateDestacadoDto } from './dto/update-destacado.dto';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { SetRevisionEtiquetasDto } from './dto/set-revision-etiquetas.dto';
import { SetRevisionMarcadorDto } from './dto/set-revision-marcador.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('perfil')
export class PerfilController {
    constructor(private readonly service: PerfilService) { }

    // ===== DOCENTE =====
    @Roles(Role.DOCENTE)
    @Get('mi-perfil')
    getMiPerfil(@Request() req) {
        return this.service.getPerfilForUser(req.user.id);
    }

    @Roles(Role.DOCENTE)
    @Post('mi-perfil')
    upsertPerfil(@Body() dto: UpsertPerfilDto, @Request() req) {
        return this.service.upsertPerfilForUser(req.user.id, dto);
    }

    @Roles(Role.DOCENTE)
    @Post('mi-perfil/destacados')
    addDestacado(@Body() dto: CreateDestacadoDto, @Request() req) {
        return this.service.addDestacadoForUser(req.user.id, dto);
    }

    @Roles(Role.DOCENTE)
    @Patch('mi-perfil/destacados/:id')
    updateDestacado(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDestacadoDto,
        @Request() req,
    ) {
        return this.service.updateDestacadoForUser(req.user.id, id, dto);
    }

    @Roles(Role.DOCENTE)
    @Delete('mi-perfil/destacados/:id')
    removeDestacado(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.removeDestacadoForUser(req.user.id, id);
    }

    @Roles(Role.DOCENTE)
    @Post('mi-perfil/evidencias')
    addEvidencia(@Body() dto: CreateEvidenciaDto, @Request() req) {
        return this.service.addEvidenciaForUser(req.user.id, dto);
    }

    @Roles(Role.DOCENTE)
    @Patch('mi-perfil/evidencias/:id')
    updateEvidencia(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEvidenciaDto,
        @Request() req,
    ) {
        return this.service.updateEvidenciaForUser(req.user.id, id, dto);
    }

    @Roles(Role.DOCENTE)
    @Delete('mi-perfil/evidencias/:id')
    removeEvidencia(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.removeEvidenciaForUser(req.user.id, id);
    }

    // ===== ADMIN / COMITÉ =====
    @Roles(Role.ADMIN, Role.COMITE)
    @Get('convocatoria/:convId/postulacion/:postId')
    getPerfilParaRevision(
        @Param('convId', ParseIntPipe) convId: number,
        @Param('postId', ParseIntPipe) postId: number,
    ) {
        return this.service.getPerfilParaRevision(convId, postId);
    }

    @Roles(Role.ADMIN, Role.COMITE)
    @Post('convocatoria/:convId/postulacion/:postId/etiquetas')
    setEtiquetas(
        @Param('convId', ParseIntPipe) convId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: SetRevisionEtiquetasDto,
        @Request() req,
    ) {
        return this.service.setEtiquetas(convId, postId, req.user.id, dto);
    }

    @Roles(Role.ADMIN, Role.COMITE)
    @Post('convocatoria/:convId/postulacion/:postId/marcador')
    setMarcador(
        @Param('convId', ParseIntPipe) convId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: SetRevisionMarcadorDto,
        @Request() req,
    ) {
        return this.service.setMarcador(convId, postId, req.user.id, dto);
    }
}
