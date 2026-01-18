import * as dotenv from 'dotenv';
dotenv.config();
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './infra/http/app-setup';
import { sanitize } from './infra/utils/sanitize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const logger = new Logger('HTTP');
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const timestamp = new Date().toISOString();
      const requestId = (req.headers['x-request-id'] as string | undefined) ?? undefined;
      const logPayload = {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        timestamp,
        requestId,
        params: sanitize(req.params),
        query: sanitize(req.query),
        body: sanitize(req.body),
      };
      logger.log(JSON.stringify(logPayload));
    });
    next();
  });

  const appName = process.env.APP_NAME;

  const config = new DocumentBuilder()
    .setTitle(`${appName}`)
    .setDescription('📜 Documentacao da API de transferencias.')
    .setVersion('1.0')
    .setContact('✉️ Natan Oliveira', '', 'natanoliveirati@gmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 8090;
  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
