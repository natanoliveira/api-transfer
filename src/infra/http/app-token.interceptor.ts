import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AppTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { headers: Record<string, string | string[] | undefined> }>();
    const expectedToken = process.env.APP_TOKEN;
    const headerToken = request.headers['x-app-token'];
    const token = Array.isArray(headerToken) ? headerToken[0] : headerToken;

    if (!expectedToken || token !== expectedToken) {
      throw new UnauthorizedException('Não autorizado. Token de aplicação invalido.');
    }

    return next.handle();
  }
}
