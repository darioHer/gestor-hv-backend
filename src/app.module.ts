import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmConfig } from './config/orm.config';

// Módulos de dominio
import { DocenteModule } from './module/docentes/docente.module';
import { ConvocatoriaModule } from './module/convocatorias/convocatoria.module';

import { EvaluacionModule } from './module/evaluacion/evaluacion.module';
import { UsuariosModule } from './module/usuarios/usuarios.module';
import { AuthModule } from './module/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostulacionModule } from './module/postulacion/postulacion.module';
import { PerfilModule } from './module/perfil/perfil.module';
import { NotificacionModule } from './module/notificaciones/noti.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => typeOrmConfig(config),
    }),
    ScheduleModule.forRoot(),

    // dominios
    DocenteModule,
    ConvocatoriaModule,
    PostulacionModule,  // asegúrate de exponer service/controller aquí
    EvaluacionModule,
    UsuariosModule,
    AuthModule,
    PerfilModule,
   NotificacionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
