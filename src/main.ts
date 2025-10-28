import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './module/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global
  app.setGlobalPrefix('api');

  // Configuración global de validaciones DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en DTOs
      forbidNonWhitelisted: true, // lanza error si se envía algo extra
      transform: true, // convierte tipos (p. ej. string -> number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );


  // Puerto y mensaje de inicio
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor en ejecución: http://localhost:${port}/api`);
}

bootstrap();