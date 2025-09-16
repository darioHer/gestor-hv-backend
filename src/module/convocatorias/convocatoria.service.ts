import { Injectable, NotFoundException,  BadRequestException} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';


@Injectable()
export class ConvocatoriaService {
    constructor(@InjectRepository(Convocatoria) private repo: Repository<Convocatoria>) { }

    create(dto: CreateConvocatoriaDto) { return this.repo.save(this.repo.create(dto)); }
    findAll() { return this.repo.find(); }
    async findOne(id: number) {
        const c = await this.repo.findOne({ where: { id }, relations: { postulaciones: true } });
        if (!c) throw new NotFoundException('Convocatoria no encontrada');
        return c;
    }
    async remove(id: number) {
        const c = await this.findOne(id);
        await this.repo.remove(c);
        return { deleted: true };
    }

    async cerrarConvocatoria(id: number) {
  const convocatoria = await this.repo.findOne({ where: { id } });

  if (!convocatoria) {
    throw new NotFoundException('Convocatoria no encontrada');
  }

  // Comparar fecha de cierre con la fecha actual
  const hoy = new Date();
  const fechaCierre = new Date(convocatoria.fechaCierre);

  if (hoy < fechaCierre) {
    throw new BadRequestException('La convocatoria aún no ha alcanzado la fecha de cierre');
  }

  convocatoria.estado = 'cerrada';
  return await this.repo.save(convocatoria);
}

async update(id: number, dto: Partial<CreateConvocatoriaDto>) {
  const convocatoria = await this.findOne(id);
  Object.assign(convocatoria, dto);
  return this.repo.save(convocatoria);
}

// 👉 Automático con CRON (se ejecuta todos los días a medianoche)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cerrarConvocatoriasExpiradas() {
    const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const convocatorias = await this.repo.find({
      where: {
        fechaCierre: LessThan(hoy),
        estado: 'abierta',
      },
    });

    if (convocatorias.length > 0) {
      for (const c of convocatorias) {
        c.estado = 'cerrada';
        await this.repo.save(c);
      }
      console.log(`🔒 ${convocatorias.length} convocatorias cerradas automáticamente`);
    } 
}
 
}