import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { CreateConvocatoriaDto } from './dtos/create-convocatoria.dto';

import { Postulacion } from '../postulacion/entities/postulacion.entity';
import { ConvocatoriaEstado } from '../common/enums/convocatoria-estado.enum';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectRepository(Convocatoria) private repo: Repository<Convocatoria>,
    @InjectRepository(Postulacion) private postuRepo: Repository<Postulacion>,
  ) { }

  async create(dto: CreateConvocatoriaDto) {
    if (new Date(dto.fechaCierre) < new Date(dto.fechaInicio)) {
      throw new BadRequestException('La fecha de cierre no puede ser anterior a la de inicio');
    }
    const entity = this.repo.create({
      ...dto,
      estado: dto.estado ?? ConvocatoriaEstado.ABIERTA,
    });
    return this.repo.save(entity);
  }

  findAll(estado?: string) {
    if (estado) {
      const valores = Object.values(ConvocatoriaEstado);
      if (!valores.includes(estado as ConvocatoriaEstado)) {
        throw new BadRequestException(`Estado inválido. Usa uno de: ${valores.join(', ')}`);
      }
      return this.repo.find({ where: { estado: estado as ConvocatoriaEstado } });
    }
    return this.repo.find();
  }

  async findOne(id: number) {
    const convocatoria = await this.repo.findOne({ where: { id } });
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');
    return convocatoria;
  }

  async remove(id: number) {
    const convocatoria = await this.findOne(id);
    await this.repo.remove(convocatoria);
    return { deleted: true };
  }

  async cerrarConvocatoria(id: number) {
    const convocatoria = await this.repo.findOne({ where: { id } });
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

    const hoy = new Date();
    const fechaCierre = new Date(convocatoria.fechaCierre);

    if (hoy < fechaCierre) {
      throw new BadRequestException('La convocatoria aún no ha alcanzado la fecha de cierre');
    }

    convocatoria.estado = ConvocatoriaEstado.CERRADA;
    return await this.repo.save(convocatoria);
  }

  async update(id: number, dto: Partial<CreateConvocatoriaDto>) {
    const convocatoria = await this.findOne(id);
    if (dto.fechaInicio || dto.fechaCierre) {
      const fi = new Date(dto.fechaInicio ?? convocatoria.fechaInicio);
      const fc = new Date(dto.fechaCierre ?? convocatoria.fechaCierre);
      if (fc < fi) throw new BadRequestException('La fecha de cierre no puede ser anterior a la de inicio');
    }
    Object.assign(convocatoria, dto);
    return this.repo.save(convocatoria);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cerrarConvocatoriasExpiradas() {
    const hoy = new Date().toISOString().slice(0, 10);
    const convocatorias = await this.repo.find({
      where: { fechaCierre: LessThan(hoy), estado: ConvocatoriaEstado.ABIERTA },
    });

    for (const c of convocatorias) {
      c.estado = ConvocatoriaEstado.CERRADA;
      await this.repo.save(c);
    }
    if (convocatorias.length) {
      console.log(`${convocatorias.length} convocatorias cerradas automáticamente`);
    }
  }
  async postular(docenteId: number, convocatoriaId: number) {
    const conv = await this.findOne(convocatoriaId);
    const hoy = new Date().toISOString().slice(0, 10);
    const enRango = conv.fechaInicio <= hoy && hoy <= conv.fechaCierre;
    if (conv.estado !== ConvocatoriaEstado.ABIERTA || !enRango) {
      throw new ForbiddenException('La convocatoria no está abierta para postulación');
    }

  }
}
