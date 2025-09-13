import { Module, Post } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/orm.config';
import { DocenteModule } from './module/docentes/docente.module';
import { ConvocatoriaModule } from './module/convocatorias/convocatoria.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    DocenteModule,
    ConvocatoriaModule,
  
  ],
})
export class AppModule {}
