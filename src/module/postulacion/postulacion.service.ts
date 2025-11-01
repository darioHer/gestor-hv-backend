import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

import { Docente } from '../docentes/entities/docente.entity';
import { Convocatoria } from '../convocatorias/entities/convocatoria.entity';
import { HistorialPostulacion } from './entities/historial-postulacion.entity';

import { NotificacionService } from '../notificaciones/noti.service';
import { TipoNotificacion } from '../notificaciones/entities/noti.entity';
import { EstadoPostulacion } from '../common/enums/postulacion-estado.enum';
import { DocumentoPostulacion } from './entities/documento-postulacion.entity';
import { DocumentType } from '../common/enums/document-type.enum';

@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion) private repo: Repository<Postulacion>,
    @InjectRepository(Docente) private docenteRepo: Repository<Docente>,
    @InjectRepository(Convocatoria)
    private convocatoriaRepo: Repository<Convocatoria>,
    @InjectRepository(HistorialPostulacion)
    private historialRepo: Repository<HistorialPostulacion>,
    @InjectRepository(DocumentoPostulacion) private documentoRepo: Repository<DocumentoPostulacion>,
    private readonly notificacionService: NotificacionService,
  ) {}

  async createForDocente(docenteId: number, dto: CreatePostulacionDto) {
    return this.createInternal({ docenteId, ...dto });
  }

  private async createInternal(dto: {
  docenteId: number;
  convocatoriaId: number;
  programaObjetivo: string;
}) {
  const docente = await this.docenteRepo.findOne({
    where: { usuario: { id: dto.docenteId } },
    relations: ['usuario'],
  });
  if (!docente) throw new NotFoundException('Docente no encontrado');

  const convocatoria = await this.convocatoriaRepo.findOne({
    where: { id: dto.convocatoriaId },
  });
  if (!convocatoria)
    throw new NotFoundException('Convocatoria no encontrada');

  const postulacion = this.repo.create({
    programaObjetivo: dto.programaObjetivo,
    docente,
    convocatoria,
    estado: EstadoPostulacion.BORRADOR,
  });

  const nueva = await this.repo.save(postulacion);

  const historialInicial = this.historialRepo.create({
    estado: EstadoPostulacion.BORRADOR,
    postulacion: nueva,
  });
  await this.historialRepo.save(historialInicial);

  // ✅ ✅ ✅ AGREGAR ESTAS LÍNEAS FALTANTES:
  
  // 1. Notificar al DOCENTE
  await this.notificacionService.crear(
    docente.id,
    `Has iniciado tu postulación a "${convocatoria.nombre}". Recuerda subir todos los documentos requeridos.`,
    TipoNotificacion.POSTULACION,
    false
  );

  // 2. Notificar al ADMIN
  await this.notificacionService.crear(
    1, // ID del admin
    `El docente ${docente.nombre} se ha postulado a la convocatoria "${convocatoria.nombre}".`,
    TipoNotificacion.ADMIN,
    true
  );

  return {
    id: nueva.id, 
    programaObjetivo: nueva.programaObjetivo,
    estado: nueva.estado,
    docente: {
      id: docente.id,
      nombre: docente.nombre,
    },
    convocatoria: {
      id: convocatoria.id,
      nombre: convocatoria.nombre,
    },
    fechaCreacion: nueva.fechaCreacion,
  };
}

  async findAll(filters?: any) {
  const postulaciones = await this.repo.find({
    relations: ['docente', 'convocatoria'],
    where: filters
  });

  return postulaciones.map(p => ({
    id: p.id,
    programaObjetivo: p.programaObjetivo,
    estado: p.estado,
    docente: {
      id: p.docente.id,
      nombre: p.docente.nombre,
      identificacion: p.docente.identificacion,
    },
    convocatoria: {
      id: p.convocatoria.id,
      nombre: p.convocatoria.nombre,
    },
    fechaCreacion: p.fechaCreacion,
    fechaEnvio: p.fechaEnvio,
  }));
}

  async findByConvocatoria(convocatoriaId: number) {
  const convocatoria = await this.convocatoriaRepo.findOne({
    where: { id: convocatoriaId },
  });
  if (!convocatoria) throw new NotFoundException('Convocatoria no encontrada');

  const postulaciones = await this.repo.find({
    where: { convocatoria: { id: convocatoriaId } },
    relations: ['docente', 'convocatoria'],
  });

  return postulaciones.map(p => ({
    id: p.id,
    programaObjetivo: p.programaObjetivo,
    estado: p.estado,
    docente: {
      id: p.docente.id,
      nombre: p.docente.nombre,
      identificacion: p.docente.identificacion,
      contacto: p.docente.contacto,
    },
    convocatoria: {
      id: p.convocatoria.id,
      nombre: p.convocatoria.nombre,
      programa: p.convocatoria.programa,
    },
    fechaCreacion: p.fechaCreacion,
    fechaEnvio: p.fechaEnvio,
  }));
}

  async findOneWithHistorial(id: number) {
  const postulacion = await this.repo.findOne({
    where: { id },
    relations: ['historial', 'docente', 'convocatoria'],
  });
  if (!postulacion) throw new NotFoundException('Postulación no encontrada');
  return {
    id: postulacion.id,
    programaObjetivo: postulacion.programaObjetivo,
    estado: postulacion.estado,
    docente: {
      id: postulacion.docente.id,
      nombre: postulacion.docente.nombre,
      identificacion: postulacion.docente.identificacion,
      contacto: postulacion.docente.contacto,
    },
    convocatoria: {
      id: postulacion.convocatoria.id,
      nombre: postulacion.convocatoria.nombre,
      programa: postulacion.convocatoria.programa,
    },
    historial: postulacion.historial, 
    fechaCreacion: postulacion.fechaCreacion,
    fechaEnvio: postulacion.fechaEnvio,
  };
}

  async updateEstado(id: number, nuevoEstado: EstadoPostulacion) {
    const postulacion = await this.repo.findOne({
      where: { id },
      relations: ['docente', 'convocatoria'],
    });
    if (!postulacion)
      throw new NotFoundException('Postulación no encontrada');

    const permitidos = Object.values(EstadoPostulacion);
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido. Usa uno de: ${permitidos.join(', ')}`,
      );
    }

    postulacion.estado = nuevoEstado;
    await this.repo.save(postulacion);

    const historial = this.historialRepo.create({
      estado: nuevoEstado,
      postulacion,
    });
    await this.historialRepo.save(historial);

    const mensaje = `El estado de tu postulación a la convocatoria "${postulacion.convocatoria.nombre}" cambió a "${nuevoEstado}".`;
    await this.notificacionService.crear(
      postulacion.docente.id,
      mensaje,
      TipoNotificacion.ACEPTACION,
    );

    return postulacion;
  }

async enviarPostulacion(id: number, usuarioId: number) {
  const postulacion = await this.validarPropiedadPostulacion(id, usuarioId);
  
  const documentosRequeridos = Object.values(DocumentType);
  
  const documentosSubidos = await this.documentoRepo.find({
    where: { postulacion: { id: postulacion.id } },
    select: ['tipoDocumento']
  });
  
  const tiposSubidos = documentosSubidos.map(doc => doc.tipoDocumento);
  const faltantes = documentosRequeridos.filter(req => !tiposSubidos.includes(req));
  
  if (faltantes.length > 0) {
    throw new BadRequestException(`Faltan documentos requeridos: ${faltantes.join(', ')}`);
  }
  
  postulacion.estado = EstadoPostulacion.ENVIADA;
  postulacion.fechaEnvio = new Date();
  await this.repo.save(postulacion);

  const historial = this.historialRepo.create({
    estado: EstadoPostulacion.ENVIADA,
    postulacion,
  });
  await this.historialRepo.save(historial);
  
  const postulacionCompleta = await this.repo.findOne({
    where: { id: postulacion.id },
    relations: ['docente', 'convocatoria']
  });

  if (!postulacionCompleta) {
    throw new NotFoundException('No se pudo cargar la postulación después del envío');
  }


  await this.notificacionService.crear(
    postulacionCompleta.docente.id,
    `¡Tu postulación a "${postulacionCompleta.convocatoria.nombre}" ha sido enviada exitosamente!`,
    TipoNotificacion.POSTULACION,
    false
  );

  await this.notificacionService.crear(
    1,
    `📋 El docente ${postulacionCompleta.docente.nombre} ha completado todos los documentos y su postulación a "${postulacionCompleta.convocatoria.nombre}" está lista para revisión.`,
    TipoNotificacion.ADMIN,
    true
  );
  
  return postulacionCompleta;
}

async uploadDocument(
  postulacionId: number,
  usuarioId: number, 
  tipoDocumento: DocumentType,
  archivo: Express.Multer.File
) {
  const postulacion = await this.validarPropiedadPostulacion(postulacionId, usuarioId);
  if (postulacion.estado !== EstadoPostulacion.BORRADOR) {
    throw new BadRequestException(
      'Solo se pueden subir documentos a postulaciones en estado BORRADOR'
    );
  }

  const documentoExistente = await this.documentoRepo.findOne({
    where: { 
      postulacion: { id: postulacionId },
      tipoDocumento: tipoDocumento 
    }
  }); 
  if (documentoExistente) {
    throw new BadRequestException(
      `Ya existe un documento de tipo ${tipoDocumento} para esta postulación`
    );
  }

  const documento = new DocumentoPostulacion();
  documento.postulacion = postulacion;
  documento.tipoDocumento = tipoDocumento;
  documento.nombreArchivo = archivo.originalname;
  documento.rutaArchivo = archivo.path;
  documento.mimeType = archivo.mimetype;
  documento.tamaño = archivo.size;
  documento.verificado = false;

  const documentoGuardado = await this.documentoRepo.save(documento);

  return {
    id: documentoGuardado.id,
    tipoDocumento: documentoGuardado.tipoDocumento,
    nombreArchivo: documentoGuardado.nombreArchivo,
    tamaño: documentoGuardado.tamaño,
    fechaSubida: documentoGuardado.fechaSubida,
  };
}

private async validarPropiedadPostulacion(postulacionId: number, usuarioId: number) {
  const postulacion = await this.repo.findOne({
    where: { id: postulacionId },
    relations: ['docente', 'docente.usuario', 'convocatoria'], 
  });

  if (!postulacion) {
    throw new NotFoundException('Postulación no encontrada');
  }

  if (postulacion.docente.usuario.id !== usuarioId) {
    throw new ForbiddenException('No tienes permisos para modificar esta postulación');
  }

  return postulacion;
}

async getDocumentosByPostulacion(postulacionId: number, usuarioId: number) {
  await this.validarPropiedadPostulacion(postulacionId, usuarioId);
  
  return this.documentoRepo.find({
    where: { postulacion: { id: postulacionId } },
    order: { fechaSubida: 'DESC' },
  });
}
}
