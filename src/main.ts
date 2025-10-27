import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './module/auth/auth.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const auth = app.get(AuthService);
  await auth.seedAdmin();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 http://localhost:${port}/api`);
}
bootstrap();
