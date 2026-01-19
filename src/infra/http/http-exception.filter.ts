import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../domain/errors/domain-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.originalUrl;

    if (exception instanceof DomainError) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
        timestamp,
        path,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : (payload as { message?: string }).message ?? 'Erro ao processar requisicao.';
      const errors = typeof payload === 'object' && payload ? (payload as { errors?: string[] }).errors : undefined;

      this.logger.error('Erro HTTP', {
        status,
        path,
        method: request.method,
        message,
        errors,
      });

      response.status(status).json({
        statusCode: status,
        message,
        errors,
        timestamp,
        path,
      });
      return;
    }

    const error = exception as Error;
    this.logger.error('Erro interno', {
      path,
      method: request.method,
      message: error?.message ?? 'Erro desconhecido',
      stack: error?.stack,
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor.',
      timestamp,
      path,
    });
  }
}
