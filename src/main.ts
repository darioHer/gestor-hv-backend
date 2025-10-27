import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './module/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS (frontend en localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // ✅ Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // ✅ Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas
      forbidNonWhitelisted: true, // lanza error si se envía algo extra
      transform: true, // convierte tipos automáticamente (string -> number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ Crear admin por defecto
  const auth = app.get(AuthService);
  await auth.seedAdmin();

  // ✅ Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor en ejecución: http://localhost:${port}/api`);
}

bootstrap();
