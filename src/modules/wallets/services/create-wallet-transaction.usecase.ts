import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from '../../../domain/errors/domain-error';
import { CacheService } from '../../../infra/cache/cache.service';
import { WalletRepository } from '../repositories/wallet.repository.interface';
import { WalletTransactionType } from '../../../domain/enums/wallet-type.enum';


@Injectable()
export class CreateWalletTransactionUseCase {
  constructor(
    @Inject('WalletRepository') private readonly walletRepository: WalletRepository,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) { }

  async execute(userId: string, type: WalletTransactionType, value: number): Promise<number> {
    if (type !== WalletTransactionType.DEPOSIT) {
      throw new DomainError('Tipo de transacao nao suportado.', 400);
    }

    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new DomainError('Carteira nao encontrada.', 404);
    }

    wallet.balance += value;
    const saved = await this.walletRepository.save(wallet);
    await this.cacheService.del(`wallet:balance:${userId}`);
    return saved.balance;
  }
}
