import { Injectable } from '@nestjs/common';
import { DomainError } from '../../../domain/errors/domain-error';
import { AuthorizerService } from '../services/authorizer.service';

@Injectable()
export class MockAuthorizerService implements AuthorizerService {
  private getUrl(): string {
    return process.env.AUTHZ_URL ?? 'https://util.devi.tools/api/v2/authorize';
  }

  async authorize(payerId: string, payeeId: string, value: number): Promise<boolean> {
    const url = this.getUrl();
    const params = new URLSearchParams({
      payerId,
      payeeId,
      value: value.toString(),
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
      if (!response.ok) {
        throw new DomainError('Autorizador indisponivel.', 503);
      }
      const payload = (await response.json()) as { status?: string; data?: { authorization?: boolean } };
      if (payload.status !== 'success') {
        return false;
      }
      return payload.data?.authorization === true;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new DomainError('Autorizador indisponivel.', 503);
    }
  }
}
