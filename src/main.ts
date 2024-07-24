import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from 'src/shared/config/log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  const port = 4000;
  app.enableCors();
  Logger.debug('Starting the application...');
  Logger.debug(`Starting in port ${port}`);
  await app.listen(4000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
bootstrap();
