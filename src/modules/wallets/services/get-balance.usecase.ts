import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from '../../../domain/errors/domain-error';
import { CacheService } from '../../../infra/cache/cache.service';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('WalletRepository') private readonly walletRepository: WalletRepository,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) { }

  async execute(userId: string): Promise<number> {
    const cacheKey = `wallet:balance:${userId}`;
    const cached = await this.cacheService.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new DomainError('Carteira não encontrada.', 404);
    }
    const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS ?? 30);
    await this.cacheService.set(cacheKey, wallet.balance, Number.isNaN(ttlSeconds) ? 30 : ttlSeconds);
    return wallet.balance;
  }
}
