import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    // Módulos de Harold
    ScheduleModule.forRoot(),
    DocenteModule,
    ConvocatoriaModule,

    // Módulos de Darío
    AuthModule,
    AdminModule,
    EvaluacionModule,
  ],
})
export class AppModule {}
