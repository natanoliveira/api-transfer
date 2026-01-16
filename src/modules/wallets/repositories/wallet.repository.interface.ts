import { Wallet } from '../../../domain/entities/wallet.entity';

export interface WalletRepository {
  findByUserId(userId: number): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<Wallet>;
  createForUser(userId: number): Promise<Wallet>;
  lockByUserIds(userIds: number[]): Promise<void>;
}
