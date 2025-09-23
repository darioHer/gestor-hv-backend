import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './module/auth/auth.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // seed admin
  const auth = app.get(AuthService);
  await auth.seedAdmin();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 http://localhost:${port}/api`);
}
bootstrap();
