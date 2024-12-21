import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Custom context name

  app.use(helmet()); // Enable security headers

  app.enableCors({
    origin: process.env.ORIGIN ?? 'http://localhost:8080',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties from the request body
      forbidNonWhitelisted: true, // Throw an error if unknown properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.listen(process.env.PORT ?? 3000).then(() => {
    logger.log('Application is running on: http://localhost:3000'); // Info-level log
  });
}
bootstrap();
