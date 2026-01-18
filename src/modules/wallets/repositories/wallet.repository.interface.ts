import { Wallet } from '../../../domain/entities/wallet.entity';

export interface WalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<Wallet>;
  createForUser(userId: string): Promise<Wallet>;
  lockByUserIds(userIds: string[]): Promise<void>;
  findManyPaged(params: { page: number; limit: number }): Promise<{ items: Wallet[]; total: number }>;
}
