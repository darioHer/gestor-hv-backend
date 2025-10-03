import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocenteModule } from './docente/docente.module';
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/orm.config';

// Tus módulos
import { DocenteModule } from './module/docentes/docente.module';
import { ConvocatoriaModule } from './module/convocatorias/convocatoria.module';
import { ScheduleModule } from '@nestjs/schedule';

// Nuevos módulos de master (Darío)
import { AuthModule } from './module/auth/auth.module';
import { AdminModule } from './module/admin/admin.module';
import { EvaluacionModule } from './module/evaluacion/evaluacion.module';
>>>>>>> master

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // o postgres/mysql, según uses
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    // Módulos de Harold
    ScheduleModule.forRoot(),
    DocenteModule,
<<<<<<< HEAD
=======
    ConvocatoriaModule,

    // Módulos de Darío
    AuthModule,
    AdminModule,
    EvaluacionModule,
>>>>>>> master
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
