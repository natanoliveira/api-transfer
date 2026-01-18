import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './infra/http/app-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const logger = new Logger('HTTP');
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const timestamp = new Date().toISOString();
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms - ${timestamp}`,
      );
    });
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('API de Transferencia')
    .setDescription('Documentacao da API de transferencias.')
    .setVersion('1.0')
    .setContact('Natan Oliveira', '', 'natanoliveirati@gmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 8090;
  await app.listen(port);
}

bootstrap();
