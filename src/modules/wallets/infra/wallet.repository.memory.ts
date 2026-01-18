import { Injectable } from '@nestjs/common';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class InMemoryWalletRepository implements WalletRepository {
  private readonly wallets = new Map<string, Wallet>();

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.wallets.get(userId) ?? null;
  }

  async save(wallet: Wallet): Promise<Wallet> {
    this.wallets.set(wallet.userId, wallet);
    return wallet;
  }

  async createForUser(userId: string): Promise<Wallet> {
    const wallet = new Wallet(userId, 0);
    this.wallets.set(userId, wallet);
    return wallet;
  }

  async lockByUserIds(_userIds: string[]): Promise<void> {
    return;
  }

  async findManyPaged(params: { page: number; limit: number }): Promise<{ items: Wallet[]; total: number }> {
    const items = Array.from(this.wallets.values()).sort((a, b) => a.userId.localeCompare(b.userId));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }
}
