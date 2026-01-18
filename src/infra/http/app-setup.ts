import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

export function configureApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) => {
          const constraints = error.constraints ?? {};
          return Object.entries(constraints).map(([key, value]) =>
            key === 'whitelistValidation' ? `Propriedade ${error.property} nao permitida.` : value,
          );
        });
        return new BadRequestException({
          message: 'Dados invalidos.',
          errors: messages,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
}
