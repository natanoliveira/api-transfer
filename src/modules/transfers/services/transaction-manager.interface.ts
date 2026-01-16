import { TransferRepository } from '../repositories/transfer.repository.interface';
import { WalletRepository } from '../../wallets/repositories/wallet.repository.interface';

export interface TransactionContext {
  walletRepository: WalletRepository;
  transferRepository: TransferRepository;
}

export interface TransactionManager {
  runInTransaction<T>(fn: (ctx: TransactionContext) => Promise<T>): Promise<T>;
}
