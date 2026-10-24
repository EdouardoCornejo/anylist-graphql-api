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
  // Global pipes must be registered before listen() or GraphQL resolvers skip them.
  // No forbidNonWhitelisted: resolvers combine several @Args() classes that each
  // receive every argument, and the GraphQL schema already rejects unknown ones.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
