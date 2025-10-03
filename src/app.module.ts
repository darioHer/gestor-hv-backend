import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocenteModule } from './docente/docente.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // o postgres/mysql, según uses
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DocenteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
