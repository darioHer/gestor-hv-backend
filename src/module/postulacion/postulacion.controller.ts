import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch } from '@nestjs/common';
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

@Controller('postulaciones')
export class PostulacionController {
  constructor(private readonly service: PostulacionService) {}

  @Post()
  create(@Body() dto: CreatePostulacionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('convocatoria/:id')
  findByConvocatoria(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByConvocatoria(id);
  }

  // Nuevo endpoint
  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.service.updateEstado(id, estado);
  }

  @Get(':id/historial')
async getHistorial(@Param('id', ParseIntPipe) id: number) {
  const postulacion = await this.service.findOneWithHistorial(id);
  return postulacion.historial;
}

}
