import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS (permite llamadas desde Vite: http://localhost:5173)
  app.enableCors({
    origin: ['http://localhost:5173'], // agrega aquí otros orígenes si los usas
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor en ejecución: http://localhost:${port}/api`);
  console.log(`✅ CORS configurado para: http://localhost:5173`);
}

bootstrap();
