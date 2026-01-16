import { Injectable } from '@nestjs/common';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class InMemoryWalletRepository implements WalletRepository {
  private readonly wallets = new Map<number, Wallet>();

  async findByUserId(userId: number): Promise<Wallet | null> {
    return this.wallets.get(userId) ?? null;
  }

  async save(wallet: Wallet): Promise<Wallet> {
    this.wallets.set(wallet.userId, wallet);
    return wallet;
  }

  async createForUser(userId: number): Promise<Wallet> {
    const wallet = new Wallet(userId, 0);
    this.wallets.set(userId, wallet);
    return wallet;
  }

  async lockByUserIds(_userIds: number[]): Promise<void> {
    return;
  }
}
