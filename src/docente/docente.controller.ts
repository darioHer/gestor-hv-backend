import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { DocumentoService } from './docente.service';
import { Express } from 'express';

@ApiTags('docente')
@Controller('docente')
export class DocenteController {
  constructor(private readonly documentoService: DocumentoService) {}

  // 📂 Subida de Hoja de Vida (CV)
  @Post('upload-cv')
  @ApiOperation({ summary: 'Subir hoja de vida del docente' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(@UploadedFile() file: Express.Multer.File) {
    const nuevoDoc = await this.documentoService.create({
      nombre: file.originalname,
      descripcion: 'Hoja de vida',
      rutaArchivo: file.path,
    });

    return { message: 'Hoja de vida subida ✅', data: nuevoDoc };
  }

  // 📄 Crear documento
  @Post('documento')
  async createDocumento(@Body() body: any) {
    const nuevoDoc = await this.documentoService.create(body);
    return { message: 'Documento creado ✅', data: nuevoDoc };
  }

  // 📄 Obtener documento por ID
  @Get('documento/:id')
  async getDocumento(@Param('id') id: number) {
    const doc = await this.documentoService.findOne(id);
    return { message: 'Documento obtenido ✅', data: doc };
  }

  // 📄 Actualizar documento
  @Put('documento/:id')
  async updateDocumento(@Param('id') id: number, @Body() body: any) {
    const actualizado = await this.documentoService.update(id, body);
    return { message: 'Documento actualizado ✅', data: actualizado };
  }

  // 📄 Eliminar documento
  @Delete('documento/:id')
  async deleteDocumento(@Param('id') id: number) {
    await this.documentoService.remove(id);
    return { message: 'Documento eliminado ✅', id };
  }
}
