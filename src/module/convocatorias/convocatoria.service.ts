import {Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Convocatoria } from './entities/convocatoria.entity';
import { CreateConvocatoriaDto } from './dtos/create-convocatoria.dto';
import { Postulacion } from '../postulacion/entities/postulacion.entity';
import { ConvocatoriaEstado } from '../common/enums/convocatoria-estado.enum';
import { NotificacionService } from '../notificaciones/noti.service';
import { Docente } from '../docentes/entities/docente.entity';
import { TipoNotificacion } from '../notificaciones/entities/noti.entity';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectRepository(Convocatoria)
    private readonly repo: Repository<Convocatoria>,
    @InjectRepository(Postulacion)
    private readonly postuRepo: Repository<Postulacion>,
    @InjectRepository(Docente)
    private readonly docenteRepo: Repository<Docente>,
    private readonly notificacionService: NotificacionService,
  ) {}

async create(dto: CreateConvocatoriaDto) {
  if (new Date(dto.fechaCierre) < new Date(dto.fechaInicio)) {
    throw new BadRequestException(
      'La fecha de cierre no puede ser anterior a la de inicio',
    );
  }

  const entity = this.repo.create({
    ...dto,
    estado: dto.estado ?? ConvocatoriaEstado.ABIERTA,
  });

  const convocatoriaGuardada = await this.repo.save(entity);
  try {
    await this.notificacionService.crearMasiva(
      `🎯 NUEVA CONVOCATORIA: "${convocatoriaGuardada.nombre}" - Programa: ${convocatoriaGuardada.programa} - Fecha cierre: ${new Date(convocatoriaGuardada.fechaCierre).toLocaleDateString()}`,
      TipoNotificacion.GENERAL
    );

    console.log(`Notificación masiva de convocatoria creada`);
  } catch (error) {
    console.error(' Error creando notificación masiva:', error);
  }

  return convocatoriaGuardada;
}

  async findAll(estado?: string) {
  const hoy = new Date();
  const actualizadas: Convocatoria[] = [];
  let convocatorias: Convocatoria[];

  if (estado && Object.values(ConvocatoriaEstado).includes(estado as ConvocatoriaEstado)) {
    convocatorias = await this.repo.find({ where: { estado: estado as ConvocatoriaEstado } });
  } else {
    convocatorias = await this.repo.find();
  }

  for (const c of convocatorias) {
    const fechaCierre = new Date(c.fechaCierre);
    if (c.estado.toUpperCase() === 'ABIERTA' && fechaCierre < hoy) {
      c.estado = ConvocatoriaEstado.CERRADA;
      actualizadas.push(c);
      await this.repo.save(c);
    }
  }

  if (actualizadas.length) {
    console.log(`${actualizadas.length} convocatorias cerradas automáticamente al consultar.`);
  }

  return convocatorias;
}

  async findOne(id: number) {
    const convocatoria = await this.repo.findOne({ where: { id } });
    if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

    const hoy = new Date();
    const fechaCierre = new Date(convocatoria.fechaCierre);

    if (
      convocatoria.estado === ConvocatoriaEstado.ABIERTA &&
      fechaCierre < hoy
    ) {
      convocatoria.estado = ConvocatoriaEstado.CERRADA;
      await this.repo.save(convocatoria);
      console.log(
        `Convocatoria ${convocatoria.id} cerrada automáticamente por fecha vencida`,
      );
    }

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
      throw new BadRequestException(
        'La convocatoria aún no ha alcanzado la fecha de cierre',
      );
    }

    convocatoria.estado = ConvocatoriaEstado.CERRADA;
    return await this.repo.save(convocatoria);
  }

  async update(id: number, dto: Partial<CreateConvocatoriaDto>) {
    const convocatoria = await this.findOne(id);

    if (dto.fechaInicio || dto.fechaCierre) {
      const fi = new Date(dto.fechaInicio ?? convocatoria.fechaInicio);
      const fc = new Date(dto.fechaCierre ?? convocatoria.fechaCierre);
      if (fc < fi) {
        throw new BadRequestException(
          'La fecha de cierre no puede ser anterior a la de inicio',
        );
      }
    }

    Object.assign(convocatoria, dto);
    return this.repo.save(convocatoria);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cerrarConvocatoriasExpiradas() {
    const hoy = new Date().toISOString().slice(0, 10); 

    const convocatorias = await this.repo.find({
      where: {
        fechaCierre: LessThan(hoy),
        estado: ConvocatoriaEstado.ABIERTA,
      },
    });

    for (const c of convocatorias) {
      c.estado = ConvocatoriaEstado.CERRADA;
      await this.repo.save(c);
    }

    if (convocatorias.length) {
      console.log(
        `${convocatorias.length} convocatorias cerradas automáticamente`,
      );
    }
  }

  async postular(docenteId: number, convocatoriaId: number) {
    const convocatoria = await this.findOne(convocatoriaId);
    const hoy = new Date();

    const fechaInicio = new Date(convocatoria.fechaInicio);
    const fechaCierre = new Date(convocatoria.fechaCierre);

    const enRango = fechaInicio <= hoy && hoy <= fechaCierre;

    if (
      convocatoria.estado !== ConvocatoriaEstado.ABIERTA ||
      !enRango
    ) {
      throw new ForbiddenException(
        'La convocatoria no está abierta para postulación',
      );
    }

    console.log(
      `Docente ${docenteId} postulándose a convocatoria ${convocatoriaId}`,
    );
  }
}
