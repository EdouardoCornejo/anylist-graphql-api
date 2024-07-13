import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  app.enableCors();
  Logger.debug('Starting the application...');
  Logger.debug(`Starting in port ${port}`);
  await app.listen(4000);
}
bootstrap();
