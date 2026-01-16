import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from '../../../domain/errors/domain-error';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(@Inject('WalletRepository') private readonly walletRepository: WalletRepository) {}

  async execute(userId: number): Promise<number> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new DomainError('Wallet not found.');
    }
    return wallet.balance;
  }
}
