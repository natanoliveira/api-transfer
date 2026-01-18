import { Inject, Injectable } from '@nestjs/common';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class ListWalletsUseCase {
  constructor(@Inject('WalletRepository') private readonly walletRepository: WalletRepository) {}

  async execute(page = 1, limit = 10): Promise<{ items: Wallet[]; total: number; page: number; limit: number }> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const boundedLimit = Math.min(normalizedLimit, 100);

    const { items, total } = await this.walletRepository.findManyPaged({
      page: normalizedPage,
      limit: boundedLimit,
    });

    return {
      items,
      total,
      page: normalizedPage,
      limit: boundedLimit,
    };
  }
}
