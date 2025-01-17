import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: process.env.MAX_FILE_SIZE || '50m' }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
