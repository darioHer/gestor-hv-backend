import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocenteController } from './docente.controller';
import { DocumentoService } from './docente.service';
import { Documento } from './entities/documento.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Carpeta donde se guardarán los archivos subidos
    }),
    TypeOrmModule.forFeature([Documento]), // 👉 Vincula la entidad con TypeORM
  ],
  controllers: [DocenteController],
  providers: [DocumentoService],
})
export class DocenteModule {}
